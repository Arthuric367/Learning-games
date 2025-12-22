import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SpellingBeeGarden.css';
import { playSound, speakWithFemaleVoice } from '../utils/audio';
import SPELLING_BEE_DATA from '../data/spellingBeeData';

// Asset Imports
import gardenBg from '../assets/spelling_bee/garden_bg.png';
import beeImg from '../assets/spelling_bee/bee.png';
import flowerImg from '../assets/spelling_bee/flower.png';
import honeyPotImg from '../assets/spelling_bee/honey_pot.png';
import busImg from '../assets/spelling_bee/bus.png';
import catImg from '../assets/spelling_bee/cat.png';
import dogImg from '../assets/spelling_bee/dog.png';
import sunImg from '../assets/spelling_bee/sun.png';
import boxImg from '../assets/spelling_bee/box.png';
import pigImg from '../assets/spelling_bee/pig.png';
import appleImg from '../assets/spelling_bee/apple.png';
import dressImg from '../assets/spelling_bee/dress.png';
import eggImg from '../assets/spelling_bee/egg.png';
import fanImg from '../assets/spelling_bee/fan.png';
import fishImg from '../assets/spelling_bee/fish.png';
import gumImg from '../assets/spelling_bee/gum.png';
import hatImg from '../assets/spelling_bee/hat.png';
import icecreamImg from '../assets/spelling_bee/icecream.png';
import jetImg from '../assets/spelling_bee/jet.png';
import mermaidImg from '../assets/spelling_bee/mermaid.png';
import monsterImg from '../assets/spelling_bee/monster.png';
import pizzaImg from '../assets/spelling_bee/pizza.png';
import rockImg from '../assets/spelling_bee/rock.png';
import robotImg from '../assets/spelling_bee/robot.png';
import socksImg from '../assets/spelling_bee/socks.png';
import sharkImg from '../assets/spelling_bee/shark.png';
import treeImg from '../assets/spelling_bee/tree.png';
import tigerImg from '../assets/spelling_bee/tiger.png';
import turtleImg from '../assets/spelling_bee/turtle.png';
import wingImg from '../assets/spelling_bee/wing.png';
import cakeImg from '../assets/celebration_cake.png';

const ITEM_IMAGES = {
    bus: busImg,
    cat: catImg,
    dog: dogImg,
    sun: sunImg,
    box: boxImg,
    pig: pigImg,
    apple: appleImg,
    dress: dressImg,
    egg: eggImg,
    fan: fanImg,
    fish: fishImg,
    gum: gumImg,
    hat: hatImg,
    icecream: icecreamImg,
    jet: jetImg,
    mermaid: mermaidImg,
    monster: monsterImg,
    pizza: pizzaImg,
    rock: rockImg,
    robot: robotImg,
    socks: socksImg,
    shark: sharkImg,
    tree: treeImg,
    tiger: tigerImg,
    turtle: turtleImg,
    wing: wingImg
};

