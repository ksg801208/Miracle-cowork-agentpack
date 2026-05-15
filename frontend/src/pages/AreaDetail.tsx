import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { areasApi } from '../services/api';
import type { Area, Agent } from '../types';
import AgentCard from '../components/AgentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { AREA_ICONS } from '../utils';

export default function AreaDetail() {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const [area, setArea] = useState<Area | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!areaId) return;
    Promise.all([areasApi.getById(areaId), areasApi.getAgents(areaId)])
      .then(([a, ag]) => { setArea(a); setAgents(ag); })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [areaId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!area) return null;

  const filtered = agents.filter(a =>
    a.name_ko.includes(search) || a.description.includes(search)
  );

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900">대시보드</button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{area.name_ko}</span>
      </nav>

      {/* Area Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: area.color + '20' }}
          >
            {AREA_ICONS[area.icon_key] ?? '📁'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{area.name_ko}</h1>
            <p className="text-sm text-gray-500 mt-1">{area.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm font-medium" style={{ color: area.color }}>
                Agent {area.agent_count}개
              </span>
              <span className="text-sm text-gray-400">{area.name_en}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Agent Grid */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-base font-semibold text-gray-900">Agent 목록</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Agent 검색..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">검색 결과가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(agent => <AgentCard key={agent.agent_id} agent={agent} />)}
        </div>
      )}
    </div>
  );
}
