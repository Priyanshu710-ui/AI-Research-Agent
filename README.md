# AI Research Agent

<p align="center">
  <img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge" alt="Gemini" />
  <img src="https://img.shields.io/badge/Search-Tavily-111827?style=for-the-badge" alt="Tavily" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-111111?style=for-the-badge" alt="Deployment" />
</p>

<p align="center">
  <strong>Research less. Understand more.</strong>
</p>

<p align="center">
  An AI research workspace that turns a topic into a structured, source-backed report — complete with citations, section-specific visuals, and a downloadable PDF.
</p>

<p align="center">
  <a href="https://ai-research-agent-nine-steel.vercel.app">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#run-locally">Run locally</a>
</p>

---

## ✨ Why this project is interesting

Most research tools stop at search results. **AI Research Agent** goes a step further: it plans the research, searches multiple sources, synthesizes the findings into a structured report, preserves source links as citations, researches useful visuals for individual sections, and packages the result as a PDF.

That makes it a practical example of an **agentic AI workflow** rather than a simple chatbot wrapper.

## 🚀 Live Demo

**[Open AI Research Agent](https://ai-research-agent-nine-steel.vercel.app)**

The current README documents the production deployment as Vercel for the frontend and Render for the FastAPI backend. The backend requires Gemini and Tavily credentials as environment variables. 

## 🎯 Features

| Capability | What it does |
|---|---|
| 🔎 Autonomous web research | Searches across multiple relevant sources with Tavily |
| 🧠 Research planning | Uses Gemini to turn a broad topic into focused research queries |
| 📝 Structured report generation | Produces an organized Markdown report instead of a raw search dump |
| 🔗 Inline citations | Connects claims back to the original sources |
| 🖼️ Visual research | Finds section-specific images to support the report |
| 📄 PDF export | Turns the final report into a downloadable PDF |
| ⚡ Modern frontend | Next.js + React + Tailwind-based research UI |
| 🐳 Containerized | Docker and Docker Compose support |
| ☁️ Production deployment | Vercel frontend + Render backend |

## 🧩 Architecture

```text
                         ┌──────────────────────┐
                         │       User Topic     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Next.js Frontend  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌──────────────────┐             ┌──────────────────┐
          │   Gemini        │             │     Tavily       │
          │ Research /      │             │ Web + Image      │
          │ Synthesis       │             │ Search           │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                  │
                   └──────────────┬───────────────────┘
                                  ▼
                       ┌──────────────────────┐
                       │  Cited Research     │
                       │  Report + Visuals   │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │      PDF Export      │
                       └──────────────────────┘
```

## 🔄 How it works

```text
1. User enters a research topic
        ↓
2. Gemini creates focused research queries
        ↓
3. Tavily searches the web
        ↓
4. Sources are collected and deduplicated
        ↓
5. Gemini synthesizes a cited report
        ↓
6. Tavily finds section-specific images
        ↓
7. Frontend renders the report, sources, and visuals
        ↓
8. User downloads a PDF
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | FastAPI, Python |
| AI | Google Gemini |
| Web Search | Tavily API |
| Deployment | Vercel + Render |
| Containers | Docker / Docker Compose |

## 📁 Project Structure

```text
AI-Research-Agent/
├── backend/
│   ├── agent.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── pages/
│   ├── styles/
│   ├── package.json
│   └── Dockerfile
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🔐 Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

**Never commit real API keys.** Keep secrets server-side and use `.env.example` for documentation only.

## 💻 Run Locally

### Option A — Docker Compose

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

### Option B — Run services separately

#### Backend

```bash
cd backend
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend: `http://localhost:8000`

#### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## 🌐 Deployment

### Frontend — Vercel

Live URL:

https://ai-research-agent-nine-steel.vercel.app

### Backend — Render

Backend URL:

https://ai-research-agent-li2u.onrender.com

Configure the backend with:

```text
GEMINI_API_KEY
TAVILY_API_KEY
```

Configure the frontend to use the production backend URL through the project's production API environment variable/configuration.

## 🔌 API

Main research endpoint:

```http
POST /research
```

Example request:

```json
{
  "topic": "Impact of artificial intelligence on software engineering"
}
```

## 🧪 Production Notes

The repository documents the current deployment as working in production. For a larger public deployment, consider adding authentication, rate limiting, structured logging, stricter CORS, request quotas, and observability.

## 🗺️ Roadmap

- [x] Web research pipeline
- [x] Gemini report synthesis
- [x] Source citations
- [x] Section-specific visuals
- [x] PDF export
- [x] Docker support
- [x] Vercel + Render deployment
- [ ] Research history and saved projects
- [ ] Streaming generation progress
- [ ] Source-quality scoring
- [ ] Multi-agent research workflows

## 👨‍💻 Built By

**Priyanshu Sharma**

Built as a full-stack exploration of agentic research workflows using Gemini, Tavily, FastAPI, Next.js, Docker, Vercel, and Render.
