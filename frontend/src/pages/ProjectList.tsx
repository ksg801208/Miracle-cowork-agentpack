import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils';

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', project_type: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    projectsApi.getAll().then(setProjects).finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const p = await projectsApi.create(form);
      setProjects(prev => [p, ...prev]);
      setForm({ name: '', description: '', project_type: '' });
      setShowForm(false);
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">프로젝트</h1>
          <p className="text-sm text-gray-500 mt-0.5">Agent 실행 결과를 프로젝트별로 관리합니다</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          + 새 프로젝트
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">새 프로젝트 만들기</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">프로젝트명 *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="예) 2024 정부 R&D 과제 신청"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="프로젝트 목적 및 설명"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">유형</label>
              <select
                value={form.project_type}
                onChange={e => setForm(p => ({ ...p, project_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택 안 함</option>
                <option value="government_rd">AI 정부R&D 컨설턴트</option>
                <option value="planning">기획/전략</option>
                <option value="development">소프트웨어 개발</option>
                <option value="sales">영업/제안</option>
                <option value="general">일반</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleCreate} disabled={creating || !form.name.trim()} className="btn-primary text-sm py-2 px-4">
                {creating ? '생성 중...' : '만들기'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-4">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">📂</div>
          <p className="text-gray-500 text-sm">아직 프로젝트가 없습니다</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm mt-4">
            첫 프로젝트 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="card cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{p.description ?? '설명 없음'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-400">{p.project_type ?? '일반'}</div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(p.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
