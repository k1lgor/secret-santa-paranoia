import React, { useEffect, useRef } from "react";

const MessageDisplay = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div
      className="glass-card"
      style={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Intercepted Texts
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
              maxWidth: "80%",
              animation:
                "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              opacity: 0,
              transform: "scale(0.8)",
            }}
          >
            <div
              style={{
                background:
                  index % 2 === 0
                    ? "rgba(255,255,255,0.9)"
                    : "var(--accent-green)",
                color: index % 2 === 0 ? "var(--text-dark)" : "white",
                padding: "1rem 1.5rem",
                borderRadius: "18px",
                borderBottomLeftRadius: index % 2 === 0 ? "4px" : "18px",
                borderBottomRightRadius: index % 2 === 0 ? "18px" : "4px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "1rem", lineHeight: "1.4" }}>
                {msg.text}
              </div>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.6)",
                marginTop: "0.3rem",
                textAlign: index % 2 === 0 ? "left" : "right",
                padding: "0 0.5rem",
              }}
            >
              {msg.timestamp} • Anonymous Elf
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <style>{`
        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MessageDisplay;
