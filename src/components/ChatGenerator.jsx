import React, { useState } from "react";
import { templates, items } from "../data/templates";

const ChatGenerator = ({ participants, onGenerate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateMessage = async () => {
    if (participants.length === 0) {
      alert("Add some friends (or enemies) first!");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API instead of OpenAI directly
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participants }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      onGenerate({ text: data.message, timestamp });
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
