// Simple in-memory rate limiting (resets on function cold start)
const rateLimit = new Map();

export default async function handler(req, res) {
  // Domain whitelist
  const allowedOrigins = [
    "https://k1lgor.github.io",
    "http://localhost:5173",
    "http://localhost:4173", // Vite preview
  ];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Allow requests without origin (e.g., server-to-server, curl)
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    return res.status(403).json({ error: "Forbidden: Origin not allowed" });
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting by IP
  const ip =
    req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown";
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // 10 requests per minute per IP

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip).filter((time) => now - time < windowMs);

  if (requests.length >= maxRequests) {
    return res.status(429).json({
      error: "Too many requests. Please wait a minute before trying again.",
    });
  }

  requests.push(now);
  rateLimit.set(ip, requests);

  // Clean up old entries (prevent memory leak)
  if (rateLimit.size > 1000) {
    const oldestAllowed = now - windowMs;
    for (const [key, times] of rateLimit.entries()) {
      if (times.every((t) => t < oldestAllowed)) {
        rateLimit.delete(key);
      }
    }
  }

  const { participants, previousMessages } = req.body;

  // Enhanced validation
  if (!participants || !Array.isArray(participants)) {
    return res.status(400).json({ error: "Participants must be an array" });
  }

  if (participants.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one participant is required" });
  }

  if (participants.length > 20) {
    return res
      .status(400)
      .json({ error: "Too many participants (maximum 20)" });
  }

  // Validate each participant name
  for (const participant of participants) {
    if (typeof participant !== "string") {
      return res
        .status(400)
        .json({ error: "All participants must be strings" });
    }
    if (participant.length === 0 || participant.length > 50) {
      return res
        .status(400)
        .json({ error: "Participant names must be 1-50 characters" });
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(participant)) {
      return res.status(400).json({
        error:
          "Participant names can only contain letters, numbers, spaces, hyphens, and underscores",
      });
    }
  }

  // Automatic Mode Switching
  // If >= 2 participants, use "impersonation" mode. Otherwise "anonymous".
  const mode = participants.length >= 2 ? "impersonation" : "anonymous";

  // Construct messages array with context
  const messages = [
    {
      role: "system",
      content: `You are a paranoid, chaotic AI generating messages for a Secret Santa group chat.
        Your goal is to sow distrust and confusion in a funny way.
        Keep messages short (under 150 chars).
        Mention specific names from the list provided.
        Use emojis liberally to add personality and emotion! 🎅🎄🎁😱🤔👀
        Add relevant hashtags when appropriate to make it feel like a real group chat! #SecretSanta #Suspicious #Busted
        IMPORTANT: Maintain continuity with previous messages if provided, escalating the drama or referencing past accusations.

        CURRENT MODE: ${mode.toUpperCase()}
        - If mode is 'ANONYMOUS': You are an "Anonymous Elf".
        - If mode is 'IMPERSONATION': You MUST impersonate one of the participants from the list: ${participants.join(
          ", "
        )}. The 'sender' field MUST be one of these names. It CANNOT be "Anonymous Elf".

        OUTPUT FORMAT:
        You must ALWAYS return a JSON object.
        - "sender": The name of the sender.
        - "text": The message content.

        Example (Impersonation): { "sender": "${
          participants[0]
        }", "text": "I saw you sneaking around the gift table 👀 #Caught #SecretSanta" }
        Example (Anonymous): { "sender": "Anonymous Elf", "text": "Someone's been peeking at tags... 🎁😱 I know who!" }
        `,
    },
  ];

  // Add context from previous messages
  if (
    previousMessages &&
    Array.isArray(previousMessages) &&
    previousMessages.length > 0
  ) {
    const contextStr = previousMessages
      .map((m) => {
        if (typeof m === "object") {
          return `- ${m.sender}: ${m.text}`;
        }
        return `- ${m}`;
      })
      .join("\n");

    messages.push({
      role: "user",
      content: `Here is the conversation so far:\n${contextStr}\n\nContinue the drama!`,
    });
  }

  let prompt = `Participants: ${participants.join(", ")}. `;

  if (mode === "impersonation") {
    prompt += `Generate a message from one of the participants accusing another of something related to Christmas gifts, food, or traditions.`;
  } else {
    prompt += `Generate one suspicious anonymous message accusing someone of something related to Christmas gifts, food, or traditions.`;
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content;
    try {
      content = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // Fallback if JSON parse fails
      content = {
        text: data.choices[0].message.content,
        sender: "Anonymous Elf",
      };
    }

    // Enforce Impersonation Mode
    if (mode === "impersonation") {
      // If sender is missing, or is "Anonymous Elf", or is not in the participants list
      if (
        !content.sender ||
        content.sender === "Anonymous Elf" ||
        !participants.includes(content.sender)
      ) {
        // Forcefully pick a random participant
        const randomSender =
          participants[Math.floor(Math.random() * participants.length)];
        content.sender = randomSender;
      }
    }

    // Return structured JSON
    return res.status(200).json(content);
  } catch (error) {
    console.error("Error generating message:", error);
    return res.status(500).json({ error: "Failed to generate message" });
  }
}
