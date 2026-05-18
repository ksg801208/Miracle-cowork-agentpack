# LLM API 연동 가이드

> Miracle-Cowork AgentPack Phase 2A — 실제 LLM API 연동 방법

---

## 아키텍처 개요

```
[Phase 1 — Mock]                    [Phase 2 — LLM]
Frontend                            Frontend
  └── FastAPI                         └── FastAPI
        └── MockAgentRunner                 └── LLMAgentRunner
              └── f-string 템플릿                  └── AnthropicProvider
                                                          └── Claude API
```

### 핵심 컴포넌트

| 파일 | 역할 |
|---|---|
| `agent_engine/base_runner.py` | `AgentRunner` 추상 기반 클래스 |
| `agent_engine/mock_runner.py` | 템플릿 기반 Mock 실행기 (Phase 1, 유지) |
| `agent_engine/llm_runner.py` | Claude API 기반 실제 실행기 (Phase 2) |
| `agent_engine/llm_provider.py` | LLM Provider 추상화 + `AnthropicProvider` |
| `agent_engine/runner_factory.py` | 환경변수에 따라 적절한 Runner 생성 |
| `core/config.py` | `AGENT_RUNNER_MODE`, `ANTHROPIC_API_KEY` 등 설정 |

---

## 빠른 시작

### 1단계: 패키지 설치

```bash
cd backend
pip install anthropic
# 또는
pip install -r requirements.txt
```

### 2단계: 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 다음 값을 설정합니다:

```env
AGENT_RUNNER_MODE=llm
ANTHROPIC_API_KEY=sk-ant-api03-여기에_실제_키_입력
ANTHROPIC_MODEL=claude-sonnet-4-6
```

> API 키 발급: https://console.anthropic.com

### 3단계: 백엔드 실행

```bash
cd backend
uvicorn app.main:app --reload
```

서버 시작 시 로그에서 실행 모드를 확인할 수 있습니다.

---

## 실행 모드 전환

### Mock 모드 (기본값)
API 키 없이 즉시 사용 가능. 템플릿 기반 출력.

```env
AGENT_RUNNER_MODE=mock
```

### LLM 모드
실제 Claude API를 호출하여 AI 생성 출력.

```env
AGENT_RUNNER_MODE=llm
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 폴백 동작
`AGENT_RUNNER_MODE=llm`이지만 `ANTHROPIC_API_KEY`가 비어 있으면:
- 경고 메시지 출력 후 **자동으로 Mock 모드로 폴백**
- 서비스는 정상 동작 유지

---

## 프롬프트 구조

`LLMAgentRunner`는 `agents.json`의 메타데이터를 활용하여 프롬프트를 자동 생성합니다.

### System Prompt
영역(`area_id`)별 전문가 페르소나 + 출력 형식 지침

```
[예시 — government_rd 영역]
당신은 10년 이상 경력의 정부 R&D 과제 전문 컨설턴트입니다...

출력 지침:
- 한국어 비즈니스 문서체로 작성한다.
- 마크다운 형식(##, ###, 표, 목록)을 적극 활용한다.
- 실무에 즉시 활용 가능한 수준의 구체적인 내용을 작성한다.
```

### User Message
`input_schema` 필드 라벨 + 사용자 입력값으로 자동 구성

```
## 사업계획서 작성 요청

### 입력 정보

**과제명**: AI 기반 스마트팩토리 불량 감지 시스템
**지원 기관**: 중소벤처기업부
...

위 정보를 바탕으로 실무에 활용 가능한 전문 문서를 작성해주세요.
```

---

## 모델 선택 가이드

| 모델 | 용도 | 특징 |
|---|---|---|
| `claude-haiku-4-5-20251001` | 빠른 초안, 간단한 문서 | 가장 빠름, 비용 절감 |
| `claude-sonnet-4-6` | 표준 업무 문서 (권장) | 속도/품질 균형 |
| `claude-opus-4-7` | 고품질 전략/특허 문서 | 최고 품질, 느림 |

---

## 새 LLM Provider 추가 방법

`LLMProvider` 추상 클래스를 상속하여 구현합니다:

```python
# backend/app/agent_engine/llm_provider.py

class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        from openai import OpenAI
        self._client = OpenAI(api_key=api_key)
        self.model = model

    def complete(self, system: str, user: str, max_tokens: int = 4096, **kwargs) -> str:
        response = self._client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content
```

그 다음 `runner_factory.py`에 해당 provider 분기를 추가합니다.

---

## 트러블슈팅

### `anthropic` 모듈을 찾을 수 없음
```bash
pip install anthropic>=0.40.0
```

### API 키 오류 (401)
- `ANTHROPIC_API_KEY` 값이 올바른지 확인
- 키 앞뒤 공백 제거

### 응답 시간 초과
- 복잡한 문서는 30~60초 소요될 수 있음
- 필요 시 `max_tokens` 조정 (기본값: 4096)

### Mock 모드가 의도치 않게 실행됨
- `.env` 파일 위치 확인 (프로젝트 루트 또는 `backend/` 디렉토리)
- `AGENT_RUNNER_MODE` 값에 오타 없는지 확인 (`llm`은 소문자)
