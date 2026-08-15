<div align="center">

# 🔬 AI Research Agent

### From a question to a cited research report — automatically.

<p>
  <a href="https://ai-research-agent-nine-steel.vercel.app"><strong>🚀 Live Demo</strong></a>
  ·
  <a href="#-how-it-works">How it works</a>
  ·
  <a href="#-run-locally">Run locally</a>
</p>

<p>
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=flat-square" alt="Gemini" />
  <img src="https://img.shields.io/badge/Search-Tavily-111827?style=flat-square" alt="Tavily" />
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=flat-square" alt="FastAPI" />
  <img src="https://img.shields.io/badge/UI-Next.js-000000?style=flat-square" alt="Next.js" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-111111?style=flat-square" alt="Deployment" />
  <img src="https://img.shields.io/badge/Containers-Docker-2496ED?style=flat-square" alt="Docker" />
</p>

<p><em>Research less. Understand more.</em></p>

</div>

---

## 💡 What is this?

**AI Research Agent** is a full-stack research workspace that turns a natural-language topic into a structured, source-backed report.

Instead of dumping search results on the user, it runs a multi-step workflow:

**Plan → Search → Synthesize → Cite → Illustrate → Export**

The result is a readable research report with inline source links, section-specific visuals, and PDF export.

> **Why it's different:** this is an agentic research workflow, not just a chatbot with a search box.

---

## ✨ Highlights

| | Capability | What happens |
|---|---|---|
| 🔎 | **Autonomous research** | Tavily searches multiple relevant sources for the topic. |
| 🧠 | **Research planning** | Gemini turns a broad question into focused research queries. |
| 📝 | **Report synthesis** | Findings are transformed into a structured Markdown report. |
| 🔗 | **Source citations** | Claims stay connected to their original sources. |
| 🖼️ | **Visual research** | Relevant images are researched for individual sections. |
| 📄 | **PDF export** | The finished report can be downloaded as a PDF. |
| ⚡ | **Modern UI** | Next.js + React + Tailwind provide the research workspace. |
| 🐳 | **Dockerized** | Backend and frontend can run together with Docker Compose. |
| ☁️ | **Production deployment** | Frontend on Vercel, backend on Render. |

---

## 🚀 Live Demo

**[Open AI Research Agent →](https://ai-research-agent-nine-steel.vercel.app)**

The current project is documented as a production deployment with a Vercel frontend and Render FastAPI backend.

---

## 🧩 How it works

```text
┌──────────────────────┐
│    User enters topic │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Next.js Frontend   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    FastAPI Backend   │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌──────────┐
│  Gemini  │ │  Tavily  │
│ Planning │ │   Web    │
│ Synthesis│ │  Search  │
└────┬─────┘ └────┬─────┘
     │            │
     └──────┬─────┘
            ▼
┌──────────────────────┐
│ Structured Research  │
│ + Citations + Images │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       PDF Export     │
└──────────────────────┘
```

### The pipeline

1. **Topic** — the user enters a research question.
2. **Planning** — Gemini creates focused research queries.
3. **Discovery** — Tavily searches the web for relevant sources.
4. **Collection** — sources are gathered and deduplicated.
5. **Synthesis** — Gemini writes a structured, cited report.
6. **Visual research** — relevant images are found for sections.
7. **Presentation** — the frontend renders the report, citations, and visuals.
8. **Export** — the user downloads the result as a PDF.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | **Next.js · React · Tailwind CSS** |
| Backend | **FastAPI · Python** |
| Reasoning / Generation | **Google Gemini** |
| Web + Image Search | **Tavily** |
| Deployment | **Vercel · Render** |
| Containers | **Docker · Docker Compose** |

---

## 📁 Project Structure

```text
AI-Research-Agent/
│
├── backend/
│   ├── agent.py            # Research workflow
│   ├── main.py             # FastAPI API
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/
│   ├── pages/              # Next.js pages
│   ├── styles/             # UI styles
│   ├── package.json
│   └── Dockerfile
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🔐 Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Add your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### 🔒 Security

- Never commit `.env` or real API keys.
- Keep Gemini and Tavily credentials on the backend.
- Use `.env.example` only as a template.
- For public production use, add authentication, rate limiting, logging, and stricter CORS.

---

## 💻 Run Locally

### Option A — Docker Compose

From the repository root:

```bash
docker compose up --build
```

Then open:

- **Frontend:** http://localhost:3000
- **Backend API docs:** http://localhost:8000/docs

### Option B — Run services separately

#### Backend

```bash
cd backend
python -m venv venv
```

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

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

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

---

## 🌐 Deployment

### Frontend — Vercel

**Live:** https://ai-research-agent-nine-steel.vercel.app

### Backend — Render

**API:** https://ai-research-agent-li2u.onrender.com

Configure the backend with:

```text
GEMINI_API_KEY
TAVILY_API_KEY
```

Configure the frontend to point to the production backend URL using the project's production API configuration.

---

## 🔌 API

### `POST /research`

Starts a research workflow for a topic.

Example request:

```json
{
  "topic": "Impact of artificial intelligence on software engineering"
}
```

---

## 🎯 Why this makes a strong portfolio project

This project demonstrates more than API integration. It combines:

- **Agentic workflow design**
- **LLM planning and synthesis**
- **Real web retrieval**
- **Citation-aware generation**
- **Multimodal research support**
- **Full-stack architecture**
- **PDF generation**
- **Dockerized development**
- **Cloud deployment**

It is a practical example of connecting an AI reasoning layer to real external tools and a usable product interface.

---

## 🗺️ Roadmap

- [x] Web research pipeline
- [x] Gemini research planning
- [x] Structured report synthesis
- [x] Source citations
- [x] Section-specific visuals
- [x] PDF export
- [x] Docker support
- [x] Vercel + Render deployment
- [ ] Saved research projects
- [ ] Streaming research progress
- [ ] Source-quality scoring
- [ ] Multi-agent research workflows
- [ ] Research history and comparison

---

## 👨‍💻 Built By

**Priyanshu Sharma**

Built as a full-stack exploration of agentic research systems using **Gemini, Tavily, FastAPI, Next.js, Docker, Vercel, and Render**.

<div align="center">

### ⭐ If this project helped or impressed you, consider starring the repo.

</div>
