from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import traceback

from agent import run_research

app = FastAPI(title="AI Research Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "gemini_key_set": bool(os.environ.get("GEMINI_API_KEY")),
        "tavily_key_set": bool(os.environ.get("TAVILY_API_KEY")),
    }


@app.post("/research")
def research(req: ResearchRequest):
    if not req.topic or not req.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="topic is required",
        )

    if (
        not os.environ.get("GEMINI_API_KEY")
        or not os.environ.get("TAVILY_API_KEY")
    ):
        raise HTTPException(
            status_code=500,
            detail="Server is missing GEMINI_API_KEY or TAVILY_API_KEY.",
        )

    try:
        return run_research(req.topic.strip())

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )