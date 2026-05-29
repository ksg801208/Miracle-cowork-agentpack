import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { agentsApi, areasApi, projectsApi, documentsApi } from '../services/api';
import type { Agent, Area, Project, AgentRun as AgentRunType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import RunResultViewer from '../components/RunResultViewer';
import StatusBadge from '../components/StatusBadge';
import { OUTPUT_TYPE_LABELS, AREA_ICONS } from '../utils';

// ── government_announcement_analysis Agent 전용 ───────────────────────────────
// 정부지원사업 탐색 / 관심 공고함에서 location.state로 전달되는 선택 공고 정보 타입
interface SelectedProgram {
  program_name: string;
  source: string;
  source_portal_url?: string;
  announcement_url?: string;
  organization: string;
  fit_score: number;
  support_amount: string;
  deadline: string;
  recommendation_reason: string;
  required_documents: string[];
  application_notes: string;
}

function calcProgramDDay(deadline: string): number {
  const [y, m, d] = deadline.split('.').map(Number);
  const deadlineDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function safeProgramUrl(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('https://') || url.startsWith('http://') ? url : null;
}

// announcement_text 필드용 구조화 텍스트 생성
function buildPrefillText(p: SelectedProgram, dDay: number): string {
  const ddayStr = dDay < 0 ? '마감' : dDay === 0 ? 'D-Day' : `D-${dDay}`;
  return [
    '[선택 공고 정보]',
    '',
    `사업명: ${p.program_name}`,
    `출처: ${p.source}`,
    `주관기관: ${p.organization}`,
    `지원금 규모: ${p.support_amount}`,
    `마감일: ${p.deadline} (${ddayStr})`,
    `적합도 점수: ${p.fit_score}점`,
    '',
    '[추천 사유]',
    p.recommendation_reason,
    '',
    '[준비자료]',
    ...p.required_documents.map(d => `• ${d}`),
    '',
    '[신청 유의사항]',
    p.application_notes,
    '',
    '[링크]',
    `출처 사이트: ${p.source_portal_url ?? '-'}`,
    `공고문 원문: ${p.announcement_url ?? '-'}`,
  ].join('\n');
}

// government_announcement_analysis input_schema 필드 기준 prefill 데이터 생성
// 필드 ID: config/agents.json → government_announcement_analysis.input_schema
function buildPrefillData(p: SelectedProgram, dDay: number): Record<string, string> {
  return {
    announcement_title:  p.program_name,             // 공고명 (text, required)
    announcement_text:   buildPrefillText(p, dDay),  // 공고문 내용 (textarea, required)
    support_program:     p.source,                   // 지원사업 유형 (text, optional)
    submission_deadline: p.deadline,                 // 접수 마감일시 (text, optional)
    // organization_type: select 필드 → 자동 매핑 불가, 사용자가 직접 선택
  };
}

export default function AgentRunPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate    = useNavigate();
  const location    = useLocation();

  // ── 상태 ──────────────────────────────────────────────────────
  const [agent, setAgent]               = useState<Agent | null>(null);
  const [area,  setArea]                = useState<Area | null>(null);
  const [projects, setProjects]         = useState<Project[]>([]);
  const [formData, setFormData]         = useState<Record<string, string>>({});
  const [selectedProject, setSelectedProject] = useState('');
  const [running, setRunning]           = useState(false);
  const [result, setResult]             = useState<AgentRunType | null>(null);
  const [saved, setSaved]               = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [copied, setCopied]             = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // ── 자동 반영 전용 (government_announcement_analysis) ─────────
  const prefillApplied = useRef(false);
  const [prefillDone, setPrefillDone] = useState(false);

  // selectedProgram: 훅 이전에 선언해야 useEffect deps에 사용 가능
  // agentId + location.state만 필요하므로 loading 전에 안전하게 파생 가능
  const selectedProgram: SelectedProgram | null =
    agentId === 'government_announcement_analysis'
      ? ((location.state as { selectedProgram?: SelectedProgram } | null)?.selectedProgram ?? null)
      : null;

  // ── 데이터 로딩 ───────────────────────────────────────────────
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

  // ── 선택 공고 정보 → 입력폼 1회 자동 반영 ────────────────────
  // government_announcement_analysis Agent에서 selectedProgram이 있을 때만 동작
  // loading 완료 후 1회만 실행, 이후 사용자 입력 보존
  useEffect(() => {
    if (loading) return;
    if (!selectedProgram) return;
    if (prefillApplied.current) return;
    const dDay = calcProgramDDay(selectedProgram.deadline);
    setFormData(buildPrefillData(selectedProgram, dDay));
    prefillApplied.current = true;
    setPrefillDone(true);
  }, [loading, selectedProgram]);

  // ── Early returns ─────────────────────────────────────────────
  if (loading) return <LoadingSpinner />;
  if (!agent) return null;

  const schema = agent.input_schema ?? {};

  const programDDay      = selectedProgram ? calcProgramDDay(selectedProgram.deadline) : 0;
  const programAnnoUrl   = selectedProgram ? safeProgramUrl(selectedProgram.announcement_url) : null;
  const programPortalUrl = selectedProgram ? safeProgramUrl(selectedProgram.source_portal_url) : null;

  // ── 이벤트 핸들러 ─────────────────────────────────────────────
  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // "선택 공고 정보 다시 반영" 버튼 핸들러 (selectedProgram 있을 때만 표시)
  function handleReprefill() {
    if (!selectedProgram) return;
    const dDay = calcProgramDDay(selectedProgram.deadline);
    setFormData(buildPrefillData(selectedProgram, dDay));
    setPrefillDone(true);
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
    setSaveError('');
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
    setSaveError('');
    try {
      await documentsApi.create({
        project_id: selectedProject || undefined,
        agent_id: agent!.agent_id,
        area_id: agent!.area_id,
        title: `[${agent!.name_ko}] ${new Date().toLocaleString('ko-KR')}`,
        document_type: agent!.output_type,
        content_markdown: result.output_text,
        agent_run_id: result.run_id,
      });
      setSaved(true);
    } catch {
      setSaveError('저장 중 오류가 발생했습니다. 로그인 상태를 확인하세요.');
    }
  }

  async function handleCopy() {
    if (!result?.output_text) return;
    await navigator.clipboard.writeText(result.output_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── 렌더링 ───────────────────────────────────────────────────
  return (
    <div className="max-w-4xl">
      {/* 브레드크럼 */}
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

      {/* 선택 공고 정보 요약 박스 — government_announcement_analysis Agent 전용
          location.state.selectedProgram이 없으면 이 블록은 렌더링되지 않는다 */}
      {selectedProgram && (
        <div className="card mb-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">선택 공고 정보</h2>
            <span className="text-[11px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
              공고문 분석 연계
            </span>
          </div>

          {/* 사업명 + 출처 + 주관기관 + 적합도 */}
          <h3 className="text-sm font-bold text-gray-900 mb-1.5">{selectedProgram.program_name}</h3>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {selectedProgram.source}
            </span>
            <span className="text-[11px] text-gray-500">{selectedProgram.organization}</span>
            <span className="text-[11px] font-bold text-blue-600">{selectedProgram.fit_score}점</span>
          </div>

          {/* 지원금 + 마감일 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-400 mb-0.5">💰 지원금 규모</p>
              <p className="text-xs font-semibold text-gray-800">{selectedProgram.support_amount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-400 mb-0.5">📅 마감일</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-semibold text-gray-800">{selectedProgram.deadline}</p>
                {programDDay < 0   && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">마감</span>}
                {programDDay === 0  && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">D-Day</span>}
                {programDDay > 0  && programDDay <= 7  && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-bold">D-{programDDay}</span>}
                {programDDay > 7  && programDDay <= 30 && <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">D-{programDDay}</span>}
                {programDDay > 30  && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">D-{programDDay}</span>}
              </div>
            </div>
          </div>

          {/* 추천 사유 */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-[11px] font-semibold text-blue-700 mb-1">💬 추천 사유</p>
            <p className="text-xs text-blue-900 leading-relaxed">{selectedProgram.recommendation_reason}</p>
          </div>

          {/* 준비자료 */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-gray-600 mb-1.5">📋 준비자료</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedProgram.required_documents.map((doc, i) => (
                <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{doc}</span>
              ))}
            </div>
          </div>

          {/* 신청 유의사항 */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
            <p className="text-[11px] font-semibold text-amber-700 mb-1">⚠️ 신청 유의사항</p>
            <p className="text-xs text-amber-900 leading-relaxed">{selectedProgram.application_notes}</p>
          </div>

          {/* 외부 링크 */}
          {(programAnnoUrl || programPortalUrl) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {programAnnoUrl && (
                <a href={programAnnoUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1">
                  공고문 원문 보기 <span className="text-blue-400">↗</span>
                </a>
              )}
              {programPortalUrl && (
                <a href={programPortalUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                  출처 사이트 보기 <span className="text-gray-400">↗</span>
                </a>
              )}
            </div>
          )}

          {/* 자동 반영 상태 + 안내 문구 */}
          <div className="bg-gray-50 rounded-lg px-3 py-2.5 space-y-2">
            {prefillDone ? (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ 입력값 자동 반영 완료
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  선택 공고 정보가 공고문 분석 입력값에 자동 반영되었습니다. 필요 시 아래 입력값을 보완한 후 Agent를 실행하세요.
                </p>
                <button
                  type="button"
                  onClick={handleReprefill}
                  className="text-[11px] text-blue-600 hover:text-blue-700 underline"
                >
                  선택 공고 정보 다시 반영
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed">
                위 공고 정보를 기준으로 공고문 분석을 진행할 수 있습니다. 필요 시 아래 입력값을 보완한 후 Agent를 실행하세요.
              </p>
            )}
          </div>
        </div>
      )}

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
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={result.status} />
                {saved && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">✓ 저장 완료</span>}
                {copied && <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">✓ 복사됨</span>}
                {saveError && <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">{saveError}</span>}
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
