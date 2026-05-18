# Miracle-Cowork AgentPack v1.0 릴리스 후보 문서

> 작성일: 2026-05-18  
> 현재 버전: v0.9-phase1h-patent-commercialization (master)  
> 목표 버전: v1.0-release

---

## 1. 태그 이력 (버전 히스토리)

| 태그 | 내용 | 커밋 |
|---|---|---|
| `v0.1-mvp-scaffold` | 프로젝트 초기 스캐폴딩 (FastAPI + React) | `d16d80d` |
| `v0.2-phase1a-rd-proposal` | 정부 R&D 10개 Agent 고도화 | `a243583` |
| `v0.3-phase1b-meeting-work` | 회의/업무관리 7개 Agent 고도화 | `296fbbc` |
| `v0.4-phase1c-rd-deliverables` | 연구개발 산출물 8개 Agent 고도화 | `e2e1fde` |
| `v0.5-phase1d-knowledge-document` | 문서/지식관리 7개 Agent 고도화 | `74e95c4` |
| `v0.6-phase1e-planning-strategy` | 기획/전략 문서 7개 Agent 고도화 | `e853087` |
| `v0.7-phase1f-sales-proposal` | 제안/영업/고객 대응 7개 Agent 고도화 | `3050e24` |
| `v0.8-phase1g-claude-code-dev` | 개발협업/Claude Code 연계 6개 Agent 고도화 | `22e8b93` |
| `v0.9-phase1h-patent-commercialization` | 특허/기술사업화 5개 Agent 고도화 | `a8b5ae3` |

---

## 2. 전체 Agent 목록 (8개 영역 57개)

### 2-1. 정부 R&D / 지원사업 대응 `government_rd` — 10개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | government_announcement_analysis | 정부 R&D 공고문 분석 |
| 2 | application_eligibility_review | 신청 자격성 검토 |
| 3 | business_plan_writing | 사업계획서 작성 |
| 4 | rd_plan_writing | 연구개발계획서 작성 |
| 5 | evaluation_criteria_response | 평가기준 대응표 |
| 6 | submission_checklist | 제출서류 체크리스트 |
| 7 | budget_calculation | 사업비 산정내역 |
| 8 | research_team_composition | 연구팀 구성 및 인력정보 작성 |
| 9 | wbs_schedule | WBS/일정계획표 |
| 10 | final_submission_review | 최종 제출 검토 |

### 2-2. 기획 / 전략 문서 작성 `planning_strategy` — 7개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | project_planning | 과제기획서 작성 |
| 2 | business_strategy | 사업전략서 작성 |
| 3 | business_model_design | 비즈니스모델 설계 |
| 4 | market_research_report | 시장조사 보고서 |
| 5 | competitive_analysis | SWOT 분석 |
| 6 | ir_draft | IR 자료 초안 |
| 7 | jv_proposal | JV/합작 제안서 |

### 2-3. 회의 / 업무관리 `meeting_work` — 7개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | meeting_minutes | 회의록 작성 |
| 2 | todo_extraction | To-do 추출 |
| 3 | work_instruction | 업무지시서 작성 |
| 4 | weekly_report | 주간업무보고서 |
| 5 | monthly_report | 월간업무보고서 |
| 6 | issue_risk_management | 이슈/리스크 관리 |
| 7 | decision_record | 의사결정 기록 |

### 2-4. 연구개발 프로세스 산출물 `rd_deliverables` — 8개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | requirements_definition | 요구정의서 작성 |
| 2 | function_specification | 기능명세서 작성 |
| 3 | screen_design | 화면설계서 |
| 4 | db_design | DB 설계 초안 |
| 5 | api_specification | API 명세서 |
| 6 | test_cases | 테스트케이스 |
| 7 | deliverable_management | 산출물 관리표 |
| 8 | dev_wbs | 개발 WBS |

