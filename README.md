# Pre-Post Checker 🛡️

AI-powered platform that predicts whether social media posts will be moderated/blocked.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/yourusername/pre-post-checker
cd pre-post-checker
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train model
python -m src.ml.training.train_instagram

# Run backend
uvicorn src.backend.api.main:app --reload

# Run frontend (in another terminal)
cd src/frontend
npm install
npm run dev

## 📦 Project Structure
See spec.md for detailed architecture.

## 📊 Status
Phase 1 (Instagram Text Moderation) - In Progress
