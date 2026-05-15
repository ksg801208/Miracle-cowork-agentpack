from datetime import date
from typing import Any, Dict

class MockAgentRunner:
    """MVP Mock Agent Runner — generates realistic Korean business documents."""

    def run(self, agent_config: dict, input_payload: dict) -> dict:
        agent_id = agent_config["agent_id"]
        output_type = agent_config.get("output_type", "document")

        generators = {
            "government_announcement_analysis": self._govt_announcement_analysis,
            "application_eligibility_review": self._eligibility_review,
            "business_plan_writing": self._business_plan_writing,
            "rd_plan_writing": self._rd_plan_writing,
            "evaluation_criteria_response": self._evaluation_criteria,
            "submission_checklist": self._submission_checklist,
            "meeting_minutes": self._meeting_minutes,
            "todo_extraction": self._todo_extraction,
            "work_instruction": self._work_instruction,
            "requirements_definition": self._requirements_definition,
            "function_specification": self._function_specification,
            "deliverable_management": self._deliverable_management,
            "claude_code_prompt": self._claude_code_prompt,
            "folder_structure_design": self._folder_structure_design,
        }

        fn = generators.get(agent_id)
        output_text = fn(input_payload) if fn else self._default(agent_id, output_type, input_payload)

        return {"output_text": output_text, "output_json": None, "status": "completed"}

    # ── Priority Agents ──────────────────────────────────────────────────────

    def _govt_announcement_analysis(self, inp: dict) -> str:
        today = date.today().strftime("%Y년 %m월 %d일")
        return f"""# 정부 R&D 공고문 분석 보고서

**분석일자:** {today}  **작성도구:** Miracle-Cowork AgentPack

---

## 1. 공고 기본 정보

| 항목 | 내용 |
|------|------|
| 사업명 | 2024년도 중소기업 기술개발 지원사업 |
| 주관기관 | 중소벤처기업부 / 중소기업기술정보진흥원(TIPA) |
| 지원규모 | 총 5,000억원 (과제당 최대 2억원/년) |
| 접수기간 | 2024년 3월 15일 ~ 4월 15일 (30일간) |
| 지원기간 | 1년 (협약 후 연장 가능) |

---

## 2. 신청 자격 및 제한

### 2.1 신청 가능
- 중소기업기본법상 **중소기업** (창업 3년 이상)
- 산학연 컨소시엄 가능 (대학·연구소 참여기관, 사업비 50% 이내)

### 2.2 신청 불가
- 부채비율 500% 초과 기업
- 국세·지방세 체납 기업
- 직전 3년 이내 연구비 부정사용 기관

---

## 3. 평가 기준 분석

| 평가항목 | 배점 | 핵심 포인트 |
|---------|------|------------|
| 기술성 | 30점 | 혁신성·독창성, 특허 보유 |
| 사업성 | 25점 | 시장 규모, 매출 전망, 수익모델 |
| 수행능력 | 20점 | 기업 역량, 연구팀 전문성 |
| 경제적 파급효과 | 15점 | 고용창출, 수출 가능성 |
| 정책 부합성 | 10점 | 정부 R&D 정책 방향과의 일치도 |
| **합계** | **100점** | 70점 이상 선정 (경쟁률에 따라 조정) |

---

## 4. 핵심 체크포인트

### 필수 충족
- [ ] 중소기업 확인서 (중소벤처기업부 발급)
- [ ] 직전 2개년 재무제표 (감사보고서)
- [ ] 연구책임자 연구이력서

### 가점 항목
| 항목 | 가점 |
|------|------|
| 기술혁신형(Inno-Biz) 인증 | +2점 |
| 여성기업 또는 장애인기업 | +2점 |
| 벤처기업 확인서 보유 | +1점 |
| 비수도권 소재 기업 | +2점 |

---

## 5. 주요 제출 서류

1. 사업계획서 (정해진 양식, 50페이지 이내)
2. 기업 현황표
3. 중소기업 확인서
4. 사업자등록증 사본
5. 재무제표 최근 2개년
6. 연구팀 이력서
7. 특허 등록증 (해당 시)
8. Inno-Biz/벤처 인증서 (해당 시)

---

## 6. 총평 및 전략 시사점

> **AI/디지털 분야에 높은 경쟁력**을 보유한 기업에 유리한 구조. 특허 보유 여부와 Inno-Biz 인증이 점수를 결정짓는 핵심 요인.

**권고사항:**
1. 기술 혁신성 강조를 위해 특허·IP 현황을 사업계획서 전면에 배치
2. 시장 규모 및 3년 매출 예측 데이터를 구체적 수치로 보강
3. 인력 채용 계획을 통한 고용창출 효과 수치화

---
*본 보고서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _eligibility_review(self, inp: dict) -> str:
        return """# 신청 적합성 검토표