### 2-5. 제안 / 영업 / 고객 대응 `proposal_sales` — 7개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | customer_proposal | 고객 제안서 작성 |
| 2 | company_introduction | 회사소개서 작성 |
| 3 | product_introduction | 제품소개서 |
| 4 | quote_proposal | 견적 제안서 |
| 5 | customer_meeting_prep | 고객 미팅 준비 |
| 6 | customer_reply_email | 고객 회신 이메일 |
| 7 | poc_proposal | PoC 제안서 |

### 2-6. 문서 / 지식관리 `knowledge_document` — 7개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | document_summary | 문서 요약 |
| 2 | document_comparison | 문서 비교 |
| 3 | material_search | 자료 검색 |
| 4 | template_creation | 템플릿 생성 |
| 5 | document_quality_review | 문서 품질검토 |
| 6 | toc_auto_generation | 목차 자동생성 |
| 7 | summary_report | 요약보고서 |

### 2-7. 특허 / 기술사업화 `patent_commercialization` — 5개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | patent_idea_organization | 특허 아이디어 정리 |
| 2 | patent_application_draft | 특허명세서 초안 |
| 3 | prior_art_comparison | 선행기술 비교 |
| 4 | tech_commercialization_strategy | 기술사업화 전략 |
| 5 | certification_test_plan | 인증/시험계획 |

### 2-8. 개발 협업 / Claude Code 연계 `claude_code_dev` — 6개

| # | agent_id | 기능명 |
|---|---|---|
| 1 | claude_code_prompt | Claude Code 프롬프트 생성 |
| 2 | folder_structure_design | 폴더구조 설계 |
| 3 | code_review | 코드리뷰 |
| 4 | bug_report | 버그 리포트 |
| 5 | dev_doc_automation | 개발문서 자동화 |
| 6 | test_automation | 테스트 자동화 |

---

## 3. Phase별 주요 개선 내용

### Phase 1-A: 정부 R&D (v0.2)
- 10개 Agent 출력 템플릿 고도화 (기존 stub → 실무 수준 문서 구조)
- 공고문 분석 → 자격 검토 → 계획서 작성 → 예산 → WBS → 최종 검토 전 주기 커버
- 정부 R&D 실무 문서체 적용 (과학기술정보통신부 양식 기준)

### Phase 1-B: 회의/업무관리 (v0.3)
- 7개 Agent 출력 템플릿 고도화
- 회의록, To-do, 업무지시, 주간/월간 보고, 이슈 관리, 의사결정 기록 전 주기
- 기업 내부 문서 포맷에 맞는 구조화된 출력 적용

### Phase 1-C: 연구개발 산출물 (v0.4)
- 5개 신규 메서드 구현 (screen_design, db_design, api_specification, test_cases, dev_wbs)
- SW 개발 산출물 표준(ISO/IEC 기반) 구조 적용
- ERD 테이블 설계, RESTful API 명세, BDD 스타일 테스트케이스 포함

### Phase 1-D: 문서/지식관리 (v0.5)
- 7개 Agent 출력 고도화
- 다문서 비교, 품질검토 체크리스트, 목차 자동생성 기능 포함
- 지식관리 실무 워크플로우 반영

### Phase 1-E: 기획/전략 (v0.6)
- 7개 Agent 출력 고도화
- TAM/SAM/SOM 시장 분석, SWOT/포터 5-Forces, IR 투자자 관점 문서 포함
- 스타트업 ~ 중견기업 수준의 전략 문서 커버

### Phase 1-F: 제안/영업 (v0.7)
- 7개 Agent 신규 구현 (proposal_sales 영역 전체)
- 고객 제안서, 회사/제품 소개서, 견적, 미팅 준비, 이메일, PoC 제안 전 주기
- 세일즈 실무 관점의 문서 구조 및 설득력 있는 표현 적용

