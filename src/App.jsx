import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import PronounAdventure from './games/PronounAdventure';
import QuestionWordRacer from './games/QuestionWordRacer';
import PuzzleMatcher from './games/PuzzleMatcher';
import WonderWorldBlaster from './games/WonderWorldBlaster';
import SentenceTrain from './games/SentenceTrain';
import ListeningBridge from './games/ListeningBridge';
import AdjectiveArtist from './games/AdjectiveArtist';
import SpellingBeeGarden from './games/SpellingBeeGarden';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or game id

  useEffect(() => {
    // Prevent multi-touch zooming (pinch zoom)
    const handleTouchStart = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent gesture-based zooming (iOS specific)
    const handleGestureStart = (e) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('gesturestart', handleGestureStart, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  const handleSelectGame = (gameId) => {
    setCurrentView(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  return (
    <div id="root">
      {currentView === 'menu' && (
        <MainMenu onSelectGame={handleSelectGame} />
      )}

      {currentView === 'pronoun-adventure' && (
        <PronounAdventure onBackToMenu={handleBackToMenu} />
      )}

      {currentView === 'question-word-racer' && (
        <QuestionWordRacer onBackToMenu={handleBackToMenu} />
      )}

      {currentView === 'puzzle-matcher' && (
        <PuzzleMatcher onBackToMenu={handleBackToMenu} />
      )}

      {currentView === 'wonder-world-blaster' && (
        <WonderWorldBlaster onBackToMenu={handleBackToMenu} />
      )}

      {currentView === 'sentence-train' && (
        <SentenceTrain onBack={handleBackToMenu} />
      )}

      {currentView === 'listening-bridge' && (
        <ListeningBridge onBack={handleBackToMenu} />
      )}

      {currentView === 'adjective-artist' && (
        <AdjectiveArtist onBack={handleBackToMenu} />
      )}

      {currentView === 'spelling-bee' && (
        <SpellingBeeGarden onBack={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
