# AI Services Setup Guide

## Overview
LuminaOps supports multiple AI service providers. This guide helps you configure API keys and set up the AI services.

## Supported AI Providers

### 1. OpenAI (GPT-4, GPT-3.5-turbo)
- **Models:** GPT-4, GPT-4-turbo, GPT-3.5-turbo
- **Use Cases:** Text generation, code completion, chat, embeddings
- **Setup:**
  1. Get API key from: https://platform.openai.com/api-keys
  2. Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`

### 2. Anthropic (Claude)
- **Models:** Claude-3, Claude-2, Claude-instant
- **Use Cases:** Text analysis, reasoning, safe AI responses
- **Setup:**
  1. Get API key from: https://console.anthropic.com/
  2. Add to `.env`: `ANTHROPIC_API_KEY=your-anthropic-key`

### 3. Hugging Face
- **Models:** Open source models (Llama, Mistral, etc.)
- **Use Cases:** Local inference, custom models
- **Setup:**
  1. Get token from: https://huggingface.co/settings/tokens
  2. Add to `.env`: `HUGGINGFACE_API_TOKEN=your-hf-token`

## Configuration Steps

1. **Copy the example environment:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file with your API keys:**
   ```bash
   # AI Services API Keys
   OPENAI_API_KEY=sk-proj-your-openai-key-here
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
   HUGGINGFACE_API_TOKEN=hf_your-huggingface-token-here
   ```

3. **Install AI dependencies:**
   ```bash
   cd backend
   source venv/bin/activate
   pip install openai anthropic transformers torch
   ```

4. **Test the configuration:**
   ```bash
   # Test OpenAI
   curl -X POST "http://localhost:8002/api/v1/ai/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello!", "provider": "openai"}'
   ```

## API Usage Examples

### Chat Completion
```python
POST /api/v1/ai/chat
{
    "message": "Explain machine learning",
    "provider": "openai",
    "model": "gpt-4"
}
```

### Text Generation
```python
POST /api/v1/ai/generate
{
    "prompt": "Write a Python function to",
    "provider": "anthropic",
    "max_tokens": 500
}
```

### Code Generation
```python
POST /api/v1/ai/code
{
    "description": "Create a REST API endpoint",
    "language": "python",
    "provider": "openai"
}
```

## Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Monitor API usage and costs**
5. **Use least-privilege access tokens**

## Cost Management

### OpenAI Pricing (as of 2024)
- GPT-4: ~$0.03/1K tokens (input), ~$0.06/1K tokens (output)
- GPT-3.5-turbo: ~$0.001/1K tokens (input), ~$0.002/1K tokens (output)

### Cost Optimization Tips
- Use GPT-3.5-turbo for simple tasks
- Implement response caching
- Set token limits on requests
- Monitor usage with the dashboard

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Check `.env` file exists and has correct keys
   - Restart the backend server after adding keys

2. **"Rate limit exceeded" error**
   - Check your API usage quotas
   - Implement retry logic with exponential backoff

3. **"Model not found" error**
   - Verify model names in your requests
   - Check provider availability

### Debug Mode
Enable debug logging in `.env`:
```
DEBUG=true
LOG_LEVEL=DEBUG
```

## Next Steps

1. Configure your preferred AI providers
2. Test the API endpoints
3. Explore the web UI at http://localhost:3003
4. Check the monitoring dashboard for usage metrics