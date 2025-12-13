
import React, { useState, useEffect, useRef } from 'react';
import './ListeningBridge.css';
import adventurerImg from '../assets/listening_bridge/adventurer.png';
import plankImg from '../assets/listening_bridge/plank.png';
// background is set in CSS

const SENTENCES = [
    { text: "I like the dog", words: ["I", "like", "the", "dog"] },
    { text: "The cat is sleeping", words: ["The", "cat", "is", "sleeping"] },
    { text: "We play in the park", words: ["We", "play", "in", "the", "park"] },
    { text: "She has a red hat", words: ["She", "has", "a", "red", "hat"] },
    { text: "He runs very fast", words: ["He", "runs", "very", "fast"] },
    { text: "It is a sunny day", words: ["It", "is", "a", "sunny", "day"] }
];

const ListeningBridge = ({ onBack }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, win
    const [currentSentence, setCurrentSentence] = useState(null);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [isWin, setIsWin] = useState(false);
    const [draggedWord, setDraggedWord] = useState(null);
    const [adventurerPosition, setAdventurerPosition] = useState('start'); // start, crossed

    useEffect(() => {
        // Initial setup if needed
    }, []);

    const speakSentence = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8; // Slightly slower for kids
            utterance.pitch = 1.1; // Slightly higher pitch
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech Synthesis not supported");
        }
    };

    const handleStart = () => {
        setGameState('playing');
        startNewRound();
    };

    const startNewRound = () => {
        setIsWin(false);
        setAdventurerPosition('start');

        const randomIndex = Math.floor(Math.random() * SENTENCES.length);
        const sentence = SENTENCES[randomIndex];
        setCurrentSentence(sentence);

        // Prepare words
        const words = [...sentence.words];
        // Perfect shuffle
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        // Add IDs to handle duplicate words
        setShuffledWords(words.map((word, index) => ({ id: `word-${index}-${Date.now()}`, text: word })));
        setPlacedWords(new Array(sentence.words.length).fill(null));

        // Speak after a short delay
        setTimeout(() => speakSentence(sentence.text), 500);
    };

    const handleDragStart = (e, word) => {
        setDraggedWord(word);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggedWord) {
            // Check if slot is empty or replace? 
            // Let's replace for simplicity
            placeWord(draggedWord, index);
        }
        setDraggedWord(null);
    };

    const placeWord = (word, index) => {
        const newPlacedWords = [...placedWords];

        // Remove word from other slots if it was already placed
        const existingIndex = newPlacedWords.findIndex(w => w && w.id === word.id);
        if (existingIndex !== -1) {
            newPlacedWords[existingIndex] = null;
        }

        newPlacedWords[index] = word;
        setPlacedWords(newPlacedWords);
        checkWin(newPlacedWords);
    };

    const checkWin = (currentPlacedWords) => {
        if (currentPlacedWords.every(w => w !== null)) {
            const currentText = currentPlacedWords.map(w => w.text).join(' ');
            if (currentText === currentSentence.text) {
                // Correct!
                handleWin();
            } else {
                // Incorrect - maybe shake effect?
                console.log("Incorrect sequence");
                speakSentence("Try again!");
            }
        }
    };

    const handleWin = () => {
        setIsWin(true);
        setAdventurerPosition('crossed');
        speakSentence("Great job! You built the bridge!");
    };

    const handleWordClick = (word) => {
        // Auto-place into first empty slot
        const emptyIndex = placedWords.findIndex(w => w === null);
        if (emptyIndex !== -1) {
            placeWord(word, emptyIndex);
        }
    };

    const handleSlotClick = (index) => {
        if (placedWords[index]) {
            const newPlacedWords = [...placedWords];
            newPlacedWords[index] = null;
            setPlacedWords(newPlacedWords);
        }
    };

    // Filter available words
    const availableWords = shuffledWords.filter(sw => !placedWords.some(pw => pw && pw.id === sw.id));

    return (
        <div className="listening-bridge-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">Listening Bridge</h1>
                    <img src={adventurerImg} alt="Adventurer" className="game-start-image" style={{ height: '150px' }} />
                    <p className="game-start-description">Listen to the sentence and build the bridge!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    <div className="lb-controls">
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    <div className="lb-header">
                        <h2 className="lb-title">Listening Bridge</h2>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p className="lb-instruction">Click to listen again:</p>
                            <button className="lb-replay-btn" onClick={() => speakSentence(currentSentence.text)}>🔊</button>
                        </div>
                    </div>

                    <div className="lb-game-area">
                        {/* Bridge Area */}


                        <div className="lb-bridge-container">
                            <img
                                src={adventurerImg}
                                alt="Adventurer"
                                className={`lb-adventurer ${adventurerPosition === 'crossed' ? 'lb-cross' : ''}`}
                            />

                            <div className="lb-bridge-slots">
                                {currentSentence?.words.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`lb-slot ${placedWords[index] ? 'lb-filled' : ''}`}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragOver={handleDragOver}
                                        onClick={() => handleSlotClick(index)}
                                    >
                                        {placedWords[index] && (
                                            <div className="lb-plank" style={{ backgroundImage: `url(${plankImg})` }}>
                                                {placedWords[index].text}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Word Bank */}
                        <div className="lb-word-bank">
                            {availableWords.map((word) => (
                                <div
                                    key={word.id}
                                    className="lb-plank"
                                    style={{ position: 'relative', width: '100px', height: '40px', backgroundImage: `url(${plankImg})` }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, word)}
                                    onClick={() => handleWordClick(word)}
                                >
                                    {word.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isWin && (
                        <div className="lb-win-message">
                            <h2 className="lb-win-title">Safe Crossing!</h2>
                            <button className="lb-next-btn" onClick={startNewRound}>Next Adventure &gt;</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListeningBridge;
