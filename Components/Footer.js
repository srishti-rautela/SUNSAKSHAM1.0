import React from 'react';
import './Footer.css'; // Make sure to update the CSS as well

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="logo-icon-wrapper">S</span>
        <div className="brand-text">
          <h2 className="brand-name">SunSakhsham Live</h2>
          <p className="brand-tagline">
            Breaking communication barriers through real-time ISL translation technology.
          </p>
        </div>
      </div>

      <div className="footer-links">
        <div className="links-group">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/demo">Demo</a>
          <a href="/api">API</a>
        </div>
        <div className="links-group">
          <h4>Support</h4>
          <a href="/help">Help Center</a>
          <a href="/community">Community</a>
          <a href="/contact">Contact</a>
          <a href="/accessibility">Accessibility</a>
        </div>
        <div className="links-group">
          <h4>Company</h4>
          <a href="/about">About</a>
          <a href="/mission">Mission</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SunSakhsham Live. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
