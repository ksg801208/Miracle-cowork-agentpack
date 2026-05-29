import { useNavigate } from 'react-router-dom';
import type { DashboardAgent } from '../../data/dashboardPlatforms';

const OUTPUT_TYPE_LABELS: Record<string, string> = {
  document: '문서',
  table: '표',
  checklist: '체크리스트',
  prompt: '프롬프트',
  report: '보고서',
  list: '목록',
};

const STATUS_CONFIG = {
  active:  { badge: null,        btnLabel: '실행하기',  btnClass: 'bg-blue-600 text-white hover:bg-blue-700' },
  planned: { badge: 'v1.2 예정', btnLabel: 'v1.2 예정', btnClass: 'bg-gray-100 text-gray-400 cursor-not-allowed' },
  pending: { badge: '준비 중',   btnLabel: '준비 중',   btnClass: 'bg-yellow-50 text-yellow-600 cursor-not-allowed' },
} as const;

interface Props {
  agent: DashboardAgent;
}

export default function DashboardAgentCard({ agent }: Props) {
  const navigate = useNavigate();
  // custom_path가 있거나 실제 agent_id가 있는 active 카드만 실행 가능
  const canRun = agent.status === 'active' && (!!agent.custom_path || agent.agent_id !== null);
  const cfg = STATUS_CONFIG[agent.status];

  const handleRun = () => {
    if (!canRun) return;
    if (agent.custom_path) {
      navigate(agent.custom_path);
    } else if (agent.agent_id) {
      navigate(`/agents/${agent.agent_id}/run`);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border flex flex-col gap-3 p-4 transition-all duration-200 ${
        canRun
          ? 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : 'border-gray-100 shadow-sm opacity-70'
      }`}
      onClick={canRun ? handleRun : undefined}
    >
      {/* 헤더: 스텝 번호 + 아이콘 + 상태 뱃지 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white ${
              canRun ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            {agent.step}
          </div>
          <span className="text-xl">{agent.icon}</span>
        </div>
        {cfg.badge && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
              agent.status === 'planned'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {cfg.badge}
          </span>
        )}
      </div>

      {/* 이름 + 설명 */}
      <div className="flex-1">
        <h3
          className={`text-sm font-semibold leading-tight ${
            canRun ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {agent.name_ko}
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* 푸터: output type + 실행 버튼 */}
      <div
        className="flex items-center justify-between pt-2 border-t border-gray-50"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-[11px] text-gray-400">
          {OUTPUT_TYPE_LABELS[agent.output_type] ?? agent.output_type}
        </span>
        <button
          onClick={handleRun}
          disabled={!canRun}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${cfg.btnClass}`}
        >
          {cfg.btnLabel}
        </button>
      </div>
    </div>
  );
}
