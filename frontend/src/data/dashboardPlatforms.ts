// MVP 대시보드 플랫폼 및 Agent 정의 (mock data 기반)
// agent_id는 config/agents.json의 실제 ID와 매핑
// agent_id: null → 미구현 Agent (실행 버튼 비활성화)

export type AgentStatus = 'active' | 'planned' | 'pending';

export interface DashboardAgent {
  agent_id: string | null; // null이면 실제 Agent 없음 → 실행 불가
  name_ko: string;
  description: string;
  icon: string;
  output_type: string;
  status: AgentStatus;
  step: number;
}

export interface DashboardPlatform {
  platform_id: string;
  name_ko: string;
  icon: string;
  description: string;
  agent_count: number;
  is_available: boolean;
  agents: DashboardAgent[];
  preview_agents: string[]; // 미출시 플랫폼의 예정 Agent 목록
}

// ─────────────────────────────────────────────
// 정부R&D 컨설턴트 7개 Agent
// agents.json government_rd 영역 실제 ID 기준 매핑
// ─────────────────────────────────────────────
const GOVT_RD_AGENTS: DashboardAgent[] = [
  {
    // 실제 대응 Agent 없음 → v1.2 예정
    agent_id: null,
    step: 1,
    name_ko: '정부지원사업 탐색',
    description: '공고 DB 연동으로 적합한 지원사업을 자동 탐색·추천합니다',
    icon: '🔍',
    output_type: 'list',
    status: 'planned',
  },
  {
    // agents.json: government_announcement_analysis
    agent_id: 'government_announcement_analysis',
    step: 2,
    name_ko: '공고문 분석',
    description: '공고문 핵심 요건·지원자격·평가기준을 체계적으로 분석합니다',
    icon: '📄',
    output_type: 'document',
    status: 'active',
  },
  {
    // 실제 대응 Agent 없음 → 준비 중
    agent_id: null,
    step: 3,
    name_ko: 'Local RAG',
    description: '사내 기술문서·과거 과제를 RAG로 연결해 맞춤형 컨텍스트를 제공합니다',
    icon: '🗂️',
    output_type: 'document',
    status: 'pending',
  },
  {
    // agents.json: business_plan_writing
    agent_id: 'business_plan_writing',
    step: 4,
    name_ko: '사업계획서 작성',
    description: '과제 목표·필요성·추진전략 중심의 사업계획서 초안을 생성합니다',
    icon: '📝',
    output_type: 'document',
    status: 'active',
  },
  {
    // agents.json: rd_plan_writing
    agent_id: 'rd_plan_writing',
    step: 5,
    name_ko: '연구개발계획서 작성',
    description: '기술개발 내용·방법론·단계별 목표를 포함한 연구개발계획서를 작성합니다',
    icon: '🔬',
    output_type: 'document',
    status: 'active',
  },
  {
    // agents.json: final_submission_review (LLM 기반 완성도·일관성 검증 역할)
    agent_id: 'final_submission_review',
    step: 6,
    name_ko: 'LLM 검증',
    description: 'LLM 기반 사업계획서 완성도·일관성·논리성을 자동 검증합니다',
    icon: '✅',
    output_type: 'checklist',
    status: 'active',
  },
  {
    // agents.json: evaluation_criteria_response (평가항목 대응 → 평가 최적화 역할)
    agent_id: 'evaluation_criteria_response',
    step: 7,
    name_ko: '평가 최적화',
    description: '평가 항목별 대응 근거를 보강하고 점수 최적화 전략을 수립합니다',
    icon: '🎯',
    output_type: 'table',
    status: 'active',
  },
];
// 주의: 발표자료 작성은 정부R&D 컨설턴트에서 제외.
//       향후 사업개발·마케팅 플랫폼으로 이관 예정.

