import type { DashboardPlatform } from '../../data/dashboardPlatforms';

interface Props {
  platforms: DashboardPlatform[];
  selectedId: string;
  onSelect: (platformId: string) => void;
}

export default function DashboardSidebar({ platforms, selectedId, onSelect }: Props) {
  return (
    <aside className="flex-shrink-0 w-full lg:w-52">
      {/* 모바일: 가로 스크롤 */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {platforms.map(p => {
          const isSelected = selectedId === p.platform_id;
          return (
            <button
              key={p.platform_id}
              onClick={() => onSelect(p.platform_id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-center transition-all min-w-[80px] ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[11px] font-medium leading-tight whitespace-nowrap">{p.name_ko}</span>
              {!p.is_available && (
                <span className="text-[9px] text-gray-400">준비 중</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 데스크톱: 수직 리스트 */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            플랫폼 선택
          </h2>
        </div>
        <nav className="py-1">
          {platforms.map((p, idx) => {
            const isSelected = selectedId === p.platform_id;
            return (
              <button
                key={p.platform_id}
                onClick={() => onSelect(p.platform_id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all relative ${
                  isSelected
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                } ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
              >
                {/* 선택 인디케이터 */}
                {isSelected && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-r" />
                )}

                <span className="text-xl flex-shrink-0">{p.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold leading-tight truncate ${
                    isSelected ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {p.name_ko}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-400">Agent {p.agent_count}개</span>
                    {!p.is_available && (
                      <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                        준비 중
                      </span>
                    )}
                    {p.is_available && (
                      <span className="text-[9px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">
                        운영 중
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
