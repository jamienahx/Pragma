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
  const [loadingText, setLoadingText] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Record<string, string>>({});
const audioRequestCache = useRef<
  Partial<Record<string, Promise<string>>>
>({});
  const playRequestIdRef = useRef<number>(0);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const selectedLanguage = languages.find(
    (lang) => lang.name === language || lang.code === language
  );

  const speechCode = selectedLanguage?.speechCode || "en-US";

  if (!result) {
    return <p>No results available</p>;
  }

  const handleDownload = () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    html2pdf().from(element).save("generated-responses.pdf");
  };

  const stopCurrentPlayback = () => {
    window.speechSynthesis.cancel();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlayingText(null);
  };

  const getOrFetchAudio = async (text: string): Promise<string> => {
    // Return cached audio
    if (audioCache.current[text]) {
      return audioCache.current[text];
    }

    // Prevent duplicate API calls
    if (audioRequestCache.current[text]) {
      return audioRequestCache.current[text];
    }

    const requestPromise = fetch("/api/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to generate audio");
        }

        const data = await response.json();
        const audioSrc = data.audio as string;
        audioCache.current[text] = audioSrc;
        return audioSrc;
      })
      .finally(() => {
        delete audioRequestCache.current[text];
      });

    audioRequestCache.current[text] = requestPromise;
    return requestPromise;
  };

  const handlePlayAudio = async (text: string) => {
    const requestId = ++playRequestIdRef.current;

    stopCurrentPlayback();

    // Desktop: use browser speech synthesis
    if (!isMobile) {
      setPlayingText(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechCode;

      utterance.onend = () => {
        if (playRequestIdRef.current === requestId) {
          setPlayingText(null);
        }
      };

      utterance.onerror = () => {
        if (playRequestIdRef.current === requestId) {
          setPlayingText(null);
        }
      };

      window.speechSynthesis.speak(utterance);
      return;
    }

    // Mobile: generate audio on demand
    try {
      setLoadingText(text);

      const audioSrc = await getOrFetchAudio(text);

      // Ignore outdated responses
      if (playRequestIdRef.current !== requestId) {
        return;
      }

      setLoadingText(null);
      setPlayingText(text);

      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onended = () => {
        if (playRequestIdRef.current === requestId) {
          setPlayingText(null);
        }
        audioRef.current = null;
      };

      audio.onerror = () => {
        if (playRequestIdRef.current === requestId) {
          setPlayingText(null);
        }
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);

      if (playRequestIdRef.current === requestId) {
        setLoadingText(null);
        setPlayingText(null);
      }
    }
  };

  const getButtonLabel = (text: string) => {
    if (loadingText === text) return "Loading Audio...";
    if (playingText === text) return "Playing...";
    return "Play Audio";
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
              {getButtonLabel(item.native)}
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