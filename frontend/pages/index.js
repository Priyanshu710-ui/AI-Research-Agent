import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = "https://ai-research-agent-li2u.onrender.com";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // ---------------------------------------------------------
  // MOUSE EFFECT
  // ---------------------------------------------------------

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ---------------------------------------------------------
  // RESEARCH ANIMATION
  // ---------------------------------------------------------

  useEffect(() => {
    if (!loading) {
      setStage(0);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 900),
      setTimeout(() => setStage(2), 2200),
      setTimeout(() => setStage(3), 3800),
      setTimeout(() => setStage(4), 5200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  // ---------------------------------------------------------
  // PRINT CSS
  // ---------------------------------------------------------

  useEffect(() => {
    const style = document.createElement("style");

    style.id = "research-print-style";

    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }

        html,
        body {
          background: white !important;
          color: black !important;
        }

        body * {
          visibility: hidden !important;
        }

        #pdf-report,
        #pdf-report * {
          visibility: visible !important;
        }

        #pdf-report {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: white !important;
          color: black !important;
        }

        #pdf-report h1,
        #pdf-report h2,
        #pdf-report h3,
        #pdf-report p,
        #pdf-report li,
        #pdf-report strong {
          color: black !important;
        }

        #pdf-report img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }

        .no-print {
          display: none !important;
        }

        .sources-section {
          display: none !important;
        }

        .section-images {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }

        .image-card {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          background: white !important;
          border: 1px solid #ccc !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      const old = document.getElementById(
        "research-print-style"
      );

      if (old) old.remove();
    };
  }, []);

  // ---------------------------------------------------------
  // RUN RESEARCH
  // ---------------------------------------------------------

  async function runResearch() {
    if (!topic.trim()) {
      setError("Enter something you want to research.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setStage(0);

    try {
      const response = await fetch(`${API_URL}/research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Research failed."
        );
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Could not connect to the research agent."
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // COPY
  // ---------------------------------------------------------

  async function copyReport() {
    if (!result?.report_markdown) return;

    try {
      await navigator.clipboard.writeText(
        result.report_markdown
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Could not copy the report.");
    }
  }

  // ---------------------------------------------------------
  // PDF
  // ---------------------------------------------------------

  function downloadPDF() {
    if (!result?.report_markdown) return;

    setPdfLoading(true);

    setTimeout(() => {
      window.print();
      setPdfLoading(false);
    }, 300);
  }

  // ---------------------------------------------------------
  // NEW RESEARCH
  // ---------------------------------------------------------

  function newResearch() {
    setResult(null);
    setTopic("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ---------------------------------------------------------
  // PARSE REPORT
  // ---------------------------------------------------------

  function parseReport(markdown) {
    if (!markdown) return [];

    const lines = markdown.split("\n");

    const sections = [];

    let current = null;

    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/);

      if (match) {
        if (current) {
          sections.push(current);
        }

        current = {
          title: match[1].trim(),
          content: [],
        };
      } else if (current) {
        current.content.push(line);
      }
    }

    if (current) {
      sections.push(current);
    }

    return sections;
  }

  // ---------------------------------------------------------
  // SECTION IMAGES
  // ---------------------------------------------------------

  function getImagesForSection(title) {
    if (!result?.section_images) {
      return [];
    }

    const images = result.section_images;

    if (images[title]) {
      return images[title];
    }

    const normalized = title
      .replace(/^#+\s*/, "")
      .trim()
      .toLowerCase();

    const key = Object.keys(images).find(
      (item) =>
        item.toLowerCase() === normalized
    );

    return key ? images[key] : [];
  }

  // ---------------------------------------------------------
  // IMAGE COMPONENT
  // ---------------------------------------------------------

  function SectionImages({ images, title }) {
    if (!images || images.length === 0) {
      return null;
    }

    return (
      <div className="section-images">
        <div className="visual-label">
          <span>✦</span>
          VISUAL REFERENCES
        </div>

        <div
          className={
            images.length > 1
              ? "image-grid"
              : "image-grid single"
          }
        >
          {images.map((image, index) => (
            <div
              className="image-card"
              key={`${image}-${index}`}
            >
              <div className="image-number">
                0{index + 1}
              </div>

              <img
                src={image}
                alt={`${title} visual ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.parentElement.style.display =
                    "none";
                }}
              />

              <div className="image-overlay">
                <span>VISUAL EVIDENCE</span>
                <span>↗</span>
              </div>

              <div className="image-caption">
                Visual reference related to{" "}
                {title}.
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MARKDOWN
  // ---------------------------------------------------------

  function MarkdownContent({ content }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1>{children}</h1>
          ),

          h2: ({ children }) => (
            <h2>{children}</h2>
          ),

          h3: ({ children }) => (
            <h3>{children}</h3>
          ),

          p: ({ children }) => (
            <p>{children}</p>
          ),

          li: ({ children }) => (
            <li>{children}</li>
          ),

          strong: ({ children }) => (
            <strong>{children}</strong>
          ),

          em: ({ children }) => (
            <em>{children}</em>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),

          blockquote: ({ children }) => (
            <blockquote>{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  // ---------------------------------------------------------
  // REPORT
  // ---------------------------------------------------------

  function renderReport() {
    if (!result?.report_markdown) {
      return null;
    }

    const sections = parseReport(
      result.report_markdown
    );

    return (
      <div id="pdf-report">
        {sections.map((section, index) => {
          const images =
            getImagesForSection(section.title);

          const isSources =
            section.title
              .toLowerCase()
              .includes("sources");

          return (
            <section
              key={`${section.title}-${index}`}
              className={`report-section ${
                isSources
                  ? "sources-section"
                  : ""
              }`}
            >
              <div className="section-heading">
                <div className="section-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="section-kicker">
                    RESEARCH MODULE
                  </div>

                  <h2>{section.title}</h2>
                </div>
              </div>

              <div className="section-content">
                <MarkdownContent
                  content={section.content.join("\n")}
                />
              </div>

              {!isSources && (
                <SectionImages
                  images={images}
                  title={section.title}
                />
              )}
            </section>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------
  // LANDING PAGE
  // ---------------------------------------------------------

  if (!result && !loading) {
    return (
      <main className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              ✦
            </div>

            <div>
              <div className="brand-name">
                ResearchAI
              </div>

              <div className="brand-subtitle">
                Autonomous research intelligence
              </div>
            </div>
          </div>

          <div className="system-status">
            <span />
            SYSTEM ONLINE
          </div>
        </header>

        <section className="hero">
          <div
            className="hero-orb-wrap"
            style={{
              transform: `translate(${mouse.x}px, ${mouse.y}px)`,
            }}
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="hero-orb">
              ✦
            </div>
          </div>

          <div className="hero-badge">
            <span>✦</span>
            AI-POWERED WEB RESEARCH
          </div>

          <h1>
            Turn a question into
            <br />
            <span>deep research.</span>
          </h1>

          <p className="hero-description">
            Search the web. Analyze evidence.
            <br />
            Generate a research report with
            visual references.
          </p>

          <div className="search-box">
            <div className="search-icon">
              ⌕
            </div>

            <input
              value={topic}
              onChange={(event) =>
                setTopic(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  runResearch();
                }
              }}
              placeholder="Ask anything..."
            />

            <button onClick={runResearch}>
              Research
              <span>↗</span>
            </button>
          </div>

          {error && (
            <div className="error-box">
              ⚠ {error}
            </div>
          )}

          <div className="suggestions">
            <span>TRY ASKING</span>

            <button
              onClick={() =>
                setTopic(
                  "Tell me about Spider-Man Brand New Day"
                )
              }
            >
              Spider-Man: Brand New Day ↗
            </button>

            <button
              onClick={() =>
                setTopic(
                  "Impact of AI on software engineering"
                )
              }
            >
              Impact of AI on software engineering ↗
            </button>

            <button
              onClick={() =>
                setTopic(
                  "Future of quantum computing"
                )
              }
            >
              Future of quantum computing ↗
            </button>
          </div>
        </section>

        <div className="hero-bottom">
          <div>01 / RESEARCH</div>
          <div>WEB · AI · EVIDENCE</div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // RESEARCHING SCREEN
  // ---------------------------------------------------------

  if (loading) {
    const stages = [
      "Planning research",
      "Searching the web",
      "Analyzing sources",
      "Building evidence",
      "Generating report",
    ];

    return (
      <main className="app research-mode">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              ✦
            </div>

            <div>
              <div className="brand-name">
                ResearchAI
              </div>

              <div className="brand-subtitle">
                Autonomous research intelligence
              </div>
            </div>
          </div>

          <div className="system-status active">
            <span />
            RESEARCHING
          </div>
        </header>

        <section className="research-screen">
          <div className="research-orb-wrap active-orb">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="hero-orb">
              ✦
            </div>
          </div>

          <div className="research-label">
            AUTONOMOUS RESEARCH ENGINE
          </div>

          <h1 className="research-question">
            "{topic}"
          </h1>

          <div className="research-progress">
            {stages.map((item, index) => {
              const complete =
                index < stage;

              const current =
                index === stage;

              return (
                <div
                  className={`progress-item ${
                    complete ? "complete" : ""
                  } ${
                    current ? "current" : ""
                  }`}
                  key={item}
                >
                  <div className="progress-icon">
                    {complete
                      ? "✓"
                      : current
                      ? "◉"
                      : "○"}
                  </div>

                  <div>
                    <div className="progress-title">
                      {item}
                    </div>

                    <div className="progress-line">
                      {current
                        ? "PROCESSING"
                        : complete
                        ? "COMPLETE"
                        : "WAITING"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="research-loader">
            <div />
          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------
  // RESULT PAGE
  // ---------------------------------------------------------

  return (
    <main className="app result-page">
      <header className="topbar no-print">
        <div className="brand">
          <div className="brand-icon">
            ✦
          </div>

          <div>
            <div className="brand-name">
              ResearchAI
            </div>

            <div className="brand-subtitle">
              Autonomous research intelligence
            </div>
          </div>
        </div>

        <div className="top-actions">
          <div className="system-status">
            <span />
            RESEARCH COMPLETE
          </div>

          <button
            className="new-button"
            onClick={newResearch}
          >
            + New Research
          </button>
        </div>
      </header>

      <section className="result-hero">
        <div className="result-kicker">
          ✦ RESEARCH COMPLETE
        </div>

        <h1>{result.topic}</h1>

        <div className="result-meta">
          <span>
            {result.sources?.length || 0}
            <small>SOURCES</small>
          </span>

          <span>
            {result.queries_used?.length || 0}
            <small>RESEARCH PATHS</small>
          </span>

          <span>
            {Object.values(
              result.section_images || {}
            ).flat().length}
            <small>VISUAL REFERENCES</small>
          </span>
        </div>
      </section>

      <section className="report-shell">
        <div className="report-toolbar no-print">
          <div>
            <span className="toolbar-dot" />
            EVIDENCE SYNTHESIS
          </div>

          <div className="toolbar-buttons">
            <button onClick={copyReport}>
              {copied
                ? "✓ Copied"
                : "Copy Report"}
            </button>

            <button
              className="primary-button"
              onClick={downloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading
                ? "Preparing..."
                : "↓ Export PDF"}
            </button>
          </div>
        </div>

        {renderReport()}
      </section>

      <section className="sources-panel no-print">
        <div className="sources-header">
          <div>
            <div className="section-kicker">
              VERIFIED WEB SOURCES
            </div>

            <h2>
              Research evidence
            </h2>
          </div>

          <div className="source-count">
            {result.sources?.length || 0}
          </div>
        </div>

        <div className="source-grid">
          {result.sources?.map(
            (source, index) => (
              <a
                key={`${source.url}-${index}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="source-card"
              >
                <div className="source-top">
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span>↗</span>
                </div>

                <div className="source-title">
                  {source.title}
                </div>

                <div className="source-url">
                  {source.url}
                </div>
              </a>
            )
          )}
        </div>
      </section>

      <footer className="footer no-print">
        <span>RESEARCHAI</span>
        <span>
          WEB · EVIDENCE · INTELLIGENCE
        </span>
      </footer>
    </main>
  );
}