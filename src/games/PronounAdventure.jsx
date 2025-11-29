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

            const newScore = score + 1;
            setScore(newScore);

            setTimeout(() => {
                // Check for milestones (5, 10)
                if (newScore === 5 || newScore === 10) {
                    setGameState('milestone');
                    speakEncouraging("Wow! The giraffe is growing!");
                } else if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    setGameState('win');
                    speakEncouraging("You did it! The giraffe can eat the leaves!");
                }
            }, 2000); // Wait for audio/animation
        } else {
            // Incorrect
            playSound('incorrect');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
        }
    };

    return (
        <div className={`app-container ${shake ? 'shake' : ''}`}>
            {gameState === 'start' && (
                <div className="start-screen">
                    <h1>Dino & Friends <br /> Pronoun Adventure</h1>
                    <img src={startScreenImg} alt="Dino Picnic" className="start-screen-image" />
                    <button className="start-btn" onClick={handleStart}>開始遊戲 (Start)</button>
                    <button className="back-btn" onClick={onBackToMenu}>返回主選單 (Back to Menu)</button>
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
                    <button className="home-btn" onClick={onBackToMenu}>🏠</button>
                </div>
            )}

            {gameState === 'win' && (
                <div className="win-screen">
                    <h1>🎉 Great Job! 🎉</h1>
                    <GiraffeProgress score={15} isMilestone={true} />
                    <div className="dino-dance">🦖🦒🚗</div>
                    <button className="restart-btn" onClick={handleStart}>再玩一次 (Play Again)</button>
                    <button className="back-btn" onClick={onBackToMenu}>返回主選單 (Back to Menu)</button>
                </div>
            )}
        </div>
    );
}

export default PronounAdventure;
