import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./results.css";

interface Phrase {
  native: string;
  romanized: string;
  english: string;
  audio?: string;
}

interface LocationState {
  result: Phrase[];
  language: string;
}

const Results = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const result = state?.result;


  const handleDownload = () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    html2pdf().from(element).save("generated-responses.pdf");
  };

  if (!result) {
    return <p>No results available</p>;
  }

  const playAudio = (audioSrc?: string) => {
    if (!audioSrc) {
      console.error("No audio source available.");
      return;
    }

    const audio = new Audio(audioSrc);
    audio.play().catch((err) =>
      console.error("Audio playback failed:", err)
    );
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

            {item.audio ? (
              <button
                className="audio-btn"
                onClick={() => playAudio(item.audio)}
              >
                Play Audio
              </button>
            ) : (
              <button className="audio-btn" disabled>
                Audio Unavailable
              </button>
            )}
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