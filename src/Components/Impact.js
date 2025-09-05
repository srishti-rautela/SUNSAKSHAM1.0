import React from 'react';
import { motion } from 'framer-motion';
import './Impact.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
  })
};

function Impact() {
  const cards = [
    {
      icon: "🎓",
      title: "Education",
      desc: "Teachers in inclusive classrooms communicate without errors, ensuring every student gets equal learning opportunities.",
      stat: "10M+ students"
    },
    {
      icon: "🏥",
      title: "Public Services",
      desc: "Railways, hospitals, and government services become fully accessible to the deaf and hard-of-hearing community.",
      stat: "5000+ locations"
    },
    {
      icon: "🏢",
      title: "Workplace",
      desc: "Corporates foster true inclusivity and equal opportunities, creating diverse and productive work environments.",
      stat: "1000+ companies"
    },
    {
      icon: "❤",
      title: "Community",
      desc: "Building emotional connections, safety, and empowerment for deaf individuals through technology and support.",
      stat: "50K+ users"
    }
  ];

  return (
    <section className="impact-section py-20" id="impact">
      <h2 className="text-4xl lg:text-5xl font-bold text-center text-foreground mb-12">
        Creating <span className="bg-hero-gradient bg-clip-text text-transparent">Real Impact</span>
      </h2>

      <div className="impact-grid">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="impact-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={i}
          >
            <div className="impact-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="impact-stat">{card.stat}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Impact;