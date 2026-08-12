import os
from dotenv import load_dotenv
from google import genai
from tavily import TavilyClient

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

if not TAVILY_API_KEY:
    raise RuntimeError("TAVILY_API_KEY is missing from .env")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

MODEL = "gemini-3.5-flash"


# =========================================================
# HELPER - CLEAN IMAGE URL
# =========================================================

def extract_image_url(image):
    """
    Extract an image URL from different Tavily image formats.
    """

    if isinstance(image, str):
        return image

    if isinstance(image, dict):
        return (
            image.get("url")
            or image.get("image_url")
            or image.get("src")
            or ""
        )

    return ""


# =========================================================
# WEB SEARCH
# =========================================================

def search_web(query: str, max_results: int = 6):
    """
    Search the web using Tavily.

    Returns both:
    - web sources
    - image URLs
    """

    try:
        results = tavily_client.search(
            query=query,
            search_depth="advanced",
            max_results=max_results,
            include_images=True,
        )

        sources = []

        for r in results.get("results", []):
            if r.get("url"):
                sources.append(
                    {
                        "title": r.get("title", ""),
                        "url": r.get("url", ""),
                        "content": r.get("content", ""),
                    }
                )

        # -------------------------------------------------
        # IMPORTANT:
        # DO NOT THROW AWAY TAVILY IMAGES
        # -------------------------------------------------

        images = []

        for image in results.get("images", []):
            image_url = extract_image_url(image)

            if (
                image_url
                and image_url.startswith(
                    ("http://", "https://")
                )
                and image_url not in images
            ):
                images.append(image_url)

        return {
            "sources": sources,
            "images": images,
        }

    except Exception as e:
        print("Web search error:", e)

        return {
            "sources": [],
            "images": [],
        }


# =========================================================
# IMAGE SEARCH
# =========================================================

def search_images(query: str, max_images: int = 4):
    """
    Search specifically for images using Tavily.
    """

    try:
        results = tavily_client.search(
            query=query,
            search_depth="advanced",
            max_results=8,
            include_images=True,
        )

        images = []

        # -------------------------------------------------
        # Get images returned directly by Tavily
        # -------------------------------------------------

        for image in results.get("images", []):

            image_url = extract_image_url(image)

            if (
                image_url
                and image_url.startswith(
                    ("http://", "https://")
                )
                and image_url not in images
            ):
                images.append(image_url)

            if len(images) >= max_images:
                break

        return images

    except Exception as e:
        print(
            f"Image search error for '{query}':",
            e
        )

        return []


# =========================================================
# GEMINI
# =========================================================

def generate_text(
    prompt: str,
    system_instruction: str
):
    """
    Generate text using Gemini.
    """

    response = gemini_client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={
            "system_instruction": system_instruction,
        },
    )

    return response.text or ""


# =========================================================
# QUERY PLANNER
# =========================================================

def plan_subqueries(
    topic: str,
    n: int = 4
):
    """
    Break the topic into focused research questions.
    """

    system_instruction = f"""
You are an expert research planner.

Break the user's research topic into exactly {n}
focused web search queries.

Cover different aspects of the topic:

- background and history
- important developments and evidence
- impact, benefits, or applications
- challenges, limitations, or controversies

Return exactly one short search query per line.

Do not number them.
Do not use bullet points.
Do not add explanations.
"""

    text = generate_text(
        topic,
        system_instruction
    )

    queries = [
        q.strip("-• ").strip()
        for q in text.splitlines()
        if q.strip()
    ]

    queries = queries[:n]

    if not queries:
        return [topic]

    return queries


# =========================================================
# SECTION IMAGE QUERIES
# =========================================================

def create_image_queries(topic: str):
    """
    Create focused image searches for every report section.
    """

    return {
        "Executive Summary":
            f"{topic} overview",

        "1. Background":
            f"{topic} history background",

        "2. Key Findings":
            f"{topic} key findings",

        "3. Detailed Analysis":
            f"{topic} detailed analysis",

        "4. Benefits and Opportunities":
            f"{topic} benefits opportunities",

        "5. Challenges and Limitations":
            f"{topic} challenges limitations",

        "6. Future Outlook":
            f"{topic} future developments",
    }


# =========================================================
# COLLECT SECTION IMAGES
# =========================================================

def collect_section_images(topic: str):
    """
    Search for images separately for every report section.
    """

    image_queries = create_image_queries(topic)

    section_images = {}

    for section, query in image_queries.items():

        print("")
        print("=" * 60)
        print(f"IMAGE SEARCH: {section}")
        print(f"QUERY: {query}")
        print("=" * 60)

        images = search_images(
            query,
            max_images=3
        )

        section_images[section] = images

        print(
            f"Found {len(images)} images"
        )

        for image in images:
            print(image)

    return section_images


# =========================================================
# REPORT WRITER
# =========================================================

