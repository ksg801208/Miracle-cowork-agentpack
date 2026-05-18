from abc import ABC, abstractmethod
from typing import Any, Dict


class LLMProvider(ABC):
    """Abstract LLM provider interface. Implement this to swap in a real LLM."""

    @abstractmethod
    def complete(self, system: str, user: str, **kwargs) -> str:
        ...


class MockLLMProvider(LLMProvider):
    def complete(self, system: str, user: str, **kwargs) -> str:
        return f"[MockLLM] system={len(system)}chars, user={len(user)}chars"


class AnthropicProvider(LLMProvider):
    """Claude API를 사용하는 LLM Provider."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6"):
        try:
            import anthropic
        except ImportError:
            raise ImportError("anthropic 패키지가 필요합니다: pip install anthropic")
        self._client = anthropic.Anthropic(api_key=api_key)
        self.model = model

    def complete(self, system: str, user: str, max_tokens: int = 4096, **kwargs) -> str:
        message = self._client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        return message.content[0].text
