import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './AdjectiveArtist.css';
import { playSound, speakWithFemaleVoice } from '../utils/audio';
import ADJECTIVE_ARTIST_DATA from '../data/adjectiveArtistData';

// Asset Imports
import balloonThemeStart from '../assets/adjective_artist/balloon_theme_start.png';
import clothingThemeStart from '../assets/adjective_artist/clothing_theme_start.png';
import happyFaceBase from '../assets/adjective_artist/happy_face_base.png';
import sadFaceBase from '../assets/adjective_artist/sad_face_base.png';
import surprisedFaceBase from '../assets/adjective_artist/surprised_face_base.png';
import angryFaceBase from '../assets/adjective_artist/angry_face_base.png';
import shyFaceBase from '../assets/adjective_artist/shy_face_base.png';
import scaredFaceBase from '../assets/adjective_artist/scared_face_base.png';
import boredFaceBase from '../assets/adjective_artist/bored_face_base.png';
import balloonBase from '../assets/adjective_artist/balloon_base.png';
import hatBase from '../assets/adjective_artist/hat_base.png';
import shirtBase from '../assets/adjective_artist/shirt_base.png';
import socksBase from '../assets/adjective_artist/socks_base.png';
import shoesBase from '../assets/adjective_artist/shoes_base.png';
import dressBase from '../assets/adjective_artist/dress_base.png';
import scarfBase from '../assets/adjective_artist/scarf_base.png';
import jacketBase from '../assets/adjective_artist/jacket_base.png';
import cakeImg from '../assets/celebration_cake.png';

const IMAGES = {
    balloon: balloonBase,
    hat: hatBase,
    shirt: shirtBase,
    socks: socksBase,
    shoes: shoesBase,
    dress: dressBase,
    scarf: scarfBase,
    jacket: jacketBase,
    happy: happyFaceBase,
    sad: sadFaceBase,
    surprised: surprisedFaceBase,
    angry: angryFaceBase,
    shy: shyFaceBase,
    scared: scaredFaceBase,
    bored: boredFaceBase
};

const START_SCREENS = {
    balloons: balloonThemeStart,
    clothing: clothingThemeStart,
    emotions: clothingThemeStart
};

const ENCOURAGING_MESSAGES = [
    "Great Job!",
    "Fantastic!",
    "You're an artist!",
    "Amazing!",
    "Brilliant!",
    "Wonderful!"
];