def write_report(
    topic: str,
    sources: list
):
    """
    Generate a structured cited research report.
    """

    source_block = "\n\n".join(
        f"""
SOURCE [{i + 1}]
Title: {s["title"]}
URL: {s["url"]}
Content:
{s["content"][:2500]}
"""
        for i, s in enumerate(sources)
    )

    prompt = f"""
Research Topic:
{topic}

You have been given web sources below.

{source_block}

Write a high-quality research report about the topic.

IMPORTANT RULES:

1. Use ONLY information supported by the provided sources.
2. Do not invent statistics, facts, companies, dates, or claims.
3. Cite important claims inline using [1], [2], [3], etc.
4. Citation numbers must match the SOURCE numbers.
5. Use clear Markdown formatting.
6. Make the report useful for a student, researcher, or developer.
7. Explain technical concepts in simple language.
8. If sources disagree, mention the disagreement.
9. Clearly separate evidence from general conclusions.

Use EXACTLY this structure:

# {topic}

## Executive Summary

Give a short overview of the most important findings.

## 1. Background

Explain the topic and why it matters.

## 2. Key Findings

Present the strongest findings from the research.

## 3. Detailed Analysis

Explain the important evidence and developments.

## 4. Benefits and Opportunities

Discuss positive impacts and practical opportunities.

## 5. Challenges and Limitations

Discuss risks, weaknesses, uncertainty, or opposing evidence.

## 6. Future Outlook

Discuss what the available sources suggest about the future.

## Conclusion

Give a concise overall conclusion based only on the sources.

## Sources

List every source in this format:

[1] Title - URL
[2] Title - URL

Do not create sources that were not provided.
"""

    system_instruction = """
You are a professional research analyst.

Your job is to synthesize web sources into an accurate,
well-structured research report.

Accuracy is more important than sounding impressive.

Every important factual claim should have an inline citation.

Never fabricate information.

Follow the requested section structure exactly.
"""

    return generate_text(
        prompt,
        system_instruction
    )


# =========================================================
# MAIN RESEARCH PIPELINE
# =========================================================

def run_research(topic: str):
    """
    Run the complete research pipeline.
    """

    topic = topic.strip()

    if not topic:
        raise ValueError(
            "Research topic cannot be empty."
        )

    # =====================================================
    # 1. CREATE RESEARCH QUERIES
    # =====================================================

    queries = plan_subqueries(
        topic,
        n=4
    )

    print("")
    print("=" * 70)
    print("RESEARCH QUERIES")
    print("=" * 70)

    for query in queries:
        print(query)

    # =====================================================
    # 2. SEARCH WEB
    # =====================================================

    all_sources = []

    seen_urls = set()

    # These are general images collected during
    # the normal web searches.
    general_images = []

    seen_images = set()

    for query in queries:

        print("")
        print(f"Searching web: {query}")

        search_result = search_web(
            query,
            max_results=6
        )

        # -------------------------------------------------
        # SOURCES
        # -------------------------------------------------

        for source in search_result["sources"]:

            url = source.get(
                "url",
                ""
            )

            if (
                url
                and url not in seen_urls
            ):
                seen_urls.add(url)

                all_sources.append(
                    source
                )

        # -------------------------------------------------
        # IMAGES
        # -------------------------------------------------

        for image in search_result["images"]:

            if image not in seen_images:

                seen_images.add(image)

                general_images.append(
                    image
                )

    # =====================================================
    # 3. FALLBACK SEARCH
    # =====================================================

    if not all_sources:

        print(
            "No sources found. Running fallback search."
        )

        fallback = search_web(
            topic,
            max_results=8
        )

        all_sources = fallback["sources"]

        for image in fallback["images"]:

            if image not in seen_images:

                seen_images.add(image)

                general_images.append(
                    image
                )

    if not all_sources:

        raise RuntimeError(
            "No web sources were found for this research topic."
        )

    # =====================================================
    # 4. LIMIT SOURCES
    # =====================================================

    all_sources = all_sources[:20]

    # =====================================================
    # 5. GENERATE REPORT
    # =====================================================

    print("")
    print("=" * 70)
    print("GENERATING REPORT")
    print("=" * 70)

    report = write_report(
        topic,
        all_sources
    )

    # =====================================================
    # 6. SEARCH SECTION-SPECIFIC IMAGES
    # =====================================================

    section_images = collect_section_images(
        topic
    )

    # =====================================================
    # 7. FALLBACK:
    # IF A SECTION HAS NO IMAGES,
    # USE GENERAL RESEARCH IMAGES
    # =====================================================

    if general_images:

        sections = [
            "Executive Summary",
            "1. Background",
            "2. Key Findings",
            "3. Detailed Analysis",
            "4. Benefits and Opportunities",
            "5. Challenges and Limitations",
            "6. Future Outlook",
        ]

        for index, section in enumerate(
            sections
        ):

            current_images = section_images.get(
                section,
                []
            )

            if not current_images:

                start = (
                    index * 2
                )

                fallback_images = general_images[
                    start:start + 2
                ]

                # If we run out of unique images,
                # reuse existing images.
                if not fallback_images:

                    fallback_images = (
                        general_images[:2]
                    )

                section_images[
                    section
                ] = fallback_images

    # =====================================================
    # 8. PRINT FINAL IMAGE COUNT
    # =====================================================

    print("")
    print("=" * 70)
    print("FINAL SECTION IMAGES")
    print("=" * 70)

    for section, images in section_images.items():

        print(
            f"{section}: {len(images)} images"
        )

    # =====================================================
    # 9. RETURN EVERYTHING TO FRONTEND
    # =====================================================

    return {
        "topic": topic,

        "queries_used": queries,

        "sources": [
            {
                "title": source[
                    "title"
                ],
                "url": source[
                    "url"
                ],
            }
            for source in all_sources
        ],

        "report_markdown": report,

        "section_images": section_images,

        # Also return general images.
        # This gives the frontend another fallback.
        "images": general_images[:20],
    }