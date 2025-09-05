// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Features from '../Components/Features';
import Impact from '../Components/Impact';
import Footer from '../Components/Footer';
import './Home.css';

function Home() {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section relative flex flex-col items-start justify-center min-h-screen px-6 lg:px-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          <h1 className="hero-title text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Breaking <span className="highlight">Communication</span> Barriers
          </h1>
          <p className="hero-pitchline text-lg lg:text-2xl text-gray-600 mb-8">
            Real-time translation between spoken language and Indian Sign Language.<br />
            <span className="highlight-blue font-semibold">Every voice heard, every sign understood.</span>
          </p>
          <div className="hero-buttons flex flex-wrap gap-4">
            <Link
              to="/avatar"
              className="btn btn-primary hover:scale-105 transition-transform duration-300"
            >
              Try Live Translation
            </Link>
            <Link
              to="/learn-sign"
              className="btn btn-secondary hover:scale-105 transition-transform duration-300"
            >
              Learn ISL
            </Link>
          </div>
          {/* Decorative floating shapes */}
          <span className="absolute w-72 h-72 rounded-full bg-yellow-200 opacity-20 top-10 left-10 animate-pulse"></span>
          <span className="absolute w-60 h-60 rounded-full bg-indigo-200 opacity-15 bottom-20 right-20 animate-pulse"></span>
        </section>

        {/* Features & Impact Sections */}
        <Features />
        <Impact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;