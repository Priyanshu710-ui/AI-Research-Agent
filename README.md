# AI Research Agent

Give it a topic. It searches the web (Tavily), reasons about what to look up,
and writes a cited markdown report (OpenAI).

## Stack
- Frontend: Next.js + Tailwind
- Backend: FastAPI
- AI: OpenAI (gpt-4o-mini by default)
- Search: Tavily API
- Deploy: Docker / docker-compose

## 1. Get API keys
- OpenAI: https://platform.openai.com/api-keys
- Tavily (free tier available): https://tavily.com

## 2. Configure
```bash
cp .env.example .env
# then edit .env and paste in your two keys
```

## 3. Run with Docker (recommended)
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend docs: http://localhost:8000/docs

## 4. Run without Docker (local dev)

Backend:
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...
export TAVILY_API_KEY=tvly-...
uvicorn main:app --reload
```

Frontend (in a second terminal):
```bash
cd frontend
npm install
npm run dev
```

## How it works
1. `POST /research {"topic": "..."}` hits the FastAPI backend.
2. `agent.py` asks OpenAI to break the topic into a few focused search queries.
3. Each query is run through Tavily search; results are deduplicated by URL.
4. OpenAI writes a markdown report using only the retrieved sources, citing
   each claim as `[n]` and listing sources at the end.
5. The Next.js frontend renders the markdown report.

## Notes / next steps
- `gpt-4o-mini` is used for cost. Swap the `model=` value in `agent.py` for
  a stronger model if you want deeper reports.
- CORS is wide open (`allow_origins=["*"]`) for local dev — restrict this
  before deploying publicly.
- No auth/rate-limiting is included — add it before exposing this publicly,
  since each request costs OpenAI + Tavily credits.
