import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { identityInput, otherPartyInput, descriptionInput, language } = req.body;

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

    // Generate phrases
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You help users generate likely phrases used in provided scenarios." },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const phrases = JSON.parse(cleaned);

    // Generate audio for each phrase
    for (const phrase of phrases) {
      const audioResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: phrase.native,
      });

      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      phrase.audio = `data:audio/mp3;base64,${buffer.toString("base64")}`;
    }

    return res.status(200).json({ result: phrases });
  } catch (error) {
    console.error("TTS error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
}