// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AvatarPage from './pages/Convert';
import Home from './pages/Home';
import LearnSign from './pages/LearnSign';
import Dictionary from './pages/Dictionary';
import Practice from './pages/Practice';
import Chatbot from './pages/Chatbot';
import AnnouncementCards from './pages/PublicAnnoucment/AnnouncementCards';
import RailwayAnnouncement from './pages/PublicAnnoucment/RailwayAnnouncement';
import BusAnnouncement from './pages/PublicAnnoucment/BusAnnouncement';
import EmergencySOS from './pages/EmergencySOS';   // ✅ import SOS page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/learn-sign" element={<LearnSign />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/public-space" element={<AnnouncementCards />} />
        <Route path="/railway-announcement" element={<RailwayAnnouncement />} />
        <Route path="/bus-announcement" element={<BusAnnouncement />} />
        <Route path="/sos" element={<EmergencySOS />} />   {/* ✅ new route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
