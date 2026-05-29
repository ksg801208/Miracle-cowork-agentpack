import { useNavigate } from 'react-router-dom';
import type { ProgramRecommendation, ProgramStatus } from '../../data/programSearchMockData';

// ── 유틸 ──────────────────────────────────────────────────────
function calcDDay(deadline: string): number {
  const [y, m, d] = deadline.split('.').map(Number);
  const deadlineDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// http(s)://로 시작하지 않으면 null 반환 — 잘못된 URL로 인한 화면 오류 방지
function safeUrl(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('https://') || url.startsWith('http://') ? url : null;
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────
function FitScoreBar({ score }: { score: number }) {
  const barColor =
    score >= 90 ? 'bg-green-500' :
    score >= 75 ? 'bg-blue-500'  :
    score >= 60 ? 'bg-yellow-500': 'bg-gray-400';
  const textColor =
    score >= 90 ? 'text-green-600' :
    score >= 75 ? 'text-blue-600'  :
    score >= 60 ? 'text-yellow-600': 'text-gray-500';

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold flex-shrink-0 ${textColor}`}>{score}점</span>
    </div>
  );
}

function DDayBadge({ dDay }: { dDay: number }) {
  if (dDay < 0)
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">마감</span>;
  if (dDay === 0)
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">D-Day</span>;
  if (dDay <= 7)
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold">D-{dDay}</span>;
  if (dDay <= 30)
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">D-{dDay}</span>;
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">D-{dDay}</span>;
}

// ── 상수 ──────────────────────────────────────────────────────
const STATUS_BADGE: Record<ProgramStatus, { label: string; cls: string }> = {
  open:     { label: '접수중',   cls: 'bg-green-100 text-green-700' },
  upcoming: { label: '접수예정', cls: 'bg-blue-100  text-blue-600'  },
  closed:   { label: '마감',     cls: 'bg-gray-100  text-gray-500'  },
};

const SOURCE_BADGE_CLS: Record<string, string> = {
  'IRIS':      'bg-purple-50 text-purple-700',
  'NTIS':      'bg-blue-50   text-blue-700'  ,
  'K-Startup': 'bg-green-50  text-green-700' ,
  'RNDGATE':   'bg-orange-50 text-orange-700',
  '기업마당':  'bg-sky-50    text-sky-700'   ,
  '부처공고':  'bg-indigo-50 text-indigo-700',
  '지자체/TP': 'bg-teal-50   text-teal-700'  ,
};

const RANK_STYLE: Record<number, string> = {
  1: 'bg-yellow-400 text-white',
  2: 'bg-gray-400   text-white',
  3: 'bg-amber-600  text-white',
};

// 외부 링크 공통 스타일
const EXT_LINK_BASE =
  'flex-shrink-0 text-xs font-medium py-2.5 px-3 rounded-lg border transition-colors flex items-center gap-1';

// ── 메인 컴포넌트 ─────────────────────────────────────────────
interface Props {
  program: ProgramRecommendation;
  displayRank: number;  // 정렬 후 표시 순위 (index + 1)
  isSaved: boolean;
  onSave: (program: ProgramRecommendation) => void;
}

export default function ProgramResultCard({ program, displayRank, isSaved, onSave }: Props) {
  const navigate = useNavigate();
  const dDay           = calcDDay(program.deadline);
  const rankStyle      = RANK_STYLE[displayRank] ?? 'bg-blue-100 text-blue-700';
  const statusBadge    = STATUS_BADGE[program.status] ?? STATUS_BADGE.open;
  const sourceCls      = SOURCE_BADGE_CLS[program.source] ?? 'bg-gray-50 text-gray-600';

  // URL 방어: 잘못된 형식이면 null
  const announcementUrl  = safeUrl(program.announcement_url);
  const portalUrl        = safeUrl(program.source_portal_url);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* ── 헤더: 순위 + 적합도 + 관심 저장 ── */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankStyle}`}>
          {displayRank}
        </span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[11px] text-gray-400 flex-shrink-0">적합도</span>
          <FitScoreBar score={program.fit_score} />
        </div>
        <button
          onClick={() => onSave(program)}
          className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            isSaved
              ? 'bg-yellow-50 border-yellow-300 text-yellow-600'
              : 'bg-white border-gray-200 text-gray-500 hover:border-yellow-300 hover:text-yellow-500'
          }`}
        >
          {isSaved ? '⭐ 저장됨' : '☆ 관심'}
        </button>
      </div>

      <div className="p-5 space-y-4">

        {/* ── 사업명 + 상태 뱃지 + 출처 ── */}
        <div>
          <div className="flex items-start gap-2 flex-wrap mb-1.5">
            <h3 className="text-sm font-bold text-gray-900 leading-snug flex-1 min-w-0">
              {program.program_name}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${statusBadge.cls}`}>
              {statusBadge.label}
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5">
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${sourceCls}`}>
              {program.source}
            </span>
            <span className="text-[11px] text-gray-400">·</span>
            <span className="text-[11px] text-gray-500">{program.organization}</span>
          </div>
        </div>

        {/* ── 추천 사유 ── */}
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-blue-700 mb-1">💬 추천 사유</p>
          <p className="text-xs text-blue-900 leading-relaxed">{program.recommendation_reason}</p>
        </div>

        {/* ── 지원금 + 마감일 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 mb-1">💰 지원금 규모</p>
            <p className="text-xs font-semibold text-gray-800 leading-snug">{program.support_amount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 mb-1">📅 마감일</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-semibold text-gray-800">{program.deadline}</p>
              <DDayBadge dDay={dDay} />
            </div>
          </div>
        </div>

        {/* ── 준비자료 ── */}
        <div>
          <p className="text-[11px] font-semibold text-gray-600 mb-2">📋 준비자료</p>
          <div className="flex flex-wrap gap-1.5">
            {program.required_documents.map((doc, i) => (
              <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* ── 신청 유의사항 ── */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-amber-700 mb-1">⚠️ 신청 유의사항</p>
          <p className="text-xs text-amber-900 leading-relaxed">{program.application_notes}</p>
        </div>

        {/* ── 버튼 영역 ──────────────────────────────────────────
            순서: [공고문 원문 보기] [출처 사이트 보기] [공고문 분석하기] [관심 저장]
            · announcement_url 없으면 [공고문 원문 보기] 미표시
            · source_portal_url 없으면 [출처 사이트 보기] 미표시
        ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 pt-1">

          {/* [1] 공고문 원문 보기 — 개별 공고 상세 URL (실제 연동 시 활성화) */}
          {announcementUrl && (
            <a
              href={announcementUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${EXT_LINK_BASE} border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100`}
            >
              공고문 원문 보기 <span className="text-blue-400">↗</span>
            </a>
          )}

          {/* [2] 출처 사이트 보기 — 소스 공고 목록/대표 페이지 */}
          {portalUrl && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${EXT_LINK_BASE} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300`}
            >
              출처 사이트 보기 <span className="text-gray-400">↗</span>
            </a>
          )}

          {/* [3] 공고문 분석하기 — 선택 공고 정보를 location.state로 전달 */}
          <button
            onClick={() => navigate('/agents/government_announcement_analysis/run', {
              state: { selectedProgram: program },
            })}
            className="flex-1 min-w-[8rem] bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            공고문 분석하기 →
          </button>

          {/* [4] 관심 공고 저장 */}
          <button
            onClick={() => onSave(program)}
            className={`flex-shrink-0 text-xs font-medium py-2.5 px-3 rounded-lg border transition-all ${
              isSaved
                ? 'bg-yellow-50 border-yellow-300 text-yellow-600'
                : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-600'
            }`}
          >
            {isSaved ? '⭐ 저장됨' : '☆ 관심 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
