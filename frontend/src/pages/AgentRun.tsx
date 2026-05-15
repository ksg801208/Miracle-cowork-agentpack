import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agentsApi, areasApi, projectsApi, documentsApi } from '../services/api';
import type { Agent, Area, Project, AgentRun as AgentRunType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import RunResultViewer from '../components/RunResultViewer';
import StatusBadge from '../components/StatusBadge';
import { OUTPUT_TYPE_LABELS, AREA_ICONS } from '../utils';

export default function AgentRunPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedProject, setSelectedProject] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AgentRunType | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!agentId) return;
    Promise.all([agentsApi.getById(agentId), projectsApi.getAll()])
      .then(([ag, ps]) => {
        setAgent(ag);
        setProjects(ps);
        return areasApi.getById(ag.area_id);
      })
      .then(a => setArea(a))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [agentId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!agent) return null;

  const schema = agent.input_schema ?? {};

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleRun() {
    setError('');

    const requiredFields = Object.entries(schema).filter(([, f]) => f.required);
    const missingRequired = requiredFields.filter(([k]) => !formData[k]?.trim());
    if (missingRequired.length > 0) {
      setError(`필수 입력 항목을 채워주세요: ${missingRequired.map(([, f]) => f.label).join(', ')}`);
      return;
    }

    setRunning(true);
    setResult(null);
    setSaved(false);
    const currentAgent = agent!;
    try {
      const run = await agentsApi.run(currentAgent.agent_id, {
        agent_id: currentAgent.agent_id,
        area_id: currentAgent.area_id,
        project_id: selectedProject || undefined,
        input_payload: formData,
      });
      setResult(run);
    } catch {
      setError('Agent 실행 중 오류가 발생했습니다. 백엔드 서버를 확인해주세요.');
    } finally {
      setRunning(false);
    }
  }

  async function handleSave() {
    if (!result?.output_text) return;
    try {
      await documentsApi.create({
        project_id: selectedProject || undefined,
        title: `[${agent!.name_ko}] ${new Date().toLocaleString('ko-KR')}`,
        document_type: agent!.output_type,
        content_markdown: result.output_text,
        agent_run_id: result.run_id,
      });
      setSaved(true);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  async function handleCopy() {
    if (!result?.output_text) return;
    await navigator.clipboard.writeText(result.output_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900">대시보드</button>
        {area && (
          <>
            <span>/</span>
            <button onClick={() => navigate(`/areas/${area.area_id}`)} className="hover:text-gray-900">
              {area.name_ko}
            </button>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium">{agent.name_ko}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-1 space-y-4">
          {/* Agent Info */}
          <div className="card">
            <div className="flex items-start gap-3 mb-4">
              {area && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: area.color + '20' }}
                >
                  {AREA_ICONS[area.icon_key] ?? '📁'}
                </div>
              )}
              <div>
                <h1 className="font-bold text-gray-900 text-base">{agent.name_ko}</h1>
                <span className="text-xs text-gray-400">{OUTPUT_TYPE_LABELS[agent.output_type] ?? agent.output_type} 생성</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{agent.description}</p>
          </div>

          {/* Project Select */}
          <div className="card">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              프로젝트 연결 <span className="text-gray-400">(선택)</span>
            </label>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">프로젝트 선택 안 함</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Input Form */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm">입력 정보</h2>
            {Object.entries(schema).map(([key, field]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formData[key] ?? ''}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={field.placeholder ?? ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[key] ?? ''}
                    onChange={e => handleChange(key, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {(field.options ?? []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[key] ?? ''}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={field.placeholder ?? ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={running}
              className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
            >
              {running ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  실행 중...
                </>
              ) : (
                `${agent.name_ko} 실행`
              )}
            </button>
          </div>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={result.status} />
                {saved && <span className="text-xs text-green-600 font-medium">✓ 저장됨</span>}
                {copied && <span className="text-xs text-blue-600 font-medium">✓ 복사됨</span>}
              </div>
              <RunResultViewer
                content={result.output_text ?? ''}
                onCopy={handleCopy}
                onSave={!saved ? handleSave : undefined}
              />
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">결과가 여기에 표시됩니다</h3>
              <p className="text-sm text-gray-500">
                왼쪽 폼에 정보를 입력하고<br />
                "{agent.name_ko} 실행" 버튼을 클릭하세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
