import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { areasApi } from '../services/api';
import type { Area, Agent } from '../types';
import AgentCard from '../components/AgentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { AREA_ICONS } from '../utils';

type WorkflowStatus = 'active' | 'planned' | 'pending';
const GOVT_RD_WORKFLOW: { step: number; name_ko: string; description: string; status: WorkflowStatus; status_label: string | null }[] = [
  { step: 1, name_ko: '정부지원사업 탐색', description: '공고 DB 연동으로 적합한 지원사업 자동 탐색 및 추천', status: 'planned', status_label: 'v1.2 예정' },
  { step: 2, name_ko: '공고문 분석',        description: '공고문 핵심 요건, 지원 자격, 평가 기준 자동 분석',    status: 'active',  status_label: null },
  { step: 3, name_ko: 'Local RAG',          description: '사내 기술문서·과거 과제를 RAG로 연결해 맞춤형 컨텍스트 제공', status: 'pending', status_label: '준비 중' },
  { step: 4, name_ko: '사업계획서 작성',    description: '과제 목표, 필요성, 추진전략 중심의 사업계획서 초안 생성', status: 'active', status_label: null },
  { step: 5, name_ko: '연구개발계획서 작성', description: '기술개발 내용, 방법론, 단계별 목표 기술',           status: 'active',  status_label: null },
  { step: 6, name_ko: 'LLM 검증',           description: 'LLM 기반 문서 완성도·일관성·논리성 자동 검증',      status: 'active',  status_label: null },
  { step: 7, name_ko: '평가 최적화',        description: '평가 항목별 대응 근거 보강 및 점수 최적화 전략',     status: 'active',  status_label: null },
  { step: 8, name_ko: '발표자료 작성',      description: '발표 심사용 PPT 구성 및 핵심 메시지 자동 생성',     status: 'planned', status_label: 'v1.2 예정' },
];

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

      {/* 8단계 대표 워크플로우 (AI 정부R&D 컨설턴트 플랫폼) */}
      {area.area_id === 'government_rd' && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">대표 8단계 AI 컨설팅 워크플로우</h2>
            <span className="text-xs text-gray-400">회색 단계는 v1.2에서 추가 예정</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GOVT_RD_WORKFLOW.map((s) => {
              const isActive = s.status === 'active';
              return (
                <div
                  key={s.step}
                  className={`flex gap-3 p-3 rounded-lg border ${isActive ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200 opacity-70'}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white flex-none"
                    style={{ backgroundColor: isActive ? area.color : '#9CA3AF' }}
                  >
                    {s.step}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{s.name_ko}</span>
                      {s.status_label && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.status === 'planned' ? 'bg-gray-200 text-gray-500' : 'bg-yellow-100 text-yellow-700'}`}>
                          {s.status_label}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{s.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
