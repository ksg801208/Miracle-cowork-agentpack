from abc import ABC, abstractmethod
from typing import Any, Dict

class LLMProvider(ABC):
    """Abstract LLM provider interface. Implement this to swap in a real LLM."""

    @abstractmethod
    def complete(self, prompt: str, **kwargs) -> str:
        ...

class MockLLMProvider(LLMProvider):
    def complete(self, prompt: str, **kwargs) -> str:
        return f"[MockLLM] Prompt received ({len(prompt)} chars)"
