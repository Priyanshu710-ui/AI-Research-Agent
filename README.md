# AI Research Agent

An AI-powered research assistant that searches the web, analyzes multiple sources, generates a structured cited report, and provides section-specific visual references with downloadable PDF output.

## 🚀 Live Demo

**[Open the deployed AI Research Agent](https://ai-research-agent-nine-steel.vercel.app)**

## ✨ Features

- 🔎 Autonomous web research using Tavily
- 🧠 Research planning and report generation with Google Gemini
- 📝 Structured Markdown research reports
- 🔗 Inline citations linked to original sources
- 🖼️ Section-specific image research
- 📄 Downloadable PDF reports
- ⚡ Next.js frontend
- 🚀 FastAPI backend
- 🐳 Docker and Docker Compose support
- ☁️ Frontend deployed on Vercel
- ☁️ Backend deployed on Render

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

## 🔑 API Keys

The backend requires two API keys:

- **Gemini API key** — used for research planning and report generation.
- **Tavily API key** — used for web and image search.

Create your local environment file from the example:

```bash
cp .env.example .env
```

Then add your real keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

**Never commit your real `.env` file or API keys to GitHub.**

## 💻 Run Locally

### Option 1 — Docker Compose

From the project root:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

### Option 2 — Run Backend and Frontend Separately

#### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Make sure your environment variables are available, then start FastAPI:

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

#### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## 🔄 How It Works

```text
User enters a research topic
          ↓
Next.js Frontend
          ↓
FastAPI Backend
          ↓
Gemini creates focused research queries
          ↓
Tavily searches the web
          ↓
Sources are collected and deduplicated
          ↓
Gemini writes the cited research report
          ↓
Tavily finds section-specific images
          ↓
Frontend renders report + sources + visuals
          ↓
User downloads the report as PDF
```

## 🌐 Deployment

### Frontend — Vercel

The frontend is deployed on Vercel.

Live URL:

https://ai-research-agent-nine-steel.vercel.app

### Backend — Render

The FastAPI backend is deployed on Render.

Backend URL:

https://ai-research-agent-li2u.onrender.com

For a new deployment, set these environment variables on the backend service:

```text
GEMINI_API_KEY
TAVILY_API_KEY
```

The frontend should use the backend URL through `NEXT_PUBLIC_API_URL` or the configured production API URL.

## 🔌 API

The main research endpoint is:

```http
POST /research
```

Example request:

```json
{
  "topic": "Impact of artificial intelligence on software engineering"
}
```

## 🔒 Security Notes

- API keys are stored as environment variables.
- `.env` files are ignored by Git.
- Do not expose Gemini or Tavily keys in frontend code.
- For production-scale use, add authentication, rate limiting, logging, and stronger CORS restrictions.

## 📌 Status

**Production deployment working.**

Built with Next.js, FastAPI, Gemini, Tavily, Docker, Vercel, and Render.
