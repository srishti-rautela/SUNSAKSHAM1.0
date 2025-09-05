import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToSOS = () => {
    navigate('/sos');
  };

  return (
    <div className="header-wrapper">
      <header className="site-header">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon-wrapper" aria-label="logo" role="img">
            S
          </div>
          <div className="logo-text">
            <span className="brand-name">SunSakhsham Live</span>
            <span className="subtitle">Real-time ISL Translation</span>
          </div>
        </div>

        {/* Curved rectangle container for tagline */}
        <div className="tagline-container">
          <p className="tagline-text">
            No voice left unheard, no signs left unseen
          </p>
        </div>

        {/* Navigation */}
        <nav
          className="navbar"
          style={{
            background: "rgba(243,244,246,0.95)",
            borderRadius: "18px",
            padding: "10px 28px",
            boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left group: Features */}
          <div className="nav-links" style={{ display: "flex", gap: "18px" }}>
            <a href="#features" onClick={scrollToFeatures}>Features</a>
          </div>

          {/* Right group: SOS button */}
          <div className="nav-actions">
            <button
              className="sos-button"
              onClick={goToSOS}
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              SOS
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
