from typing import Any, Dict
from app.agent_engine.base_runner import AgentRunner
from app.agent_engine.llm_provider import LLMProvider

# 영역별 전문가 페르소나 (system prompt 기반)
_AREA_PERSONAS: Dict[str, str] = {
    "government_rd": (
        "당신은 10년 이상 경력의 정부 R&D 과제 전문 컨설턴트입니다. "
        "과학기술정보통신부, 중소벤처기업부, 산업통상자원부 등 주요 부처의 R&D 지원사업 실무에 정통하며, "
        "사업계획서 작성 및 평가 경험이 풍부합니다."
    ),
    "planning_strategy": (
        "당신은 전략 기획 및 경영 컨설팅 전문가입니다. "
        "시장 분석, 사업 전략 수립, IR 자료 작성 등 기업 경영 전략 문서 작성에 정통합니다."
    ),
    "meeting_work": (
        "당신은 기업 업무 관리 전문가입니다. "
        "회의록, 업무 지시서, 보고서 등 기업 내부 문서 작성에 정통하며 명확하고 구조화된 문서를 작성합니다."
    ),
    "rd_deliverables": (
        "당신은 SW 개발 산출물 작성 전문가입니다. "
        "요구사항 정의서, 기능 명세서, API 명세서, 테스트케이스 등 개발 프로세스 산출물 작성에 정통합니다."
    ),
    "proposal_sales": (
        "당신은 B2B 영업 및 제안 전문가입니다. "
        "고객 제안서, 회사소개서, 견적서 등 설득력 있는 영업 문서 작성에 정통합니다."
    ),
    "knowledge_document": (
        "당신은 문서 관리 및 지식 관리 전문가입니다. "
        "문서 요약, 비교 분석, 품질 검토 등 문서 관련 업무 자동화에 정통합니다."
    ),
    "patent_commercialization": (
        "당신은 특허 및 기술사업화 전문 컨설턴트입니다. "
        "특허 명세서 작성, 선행기술 조사, 기술사업화 전략 수립에 정통합니다. "
        "단, 법적 효력이 있는 특허 출원은 반드시 전문 변리사의 검토가 필요함을 안내합니다."
    ),
    "claude_code_dev": (
        "당신은 소프트웨어 개발 협업 전문가입니다. "
        "Claude Code 활용, 코드 리뷰, 버그 분석, 개발 문서 자동화에 정통합니다."
    ),
}

_DEFAULT_PERSONA = "당신은 기업 업무 자동화를 지원하는 AI 전문가입니다."

_SYSTEM_SUFFIX = (
    "\n\n출력 지침:\n"
    "- 한국어 비즈니스 문서체로 작성한다.\n"
    "- 마크다운 형식(##, ###, 표, 목록)을 적극 활용한다.\n"
    "- 실무에 즉시 활용 가능한 수준의 구체적인 내용을 작성한다.\n"
    "- 각 섹션은 명확한 제목과 본문으로 구성한다."
)


def _build_system_prompt(agent_config: Dict[str, Any]) -> str:
    area_id = agent_config.get("area_id", "")
    persona = _AREA_PERSONAS.get(area_id, _DEFAULT_PERSONA)
    agent_name = agent_config.get("name_ko", "")
    description = agent_config.get("description", "")
    return f"{persona}\n\n현재 작업: {agent_name} — {description}{_SYSTEM_SUFFIX}"


def _build_user_message(agent_config: Dict[str, Any], input_payload: Dict[str, Any]) -> str:
    agent_name = agent_config.get("name_ko", agent_config.get("agent_id", ""))
    input_schema = agent_config.get("input_schema", {})

    lines = [f"## {agent_name} 작성 요청\n", "### 입력 정보\n"]
    for field_key, field_meta in input_schema.items():
        label = field_meta.get("label", field_key)
        value = input_payload.get(field_key, "")
        if value:
            lines.append(f"**{label}**: {value}")

    lines.append("\n위 정보를 바탕으로 실무에 활용 가능한 전문 문서를 작성해주세요.")
    return "\n".join(lines)


class LLMAgentRunner(AgentRunner):
    """실제 LLM API를 사용하는 Agent 실행기."""

    def __init__(self, provider: LLMProvider):
        self._provider = provider

    def run(self, agent_config: Dict[str, Any], input_payload: Dict[str, Any]) -> Dict[str, Any]:
        system = _build_system_prompt(agent_config)
        user = _build_user_message(agent_config, input_payload)
        try:
            output_text = self._provider.complete(system=system, user=user)
            return {"output_text": output_text, "output_json": None, "status": "completed"}
        except Exception as e:
            return {"output_text": f"LLM 실행 오류: {e}", "output_json": None, "status": "failed"}
