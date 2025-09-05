import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';
import avatar from '../../public/images/avatar.png'; // Importing the avatar image

const Hero = () => {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[350px] h-[350px] bg-indigo-300/30 rounded-full blur-[120px]" />

      {/* Avatar Image floating on the right */}
      <motion.img
        src={avatar}
        alt="Avatar"
        className="avatar-image"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.25, delayChildren: 0.2 }
          }
        }}
        className="text-center max-w-3xl px-6 relative z-10"
      >
        {/* Title */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          className="text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900"
        >
          Communicate with <span className="highlight">Confidence</span>
        </motion.h1>

        {/* Pitchline */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-6 text-lg lg:text-2xl text-slate-600 leading-relaxed"
        >
          Your bridge to a world of conversation. Master sign language with our revolutionary 
          <span className="font-semibold text-indigo-600"> 3D avatar </span> 
          and real-time feedback.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="hero-buttons mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link to="/browse">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Start Learning Free
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-secondary px-8 py-3 text-lg"
          >
            How it Works
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
