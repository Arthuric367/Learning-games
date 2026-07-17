import React, { useState, useEffect, useRef } from 'react';
import { categories } from '../data/categories';
import { speak, speakWithFemaleVoice, speakEncouraging, playSound } from '../utils/audio';
import './WonderWorldBlaster.css';
// Import all monsters from cutemonsters directory
// Import all monsters from cutemonsters directory
import abyssalBeastImg from '../assets/wonder_world_blaster/cutemonsters/abyssal beast.png';
import automatonFighterImg from '../assets/wonder_world_blaster/cutemonsters/automaton fighter.png';
import boglingImg from '../assets/wonder_world_blaster/cutemonsters/bogling.png';
import dryadImg from '../assets/wonder_world_blaster/cutemonsters/dryad.png';
import fishImg from '../assets/wonder_world_blaster/cutemonsters/fish.png';
import glisteningFishImg from '../assets/wonder_world_blaster/cutemonsters/glistening fish.png';
import livingBoulderImg from '../assets/wonder_world_blaster/cutemonsters/living boulder.png';
import merfolkImg from '../assets/wonder_world_blaster/cutemonsters/merfolk.png';
import minotaurImg from '../assets/wonder_world_blaster/cutemonsters/minotaur.png';
import plantBehemothImg from '../assets/wonder_world_blaster/cutemonsters/plant behemoth.png';
import plantSpriteImg from '../assets/wonder_world_blaster/cutemonsters/plant sprite.png';
import sharkImg from '../assets/wonder_world_blaster/cutemonsters/shark.png';
import snowWormImg from '../assets/wonder_world_blaster/cutemonsters/snow worm.png';
import tentacleMonsterImg from '../assets/wonder_world_blaster/cutemonsters/tentacle monster.png';
import tigerImg from '../assets/wonder_world_blaster/cutemonsters/tiger.png';
import turtleImg from '../assets/wonder_world_blaster/cutemonsters/turtle.png';
import airFighterImg from '../assets/wonder_world_blaster/air_fighter.png';
import airFighterShootImg from '../assets/wonder_world_blaster/air_fighter_shoot.png';
import startScreenImg from '../assets/wonder_world_blaster/sky_background.png';

// Array of all monster images
const monsterImages = [
    abyssalBeastImg,
    automatonFighterImg,
    boglingImg,
    dryadImg,
    fishImg,
    glisteningFishImg,
    livingBoulderImg,
    merfolkImg,
    minotaurImg,
    plantBehemothImg,
    plantSpriteImg,
    sharkImg,
    snowWormImg,
    tentacleMonsterImg,
    tigerImg,
    turtleImg
];

