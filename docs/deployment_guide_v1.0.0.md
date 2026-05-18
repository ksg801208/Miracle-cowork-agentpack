# Miracle-Cowork AgentPack v1.0.0 배포 가이드

> 설치 · 실행 · 환경 설정 · 초기 계정 설정

---

## 사전 요구사항

| 항목 | 버전 |
|---|---|
| Python | 3.11 이상 |
| Node.js | 18 이상 |
| npm | 9 이상 |
| Git | 최신 버전 |

---

## 1. 소스 코드 준비

```bash
git clone <repository-url>
cd Miracle-cowork-agentpack
git checkout v1.0.0
```

---

## 2. 백엔드 설치 및 실행

### 패키지 설치

```bash
cd backend
pip install -r requirements.txt
```

### 환경 변수 설정

`backend/.env` 파일을 생성합니다. (`.env.example` 참고)

```env
# 데이터베이스
DATABASE_URL=sqlite:///./miracle_agentpack.db

# Agent 실행 모드: mock (기본) 또는 llm
AGENT_RUNNER_MODE=mock

# Claude API 설정 (LLM 모드 사용 시 필수)
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-6

# JWT 인증 설정
JWT_SECRET_KEY=your-random-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

> **주의:** `JWT_SECRET_KEY`는 반드시 충분히 긴 무작위 문자열로 변경하세요.  
> `ANTHROPIC_API_KEY`는 실제 키를 절대 Git에 커밋하지 마세요.

### 데이터베이스 초기화 및 관리자 계정 생성

```bash
cd backend
py seed_admin.py
```

출력 예시:
```
컬럼 마이그레이션 완료
관리자 계정 생성 완료
  이메일: admin@miracle.ai
  비밀번호: miracle2024!
  역할: admin
```

> **첫 로그인 후 반드시 비밀번호를 변경하세요.**

### 백엔드 서버 실행

```bash
cd backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API 서버: http://localhost:8000  
Swagger UI: http://localhost:8000/docs

---

## 3. 프론트엔드 설치 및 실행

```bash
cd frontend
npm install
npm run dev
```

개발 서버: http://localhost:5173

### 프로덕션 빌드

```bash
cd frontend
npm run build
```

`frontend/dist/` 디렉터리에 정적 파일이 생성됩니다.

---

## 4. 로그인 및 인증

### 기본 관리자 계정

```
이메일: admin@miracle.ai
비밀번호: miracle2024!
```

> seed_admin.py 실행 후 생성되는 기본 계정입니다. 운영 환경에서는 반드시 변경하세요.

### 로그인 흐름

1. http://localhost:5173 접속
2. 이메일 / 비밀번호 입력 후 로그인
3. JWT 토큰이 localStorage에 저장되어 이후 요청에 자동 포함
4. 토큰 만료(기본 60분) 시 자동으로 로그인 페이지로 이동

### API 인증 방식

```http
Authorization: Bearer <access_token>
```

모든 `/api/documents`, `/api/projects` 등 보호된 엔드포인트에 필수입니다.

---

## 5. LLM API 설정 방법

### Mock 모드 (기본)

`.env`에서 `AGENT_RUNNER_MODE=mock` 설정 시 미리 작성된 템플릿 출력.  
API Key 없이도 즉시 사용 가능합니다.

### LLM 모드 (실제 Claude API)

