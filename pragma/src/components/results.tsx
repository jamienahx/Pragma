import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
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

  const [playingText, setPlayingText] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const audioCache = useRef<Record<string, string>>({});

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

  const stopCurrentPlayback = () => {
    window.speechSynthesis.cancel();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlayingText(null);
  };

  const handlePlayAudio = async (text: string) => {

  stopCurrentPlayback();
  setPlayingText(text);

  // Desktop: Use browser speech synthesis
  if (!isMobile) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechCode;
    utterance.onend = () => setPlayingText(null);
    utterance.onerror = () => setPlayingText(null);
    window.speechSynthesis.speak(utterance);
    return;
  }

  try {
    let audioSrc = audioCache.current[text];

    // Fetch audio only if not cached
    if (!audioSrc) {
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
      audioSrc = data.audio;
      audioCache.current[text] = audioSrc;
    }

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingText(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingText(null);
      audioRef.current = null;
    };

    await audio.play();
  } catch (error) {
    console.error("Audio playback failed:", error);
    setPlayingText(null);
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
              {playingText === item.native ? "Playing..." : "Play Audio"}
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