export const AREA_ICONS: Record<string, string> = {
  government: '🏛️',
  planning: '📋',
  meeting: '📅',
  research: '🔬',
  sales: '💼',
  knowledge: '📚',
  patent: '⚖️',
  development: '💻',
};

export const OUTPUT_TYPE_LABELS: Record<string, string> = {
  document: '문서',
  table: '표',
  checklist: '체크리스트',
  prompt: '프롬프트',
  report: '보고서',
  list: '목록',
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
  running: { label: '실행 중', color: 'bg-blue-100 text-blue-700' },
  failed: { label: '실패', color: 'bg-red-100 text-red-700' },
  pending: { label: '대기', color: 'bg-gray-100 text-gray-600' },
  active: { label: '활성', color: 'bg-green-100 text-green-700' },
  todo: { label: '예정', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: '진행', color: 'bg-blue-100 text-blue-700' },
  done: { label: '완료', color: 'bg-green-100 text-green-700' },
};

export const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: '높음', color: 'text-red-600' },
  medium: { label: '보통', color: 'text-yellow-600' },
  low: { label: '낮음', color: 'text-gray-500' },
};

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}
