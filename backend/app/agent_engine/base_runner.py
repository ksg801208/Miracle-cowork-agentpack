from abc import ABC, abstractmethod
from typing import Any, Dict


class AgentRunner(ABC):
    """Agent 실행기 추상 기반 클래스. Mock/LLM 구현체가 이를 상속한다."""

    @abstractmethod
    def run(self, agent_config: Dict[str, Any], input_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Agent를 실행하고 결과를 반환한다.

        Returns:
            {"output_text": str, "output_json": Any | None, "status": "completed" | "failed"}
        """
        ...
