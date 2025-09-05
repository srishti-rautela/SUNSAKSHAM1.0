import React from "react";
import { useNavigate } from "react-router-dom";
import './pa.css';

export default function AnnouncementCards() {
  const navigate = useNavigate();

  const handleRailwayClick = () => {
    navigate('/railway-announcement');
  };

  const handleBusClick = () => {
    navigate('/bus-announcement');
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <h1>🚉 Announcement Plugins</h1>
          <p className="sub">Select an announcement system to get started</p>
        </div>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Railway Card */}
        <div className="panel" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={handleRailwayClick}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚉</div>
            <h2 style={{ color: '#ffcc00', marginBottom: '10px' }}>Railway Announcement</h2>
            <p style={{ color: '#9aa6b2', marginBottom: '20px' }}>
              Real-time railway announcements with Indian Sign Language support for deaf passengers
            </p>
            <button 
              style={{
                background: 'linear-gradient(90deg, #00b300, #008f00)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Use Railway Plugin
            </button>
          </div>
        </div>

        {/* Bus Card */}
        <div className="panel" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={handleBusClick}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚌</div>
            <h2 style={{ color: '#ffcc00', marginBottom: '10px' }}>Bus Announcement</h2>
            <p style={{ color: '#9aa6b2', marginBottom: '20px' }}>
              Real-time bus announcements with Indian Sign Language support for deaf passengers
            </p>
            <button 
              style={{
                background: 'linear-gradient(90deg, #0b6bff, #0056b3)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Use Bus Plugin
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">© 2025 Sign-Kit — Announcement Plugins</footer>
    </div>
  );
}
