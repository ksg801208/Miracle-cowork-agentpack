import {
  MOCK_RECOMMENDED_TASKS,
  MOCK_LLM_COST,
  MOCK_RECENT_RUNS,
} from '../../data/dashboardPlatforms';

const PRIORITY_LABEL: Record<string, { label: string; cls: string }> = {
  high:   { label: '높음', cls: 'bg-red-50 text-red-500' },
  medium: { label: '보통', cls: 'bg-yellow-50 text-yellow-600' },
  low:    { label: '낮음', cls: 'bg-gray-50 text-gray-500' },
};

const RUN_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  completed: { label: '완료', cls: 'text-green-600' },
  running:   { label: '실행 중', cls: 'text-blue-600' },
  failed:    { label: '실패', cls: 'text-red-500' },
};

export default function DashboardRightPanel() {
  return (
    <aside className="w-full lg:w-60 flex-shrink-0 flex flex-col gap-4 lg:gap-3">
      {/* 추천 업무 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <span>⭐</span> 추천 업무
        </h3>
        <div className="flex flex-col gap-1.5">
          {MOCK_RECOMMENDED_TASKS.map(task => {
            const p = PRIORITY_LABEL[task.priority];
            return (
              <div
                key={task.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
              >
                <span className="text-base flex-shrink-0 mt-0.5">{task.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{task.description}</p>
                </div>
                <span className={`text-[9px] flex-shrink-0 px-1.5 py-0.5 rounded-full font-medium ${p.cls}`}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LLM 비용 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <span>💳</span> LLM 비용
        </h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">오늘</span>
            <span className="text-sm font-bold text-gray-900">
              {MOCK_LLM_COST.today === 0 ? '₩0' : `₩${MOCK_LLM_COST.today.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">이번 달</span>
            <span className="text-sm font-bold text-gray-900">
              {MOCK_LLM_COST.month === 0 ? '₩0' : `₩${MOCK_LLM_COST.month.toLocaleString()}`}
            </span>
          </div>
          <div className="pt-1.5 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              API 연동 시 실시간 집계 예정
            </p>
          </div>
        </div>
      </div>

      {/* 최근 실행 이력 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <span>🕐</span> 최근 실행 이력
        </h3>
        {MOCK_RECENT_RUNS.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-1.5">📭</div>
            <p className="text-xs text-gray-400">아직 실행 이력이 없습니다</p>
            <p className="text-[10px] text-gray-300 mt-0.5">
              Agent 실행 후 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_RECENT_RUNS.map(run => {
              const s = RUN_STATUS_LABEL[run.status] ?? { label: run.status, cls: 'text-gray-500' };
              return (
                <div key={run.run_id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-800 truncate">{run.agent_name}</p>
                    <p className="text-[10px] text-gray-400">{run.time}</p>
                  </div>
                  <span className={`text-[10px] font-medium flex-shrink-0 ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
