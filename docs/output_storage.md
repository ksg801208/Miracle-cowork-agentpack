# 출력 결과 저장 기능 가이드

> Miracle-Cowork AgentPack Phase 2-C — Agent 실행 결과 저장·조회·다운로드

---

## 기능 개요

Agent 실행 결과를 Document로 저장하여 프로젝트별로 관리하고, Markdown으로 다운로드할 수 있습니다.

| 기능 | 설명 |
|---|---|
| 저장 | Agent 실행 후 "저장" 버튼으로 Document 저장 |
| 목록 조회 | 프로젝트 상세 → "저장 문서" 탭에서 목록 확인 |
| 상세 열람 | 문서 클릭 또는 "열기" 버튼으로 상세 화면 이동 |
| Markdown 렌더링 | 상세 화면에서 Markdown 형식으로 렌더링 |
| 복사 | "복사" 버튼으로 클립보드 복사 |
| MD 다운로드 | "↓ MD 다운로드" 버튼으로 `.md` 파일 다운로드 |

---

## 사용 방법

### 1. Agent 실행 후 저장

1. 대시보드 → 업무 영역 선택 → Agent 선택
2. 입력 정보 작성 후 **실행** 버튼 클릭
3. 결과 확인 후 **(선택)** 프로젝트 연결 → **저장** 버튼 클릭
4. "저장 완료" 알림 확인

> 로그인한 사용자만 저장 가능합니다. 미인증 요청은 401로 차단됩니다.

### 2. 저장 문서 조회

1. 상단 메뉴 → **프로젝트** → 프로젝트 선택
2. **저장 문서** 탭 클릭
3. 문서 제목 클릭 또는 **열기** 버튼 → 상세 화면으로 이동

### 3. Markdown 다운로드

- 프로젝트 상세: 문서 목록의 **↓ MD** 버튼 클릭
- 문서 상세 화면: **↓ MD 다운로드** 버튼 클릭
- `.md` 파일로 자동 저장

---

## API 명세

| 메서드 | 엔드포인트 | 인증 | 설명 |
|---|---|---|---|
| `POST` | `/api/documents` | 필수 | 문서 저장 |
| `GET` | `/api/projects/{id}/documents` | 필수 | 프로젝트 문서 목록 |
| `GET` | `/api/documents/{id}` | 필수 | 문서 상세 조회 |
| `GET` | `/api/documents/{id}/download` | 필수 | Markdown 파일 다운로드 |
| `DELETE` | `/api/documents/{id}` | 필수 | 문서 삭제 (작성자·admin·manager) |

### 저장 요청 예시

```json
POST /api/documents
Authorization: Bearer <token>

{
  "project_id": "uuid",
  "agent_id": "business_plan_writing",
  "area_id": "government_rd",
  "title": "[사업계획서 작성] 2026-05-18 15:30:00",
  "document_type": "document",
  "content_markdown": "# 사업계획서\n\n...",
  "agent_run_id": "uuid"
}
```

---

## 저장 데이터 구조

| 필드 | 설명 |
|---|---|
| `document_id` | UUID (자동 생성) |
| `project_id` | 연결 프로젝트 ID (선택) |
| `agent_id` | 실행한 Agent ID |
| `area_id` | 업무 영역 ID |
| `title` | 문서 제목 (자동 생성: `[Agent명] 날짜시간`) |
| `document_type` | output_type (document/table/checklist 등) |
| `content_markdown` | Markdown 본문 |
| `agent_run_id` | 연결 실행 이력 ID |
| `created_by` | 저장한 사용자 ID (JWT에서 자동 추출) |
| `created_at` | 저장 시각 |

---

## 다운로드 확장 계획

| 형식 | 현재 | 계획 |
|---|---|---|
| Markdown (.md) | ✅ 지원 | - |
| Word (.docx) | 예정 | `python-docx` 라이브러리 활용 |
| PDF (.pdf) | 예정 | `weasyprint` 또는 Puppeteer 활용 |

Word/PDF 다운로드는 Phase 2-D 이후 구현 예정입니다.