## 판정 결과: 신청 적합 (예상 점수: 82/100)

---

## 1. 기본 자격 요건

| 검토 항목 | 공고 요건 | 당사 현황 | 충족 |
|---------|---------|---------|------|
| 기업 유형 | 중소기업 | 중소기업 확인서 보유 | O |
| 업 력 | 창업 3년 이상 | 설립 7년차 | O |
| 부채비율 | 500% 이하 | 185% | O |
| 세금 납부 | 체납 없음 | 정상 납부 | O |
| R&D 투자 | 매출 대비 10% 이상 | 12% | O |

---

## 2. 기술 분야 적합성

| 공고 지원 분야 | 당사 해당 여부 | 적합도 |
|-------------|------------|-------|
| AI/빅데이터 기반 서비스 | 핵심 사업 분야 | 매우 높음 |
| IoT/스마트팩토리 | 부분 연관 | 보통 |

---

## 3. 평가항목별 경쟁력

| 평가항목 | 배점 | 예상 점수 | 근거 |
|---------|------|---------|------|
| 기술성 | 30 | 26 | 특허 3건, AI 핵심기술 보유 |
| 사업성 | 25 | 21 | TAM 1,200억, 연 40% 성장 예측 |
| 수행능력 | 20 | 17 | 박사급 3명, 개발 경력 평균 8년 |
| 경제적 파급효과 | 15 | 12 | 고용계획 5명, 수출 계획 보강 필요 |
| 정책 부합성 | 10 | 6 | AI 국가전략 연계 서술 보강 필요 |

---

## 4. 즉시 보완 사항

### 필수 보완
- 수출 전략 및 해외 진출 계획 구체화 (파급효과 점수 향상)
- 경제적 파급효과 고용 창출 수치 명시

### 권고 보완
- Inno-Biz 인증 취득 검토 (+2점 가점)
- 정부 AI 정책과의 연계 서술 강화

### 강점 (유지)
- AI/ML 특허 3건 + 출원 2건 → 기술성 부문 전면 배치
- 기존 고객사 5개 레퍼런스 → 사업성 증거로 활용