### Phase 1-G: 개발협업/Claude Code 연계 (v0.8)
- 6개 Agent 고도화 (기존 2개 업그레이드 + 4개 신규)
- Claude Code 특화 프롬프트 생성, Git/PR 기반 코드리뷰, 버그 리포트 구조화
- 개발 → 테스트 → 문서화 자동화 전 주기 커버

### Phase 1-H: 특허/기술사업화 (v0.9)
- 5개 Agent 신규 구현 (patent_commercialization 영역 전체)
- 특허 명세서 초안 (IPC 분류, 청구항 포함), 선행기술 신규성/진보성 분석
- 기술사업화 전략 (TAM/SAM/SOM, KPI, 로드맵), GS인증/ISMS/CSAP 대응 시험계획
- 법적 면책 고지 포함 (변리사 검토 권고)

---

## 4. 기술 스택 및 아키텍처 현황

### Backend
| 항목 | 내용 |
|---|---|
| 언어 | Python 3.11 |
| 프레임워크 | FastAPI |
| Agent 실행 엔진 | `MockAgentRunner` (mock_runner.py) |
| 실행 방식 | 동기 함수 호출 (async 미적용) |
| 데이터 저장 | 파일 기반 (JSON config) |

### Frontend
| 항목 | 내용 |
|---|---|
| 언어/프레임워크 | TypeScript / React |
| 주요 화면 | Dashboard, AreaDetail (Agent 목록/실행) |
| API 연동 | FastAPI REST API |

### 핵심 설정 파일
| 파일 | 역할 |
|---|---|
| `config/agents.json` | 57개 Agent 설정 (input_schema 포함) |
| `config/areas.json` | 8개 업무 영역 설정 |
| `backend/app/agent_engine/mock_runner.py` | Agent 출력 템플릿 엔진 |

---

## 5. Mock 기반 기능 vs 실제 LLM 연동 필요 기능

### 현재 Mock 기반 (템플릿 출력)
- **전체 57개 Agent 출력**: `MockAgentRunner`가 `inp.get()` 값으로 f-string 템플릿을 채워 반환
- 입력값이 달라도 **구조는 동일**, 실제 추론 없음
- 장점: 빠른 UI/UX 검증, 백엔드 의존성 없음, 오프라인 동작 가능

### 실제 LLM 연동 시 대체 필요 기능

| 기능 | 현재 방식 | LLM 연동 후 |
|---|---|---|
| 공고문 분석 | 템플릿 삽입 | 실제 공고문 파싱 + 자격요건 AI 분석 |
| 사업계획서 생성 | 고정 구조 템플릿 | 입력 기반 맞춤형 문서 생성 |
| 회의록 작성 | 샘플 항목 나열 | 음성/텍스트 → 실시간 요약·구조화 |
| 선행기술 비교 | 입력값 나열 | 특허DB 연동 + AI 유사도 분석 |
| 시장조사 보고서 | 고정 수치 예시 | 실시간 시장 데이터 수집 + 분석 |
| 코드리뷰 | 체크리스트 나열 | 실제 코드 파일 분석 + 개선안 제시 |
| 문서 요약/비교 | 포맷 안내만 제공 | 첨부 문서 파싱 + LLM 요약 |

---

## 6. v1.0 릴리스 전 점검 체크리스트

### 필수 완료 항목

- [ ] **실제 LLM API 연동** — `MockAgentRunner` → `LLMAgentRunner` 전환 (최소 1개 영역 PoC)
- [ ] **사용자 인증** — 로그인/회원가입 (현재 없음)
- [ ] **출력 저장 기능** — DB 또는 파일 저장 (현재 UI에서만 복사 가능)
- [ ] **에러 핸들링** — LLM 타임아웃, 토큰 초과, API 오류 처리
- [ ] **환경변수 관리** — `.env` 파일로 API 키 분리 (현재 하드코딩 없으나 구조 정비 필요)

### 권장 완료 항목

