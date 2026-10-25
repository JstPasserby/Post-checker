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