---
*본 검토표는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _business_plan_writing(self, inp: dict) -> str:
        name = inp.get("project_name", "AI 기반 업무자동화 솔루션 개발")
        today = date.today().strftime("%Y년 %m월 %d일")
        return f"""# 사업계획서

**과제명:** {name}
**작성일:** {today}
**신청기관:** 미라클에이지아이 (주)

---

## 제1장 사업 개요

### 1.1 사업 목적
본 사업은 중소기업의 반복적 사무 업무를 AI 기술로 자동화하여 업무 효율을 획기적으로 향상시키고, 핵심 인력이 창의적 고부가가치 업무에 집중할 수 있는 환경을 구축하는 것을 목적으로 합니다.

### 1.2 사업 배경
- 국내 중소기업 82%가 반복 사무 업무로 인한 비효율 경험 (2023 중소기업 디지털화 실태조사)
- LLM 기반 업무 자동화 솔루션 시장 연간 45% CAGR 성장 중
- 정부의 AI 활용 중소기업 디지털 전환 지원 정책 확대

### 1.3 최종 목표

| 성과 지표 | 목표값 |
|---------|-------|
| 핵심 사무업무 자동화율 | 60% 이상 |
| 문서 작성 시간 단축 | 70% 감소 |
| 사용자 만족도 (NPS) | 70점 이상 |
| 상용화 후 6개월 고객사 | 50개 기업 |

---

## 제2장 기술 개발 계획

### 2.1 핵심 기술: Multi-Agent Orchestration System

```
[업무입력] -> [의도분류] -> [Agent선택] -> [문서생성] -> [품질검증] -> [최종출력]
```

### 2.2 세부 기술 개발 내용

#### 2.2.1 AI Agent 엔진
- 업무 유형별 특화 Agent 57종 개발
- LLM Provider 추상화 인터페이스 (GPT-4o / Claude / Local LLM 교체 가능)
- 프롬프트 엔지니어링 최적화

#### 2.2.2 문서 생성 품질
- RAG 기반 맥락 이해 강화
- 도메인별 Fine-tuning 데이터셋 구축
- 자동 품질 검증 규칙 엔진

#### 2.2.3 사용자 플랫폼
- 비개발자 친화적 웹 기반 인터페이스
- 실시간 문서 편집 및 버전 관리
- 팀 협업 및 산출물 공유

---

## 제3장 추진 일정

| 단계 | 기간 | 주요 내용 |
|-----|------|---------|
| 1단계 (기반 구축) | 1~6개월 | Agent 엔진 개발, MVP 출시 |
| 2단계 (고도화) | 7~12개월 | 57종 Agent 완성, 품질 고도화 |
| 3단계 (상용화) | 13~18개월 | 베타 서비스, 고객사 50개 확보 |

---

## 제4장 사업화 계획

### 4.1 수익 모델
| 유형 | 가격 | 타겟 |
|-----|-----|------|
| SaaS 구독 (기본) | 월 50만원 | 10인 이하 기업 |
| SaaS 구독 (프로) | 월 150만원 | 50인 이하 기업 |
| 온프레미스 라이선스 | 연 3,000만원+ | 대기업·공공 |

### 4.2 매출 목표
| 연도 | 고객사 | 매출 |
|-----|-------|-----|
| 1차년도 | 50개 | 3억원 |
| 2차년도 | 200개 | 15억원 |
| 3차년도 | 500개 | 45억원 |

---

## 제5장 연구팀 구성

| 역할 | 성명 | 직급 | 전문분야 |
|-----|------|------|---------|
| 총괄책임자 | 홍길동 | 대표이사 | AI 스타트업, 前 대기업 AI팀장 |
| 기술총괄 | 김연구 | 이사 | LLM/NLP 박사, 연구 10년 |
| 개발총괄 | 이개발 | 팀장 | 풀스택 8년, AI 서비스 구축 |
| UX 디자인 | 박디자인 | 책임 | 기업 SaaS UX 전문 5년 |

---
*본 사업계획서는 Miracle-Cowork AgentPack에 의해 자동 생성된 초안입니다. 검토 후 수정하여 사용하세요.*
"""

    def _rd_plan_writing(self, inp: dict) -> str:
        title = inp.get("research_title", "AI 기반 사무업무 자동화 핵심 기술 개발")
        return f"""# 연구개발계획서

**연구 과제명:** {title}
**작성일:** {date.today().strftime("%Y년 %m월 %d일")}

---

## 1. 연구 목표

### 1.1 최종 목표
자연어 입력 기반 Multi-Agent 시스템을 개발하여 기업 사무업무 60% 이상 자동화 달성

### 1.2 단계별 목표
| 단계 | 목표 | 성과지표 |
|-----|------|---------|
| 1단계 | 핵심 Agent 엔진 개발 | Agent 20종, 응답정확도 80% |
| 2단계 | 전체 Agent 완성 | Agent 57종, 응답정확도 90% |
| 3단계 | 상용화 고도화 | 사용자 만족도 NPS 70+ |

---

## 2. 연구 내용 및 방법론

### 2.1 핵심 연구 과제

#### [핵심과제 1] Agent 추론 엔진 개발
- 업무 의도 분류 모델 개발 (Fine-tuning)
- 멀티스텝 추론 파이프라인 구축
- 출력 품질 자동 검증 시스템

#### [핵심과제 2] 도메인 특화 프롬프트 최적화
- 8개 업무 영역 × 57종 프롬프트 템플릿 설계
- RAG 기반 사내 문서 활용 시스템
- 한국어 특화 출력 품질 최적화

#### [핵심과제 3] LLM Provider 추상화 아키텍처
- API 기반 (GPT-4o, Claude, Gemini) 통합 인터페이스
- 온프레미스 Local LLM (Llama, EXAONE) 지원
- 비용 최적화 라우팅 로직

### 2.2 연구 방법론
1. **Agile 개발**: 2주 스프린트 기반 반복 개발
2. **A/B 테스트**: 프롬프트 변형 출력 품질 비교
3. **사용자 중심 설계**: 실사용자 피드백 루프 (주 1회)

---

## 3. 추진 일정 (WBS)

| 과업 | 1Q | 2Q | 3Q | 4Q |
|-----|----|----|----|----|
| 요구사항 분석 | 진행 | | | |
| Agent 엔진 개발 | 진행 | 진행 | | |
| 프롬프트 최적화 | | 진행 | 진행 | |
| 품질 검증 시스템 | | | 진행 | |
| 사용자 테스트 | | 진행 | 진행 | 진행 |
| 상용화 준비 | | | | 진행 |

---

## 4. 연구 성과 지표

| 지표 | 측정 방법 | 목표값 |
|-----|---------|-------|
| Agent 응답 정확도 | 전문가 평가 (100개 샘플) | 90% 이상 |
| 문서 생성 시간 | 평균 응답 시간 | 30초 이내 |
| 사용자 만족도 | NPS 설문 | 70점 이상 |
| 특허 출원 | IP 등록 현황 | 2건 이상 |

---
*본 연구개발계획서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _evaluation_criteria(self, inp: dict) -> str:
        return """# 평가항목 대응표

