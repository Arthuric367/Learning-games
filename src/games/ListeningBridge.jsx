import React, { useState, useEffect, useRef } from 'react';
import './ListeningBridge.css';
import adventurerImg from '../assets/listening_bridge/adventurer.png';
import plankImg from '../assets/listening_bridge/plank.png';
import startScreenImg from '../assets/listening_bridge/bridge_start.png';
import adventurerSuccessVideo from '../assets/listening_bridge/Adventurer_Success.mp4';
import adventurerFallVideo from '../assets/listening_bridge/Adventurer_Fall.mp4';
import SENTENCES from '../data/listeningBridgeData';
import { playSound, speakWithFemaleVoice } from '../utils/audio';
// background is set in CSS

const ROUNDS_PER_SESSION = 5;

console.log('[ListeningBridge] SENTENCES imported:', SENTENCES);
console.log('[ListeningBridge] SENTENCES length:', SENTENCES?.length);

const ListeningBridge = ({ onBack }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, next_question, wrong_answer, game_over, win
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sessionSentences, setSessionSentences] = useState([]); // Randomized 5 sentences for this session
    const [slots, setSlots] = useState([]);
    const [isCrossing, setIsCrossing] = useState(false);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [lives, setLives] = useState(3);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    useEffect(() => {
        console.log('[ListeningBridge] useEffect triggered', {
            gameState,
            currentSentenceIndex,
            sessionSentencesLength: sessionSentences.length,
            sessionSentences
        });

        if ((gameState === 'playing' || gameState === 'start') && sessionSentences.length > 0) {
            initLevel();
        }
    }, [currentSentenceIndex, gameState, sessionSentences]);

    const initLevel = () => {
        console.log('[initLevel] Starting', {
            currentSentenceIndex,
            sessionSentencesLength: sessionSentences.length
        });

        const sentence = sessionSentences[currentSentenceIndex];
        if (!sentence) {
            console.warn('[initLevel] No sentence found at index', currentSentenceIndex);
            return;
        }

        console.log('[initLevel] Sentence loaded:', sentence);
        setSlots(Array(sentence.words.length).fill(null));

        // Create word objects with unique IDs
        const words = sentence.words.map((word, index) => ({
            id: `word-${index}-${Date.now()}`,
            text: word
        }));

        // Shuffle
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        setShuffledWords(words);
        console.log('[initLevel] Shuffled words:', words);

        // Speak
        if (gameState === 'playing') {
            setTimeout(() => speakSentence(sentence.text), 500);
        }
    };

    const speakSentence = (text) => {
        speakWithFemaleVoice(text, { rate: 0.8, pitch: 1.1 });
    };

    // Derived available words: Those in shuffledWords NOT currently in any slot
    const availableWords = shuffledWords.filter(sw => !slots.some(s => s && s.id === sw.id));

    const handleStart = () => {
        console.log('[handleStart] Starting game');
        // Shuffle and select 5 random sentences
        const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, ROUNDS_PER_SESSION);

        console.log('[handleStart] Selected sentences:', selected);
        setSessionSentences(selected);
        setCurrentSentenceIndex(0); // Reset to first sentence
        setLives(3); // Reset lives
        setCorrectAnswers(0); // Reset score
        setGameState('playing');
    };

    const handleDragStart = (e, word) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(word));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        if (data) {
            const word = JSON.parse(data);
            placeWord(word, index);
        }
    };

    const placeWord = (word, index) => {
        // Find if word is already placed and remove it from there
        const currentSlotIndex = slots.findIndex(s => s && s.id === word.id);
        const newSlots = [...slots];

        if (currentSlotIndex !== -1) {
            newSlots[currentSlotIndex] = null;
        }

        // Return whatever was in the target slot to the bank (effectively)
        // Check if there is a word in the target slot
        // Actually, since we derive availableWords from slots, we just need to update slots.
        newSlots[index] = word;
        setSlots(newSlots);

        // We need to wait for state update to check win, or check with newSlots
        checkWin(newSlots);
    };

    const handleWordClick = (word) => {
        // Auto-place into first empty slot
        const emptyIndex = slots.findIndex(w => w === null);
        if (emptyIndex !== -1) {
            placeWord(word, emptyIndex);
        }
    };

    const handleRemoveWord = (index) => {
        if (slots[index]) {
            const newSlots = [...slots];
            newSlots[index] = null;
            setSlots(newSlots);
        }
    };

    const checkWin = (currentSlots) => {
        const currentSentence = SENTENCES[currentSentenceIndex];
        if (!currentSentence) return;

        // Only check if all slots are filled
        if (currentSlots.every(s => s !== null)) {
            const isCorrect = currentSentence.words.every((word, index) => {
                return currentSlots[index] && currentSlots[index].text === word;
            });

            if (isCorrect) {
                playSound('correct');
                setCorrectAnswers(prev => prev + 1); // Increment correct answers
                setIsCrossing(true);

                // Use a ref or local variable to ensure we don't depend on stale state if multiple clicks happened (unlikely here)
                setTimeout(() => {
                    setIsCrossing(false);
                    // Check if there are more sentences
                    if (currentSentenceIndex < ROUNDS_PER_SESSION - 1) {
                        setGameState('next_question');
                    } else {
                        playSound('win');
                        setGameState('win');
                    }
                }, 2000); // Reduced delay to 1s for better responsiveness
            } else {
                playSound('incorrect');

                // Wait 1 second, then deduct life and show appropriate screen
                setTimeout(() => {
                    const newLives = lives - 1;
                    setLives(newLives);

                    if (newLives > 0) {
                        setGameState('wrong_answer');
                    } else {
                        setGameState('game_over');
                    }
                }, 1000);
            }
        }
    };

    const handleNextQuestion = () => {
        // Move to next sentence, useEffect will re-init level
        if (currentSentenceIndex < ROUNDS_PER_SESSION - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
            setGameState('playing');
        } else {
            setGameState('win');
        }
    };

    const startNewRound = () => {
        // Shuffle and select 5 new random sentences
        const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, ROUNDS_PER_SESSION);

        setSessionSentences(selected);
        setCurrentSentenceIndex(0);
        setLives(3); // Reset lives
        setCorrectAnswers(0); // Reset score
        setGameState('playing');
        // useEffect will handle initialization
    };

    // Derive available words from the original sentence words and currently placed words
    const currentSentenceWords = SENTENCES[currentSentenceIndex]?.words.map((word, index) => ({
        id: `${word}-${index}-${currentSentenceIndex}`, // Unique ID for each original word
        text: word
    })) || [];

    const currentAvailableWords = availableWords.filter(word => !slots.some(slot => slot && slot.id === word.id));


    return (
        <div className="listening-bridge-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🌉 Listening Bridge 🌉</h1>
                    <img src={startScreenImg} alt="Bridge" className="game-start-image" />
                    <p className="game-start-description">Build the bridge with the correct words!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {(gameState === 'playing' || gameState === 'next_question' || gameState === 'wrong_answer') && (
                <>
                    <div className="lb-header">
                        <h2 className="lb-title">
                            Sentence {currentSentenceIndex + 1} / {ROUNDS_PER_SESSION} |
                            {' '}{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
                        </h2>
                        <button className="game-btn-sound" onClick={() => speakSentence(sessionSentences[currentSentenceIndex]?.text)}>🔊 Listen</button>
                    </div>

                    <div className="lb-controls">
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    <div className="lb-game-area">
                        {/* Bridge & Adventurer */}
                        <div className="lb-bridge-container">
                            <div className={`lb-adventurer ${isCrossing ? 'lb-cross' : ''}`}>
                                <img src={adventurerImg} alt="Adventurer" />
                            </div>
                            <div className="lb-bridge-slots">
                                {slots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className={`lb-slot ${slot ? 'lb-filled' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onClick={() => handleRemoveWord(index)}
                                    >
                                        {slot ? (
                                            <div className="lb-plank" style={{ backgroundImage: `url(${plankImg})` }}>
                                                {slot.text}
                                            </div>
                                        ) : (
                                            <span style={{ opacity: 0.5 }}>Slot {index + 1}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Word Bank */}
                        {(gameState === 'playing') && (
                            <div className="lb-word-bank">
                                {availableWords.map((word) => (
                                    <div
                                        key={word.id}
                                        className="lb-plank"
                                        style={{ backgroundImage: `url(${plankImg})` }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, word)}
                                        onClick={() => handleWordClick(word)}
                                    >
                                        {word.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        {gameState === 'next_question' && (
                            <div className="lb-overlay-container">
                                <div className="lb-next-question-overlay">
                                    <h2 className="lb-celebration-title">✨ You are correct! ✨</h2>
                                    <div className="lb-celebration-content">
                                        <video
                                            src={adventurerSuccessVideo}
                                            autoPlay
                                            className="lb-celebration-image"
                                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                                        />
                                        <p className="lb-celebration-text">Great job! Let's build more bridge! �</p>
                                    </div>
                                    <button className="game-btn-start" onClick={handleNextQuestion}>Next Question</button>
                                </div>
                            </div>
                        )}

                        {gameState === 'wrong_answer' && (
                            <div className="lb-overlay-container">
                                <div className="lb-next-question-overlay">
                                    <h2 className="lb-celebration-title">❌ It is incorrect ❌</h2>
                                    <div className="lb-celebration-content">
                                        <video
                                            src={adventurerFallVideo}
                                            autoPlay
                                            className="lb-celebration-image"
                                            style={{ maxHeight: '300px', objectFit: 'contain' }}
                                        />
                                        <p className="lb-celebration-text">Try again on the next question! 💪</p>
                                    </div>
                                    <button className="game-btn-start" onClick={handleNextQuestion}>Next Question</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {gameState === 'game_over' && (
                <div className="lb-win-message">
                    <h2 className="lb-win-title">🎮 Game Over 🎮</h2>
                    <p>You answered <strong>{correctAnswers}</strong> out of <strong>{currentSentenceIndex + 1}</strong> questions correctly!</p>
                    <p style={{ marginTop: '10px' }}>Don't give up! Try again! 💪</p>
                    <button className="game-btn-start" onClick={startNewRound} style={{ marginRight: '20px' }}>Try Again</button>
                    <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                </div>
            )}

            {gameState === 'win' && (
                <div className="lb-win-message">
                    <h2 className="lb-win-title">🎉 Bridge Completed! 🎉</h2>
                    <p>You helped the child cross the bridge!</p>
                    <p>Perfect score: <strong>{correctAnswers}</strong> out of <strong>{ROUNDS_PER_SESSION}</strong>! 🌟</p>
                    <button className="game-btn-start" onClick={startNewRound} style={{ marginRight: '20px' }}>Play Again</button>
                    <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                </div>
            )}
        </div>
    );
};

export default ListeningBridge;
