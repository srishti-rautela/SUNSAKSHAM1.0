import React, { useState, useRef, useEffect } from "react";
import './chatbot.css'; // Importing the new CSS file

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! Ask me anything to help you learn as a deaf user." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    try {
      const res = await fetch("http://localhost:4001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.response || "Sorry, I couldn't understand." },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Error connecting to chatbot." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-container" style={{ resize: 'both', overflow: 'auto' }}>
      <div className="chatbot-content">
        <div className="chatbot-header">
          <h1 className="chatbot-title">ISL Chatbot Assistant</h1>
          <p className="chatbot-subtitle">Your personal assistant for learning ISL</p>
          <div className="chatbot-status">
            <span className="status-indicator"></span>
            <span>Online</span>
          </div>
        </div>
        <div className="chat-window">
          {messages.map((msg, idx) => {
            const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
            return (
              <div key={idx} className={`message-container ${isSameSender ? 'same-sender' : ''}`}>
                <span className={`message-bubble ${msg.sender === "user" ? "message-user" : "message-bot"}`}>
                  {msg.text}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            className={`send-button ${loading ? "loading" : ""}`}
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
        <p className="chatbot-footer">Powered by Gemini AI • For ISL users</p>
      </div>
    </div>
  );
}

export default Chatbot;
