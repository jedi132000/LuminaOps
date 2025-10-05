"""
AI-Powered LLM Service for LuminaOps
Supports multiple LLM providers: OpenAI, Anthropic, Hugging Face, Local models
"""

from typing import Dict, List, Optional, Any, AsyncGenerator
from enum import Enum
import asyncio
import json
from dataclasses import dataclass
from core.config import settings

try:
    import openai
    from anthropic import Anthropic
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
except ImportError as e:
    print(f"Warning: Some AI libraries not installed: {e}")

class LLMProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"

@dataclass
class LLMConfig:
    provider: LLMProvider
    model_name: str
    api_key: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 1000
    top_p: float = 1.0

class LLMService:
    """Unified LLM service supporting multiple providers"""
    
    def __init__(self):
        self.providers = {}
        self.default_config = LLMConfig(
            provider=LLMProvider.OPENAI,
            model_name="gpt-4-turbo-preview"
        )
    
    async def initialize_provider(self, config: LLMConfig):
        """Initialize a specific LLM provider"""
        try:
            if config.provider == LLMProvider.OPENAI:
                api_key = config.api_key or settings.OPENAI_API_KEY
                if not api_key:
                    raise ValueError("OpenAI API key not configured")
                self.providers[config.provider] = openai.AsyncOpenAI(
                    api_key=api_key
                )
            elif config.provider == LLMProvider.ANTHROPIC:
                api_key = config.api_key or settings.ANTHROPIC_API_KEY
                if not api_key:
                    raise ValueError("Anthropic API key not configured")
                self.providers[config.provider] = Anthropic(
                    api_key=api_key
                )
            elif config.provider == LLMProvider.HUGGINGFACE:
                # Initialize Hugging Face pipeline
                self.providers[config.provider] = pipeline(
                    "text-generation",
                    model=config.model_name,
                    torch_dtype=torch.float16,
                    device_map="auto"
                )
            return True
        except Exception as e:
            print(f"Failed to initialize {config.provider.value}: {e}")
            return False
    
    async def generate_text(
        self, 
        prompt: str, 
        config: Optional[LLMConfig] = None,
        system_prompt: Optional[str] = None
    ) -> str:
        """Generate text using specified or default LLM"""
        config = config or self.default_config
        
        try:
            if config.provider == LLMProvider.OPENAI:
                return await self._generate_openai(prompt, config, system_prompt)
            elif config.provider == LLMProvider.ANTHROPIC:
                return await self._generate_anthropic(prompt, config, system_prompt)
            elif config.provider == LLMProvider.HUGGINGFACE:
                return await self._generate_huggingface(prompt, config)
            else:
                raise ValueError(f"Unsupported provider: {config.provider}")
        except Exception as e:
            return f"Error generating text: {str(e)}"
    
    async def _generate_openai(self, prompt: str, config: LLMConfig, system_prompt: Optional[str]) -> str:
        """Generate text using OpenAI"""
        client = self.providers.get(LLMProvider.OPENAI)
        if not client:
            raise ValueError("OpenAI client not initialized")
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await client.chat.completions.create(
            model=config.model_name,
            messages=messages,
            temperature=config.temperature,
            max_tokens=config.max_tokens,
            top_p=config.top_p
        )
        
        return response.choices[0].message.content
    
    async def _generate_anthropic(self, prompt: str, config: LLMConfig, system_prompt: Optional[str]) -> str:
        """Generate text using Anthropic Claude"""
        client = self.providers.get(LLMProvider.ANTHROPIC)
        if not client:
            raise ValueError("Anthropic client not initialized")
        
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        response = await asyncio.to_thread(
            client.messages.create,
            model=config.model_name,
            max_tokens=config.max_tokens,
            temperature=config.temperature,
            messages=[{"role": "user", "content": full_prompt}]
        )
        
        return response.content[0].text
    
    async def _generate_huggingface(self, prompt: str, config: LLMConfig) -> str:
        """Generate text using Hugging Face models"""
        pipeline = self.providers.get(LLMProvider.HUGGINGFACE)
        if not pipeline:
            raise ValueError("Hugging Face pipeline not initialized")
        
        result = await asyncio.to_thread(
            pipeline,
            prompt,
            max_length=config.max_tokens,
            temperature=config.temperature,
            do_sample=True,
            top_p=config.top_p
        )
        
        return result[0]['generated_text']
    
    async def generate_stream(
        self, 
        prompt: str, 
        config: Optional[LLMConfig] = None
    ) -> AsyncGenerator[str, None]:
        """Generate streaming text response"""
        config = config or self.default_config
        
        if config.provider == LLMProvider.OPENAI:
            async for chunk in self._stream_openai(prompt, config):
                yield chunk
        else:
            # For non-streaming providers, yield the complete response
            response = await self.generate_text(prompt, config)
            yield response
    
    async def _stream_openai(self, prompt: str, config: LLMConfig) -> AsyncGenerator[str, None]:
        """Stream text from OpenAI"""
        client = self.providers.get(LLMProvider.OPENAI)
        if not client:
            raise ValueError("OpenAI client not initialized")
        
        stream = await client.chat.completions.create(
            model=config.model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=config.temperature,
            max_tokens=config.max_tokens,
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

# AI Code Generation Service
class CodeGenerationService(LLMService):
    """Specialized service for AI code generation"""
    
    def __init__(self):
        super().__init__()
        self.code_templates = {
            "python_ml": """
Generate Python machine learning code for the following task:
{task_description}

Requirements:
- Use scikit-learn, pandas, numpy
- Include data preprocessing
- Add model evaluation
- Follow best practices
- Add comments and docstrings

Code:
""",
            "data_pipeline": """
Generate a data pipeline code for:
{task_description}

Requirements:
- Use pandas for data manipulation
- Include error handling
- Add logging
- Make it production-ready

Code:
""",
            "api_endpoint": """
Generate FastAPI endpoint code for:
{task_description}

Requirements:
- Use FastAPI framework
- Include proper error handling
- Add input validation with Pydantic
- Include response models
- Add documentation

Code:
"""
        }
    
    async def generate_code(
        self, 
        task_description: str, 
        code_type: str = "python_ml",
        language: str = "python"
    ) -> str:
        """Generate code based on task description"""
        template = self.code_templates.get(code_type, self.code_templates["python_ml"])
        prompt = template.format(task_description=task_description)
        
        system_prompt = f"""You are an expert {language} programmer specializing in ML and data engineering.
Generate clean, efficient, and well-documented code.
Follow best practices and include proper error handling."""
        
        return await self.generate_text(prompt, system_prompt=system_prompt)
    
    async def explain_code(self, code: str) -> str:
        """Generate explanation for existing code"""
        prompt = f"""
Explain this code in detail:

```
{code}
```

Provide:
1. Overview of what the code does
2. Step-by-step explanation
3. Key concepts used
4. Potential improvements
"""
        
        system_prompt = "You are a code reviewer and teacher. Explain code clearly and thoroughly."
        return await self.generate_text(prompt, system_prompt=system_prompt)

# Global service instance
llm_service = LLMService()
code_service = CodeGenerationService()