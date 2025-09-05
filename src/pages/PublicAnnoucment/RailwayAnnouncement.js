// src/pages/PublicAnnouncement.js
import React, { useState, useEffect, useRef } from "react";
import './pa.css'

// Dictionary with phrases + bilingual support
const SIGN_DICT = {
  "welcome": ["/signs/welcome.gif"],
  "swagat hai": ["/signs/welcome.gif"],

  "attention": ["/signs/attention.gif"],
  "dhyan dein": ["/signs/attention.gif"],

  "delay": ["/signs/delay.gif", "/signs/deri.gif"],
  "deri": ["/signs/delay.gif", "/signs/deri.gif"],
  "late": ["/signs/delay.gif", "/signs/deri.gif"],

  "early": ["/signs/EARLY.gif", "/signs/jaldi.gif"],
  "jaldi": ["/signs/EARLY.gif", "/signs/jaldi.gif"],

  "platform change": ["/signs/pc.gif"],
  "platform badlaav": ["/signs/pc.gif"],

  "train is arriving": ["/signs/arriving.gif"],
  "train a rahi hai": ["/signs/arriving.gif"],

  "train is departing": ["/signs/train.gif", "/signs/departing.gif"],
  "train ja rahi hai": ["/signs/train.gif", "/signs/departing.gif"],

  "train cancelled": ["/signs/cancelled.gif"],
  "train radd": ["/signs/cancelled.gif"],
  "train cancel": ["/signs/cancelled.gif"],

  "on time": ["/signs/ontime.gif"],
  "samay par": ["/signs/ontime.gif"],

  "rescheduled": ["/signs/rescheduled.gif"],
  "punah nirdharit": ["/signs/rescheduled.gif"],

  "thank you": ["/signs/tenor.gif"],
  "dhanyvad": ["/signs/tenor.gif"],
  "thanks": ["/signs/tenor.gif"],
};

// Keyword fallback mapping
const KEYWORD_MAP = {
  welcome: ["/signs/welcome.gif"],
  swagat: ["/signs/welcome.gif"],

  attention: ["/signs/attention.gif"],
  dhyan: ["/signs/attention.gif"],

  delay: ["/signs/delay.gif", "/signs/deri.gif"],
  deri: ["/signs/delay.gif", "/signs/deri.gif"],
  late: ["/signs/delay.gif", "/signs/deri.gif"],

  early: ["/signs/EARLY.gif", "/signs/jaldi.gif"],
  jaldi: ["/signs/EARLY.gif", "/signs/jaldi.gif"],

  platform: ["/signs/pc.gif"],
  badlaav: ["/signs/pc.gif"],
  change: ["/signs/pc.gif"],

  arriving: ["/signs/arriving.gif"],
  "a rahi": ["/signs/arriving.gif"],

  departing: ["/signs/departing.gif"],
  "ja rahi": ["/signs/departing.gif"],

  cancelled: ["/signs/cancelled.gif"],
  radd: ["/signs/cancelled.gif"],
  cancel: ["/signs/cancelled.gif"],

  time: ["/signs/ontime.gif"],
  samay: ["/signs/ontime.gif"],

  rescheduled: ["/signs/rescheduled.gif"],
  punah: ["/signs/rescheduled.gif"],

  thank: ["/signs/tensor.gif"],
  dhanyvad: ["/signs/tensor.gif"],
  thanks: ["/signs/tensor.gif"],
};

// Sample timetable
const TRAIN_TIMETABLE = [
  { no: "12045", name: "Shatabdi Express", time: "10:30", platform: "3", status: "Arriving" },
  { no: "12627", name: "Karnataka Express", time: "11:15", platform: "5", status: "Delayed" },
  { no: "22913", name: "Rajdhani Express", time: "12:05", platform: "1", status: "On Time" },
  { no: "12301", name: "Howrah Rajdhani Express", time: "13:00", platform: "2", status: "On Time" },
  { no: "12801", name: "New Delhi Shatabdi", time: "14:30", platform: "4", status: "Delayed" },
  { no: "12507", name: "Bhopal Express", time: "15:15", platform: "6", status: "Arriving" },
  { no: "12205", name: "Duronto Express", time: "16:00", platform: "3", status: "On Time" },
  { no: "12619", name: "Mysore Express", time: "16:45", platform: "5", status: "Delayed" },
  { no: "12951", name: "Rajdhani Express (Mumbai)", time: "17:30", platform: "1", status: "On Time" },
  { no: "12461", name: "Kolkata Shatabdi", time: "18:15", platform: "2", status: "Arriving" },
];

