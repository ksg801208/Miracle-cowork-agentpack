import {
  MOCK_IN_PROGRESS_DOCS,
  MOCK_NOTIFICATIONS,
  MOCK_USAGE_HISTORY,
} from '../../data/dashboardPlatforms';

const NOTIF_TYPE_STYLE: Record<string, string> = {
  info:    'bg-blue-50 border-blue-100',
  tip:     'bg-green-50 border-green-100',
  warning: 'bg-yellow-50 border-yellow-100',
};

export default function DashboardBottom() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 진행 중 문서 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <span>📁</span> 진행 중 문서
          </h3>
          <span className="text-[10px] text-gray-400">{MOCK_IN_PROGRESS_DOCS.length}건</span>
        </div>
        {MOCK_IN_PROGRESS_DOCS.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-2xl mb-1.5">📂</div>
            <p className="text-xs text-gray-400">진행 중인 문서가 없습니다</p>
            <p className="text-[10px] text-gray-300 mt-0.5">
              Agent를 실행하면 문서가 생성됩니다
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_IN_PROGRESS_DOCS.map(doc => (
              <div
                key={doc.doc_id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-base">📄</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{doc.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{doc.agent_name}</p>
                </div>
              </div>
            ))}
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
            <p className="text-[10px] text-gray-300 mt-0.5">
              Agent 실행 후 이력이 누적됩니다
            </p>
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