1. [Anthropic Console](https://console.anthropic.com)에서 API Key 발급
2. `.env` 파일 수정:

```env
AGENT_RUNNER_MODE=llm
ANTHROPIC_API_KEY=<your-anthropic-api-key>
ANTHROPIC_MODEL=claude-sonnet-4-6
```

3. 백엔드 서버 재시작

> API Key가 없거나 잘못된 경우 자동으로 Mock 모드로 폴백됩니다.

---

## 6. 출력 저장 및 다운로드

### 저장 방법

1. Agent 실행 후 결과 확인
2. (선택) 프로젝트 연결 드롭다운에서 프로젝트 선택
3. **저장** 버튼 클릭 → Document 저장 완료

### 저장 문서 조회

- 상단 메뉴 → **프로젝트** → 프로젝트 선택 → **저장 문서** 탭

### Markdown 다운로드

- 저장 문서 목록의 **↓ MD** 버튼 클릭
- 문서 상세 화면의 **↓ MD 다운로드** 버튼 클릭
- `.md` 파일로 자동 저장

---

## 7. 주요 API 엔드포인트

| 메서드 | 엔드포인트 | 인증 | 설명 |
|---|---|---|---|
| `POST` | `/api/auth/login` | 불필요 | 로그인 |
| `GET` | `/api/auth/me` | 필수 | 내 정보 조회 |
| `POST` | `/api/auth/logout` | 필수 | 로그아웃 |
| `GET` | `/api/areas` | 불필요 | 업무 영역 목록 |
| `GET` | `/api/agents` | 불필요 | 전체 Agent 목록 |
| `POST` | `/api/agents/{id}/run` | 필수 | Agent 실행 |
| `POST` | `/api/documents` | 필수 | 문서 저장 |
| `GET` | `/api/projects/{id}/documents` | 필수 | 프로젝트 문서 목록 |
| `GET` | `/api/documents/{id}` | 필수 | 문서 상세 조회 |
| `GET` | `/api/documents/{id}/download` | 필수 | Markdown 다운로드 |
| `DELETE` | `/api/documents/{id}` | 필수 | 문서 삭제 |

---

## 8. 알려진 제한사항 및 주의사항

| 항목 | 내용 |
|---|---|
| 데이터베이스 | SQLite — 소규모 팀 환경 적합. 대규모 동시 접속 시 PostgreSQL 전환 권장 |
| LLM 모드 | `AGENT_RUNNER_MODE=llm` + 유효한 API Key 설정 필요 |
| Word/PDF | 미구현. Markdown(.md) 다운로드만 지원 |
| 토큰 갱신 | Refresh Token 없음 — 만료 시 재로그인 필요 |
| 이메일 인증 | 미구현 — 관리자가 직접 계정 관리 |
| HTTPS | 개발용 HTTP. 운영 환경에서는 Nginx + SSL 설정 필요 |

---

## 9. 디렉터리 구조

```
Miracle-cowork-agentpack/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI 라우터
│   │   ├── agent_engine/ # AgentRunner (Mock/LLM)
│   │   ├── core/         # config, security, database
│   │   ├── models/       # SQLAlchemy 모델
│   │   └── schemas/      # Pydantic 스키마
│   ├── seed_admin.py     # DB 초기화 + 관리자 계정 생성
│   ├── requirements.txt
│   └── .env              # 환경 변수 (Git 제외)
├── frontend/
│   └── src/
│       ├── pages/        # 주요 화면 (Dashboard, AgentRun, DocumentDetail 등)
│       ├── components/   # 공용 컴포넌트
│       ├── services/     # API 클라이언트
│       └── contexts/     # AuthContext
├── config/
│   ├── agents.json       # 57개 Agent 설정
│   └── areas.json        # 8개 영역 설정
└── docs/                 # 문서
```

---

## 10. 향후 Phase 3 개발 후보

| 후보 | 설명 |
|---|---|
| Phase 3-A | Claude API 전환 + 프롬프트 최적화 |
| Phase 3-B | Word(.docx) / PDF 다운로드 지원 |
| Phase 3-C | 팀 협업 — 문서 공유, 댓글, 버전 이력 |
| Phase 3-D | 프로젝트 대시보드 — 통계, Agent 사용량 분석 |
| Phase 3-E | 사용자 초대, 이메일 인증, 비밀번호 재설정 |
| Phase 3-F | Agent 커스터마이징 — 사용자 정의 프롬프트 |
| Phase 3-G | PostgreSQL 전환 및 Docker Compose 배포 |
