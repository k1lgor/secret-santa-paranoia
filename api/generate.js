export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { participants } = req.body;

  // Validate input
  if (
    !participants ||
    !Array.isArray(participants) ||
    participants.length === 0
  ) {
    return res.status(400).json({ error: "Invalid participants list" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Error generating message:", error);
    return res.status(500).json({ error: "Failed to generate message" });
  }
}
