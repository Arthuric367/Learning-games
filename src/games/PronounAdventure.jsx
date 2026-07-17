import React, { useState } from 'react';
import GameScene from '../components/GameScene';
import GiraffeProgress from '../components/GiraffeProgress';
import { questions as originalQuestions } from '../data/questions';
import { speak, speakWithFemaleVoice, speakEncouraging, playSound } from '../utils/audio';
import startScreenImg from '../assets/pronoun_adventure/pronoun_start.png';
import celebrationImg from '../assets/celebration_cake.png';
import './PronounAdventure.css';

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const ROUNDS_PER_SESSION = 5;

function PronounAdventure({ onBackToMenu }) {
    const [gameState, setGameState] = useState('start'); // start, milestone, playing, next_question, win
    const [sessionQuestions, setSessionQuestions] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [shake, setShake] = useState(false);

    const currentQuestion = sessionQuestions[currentRound];

    const handleStart = () => {
        // Shuffle and select 5 questions for this session
        const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, ROUNDS_PER_SESSION);

        setSessionQuestions(selected);
        setScore(0);
        setCurrentRound(0);
        // Show baby giraffe first
        setGameState('milestone');
        speakEncouraging("Let's play! Look at the baby giraffe.");
    };

    const handleMilestoneContinue = () => {
        setGameState('playing');
    };

    const handleAnswer = (selectedOption) => {
        if (selectedOption === currentQuestion.answer) {
            // Correct
            playSound('correct');
            speakWithFemaleVoice(currentQuestion.audioText); // Read the full sentence with female voice

            const newScore = score + 1;
            setScore(newScore);

            setTimeout(() => {
                // Check if this was the last question
                if (currentRound >= ROUNDS_PER_SESSION - 1) {
                    setGameState('win');
                    speakEncouraging("You did it! The giraffe can eat the leaves!");
                } else if (newScore === 3) {
                    // Show giraffe growing milestone at score 3
                    setGameState('milestone');
                    speakEncouraging("Wow! The giraffe is growing!");
                } else {
                    // Show next question celebration
                    setGameState('next_question');
                }
            }, 2000); // Wait for audio/animation
        } else {
            // Incorrect
            playSound('incorrect');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
        }
    };

    const handleNextQuestion = () => {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setGameState('playing');
    };

    return (
        <div className={`app-container ${shake ? 'shake' : ''}`}>
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">Dino & Friends <br /> Pronoun Adventure</h1>
                    <img src={startScreenImg} alt="Dino Picnic" className="game-start-image" />
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'milestone' && (
                <div className="milestone-screen" onClick={handleMilestoneContinue}>
                    <GiraffeProgress score={score} isMilestone={true} maxScore={ROUNDS_PER_SESSION} />
                    <button className="continue-btn">Continue (繼續)</button>
                </div>
            )}

            {gameState === 'next_question' && (
                <div className="milestone-screen" onClick={handleNextQuestion}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={celebrationImg} alt="Celebration" style={{ maxWidth: '200px', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2.5rem', color: '#4CAF50', marginBottom: '20px' }}>Great Job! 🎉</h2>
                        <div style={{ fontSize: '1.5rem', marginBottom: '30px' }}>You got it right!</div>
                        <button className="continue-btn">Next Question</button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="game-screen">
                    <div className="progress">
                        Round {currentRound + 1} / {ROUNDS_PER_SESSION}
                    </div>
                    <GameScene
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <button className="game-btn-exit" onClick={onBackToMenu}>Exit</button>
                    </div>
                </div>
            )}

            {gameState === 'win' && (
                <div className="win-screen">
                    <h1>🎉 Great Job! 🎉</h1>
                    <GiraffeProgress score={ROUNDS_PER_SESSION} isMilestone={true} maxScore={ROUNDS_PER_SESSION} />
                    <div className="dino-dance">🦖🦒🚗</div>
                    <button className="restart-btn" onClick={handleStart}>Play Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PronounAdventure;
