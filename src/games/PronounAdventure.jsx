import React, { useState } from 'react';
import GameScene from '../components/GameScene';
import GiraffeProgress from '../components/GiraffeProgress';
import { questions as originalQuestions } from '../data/questions';
import { speak, speakWithFemaleVoice, speakEncouraging, playSound } from '../utils/audio';
import startScreenImg from '../assets/pronoun_start.png';
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

function PronounAdventure({ onBackToMenu }) {
    const [gameState, setGameState] = useState('start'); // start, milestone, playing, win
    const [questions, setQuestions] = useState(originalQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [shake, setShake] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleStart = () => {
        // Randomize questions on start
        setQuestions(shuffleArray(originalQuestions));

        setScore(0);
        setCurrentQuestionIndex(0);
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

            setTimeout(() => {
                setGameState('next_question');
            }, 1000); // Short delay to show correct feedback before overlay
        } else {
            // Incorrect
            playSound('incorrect');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
        }
    };

    const handleNextQuestion = () => {
        const newScore = score + 1;
        setScore(newScore);

        // Check for milestones (5, 10)
        if (newScore === 5 || newScore === 10) {
            setGameState('milestone');
            speakEncouraging("Wow! The giraffe is growing!");
        } else if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setGameState('playing');
        } else {
            setGameState('win');
            speakEncouraging("You did it! The giraffe can eat the leaves!");
        }
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
                    <GiraffeProgress score={score} isMilestone={true} />
                    <button className="continue-btn">Continue (繼續)</button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="game-screen">
                    <div className="progress">
                        Question {currentQuestionIndex + 1} / {questions.length}
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

            {gameState === 'next_question' && (
                <div className="milestone-screen">
                    <h2>Correct!</h2>
                    <button className="game-btn-start" onClick={handleNextQuestion}>Next Question</button>
                </div>
            )}

            {gameState === 'win' && (
                <div className="win-screen">
                    <GiraffeProgress score={score} />
                    <h2 style={{ color: '#2ecc71' }}>🎉 You Won! 🎉</h2>
                    <button className="game-btn-start" onClick={handleStart} style={{ marginBottom: '20px' }}>Play Again</button>
                    <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                </div>
            )}
        </div>
    );
}

export default PronounAdventure;
