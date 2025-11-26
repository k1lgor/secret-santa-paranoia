import React, { useState } from "react";
import { templates, items } from "../data/templates";

const ChatGenerator = ({ participants, onGenerate, messages }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateMessage = async () => {
    if (participants.length === 0) {
      alert("Add some friends (or enemies) first!");
      return;
    }

    setIsLoading(true);

    try {
      // Get last 10 messages for context
      const previousMessages = messages.slice(-10).map((m) => ({
        sender: m.sender || "Anonymous Elf",
        text: m.text,
      }));

      // Call backend API instead of OpenAI directly
      const response = await fetch(
        "https://secret-santa-paranoia.vercel.app/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participants, previousMessages }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Handle structured JSON response
      onGenerate({
        text: data.text || data.message, // Fallback for old API response
        sender: data.sender || "Anonymous Elf",
        timestamp,
      });
    } catch (error) {
      console.warn("AI Generation failed, falling back to templates:", error);
      // Fallback logic
      const template = templates[Math.floor(Math.random() * templates.length)];
      const target =
        participants[Math.floor(Math.random() * participants.length)];
      const item = items[Math.floor(Math.random() * items.length)];

      let message = template
        .replace(/{target}/g, target)
        .replace(/{item}/g, item);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      onGenerate({ text: message, timestamp });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "3rem 0" }}>
      <button
        className="primary-action"
        onClick={generateMessage}
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? "wait" : "pointer",
        }}
      >
        {isLoading ? "🎁 Conspiring... 🎁" : "🎁 Generate Drama 🎁"}
      </button>
    </div>
  );
};

export default ChatGenerator;
