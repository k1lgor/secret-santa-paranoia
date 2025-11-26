import React, { useState } from "react";
import ParticipantInput from "./components/ParticipantInput";
import ChatGenerator from "./components/ChatGenerator";
import MessageDisplay from "./components/MessageDisplay";

function App() {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const addParticipant = (name) => {
    setParticipants([...participants, name]);
  };

  const removeParticipant = (index) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const addMessage = (msg) => {
    setMessages([...messages, msg]);
  };

  return (
    <>
      <header
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎅🎄🎁</div>
        <h1>
          Secret Santa
          <br />
          <span
            style={{
              color: "var(--accent-gold)",
              fontSize: "0.6em",
              fontFamily: "var(--font-main)",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Paranoia Generator
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>
          Making the holidays awkward, one text at a time.
        </p>
      </header>

      <main
        style={{
          width: "100%",
          maxWidth: "600px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <ParticipantInput
          participants={participants}
          onAdd={addParticipant}
          onRemove={removeParticipant}
        />

        <ChatGenerator
          participants={participants}
          onGenerate={addMessage}
          messages={messages}
        />

        <MessageDisplay messages={messages} />
      </main>

      <footer
        style={{
          textAlign: "center",
          marginTop: "3rem",
          padding: "2rem 0",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.9rem",
        }}
      >
        Built with ❄️ and ☕ by Antigravity <br />
        <a
          href="https://github.com/k1lgor/secret-santa-paranoia"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "0.5rem" }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg"
            alt="GitHub"
            style={{ height: "1.2em", verticalAlign: "middle" }}
          />
        </a>
      </footer>
    </>
  );
}

export default App;
