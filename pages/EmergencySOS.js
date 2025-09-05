import React, { useState } from "react";
import { motion } from "framer-motion";
import "./EmergencySOS.css";

const EmergencySOS = () => {
  const [customMessage, setCustomMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState("police");
  const [selectedFriend, setSelectedFriend] = useState(""); // for “someone you know”
  const [customNumber, setCustomNumber] = useState("");

  // Predefined contacts
  const contacts = {
    police: { name: "Police Helpline", number: "+911234567890" },
    friends: [
      { name: "Mom", number: "+917457085429" },
      { name: "Brother", number: "+919528153698" },
      { name: "Friend", number: "+919798094144" },
    ],
  };

  const savedOptions = [
    " Help! I’m in an emergency!",
    " I need medical assistance immediately.",
    " I feel unsafe, please send help.",
  ];

  const getPhoneNumber = () => {
    if (selectedContact === "police") return contacts.police.number;
    if (selectedContact === "friend") return selectedFriend; // friend’s number
    if (selectedContact === "custom") return customNumber;
    return "";
  };

  const getLocationAndSend = () => {
    const phoneNumber = getPhoneNumber();
    if (!phoneNumber) {
      alert("Please select or enter a valid phone number.");
      return;
    }

    if (!customMessage && !savedMessage) {
      alert(" Please select or type a message.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const locationURL = `https://maps.google.com/?q=${latitude},${longitude}`;
          const messageToSend = encodeURIComponent(
            (customMessage || savedMessage) + "\n📍 My location: " + locationURL
          );
          window.open(`https://wa.me/${phoneNumber}?text=${messageToSend}`, "_blank");
        },
        () => alert(" Unable to fetch location. Please enable GPS.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <section className="sos-section">
      <motion.div
        className="sos-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="sos-icon"></div>
        <h2 className="sos-title">Emergency SOS</h2>
        <p className="sos-description">
          Quickly send your location and an alert message to emergency contacts via WhatsApp.
        </p>

        {/* Contact selection */}
        <select
          className="sos-dropdown"
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
        >
          <option value="police">Police Helpline</option>
          <option value="friend">Someone You Know</option>
          <option value="custom">Custom Number</option>
        </select>

        {/* Friend selection dropdown */}
        {selectedContact === "friend" && (
          <select
            className="sos-dropdown"
            value={selectedFriend}
            onChange={(e) => setSelectedFriend(e.target.value)}
          >
            <option value="">-- Select a contact --</option>
            {contacts.friends.map((f, i) => (
              <option key={i} value={f.number}>
                {f.name} ({f.number})
              </option>
            ))}
          </select>
        )}

        {/* Custom number input */}
        {selectedContact === "custom" && (
          <input
            type="tel"
            className="sos-dropdown"
            placeholder="Enter emergency WhatsApp number (+91XXXXXXXXXX)"
            value={customNumber}
            onChange={(e) => setCustomNumber(e.target.value)}
          />
        )}

        {/* Saved messages */}
        <select
          className="sos-dropdown"
          value={savedMessage}
          onChange={(e) => setSavedMessage(e.target.value)}
        >
          <option value="">-- Select a saved message --</option>
          {savedOptions.map((msg, i) => (
            <option key={i} value={msg}>
              {msg}
            </option>
          ))}
        </select>

        {/* Custom message */}
        <textarea
          className="sos-textarea"
          placeholder="Or type your custom emergency message..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />

        {/* SOS Button */}
        <motion.button
          className="sos-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={getLocationAndSend}
        >
          Send SOS via WhatsApp
        </motion.button>
      </motion.div>
    </section>
  );
};

export default EmergencySOS;
