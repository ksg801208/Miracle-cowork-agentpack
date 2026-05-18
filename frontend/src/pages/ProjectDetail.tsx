import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi, documentsApi } from '../services/api';
import type { Project, AgentRun, Document } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'runs' | 'docs'>('runs');
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      projectsApi.getById(projectId),
      projectsApi.getAgentRuns(projectId),
      projectsApi.getDocuments(projectId),
    ])
      .then(([p, r, d]) => { setProject(p); setRuns(r); setDocs(d); })
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [projectId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/projects')} className="hover:text-gray-900">프로젝트</button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{project.name}</span>
      </nav>

      {/* Project Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-gray-500">{project.description ?? '설명 없음'}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">
            Agent 실행 →
          </button>
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-400">유형</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{project.project_type ?? '일반'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">실행 이력</div>
            <div className="text-sm font-medium text-blue-600 mt-0.5">{runs.length}건</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">저장 문서</div>
            <div className="text-sm font-medium text-blue-600 mt-0.5">{docs.length}건</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">생성일</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(project.created_at)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {([['runs', `실행 이력 (${runs.length})`], ['docs', `저장 문서 (${docs.length})`]] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'runs' && (
        <div className="space-y-3">
          {runs.length === 0 ? (
            <div className="card text-center py-12 text-sm text-gray-500">
              아직 실행 이력이 없습니다. Agent를 실행하고 이 프로젝트에 연결하세요.
            </div>
          ) : (
            runs.map(run => (
              <div key={run.run_id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={run.status} />
                      <span className="text-xs text-gray-500 font-mono">{run.agent_id}</span>
                    </div>
                    <p className="text-xs text-gray-400">{formatDate(run.requested_at)}</p>
                  </div>
                  {run.output_text && (
                    <button
                      onClick={() => setSelectedRun(selectedRun?.run_id === run.run_id ? null : run)}
                      className="btn-secondary text-xs py-1 px-2.5 flex-shrink-0"
                    >
                      {selectedRun?.run_id === run.run_id ? '접기' : '결과 보기'}
                    </button>
                  )}
                </div>
                {selectedRun?.run_id === run.run_id && run.output_text && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                      {run.output_text}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-3">
          {docs.length === 0 ? (
            <div className="card text-center py-12 text-sm text-gray-500">
              저장된 문서가 없습니다. Agent 실행 후 "저장" 버튼으로 문서를 저장하세요.
            </div>
          ) : (
            docs.map(doc => (
              <div key={doc.document_id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => navigate(`/documents/${doc.document_id}`)}
                    className="flex-1 text-left min-w-0"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {doc.document_type && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                          {doc.document_type}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => navigator.clipboard.writeText(doc.content_markdown ?? '')}
                      className="btn-secondary text-xs py-1 px-2"
                    >
                      복사
                    </button>
                    <button
                      onClick={() => documentsApi.download(doc.document_id, doc.title)}
                      className="btn-secondary text-xs py-1 px-2"
                    >
                      ↓ MD
                    </button>
                    <button
                      onClick={() => navigate(`/documents/${doc.document_id}`)}
                      className="btn-secondary text-xs py-1 px-2"
                    >
                      열기
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
