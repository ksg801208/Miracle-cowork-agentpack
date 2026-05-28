import type { DashboardPlatform } from '../../data/dashboardPlatforms';
import DashboardAgentCard from './DashboardAgentCard';

interface Props {
  platform: DashboardPlatform;
}

export default function DashboardMain({ platform }: Props) {
  const activeCount = platform.agents.filter(a => a.status === 'active' && a.agent_id).length;

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* 플랫폼 헤더 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl flex-shrink-0">{platform.icon}</span>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                {platform.name_ko}
              </h1>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {platform.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
              Agent {platform.agent_count}개
            </span>
            {platform.is_available && (
              <span className="text-[10px] text-gray-400">
                실행 가능 {activeCount}개
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Agent 카드 또는 준비 중 안내 */}
      {platform.is_available ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {platform.agents.map(agent => (
            <DashboardAgentCard key={agent.step} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">🔧</div>
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            준비 중인 플랫폼입니다
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            현재 <span className="font-medium text-blue-600">정부R&D 컨설턴트</span> 플랫폼을 우선 제공하고 있습니다.
            <br />
            이 플랫폼은 향후 업데이트를 통해 순차적으로 오픈됩니다.
          </p>
          {platform.preview_agents.length > 0 && (
            <div className="text-left max-w-sm mx-auto">
              <p className="text-xs font-semibold text-gray-500 mb-2">포함 예정 Agent</p>
              <div className="flex flex-wrap gap-2">
                {platform.preview_agents.map((name, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
