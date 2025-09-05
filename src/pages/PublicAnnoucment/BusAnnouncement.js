import React, { useEffect, useMemo, useRef, useState } from "react";

// ===== Minimal SIGN_DICT with 4 announcements =====
const SIGN_DICT = {
  welcome: {
    variants: ["welcome", "swagat hai", "swagat"],
    gifs: ["/bus_signs/welcomes.gif"],
  },
  thanks: {
    variants: ["thankyou ", "dhanyvad", "thanks", "thank you"],
    gifs: ["/bus_signs/tenor.gif"],
  },
  change: {
    variants: ["bus route change", "bus stand badlaav", "badal"],
    gifs: ["/bus_signs/change.jpg"],
  },
  cancelled: {
    variants: ["bus cancelled", "bus radd", "bus cancel", "cancelled"],
    gifs: ["/bus_signs/cancel.jpg"],
  },
  arriving: {
    variants: ["arriving", "bus aa rahi hai", "bus is coming"],
    gifs: ["piblic/bus_signs/arrive.gif"],
  },
  departing: {
    variants: ["departing", "bus ja rahi hai", "bus is going"],
    gifs: ["public/bus_signs/leave.gif"],
  },
};

export default function BusAnnouncement() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [animations, setAnimations] = useState([]);
  const recognitionRef = useRef(null);

  const normalize = (text) =>
    text?.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();

  // Precompute all variants sorted by length (prefer multi-word)
  const variantsSorted = useMemo(() => {
    const all = [];
    Object.values(SIGN_DICT).forEach((entry) => {
      entry.variants.forEach((v) => all.push(v));
    });
    return all.sort((a, b) => b.length - a.length);
  }, []);

  // --- Match text against SIGN_DICT (using variants) ---
  const getGifsForText = (text) => {
    if (!text) return [];
    const clean = normalize(text);
    const words = clean.split(/\s+/);
    const gifs = [];

    let i = 0;
    while (i < words.length) {
      let matched = false;
      for (const variant of variantsSorted) {
        const variantWords = variant.split(" ");
        const segment = words.slice(i, i + variantWords.length).join(" ");
        if (segment === variant) {
          const intent = Object.values(SIGN_DICT).find((entry) =>
            entry.variants.includes(variant)
          );
          if (intent) {
            intent.gifs.forEach((g) => {
              if (!gifs.includes(g)) gifs.push(g);
            });
          }
          i += variantWords.length;
          matched = true;
          break;
        }
      }
      if (!matched) i++;
    }

    return gifs;
  };

  const handleAnnouncement = (text) => {
    setTranscript(text);
    setTimeout(() => {
      setAnimations(getGifsForText(text));
    }, 300);
  };

  // --- Live Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-IN";

    recog.onresult = (ev) => {
      let finalText = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) finalText += ev.results[i][0].transcript;
      }
      if (finalText) handleAnnouncement(finalText);
    };

    recog.onend = () => setListening(false);
    recog.onerror = (e) => console.warn("SpeechRecognition error", e);

    recognitionRef.current = recog;

    return () => {
      try {
        recog.stop();
      } catch {}
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (!listening) {
      setTranscript("");
      setAnimations([]);
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {}
    } else {
      try {
        recognitionRef.current.stop();
      } catch {}
      setListening(false);
    }
  };

  const manualAnnounce = (text) => handleAnnouncement(text);

  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <h1>🚌 Bus ISL Assistant</h1>
          <p className="sub">
            Live speech → Text → Sign animation (for deaf passengers)
          </p>
        </div>
        <div className="header-right">
          <button
            className={`listen ${listening ? "listening" : ""}`}
            onClick={toggleListening}
          >
            {listening ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
      </header>

      <main className="main">
        <section className="left">
          <div className="panel transcript">
            <h2>Live Transcription</h2>
            <div className="transcript-box" aria-live="polite">
              {transcript || <em>Waiting for announcement...</em>}
            </div>
            <div className="controls">
              <button onClick={() => manualAnnounce("welcome")}>
                Test: "welcome"
              </button>
              <button onClick={() => manualAnnounce("bus route change")}>
                Test: "bus route change"
              </button>
              <button onClick={() => manualAnnounce("bus cancelled")}>
                Test: "bus cancelled"
              </button>
              <button onClick={() => manualAnnounce("arriving")}>
                Test: "arriving"
              </button>
              <button onClick={() => manualAnnounce("departing")}>
                Test: "departing"
              </button>
            </div>
          </div>

          <div className="panel animation">
            <h2>Sign Animation</h2>
            <div className="animation-stage" aria-live="polite">
              {animations.length ? (
                animations.map((src, idx) => (
                  <img key={idx} src={src} alt="ISL sign" />
                ))
              ) : (
                <div className="placeholder">Animation will appear here</div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        © 2025 Bus Transport — ISL Assistant
      </footer>
    </div>
  );
}
