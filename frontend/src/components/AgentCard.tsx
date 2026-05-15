import { useNavigate } from 'react-router-dom';
import type { Agent } from '../types';
import { OUTPUT_TYPE_LABELS } from '../utils';

export default function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate();

  const outputTypeColor: Record<string, string> = {
    document: 'bg-blue-50 text-blue-700',
    table: 'bg-purple-50 text-purple-700',
    checklist: 'bg-green-50 text-green-700',
    prompt: 'bg-orange-50 text-orange-700',
    report: 'bg-indigo-50 text-indigo-700',
    list: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">{agent.name_ko}</h3>
        <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${outputTypeColor[agent.output_type] ?? 'bg-gray-50 text-gray-700'}`}>
          {OUTPUT_TYPE_LABELS[agent.output_type] ?? agent.output_type}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{agent.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">우선순위 #{agent.priority}</span>
        <button
          onClick={() => navigate(`/agents/${agent.agent_id}/run`)}
          disabled={!agent.is_enabled}
          className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          실행하기
        </button>
      </div>
    </div>
  );
}
