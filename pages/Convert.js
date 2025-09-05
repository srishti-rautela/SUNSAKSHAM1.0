import './convert.css';
import React, { useState, useEffect, useRef } from "react";
import Slider from 'react-input-slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

import * as words from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import { defaultPose } from '../Animations/defaultPose';

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Convert() {
  const [text, setText] = useState("");
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(800);
  const [activeBot, setActiveBot] = useState('khushi');
  const [activeTab, setActiveTab] = useState('speech');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSettings, setShowSettings] = useState(false);

  const componentRef = useRef({});
  const { current: ref } = componentRef;

  const textFromAudio = useRef();
  const textFromInput = useRef();

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSettings(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.characters = [];

    // Scene
    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);

    // Light
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    // Renderer
    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ref.renderer.setPixelRatio(window.devicePixelRatio);
    ref.renderer.setSize(ref.container.clientWidth, ref.container.clientHeight);

    // Camera
    ref.camera = new THREE.PerspectiveCamera(
      30,
      ref.container.clientWidth / ref.container.clientHeight,
      0.1,
      1000
    );
    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;

    // Attach renderer to container
    ref.container.innerHTML = "";
    ref.container.appendChild(ref.renderer.domElement);

    // Make canvas ignore pointer events so UI is clickable
    ref.renderer.domElement.style.pointerEvents = "none";

    // Load bot
    const loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') child.frustumCulled = false;
        });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        defaultPose(ref);

        // Start animation loop
        ref.animate();
      },
      (xhr) => console.log(xhr)
    );

    // Handle window resize
    const handleResize = () => {
      ref.camera.aspect = ref.container.clientWidth / ref.container.clientHeight;
      ref.camera.updateProjectionMatrix();
      ref.renderer.setSize(ref.container.clientWidth, ref.container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [bot, ref]);

  // Animation loop
  ref.animate = () => {
    if (ref.animations.length === 0) {
      ref.pending = false;
      return;
    }
    requestAnimationFrame(ref.animate);

    if (ref.animations[0].length) {
      if (!ref.flag) {
        if (ref.animations[0][0] === 'add-text') {
          setText(text + ref.animations[0][1]);
          ref.animations.shift();
        } else {
          for (let i = 0; i < ref.animations[0].length;) {
            let [boneName, action, axis, limit, sign] = ref.animations[0][i];
            if (sign === "+" && ref.avatar.getObjectByName(boneName)[action][axis] < limit) {
              ref.avatar.getObjectByName(boneName)[action][axis] += speed;
              ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(ref.avatar.getObjectByName(boneName)[action][axis], limit);
              i++;
            } else if (sign === "-" && ref.avatar.getObjectByName(boneName)[action][axis] > limit) {
              ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
              ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(ref.avatar.getObjectByName(boneName)[action][axis], limit);
              i++;
            } else {
              ref.animations[0].splice(i, 1);
            }
          }
        }
      }
    } else {
      ref.flag = true;
      setTimeout(() => { ref.flag = false }, pause);
      ref.animations.shift();
    }

    ref.renderer.render(ref.scene, ref.camera);
  };

  // Process text to animations
  const sign = (inputRef) => {
    const str = inputRef.current.value.toUpperCase();
    const strWords = str.split(' ');
    setText('');

    for (let word of strWords) {
      if (words[word]) {
        ref.animations.push(['add-text', word + ' ']);
        words[word](ref);
      } else {
        for (const [index, ch] of word.split('').entries()) {
          if (index === word.length - 1) ref.animations.push(['add-text', ch + ' ']);
          else ref.animations.push(['add-text', ch]);
          alphabets[ch](ref);
        }
      }
    }
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  const handleBotChange = (botType, botModel) => {
    setBot(botModel);
    setActiveBot(botType);
  };

  return (
    <div className='container-fluid modern-container'>
      {/* Mobile Header */}
      {isMobile && (
        <div className='mobile-header'>
          <h2>💬 Welcome! 🖐 Bridging Voices with Hands 🤝</h2>
          <button 
            className={`settings-toggle ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <i className={`fa fa-${showSettings ? 'times' : 'cog'}`}></i>
          </button>
        </div>
      )}

      <div className='row h-100'>
        {/* Header for Desktop */}
        {!isMobile && (
          <div className='col-12'>
            <div className='modern-header'>
              <h2>💬 Welcome! 🖐 Bridging Voices with Hands 🤝</h2>
              <p>Convert speech or text to sign language animations</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`col-12 ${isMobile ? '' : 'col-md-8'} main-content`}>
          <div className='content-wrapper'>
            {/* Canvas */}
            <div className='modern-canvas-container'>
              <div id='canvas' ref={(el) => ref.container = el} className='modern-canvas' />
              <div className='canvas-overlay'>
                <div className='animation-status'>
                  {ref && ref.animations && ref.animations.length > 0 ? (
                    <span className='status-playing'><i className="fa fa-play"></i> Playing</span>
                  ) : (
                    <span className='status-idle'><i className="fa fa-pause"></i> Ready</span>
                  )}
                </div>
              </div>
            </div>

            {/* Combined Input Area */}
            <div className='modern-card combined-input-card'>
              <div className='modern-card-header'>
                <i className="fa fa-comments"></i>
                <span>Input & Output</span>
              </div>
              <div className='modern-card-body'>
                {/* Processed Text Output */}
                <div className='output-section'>
                  <label className='section-label'>Processed Text</label>
                  <div className='text-output'>
                    {text || <span className='placeholder-text'>Processed text will appear here</span>}
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className='input-tabs'>
                  <button 
                    className={`tab-button ${activeTab === 'speech' ? 'active' : ''}`}
                    onClick={() => setActiveTab('speech')}
                  >
                    <i className="fa fa-microphone"></i> {isMobile ? '' : 'Speech Input'}
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text')}
                  >
                    <i className="fa fa-keyboard-o"></i> {isMobile ? '' : 'Text Input'}
                  </button>
                </div>

                {/* Speech Input Tab */}
                {activeTab === 'speech' && (
                  <div className='tab-content'>
                    <div className='mic-controls'>
                      <div className='mic-status'>
                        <span>{listening ? 'Listening...' : 'Mic Ready'}</span>
                        <div className={`status-indicator ${listening ? 'listening' : ''}`}></div>
                      </div>
                      <div className='button-group'>
                        <button className={`modern-btn ${listening ? 'btn-active' : ''}`} onClick={startListening}>
                          <i className="fa fa-microphone"></i> {isMobile ? '' : 'Start'}
                        </button>
                        <button className='modern-btn' onClick={stopListening}>
                          <i className="fa fa-microphone-slash"></i> {isMobile ? '' : 'Stop'}
                        </button>
                        <button className='modern-btn' onClick={resetTranscript}>
                          <i className="fa fa-trash"></i> {isMobile ? '' : 'Clear'}
                        </button>
                      </div>
                    </div>
                    <div className='speech-transcript'>
                      <textarea 
                        rows={3} 
                        ref={textFromAudio} 
                        value={transcript} 
                        placeholder='Speech input will appear here...' 
                        className='modern-textarea' 
                      />
                    </div>
                    <button onClick={() => sign(textFromAudio)} className='modern-btn modern-btn-primary w-100'>
                      <i className="fa fa-play"></i> Start Animation
                    </button>
                  </div>
                )}

                {/* Text Input Tab */}
                {activeTab === 'text' && (
                  <div className='tab-content'>
                    <div className='text-input-section'>
                      <textarea 
                        rows={3} 
                        ref={textFromInput} 
                        placeholder='Type text to convert to sign language...' 
                        className='modern-textarea' 
                      />
                    </div>
                    <button onClick={() => sign(textFromInput)} className='modern-btn modern-btn-primary w-100'>
                      <i className="fa fa-play"></i> Start Animation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings (visible on desktop or when toggled on mobile) */}
        <div className={`col-12 col-md-4 modern-panel ${isMobile ? 'mobile-settings' : ''} ${showSettings ? 'show' : ''}`}>
          <div className='settings-content'>
            <div className='modern-card'>
              <div className='modern-card-header'>
                <i className="fa fa-user"></i>
                <span>Select Avatar</span>
              </div>
              <div className='modern-card-body'>
                <div className='avatar-selection'>
                  <div 
                    className={`avatar-option ${activeBot === 'vishu' ? 'active' : ''}`}
                    onClick={() => handleBotChange('vishu', xbot)}
                  >
                    <img src={xbotPic} className='avatar-image' alt='Vishu Avatar'/>
                    <span>Vishu</span>
                  </div>
                  <div 
                    className={`avatar-option ${activeBot === 'khushi' ? 'active' : ''}`}
                    onClick={() => handleBotChange('khushi', ybot)}
                  >
                    <img src={ybotPic} className='avatar-image' alt='Khushi Avatar'/>
                    <span>Khushi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='modern-card'>
              <div className='modern-card-header'>
                <i className="fa fa-dashboard"></i>
                <span>Animation Settings</span>
              </div>
              <div className='modern-card-body'>
                <div className='setting-control'>
                  <label>Animation Speed: {Math.round(speed * 100) / 100}</label>
                  <div className='slider-container'>
                    <i className="fa fa-tachometer slow-icon"></i>
                    <Slider 
                      axis="x" 
                      xmin={0.05} 
                      xmax={0.50} 
                      xstep={0.01} 
                      x={speed} 
                      onChange={({ x }) => setSpeed(x)} 
                      className='modern-slider' 
                    />
                    <i className="fa fa-tachometer fast-icon"></i>
                  </div>
                </div>

                <div className='setting-control'>
                  <label>Pause Time: {pause} ms</label>
                  <div className='slider-container'>
                    <i className="fa fa-pause short-icon"></i>
                    <Slider 
                      axis="x" 
                      xmin={0} 
                      xmax={2000} 
                      xstep={100} 
                      x={pause} 
                      onChange={({ x }) => setPause(x)} 
                      className='modern-slider' 
                    />
                    <i className="fa fa-pause long-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className='modern-card'>
              <div className='modern-card-header'>
                <i className="fa fa-info-circle"></i>
                <span>Instructions</span>
              </div>
              <div className='modern-card-body'>
                <ul className='instructions-list'>
                  <li>Use the tabs to switch between speech and text input</li>
                  <li>Click "Start Animation" to see the sign language translation</li>
                  <li>Adjust speed and pause settings for optimal viewing</li>
                  <li>Switch between Vishu and Khushi avatars</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Convert;