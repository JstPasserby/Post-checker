# 📋 `spec.md` - Pre-Post Checker Phase 1 Specification

## Project Overview
**Goal**: Build and deploy Instagram text moderation binary classifier with web interface
**Timeline**: 7 days
**Tech Lead**: [Your Name]
**AI Partner**: Claude

## Phase 1 Deliverables
1. ✅ Working ML model (Instagram text → blocked/not blocked)
2. ✅ FastAPI backend with prediction endpoint
3. ✅ Next.js frontend with text analyzer
4. ✅ Redis caching layer
5. ✅ Basic feedback collection
6. ✅ Docker setup for local development

## Technical Stack
- **ML**: PyTorch 2.0.1, Transformers 4.35.0, RoBERTa-base
- **Backend**: FastAPI, Redis, PostgreSQL
- **Frontend**: Next.js 14, TypeScript, Tailwind
- **Infra**: Docker, GitHub Actions (CI)

## API Contract
```yaml
POST /api/v1/analyze
Request:
  {
    "text": string,
    "platform": "instagram",
    "language": "en",
    "user_id": optional string
  }

Response:
  {
    "blocked": boolean,
    "confidence": float,
    "violations": array of strings,
    "explanation": string,
    "suggestions": array of strings,
    "processing_time_ms": int
  }
