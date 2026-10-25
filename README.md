# Pre-Post Checker 🛡️

AI-powered platform that predicts whether social media posts will be moderated/blocked.

**Team**: Akimov Daniil powered with latest technologies

**Goal for the semester**: Build and deploy Instagram text, photo moderation binary classifiers (for at least 3 violation category each) with web interface

**After goal achieved**: Extend the number of violation categories, fuse two separate models

## Who will use this?
It can be used by content creators that want to be assured in their content won't be blocked by the social media platform. Potentially the social media platform could use this checker for checking one's post's alignment with platform rules.

## Preliminary Technical Stack
- **ML**: PyTorch 2.0.1, Transformers 4.35.0, RoBERTa-base
- **Backend**: FastAPI, Redis, PostgreSQL
- **Frontend**: Next.js 14, TypeScript, Tailwind
- **Infra**: Docker, GitHub Actions (CI)

## NFR
Coming not really soon. As far as it is my first project, don't expect anything extraordinary. In the first phase (this semester) I would be glad if it will be running (70-80% accuracy score on assesssment tests would be considered fantastic by me).
