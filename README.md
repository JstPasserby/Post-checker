# Pre-Post Checker 🛡️

AI-powered platform that predicts whether social media posts will be moderated/blocked.

**Team**: Akimov Daniil powered with latest technologies

**Goal for the semester**: Build and deploy Instagram text, photo moderation binary classifiers (for at least 3 violation category each) with web interface

**After goal achieved**: Extend the number of violation categories, fuse two separate models, drift moderation (as far as platform rules are constantly changing)

## Who will use this?
It can be used by content creators that want to be assured in their content won't be blocked by the social media platform. Potentially the social media platform could use this checker for checking one's post's alignment with platform rules.

## Preliminary Technical Stack
- **ML**: PyTorch 2.0.1, Transformers 4.35.0, RoBERTa-base
- **Backend**: FastAPI, Redis, PostgreSQL
- **Frontend**: Next.js 14, TypeScript, Tailwind
- **Infra**: Docker, GitHub Actions (CI)

## NFR
Coming not really soon. As far as it is my first project, I don't expect anything extraordinary. In the first phase (this semester) I would be glad if it will be running (70-80% accuracy score on assesssment tests would be considered fantastic by me).

# DDD
## Bounded contexts
**Content Moderation** (Core domain) — Accept posts, obtain model opinions, apply policy, produce decisions, collect feedback

**Model Lifecycle** (Supporting domain) — Train, evaluate, register, promote, monitor drift

**Review & Appeals** (Supporting domain) — Human moderator queues, appeals, escalation

**Identity** (Generic domain) — Who is calling the API, and what are they allowed to do?

## Ubiquitous language
**Post** — User-submitted content (image + caption)

**Signal** — One model's opinion: category + score + model version

**Assessment** — Set of signals for a post, from a specific model bundle

**Policy** — Versioned rules mapping: signals → severity/action

**Moderation Case** — The aggregate that owns a post's moderation lifecycle

**Decision** — allow / flag_for_review / block, with reason

**Feedback** — Human correction of a decision or signal

**Model version** — Immutable, promotable artifact + metrics

## Diagrams
You can find them in docs/
Each scheme was chosen as it is the most representative and the most common to use in the case.