| 평가항목 | 배점 | 당사 대응 내용 | 증빙 자료 | 예상 점수 |
|---------|------|-------------|---------|---------|
| **기술성** | 30 | AI/NLP 원천기술 보유, 특허 3건(등록), 출원 2건 진행 중 | 특허증, 기술보고서 | 26 |
| └ 기술 혁신성 | 15 | 국내 유일 Multi-Agent 업무자동화 아키텍처 | 기술비교표 | 13 |
| └ 기술 실현가능성 | 15 | MVP 구동 완료, 핵심 알고리즘 TRL-6 달성 | 데모 영상, 테스트 결과 | 13 |
| **사업성** | 25 | TAM 5,000억원, 연 40% 성장 시장, SaaS 수익모델 | 시장조사 보고서 | 21 |
| └ 시장성 | 13 | 국내 중소기업 48만개 × 월 50만원 SaaS | IDC 시장 보고서 | 11 |
| └ 수익모델 | 12 | 구독/라이선스 이원화, 연간 ARR 15억 목표 | 재무계획서 | 10 |
| **수행능력** | 20 | 박사급 3명, 평균 개발경력 8년, 수행과제 12건 | 이력서, 수행실적증명 | 17 |
| └ 인력역량 | 10 | AI 전문인력 4명 (박사 3, 석사 1) | 학위증, 논문 목록 | 9 |
| └ 인프라/환경 | 10 | 자체 GPU 서버 보유, ISO27001 준비 | 장비 목록, 인증 현황 | 8 |
| **경제적 파급효과** | 15 | 신규 고용 5명 계획, 협력사 10개 기업 생태계 | 고용계획서 | 12 |
| **정책 부합성** | 10 | AI 국가전략 2030, 디지털 뉴딜 2.0 연계 | 정책 연계 설명서 | 6 |
| **합 계** | **100** | | | **82** |

---

## 취약 항목 보강 계획

| 항목 | 현재 | 목표 | 보강 방법 |
|-----|------|------|---------|
| 정책 부합성 | 6/10 | 8/10 | AI 국가전략 2030 세부 항목과 1:1 매핑 작성 |
| 경제적 파급효과 | 12/15 | 14/15 | 수출 10억 계획 구체화, 간접 고용 효과 산출 |

---
*본 대응표는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _submission_checklist(self, inp: dict) -> str:
        return """# 제출서류 체크리스트

## 전체 진행률: 6/10 완료 (60%)

---

## 필수 서류

- [x] **사업계획서** (지정 양식) — 작성 완료, 최종 검토 필요
- [x] **기업 현황표** (지정 양식) — 완료
- [x] **중소기업 확인서** — 발급 완료 (유효기간: 2025.03.31)
- [x] **사업자등록증 사본** — 준비 완료
- [x] **재무제표** (최근 2개년 감사) — 2022, 2023년 완료
- [ ] **연구책임자 이력서** — **작성 중** (제출까지 D-5)
- [ ] **연구팀 전원 이력서** — **미착수** (제출까지 D-5)
- [ ] **개인정보 수집·이용 동의서** — **미착수**

---

## 가점 서류 (해당 시)

- [x] **기술혁신형 중소기업(Inno-Biz) 확인서** — 보유 (+2점)
- [ ] **벤처기업 확인서** — 신청 예정 (+1점)
- [ ] **여성기업/장애인기업 확인서** — 해당 없음

---

## 시스템 등록 사항

- [ ] 국가R&D정보시스템(IRIS) 기관 등록 갱신
- [ ] 연구책임자 IRIS 등록 정보 업데이트
- [ ] 접수 시스템 로그인 테스트

---

## 주의사항

1. 파일 형식: PDF 또는 HWP (10MB 이하)
2. 파일명 규칙: `[사업명]_[서류명]_[기관명].pdf`
3. 제출 마감: **2024년 4월 15일 18:00** (이후 접수 불가)

---
*본 체크리스트는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _meeting_minutes(self, inp: dict) -> str:
        meeting_date = inp.get("meeting_date", date.today().strftime("%Y.%m.%d"))
        attendees = inp.get("attendees", "홍길동(대표), 김연구(팀장), 이개발(팀원)")
        return f"""# 회의록

**일 시:** {meeting_date}
**장 소:** 회의실 A / 화상회의
**참석자:** {attendees}
**작성자:** (자동생성) Miracle-Cowork AgentPack
**문서번호:** MTG-{date.today().strftime('%Y%m%d')}-001

---

## 1. 안건 및 논의 내용

### 안건 1: MVP 개발 현황 점검
- **현황**: 백엔드 API 80% 완료, 프론트엔드 60% 완료
- **이슈**: Agent 실행 화면 UX 개선 필요 (입력 폼 복잡도 감소)
- **결정**: 입력 필드를 필수/선택으로 구분하여 단계별 표시로 개선

