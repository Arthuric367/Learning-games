import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './BrainGamesLab.css';

const CALM_TARGET_ATTEMPTS = 10;
const SWITCH_TOTAL_ROUNDS = 12;
const OOPS_TOTAL_ROUNDS = 8;

const SHAPES = ['circle', 'square', 'triangle'];
const COLORS = ['red', 'blue', 'green', 'orange'];

const OOPS_PATTERNS = [
    {
        clue: 'Red, Blue, Red, ?',
        answer: 'Blue',
        options: ['Blue', 'Green', 'Orange']
    },
    {
        clue: 'Circle, Square, Circle, ?',
        answer: 'Square',
        options: ['Square', 'Triangle', 'Circle']
    },
    {
        clue: 'Big, Small, Big, ?',
        answer: 'Small',
        options: ['Small', 'Big', 'Tall']
    },
    {
        clue: 'Happy, Calm, Happy, ?',
        answer: 'Calm',
        options: ['Calm', 'Angry', 'Sleepy']
    },
    {
        clue: '1, 2, 1, ?',
        answer: '2',
        options: ['2', '3', '1']
    }
];

function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
    const next = [...list];
    for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
}

function makeSwitchRound(roundIndex, previousRuleType) {
    const forceSwitch = roundIndex > 0 && roundIndex % 3 === 0;
    const ruleType = forceSwitch
        ? (previousRuleType === 'color' ? 'shape' : 'color')
        : previousRuleType;

    const ruleValue = ruleType === 'color' ? randomFrom(COLORS) : randomFrom(SHAPES);

    const correct = {
        id: `ok-${roundIndex}`,
        color: ruleType === 'color' ? ruleValue : randomFrom(COLORS),
        shape: ruleType === 'shape' ? ruleValue : randomFrom(SHAPES)
    };

    const distractors = [];
    while (distractors.length < 2) {
        const candidate = {
            id: `bad-${roundIndex}-${distractors.length}`,
            color: randomFrom(COLORS),
            shape: randomFrom(SHAPES)
        };

        const isValid = ruleType === 'color'
            ? candidate.color !== ruleValue
            : candidate.shape !== ruleValue;

        if (isValid) {
            distractors.push(candidate);
        }
    }

    const choices = shuffle([correct, ...distractors]);

    return {
        ruleType,
        ruleValue,
        choices,
        correctId: correct.id
    };
}

