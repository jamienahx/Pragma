import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Allow only POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Ensure API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Optional: choose a voice dynamically based on language
    const voiceMap = {
      Japanese: "alloy",
      Korean: "alloy",
      French: "alloy",
      Spanish: "alloy",
      Chinese: "alloy",
      English: "alloy",
    };

    const voice = voiceMap[language] || "alloy";

    // Generate speech using OpenAI TTS
    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      format: "mp3",
    });

    // Convert audio to Base64
    const buffer = Buffer.from(await audioResponse.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    // Return audio as a data URL
    return res.status(200).json({
      audio: `data:audio/mp3;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("TTS error:", error);
    return res.status(500).json({
      error: "Failed to generate audio",
      details: error.message,
    });
  }
}