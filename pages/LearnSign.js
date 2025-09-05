import React, { useState, useEffect, useRef } from "react";
import Slider from "react-input-slider";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import xbot from "../Models/xbot/xbot.glb";
import ybot from "../Models/ybot/ybot.glb";
import xbotPic from "../Models/xbot/xbot.png";
import ybotPic from "../Models/ybot/ybot.png";

import * as words from "../Animations/words";
import * as alphabets from "../Animations/alphabets";
import { defaultPose } from "../Animations/defaultPose";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import "./LearnSign.css";

function LearnSign() {
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(800);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [currentSign, setCurrentSign] = useState("");
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isReplayAvailable, setIsReplayAvailable] = useState(false);

  const componentRef = useRef({});
  const { current: ref } = componentRef;

  useEffect(() => {
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.characters = [];

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xf8fafc);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    ref.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / (window.innerHeight - 70),
      0.1,
      1000
    );

    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    updateCanvasSize();
    document.getElementById("canvas").innerHTML = "";
    document.getElementById("canvas").appendChild(ref.renderer.domElement);

    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;

    const loader = new GLTFLoader();
    loader.load(bot, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "SkinnedMesh") {
          child.frustumCulled = false;
        }
      });
      ref.avatar = gltf.scene;
      ref.scene.add(ref.avatar);
      defaultPose(ref);
    });

    // Add resize listener
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [ref, bot]);

  const updateCanvasSize = () => {
    if (ref.renderer) {
      const canvasContainer = document.querySelector('.canvas-box');
      if (canvasContainer) {
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;
        ref.renderer.setSize(width, height);
        ref.camera.aspect = width / height;
        ref.camera.updateProjectionMatrix();
      }
    }
  };

  ref.animate = () => {
    if (ref.animations.length === 0) {
      ref.pending = false;
      setIsReplayAvailable(true); // Enable replay when animation completes
      return;
    }
    requestAnimationFrame(ref.animate);
    if (ref.animations[0].length) {
      if (!ref.flag) {
        for (let i = 0; i < ref.animations[0].length; ) {
          let [boneName, action, axis, limit, sign] = ref.animations[0][i];
          if (
            sign === "+" &&
            ref.avatar.getObjectByName(boneName)[action][axis] < limit
          ) {
            ref.avatar.getObjectByName(boneName)[action][axis] += speed;
            ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(
              ref.avatar.getObjectByName(boneName)[action][axis],
              limit
            );
            i++;
          } else if (
            sign === "-" &&
            ref.avatar.getObjectByName(boneName)[action][axis] > limit
          ) {
            ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
            ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(
              ref.avatar.getObjectByName(boneName)[action][axis],
              limit
            );
            i++;
          } else {
            ref.animations[0].splice(i, 1);
          }
        }
      }
    } else {
      ref.flag = true;
      setTimeout(() => {
        ref.flag = false;
      }, pause);
      ref.animations.shift();
    }
    ref.renderer.render(ref.scene, ref.camera);
  };

  // Replay the current sign
  const replaySign = () => {
    if (currentSign && isReplayAvailable) {
      setIsReplayAvailable(false);
      if (ref.animations.length === 0) {
        alphabets[currentSign](ref);
      }
    }
  };

  // Start the sign language game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    nextRound();
  };

  // Generate a new round with a random sign and options
  const nextRound = () => {
    // Get a random alphabet letter (A-Z)
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    setCurrentSign(randomChar);
    setIsReplayAvailable(false);
    
    // Generate options (one correct, three random)
    const correctOption = randomChar;
    const optionsList = [correctOption];
    
    // Add three unique random options
    while (optionsList.length < 4) {
      const randomOption = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      if (!optionsList.includes(randomOption)) {
        optionsList.push(randomOption);
      }
    }
    
    // Shuffle the options
    setOptions(shuffleArray(optionsList));
    
    // Perform the sign
    if (ref.animations.length === 0) {
      alphabets[randomChar](ref);
    }
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

 // Handle user's guess
const handleGuess = (guess) => {
  if (guess === currentSign) {
    // Correct guess
    setScore(score + 10);
    setModalMessage("Correct! +10 points");
  } else {
    // Incorrect guess
    setModalMessage(`Try again! The sign was for "${currentSign}"`);
  }
  
  setShowModal(true);
};


  // Close modal and proceed to next round
  const closeModal = () => {
    setShowModal(false);
    nextRound();
  };

  let alphaButtons = [];
  for (let i = 0; i < 26; i++) {
    alphaButtons.push(
      <div key={i}>
        <button
          className="signs"
          onClick={() => {
            if (ref.animations.length === 0) {
              setIsReplayAvailable(true);
              alphabets[String.fromCharCode(i + 65)](ref);
            }
          }}
          title={String.fromCharCode(i + 65)}
        >
          {String.fromCharCode(i + 65)}
        </button>
      </div>
    );
  }

  let wordButtons = [];
  for (let i = 0; i < words.wordList.length; i++) {
    wordButtons.push(
      <button
        key={i}
        className="word"
        onClick={() => {
          if (ref.animations.length === 0) {
            setIsReplayAvailable(true);
            words[words.wordList[i]](ref);
          }
        }}
      >
        {words.wordList[i]}
      </button>
    );
  }

  return (
    <div className="learn-sign">
      <div className="app-header">
        <h1>Learn Sign Language</h1>
        <p>Interact with the avatar to learn sign language alphabets and words</p>
      </div>
      
      <div className="main-container">
        {/* Top Section */}
        <div className="top-section">
          <div className="avatar-selection">
            <p className="bot-label">Select Avatar</p>
            <div className="avatar-options">
              <div
                className="avatar-container"
                tabIndex={0}
                onClick={() => setBot(xbot)}
                aria-label="Select avatar XBOT"
              >
                <img src={xbotPic} alt="Avatar 1: XBOT" className="bot-image" />
              </div>
              <div
                className="avatar-container"
                tabIndex={0}
                onClick={() => setBot(ybot)}
                aria-label="Select avatar YBOT"
              >
                <img src={ybotPic} alt="Avatar 2: YBOT" className="bot-image" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="middle-section">
          <div className="canvas-box">
            <div id="canvas">
              <div className="canvas-placeholder">
                <i className="fas fa-robot"></i>
                <p>Avatar will appear here</p>
                <p>Select an alphabet or word to see the sign</p>
              </div>
            </div>
            {/* Replay Button */}
            <button 
              className="replay-btn"
              onClick={replaySign}
              disabled={!isReplayAvailable}
              title="Replay the sign"
            >
              <i className="fa fa-repeat"></i>
            </button>
          </div>
          
          <div className="game-section">
            <h2>Sign Language Game</h2>
            <div className="game-controls">
              <button 
                className="game-btn" 
                onClick={startGame}
                disabled={gameActive}
              >
                Start Game
              </button>
              <button 
                className="game-btn" 
                onClick={() => setGameActive(false)}
                disabled={!gameActive}
              >
                End Game
              </button>
            </div>
            
            {gameActive && (
              <>
                <div className="score-display">
                  Score: {score}
                </div>
                
                <div className="current-sign">
                  What sign is this?
                </div>
                
                <div className="options-grid">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className="option-btn"
                      onClick={() => handleGuess(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="alphabet-card">
            <h2 className="heading">Alphabets</h2>
            <div className="alphabet-grid">
              {alphaButtons}
            </div>
          </div>
          
          <div className="words-card">
            <h2>Words</h2>
            <div className="words-list">
              {wordButtons}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for game feedback */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMessage.includes("Correct") ? "🎉 Correct!" : "😕 Try Again"}</h2>
            <p>{modalMessage}</p>
            <button className="modal-btn" onClick={closeModal}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearnSign;