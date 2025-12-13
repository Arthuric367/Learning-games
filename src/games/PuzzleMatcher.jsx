import React, { useState } from 'react';
import { puzzleLevels } from '../data/puzzleData';
import { speakEncouraging, playSound } from '../utils/audio';
import startScreenImg from '../assets/puzzle_start.png';
import puzzle1 from '../assets/construction_puzzle_1.png';
import puzzle2 from '../assets/construction_puzzle_2.png';
import puzzle3 from '../assets/construction_puzzle_3.png';
import puzzleAmbulance from '../assets/Puzzle_ambulance.jpg';
import puzzlePolice from '../assets/Puzzle_Police car.jpg';
import puzzleFireEngine from '../assets/Puzzle_Fire engine.jpg';
import carfamily1 from '../assets/car_family_puzzle_1.png';
import carfamily2 from '../assets/car_family_puzzle_2.png';
import carfamily3 from '../assets/car_family_puzzle_3.png';
import carfamily4 from '../assets/car_family_puzzle_4.png';
import carfamily5 from '../assets/car_family_puzzle_5.png';
import './PuzzleMatcher.css';

const puzzleImages = [puzzle1, puzzle2, puzzle3, puzzleAmbulance, puzzlePolice, puzzleFireEngine, carfamily1, carfamily2, carfamily3, carfamily4, carfamily5];

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function PuzzleMatcher({ onBackToMenu }) {
    const [unlockedPieces, setUnlockedPieces] = useState([]); // Array of solved question IDs
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [gameState, setGameState] = useState('start'); // start, playing, win
    const [feedback, setFeedback] = useState('');
    const [currentPuzzleImage, setCurrentPuzzleImage] = useState(puzzle1);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const handleAnswer = (option) => {
        if (option === currentQuestion.answer) {
            playSound('correct');
            speakEncouraging("Correct!");
            setFeedback('Correct! 🌟');

            const newUnlocked = [...unlockedPieces, currentQuestion.id];
            setUnlockedPieces(newUnlocked);

            setTimeout(() => {
                setFeedback('');
                if (newUnlocked.length === shuffledQuestions.length) {
                    setGameState('win');
                    speakEncouraging("You finished the puzzle! Great job!");
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            }, 1000);
        } else {
            playSound('incorrect');
            setFeedback('Try again! ❌');
            // Note: speakEncouraging is already called within playSound('incorrect')
        }
    };

    const handleStart = () => {
        // Pick a random image
        const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
        setCurrentPuzzleImage(randomImage);

        // Shuffle and pick 9 random questions, then shuffle options for each question
        const questionsWithShuffledOptions = shuffleArray([...puzzleLevels])
            .slice(0, 9) // Pick only 9 questions
            .map(q => ({
                ...q,
                options: shuffleArray([...q.options])
            }));
        setShuffledQuestions(questionsWithShuffledOptions);

        setUnlockedPieces([]);
        setCurrentQuestionIndex(0);
        setGameState('playing');
        speakEncouraging("Let's solve the puzzle!");
    };

    return (
        <div className="puzzle-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🧩 Preposition Puzzle 🧩</h1>
                    <img src={startScreenImg} alt="Puzzle" className="game-start-image" />
                    <p className="game-start-description">Match prepositions to complete the puzzle!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState !== 'start' && (
                <>
                    <div className="puzzle-header">
                        <h1>🧩 Preposition Puzzle 🧩</h1>
                        <button className="game-btn-exit" onClick={onBackToMenu}>Exit</button>
                    </div>

                    <div className="game-content">
                        {/* Left Side: The Puzzle Grid */}
                        <div className="puzzle-board">
                            <div className="puzzle-image-container">
                                <img src={currentPuzzleImage} alt="Puzzle Reward" className="reward-image" />
                                {/* Overlay Grid */}
                                <div className="puzzle-grid">
                                    {shuffledQuestions.map((level) => (
                                        <div
                                            key={level.id}
                                            className={`puzzle-piece ${unlockedPieces.includes(level.id) ? 'unlocked' : 'locked'}`}
                                        >
                                            {unlockedPieces.includes(level.id) ? '' : '?'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Question Area */}
                        <div className="question-area">
                            {gameState === 'playing' ? (
                                <div className="question-card">
                                    <div className="clue-icon">{currentQuestion.clue}</div>
                                    <h2>{currentQuestion.sentence}</h2>
                                    <div className="options-list">
                                        {currentQuestion.options.map(opt => (
                                            <button
                                                key={opt}
                                                className="option-btn"
                                                onClick={() => handleAnswer(opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="feedback-text">{feedback}</div>
                                </div>
                            ) : (
                                <div className="win-message">
                                    <h2>🎉 Puzzle Complete! 🎉</h2>
                                    <p>You found the hidden picture!</p>
                                    <button className="restart-btn" onClick={() => {
                                        // Pick a random image
                                        const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
                                        setCurrentPuzzleImage(randomImage);

                                        // Shuffle and pick 9 random questions, then shuffle options for each question
                                        const questionsWithShuffledOptions = shuffleArray([...puzzleLevels])
                                            .slice(0, 9) // Pick only 9 questions
                                            .map(q => ({
                                                ...q,
                                                options: shuffleArray([...q.options])
                                            }));
                                        setShuffledQuestions(questionsWithShuffledOptions);

                                        setUnlockedPieces([]);
                                        setCurrentQuestionIndex(0);
                                        setGameState('playing');
                                    }}>Play Again</button>
                                    <div style={{ marginTop: '20px' }}>
                                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PuzzleMatcher;
