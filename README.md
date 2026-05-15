# Miracle-Cowork AgentPack MVP

기업형 AI Agent 플랫폼 — 미라클에이지아이의 사무업무 자동화 솔루션

---

## 프로젝트 소개

Miracle-Cowork AgentPack은 8개 업무 영역, 57개 AI Agent로 구성된 기업형 업무자동화 플랫폼입니다.
사용자는 대시보드에서 영역을 선택하고 Agent를 실행하여 사업계획서, 회의록, 기능명세서, 이메일 등 다양한 업무 문서를 자동으로 생성할 수 있습니다.

---

## 주요 기능

- **8개 업무 영역 대시보드** — 영역별 Agent 탐색 및 빠른 실행
- **57개 AI Agent** — 정부 R&D, 기획, 회의관리, 개발 산출물, 영업, 지식관리, 특허, Claude Code 연계
- **동적 입력 폼** — Agent별 입력 스키마에 따른 자동 폼 렌더링
- **Mock Agent Runner** — 우선순위 12개 Agent 고품질 한국어 문서 생성
- **프로젝트 관리** — Agent 실행 결과를 프로젝트에 연결하여 산출물 관리
- **실행 이력** — AgentRun 저장 및 조회
- **문서 저장** — 생성 결과를 Markdown 문서로 저장 및 복사
- **LLM Provider 인터페이스** — 실제 LLM(GPT-4o, Claude, Local LLM)으로 교체 가능한 추상화 구조

---

## 기술 스택

| 구분 | 기술 |
|-----|-----|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| DB | SQLite (MVP), SQLAlchemy ORM |
| Agent Engine | Mock Runner (LLM Provider 인터페이스 분리) |
| 문서 렌더링 | react-markdown + remark-gfm |
| API 통신 | Axios (Vite proxy 설정) |

---

## 폴더 구조

```
Miracle-cowork-agentpack/
├── frontend/                    # React + Vite 프론트엔드
│   ├── src/
│   │   ├── components/          # 재사용 UI 컴포넌트
│   │   ├── pages/               # 라우트 페이지
│   │   ├── layouts/             # 레이아웃
│   │   ├── services/            # API 호출 (api.ts)
│   │   ├── types/               # TypeScript 타입
│   │   └── utils/               # 유틸리티 함수
│   └── package.json
│
├── backend/                     # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── core/                # DB, 설정
│   │   ├── models/              # SQLAlchemy 모델
│   │   ├── schemas/             # Pydantic 스키마
│   │   ├── api/                 # API 라우터
│   │   ├── services/            # 비즈니스 로직
│   │   └── agent_engine/        # Agent 실행 엔진
│   │       ├── llm_provider.py  # LLM Provider 인터페이스
│   │       └── mock_runner.py   # Mock Agent Runner
│   └── requirements.txt
│
├── config/
│   ├── areas.json               # 8개 업무 영역 정의
│   ├── agents.json              # 57개 Agent 레지스트리
│   └── workflow_routes.json     # 워크플로우 라우트
│
├── prompts/                     # Agent별 프롬프트 템플릿
├── schemas/                     # 입출력 스키마 정의
└── docs/                        # 문서
```

---

## Backend 실행 방법

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API 문서: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## Frontend 실행 방법

```bash
cd frontend
npm install
npm run dev
```

- 앱 주소: http://localhost:5173
- Vite proxy로 `/api` 요청이 `localhost:8000`으로 자동 전달됩니다

---

## API 목록