- [ ] **비동기 처리** — FastAPI `async` + 스트리밍 응답 (현재 동기)
- [ ] **로딩 상태 UI** — LLM 응답 대기 중 스피너/스트리밍 표시
- [ ] **출력 히스토리** — 이전 생성 결과 조회 기능
- [ ] **입력 유효성 검증** — 필수 필드 누락 시 프론트엔드 경고
- [ ] **반응형 UI** — 모바일/태블릿 대응

### 품질 검증 항목

- [ ] **전 영역 E2E 테스트** — 브라우저에서 57개 Agent 실행 확인
- [ ] **API 응답 속도** — LLM 연동 후 평균 응답시간 측정 (목표: 30초 이내)
- [ ] **보안 점검** — 입력값 XSS/인젝션 방어 확인
- [ ] **배포 환경 테스트** — Docker/클라우드 환경 구동 확인

---

## 7. Phase 2: 실제 LLM API 연동 계획

### 목표
`MockAgentRunner` 기반 템플릿 출력을 실제 Claude API 호출로 전환하여 진정한 AI 문서 자동화 서비스 구현

### 아키텍처 전환 방향

```
[현재 Phase 1]
Frontend → FastAPI → MockAgentRunner → 템플릿 출력

[Phase 2 목표]
Frontend → FastAPI → LLMAgentRunner → Claude API → 실시간 스트리밍 출력
                         ↕
                   PromptBuilder (agents.json 기반)
```

### 구현 단계

| 단계 | 내용 | 예상 기간 |
|---|---|---|
| 2-1 | `LLMAgentRunner` 클래스 설계 및 Claude API 연동 PoC | 1주 |
| 2-2 | `PromptBuilder`: input_schema → Claude 프롬프트 자동 생성 | 1주 |
| 2-3 | 스트리밍 응답 지원 (FastAPI SSE + React EventSource) | 1주 |
| 2-4 | 1개 영역(government_rd) 완전 LLM 전환 및 품질 검증 | 1주 |
| 2-5 | 전 영역(57개 Agent) LLM 전환 | 2~3주 |
| 2-6 | 출력 품질 평가 및 프롬프트 튜닝 | 1~2주 |

### 기술 검토 사항

| 항목 | 내용 |
|---|---|
| LLM 모델 | Claude Sonnet 4.6 (기본), Opus 4.7 (고품질 문서) |
| 프롬프트 전략 | System prompt(영역별 전문가 페르소나) + Few-shot 예시 |
| 토큰 관리 | 입력 최대 4000 토큰, 출력 최대 4000 토큰 (문서 품질 고려) |
| 비용 최적화 | Haiku 4.5 (빠른 초안) → Sonnet (최종 출력) 2단계 전략 검토 |
| 캐싱 | 동일 입력 반복 시 캐시 활용 (Redis 또는 메모리 캐시) |
| 오류 처리 | 타임아웃 60초, 3회 재시도, 실패 시 Mock 폴백 옵션 |

### 프롬프트 설계 원칙
1. **영역별 전문가 페르소나** 부여 (예: "당신은 10년 경력의 정부 R&D 전문 컨설턴트입니다")
2. **출력 형식 강제** — 마크다운 구조, 섹션 헤딩, 표 형식 명시
3. **한국어 비즈니스 문서체** 지시 포함
4. **input_schema 필드** → 프롬프트 변수로 자동 매핑
5. **품질 기준** 명시 (분량, 전문성, 실무 적용 가능성)

---

## 8. 현황 요약

| 항목 | 현황 |
|---|---|
| 현재 버전 | v0.9 (master) |
| 목표 버전 | v1.0 |
| 전체 Agent 수 | 57개 (8개 영역) |
| 구현 방식 | Mock 템플릿 기반 (Phase 1 완료) |
| 다음 단계 | Phase 2 LLM API 실연동 |
| v1.0 릴리스 조건 | LLM 연동 PoC 완료 + 사용자 인증 + 출력 저장 기능 |
