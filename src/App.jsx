import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import PronounAdventure from './games/PronounAdventure';
import QuestionWordRacer from './games/QuestionWordRacer';
import PuzzleMatcher from './games/PuzzleMatcher';
import WonderWorldBlaster from './games/WonderWorldBlaster';
import SentenceTrain from './games/SentenceTrain';
import ListeningBridge from './games/ListeningBridge';
import AdjectiveArtist from './games/AdjectiveArtist';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or game id

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
    </div>
  );
}

export default App;