### 안건 2: 데모 일정 확정
- **논의**: 고객사 A사 데모 일정 조율
- **결정**: 2024년 6월 10일 (월) 오후 2시 확정
- **담당**: 홍길동 대표가 데모 스크립트 작성 리드

### 안건 3: 사업계획서 제출 준비
- **진행 상황**: 초안 작성 완료, 검토 중
- **이슈**: 평가항목 대응표 보강 필요
- **결정**: AgentPack으로 평가항목 대응표 자동 생성 후 검토

---

## 2. 결정 사항 요약

| 번호 | 결정 내용 | 담당자 | 기한 |
|-----|---------|-------|------|
| 1 | Agent 실행 UX 개선 (단계별 입력) | 이개발 | 05.20 |
| 2 | 데모 스크립트 작성 | 홍길동 | 05.31 |
| 3 | 사업계획서 평가항목 대응표 완성 | 김연구 | 05.17 |

---

## 3. 다음 회의

- **일시**: 차주 동일 시간
- **안건**: MVP 데모 리허설, 사업계획서 최종 검토

---
*본 회의록은 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _todo_extraction(self, inp: dict) -> str:
        return """# To-do 추출 결과

**추출 기준:** 담당자 명시, 기한 포함, 실행 가능한 액션 항목

---

## 긴급 (이번 주 내)

- [ ] **[이개발]** Agent 실행 UX 개선 — 입력 폼을 필수/선택 단계로 분리 `D-3`
- [ ] **[김연구]** 평가항목 대응표 최종본 작성 `D-2`
- [ ] **[박디자인]** 모바일 반응형 대시보드 검토 `D-4`

---

## 중요 (이번 달 내)

- [ ] **[홍길동]** 고객사 데모 스크립트 작성 완료 `05.31`
- [ ] **[이개발]** 백엔드 API 문서화 (Swagger) 완성 `05.25`
- [ ] **[김연구]** RAG 모듈 성능 벤치마크 보고서 작성 `05.28`
- [ ] **[전체팀]** MVP QA 테스트 수행 (50개 시나리오) `05.30`

---

## 일반 (다음 달 내)

- [ ] **[홍길동]** 투자자 미팅 IR 자료 업데이트 `06.15`
- [ ] **[박디자인]** 사용자 온보딩 튜토리얼 화면 설계 `06.20`
- [ ] **[이개발]** 로컬 LLM 연동 프로토타입 구현 `06.30`

---

## 통계
- 전체 To-do: 10개
- 긴급: 3개 | 중요: 4개 | 일반: 3개
- 담당자별: 홍길동(2) 김연구(2) 이개발(3) 박디자인(2) 전체팀(1)

---
*본 To-do 목록은 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _work_instruction(self, inp: dict) -> str:
        task_title = inp.get("task_title", "MVP 백엔드 API 개발")
        assignee = inp.get("assignee", "담당자")
        due_date = inp.get("due_date", "미정")
        return f"""# 업무지시서

**문서번호:** WI-{date.today().strftime('%Y%m%d')}-001
**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**업무 제목:** {task_title}
**담 당 자:** {assignee}
**완료 기한:** {due_date}
**지시자:** 홍길동 대표이사

---

## 1. 배경 및 목적

본 업무는 MVP 출시 일정에 맞춰 핵심 기능을 완성하기 위한 것입니다.
현재 개발 진행률 70% 수준으로, 남은 30%를 기한 내 완료해야 합니다.

---

## 2. 업무 내용

### 2.1 필수 완료 항목
1. Agent 실행 API 엔드포인트 완성
2. Mock Runner 결과 품질 개선 (12개 우선 Agent)
3. 에러 핸들링 및 로깅 추가
4. API 단위 테스트 작성 (커버리지 80% 이상)

### 2.2 선택 완료 항목 (여건이 되면)
- Swagger 문서 자동화
- 성능 최적화 (응답시간 500ms 이내)

---

## 3. 산출물

| 산출물 | 형태 | 제출 방법 |
|-------|------|---------|
| 완성된 백엔드 코드 | GitHub PR | dev 브랜치에 PR |
| 테스트 결과 보고서 | Markdown | 팀 노션에 업로드 |
| API 명세서 | Swagger URL | 내부 공유 |

---

## 4. 주의사항

- 기존 데이터 모델 변경 시 반드시 팀장 사전 협의
- 보안 관련 설정(API 키, DB 접속정보)은 환경변수로 관리
- 진행 중 이슈 발생 시 즉시 보고 (카카오톡 팀채널)