// Get a random monster image
const getRandomMonster = () => {
    return monsterImages[Math.floor(Math.random() * monsterImages.length)];
};

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function WonderWorldBlaster({ onBackToMenu }) {
    const [gameState, setGameState] = useState('start'); // start, playing, win, gameover
    const [level, setLevel] = useState(1); // 1 = Unlimited lives, 2 = 5 lives
    const [lives, setLives] = useState(Infinity);
    const [bossHealth, setBossHealth] = useState(5);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentMonster, setCurrentMonster] = useState(getRandomMonster()); // Random monster
    const [isShooting, setIsShooting] = useState(false); // Track shooting animation
    const [isHit, setIsHit] = useState(false); // Track boss hit animation
    const [message, setMessage] = useState('');
    const bubbleIdCounter = useRef(0);
    const gameLoopRef = useRef(null);

    useEffect(() => {
        if (gameState === 'playing') {
            // Start game loop
            gameLoopRef.current = setInterval(() => {
                updateBubbles();
                maybeSpawnBubble();
            }, 100);

            return () => clearInterval(gameLoopRef.current);
        }
    }, [gameState, bubbles]);

    const updateBubbles = () => {
        setBubbles(prev => {
            const updated = prev.map(bubble => ({
                ...bubble,
                y: bubble.y + 1 // Float upward
            })).filter(bubble => bubble.y < 90); // Remove bubbles that float off screen

            return updated;
        });
    };

    const maybeSpawnBubble = () => {
        if (Math.random() < 0.1 && bubbles.length < 6) {
            spawnBubble();
        }
    };

    const spawnBubble = () => {
        if (!currentCategory) return;

        const isCorrect = Math.random() < 0.4; // 40% correct, 60% wrong
        const isRainbow = Math.random() < 0.1; // 10% rainbow bubbles

        const items = isCorrect
            ? currentCategory.correctItems
            : currentCategory.wrongItems;

        const content = items[Math.floor(Math.random() * items.length)];

        const newBubble = {
            id: bubbleIdCounter.current++,
            x: Math.random() * 50 + 35, // Random x position 35-85% (avoiding monster on left)
            y: 0, // Start at bottom
            content,
            isCorrect,
            isRainbow
        };

        setBubbles(prev => [...prev, newBubble]);
    };

    const handleStart = (selectedLevel) => {
        setLevel(selectedLevel);
        setLives(selectedLevel === 1 ? Infinity : 5);
        setBossHealth(5);
        setScore(0);
        setCombo(0);
        setBubbles([]);

        // Pick a random category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        setCurrentCategory(randomCategory);

        // Pick a random monster
        setCurrentMonster(getRandomMonster());

        setGameState('playing');
        setMessage(`Find the ${randomCategory.name}!`);
        speakEncouraging(`Get ready! Pop the bubbles with ${randomCategory.name}!`);
    };

    const handleShoot = (bubbleId) => {
        const bubble = bubbles.find(b => b.id === bubbleId);
        if (!bubble) return;

        // Remove the bubble
        setBubbles(prev => prev.filter(b => b.id !== bubbleId));

        if (bubble.isCorrect) {
            // Correct hit
            playSound('correct');

            // Show shooting animation
            setIsShooting(true);
            setTimeout(() => setIsShooting(false), 1000); // Reset after 1000ms

            // Show explosion on boss
            setIsHit(true);
            setTimeout(() => setIsHit(false), 500);

            const newBossHealth = bossHealth - 1;
            setBossHealth(newBossHealth);

            const newCombo = combo + 1;
            setCombo(newCombo);

            const points = bubble.isRainbow ? 3 : 1;
            setScore(prev => prev + points);

            if (bubble.isRainbow) {
                setMessage(`🌈 Rainbow Bubble! +${points} points! Combo: ${newCombo}`);
            } else {
                setMessage(`✅ Correct! Combo: ${newCombo}`);
            }

            if (newBossHealth <= 0) {
                // Boss defeated
                setGameState('win');
                speakEncouraging('Amazing! You defeated the monster!');
            }
        } else {
            // Incorrect hit
            playSound('incorrect');
            setCombo(0);

            if (level === 2) {
                const newLives = lives - 1;
                setLives(newLives);
                setMessage(`❌ Wrong! Lives: ${newLives}`);

                if (newLives <= 0) {
                    setGameState('gameover');
                    speakEncouraging('Game Over! Try again!');
                }
            } else {
                setMessage('❌ Wrong! Try again!');
            }
        }
    };

    return (
        <div className="blaster-container">
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🎯 Wonder World Blaster 🎯</h1>
                    <img src={startScreenImg} alt="Sky" className="game-start-image" />
                    <p className="game-start-description">Pop the correct category bubbles!</p>
                    <p className="game-start-description">Defeat the monster by hitting 5 correct bubbles!</p>

                    <div className="level-selection">
                        <button className="level-btn" onClick={() => handleStart(1)}>
                            Level 1: Practice Mode 🌟
                            <br />
                            <small>(Unlimited Lives)</small>
                        </button>
                        <button className="level-btn level-2" onClick={() => handleStart(2)}>
                            Level 2: Challenge Mode 🔥
                            <br />
                            <small>(5 Lives Only)</small>
                        </button>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && currentCategory && (
                <div className="game-scene">
                    <div className="hud">
                        <div className="category-display">
                            <span className="category-emoji">{currentCategory.emoji}</span>
                            <span className="category-name">Find: {currentCategory.name}</span>
                        </div>
                        <div className="stats">
                            <span>💯 Score: {score}</span>
                            <span>🔥 Combo: {combo}</span>
                            {level === 2 && <span>💖 Lives: {lives}</span>}
                        </div>
                        <button className="game-btn-exit" onClick={onBackToMenu}>Exit</button>
                    </div>

                    <div className="game-area">
                        <div className="monster-boss">
                            <img src={currentMonster} alt="Monster Boss" className={isHit ? 'boss-hit' : ''} />
                            {isHit && <div className="explosion-effect">💥</div>}
                            <div className="boss-health">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < bossHealth ? 'heart filled' : 'heart'}>
                                        {i < bossHealth ? '❤️' : '🖤'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bubbles-container">
                            {bubbles.map(bubble => (
                                <div
                                    key={bubble.id}
                                    className={`bubble ${bubble.isRainbow ? 'rainbow' : ''}`}
                                    style={{
                                        left: `${bubble.x}%`,
                                        bottom: `${bubble.y}%`
                                    }}
                                    onClick={() => handleShoot(bubble.id)}
                                >
                                    {bubble.content}
                                </div>
                            ))}
                        </div>

                        <div className="fighter">
                            <img src={isShooting ? airFighterShootImg : airFighterImg} alt="Fighter" />
                        </div>
                    </div>

                    <div className="message-area">{message}</div>
                </div>
            )}

            {gameState === 'win' && (
                <div className="blaster-win-screen">
                    <h1>🏆 VICTORY! 🏆</h1>
                    <p>You defeated the monster!</p>
                    <p>Final Score: {score}</p>
                    <p>Max Combo: {combo}</p>
                    <div className="victory-emoji">🎉✨🎊</div>
                    <button className="restart-btn" onClick={() => handleStart(level)}>Play Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="blaster-gameover-screen">
                    <h1>💔 Game Over 💔</h1>
                    <p>The monster got away...</p>
                    <p>Final Score: {score}</p>
                    <button className="restart-btn" onClick={() => handleStart(level)}>Try Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBackToMenu}>Back to Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WonderWorldBlaster;
