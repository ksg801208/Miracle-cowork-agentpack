import axios from 'axios';
import type { Area, Agent, Project, AgentRun, Document, Task } from '../types';

const http = axios.create({ baseURL: '/api' });

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
    title: string;
    document_type?: string;
    content_markdown: string;
    agent_run_id?: string;
  }): Promise<Document> => http.post('/documents', data).then(r => r.data),
};

export const tasksApi = {
  create: (data: { project_id?: string; title: string; description?: string; priority?: string }): Promise<Task> =>
    http.post('/tasks', data).then(r => r.data),
};
