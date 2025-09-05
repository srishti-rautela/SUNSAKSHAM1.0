import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "🗣",
      title: "Real-Time Audio → ISL",
      description:
        "Instantly transform spoken words into expressive 3D avatars communicating in Indian Sign Language with clarity and emotional depth.",
      details: ["Multi-language support", "3D avatar animation"],
      link: "/avatar",
    },
    {
      icon: "👋",
      title: "Gamified ISL Learning",
      description:
        "Master Indian Sign Language through interactive lessons, quizzes, and challenges that make learning fun, engaging, and rewarding.",
      details: ["Interactive lessons", "Gamified challenges", "Progress tracking"],
      link: "/learn-sign",
    },
    {
      icon: "📢",
      title: "Public Space Integration",
      description:
        "Transform public announcements in railways, airports, and hospitals into accessible ISL displays.",
      details: [
        "Railway announcements",
        "Airport notifications",
        "Hospital communications",
        "Government services",
      ],
      link: "/public-space",
    },
    {
      icon: "🚨",
      title: "Emergency SOS",
      description:
        "Quickly send your location and an alert message to emergency contacts in critical situations.",
      details: [
        "Instant SOS alert",
        "Automatic location sharing",
        "Predefined emergency contacts",
      ],
      link: "/sos",
    },
    {
      icon: "🤖",
      title: "ISL Chatbot",
      description:
        "Get instant answers, guidance, and support in Indian Sign Language using our powerful AI chatbot.",
      button: {
        text: "Chat Now",
        link: "/chatbot"
      },
      link: "/chatbot",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="text-center mb-14">
        <h2 className="section-title">
          Powerful{" "}
          <span className="bg-connection-gradient bg-clip-text text-transparent">
            Features
          </span>
        </h2>
        <p className="section-subtitle">
          Comprehensive tools designed to bridge communication gaps and create
          an inclusive world for everyone.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <Link to={feature.link} className="feature-card" key={index}>
            <motion.div
              className="feature-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.details && (
                <ul className="feature-details">
                  {feature.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
              {feature.button && (
                <Link to={feature.button.link} className="btn btn-primary mt-4">
                  {feature.button.text}
                </Link>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Features;
