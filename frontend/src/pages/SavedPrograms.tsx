import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SavedProgramEntry, SavedProgramStatus } from '../data/programSearchMockData';

const SAVED_KEY = 'savedPrograms';

// ── 상태 설정 ──────────────────────────────────────────────────
const STATUS_CONFIG: Record<SavedProgramStatus, { label: string; activeCls: string; dotCls: string }> = {
  saved:         { label: '관심',     activeCls: 'bg-blue-100 text-blue-700 border-blue-200',     dotCls: 'bg-blue-500'   },
  reviewing:     { label: '검토중',   activeCls: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotCls: 'bg-yellow-500' },
  analysis_done: { label: '분석완료', activeCls: 'bg-green-100 text-green-700 border-green-200',   dotCls: 'bg-green-500'  },
  excluded:      { label: '제외',     activeCls: 'bg-gray-100 text-gray-500 border-gray-200',      dotCls: 'bg-gray-400'   },
};

const STATUSES: SavedProgramStatus[] = ['saved', 'reviewing', 'analysis_done', 'excluded'];

const SOURCE_BADGE_CLS: Record<string, string> = {
  'IRIS':      'bg-purple-50 text-purple-700',
  'NTIS':      'bg-blue-50   text-blue-700',
  'K-Startup': 'bg-green-50  text-green-700',
  'RNDGATE':   'bg-orange-50 text-orange-700',
  '기업마당':  'bg-sky-50    text-sky-700',
  '부처공고':  'bg-indigo-50 text-indigo-700',
  '지자체/TP': 'bg-teal-50   text-teal-700',
};

// ── localStorage 유틸 ─────────────────────────────────────────
function loadSavedPrograms(): SavedProgramEntry[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (Partial<SavedProgramEntry> & { rank: number })[];
    return parsed.map(p => ({
      ...p,
      savedStatus: (p.savedStatus as SavedProgramStatus | undefined) ?? 'saved',
    } as SavedProgramEntry));
  } catch {
    return [];
  }
}

function persistSaved(programs: SavedProgramEntry[]): void {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(programs));
  } catch {}
}

// ── 유틸 ──────────────────────────────────────────────────────
function calcDDay(deadline: string): number {
  const [y, m, d] = deadline.split('.').map(Number);
  const deadlineDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function safeUrl(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('https://') || url.startsWith('http://') ? url : null;
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────
function DDayBadge({ dDay }: { dDay: number }) {
  if (dDay < 0)   return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">마감</span>;
  if (dDay === 0) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">D-Day</span>;
  if (dDay <= 7)  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold">D-{dDay}</span>;
  if (dDay <= 30) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">D-{dDay}</span>;
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">D-{dDay}</span>;
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function SavedPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<SavedProgramEntry[]>([]);

  useEffect(() => {
    setPrograms(loadSavedPrograms());
  }, []);

  function handleStatusChange(rank: number, status: SavedProgramStatus) {
    setPrograms(prev => {
      const updated = prev.map(p => p.rank === rank ? { ...p, savedStatus: status } : p);
      persistSaved(updated);
      return updated;
    });
  }

  function handleRemove(rank: number) {
    setPrograms(prev => {
      const updated = prev.filter(p => p.rank !== rank);
      persistSaved(updated);
      return updated;
    });
  }

  const countByStatus = (s: SavedProgramStatus) => programs.filter(p => p.savedStatus === s).length;

  return (
    <div>
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900 transition-colors">대시보드</button>
        <span>/</span>
        <span className="text-gray-600">정부R&D 컨설턴트</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">관심 공고함</span>
      </nav>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-base font-bold text-gray-900">관심 공고함</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs text-gray-400">총 {programs.length}건</span>
            {STATUSES.map(s => countByStatus(s) > 0 && (
              <span key={s} className="flex items-center gap-1 text-xs text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dotCls}`} />
                {STATUS_CONFIG[s].label} {countByStatus(s)}건
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate('/program-search')}
          className="flex-shrink-0 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + 공고 탐색하기
        </button>
      </div>

      {/* 빈 상태 */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">저장된 관심 공고가 없습니다</h3>
          <p className="text-sm text-gray-400 mb-5">
            정부지원사업 탐색 결과에서 ☆ 관심 저장을 눌러보세요.
          </p>
          <button
            onClick={() => navigate('/program-search')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            정부지원사업 탐색하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {programs.map(program => {
            const dDay      = calcDDay(program.deadline);
            const portalUrl = safeUrl(program.source_portal_url);
            const annoUrl   = safeUrl(program.announcement_url);
            const statusCfg = STATUS_CONFIG[program.savedStatus] ?? STATUS_CONFIG.saved;
            const srcCls    = SOURCE_BADGE_CLS[program.source] ?? 'bg-gray-50 text-gray-600';

            return (
              <div key={program.rank} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* 카드 헤더: 상태 + 소스 + 주관기관 + 적합도 */}
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${statusCfg.activeCls}`}>
                    {statusCfg.label}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${srcCls}`}>
                    {program.source}
                  </span>
                  <span className="text-[11px] text-gray-400 flex-1 truncate min-w-0">{program.organization}</span>
                  <span className="text-sm font-bold text-blue-600 flex-shrink-0">{program.fit_score}점</span>
                </div>

                <div className="p-5 space-y-3">
                  {/* 사업명 */}
                  <h3 className="text-sm font-bold text-gray-900">{program.program_name}</h3>

                  {/* 지원금 + 마감일 */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-gray-600">💰 {program.support_amount}</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                      📅 {program.deadline} <DDayBadge dDay={dDay} />
                    </span>
                  </div>

                  {/* 추천 사유 */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-blue-700 mb-1">💬 추천 사유</p>
                    <p className="text-xs text-blue-900 leading-relaxed">{program.recommendation_reason}</p>
                  </div>

                  {/* 준비자료 */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 mb-1.5">📋 준비자료</p>
                    <div className="flex flex-wrap gap-1.5">
                      {program.required_documents.map((doc, i) => (
                        <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 신청 유의사항 */}
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-[11px] font-semibold text-amber-700 mb-1">⚠️ 신청 유의사항</p>
                    <p className="text-xs text-amber-900 leading-relaxed">{program.application_notes}</p>
                  </div>

                  {/* 상태 변경 버튼 그룹 */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 mb-1.5">상태 변경</p>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(program.rank, s)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors border ${
                            program.savedStatus === s
                              ? STATUS_CONFIG[s].activeCls
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼: [공고문 원문] [출처 사이트] [공고문 분석] [관심 해제] */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {annoUrl && (
                      <a
                        href={annoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        공고문 원문 보기 <span className="text-blue-400">↗</span>
                      </a>
                    )}
                    {portalUrl && (
                      <a
                        href={portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        출처 사이트 보기 <span className="text-gray-400">↗</span>
                      </a>
                    )}
                    {/* 선택 공고 정보를 location.state로 전달 */}
                    <button
                      onClick={() => navigate('/agents/government_announcement_analysis/run', {
                        state: { selectedProgram: program },
                      })}
                      className="flex-1 min-w-[8rem] bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      공고문 분석하기 →
                    </button>
                    <button
                      onClick={() => handleRemove(program.rank)}
                      className="flex-shrink-0 text-xs font-medium py-2 px-3 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      관심 해제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
