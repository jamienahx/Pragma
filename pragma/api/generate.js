import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const {
      identityInput,
      otherPartyInput,
      descriptionInput,
      language,
    } = req.body;

    if (!identityInput || !otherPartyInput || !descriptionInput || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `The user is a ${identityInput}.
They are speaking to a ${otherPartyInput}.

Situation:
${descriptionInput}

Generate 5–8 realistic phrases that would be used in this situation in ${language}.

Return ONLY a JSON array in this exact format:
[
  {
    "native": "phrase in ${language}",
    "romanized": "romanized pronunciation",
    "english": "english translation"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You help users generate realistic phrases for given scenarios.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({ error: "Empty OpenAI response" });
    }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json({ result: parsed });
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      error: "Failed to generate phrases",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}