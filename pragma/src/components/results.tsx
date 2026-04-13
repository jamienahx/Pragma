import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import languages from "../data/languages.json";
import "./results.css";

interface Phrase {
  native: string;
  romanized: string;
  english: string;
}

interface LocationState {
  result: Phrase[];
  language: string;
}

const Results = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const result = state?.result;
  const language = state?.language;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const selectedLanguage = languages.find(
    (lang) => lang.name === language || lang.code === language
  );

  const speechCode = selectedLanguage?.speechCode || "en-US";

  const handleDownload = () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    html2pdf().from(element).save("generated-responses.pdf");
  };

  if (!result) {
    return <p>No results available</p>;
  }

  const handlePlayAudio = async (text: string) => {
    if (!isMobile) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechCode;
      speechSynthesis.speak(utterance);
      return;
    }

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      const audio = new Audio(data.audio);
      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Generated Phrases</h2>

      <div id="pdf-content">
        {result.map((item, index) => (
          <div key={index} className="result-card">
            <p className="native">
              <strong>{item.native}</strong>
            </p>
            <p className="romanized">{item.romanized}</p>
            <p className="english">{item.english}</p>

            <button
              className="audio-btn"
              onClick={() => handlePlayAudio(item.native)}
            >
              Play Audio
            </button>
          </div>
        ))}
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download as PDF
      </button>
    </div>
  );
};

export default Results;