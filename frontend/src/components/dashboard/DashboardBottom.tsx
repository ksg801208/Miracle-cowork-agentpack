import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_NOTIFICATIONS,
  MOCK_USAGE_HISTORY,
} from '../../data/dashboardPlatforms';
import type { SavedProgramEntry } from '../../data/programSearchMockData';

const SAVED_KEY = 'savedPrograms';

const NOTIF_TYPE_STYLE: Record<string, string> = {
  info:    'bg-blue-50 border-blue-100',
  tip:     'bg-green-50 border-green-100',
  warning: 'bg-yellow-50 border-yellow-100',
};

function loadSavedPreview(): SavedProgramEntry[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<SavedProgramEntry>[];
    return parsed.map(p => ({
      ...p,
      savedStatus: p.savedStatus ?? 'saved',
    } as SavedProgramEntry)).slice(0, 3); // 최대 3건 미리보기
  } catch {
    return [];
  }
}

function loadSavedCount(): number {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return 0;
    return (JSON.parse(raw) as unknown[]).length;
  } catch {
    return 0;
  }
}

const STATUS_LABEL: Record<string, string> = {
  saved:         '관심',
  reviewing:     '검토중',
  analysis_done: '분석완료',
  excluded:      '제외',
};

export default function DashboardBottom() {
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(0);
  const [savedPreview, setSavedPreview] = useState<SavedProgramEntry[]>([]);

  useEffect(() => {
    setSavedCount(loadSavedCount());
    setSavedPreview(loadSavedPreview());
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* 관심 공고함 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <span>⭐</span> 관심 공고함
          </h3>
          <button
            onClick={() => navigate('/saved-programs')}
            className="text-[10px] text-blue-600 hover:underline"
          >
            전체 보기 →
          </button>
        </div>

        {savedCount === 0 ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-1.5">☆</div>
            <p className="text-xs text-gray-400">저장된 관심 공고가 없습니다</p>
            <button
              onClick={() => navigate('/program-search')}
              className="mt-2 text-[10px] text-blue-500 hover:underline"
            >
              공고 탐색하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => navigate('/saved-programs')}
              className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 transition-colors mb-1"
            >
              <span className="text-xs font-semibold text-yellow-700">관심 공고 {savedCount}건</span>
              <span className="text-[10px] text-yellow-500">보러가기 →</span>
            </button>
            {savedPreview.map(p => (
              <div
                key={p.rank}
                onClick={() => navigate('/saved-programs')}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                  {STATUS_LABEL[p.savedStatus] ?? '관심'}
                </span>
                <p className="text-xs text-gray-700 leading-tight line-clamp-1 min-w-0">{p.program_name}</p>
              </div>
            ))}
            {savedCount > 3 && (
              <p className="text-[10px] text-gray-400 text-center pt-1">
                외 {savedCount - 3}건 더 저장됨
              </p>
            )}
          </div>
        )}
      </div>

      {/* 알림 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <span>🔔</span> 알림
          </h3>
          {MOCK_NOTIFICATIONS.length > 0 && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
              {MOCK_NOTIFICATIONS.length}
            </span>
          )}
        </div>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-2xl mb-1.5">🔕</div>
            <p className="text-xs text-gray-400">새 알림이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_NOTIFICATIONS.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                  NOTIF_TYPE_STYLE[n.type] ?? 'bg-gray-50 border-gray-100'
                }`}
              >
                <span className="text-base flex-shrink-0">{n.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사용 이력 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <span>📊</span> 사용 이력
          </h3>
          <span className="text-[10px] text-gray-400">{MOCK_USAGE_HISTORY.length}건</span>
        </div>
        {MOCK_USAGE_HISTORY.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-2xl mb-1.5">📈</div>
            <p className="text-xs text-gray-400">사용 이력이 없습니다</p>
            <p className="text-[10px] text-gray-300 mt-0.5">Agent 실행 후 이력이 누적됩니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_USAGE_HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 truncate">{h.agent_name}</p>
                  <p className="text-[10px] text-gray-400">{h.date}</p>
                </div>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{h.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