---
*본 업무지시서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _requirements_definition(self, inp: dict) -> str:
        project_name = inp.get("project_name", "AI 업무자동화 플랫폼")
        return f"""# 요구정의서

**프로젝트명:** {project_name}
**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**버전:** v1.0
**작성도구:** Miracle-Cowork AgentPack

---

## 1. 이해관계자 목록

| 이해관계자 | 역할 | 주요 관심사 |
|---------|------|-----------|
| 최종사용자 (직원) | 시스템 주 사용자 | 사용 편의성, 결과 품질 |
| 관리자 (팀장) | 업무 승인 및 모니터링 | 이력 추적, 보안 |
| 운영팀 | 시스템 운영 | 안정성, 모니터링 |
| 경영진 | 의사결정 | ROI, 효율 지표 |

---

## 2. 기능 요구사항

### FR-001: 영역 및 Agent 탐색
- **설명**: 사용자는 8개 업무 영역을 탐색하고 57개 Agent를 조회할 수 있다
- **우선순위**: Must Have
- **수용 기준**: 영역 클릭 → Agent 목록 2초 이내 표시

### FR-002: Agent 실행
- **설명**: 사용자는 Agent를 선택하고 입력값을 제출하여 문서를 생성할 수 있다
- **우선순위**: Must Have
- **수용 기준**: 입력 제출 후 30초 이내 결과 반환

### FR-003: 프로젝트 관리
- **설명**: 사용자는 프로젝트를 생성하고 Agent 실행 결과를 프로젝트에 저장할 수 있다
- **우선순위**: Must Have
- **수용 기준**: 프로젝트 생성 후 Agent 실행 결과 즉시 연결 가능

### FR-004: 결과 저장 및 내보내기
- **설명**: 생성된 문서를 Markdown 형태로 저장하고 복사할 수 있다
- **우선순위**: Should Have
- **수용 기준**: 복사 버튼 클릭 시 클립보드 저장 완료

### FR-005: 실행 이력 조회
- **설명**: 사용자는 Agent 실행 이력을 프로젝트별로 조회할 수 있다
- **우선순위**: Should Have
- **수용 기준**: 이력 목록에서 과거 결과 재조회 가능

---

## 3. 비기능 요구사항

| 구분 | 요구사항 | 기준값 |
|-----|---------|-------|
| 성능 | Agent 응답 시간 | 30초 이내 (Mock) |
| 가용성 | 서비스 업타임 | 99% 이상 |
| 보안 | API 인증 | JWT 기반 (v2 반영) |
| 확장성 | LLM Provider 교체 | 인터페이스 분리로 무중단 교체 |
| 유지보수성 | Agent 추가 | agents.json 수정만으로 가능 |

---

## 4. 제약 조건

- MVP는 SQLite 사용 (운영 전환 시 PostgreSQL 마이그레이션)
- 초기 LLM은 Mock으로 구현, 실 LLM 연동은 v1.1에서 진행
- 사용자 인증은 MVP에서 제외, v1.1에서 추가

---
*본 요구정의서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _function_specification(self, inp: dict) -> str:
        project_name = inp.get("project_name", "AI 업무자동화 플랫폼")
        return f"""# 기능명세서

**프로젝트명:** {project_name}
**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**버전:** v1.0

---

## 1. 시스템 아키텍처 개요

```
[React Frontend] <-> [FastAPI Backend] <-> [SQLite DB]
                           |
                    [Agent Engine]
                           |
                    [Mock / LLM Provider]
```

---

## 2. 기능 목록

### FN-001: 대시보드
| 항목 | 내용 |
|-----|------|
| 기능명 | 메인 대시보드 |
| 설명 | 8개 영역 카드를 표시하고 영역 선택 시 Agent 목록으로 이동 |
| 입력 | 없음 |
| 출력 | 영역 카드 목록 (영역명, 설명, Agent 수, 색상) |
| API | GET /api/areas |
| 화면 | /dashboard |

### FN-002: Agent 목록
| 항목 | 내용 |
|-----|------|
| 기능명 | 영역별 Agent 목록 |
| 설명 | 특정 영역의 Agent 카드 목록 표시 |
| 입력 | area_id (URL 파라미터) |
| 출력 | Agent 카드 (이름, 설명, 출력유형, 실행 버튼) |
| API | GET /api/areas/{{area_id}}/agents |
| 화면 | /areas/{{area_id}} |

### FN-003: Agent 실행
| 항목 | 내용 |
|-----|------|
| 기능명 | Agent 실행 및 결과 확인 |
| 설명 | Agent 입력폼 제출 -> 결과 Markdown 렌더링 |
| 입력 | agent_id + input_payload (동적 폼) |
| 출력 | 생성된 문서 (Markdown) |
| API | POST /api/agents/{{agent_id}}/run |
| 화면 | /agents/{{agent_id}}/run |