const BrainGamesLab = ({ onBack }) => {
    const [view, setView] = useState('start');

    // Calm Game
    const [calmMeter, setCalmMeter] = useState(50);
    const [calmDirection, setCalmDirection] = useState(1);
    const [calmAttempts, setCalmAttempts] = useState(0);
    const [calmHits, setCalmHits] = useState(0);

    // Rule Switch Game
    const [switchRound, setSwitchRound] = useState(0);
    const [switchScore, setSwitchScore] = useState(0);
    const [switchMistakes, setSwitchMistakes] = useState(0);
    const [switchData, setSwitchData] = useState(() => makeSwitchRound(0, 'color'));

    // Oops-to-Fix Game
    const [oopsRound, setOopsRound] = useState(0);
    const [oopsScore, setOopsScore] = useState(0);
    const [oopsRecoveries, setOopsRecoveries] = useState(0);
    const [oopsHadWrongTry, setOopsHadWrongTry] = useState(false);
    const [oopsMessage, setOopsMessage] = useState('Find the best answer.');
    const [oopsPattern, setOopsPattern] = useState(() => randomFrom(OOPS_PATTERNS));

    const resetCalm = useCallback(() => {
        setCalmMeter(50);
        setCalmDirection(1);
        setCalmAttempts(0);
        setCalmHits(0);
    }, []);

    const resetSwitch = useCallback(() => {
        setSwitchRound(0);
        setSwitchScore(0);
        setSwitchMistakes(0);
        setSwitchData(makeSwitchRound(0, 'color'));
    }, []);

    const resetOops = useCallback(() => {
        setOopsRound(0);
        setOopsScore(0);
        setOopsRecoveries(0);
        setOopsHadWrongTry(false);
        setOopsMessage('Find the best answer.');
        setOopsPattern(randomFrom(OOPS_PATTERNS));
    }, []);

    useEffect(() => {
        if (view !== 'calm') {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setCalmMeter((prev) => {
                const next = prev + calmDirection * 4;
                if (next >= 100) {
                    setCalmDirection(-1);
                    return 100;
                }
                if (next <= 0) {
                    setCalmDirection(1);
                    return 0;
                }
                return next;
            });
        }, 80);

        return () => window.clearInterval(intervalId);
    }, [view, calmDirection]);

    const calmZoneClass = useMemo(() => {
        if (calmMeter >= 35 && calmMeter <= 65) {
            return 'in-zone';
        }
        return 'out-zone';
    }, [calmMeter]);

    const handleStartGame = (gameId) => {
        if (gameId === 'calm') {
            resetCalm();
            setView('calm');
            return;
        }

        if (gameId === 'switch') {
            resetSwitch();
            setView('switch');
            return;
        }

        resetOops();
        setView('oops');
    };

    const handleCalmTap = () => {
        if (calmAttempts >= CALM_TARGET_ATTEMPTS) {
            return;
        }

        const nextAttempts = calmAttempts + 1;
        const isHit = calmMeter >= 35 && calmMeter <= 65;

        setCalmAttempts(nextAttempts);
        if (isHit) {
            setCalmHits((prev) => prev + 1);
        }
    };

    const handleSwitchChoice = (choiceId) => {
        if (switchRound >= SWITCH_TOTAL_ROUNDS) {
            return;
        }

        const isCorrect = choiceId === switchData.correctId;
        const nextRound = switchRound + 1;

        if (isCorrect) {
            setSwitchScore((prev) => prev + 1);
        } else {
            setSwitchMistakes((prev) => prev + 1);
        }

        setSwitchRound(nextRound);

        if (nextRound < SWITCH_TOTAL_ROUNDS) {
            setSwitchData(makeSwitchRound(nextRound, switchData.ruleType));
        }
    };

    const handleOopsChoice = (choice) => {
        if (oopsRound >= OOPS_TOTAL_ROUNDS) {
            return;
        }

        if (choice === oopsPattern.answer) {
            setOopsScore((prev) => prev + 1);

            if (oopsHadWrongTry) {
                setOopsRecoveries((prev) => prev + 1);
            }

            const nextRound = oopsRound + 1;
            setOopsRound(nextRound);
            setOopsHadWrongTry(false);
            setOopsMessage('Great calm fix!');

            if (nextRound < OOPS_TOTAL_ROUNDS) {
                setOopsPattern(randomFrom(OOPS_PATTERNS));
            }
        } else {
            setOopsHadWrongTry(true);
            setOopsMessage('Nice try. Slow breath, then try again.');
        }
    };

    const calmFinished = calmAttempts >= CALM_TARGET_ATTEMPTS;
    const switchFinished = switchRound >= SWITCH_TOTAL_ROUNDS;
    const oopsFinished = oopsRound >= OOPS_TOTAL_ROUNDS;

    return (
        <div className="brain-lab-container">
            {view === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">Brain Games</h1>
                    <p className="game-start-description">
                        Age 6-8 emotional control games for calm body, flexible thinking, and safe recovery from mistakes.
                    </p>
                    <button className="game-btn-start" onClick={() => setView('hub')}>Enter Brain Lab</button>
                    <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                </div>
            )}

            {view === 'hub' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Pick a Brain Game</h2>
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>
                    <div className="brain-lab-grid">
                        <button className="brain-game-card" onClick={() => handleStartGame('calm')}>
                            <h3>1. Calm Light</h3>
                            <p>Tap while the meter is in the calm zone.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('switch')}>
                            <h3>2. Shape Switch</h3>
                            <p>Follow changing rules without getting upset.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('oops')}>
                            <h3>3. Oops to Fix</h3>
                            <p>Practice calm retries after mistakes.</p>
                        </button>
                    </div>
                </div>
            )}

            {view === 'calm' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Calm Light</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    <p className="brain-instruction">
                        Tap Breathe when the meter is inside the blue zone.
                    </p>

                    <div className="calm-track">
                        <div className="calm-zone" />
                        <div
                            className={`calm-dot ${calmZoneClass}`}
                            style={{ left: `${calmMeter}%` }}
                        />
                    </div>

                    <div className="brain-stats-row">
                        <span>Attempts: {calmAttempts}/{CALM_TARGET_ATTEMPTS}</span>
                        <span>Calm Hits: {calmHits}</span>
                    </div>

                    {!calmFinished && (
                        <button className="brain-action-btn" onClick={handleCalmTap}>Breathe</button>
                    )}

                    {calmFinished && (
                        <div className="brain-result">
                            <h3>Nice work</h3>
                            <p>Your calm score: {Math.round((calmHits / CALM_TARGET_ATTEMPTS) * 100)}%</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetCalm}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'switch' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Shape Switch</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!switchFinished && (
                        <>
                            <p className="brain-instruction">
                                Rule: Tap the one with <strong>{switchData.ruleType === 'color' ? 'color' : 'shape'}</strong> <strong>{switchData.ruleValue}</strong>
                            </p>

                            <div className="switch-choice-row">
                                {switchData.choices.map((choice) => (
                                    <button
                                        key={choice.id}
                                        className="switch-card"
                                        onClick={() => handleSwitchChoice(choice.id)}
                                    >
                                        <div className={`shape ${choice.shape} ${choice.color}`} />
                                        <span>{choice.color} {choice.shape}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {switchRound + 1}/{SWITCH_TOTAL_ROUNDS}</span>
                                <span>Score: {switchScore}</span>
                            </div>
                        </>
                    )}

                    {switchFinished && (
                        <div className="brain-result">
                            <h3>Great switching</h3>
                            <p>Correct: {switchScore} | Mistakes: {switchMistakes}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetSwitch}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'oops' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Oops to Fix</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!oopsFinished && (
                        <>
                            <p className="brain-instruction">Pattern: {oopsPattern.clue}</p>
                            <p className="oops-message">{oopsMessage}</p>

                            <div className="oops-options">
                                {oopsPattern.options.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleOopsChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {oopsRound + 1}/{OOPS_TOTAL_ROUNDS}</span>
                                <span>Calm recoveries: {oopsRecoveries}</span>
                            </div>
                        </>
                    )}

                    {oopsFinished && (
                        <div className="brain-result">
                            <h3>Strong recovery skills</h3>
                            <p>Correct: {oopsScore} | Calm recoveries: {oopsRecoveries}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetOops}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrainGamesLab;
