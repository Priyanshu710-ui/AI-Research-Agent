<div align="center">

# 🔬 AI Research Agent

### From a question to a cited research report — automatically.

<p>
  <a href="https://ai-research-agent-nine-steel.vercel.app"><strong>🚀 Live Demo</strong></a>
  ·
  <a href="#-how-it-works">How it works</a>
  ·
  <a href="#-run-locally">Run locally</a>
  ·
  <a href="#-roadmap">Roadmap</a>
</p>

<p>
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=for-the-badge" alt="Gemini" />
  <img src="https://img.shields.io/badge/Search-Tavily-111827?style=for-the-badge" alt="Tavily" />
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge" alt="FastAPI" />
  <img src="https://img.shields.io/badge/UI-Next.js-000000?style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-111111?style=for-the-badge" alt="Deployment" />
</p>

<p>
  <img src="https://img.shields.io/github/stars/Priyanshu710-ui/AI-Research-Agent?style=flat-square" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/Priyanshu710-ui/AI-Research-Agent?style=flat-square" alt="GitHub forks" />
  <img src="https://img.shields.io/github/last-commit/Priyanshu710-ui/AI-Research-Agent?style=flat-square" alt="Last commit" />
</p>

<p><em>Research less. Understand more.</em></p>

</div>

---

## 🧠 What is this?

**AI Research Agent** is a full-stack research workspace that turns a natural-language topic into a structured, source-backed report.

Instead of stopping at search results, it runs a multi-step workflow:

> **Plan → Search → Collect → Synthesize → Cite → Illustrate → Export**

The result is a readable research report with inline source links, section-specific visuals, and PDF export.

> **Why it's interesting:** this is an agentic research workflow, not just a chatbot with a search box.

---

## 🚀 Live Demo

### [Open AI Research Agent →](https://ai-research-agent-nine-steel.vercel.app)

The project is documented as a production deployment with a Vercel frontend and Render FastAPI backend.

---

## ✨ What you can do

| | Capability | Result |
|---|---|---|
| 🔎 | **Autonomous research** | Searches multiple relevant sources with Tavily |
| 🧠 | **Research planning** | Gemini turns a broad question into focused queries |
| 📝 | **Report synthesis** | Findings become a structured research report |
| 🔗 | **Inline citations** | Claims stay connected to original sources |
| 🖼️ | **Visual research** | Section-specific images support the report |
| 📄 | **PDF export** | Download the finished report |
| ⚡ | **Modern workspace** | Next.js + React + Tailwind research UI |
| 🐳 | **Dockerized** | Run the stack with Docker Compose |
| ☁️ | **Cloud deployed** | Vercel frontend + Render backend |

---

## 🖥️ Product flow

```text
┌──────────────────────────────────────────────────────────────┐
│                       USER QUESTION                          │
│          "How is AI changing software engineering?"         │
└─────────────────────────────┬────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                         RESEARCH PLAN                        │
│             Gemini creates focused search queries            │
└─────────────────────────────┬────────────────────────────────┘
                              ↓
┌─────────────────────────────┴────────────────────────────────┐
│                 WEB + IMAGE DISCOVERY                        │
│                   Tavily retrieves sources                    │
└─────────────────────────────┬────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    SOURCE-AWARE SYNTHESIS                    │
│             Gemini turns evidence into a report              │
└─────────────────────────────┬────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                  REPORT + CITATIONS + VISUALS                │
└─────────────────────────────┬────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                          PDF EXPORT                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Architecture

![AI Research Agent Architecture](docs/architecture.svg)

<sub>Plan → Search → Collect → Synthesize → Cite → Illustrate → Export</sub>

---

## 🔄 How it works

1. **Topic** — the user enters a research question.
2. **Planning** — Gemini creates focused research queries.
3. **Discovery** — Tavily searches the web for relevant sources.
4. **Collection** — sources are gathered and deduplicated.
5. **Synthesis** — Gemini writes a structured, cited report.
6. **Visual research** — relevant images are found for sections.
7. **Presentation** — the frontend renders the report, sources, and visuals.
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
├── docs/
│   └── architecture.svg    # Architecture diagram
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── CONTRIBUTING.md
├── SECURITY.md
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
- See [SECURITY.md](SECURITY.md) for the security policy.

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

## 🎯 Why this is a strong portfolio project

This project demonstrates more than a single API integration. It combines:

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

## 🤝 Contributing

Ideas, bug fixes, UI improvements, research-quality improvements, and documentation are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

---

## 🧪 Production notes

The repository documents the current deployment as working in production. For a larger public deployment, consider authentication, rate limiting, structured logging, request quotas, source-quality scoring, and observability.

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

### ⭐ If this project impressed you, consider starring the repo.

</div>