### FN-004: 프로젝트
| 항목 | 내용 |
|-----|------|
| 기능명 | 프로젝트 생성 및 목록 |
| 설명 | 프로젝트 CRUD 및 산출물 연결 |
| API | POST/GET /api/projects |
| 화면 | /projects |

---

## 3. Agent 입력 스키마 동적 폼 처리

입력 필드 타입별 렌더링 규칙:

| type | 렌더링 컴포넌트 | 비고 |
|-----|-------------|------|
| text | input type=text | 단행 입력 |
| textarea | textarea rows=4 | 장문 입력 |
| select | select + options | 드롭다운 |

required: true인 필드 미입력 시 제출 차단.

---
*본 기능명세서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _deliverable_management(self, inp: dict) -> str:
        project_name = inp.get("project_name", "AI 업무자동화 플랫폼")
        return f"""# 산출물 관리표

**프로젝트명:** {project_name}
**작성일:** {date.today().strftime('%Y년 %m월 %d일')}

---

| 단계 | 산출물명 | 유형 | 담당자 | 완료기준 | 상태 | 비고 |
|-----|---------|------|-------|---------|------|------|
| 분석 | 요구정의서 | 문서 | 김연구 | 이해관계자 검토 완료 | 완료 | v1.0 |
| 분석 | 유저스토리 | 문서 | 김연구 | PM 승인 | 완료 | Notion |
| 설계 | 시스템 아키텍처 | 다이어그램 | 이개발 | 기술리뷰 통과 | 완료 | Draw.io |
| 설계 | DB 설계서 | 문서 | 이개발 | ERD 검토 완료 | 완료 | |
| 설계 | API 명세서 | 문서 | 이개발 | Swagger 자동화 | 진행 중 | 85% |
| 설계 | 화면설계서 | 문서 | 박디자인 | Figma 확정 | 완료 | v2.1 |
| 개발 | 백엔드 소스코드 | 코드 | 이개발 | 단위 테스트 통과 | 진행 중 | 80% |
| 개발 | 프론트엔드 소스코드 | 코드 | 박디자인 | UI 리뷰 통과 | 진행 중 | 60% |
| 개발 | Agent Mock Runner | 코드 | 이개발 | 12개 Agent 검증 | 완료 | |
| 테스트 | 테스트케이스 | 문서 | 김연구 | QA팀 승인 | 예정 | |
| 테스트 | 테스트 결과 보고서 | 문서 | 김연구 | QA 완료 후 | 예정 | |
| 배포 | 배포 가이드 | 문서 | 이개발 | 운영팀 검토 | 예정 | |
| 배포 | 사용자 매뉴얼 | 문서 | 박디자인 | 최종 검토 | 예정 | |

---

## 산출물 진행 현황

| 상태 | 건수 | 비율 |
|-----|------|------|
| 완료 | 7 | 54% |
| 진행 중 | 3 | 23% |
| 예정 | 3 | 23% |
| **합계** | **13** | **100%** |

---
*본 관리표는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _claude_code_prompt(self, inp: dict) -> str:
        task = inp.get("task_description", "기능을 구현해주세요")
        stack = inp.get("tech_stack", "Python/FastAPI, React/TypeScript")
        return f"""# Claude Code 개발 지시문

---

## 작업 목표
{task}

## 기술 스택
{stack}

## 구현 요구사항

### 필수 구현
1. 핵심 비즈니스 로직 구현
2. 입력 유효성 검사 (API 경계 지점)
3. 에러 처리 및 적절한 HTTP 상태 코드 반환
4. 기본 단위 테스트 작성

### 코드 품질 기준
- 함수는 단일 책임 원칙 준수
- 변수/함수명은 의미 있는 영어 사용
- 주석은 WHY 위주로 작성 (WHAT은 코드가 설명)
- 보안 취약점 없을 것 (SQL Injection, XSS 등)

## 파일 구조
```
기존 프로젝트 구조에 맞게 적절한 위치에 파일 생성
새 디렉토리가 필요한 경우 먼저 생성 후 파일 배치
```

## 완료 기준
- [ ] 코드가 오류 없이 실행됨
- [ ] 모든 요구사항이 구현됨
- [ ] 테스트가 통과됨
- [ ] README 또는 주석으로 사용법 명시

## 주의사항
{inp.get("constraints", "- 기존 코드 스타일 유지")}

