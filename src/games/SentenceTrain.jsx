import React, { useState, useEffect, useRef } from 'react';
import './SentenceTrain.css';
import trainEngineImg from '../assets/sentence_train/train_engine.png';
import trainCarImg from '../assets/sentence_train/train_car.png';
import SENTENCES from '../data/sentenceTrainData';

const SentenceTrain = ({ onBack }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, win
    const [currentSentence, setCurrentSentence] = useState(null);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [isWin, setIsWin] = useState(false);
    const [score, setScore] = useState(0);
    const [draggedWord, setDraggedWord] = useState(null);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        // No auto-start
    }, []);

    const handleStart = () => {
        setGameState('playing');
        startNewRound();
    };

    const startNewRound = () => {
        // Teleport to start position (Right)
        setIsResetting(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * SENTENCES.length);
            const sentence = SENTENCES[randomIndex];
            setCurrentSentence(sentence);

            // Shuffle words for the word bank
            const words = [...sentence.words];
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }
            setShuffledWords(words.map((word, index) => ({ id: index, text: word })));

            // Initialize placed words with nulls
            setPlacedWords(new Array(sentence.words.length).fill(null));
            setIsWin(false);

            // Allow animation to center to start
            // Small delay to ensure the 'true' state was rendered
            setTimeout(() => {
                setIsResetting(false);
            }, 50);
        }, 50);
    };

    const handleDragStart = (e, word) => {
        setDraggedWord(word);
        e.dataTransfer.effectAllowed = "move";
        // For touch devices, we might need a different approach or a library like react-dnd or dnd-kit
        // But for now, standard HTML5 drag and drop is implemented.
        // Note: Standard HTML5 DnD doesn't work well on mobile. 
        // Since the user asked for "Child drags them", and previous games used click/tap, 
        // I will implement both Drag-and-Drop and Click-to-Place for better accessibility.
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggedWord && !placedWords[index]) {
            placeWord(draggedWord, index);
        }
        setDraggedWord(null);
    };

    const placeWord = (word, index) => {
        console.log('Placing word:', word.text, 'at index:', index);
        const newPlacedWords = [...placedWords];
        // If word was already placed somewhere else, remove it from there
        const existingIndex = newPlacedWords.findIndex(w => w && w.id === word.id);
        if (existingIndex !== -1) {
            newPlacedWords[existingIndex] = null;
        }

        newPlacedWords[index] = word;
        setPlacedWords(newPlacedWords);

        checkWin(newPlacedWords);
    };

    const checkWin = (currentPlacedWords) => {
        console.log('Checking win with:', currentPlacedWords);
        // Ensure no nulls and correct length
        if (currentPlacedWords.length === currentSentence.words.length && !currentPlacedWords.includes(null) && currentPlacedWords.every(w => w !== null)) {
            const targetWords = currentSentence.words;
            const isCorrect = currentPlacedWords.every((w, i) => w.text === targetWords[i]);

            console.log('Is correct?', isCorrect);

            if (isCorrect) {
                setIsWin(true);
                setScore(score + 8);
            }
        } else {
            console.log('Not all words placed yet.');
        }
    };

    const handleWordClick = (word) => {
        // Find first empty slot
        const emptyIndex = placedWords.findIndex(w => w === null);
        if (emptyIndex !== -1) {
            placeWord(word, emptyIndex);
        }
    };

    const handleSlotClick = (index) => {
        // If there is a word, return it to bank
        if (placedWords[index]) {
            const newPlacedWords = [...placedWords];
            newPlacedWords[index] = null;
            setPlacedWords(newPlacedWords);
            setIsWin(false); // Reset win if they remove a word
        }
    };

    // Filter out words that are already placed
    const availableWords = shuffledWords.filter(sw => !placedWords.some(pw => pw && pw.id === sw.id));

    return (
        <div className="sentence-train-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">Sentence Train</h1>
                    <img src={trainEngineImg} alt="Train Engine" className="game-start-image" />
                    <p className="game-start-description">Build the sentence by dragging words to the train cars!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    <div className="st-controls">
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    <div className="st-header">
                        <h1 className="st-title">Sentence Train</h1>
                        <p className="st-instruction">Build the sentence: "{currentSentence?.text}"</p>
                        <div className="st-score">Score: {score}</div>
                    </div>

                    <div className="st-game-area">
                        <div className="st-track"></div>

                        <div className={`st-train-container ${isWin ? 'st-train-move-out' : ''} ${isResetting ? 'st-train-reset' : ''}`}>
                            <img src={trainEngineImg} alt="Engine" className="st-engine" />
                            <div className="st-cars-container">
                                {currentSentence?.words.map((_, index) => (
                                    <div key={index} className="st-car-slot">
                                        <img src={trainCarImg} alt="Car" className="st-car-image" />
                                        <div
                                            className={`st-drop-zone ${placedWords[index] ? 'st-filled' : ''}`}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragOver={handleDragOver}
                                            onClick={() => handleSlotClick(index)}
                                        >
                                            {placedWords[index] && (
                                                <div className="st-word-card st-placed">
                                                    {placedWords[index].text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="st-word-bank">
                        {!isWin && availableWords.map((word) => (
                            <div
                                key={word.id}
                                className="st-word-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, word)}
                                onClick={() => handleWordClick(word)}
                            >
                                {word.text}
                            </div>
                        ))}
                    </div>

                    {isWin && (
                        <div className="st-win-message">
                            <h2 className="st-win-title">Choo Choo! Great Job!</h2>
                            <button className="game-btn-start" onClick={startNewRound} style={{ marginRight: '20px' }}>Play Again</button>
                            <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SentenceTrain;
