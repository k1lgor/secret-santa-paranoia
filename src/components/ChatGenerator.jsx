import React, { useState } from "react";
import OpenAI from "openai";
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
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error("No API Key found");
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a paranoid, chaotic AI generating anonymous messages for a Secret Santa group chat. Your goal is to sow distrust and confusion in a funny way. Keep it short (under 150 chars). Mention specific names from the list provided.",
          },
          {
            role: "user",
            content: `Participants: ${participants.join(
              ", "
            )}. Generate one suspicious message accusing someone of something related to Christmas gifts, food, or traditions.`,
          },
        ],
        model: "gpt-4o",
      });

      const message = completion.choices[0].message.content;
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      onGenerate({ text: message, timestamp });
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
