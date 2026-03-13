import { useState, useRef, useEffect } from "react";
import { aiAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = [
  "What are signs of dehydration?",
  "How much sleep do I need?",
  "Tips for reducing stress",
  "What foods boost immunity?",
];

const TypingDots = () => (
  <div
    style={{
      display: "flex",
      gap: "5px",
      alignItems: "center",
      padding: "4px 0",
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#a855f7",
          display: "inline-block",
          animation: `bounce 1.2s infinite`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const AvailabilityBadge = ({ status }) => {
  const colors = {
    Available: { bg: "#052e16", text: "#4ade80", dot: "#22c55e" },
    Busy: { bg: "#431407", text: "#fb923c", dot: "#f97316" },
    "In Surgery": { bg: "#450a0a", text: "#f87171", dot: "#ef4444" },
    "On Break": { bg: "#1c1917", text: "#a8a29e", dot: "#78716c" },
    Offline: { bg: "#1c1917", text: "#6b7280", dot: "#4b5563" },
  };
  const c = colors[status] || colors["Offline"];
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 11,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
};

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ fontSize: 11, color: i <= stars ? "#f59e0b" : "#374151" }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 2 }}>
        {rating?.toFixed(1)}
      </span>
    </span>
  );
};

const DoctorCards = ({ doctors, specialization }) => {
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: 10, width: "100%" }}>
      {/* Header strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          padding: "0 2px",
        }}
      >
        <span
          style={{
            width: 3,
            height: 16,
            background: "#a855f7",
            borderRadius: 2,
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: 11,
            color: "#9ca3af",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {specialization} specialists near you
        </span>
      </div>

      {/* Horizontally scrollable cards */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none",
        }}
      >
        {doctors.map((doc) => (
          <div
            key={doc.id}
            style={{
              minWidth: 210,
              maxWidth: 210,
              background: "#0f0f0f",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: "14px 14px 12px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transition: "border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#7c3aed")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#2a2a2a")
            }
          >
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {doc.name?.charAt(0) ?? "D"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: "#f3f4f6",
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {doc.name ?? "Doctor"}
                </div>
                <div style={{ color: "#a855f7", fontSize: 11, marginTop: 1 }}>
                  {doc.specialization}
                </div>
              </div>
            </div>

            {/* Rating */}
            <StarRating rating={doc.rating} />

            {/* Meta row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {doc.experience > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ color: "#4b5563" }}>⏱</span>
                  {doc.experience} yrs exp
                </span>
              )}
              {doc.location && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ color: "#4b5563" }}>📍</span>
                  {doc.location}
                </span>
              )}
            </div>

            {/* Availability */}
            <AvailabilityBadge status={doc.isAvailable} />

            {/* Next available */}
            {doc.nextAvailable && (
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                Next:{" "}
                <span style={{ color: "#9ca3af" }}>{doc.nextAvailable}</span>
              </div>
            )}

            {/* Fee + CTA */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: 8,
                borderTop: "1px solid #1f1f1f",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
                ₹{doc.consultationFee}
              </span>
              <button
                onClick={() => {
                  navigate("/book-consultant");
                }}
                style={{
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 12px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HealthyAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm HealthyAI — your personal health companion. Ask me anything about symptoms, fitness, nutrition, or wellness.",
      doctors: [],
      specialization: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await aiAPI.handleChat(userText);
      const data = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sorry, I couldn't process that.",
          // Attach doctors to this specific message
          doctors: data.recommendedDoctors ?? [],
          specialization: data.matchedSpecialization ?? null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          doctors: [],
          specialization: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="google-sans-code-400"
      style={{
        minHeight: "100vh",
        background: "#f5f5e8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-bubble { animation: fadeUp 0.25s ease forwards; }
        .send-btn:hover { background: #7c3aed !important; }
        .suggestion:hover { background: #1a1a1a !important; color: #a855f7 !important; }
        textarea:focus { outline: none; border-color: #a855f7 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        .doctor-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          background: "#f5f5e8",
          borderBottom: "1px solid #e0e0d0",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
          Healthy<span style={{ color: "#3b82f6" }}>Me</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: "#7c3aed",
              color: "white",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 15 }}>📖</span> ~healthyAI
          </span>
        </div>
      </nav>

      {/* Main layout */}
      <div
        style={{
          flex: 1,
          maxWidth: 820,
          width: "100%",
          margin: "0 auto",
          padding: "32px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "10px 10px 0 0",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: "#a855f7", fontSize: 18 }}>📖</span>
            <span
              style={{
                color: "white",
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: 15,
              }}
            >
              ~healthyAI
            </span>
            <span
              style={{
                marginLeft: "auto",
                background: "#22c55e",
                width: 8,
                height: 8,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#6b7280", fontSize: 12 }}>online</span>
          </div>

          <div
            style={{
              background: "#111",
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 12,
              color: "#6b7280",
              borderBottom: "1px solid #222",
            }}
          >
            <span style={{ color: "#22c55e" }}>● Health Status: Good</span>
            <span>souvikkpatra06@gmail.com</span>
            <span style={{ marginLeft: "auto", color: "#f59e0b" }}>
              ⚠ 2 reminders
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #2a2a2a",
            minHeight: 420,
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxHeight: 420,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="msg-bubble"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Bubble row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        marginRight: 10,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      📖
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "72%",
                      padding: "11px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 4px 16px 16px"
                          : "4px 16px 16px 16px",
                      background: msg.role === "user" ? "#7c3aed" : "#262626",
                      color: msg.role === "user" ? "white" : "#e5e7eb",
                      fontSize: 14,
                      lineHeight: 1.6,
                      border:
                        msg.role === "assistant" ? "1px solid #333" : "none",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        msg.role === "assistant"
                          ? msg.text
                              .replace(
                                /### (.*?)(\n|$)/g,
                                "<strong style='font-size:15px;display:block;margin:10px 0 4px'>$1</strong>",
                              )
                              .replace(
                                /## (.*?)(\n|$)/g,
                                "<strong style='font-size:16px;display:block;margin:12px 0 4px'>$1</strong>",
                              )
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(
                                /\*(.*?)(\n|$)/g,
                                "<span style='display:block;padding-left:10px;margin:3px 0'>• $1</span>",
                              )
                              .replace(/\n/g, "<br/>")
                          : msg.text,
                    }}
                  />
                </div>

                {/* Doctor cards — only on assistant messages with doctors */}
                {msg.role === "assistant" && msg.doctors?.length > 0 && (
                  <div style={{ width: "100%", paddingLeft: 38, marginTop: 4 }}>
                    <DoctorCards
                      doctors={msg.doctors}
                      specialization={msg.specialization}
                    />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div
                className="msg-bubble"
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    marginRight: 10,
                    flexShrink: 0,
                  }}
                >
                  📖
                </div>
                <div
                  style={{
                    padding: "11px 16px",
                    background: "#262626",
                    borderRadius: "4px 16px 16px 16px",
                    border: "1px solid #333",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: "0 20px 16px",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion"
                  onClick={() => sendMessage(s)}
                  style={{
                    background: "#262626",
                    border: "1px solid #333",
                    color: "#9ca3af",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "14px 16px",
              background: "#111",
              borderTop: "1px solid #2a2a2a",
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about symptoms, nutrition, fitness, wellness..."
              rows={1}
              style={{
                flex: 1,
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 8,
                color: "#e5e7eb",
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "none",
                lineHeight: 1.5,
                transition: "border-color 0.2s",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? "#a855f7" : "#333",
                border: "none",
                borderRadius: 8,
                width: 42,
                height: 42,
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              ↑
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 11,
            marginTop: 12,
            letterSpacing: 0.3,
          }}
        >
          HealthyAI provides general wellness information only — not medical
          advice. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