---
*본 프롬프트는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _folder_structure_design(self, inp: dict) -> str:
        project_type = inp.get("project_type", "웹 풀스택")
        stack = inp.get("tech_stack", "FastAPI + React + PostgreSQL")
        return f"""# 폴더 구조 설계서

**프로젝트 유형:** {project_type}
**기술 스택:** {stack}

---

## 권장 폴더 구조

```
project-root/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── core/
│   │   │   ├── config.py        # 환경 설정
│   │   │   └── database.py      # DB 연결
│   │   ├── api/                 # 라우터 모음
│   │   │   └── v1/
│   │   ├── models/              # SQLAlchemy 모델
│   │   ├── schemas/             # Pydantic 스키마
│   │   ├── services/            # 비즈니스 로직
│   │   └── utils/               # 유틸리티
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── alembic/                 # DB 마이그레이션
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/          # 재사용 컴포넌트
│   │   ├── pages/               # 라우트 페이지
│   │   ├── layouts/             # 레이아웃
│   │   ├── services/            # API 호출
│   │   ├── types/               # TypeScript 타입
│   │   ├── hooks/               # 커스텀 훅
│   │   └── utils/               # 유틸리티
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── config/                      # 공통 설정 파일
├── docs/                        # 문서
└── README.md
```

---

## 설계 원칙

1. **관심사 분리**: API 라우터 / 비즈니스 로직 / 데이터 접근 계층 분리
2. **의존성 방향**: Controller -> Service -> Repository (단방향)
3. **테스트 가능성**: 의존성 주입(DI) 패턴으로 모킹 용이
4. **확장성**: 기능 추가 시 기존 파일 최소 수정

---
*본 설계서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    # ── Default Generators ────────────────────────────────────────────────────

    def _default(self, agent_id: str, output_type: str, inp: dict) -> str:
        if output_type == "table":
            return self._default_table(agent_id, inp)
        if output_type == "checklist":
            return self._default_checklist(agent_id, inp)
        if output_type == "prompt":
            return self._default_prompt(agent_id, inp)
        if output_type == "list":
            return self._default_list(agent_id, inp)
        return self._default_document(agent_id, inp)

    def _default_document(self, agent_id: str, inp: dict) -> str:
        return f"""# 문서 초안

**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**생성 Agent:** {agent_id}

---

## 1. 개요
입력하신 내용을 기반으로 문서를 작성하였습니다.

## 2. 주요 내용
{chr(10).join(f'- **{k}**: {v}' for k, v in inp.items() if v)}

## 3. 결론 및 다음 단계
- 본 문서를 검토 후 수정하여 사용하시기 바랍니다.
- 추가 정보 입력 시 더 구체적인 문서를 생성할 수 있습니다.

---
*본 문서는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _default_table(self, agent_id: str, inp: dict) -> str:
        return f"""# 분석표

**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**생성 Agent:** {agent_id}

| 구분 | 항목 | 내용 | 비고 |
|-----|------|------|------|
| 1 | 항목 A | 분석 내용 A | - |
| 2 | 항목 B | 분석 내용 B | - |
| 3 | 항목 C | 분석 내용 C | - |
| 4 | 항목 D | 분석 내용 D | - |
| 5 | 항목 E | 분석 내용 E | - |

> 입력 데이터를 기반으로 자동 생성된 초안입니다. 내용을 검토 후 수정하세요.

---
*본 표는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _default_checklist(self, agent_id: str, inp: dict) -> str:
        return f"""# 체크리스트

**작성일:** {date.today().strftime('%Y년 %m월 %d일')}
**생성 Agent:** {agent_id}

## 필수 확인 항목

- [ ] 항목 1: 기본 요건 확인
- [ ] 항목 2: 관련 문서 준비
- [ ] 항목 3: 담당자 지정
- [ ] 항목 4: 일정 확인
- [ ] 항목 5: 승인권자 확인

## 선택 확인 항목

- [ ] 항목 6: 추가 자료 준비
- [ ] 항목 7: 관련 부서 공유

## 완료 기준
위 필수 항목 전체 체크 완료 시 진행 가능합니다.

---
*본 체크리스트는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _default_prompt(self, agent_id: str, inp: dict) -> str:
        return f"""# 개발 지시 프롬프트

**생성 Agent:** {agent_id}

---

다음 작업을 수행해주세요:

{inp.get('task_description', '작업 내용을 입력하세요.')}

## 기술 스택
{inp.get('tech_stack', '지정된 기술 스택을 사용하세요.')}

## 요구사항
1. 코드는 실행 가능해야 합니다
2. 에러 처리를 포함하세요
3. 적절한 주석을 작성하세요

---
*본 프롬프트는 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""

    def _default_list(self, agent_id: str, inp: dict) -> str:
        return f"""# 목록

**작성일:** {date.today().strftime('%Y년 %m월 %d일')}

1. 항목 1 - 상세 내용
2. 항목 2 - 상세 내용
3. 항목 3 - 상세 내용
4. 항목 4 - 상세 내용
5. 항목 5 - 상세 내용

---
*본 목록은 Miracle-Cowork AgentPack에 의해 자동 생성되었습니다.*
"""
