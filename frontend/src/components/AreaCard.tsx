import { useNavigate } from 'react-router-dom';
import type { Area } from '../types';
import { AREA_ICONS } from '../utils';

export default function AreaCard({ area }: { area: Area }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/areas/${area.area_id}`)}
      className="card cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: area.color + '20' }}
        >
          {AREA_ICONS[area.icon_key] ?? '📁'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{area.name_ko}</h3>
            <span
              className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: area.color + '15', color: area.color }}
            >
              {area.agent_count}개
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{area.description}</p>
        </div>
      </div>
      <div
        className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between"
      >
        <span className="text-xs text-gray-400">{area.name_en}</span>
        <span className="text-xs font-medium group-hover:underline" style={{ color: area.color }}>
          Agent 보기 →
        </span>
      </div>
    </div>
  );
}