// ─────────────────────────────────────────────
// 8개 플랫폼 정의
// ─────────────────────────────────────────────
export const DASHBOARD_PLATFORMS: DashboardPlatform[] = [
  {
    platform_id: 'government_rd',
    name_ko: '정부R&D 컨설턴트',
    icon: '🏛️',
    description: '정부 지원사업 발굴부터 사업계획서·연구개발계획서 작성 및 평가 최적화까지 AI 통합 컨설팅',
    agent_count: 7,
    is_available: true,
    agents: GOVT_RD_AGENTS,
    preview_agents: [],
  },
  {
    platform_id: 'collaboration',
    name_ko: '업무협업',
    icon: '📅',
    description: '회의·일정·업무지시·보고서 작성을 AI로 자동화합니다',
    agent_count: 7,
    is_available: false,
    agents: [],
    preview_agents: [
      '회의록 정리', '주간업무보고', '월간보고서',
      '업무지시서 작성', 'To-do 추출', '이슈/리스크 관리', '의사결정 기록',
    ],
  },
  {
    platform_id: 'rd_management',
    name_ko: '연구개발 관리',
    icon: '🔬',
    description: '연구개발 산출물 작성·관리·추적을 통합 지원합니다',
    agent_count: 8,
    is_available: false,
    agents: [],
    preview_agents: [
      '요구정의서 작성', '기능명세서 작성', '화면설계서',
      'DB 설계 초안', 'API 명세서', '테스트케이스', '산출물 관리표', '개발 WBS',
    ],
  },
  {
    platform_id: 'project_finance',
    name_ko: '연구/용역 사업비 관리',
    icon: '💰',
    description: '연구개발 사업비 산출·집행·정산을 AI로 지원합니다',
    agent_count: 5,
    is_available: false,
    agents: [],
    preview_agents: [
      '사업비 산출내역', '예산 집행계획', '정산보고서',
      '추진체계 및 참여인력 구성', 'WBS/추진일정',
    ],
  },
  {
    platform_id: 'knowledge_management',
    name_ko: '지식 관리',
    icon: '📚',
    description: '사내 지식·문서·노하우를 체계적으로 관리·검색합니다',
    agent_count: 6,
    is_available: false,
    agents: [],
    preview_agents: [
      '지식 베이스 구축', '문서 분류·태깅', '사례 분석',
      '기술 보고서', '정보 요약', '검색 최적화',
    ],
  },
  {
    platform_id: 'strategic_planning',
    name_ko: '전략기획',
    icon: '📋',
    description: '사업전략·IR·시장분석·파트너십 기획을 AI로 지원합니다',
    agent_count: 7,
    is_available: false,
    agents: [],
    preview_agents: [
      '과제기획서 작성', '사업전략 수립', '비즈니스모델 설계',
      '시장조사 보고서', 'SWOT 분석', 'IR 자료 초안', 'JV/협업 제안서',
    ],
  },
  {
    platform_id: 'business_development',
    name_ko: '사업개발·마케팅',
    icon: '💼',
    description: '고객 제안·영업·마케팅 전략을 AI로 지원합니다',
    agent_count: 6,
    is_available: false,
    agents: [],
    // 발표자료 작성은 정부R&D 컨설턴트에서 이 플랫폼으로 이관 예정
    preview_agents: [
      '고객 제안서 작성', '회사소개서 작성', '제품소개서',
      '견적 제안서', '고객 미팅 준비', '발표자료 작성 (정부R&D에서 이관 예정)',
    ],
  },
  {
    platform_id: 'ip_commercialization',
    name_ko: 'IP·사업화',
    icon: '⚖️',
    description: '특허·기술이전·사업화 전략을 AI로 지원합니다',
    agent_count: 5,
    is_available: false,
    agents: [],
    preview_agents: [
      '특허 분석', '기술이전 전략', '사업화 계획서',
      '기술가치 평가', '라이선싱 전략',
    ],
  },
];

// ─────────────────────────────────────────────
// 우측 패널 mock 데이터
// ─────────────────────────────────────────────
export interface RecommendedTask {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export const MOCK_RECOMMENDED_TASKS: RecommendedTask[] = [
  {
    id: 1,
    title: '공고문 분석 실행',
    description: '중소기업 기술개발 R&D 공고문 검토',
    priority: 'high',
    icon: '📄',
  },
  {
    id: 2,
    title: '사업계획서 초안 작성',
    description: '스마트팩토리 지원사업 사업계획서 작성',
    priority: 'medium',
    icon: '📝',
  },
  {
    id: 3,
    title: '평가 최적화 검토',
    description: '기술성 평가 대응 근거 보강 필요',
    priority: 'low',
    icon: '🎯',
  },
];

export const MOCK_LLM_COST = {
  today: 0,
  month: 0,
};

export interface RecentRun {
  run_id: string;
  agent_name: string;
  status: 'completed' | 'running' | 'failed';
  time: string;
}

export const MOCK_RECENT_RUNS: RecentRun[] = [];

// ─────────────────────────────────────────────
// 하단 패널 mock 데이터
// ─────────────────────────────────────────────
export interface InProgressDoc {
  doc_id: string;
  title: string;
  agent_name: string;
  created_at: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  icon: string;
  type: 'info' | 'tip' | 'warning';
}

export interface UsageHistory {
  date: string;
  agent_name: string;
  status: string;
}

export const MOCK_IN_PROGRESS_DOCS: InProgressDoc[] = [];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    message: 'MVP 대시보드가 준비되었습니다.',
    time: '방금 전',
    icon: '🎉',
    type: 'info',
  },
  {
    id: 2,
    message: '정부R&D 컨설턴트 플랫폼의 5개 Agent를 사용해보세요.',
    time: '방금 전',
    icon: '🏛️',
    type: 'tip',
  },
];

export const MOCK_USAGE_HISTORY: UsageHistory[] = [];
