import os
import warnings
from app.agent_engine.base_runner import AgentRunner


def create_runner() -> AgentRunner:
    """
    환경변수 AGENT_RUNNER_MODE에 따라 적절한 AgentRunner를 반환한다.

    - AGENT_RUNNER_MODE=mock (기본값): MockAgentRunner 반환
    - AGENT_RUNNER_MODE=llm: LLMAgentRunner 반환
      - ANTHROPIC_API_KEY가 없으면 경고 후 MockAgentRunner로 폴백
    """
    mode = os.getenv("AGENT_RUNNER_MODE", "mock").strip().lower()

    if mode == "llm":
        api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
        if not api_key:
            warnings.warn(
                "AGENT_RUNNER_MODE=llm 이지만 ANTHROPIC_API_KEY가 설정되지 않았습니다. "
                "Mock 모드로 폴백합니다.",
                RuntimeWarning,
                stacklevel=2,
            )
            from app.agent_engine.mock_runner import MockAgentRunner
            return MockAgentRunner()

        model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")
        try:
            from app.agent_engine.llm_provider import AnthropicProvider
            from app.agent_engine.llm_runner import LLMAgentRunner
            provider = AnthropicProvider(api_key=api_key, model=model)
            return LLMAgentRunner(provider=provider)
        except ImportError as e:
            warnings.warn(
                f"LLM 모드 초기화 실패 ({e}). Mock 모드로 폴백합니다.",
                RuntimeWarning,
                stacklevel=2,
            )
            from app.agent_engine.mock_runner import MockAgentRunner
            return MockAgentRunner()

    # 기본: mock 모드
    from app.agent_engine.mock_runner import MockAgentRunner
    return MockAgentRunner()