| Method | Endpoint | 설명 |
|--------|---------|------|
| GET | `/api/areas` | 8개 영역 목록 |
| GET | `/api/areas/{area_id}` | 영역 상세 |
| GET | `/api/areas/{area_id}/agents` | 영역별 Agent 목록 |
| GET | `/api/agents` | 전체 57개 Agent |
| GET | `/api/agents/{agent_id}` | Agent 상세 |
| POST | `/api/agents/{agent_id}/run` | Agent 실행 |
| GET | `/api/agent-runs/{run_id}` | 실행 결과 조회 |
| POST | `/api/projects` | 프로젝트 생성 |
| GET | `/api/projects` | 프로젝트 목록 |
| GET | `/api/projects/{id}` | 프로젝트 상세 |
| GET | `/api/projects/{id}/agent-runs` | 프로젝트별 실행 이력 |
| GET | `/api/projects/{id}/documents` | 프로젝트 문서 목록 |
| POST | `/api/documents` | 문서 저장 |
| POST | `/api/tasks` | 업무 생성 |
| GET | `/api/projects/{id}/tasks` | 프로젝트 업무 목록 |

---

## Agent Registry 구조

`config/agents.json`의 각 Agent는 다음 필드를 가집니다:

```json
{
  "agent_id": "government_announcement_analysis",
  "area_id": "government_rd",
  "name_ko": "정부 R&D 공고문 분석",
  "name_en": "Government Announcement Analysis",
  "description": "공고문을 분석하여 핵심 요건과 평가기준을 추출합니다",
  "priority": 1,
  "output_type": "document",
  "input_schema": {
    "announcement_text": {
      "type": "textarea",
      "label": "공고문 내용",
      "required": true,
      "placeholder": "공고문 전체 내용을 붙여넣기 하세요"
    }
  },
  "prompt_template_path": "prompts/government_rd/announcement_analysis.md",
  "review_rule_path": "schemas/review/govt_rd_review.json",
  "is_enabled": true
}
```

---

## 8개 AgentPack 영역

| # | 영역 | Agent 수 | 주요 기능 |
|---|-----|---------|---------|
| 1 | 정부 R&D / 지원사업 대응 | 10 | 공고문 분석, 사업계획서, 적합성 검토, WBS |
| 2 | 기획 / 전략 문서 작성 | 7 | 과제기획서, 시장조사, IR 자료, BM 설계 |
| 3 | 회의 / 업무관리 | 7 | 회의록, To-do 추출, 주간보고, 이슈관리 |
| 4 | 연구개발 프로세스 산출물 | 8 | 요구정의서, 기능명세서, API 명세, 테스트케이스 |
| 5 | 제안 / 영업 / 고객 대응 | 7 | 고객 제안서, 견적서, PoC 제안, 이메일 |
| 6 | 문서 / 지식관리 | 7 | 문서 요약, 비교, 템플릿 생성, 품질 검토 |
| 7 | 특허 / 기술사업화 | 5 | 특허 아이디어, 출원서 초안, 선행기술 비교 |
| 8 | 개발 협업 / Claude Code 연계 | 6 | Claude Code 프롬프트, 폴더구조 설계, 코드리뷰 |

---

## MVP 개발 범위

MVP에서 구현된 기능:

- [x] 8개 영역 대시보드
- [x] 영역별 Agent 목록 화면
- [x] Agent 실행 화면 (동적 입력 폼)
- [x] Mock Agent Runner (14개 Agent 고품질 출력)
- [x] 프로젝트 생성 및 목록
- [x] 프로젝트 상세 (실행 이력, 저장 문서)
- [x] AgentRun 저장 및 조회
- [x] Document 저장 (Markdown)
- [x] LLM Provider 인터페이스 분리
- [x] SQLite + SQLAlchemy ORM
- [x] Tailwind CSS 기반 반응형 UI

---

## 향후 개발 계획

### v1.1 — LLM 연동
- Claude API / OpenAI API 실제 연동
- 프롬프트 템플릿 고도화
- 결과 품질 자동 검증 (review_rule 적용)

### v1.2 — 사용자 관리
- JWT 기반 인증
- 조직/팀 관리
- 역할별 접근 권한 (RBAC)

### v2.0 — 고도화
- RAG 기반 사내 문서 연계
- Local LLM (Ollama, EXAONE) 지원
- 워크플로우 자동화 (multi-step Agent chain)
- 문서 버전 관리
- 팀 협업 및 리뷰 기능

---

## 라이선스

© 2024 MiracleAge AI. All rights reserved.