const AdjectiveArtist = ({ onBack }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, next_question, win
    const [currentTheme, setCurrentTheme] = useState(null);
    const [currentRound, setCurrentRound] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [instruction, setInstruction] = useState('');
    const [targetState, setTargetState] = useState({}); // { targetId: { color: null, isPainting: false } }
    const [activeTargets, setActiveTargets] = useState([]);
    const [correctTarget, setCorrectTarget] = useState(null);
    const [successMessage, setSuccessMessage] = useState(ENCOURAGING_MESSAGES[0]);

    const initRound = useCallback((theme) => {
        let selectedTargets = [];
        if (theme.pool && theme.selectionCount) {
            // Shuffle pool and take selectionCount
            const shuffled = [...theme.pool].sort(() => 0.5 - Math.random());
            selectedTargets = shuffled.slice(0, theme.selectionCount);
        } else {
            selectedTargets = theme.targets;
        }

        const randomTarget = selectedTargets[Math.floor(Math.random() * selectedTargets.length)];
        const randomColor = theme.options.colors[Math.floor(Math.random() * theme.options.colors.length)];

        const newInstruction = theme.instructionTemplate
            .replace('{size}', randomTarget.size || '')
            .replace('{item}', randomTarget.item || '')
            .replace('{emotion}', randomTarget.emotion || '')
            .replace('{color}', randomColor)
            .replace('  ', ' ');

        setInstruction(newInstruction);
        setCorrectTarget({ ...randomTarget, color: randomColor });
        setActiveTargets(selectedTargets);
        setTargetState({});
        setSelectedColor(null);

        setTimeout(() => speakWithFemaleVoice(newInstruction), 500);
    }, []);

    const handleStart = () => {
        const randomTheme = ADJECTIVE_ARTIST_DATA.themes[Math.floor(Math.random() * ADJECTIVE_ARTIST_DATA.themes.length)];
        setCurrentTheme(randomTheme);
        setCurrentRound(1);
        setGameState('playing');
        initRound(randomTheme);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        playSound('click');
    };

    const handleTargetClick = (target) => {
        if (!selectedColor) {
            speakWithFemaleVoice("Pick a color first!");
            return;
        }

        const isCorrect = target.id === correctTarget.id && selectedColor === correctTarget.color;

        if (isCorrect) {
            // Trigger painting animation first
            setTargetState({ [target.id]: { color: null, isPainting: true } });
            playSound('correct');

            // Set the color after a short delay so the splash is visible against the white background
            setTimeout(() => {
                setTargetState({ [target.id]: { color: selectedColor, isPainting: true } });
            }, 300);

            setTimeout(() => {
                if (currentRound < ADJECTIVE_ARTIST_DATA.roundsPerSession) {
                    setSuccessMessage(ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]);
                    setGameState('next_question');
                } else {
                    playSound('win');
                    setGameState('win');
                }
            }, 1800);
        } else {
            playSound('incorrect');
            speakWithFemaleVoice("Try again!");
        }
    };

    const handleNextRound = () => {
        setCurrentRound(prev => prev + 1);
        setGameState('playing');
        initRound(currentTheme);
    };

    const renderTarget = (target) => {
        const itemType = target.item || target.emotion || target.type;
        const imgSrc = IMAGES[itemType];
        const state = targetState[target.id] || {};
        const isColored = state.color;
        const isPainting = state.isPainting;

        return (
            <div
                key={target.id}
                className={`aa-target ${target.size || ''} ${isColored ? 'colored' : ''} ${isPainting ? 'painting' : ''}`}
                onClick={() => handleTargetClick(target)}
            >
                <div className="aa-target-inner" style={{ backgroundColor: isColored ? state.color : 'transparent' }}>
                    <img src={imgSrc} alt={itemType} />
                    {isPainting && <div className="aa-paint-splash" style={{ backgroundColor: selectedColor }} />}
                </div>
                {target.size && <span className="aa-label">{target.size}</span>}
                {target.item && <span className="aa-label">{target.item}</span>}
                {target.emotion && <span className="aa-label">{target.emotion}</span>}
            </div>
        );
    };

    return (
        <div className="adjective-artist-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🎨 Adjective Artist 🎨</h1>
                    <img src={START_SCREENS[currentTheme?.id || 'balloons']} alt="Artist" className="game-start-image" />
                    <p className="game-start-description">Follow the instructions to paint and dress!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {(gameState === 'playing' || gameState === 'next_question') && (
                <div className="aa-gameplay">
                    <div className="aa-header">
                        <div className="aa-info">
                            <span className="aa-round">Round {currentRound} / {ADJECTIVE_ARTIST_DATA.roundsPerSession}</span>
                            <h2 className="aa-instruction">{instruction}</h2>
                        </div>
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    <div className="aa-main-area">
                        <div className="aa-sidebar">
                            <h3>Colors</h3>
                            <div className="aa-color-palette">
                                {currentTheme.options.colors.map(color => (
                                    <button
                                        key={color}
                                        className={`aa-color-btn ${selectedColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorSelect(color)}
                                    />
                                ))}
                            </div>
                            <button className="aa-replay-btn" onClick={() => speakWithFemaleVoice(instruction)}>🔊</button>
                        </div>

                        <div className="aa-stage">
                            {activeTargets.map(renderTarget)}
                        </div>
                    </div>

                    {gameState === 'next_question' && (
                        <div className="aa-overlay">
                            <div className="aa-overlay-content">
                                <img src={cakeImg} alt="Success Cake" className="aa-success-cake" />
                                <h2 className="aa-success-text">{successMessage}</h2>
                                <button className="game-btn-start" onClick={handleNextRound}>Next Task</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'win' && (
                <div className="game-start-screen">
                    <h2 className="game-start-title">🎉 Master Artist! 🎉</h2>
                    <p>You followed all instructions perfectly!</p>
                    <button className="game-btn-start" onClick={handleStart} style={{ marginRight: '20px' }}>Play Again</button>
                    <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                </div>
            )}
        </div>
    );
};

export default AdjectiveArtist;
