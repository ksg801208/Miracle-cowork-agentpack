import axios from 'axios';
import type { Area, Agent, Project, AgentRun, Document, Task, User } from '../types';
import { getStoredToken } from '../contexts/AuthContext';

const http = axios.create({ baseURL: '/api' });

// 모든 요청에 Authorization 헤더 자동 첨부
http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 응답 시 로컬스토리지 초기화 후 로그인 페이지로 리다이렉트
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('miracle_token');
      localStorage.removeItem('miracle_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    http.post<{ access_token: string; token_type: string; user: User }>('/auth/login', { email, password }).then(r => r.data),
  me: () =>
    http.get<User>('/auth/me').then(r => r.data),
  logout: () =>
    http.post('/auth/logout').then(r => r.data),
};

export const areasApi = {
  getAll: (): Promise<Area[]> => http.get('/areas').then(r => r.data),
  getById: (id: string): Promise<Area> => http.get(`/areas/${id}`).then(r => r.data),
  getAgents: (id: string): Promise<Agent[]> => http.get(`/areas/${id}/agents`).then(r => r.data),
};

export const agentsApi = {
  getAll: (): Promise<Agent[]> => http.get('/agents').then(r => r.data),
  getById: (id: string): Promise<Agent> => http.get(`/agents/${id}`).then(r => r.data),
  run: (agentId: string, payload: {
    project_id?: string;
    agent_id: string;
    area_id: string;
    input_payload?: Record<string, string>;
  }): Promise<AgentRun> => http.post(`/agents/${agentId}/run`, payload).then(r => r.data),
};

export const projectsApi = {
  create: (data: { name: string; description?: string; project_type?: string }): Promise<Project> =>
    http.post('/projects', data).then(r => r.data),
  getAll: (): Promise<Project[]> => http.get('/projects').then(r => r.data),
  getById: (id: string): Promise<Project> => http.get(`/projects/${id}`).then(r => r.data),
  getAgentRuns: (id: string): Promise<AgentRun[]> => http.get(`/projects/${id}/agent-runs`).then(r => r.data),
  getDocuments: (id: string): Promise<Document[]> => http.get(`/projects/${id}/documents`).then(r => r.data),
  getTasks: (id: string): Promise<Task[]> => http.get(`/projects/${id}/tasks`).then(r => r.data),
};

export const documentsApi = {
  create: (data: {
    project_id?: string;
    agent_id?: string;
    area_id?: string;
    title: string;
    document_type?: string;
    content_markdown: string;
    agent_run_id?: string;
  }): Promise<Document> => http.post('/documents', data).then(r => r.data),

  getById: (documentId: string): Promise<Document> =>
    http.get(`/documents/${documentId}`).then(r => r.data),

  getDownloadUrl: (documentId: string): string =>
    `/api/documents/${documentId}/download`,

  download: async (documentId: string, title: string): Promise<void> => {
    const token = getStoredToken();
    const res = await fetch(`/api/documents/${documentId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('다운로드 실패');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  delete: (documentId: string): Promise<void> =>
    http.delete(`/documents/${documentId}`).then(() => undefined),
};

export const tasksApi = {
  create: (data: { project_id?: string; title: string; description?: string; priority?: string }): Promise<Task> =>
    http.post('/tasks', data).then(r => r.data),
};
