// 정부지원사업 탐색 mock 데이터
// 실제 API/크롤링 연동 시 이 파일을 대체한다.
// 7개 통합 데이터 소스: 기업마당, NTIS, K-Startup, RNDGATE, 부처공고, 지자체/TP, IRIS
//
// URL 필드 정책:
//   announcement_url  — 개별 공고 상세 페이지 URL (실제 연동 시 반드시 수집 필요)
//                        mock 단계에서는 정확한 URL을 알 수 없으므로 설정하지 않는다.
//   source_portal_url — 원천 사이트 또는 공고 목록 페이지 URL (출처 사이트 보기 버튼)

export type ProgramStatus = 'open' | 'upcoming' | 'closed';

// 관심 공고함 상태
export type SavedProgramStatus = 'saved' | 'reviewing' | 'analysis_done' | 'excluded';

// localStorage에 저장되는 관심 공고 (savedStatus 없는 구버전은 'saved'로 기본값 처리)
export interface SavedProgramEntry extends ProgramRecommendation {
  savedStatus: SavedProgramStatus;
  savedAt?: string;
}

export interface ProgramRecommendation {
  rank: number;               // 안정적 고유 ID (dedup·sort 후 savedPrograms 추적용)
  program_name: string;       // 사업명
  source: string;             // 데이터 소스 레이블
  announcement_url?: string;  // 개별 공고 상세 페이지 URL (없으면 "공고문 원문 보기" 미표시)
  source_portal_url?: string; // 원천 사이트 / 공고 목록 URL ("출처 사이트 보기" 버튼)
  organization: string;       // 주관기관
  fit_score: number;          // 적합도 0–100
  recommendation_reason: string;
  support_amount: string;
  deadline: string;           // YYYY.MM.DD
  status: ProgramStatus;
  required_documents: string[];
  application_notes: string;
}

