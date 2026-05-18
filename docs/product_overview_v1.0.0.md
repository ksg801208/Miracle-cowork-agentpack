# Miracle-Cowork AgentPack v1.0.0 제품 개요

> AI 기반 업무 자동화 플랫폼 — 8개 영역 57개 Agent

---

## 제품 소개

Miracle-Cowork AgentPack은 중소기업·스타트업이 반복적으로 생성하는 업무 문서를 AI로 자동화하는 플랫폼입니다.  
정부 R&D 제안서, 회의록, 사업계획서, 특허 출원서 등 57종의 문서를 입력 정보만으로 즉시 생성합니다.

**핵심 가치:**
- 문서 작성 시간 80% 단축 목표
- 한국어 비즈니스 문서 특화
- Mock 모드로 즉시 체험 가능 (API Key 불필요)
- 실제 Claude API 연동으로 고품질 출력 전환 가능

---

## 8개 업무 영역 · 57개 Agent 구성

### 1. 정부 R&D (government_rd) — 10개 Agent

| Agent ID | 기능 |
|---|---|
| government_announcement_analysis | 정부 R&D 공고문 분석 |
| application_eligibility_review | 신청 자격 검토 |
| business_plan_writing | 사업계획서 작성 |
| research_proposal | 연구 제안서 작성 |
| budget_plan | 연구비 계획서 작성 |
| implementation_plan | 추진 일정 계획 |
| consortium_agreement | 컨소시엄 협약서 초안 |
| progress_report | 연구 진행 보고서 |
| final_report | 최종 성과 보고서 |
| patent_strategy | 특허 전략 수립 |

### 2. 회의/업무관리 (meeting_work) — 7개 Agent

| Agent ID | 기능 |
|---|---|
| meeting_minutes | 회의록 작성 |
| action_items | 액션 아이템 추출 |
| weekly_report | 주간 업무 보고 |
| project_status | 프로젝트 현황 보고 |
| task_assignment | 업무 분담 계획 |
| team_announcement | 팀 공지사항 작성 |
| retrospective | 회의/스프린트 회고 |

### 3. 연구개발 산출물 (rd_deliverables) — 8개 Agent

| Agent ID | 기능 |
|---|---|
| requirements_definition | 요구사항 정의서 |
| function_specification | 기능 명세서 |
| screen_design | 화면 설계서 |
| db_design | DB 설계서 |
| api_specification | API 명세서 |
| test_cases | 테스트 케이스 |
| deliverable_management | 산출물 관리 계획 |
| dev_wbs | 개발 WBS |

### 4. 지식/문서관리 (knowledge_document) — 7개 Agent

업무 매뉴얼, 교육 자료, 지식 정리, 온보딩 가이드, FAQ, 정책 문서, 운영 절차서 작성

### 5. 기획/전략 (planning_strategy) — 7개 Agent

사업 전략 보고서, 시장 분석, 경쟁사 분석, 신규 사업 기획서, OKR/KPI 설정, 중장기 로드맵, 의사결정 보고서

### 6. 제안/영업 (proposal_sales) — 7개 Agent

제안요청서(RFP) 분석, 사업 제안서, 고객 제안 PT 구성, 견적서, 영업 전략, 고객 미팅 준비, 계약 협상 전략

### 7. 개발협업/Claude Code 연계 (claude_code_dev) — 6개 Agent

코드 리뷰, 기술 문서 초안, 개발 스펙 정리, 버그 리포트 요약, PR 설명문, 릴리스 노트 초안

### 8. 특허/기술사업화 (patent_commercialization) — 5개 Agent

| Agent ID | 기능 |
|---|---|
| patent_idea_organization | 발명 아이디어 정리 |
| patent_application_draft | 특허 출원서 초안 |
| prior_art_comparison | 선행기술 비교 분석 |
| tech_commercialization_strategy | 기술 사업화 전략 |
| certification_test_plan | 인증·시험 계획서 |

---

## 주요 기능

### Agent 실행 흐름

```
대시보드 → 업무 영역 선택 → Agent 선택
→ 입력 정보 작성 → 실행 버튼 클릭
→ 결과 확인 → (선택) 프로젝트 연결 후 저장
```

### 출력 저장 및 관리

- 실행 결과를 Document로 저장 (프로젝트별 분류)
- 저장 문서 목록: 프로젝트 상세 → 저장 문서 탭
- 문서 상세 화면에서 Markdown 렌더링
- **복사** / **MD 다운로드** (.md 파일) 지원
- Word / PDF 다운로드: Phase 3 예정

### 사용자 인증

- JWT Bearer Token 기반
- 역할 구분: `admin` (전체 권한) / `manager` (관리) / `member` (기본)
- 문서 저장·삭제: 로그인 필수
- 문서 삭제: 작성자 본인 또는 admin/manager만 가능

### LLM 모드 전환

| 모드 | 설명 |
|---|---|
| Mock (기본) | 미리 작성된 템플릿 출력. API Key 불필요 |
| LLM | 실제 Claude API 호출. `ANTHROPIC_API_KEY` 설정 필요 |

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| 백엔드 | Python 3.11+, FastAPI, SQLAlchemy, SQLite |
| 프론트엔드 | React 18, TypeScript, Tailwind CSS, React Router |
| 인증 | JWT (python-jose), bcrypt (passlib) |
| LLM | Anthropic Claude API (anthropic SDK) |
| 빌드 | Vite, uvicorn |
