# Miracle-Cowork AgentPack v1.0.0 릴리스 노트

> 릴리스일: 2026-05-18  
> 태그: `v1.0.0`  
> 커밋: `380eb90` (master)

---

## 릴리스 요약

Miracle-Cowork AgentPack v1.0.0은 AI 기반 업무 자동화 플랫폼의 첫 번째 정식 릴리스입니다.  
**8개 업무 영역 · 57개 Agent** 고도화, 사용자 인증, LLM API 연동 기반, Agent 출력 저장·다운로드 기능을 포함합니다.

---

## Phase별 주요 변경 이력

### Phase 1 — Agent 고도화 (v0.1 ~ v0.9)

| 태그 | Phase | 내용 |
|---|---|---|
| `v0.1` | MVP Scaffold | 프로젝트 초기 구조, FastAPI + React 기반 |
| `v0.2` | Phase 1-A | 정부 R&D 10개 Agent 고도화 |
| `v0.3` | Phase 1-B | 회의/업무관리 7개 Agent 고도화 |
| `v0.4` | Phase 1-C | 연구개발 산출물 8개 Agent 고도화 |
| `v0.5` | Phase 1-D | 지식/문서관리 7개 Agent 고도화 |
| `v0.6` | Phase 1-E | 기획/전략 문서 7개 Agent 고도화 |
| `v0.7` | Phase 1-F | 제안/영업/고객대응 7개 Agent 고도화 |
| `v0.8` | Phase 1-G | 개발협업/Claude Code 연계 6개 Agent 고도화 |
| `v0.9` | Phase 1-H | 특허/기술사업화 5개 Agent 고도화 |

### Phase 2 — 플랫폼 기능 (v0.10 ~ v0.12)

| 태그 | Phase | 내용 |
|---|---|---|
| `v0.10` | Phase 2-A | LLM API PoC — AgentRunner 추상화, AnthropicProvider, Mock/LLM 전환 |
| `v0.11` | Phase 2-B | 사용자 인증 — JWT, bcrypt, 로그인/로그아웃, ProtectedRoute, 관리자 역할 |
| `v0.12` | Phase 2-C | 출력 저장 관리 — Document 저장·조회·삭제, Markdown 다운로드, DocumentDetail 페이지 |

---

## 주요 기능

### Agent 실행 엔진

- 8개 영역 57개 Agent 전체 실행 가능
- Mock 모드 기본 동작 (LLM API Key 없이도 즉시 실행)
- `.env` 설정으로 실제 Claude API 연동 전환
- 한국어 비즈니스 문서 형식 출력

### 사용자 인증

- JWT 기반 세션 관리 (기본 60분)
- bcrypt 비밀번호 해싱
- 역할: `admin` / `manager` / `member`
- ProtectedRoute — 미인증 접근 시 로그인 페이지 리다이렉트

### Agent 출력 저장

- Agent 실행 결과를 Document로 저장
- 프로젝트별 문서 관리
- Markdown 파일 다운로드 (`.md`)
- 저장 시 `created_by` 자동 추출 (JWT 기반, 클라이언트 위조 불가)

---

## 알려진 제한사항

| 항목 | 내용 |
|---|---|
| LLM 모드 | Mock 모드 기본값 — Claude API Key 설정 전까지 실제 AI 생성 불가 |
| 다중 사용자 | SQLite 기반으로 대규모 동시 접속에 적합하지 않음 |
| Word/PDF 다운로드 | 미구현 — Phase 2-D 이후 예정 |
| 이메일 인증 | 미구현 — 관리자가 직접 계정 생성 필요 |
| 토큰 갱신 | Refresh Token 미구현 — 만료 시 재로그인 필요 |
| 비밀번호 재설정 | 미구현 |

---

## 향후 Phase 3 개발 후보

| 후보 | 내용 |
|---|---|
| Phase 3-A | 실제 Claude API 전환 및 프롬프트 최적화 |
| Phase 3-B | Word (.docx) / PDF 다운로드 지원 |
| Phase 3-C | 팀 협업 — 문서 공유, 댓글, 버전 관리 |
| Phase 3-D | 프로젝트 대시보드 고도화 — 통계, 사용량 |
| Phase 3-E | 사용자 초대, 이메일 인증, 비밀번호 재설정 |
| Phase 3-F | Agent 커스터마이징 — 사용자 정의 프롬프트 |
| Phase 3-G | PostgreSQL 전환 및 프로덕션 배포 가이드 |

---

## 검증 결과

- 백엔드 문법 검사: 10개 파일 전체 통과
- API 테스트: 17개 테스트 전체 통과 (0 실패)
- Agent 수: 57개 확인
- 민감정보 포함 여부: 없음
