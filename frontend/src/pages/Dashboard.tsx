import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { areasApi, projectsApi } from '../services/api';
import type { Area, Project } from '../types';
import AreaCard from '../components/AreaCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([areasApi.getAll(), projectsApi.getAll()])
      .then(([a, p]) => { setAreas(a); setProjects(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Agent 영역을 불러오는 중..." />;

  const totalAgents = areas.reduce((s, a) => s + a.agent_count, 0);

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Miracle-Cowork AgentPack</h1>
        <p className="text-gray-500 mt-1">기업형 AI Agent 플랫폼 — 사무업무 자동화의 새로운 기준</p>
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{areas.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">업무 영역</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalAgents}</div>
            <div className="text-xs text-gray-500 mt-0.5">AI Agent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">프로젝트</div>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">8개 업무 영역</h2>
          <span className="text-sm text-gray-400">클릭하여 Agent 목록 확인</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map(area => <AreaCard key={area.area_id} area={area} />)}
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 프로젝트</h2>
          <button onClick={() => navigate('/projects')} className="text-sm text-blue-600 hover:underline">
            전체 보기 →
          </button>
        </div>
        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-3xl mb-3">📂</div>
            <p className="text-gray-500 text-sm mb-4">아직 프로젝트가 없습니다</p>
            <button onClick={() => navigate('/projects')} className="btn-primary text-sm">
              첫 프로젝트 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="card cursor-pointer hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{p.description ?? '설명 없음'}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.status === 'active' ? '활성' : p.status}
                  </span>
                  <span className="text-xs text-gray-400">{p.project_type ?? '일반'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