export default function PublicAnnouncement() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [animations, setAnimations] = useState([]);
  const [timedata] = useState(TRAIN_TIMETABLE);
  const recognitionRef = useRef(null);

  const normalize = (text) => text?.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();

  // --- Get all unique GIFs for a sentence ---
  const getGifsForText = (text) => {
    if (!text) return [];
    const clean = normalize(text);
    const words = clean.split(/\s+/);
    const gifs = [];

    let i = 0;
    while (i < words.length) {
      let matched = false;

      // 1️⃣ Multi-word phrases
      for (const phrase of Object.keys(SIGN_DICT)) {
        const phraseWords = phrase.split(" ");
        const segment = words.slice(i, i + phraseWords.length).join(" ");
        if (segment === phrase) {
          SIGN_DICT[phrase].forEach((g) => {
            if (!gifs.includes(g)) gifs.push(g);
          });
          i += phraseWords.length;
          matched = true;
          break;
        }
      }

      // 2️⃣ Single word fallback
      if (!matched) {
        const word = words[i];
        for (const key of Object.keys(KEYWORD_MAP)) {
          if (word.includes(key)) {
            KEYWORD_MAP[key].forEach((g) => {
              if (!gifs.includes(g)) gifs.push(g);
            });
          }
        }
        i += 1;
      }
    }

    return gifs;
  };

  const handleAnnouncement = (text) => {
    setTranscript(text);
    setAnimations(getGifsForText(text));
  };

  // --- Live Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-IN";

    recog.onresult = (ev) => {
      let finalText = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) finalText += ev.results[i][0].transcript;
      }
      if (finalText) handleAnnouncement(finalText);
    };

    recog.onerror = (e) => console.warn("SpeechRecognition error", e);
    recognitionRef.current = recog;

    return () => {
      try { recog.stop(); } catch {}
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (!listening) {
      setTranscript(""); setAnimations([]);
      try { recognitionRef.current.start(); setListening(true); } catch {}
    } else {
      try { recognitionRef.current.stop(); } catch {}
      setListening(false);
    }
  };

  const manualAnnounce = (text) => handleAnnouncement(text);
  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <h1>🚉 Railway ISL Assistant</h1>
          <p className="sub">Live speech → Text → Sign animation (for deaf passengers)</p>
        </div>
        <div className="header-right">
          <button className={`listen ${listening ? "listening" : ""}`} onClick={toggleListening}>
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
              <button onClick={() => manualAnnounce("thank you")}>Test: "thank you"</button>
              <button onClick={() => manualAnnounce("platform change")}>Test: "platform change"</button>
              <button onClick={() => manualAnnounce("yatrigan kripya dhyan dein shatabdi express deri se chal rahi hai")}>
                Test: Attention + Delay
              </button>
            </div>
          </div>

          <div className="panel animation">
            <h2>Sign Animation</h2>
            <div className="animation-stage" aria-live="polite">
              {animations.length
                ? animations.map((src, idx) => <img key={idx} src={src} alt="ISL sign" />)
                : <div className="placeholder">Animation will appear here</div>}
            </div>
          </div>
        </section>

        <aside className="right">
          <div className="panel timetable">
            <h2>Station Timetable</h2>
            <table>
              <thead>
                <tr>
                  <th>Train</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Platform</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {timedata.map((r) => (
                  <tr key={r.no}>
                    <td>{r.no}</td>
                    <td>{r.name}</td>
                    <td>{r.time}</td>
                    <td>{r.platform}</td>
                    <td className={r.status === "Delayed" ? "status delayed" : "status ontime"}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </main>

      <footer className="footer">© 2025 Indian Railways — ISL Assistant</footer>
    </div>
  );
}
