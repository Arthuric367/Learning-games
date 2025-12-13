import React, { useState, useEffect, useRef } from 'react';
import { questionWords } from '../data/questionWords';
import { speak, speakWithFemaleVoice, speakEncouraging, playSound } from '../utils/audio';
import './QuestionWordRacer.css';
import raceCarImg from '../assets/race_car.svg';
import shieldIcon from '../assets/shield_icon.png';
import dinoAttackImg from '../assets/race_dino_attack.png';
import dinoBlockedImg from '../assets/race_dino_blocked.png';
import startScreenImg from '../assets/racer_start.png';

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const WIN_SCORE = 15;

function QuestionWordRacer({ onBackToMenu }) {
    const [gameState, setGameState] = useState('start'); // start, racing, win, gameover
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(0); // 0 to 100 visual speed
    const [shields, setShields] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isAttacked, setIsAttacked] = useState(false);
    const [wasBlocked, setWasBlocked] = useState(false);
    const [message, setMessage] = useState('');

    const currentQuestion = questions[currentQIndex];

    useEffect(() => {
        if (gameState === 'racing') {
            // Game loop or periodic checks could go here
            // For now, we rely on event-based updates
        }
    }, [gameState]);

    const handleStart = () => {
        // Get all questions shuffled randomly and shuffle their options
        const randomQuestions = shuffleArray(questionWords).map(q => ({
            ...q,
            options: shuffleArray([...q.options])
        }));
        setQuestions(randomQuestions);
        setScore(0);
        setCurrentQIndex(0);
        setSpeed(20); // Initial speed
        setShields(0);
        setStreak(0);
        setGameState('racing');
        setMessage("Go! Answer to speed up!");
        speakEncouraging("Ready? Go! Answer the questions to race!");
    };

    const triggerDinoAttack = () => {
        setIsAttacked(true);
        playSound('incorrect'); // Use incorrect sound as warning for now

        setTimeout(() => {
            if (shields > 0) {
                setWasBlocked(true);
                setShields(prev => prev - 1);
                setMessage("Shield blocked the Dino!");
                speakEncouraging("Shield blocked the Dino!");
            } else {
                setWasBlocked(false);
                setSpeed(prev => Math.max(10, prev - 30));
                setMessage("Dino slowed you down!");
                speakEncouraging("Oh no! The Dino slowed you down!");
            }
            setIsAttacked(false);
        }, 1500);
    };

    const handleAnswer = (selectedOption) => {
        if (gameState !== 'racing') return;

        if (selectedOption === currentQuestion.answer) {
            // Correct
            playSound('correct');
            const newScore = score + 1;
            setScore(newScore);
            setSpeed(prev => Math.min(100, prev + 15));

            const newStreak = streak + 1;
            setStreak(newStreak);

            if (newStreak % 3 === 0) {
                setShields(prev => prev + 1);
                setMessage("Shield Unlocked! 🛡️");
                speakEncouraging("Shield Unlocked!");
            } else {
                setMessage("Speed Up! 🏎️💨");
            }

            if (newScore >= WIN_SCORE) {
                setGameState('win');
                speakEncouraging("You crossed the finish line! Winner!");
            } else {
                // Next question
                if (currentQIndex < questions.length - 1) {
                    setCurrentQIndex(prev => prev + 1);

                    // Random Dino Attack chance (20%)
                    if (Math.random() < 0.2) {
                        triggerDinoAttack();
                    }
                } else {
                    // Ran out of questions but haven't won? Loop or win?
                    // Let's just win if they finished all available questions for now
                    setGameState('win');
                }
            }
        } else {
            // Incorrect
            playSound('incorrect');
            setSpeed(prev => Math.max(10, prev - 10));
            setStreak(0);
            setMessage("Slowed down... Try again!");
        }
    };

    return (
        <div className="racer-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🏎️ Question Word Racer 🏎️</h1>
                    <img src={startScreenImg} alt="Racing Car" className="game-start-image" />
                    <p className="game-start-description">Answer correctly to speed up!</p>
                    <p className="game-start-description">Get 3 right in a row to get a Shield 🛡️</p>
                    <p className="game-start-description">Watch out for Dino Attacks! 🦖</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'racing' && (
                <div className="race-scene">
                    <div className="hud">
                        <div className="score-box">🏁 {score} / {WIN_SCORE}</div>
                        <div className="shield-box">🛡️ {shields}</div>
                        <button className="game-btn-exit" onClick={onBackToMenu}>Exit</button>
                    </div>

                    <div className="track-view">
                        <div
                            className="track-bg"
                            style={{ animationDuration: `${200 / speed}s` }}
                        ></div>

                        <div className={`player-car ${isAttacked ? 'shaking' : ''}`}>
                            <img src={raceCarImg} alt="Car" />
                            {isAttacked && (
                                <img
                                    src={wasBlocked ? dinoBlockedImg : dinoAttackImg}
                                    className="dino-overlay"
                                    alt={wasBlocked ? "Dino Blocked" : "Dino Attack"}
                                />
                            )}
                        </div>

                        <div className="speed-lines" style={{ opacity: speed / 100 }}></div>
                    </div>

                    <div className="message-area">{message}</div>

                    <div className="question-dashboard">
                        <h2>{currentQuestion.question}</h2>
                        <div className="options-grid">
                            {currentQuestion.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className="racer-option-btn"
                                    onClick={() => handleAnswer(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'win' && (
                <div className="racer-win-screen">
                    <h1>🏆 VICTORY! 🏆</h1>
                    <p>You finished the race!</p>
                    <div className="car-celebration">🏎️💨💨</div>
                    <button className="restart-btn" onClick={handleStart}>Race Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionWordRacer;