const SpellingBeeGarden = ({ onBack }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, next_question, win
    const [currentRound, setCurrentRound] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [honeyCount, setHoneyCount] = useState(0);
    const [beePos, setBeePos] = useState({ left: '50%', bottom: '20px' });
    const [isBeeMoving, setIsBeeMoving] = useState(false);
    const flowerRefs = useRef([]);

    const initRound = useCallback((roundIndex) => {
        const wordPool = SPELLING_BEE_DATA.vocabulary;
        const word = wordPool[roundIndex % wordPool.length];

        // Shuffle the options to randomize letter positions
        const shuffledOptions = [...word.options].sort(() => Math.random() - 0.5);
        const wordWithShuffledOptions = { ...word, options: shuffledOptions };

        setCurrentWord(wordWithShuffledOptions);
        setGameState('playing');
        setBeePos({ left: '50%', top: '120px' });
        setIsBeeMoving(false);

        const instruction = `Find the first letter for ${word.audioQuery}`;
        setTimeout(() => speakWithFemaleVoice(instruction), 500);
    }, []);

    const handleStart = () => {
        setCurrentRound(1);
        setHoneyCount(0);
        initRound(0);
    };

    const handleFlowerClick = (letter, index) => {
        if (isBeeMoving || gameState !== 'playing') return;

        // Move bee to flower
        const flowerRect = flowerRefs.current[index].getBoundingClientRect();
        const stageRect = flowerRefs.current[index].parentElement.getBoundingClientRect();

        const targetLeft = ((flowerRect.left + flowerRect.width / 2 - stageRect.left) / stageRect.width) * 100;
        const targetTop = 20; // Position near top of flowers

        setBeePos({ left: `${targetLeft}%`, top: `${targetTop}px` });
        setIsBeeMoving(true);

        setTimeout(() => {
            if (letter === currentWord.missingLetter) {
                playSound('correct');
                speakWithFemaleVoice(currentWord.word);
                setHoneyCount(prev => prev + 1);

                setTimeout(() => {
                    if (currentRound < SPELLING_BEE_DATA.roundsPerSession) {
                        setGameState('next_question');
                    } else {
                        playSound('win');
                        setGameState('win');
                    }
                }, 1000);
            } else {
                playSound('incorrect');
                speakWithFemaleVoice("Try another flower!");
                setTimeout(() => {
                    setBeePos({ left: '50%', top: '120px' });
                    setIsBeeMoving(false);
                }, 1000);
            }
        }, 1000);
    };

    const handleNextRound = () => {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        initRound(nextRound - 1);
    };

    return (
        <div className="spelling-bee-container" style={{ backgroundImage: `url(${gardenBg})` }}>
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🐝 Spelling Bee Garden 🐝</h1>
                    <img src={beeImg} alt="Spelling Bee" className="game-start-image" />
                    <p className="game-start-description">Help the bee collect nectar to spell words!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {(gameState === 'playing' || gameState === 'next_question') && (
                <div className="sb-gameplay">
                    <div className="sb-header">
                        <div className="sb-round-info">Round {currentRound} / {SPELLING_BEE_DATA.roundsPerSession}</div>
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    <div className="sb-main-area">
                        <div className="sb-word-display">
                            <img src={ITEM_IMAGES[currentWord?.id]} alt={currentWord?.id} className="sb-word-image" />
                            <div className="sb-missing-word">{currentWord?.displayWord}</div>
                        </div>

                        <div className="sb-garden-stage">
                            {currentWord?.options.map((letter, index) => (
                                <div
                                    key={index}
                                    className="sb-flower"
                                    ref={el => flowerRefs.current[index] = el}
                                    onClick={() => handleFlowerClick(letter, index)}
                                >
                                    <span className="sb-letter-on-flower">{letter}</span>
                                    <img src={flowerImg} alt="Flower" className="sb-flower-img" />
                                </div>
                            ))}

                            <div
                                className="sb-bee"
                                style={{
                                    left: beePos.left,
                                    top: beePos.top,
                                    transform: `translateX(-50%) ${isBeeMoving ? '' : 'scaleX(1)'}`
                                }}
                            >
                                <img src={beeImg} alt="Bee" className="sb-bee-img" />
                            </div>
                        </div>

                        <div className="sb-honey-pot">
                            <img src={honeyPotImg} alt="Honey Pot" className="sb-honey-img" style={{ transform: gameState === 'next_question' ? 'scale(1.2)' : 'scale(1)' }} />
                            <span className="sb-honey-count">Honey: {honeyCount}</span>
                        </div>
                    </div>

                    {gameState === 'next_question' && (
                        <div className="sb-overlay">
                            <div className="sb-overlay-content">
                                <img src={cakeImg} alt="Success" className="sb-success-img" />
                                <h2 className="sb-success-text">Great Job! The bee made honey! 🍯</h2>
                                <button className="game-btn-start" onClick={handleNextRound}>Next Level</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'win' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🎉 Garden Master! 🎉</h1>
                    <img src={honeyPotImg} alt="Winner" className="game-start-image" />
                    <p className="game-start-description">You helped the bee make lots of honey!</p>
                    <button className="game-btn-start" onClick={handleStart}>Play Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpellingBeeGarden;
