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

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Valid text is required" });
    }

    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await audioResponse.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    return res.status(200).json({
      audio: `data:audio/mp3;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("TTS error:", error);
    return res.status(500).json({
      error: "Failed to generate audio",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}