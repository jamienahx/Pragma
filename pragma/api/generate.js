import OpenAI from "openai";
import languages from "../src/data/languages.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { identityInput, otherPartyInput, descriptionInput, language } = req.body;

  if (!identityInput || !otherPartyInput || !descriptionInput || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const selectedLanguage =
    languages.find((lang) => lang.code === language)?.name || language;

  const prompt = `The user is a ${identityInput}.
They are speaking to a ${otherPartyInput}.

Situation:
${descriptionInput}

Generate 5–8 realistic phrases that would be used in this situation in ${selectedLanguage}.

Return ONLY a JSON array in this exact format:
[
  {
    "native": "phrase in ${selectedLanguage}",
    "romanized": "romanized pronunciation",
    "english": "english translation"
  }
]
Keep the tone appropriate for the situation.
Do not include any extra text, explanation, or formatting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You help users generate likely phrases used in provided scenarios",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      return res.status(500).json({ error: "Server error" });
    }

    let parsed;

    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", raw);
      return res.status(500).json({ error: "Invalid response format" });
    }

    return res.status(200).json({ result: parsed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
}