// ─────────────────────────────────────────────────────────────────
// 28개 mock 공고
// announcement_url: mock 단계에서는 실제 개별 공고 URL을 알 수 없으므로 미설정
// source_portal_url: 소스별 대표 공고 목록/사이트 URL
// ─────────────────────────────────────────────────────────────────
export const MOCK_PROGRAMS: ProgramRecommendation[] = [

  // ── 기업마당 (Bizinfo) ────────────────────────────────────────
  {
    rank: 1,
    program_name: '2026년 중소기업 기술혁신개발사업',
    source: '기업마당',
    // announcement_url: 미설정 — 실제 연동 시 개별 공고 상세 URL 수집 필요
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업기술정보진흥원(TIPA)',
    fit_score: 94,
    recommendation_reason:
      'AI 기반 업무자동화 플랫폼은 디지털 전환 혁신 분야 최우선 지원 대상이며, 창업 초기 기업 우대 가점이 적용됩니다. 기술개발형 과제로 R&D 비중이 높은 사업 아이템에 매우 적합합니다.',
    support_amount: '최대 1억원 (정부 75%, 자부담 25%)',
    deadline: '2026.06.30',
    status: 'open',
    required_documents: ['사업계획서', '기업부설연구소 증명서', '납세증명서', '재무제표 최근 2년', '중소기업확인서'],
    application_notes: '중소기업확인서 사전 발급 필수 (sminfo.mss.go.kr). 창업 7년 이내 기업 우대. IRIS 시스템으로 온라인 접수.',
  },
  {
    rank: 2,
    program_name: '창업성장기술개발사업 디딤돌 과제',
    source: '기업마당',
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업기술정보진흥원(TIPA)',
    fit_score: 91,
    recommendation_reason:
      '창업 7년 이내 초기 기업 전용 R&D 지원 사업으로 AI/SW 분야 우선 지원합니다. 사업화 역량과 기술 혁신성이 주요 평가 지표로, 제시된 사업 아이템과의 적합성이 높습니다.',
    support_amount: '최대 1.5억원 (정부 80%, 자부담 20%)',
    deadline: '2026.07.15',
    status: 'open',
    required_documents: ['사업계획서', '창업사실확인서', '기술개발계획서', '예비창업자확인서(해당시)'],
    application_notes: '창업 7년 이내 기업만 신청 가능. 대표자 6개월 이상 국내 거주 필요. 동일 연도 타 창업 지원 사업 중복 신청 제한.',
  },
  {
    rank: 21,
    program_name: '중소기업 연구인력 지원사업',
    source: '기업마당',
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업기술정보진흥원(TIPA)',
    fit_score: 71,
    recommendation_reason:
      '석·박사급 연구인력을 채용하거나 공동 활용할 때 인건비의 일부를 지원합니다. AI 엔진 개발을 위한 고급 기술 인력 확보에 도움이 됩니다.',
    support_amount: '인건비 최대 50% (연간 최대 6천만원)',
    deadline: '2026.08.10',
    status: 'open',
    required_documents: ['사업참여신청서', '연구인력 이력서', '고용계약서 사본', '중소기업확인서'],
    application_notes: '연구전담요원 등록 후 지원 가능. 동일 인력에 대한 타 지원금 중복 불가.',
  },
  {
    rank: 24,
    program_name: '청년창업사관학교 입교 지원',
    source: '기업마당',
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업진흥공단(KOSME)',
    fit_score: 63,
    recommendation_reason:
      '만 39세 이하 청년 대표자 대상 창업 초기 집중 지원 프로그램입니다. AI 서비스 사업화를 위한 초기 창업 인프라·멘토링을 제공합니다.',
    support_amount: '사업화 자금 최대 1억원 + 입주 공간',
    deadline: '2026.07.30',
    status: 'upcoming',
    required_documents: ['사업계획서', '대표자 신분증', '창업아이템 소개서'],
    application_notes: '만 39세 이하 대표자 필수. 업력 3년 미만 기업 대상. K-스타트업 포털 접수.',
  },
  // closed — 기본 결과에서 제외
  {
    rank: 25,
    program_name: '수출기업 기술개발 지원사업',
    source: '기업마당',
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업기술정보진흥원(TIPA)',
    fit_score: 75,
    recommendation_reason: '수출 실적이 있는 중소기업 대상 R&D 지원 사업입니다.',
    support_amount: '최대 1억원',
    deadline: '2026.04.30',
    status: 'closed',
    required_documents: ['사업계획서', '수출실적증명서'],
    application_notes: '마감된 공고입니다.',
  },

  // ── K-Startup ─────────────────────────────────────────────────
  {
    rank: 3,
    program_name: 'AI 바우처 지원사업 (공급기업)',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: '정보통신산업진흥원(NIPA)',
    fit_score: 89,
    recommendation_reason:
      'AI 솔루션 공급기업으로 등록 시 수요기업에 AI 서비스를 제공하고 정부 바우처 금액을 지급받는 구조입니다. 업무자동화 AI 플랫폼의 공급기업 자격 요건에 부합합니다.',
    support_amount: '기업당 최대 3억원 (바우처 방식)',
    deadline: '2026.06.10',
    status: 'open',
    required_documents: ['공급기업 등록 신청서', '솔루션 소개서', '레퍼런스 증빙서류', '사업자등록증'],
    application_notes: '공급기업 사전 등록 후 수요기업 매칭 방식. AI 솔루션 검증 절차 필요 (약 2~4주).',
  },
  {
    rank: 4,
    program_name: 'TIPS (민간투자주도형 기술창업지원)',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: 'TIPS 운영사 (VC/액셀러레이터)',
    fit_score: 87,
    recommendation_reason:
      '민간 투자와 정부 R&D를 연계하는 프리미엄 창업지원 프로그램입니다. AI/SW 분야 투자 운영사 추천 시 R&D 최대 5억원 + 사업화 지원이 가능합니다.',
    support_amount: 'R&D 최대 5억원 + 사업화 1억원',
    deadline: '2026.08.31',
    status: 'open',
    required_documents: ['TIPS 운영사 추천서', '기술사업계획서', '팀 구성원 이력서', '투자계약서(또는 의향서)'],
    application_notes: 'TIPS 운영사의 추천이 반드시 필요합니다. 창업 7년 이내 기업 대상.',
  },
  {
    rank: 6,
    program_name: '혁신도약패키지 (Scale-up TIPS)',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: '창업진흥원',
    fit_score: 79,
    recommendation_reason:
      '매출 1억원 이상 또는 투자 유치 기업 대상 성장 단계 종합 지원 패키지입니다. 사업화 고도화, 해외 진출 등을 지원합니다.',
    support_amount: '최대 2억원 (사업화 + 멘토링 패키지)',
    deadline: '2026.07.31',
    status: 'open',
    required_documents: ['사업화계획서', '매출 증빙서류 또는 투자계약서', '사업자등록증명원'],
    application_notes: '매출 1억원 이상 또는 투자 유치 이력 필수. K-스타트업 포털 접수.',
  },
  {
    rank: 16,
    program_name: '창업생태계 활성화 사업',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: '창업진흥원',
    fit_score: 75,
    recommendation_reason:
      '디지털·AI 분야 창업 초기 기업의 사업화 자금 및 멘토링을 지원합니다. 공고 예정 사업으로 사전 준비가 필요합니다.',
    support_amount: '최대 1억원 (사업화 지원)',
    deadline: '2026.08.15',
    status: 'upcoming',
    required_documents: ['사업계획서', '창업사실확인서', '사업자등록증'],
    application_notes: '공고 예정. 접수 시작 전 준비 권장.',
  },
  {
    rank: 23,
    program_name: '벤처창업혁신 성장 지원',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: '창업진흥원',
    fit_score: 60,
    recommendation_reason: '벤처 인증 기업 대상 글로벌 진출 및 사업화 고도화를 지원합니다.',
    support_amount: '최대 5천만원',
    deadline: '2026.09.20',
    status: 'open',
    required_documents: ['벤처기업확인서', '사업계획서'],
    application_notes: '벤처기업확인서 소지 기업만 신청 가능.',
  },

  // ── NTIS ──────────────────────────────────────────────────────
  {
    rank: 10,
    program_name: '정보통신방송 기술개발사업',
    source: 'NTIS',
    source_portal_url: 'https://www.ntis.go.kr/rndgate/eg/rnsw/pbancList.do',
    organization: '정보통신기획평가원(IITP)',
    fit_score: 67,
    recommendation_reason:
      'ICT 융합 분야 원천·응용 기술 개발 지원 사업으로 AI, 클라우드 분야가 포함됩니다. 경쟁이 치열하여 기술력이 검증된 기업에게 유리합니다.',
    support_amount: '최대 5억원/년 (정부 출연)',
    deadline: '2026.09.10',
    status: 'open',
    required_documents: ['기술개발계획서', '연구팀 구성 현황', '기업부설연구소 증명서'],
    application_notes: '기업부설연구소 또는 연구전담부서 필수. 전년도 R&D 투자 실적 제출 필요.',
  },
  {
    rank: 14,
    program_name: '소재부품장비 기술개발사업',
    source: 'NTIS',
    source_portal_url: 'https://www.ntis.go.kr/rndgate/eg/rnsw/pbancList.do',
    organization: '한국산업기술평가관리원(KEIT)',
    fit_score: 83,
    recommendation_reason:
      '소재·부품·장비 분야의 AI 기반 디지털 전환 기술 개발을 지원합니다. 제조 공정 자동화에 AI 플랫폼을 접목한 과제에 적합합니다.',
    support_amount: '최대 3억원/년 (정부 75%)',
    deadline: '2026.07.10',
    status: 'open',
    required_documents: ['기술개발계획서', '협력기관 협약서(해당시)', '기업부설연구소 증명서'],
    application_notes: '소재부품장비 분야 연계 적용 기술 필수. 산학연 컨소시엄 구성 시 우대.',
  },
  {
    rank: 15,
    program_name: '스마트서비스 R&D 사업',
    source: 'NTIS',
    source_portal_url: 'https://www.ntis.go.kr/rndgate/eg/rnsw/pbancList.do',
    organization: '정보통신산업진흥원(NIPA)',
    fit_score: 77,
    recommendation_reason:
      '기업 서비스의 AI·클라우드 기반 스마트화 전환 R&D를 지원합니다. SaaS 방식의 AI 업무자동화 플랫폼 개발 과제에 적합합니다.',
    support_amount: '최대 2억원 (정부 67%)',
    deadline: '2026.07.31',
    status: 'open',
    required_documents: ['개발계획서', '사업자등록증', '기업부설연구소 증명서'],
    application_notes: '클라우드 기반 서비스화 계획 포함 필수.',
  },
  {
    rank: 22,
    program_name: '산학연협력 선도대학 육성사업',
    source: 'NTIS',
    source_portal_url: 'https://www.ntis.go.kr/rndgate/eg/rnsw/pbancList.do',
    organization: '한국연구재단(NRF)',
    fit_score: 66,
    recommendation_reason:
      '대학과의 공동 연구를 통해 AI 원천기술 개발을 지원받을 수 있습니다. 자체 연구 역량을 보완하기 위한 산학 협력 과제에 적합합니다.',
    support_amount: '최대 2억원 (산학 공동 과제)',
    deadline: '2026.06.30',
    status: 'open',
    required_documents: ['산학협력 협약서', '대학 참여교수 동의서', '사업계획서'],
    application_notes: '대학 파트너 사전 섭외 필수. NRF e-R&D 시스템 접수.',
  },

  // ── RNDGATE ───────────────────────────────────────────────────
  {
    rank: 9,
    program_name: 'R&D 혁신바우처 (기술개발 연계)',
    source: 'RNDGATE',
    source_portal_url: 'https://www.rndgate.go.kr/',
    organization: '중소기업진흥공단(KOSME)',
    fit_score: 70,
    recommendation_reason:
      '중소기업이 대학·연구소의 R&D 역량을 바우처로 활용하는 사업입니다. 자체 연구 역량이 부족한 경우 외부 전문기관 연계로 개발이 가능합니다.',
    support_amount: '최대 5천만원 (바우처 방식)',
    deadline: '2026.08.20',
    status: 'open',
    required_documents: ['바우처 신청서', '기술개발 수요 기술서', '사업자등록증', '중소기업확인서'],
    application_notes: '공급기관(대학·연구소) 선택 후 매칭 신청. 중진공 온라인 시스템 접수.',
  },
  {
    rank: 19,
    program_name: '규제자유특구 혁신사업 R&D',
    source: 'RNDGATE',
    source_portal_url: 'https://www.rndgate.go.kr/',
    organization: '중소벤처기업부',
    fit_score: 65,
    recommendation_reason:
      '규제자유특구 내 AI 실증 실험을 지원합니다. 공고 예정으로 해당 특구 지역 내 사업장이 있거나 이전 예정인 경우 적합합니다.',
    support_amount: '최대 1억원 (실증 비용 지원)',
    deadline: '2026.07.25',
    status: 'upcoming',
    required_documents: ['실증계획서', '특구 내 사업장 증빙', '사업자등록증'],
    application_notes: '규제자유특구 지정 지역 내 사업장 필수. 공고 전 특구 정보 사전 확인 필요.',
  },
  {
    rank: 20,
    program_name: 'R&D 공유인프라 활용지원',
    source: 'RNDGATE',
    source_portal_url: 'https://www.rndgate.go.kr/',
    organization: '한국산업기술평가관리원(KEIT)',
    fit_score: 69,
    recommendation_reason:
      '고가 연구 장비나 시험 설비를 공동 활용하여 개발 비용을 절감할 수 있습니다. AI 하드웨어 인프라 확보가 필요한 경우 활용 가능합니다.',
    support_amount: '장비 활용비 최대 70% 지원',
    deadline: '2026.07.20',
    status: 'open',
    required_documents: ['활용계획서', '장비 활용 수요서', '사업자등록증'],
    application_notes: '공유 장비 보유기관 사전 확인 필요. 온라인 신청.',
  },

  // ── 부처공고 ──────────────────────────────────────────────────
  {
    rank: 5,
    program_name: '산업기술혁신사업 (산업디지털전환)',
    source: '부처공고',
    source_portal_url: 'https://www.keit.re.kr/user/bbs/BD_selectBbsList.do',
    organization: '한국산업기술평가관리원(KEIT)',
    fit_score: 82,
    recommendation_reason:
      '산업 디지털 전환 지원 과제 내 AI/SW 분야 포함. 컨소시엄 구성 시 가점 적용. 제시된 R&D 목표가 산업 현장 적용 중심이라면 적합도가 더 높습니다.',
    support_amount: '최대 3억원/년 (정부 67%, 자부담 33%)',
    deadline: '2026.06.20',
    status: 'open',
    required_documents: ['기술개발계획서', '컨소시엄 협약서(해당시)', '기업부설연구소 증명서'],
    application_notes: '기업부설연구소 또는 연구전담부서 필수. e-R&D 시스템 접수.',
  },
  {
    rank: 7,
    program_name: 'K-Digital Credit (디지털 역량강화)',
    source: '부처공고',
    source_portal_url: 'https://www.hrd.go.kr/hrdp/co/pcobo/PCOBO0100P.do',
    organization: '한국산업인력공단',
    fit_score: 76,
    recommendation_reason:
      'AI/SW 개발 역량 강화 과정 운영 기관으로 등록 시 훈련비를 지원받는 방식입니다. 내부 인력 교육 및 채용 연계에 유용합니다.',
    support_amount: '훈련비 최대 100% 지원 (기업 규모별 차등)',
    deadline: '2026.09.30',
    status: 'open',
    required_documents: ['훈련기관 등록 신청서', '훈련 과정 계획서', '강사 자격 증빙'],
    application_notes: '훈련기관 사전 인증 필요 (약 1~2개월 소요). HRD-Net 시스템 신청.',
  },
  {
    rank: 17,
    program_name: '디지털뉴딜 기술개발사업',
    source: '부처공고',
    source_portal_url: 'https://www.nipa.kr/notification/biz_list.it',
    organization: '정보통신산업진흥원(NIPA)',
    fit_score: 72,
    recommendation_reason:
      'AI·데이터·클라우드 기반 디지털 전환 기술 개발 사업입니다. 공고 예정으로 사업계획 초안을 미리 준비해두면 유리합니다.',
    support_amount: '최대 2억원 (정부 70%)',
    deadline: '2026.08.30',
    status: 'upcoming',
    required_documents: ['기술개발계획서', '사업자등록증', '납세증명서'],
    application_notes: '공고 예정. NIPA K-ICT 포털 접수 예정.',
  },
  // closed — 기본 결과에서 제외
  {
    rank: 26,
    program_name: '도시재생 혁신기술 실증사업',
    source: '부처공고',
    source_portal_url: 'https://www.molit.go.kr/USR/WPGE0201/m_36459/DTL.jsp',
    organization: '국토교통부',
    fit_score: 58,
    recommendation_reason: '도시재생 특구 내 스마트 기술 실증 사업입니다.',
    support_amount: '최대 5천만원',
    deadline: '2026.05.10',
    status: 'closed',
    required_documents: ['실증계획서'],
    application_notes: '마감된 공고입니다.',
  },

  // ── 지자체/TP ─────────────────────────────────────────────────
  {
    rank: 8,
    program_name: '지역혁신클러스터 육성사업',
    source: '지자체/TP',
    source_portal_url: 'https://www.gtp.or.kr/',
    organization: '경기테크노파크(GTP)',
    fit_score: 73,
    recommendation_reason:
      '지역 기반 혁신 생태계 구축 사업으로 지역 기업을 우대합니다. 경기 지역 내 사업장이 있는 경우 적합합니다.',
    support_amount: '최대 5천만원 (정부 70%, 지방비 30%)',
    deadline: '2026.07.05',
    status: 'open',
    required_documents: ['사업계획서', '지역 소재 사업장 증빙', '협력기관 협약서'],
    application_notes: '경기 지역 사업장 등록 필수. 지역별 우선 분야 확인 후 신청 권장.',
  },
  {
    rank: 18,
    program_name: '지역혁신 중소기업 기술지원',
    source: '지자체/TP',
    source_portal_url: 'https://www.itp.or.kr/',
    organization: '인천테크노파크(ITP)',
    fit_score: 68,
    recommendation_reason:
      '인천 지역 중소기업 대상 AI·SW 기술 개발 지원사업입니다. 지역 가점이 적용되어 타 지역 기업 대비 진입 장벽이 낮습니다.',
    support_amount: '최대 3천만원 (지자체 보조)',
    deadline: '2026.06.30',
    status: 'open',
    required_documents: ['사업계획서', '인천 소재 사업장 증빙', '사업자등록증'],
    application_notes: '인천 소재 사업장 필수. 인천테크노파크 온라인 접수.',
  },

  // ── IRIS 범부처통합연구지원시스템 ────────────────────────────
  {
    rank: 11,
    program_name: '국가R&D 혁신역량 강화사업 (AI·SW 분야)',
    source: 'IRIS',
    // announcement_url: 미설정 — IRIS 개별 공고 상세는 로그인 후 접근 가능
    source_portal_url: 'https://www.iris.go.kr/resources/nui/index.do',
    organization: '정보통신기획평가원(IITP)',
    fit_score: 88,
    recommendation_reason:
      '범부처 국가 R&D 과제로 AI·SW 원천기술 개발을 지원합니다. 연구개발계획서 접수형 과제로 기술력과 연구팀 구성이 핵심 평가 지표입니다.',
    support_amount: '최대 5억원/년 (정부 출연)',
    deadline: '2026.07.20',
    status: 'open',
    required_documents: ['연구개발계획서', '연구팀 구성현황', '기업부설연구소 증명서', '연구책임자 이력서', '참여기관 협약서'],
    application_notes:
      '소관부처: 과학기술정보통신부. 전문기관: IITP. 연구개발계획서 접수형 과제. 접수기간: 2026.06.01~07.20. IRIS 시스템(iris.go.kr) 온라인 접수.',
  },
  {
    rank: 12,
    program_name: '범부처 R&D 연계과제 (디지털·AI 융합)',
    source: 'IRIS',
    source_portal_url: 'https://www.iris.go.kr/resources/nui/index.do',
    organization: '한국연구재단(NRF)',
    fit_score: 84,
    recommendation_reason:
      '산업부·과기부·중기부가 공동으로 지원하는 범부처 연계 R&D 과제입니다. AI 플랫폼을 산업 현장에 적용하는 융합 연구에 매우 적합합니다.',
    support_amount: '최대 4억원/년 (복수 부처 공동 출연)',
    deadline: '2026.06.25',
    status: 'open',
    required_documents: ['연구개발계획서', '부처별 연계 협약서', '기업부설연구소 증명서', '연구책임자 서약서'],
    application_notes:
      '소관부처: 산업부·과기부 공동. 전문기관: NRF. 연구개발계획서 접수형 과제. 접수기간: 2026.05.15~06.25. IRIS 시스템 접수 필수.',
  },
  {
    rank: 13,
    program_name: '바이오·AI 융합 혁신기술 개발사업',
    source: 'IRIS',
    source_portal_url: 'https://www.iris.go.kr/resources/nui/index.do',
    organization: '범부처신약개발사업단(KDDF)',
    fit_score: 78,
    recommendation_reason:
      '바이오·헬스케어 영역에 AI를 접목한 융합 R&D를 지원합니다. AI 플랫폼의 의료·바이오 분야 적용 계획이 있다면 적합도가 높아집니다.',
    support_amount: '최대 3억원/년 (정부 출연)',
    deadline: '2026.08.31',
    status: 'upcoming',
    required_documents: ['연구개발계획서', '바이오 분야 전문가 참여 계획', '임상 시험 계획(해당시)'],
    application_notes:
      '소관부처: 보건복지부·과기부. 전문기관: KDDF. 연구개발계획서 접수형 과제. 공고 예정. IRIS 시스템 접수.',
  },

  // ── 의도적 중복 (dedup 테스트용) ──────────────────────────────
  // rank:27 → rank:1과 동일 키 → fit_score 78 < 94 → dedup 시 제거됨
  {
    rank: 27,
    program_name: '2026년 중소기업 기술혁신개발사업',
    source: '기업마당',
    source_portal_url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
    organization: '중소기업기술정보진흥원(TIPA)',
    fit_score: 78,
    recommendation_reason: '중복 항목 (dedup 테스트용)',
    support_amount: '최대 1억원 (정부 75%)',
    deadline: '2026.06.30',
    status: 'open',
    required_documents: ['사업계획서'],
    application_notes: '중복 공고 — dedup 로직 검증용.',
  },
  // rank:28 → rank:3과 동일 키 → fit_score 71 < 89 → dedup 시 제거됨
  {
    rank: 28,
    program_name: 'AI 바우처 지원사업 (공급기업)',
    source: 'K-Startup',
    source_portal_url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
    organization: '정보통신산업진흥원(NIPA)',
    fit_score: 71,
    recommendation_reason: '중복 항목 (dedup 테스트용)',
    support_amount: '기업당 최대 3억원',
    deadline: '2026.06.10',
    status: 'open',
    required_documents: ['신청서'],
    application_notes: '중복 공고 — dedup 로직 검증용.',
  },
];
