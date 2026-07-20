import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './BrainGamesLab.css';

const CALM_TARGET_ATTEMPTS = 10;
const SWITCH_TOTAL_ROUNDS = 12;
const OOPS_TOTAL_ROUNDS = 8;
const DELAY_TOTAL_ROUNDS = 6;
const EMOTION_TOTAL_ROUNDS = 8;
const LADDER_TOTAL_LEVELS = 6;
const BREATH_TOTAL_ROUNDS = 10;
const FOCUS_TOTAL_ROUNDS = 12;
const TURN_TOTAL_ROUNDS = 8;
const SEQUENCE_TOTAL_STEPS = 4;
const COLOR_TWINS_TOTAL_ROUNDS = 8;
const FLASH_TOTAL_ROUNDS = 8;
const FLASH_REVEAL_SECONDS = 3;
const COLOR_TRAIL_LENGTH = 3;
const COLOR_TRAIL_STEP_MS = 4000;
const GRID_HUNT_EASY_SIZE = 8;
const GRID_HUNT_ADV_SIZE = 10;
const GRID_HUNT_TOTAL_ROUNDS = 8;
const GRID_HUNT_EASY_SEQUENCE_LENGTH = 4;
const GRID_HUNT_ADV_SEQUENCE_LENGTH = 6;
const LETTER_GAME_TOTAL_ROUNDS = 8;
const LETTER_GAME_EASY_SIZE = 8;
const LETTER_GAME_ADV_SIZE = 10;
const NEW_TRACK_GAMES_ROUNDS = 6;
const LINE_MAZE_EASY_PATHS = 3;
const LINE_MAZE_ADV_PATHS = 5;
const MIRROR_EASY_GRID = 4;
const MIRROR_ADV_GRID = 5;
const MIRROR_EASY_SEQUENCE = 4;
const MIRROR_ADV_SEQUENCE = 6;
const TRAFFIC_EASY_STEPS = 8;
const TRAFFIC_ADV_STEPS = 10;
const TWIN_EASY_TARGET = 8;
const TWIN_ADV_TARGET = 12;
const BRAIN_PROGRESS_STORAGE_KEY = 'brain-games-progress-v1';

const SHAPES = ['circle', 'square', 'triangle'];
const COLORS = ['red', 'blue', 'green', 'orange'];
const TOUCH_COLORS = ['red', 'blue', 'green', 'orange', 'pink', 'purple'];
const TOUCH_COLOR_HEX = {
    red: '#ef5959',
    blue: '#3a84ff',
    green: '#37a95f',
    orange: '#ed9a2f',
    pink: '#f36bb4',
    purple: '#8e61e8'
};

const GRID_HUNT_SYMBOLS = [
    '😀', '😢', '😎', '😍', '🤔', '😴', '😡', '🤗',
    '🌸', '🌼', '🌻', '🍀', '⭐', '🌙', '☀️', '⚡',
    '⬆️', '⬇️', '⬅️', '➡️', '↗️', '↘️', '↙️', '↖️',
    '🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚪', '⚫',
    '❤️', '💙', '💚', '💛', '💜', '🧡', '🩷', '🩵',
    '🔺', '🔻', '🔷', '🔶', '🔸', '🔹', '🟪', '🟫',
    '🚗', '🚀', '✈️', '🚲', '🛶', '🏀', '⚽', '🎈',
    '🍎', '🍌', '🍇', '🍉', '🥕', '🌽', '🍓', '🥝'
];
const GRID_HUNT_EXTRA_SYMBOLS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
const GRID_HUNT_SYMBOL_POOL = [...GRID_HUNT_SYMBOLS, ...GRID_HUNT_EXTRA_SYMBOLS];
const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const LETTER_QUESTION_WORDS = [
    'write', 'pencil', 'animal', 'school', 'friend', 'family', 'teacher', 'book', 'paper', 'eraser',
    'ruler', 'backpack', 'lunch', 'water', 'bottle', 'window', 'table', 'chair', 'clock', 'homework',
    'lesson', 'number', 'letter', 'story', 'poem', 'music', 'dance', 'art', 'color', 'paint',
    'crayon', 'marker', 'glue', 'scissors', 'folder', 'notebook', 'library', 'garden', 'flower', 'tree',
    'grass', 'cloud', 'rain', 'sunny', 'wind', 'storm', 'snow', 'river', 'ocean', 'beach',
    'mountain', 'forest', 'bird', 'rabbit', 'turtle', 'puppy', 'kitten', 'horse', 'zebra', 'monkey',
    'elephant', 'giraffe', 'lion', 'tiger', 'bear', 'shark', 'whale', 'dolphin', 'apple', 'banana',
    'orange', 'grape', 'melon', 'carrot', 'tomato', 'potato', 'cookie', 'bread', 'butter', 'cheese',
    'yogurt', 'cereal', 'soup', 'pizza', 'pasta', 'breakfast', 'dinner', 'happy', 'calm', 'brave',
    'kind', 'share', 'smile', 'thank', 'sorry', 'please', 'listen', 'focus', 'breathe', 'pause',
    'jump', 'run', 'walk', 'stand', 'sit', 'clap', 'sing', 'play', 'learn', 'think',
    'dream', 'build', 'draw', 'count', 'shape', 'circle', 'square', 'triangle', 'star', 'arrow'
];

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

const EMOTION_SCENARIOS = [
    {
        prompt: 'Your block tower falls down.',
        answer: 'Take 2 slow breaths and rebuild.',
        options: ['Yell loudly', 'Take 2 slow breaths and rebuild.', 'Throw blocks']
    },
    {
        prompt: 'You lose one round in a game.',
        answer: 'Say: I can try again.',
        options: ['Quit and slam table', 'Say: I can try again.', 'Blame others']
    },
    {
        prompt: 'A friend chooses a different game.',
        answer: 'Use calm words and take turns.',
        options: ['Use calm words and take turns.', 'Grab the toy', 'Cry and stop playing']
    },
    {
        prompt: 'You feel very angry.',
        answer: 'Pause body, breathe in and out.',
        options: ['Run away shouting', 'Pause body, breathe in and out.', 'Hit pillow very hard']
    },
    {
        prompt: 'Homework feels hard.',
        answer: 'Ask for help calmly.',
        options: ['Tear the paper', 'Ask for help calmly.', 'Say I am bad at this']
    }
];

const TURN_SCENARIOS = [
    {
        prompt: 'Friend is using the puzzle pieces now.',
        answer: 'Wait and ask for a turn.',
        options: ['Grab pieces now', 'Wait and ask for a turn.', 'Shout loudly']
    },
    {
        prompt: 'Teacher says: Your turn after Mina.',
        answer: 'Say OK and wait calmly.',
        options: ['Say OK and wait calmly.', 'Run to front line', 'Refuse to play']
    },
    {
        prompt: 'You want the same toy as your sibling.',
        answer: 'Use timer and take turns.',
        options: ['Push sibling', 'Cry loudly', 'Use timer and take turns.']
    },
    {
        prompt: 'Board game says skip one turn.',
        answer: 'Take a breath and keep playing.',
        options: ['Throw the dice', 'Take a breath and keep playing.', 'Quit the game']
    }
];

const FOCUS_SIGNALS = [
    { kind: 'go', label: 'Green Turtle' },
    { kind: 'go', label: 'Blue Smile' },
    { kind: 'stop', label: 'Red Stop Sign' },
    { kind: 'stop', label: 'Sleeping Moon' }
];

const RESET_ROUTINE_STEPS = [
    'Stop body',
    'Take 2 breaths',
    'Use calm words',
    'Try again'
];

const DEFAULT_PROGRESS = {
    calmHistory: [],
    delayHistory: [],
    emotionHistory: [],
    ladderHistory: [],
    breathHistory: [],
    focusHistory: [],
    turnHistory: [],
    sequenceHistory: []
};

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

    let choices = shuffle([correct, ...distractors]);

    // Safety guard for rendering/data edge cases: always include one valid answer.
    if (!choices.some((item) => item.id === correct.id)) {
        choices = [correct, ...distractors];
    }

    return {
        ruleType,
        ruleValue,
        choices,
        correctId: correct.id
    };
}

function makeFocusSignal() {
    return randomFrom(FOCUS_SIGNALS);
}

function makeBreathPrompt() {
    return Math.random() < 0.5 ? 'Inhale' : 'Exhale';
}

function ladderConfig(level) {
    return {
        goal: 6 + level * 2,
        seconds: Math.max(3.5, 7 - level * 0.7)
    };
}

function makeSequenceOptions(stepIndex) {
    const correct = RESET_ROUTINE_STEPS[stepIndex];
    const distractors = shuffle(RESET_ROUTINE_STEPS.filter((item) => item !== correct)).slice(0, 2);
    return shuffle([correct, ...distractors]);
}

function colorHex(colorName) {
    return TOUCH_COLOR_HEX[colorName] || '#3a84ff';
}

function makeColorOptions(targetColor, optionCount = 3) {
    return shuffle([targetColor, ...shuffle(TOUCH_COLORS.filter((item) => item !== targetColor)).slice(0, optionCount - 1)]);
}

function makeColorTwinsRound(roundIndex) {
    const targetColor = randomFrom(TOUCH_COLORS);
    return {
        roundIndex,
        targetColor,
        leftOptions: makeColorOptions(targetColor),
        rightOptions: makeColorOptions(targetColor)
    };
}

function makeFlashRound(roundIndex) {
    const pool = SHAPES.flatMap((shape) => COLORS.map((color) => ({
        key: `${color}-${shape}`,
        shape,
        color
    })));
    const target = randomFrom(pool);
    const options = shuffle([target, ...shuffle(pool.filter((item) => item.key !== target.key)).slice(0, 5)]);
    return {
        roundIndex,
        target,
        options
    };
}

function makeColorTrailSequence(length) {
    return Array.from({ length }, () => randomFrom(TOUCH_COLORS));
}

function gridHuntConfig(advancedMode) {
    if (advancedMode) {
        return {
            size: GRID_HUNT_ADV_SIZE,
            sequenceLength: GRID_HUNT_ADV_SEQUENCE_LENGTH
        };
    }

    return {
        size: GRID_HUNT_EASY_SIZE,
        sequenceLength: GRID_HUNT_EASY_SEQUENCE_LENGTH
    };
}

function makeGridHuntRound(roundIndex, size, sequenceLength) {
    const totalCells = size * size;
    const symbols = shuffle(GRID_HUNT_SYMBOL_POOL);
    const cells = Array.from({ length: totalCells }, (_, index) => ({
        id: `g${roundIndex}-${index}`,
        symbol: symbols[index] || String(index + 1)
    }));
    const promptCells = shuffle(cells).slice(0, sequenceLength);

    return {
        roundIndex,
        cells,
        promptIds: promptCells.map((item) => item.id)
    };
}

function letterGameConfig(advancedMode) {
    return {
        size: advancedMode ? LETTER_GAME_ADV_SIZE : LETTER_GAME_EASY_SIZE
    };
}

function sampleLetterWords(count) {
    return shuffle(LETTER_QUESTION_WORDS).slice(0, count);
}

function makeLetterRound(word, roundIndex, size) {
    const totalCells = size * size;
    const toRandomCase = (value) => (Math.random() < 0.5 ? value.toUpperCase() : value.toLowerCase());
    const grid = Array.from({ length: totalCells }, () => toRandomCase(randomFrom(LETTERS)));
    const indexes = shuffle(Array.from({ length: totalCells }, (_, index) => index));

    word.toUpperCase().split('').forEach((char) => {
        const slot = indexes.pop();
        if (typeof slot === 'number') {
            grid[slot] = toRandomCase(char);
        }
    });

    return {
        roundIndex,
        word,
        cells: grid.map((letter, index) => ({
            id: `w${roundIndex}-${index}`,
            letter
        }))
    };
}

function lineMazeConfig(advancedMode) {
    return {
        pathCount: advancedMode ? LINE_MAZE_ADV_PATHS : LINE_MAZE_EASY_PATHS,
        tolerance: advancedMode ? 5 : 7
    };
}

function makeLinePoints() {
    const total = 6;
    const points = [];
    let y = 15 + Math.random() * 70;

    for (let i = 0; i < total; i++) {
        const x = 8 + (84 / (total - 1)) * i;
        if (i > 0) {
            y = Math.max(8, Math.min(92, y + (Math.random() * 36 - 18)));
        }
        points.push({ x, y });
    }

    return points;
}

function makeLineMazeRound(roundIndex, pathCount) {
    const target = makeLinePoints();
    const distractors = Array.from({ length: Math.max(1, pathCount - 1) }, () => makeLinePoints());
    return {
        roundIndex,
        target,
        distractors,
        start: target[0],
        end: target[target.length - 1]
    };
}

function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) {
        return Math.hypot(px - ax, py - ay);
    }

    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    return Math.hypot(px - cx, py - cy);
}

function polylineDistance(px, py, points) {
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        best = Math.min(best, pointSegmentDistance(px, py, a.x, a.y, b.x, b.y));
    }
    return best;
}

function polylineProgress(px, py, points) {
    const segmentLengths = [];
    let totalLen = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
        segmentLengths.push(len);
        totalLen += len;
    }

    if (totalLen === 0) {
        return 0;
    }

    let bestDist = Number.POSITIVE_INFINITY;
    let bestAlong = 0;
    let along = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const lenSq = dx * dx + dy * dy;
        const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / lenSq));
        const cx = a.x + t * dx;
        const cy = a.y + t * dy;
        const dist = Math.hypot(px - cx, py - cy);

        if (dist < bestDist) {
            bestDist = dist;
            bestAlong = along + t * segmentLengths[i];
        }
        along += segmentLengths[i];
    }

    return bestAlong / totalLen;
}

function pointsToPath(points) {
    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

function mirrorConfig(advancedMode) {
    return {
        size: advancedMode ? MIRROR_ADV_GRID : MIRROR_EASY_GRID,
        sequenceLength: advancedMode ? MIRROR_ADV_SEQUENCE : MIRROR_EASY_SEQUENCE
    };
}

function makeMirrorRound(roundIndex, size, sequenceLength) {
    const totalCells = size * size;
    const sequence = shuffle(Array.from({ length: totalCells }, (_, i) => i)).slice(0, sequenceLength);
    return {
        roundIndex,
        size,
        sequence
    };
}

function trafficConfig(advancedMode) {
    return {
        steps: advancedMode ? TRAFFIC_ADV_STEPS : TRAFFIC_EASY_STEPS
    };
}

function makeTrafficRound(roundIndex, steps) {
    const signals = Array.from({ length: steps }, () => (Math.random() < 0.55 ? 'go' : 'stop'));
    return {
        roundIndex,
        signals
    };
}

function twinConfig(advancedMode) {
    return {
        target: advancedMode ? TWIN_ADV_TARGET : TWIN_EASY_TARGET
    };
}

function loadProgress() {
    try {
        const raw = window.localStorage.getItem(BRAIN_PROGRESS_STORAGE_KEY);
        if (!raw) return DEFAULT_PROGRESS;
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_PROGRESS,
            ...parsed,
            calmHistory: Array.isArray(parsed?.calmHistory) ? parsed.calmHistory : [],
            delayHistory: Array.isArray(parsed?.delayHistory) ? parsed.delayHistory : [],
            emotionHistory: Array.isArray(parsed?.emotionHistory) ? parsed.emotionHistory : [],
            ladderHistory: Array.isArray(parsed?.ladderHistory) ? parsed.ladderHistory : [],
            breathHistory: Array.isArray(parsed?.breathHistory) ? parsed.breathHistory : [],
            focusHistory: Array.isArray(parsed?.focusHistory) ? parsed.focusHistory : [],
            turnHistory: Array.isArray(parsed?.turnHistory) ? parsed.turnHistory : [],
            sequenceHistory: Array.isArray(parsed?.sequenceHistory) ? parsed.sequenceHistory : []
        };
    } catch (error) {
        return DEFAULT_PROGRESS;
    }
}

function saveProgress(nextProgress) {
    try {
        window.localStorage.setItem(BRAIN_PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
    } catch (error) {
        // Ignore storage write failures to keep gameplay uninterrupted.
    }
}

function shapeStyle(shape, color) {
    const palette = {
        red: '#ef5959',
        blue: '#3a84ff',
        green: '#37a95f',
        orange: '#ed9a2f'
    };

    const fill = palette[color] || '#3a84ff';

    if (shape === 'triangle') {
        return {
            width: 0,
            height: 0,
            borderLeft: '34px solid transparent',
            borderRight: '34px solid transparent',
            borderBottom: `66px solid ${fill}`
        };
    }

    if (shape === 'square') {
        return {
            width: '66px',
            height: '66px',
            borderRadius: '8px',
            background: fill
        };
    }

    return {
        width: '66px',
        height: '66px',
        borderRadius: '50%',
        background: fill
    };
}

const BrainGamesLab = ({ onBack }) => {
    const [view, setView] = useState('start');

    // Calm Game
    const [calmMeter, setCalmMeter] = useState(50);
    const [calmDirection, setCalmDirection] = useState(1);
    const [calmAttempts, setCalmAttempts] = useState(0);
    const [calmHits, setCalmHits] = useState(0);
    const [calmSaved, setCalmSaved] = useState(false);

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

    // Delay Treasure Game
    const [delayRound, setDelayRound] = useState(0);
    const [delayScore, setDelayScore] = useState(0);
    const [delayTimer, setDelayTimer] = useState(4);
    const [delayWaiting, setDelayWaiting] = useState(false);
    const [delaySaved, setDelaySaved] = useState(false);

    // Emotion Coach Game
    const [emotionRound, setEmotionRound] = useState(0);
    const [emotionScore, setEmotionScore] = useState(0);
    const [emotionSaved, setEmotionSaved] = useState(false);
    const [emotionScenario, setEmotionScenario] = useState(() => randomFrom(EMOTION_SCENARIOS));

    // Frustration Ladder Game
    const [ladderLevel, setLadderLevel] = useState(0);
    const [ladderGoal, setLadderGoal] = useState(ladderConfig(0).goal);
    const [ladderTaps, setLadderTaps] = useState(0);
    const [ladderTimeLeft, setLadderTimeLeft] = useState(ladderConfig(0).seconds);
    const [ladderStatus, setLadderStatus] = useState('ready'); // ready, playing, failed, levelComplete, finished
    const [ladderResets, setLadderResets] = useState(0);
    const [ladderSaved, setLadderSaved] = useState(false);

    // Breath Bridge Game
    const [breathRound, setBreathRound] = useState(0);
    const [breathScore, setBreathScore] = useState(0);
    const [breathPrompt, setBreathPrompt] = useState(() => makeBreathPrompt());
    const [breathSaved, setBreathSaved] = useState(false);

    // Focus Freeze Game
    const [focusRound, setFocusRound] = useState(0);
    const [focusScore, setFocusScore] = useState(0);
    const [focusSignal, setFocusSignal] = useState(() => makeFocusSignal());
    const [focusSaved, setFocusSaved] = useState(false);

    // Turn Taking Builder Game
    const [turnRound, setTurnRound] = useState(0);
    const [turnScore, setTurnScore] = useState(0);
    const [turnScenario, setTurnScenario] = useState(() => randomFrom(TURN_SCENARIOS));
    const [turnSaved, setTurnSaved] = useState(false);

    // Reset Routine Game
    const [sequenceStep, setSequenceStep] = useState(0);
    const [sequenceScore, setSequenceScore] = useState(0);
    const [sequenceMessage, setSequenceMessage] = useState('Pick the first calm step.');
    const [sequenceOptions, setSequenceOptions] = useState(() => makeSequenceOptions(0));
    const [sequenceSaved, setSequenceSaved] = useState(false);

    // Color Twins Tap Game
    const [twinsRound, setTwinsRound] = useState(0);
    const [twinsScore, setTwinsScore] = useState(0);
    const [twinsLeftPick, setTwinsLeftPick] = useState(null);
    const [twinsRightPick, setTwinsRightPick] = useState(null);
    const [twinsMessage, setTwinsMessage] = useState('Pick the target color on both sides.');
    const [twinsData, setTwinsData] = useState(() => makeColorTwinsRound(0));

    // Flash Memory Match Game
    const [flashRound, setFlashRound] = useState(0);
    const [flashScore, setFlashScore] = useState(0);
    const [flashReveal, setFlashReveal] = useState(true);
    const [flashRevealSeconds, setFlashRevealSeconds] = useState(FLASH_REVEAL_SECONDS);
    const [flashData, setFlashData] = useState(() => makeFlashRound(0));

    // Color Trail Echo Game
    const [trailSequence, setTrailSequence] = useState(() => makeColorTrailSequence(COLOR_TRAIL_LENGTH));
    const [trailShowIndex, setTrailShowIndex] = useState(0);
    const [trailShowing, setTrailShowing] = useState(true);
    const [trailStep, setTrailStep] = useState(0);
    const [trailMessage, setTrailMessage] = useState('Watch the color trail, then repeat it.');

    // Grid Sequence Hunt Game
    const [gridHuntAdvanced, setGridHuntAdvanced] = useState(false);
    const [gridHuntRound, setGridHuntRound] = useState(0);
    const [gridHuntScore, setGridHuntScore] = useState(0);
    const [gridHuntStep, setGridHuntStep] = useState(0);
    const [gridHuntMessage, setGridHuntMessage] = useState('Tap the symbols in the exact order shown below.');
    const [gridHuntTappedIds, setGridHuntTappedIds] = useState([]);
    const [gridHuntData, setGridHuntData] = useState(() => makeGridHuntRound(0, GRID_HUNT_EASY_SIZE, GRID_HUNT_EASY_SEQUENCE_LENGTH));

    const activeGridHuntConfig = useMemo(() => gridHuntConfig(gridHuntAdvanced), [gridHuntAdvanced]);

    // Letter Path Builder Game
    const initialLetterWords = useMemo(() => sampleLetterWords(LETTER_GAME_TOTAL_ROUNDS), []);
    const [letterGameAdvanced, setLetterGameAdvanced] = useState(false);
    const [letterWords, setLetterWords] = useState(initialLetterWords);
    const [letterRound, setLetterRound] = useState(0);
    const [letterScore, setLetterScore] = useState(0);
    const [letterStep, setLetterStep] = useState(0);
    const [letterTappedIds, setLetterTappedIds] = useState([]);
    const [letterMessage, setLetterMessage] = useState('Tap the letters in order to build the word.');
    const [letterData, setLetterData] = useState(() => makeLetterRound(initialLetterWords[0] || 'write', 0, LETTER_GAME_EASY_SIZE));

    const activeLetterGameConfig = useMemo(() => letterGameConfig(letterGameAdvanced), [letterGameAdvanced]);

    // Line Maze Runner Game
    const [lineMazeAdvanced, setLineMazeAdvanced] = useState(false);
    const [lineMazeRound, setLineMazeRound] = useState(0);
    const [lineMazeScore, setLineMazeScore] = useState(0);
    const [lineMazeTracing, setLineMazeTracing] = useState(false);
    const [lineMazeProgress, setLineMazeProgress] = useState(0);
    const [lineMazeMessage, setLineMazeMessage] = useState('Hold start and trace the correct line to the end.');
    const [lineMazeData, setLineMazeData] = useState(() => makeLineMazeRound(0, LINE_MAZE_EASY_PATHS));
    const activeLineMazeConfig = useMemo(() => lineMazeConfig(lineMazeAdvanced), [lineMazeAdvanced]);

    // Mirror Path Copy Game
    const [mirrorAdvanced, setMirrorAdvanced] = useState(false);
    const [mirrorRound, setMirrorRound] = useState(0);
    const [mirrorScore, setMirrorScore] = useState(0);
    const [mirrorStep, setMirrorStep] = useState(0);
    const [mirrorShowing, setMirrorShowing] = useState(true);
    const [mirrorShowIndex, setMirrorShowIndex] = useState(0);
    const [mirrorMessage, setMirrorMessage] = useState('Watch the path, then tap the same points in order.');
    const [mirrorData, setMirrorData] = useState(() => makeMirrorRound(0, MIRROR_EASY_GRID, MIRROR_EASY_SEQUENCE));
    const activeMirrorConfig = useMemo(() => mirrorConfig(mirrorAdvanced), [mirrorAdvanced]);

    // Traffic Light Trail Game
    const [trafficAdvanced, setTrafficAdvanced] = useState(false);
    const [trafficRound, setTrafficRound] = useState(0);
    const [trafficScore, setTrafficScore] = useState(0);
    const [trafficStep, setTrafficStep] = useState(0);
    const [trafficProgress, setTrafficProgress] = useState(0);
    const [trafficMessage, setTrafficMessage] = useState('Move on green, wait on red to stay on track.');
    const [trafficData, setTrafficData] = useState(() => makeTrafficRound(0, TRAFFIC_EASY_STEPS));
    const activeTrafficConfig = useMemo(() => trafficConfig(trafficAdvanced), [trafficAdvanced]);

    // Twin Finger Track Game
    const [twinAdvanced, setTwinAdvanced] = useState(false);
    const [twinRound, setTwinRound] = useState(0);
    const [twinScore, setTwinScore] = useState(0);
    const [twinLeft, setTwinLeft] = useState(0);
    const [twinRight, setTwinRight] = useState(0);
    const [twinExpected, setTwinExpected] = useState('left');
    const [twinMessage, setTwinMessage] = useState('Alternate Left and Right taps to move both tracks.');
    const activeTwinConfig = useMemo(() => twinConfig(twinAdvanced), [twinAdvanced]);

    const [progress, setProgress] = useState(() => loadProgress());

    const addProgressEntry = useCallback((bucket, entry) => {
        setProgress((prev) => {
            const next = {
                ...prev,
                [bucket]: [entry, ...(prev[bucket] || [])].slice(0, 20)
            };
            saveProgress(next);
            return next;
        });
    }, []);

    const resetCalm = useCallback(() => {
        setCalmMeter(50);
        setCalmDirection(1);
        setCalmAttempts(0);
        setCalmHits(0);
        setCalmSaved(false);
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

    const resetDelay = useCallback(() => {
        setDelayRound(0);
        setDelayScore(0);
        setDelayTimer(4);
        setDelayWaiting(false);
        setDelaySaved(false);
    }, []);

    const resetEmotion = useCallback(() => {
        setEmotionRound(0);
        setEmotionScore(0);
        setEmotionSaved(false);
        setEmotionScenario(randomFrom(EMOTION_SCENARIOS));
    }, []);

    const resetLadder = useCallback(() => {
        const base = ladderConfig(0);
        setLadderLevel(0);
        setLadderGoal(base.goal);
        setLadderTaps(0);
        setLadderTimeLeft(base.seconds);
        setLadderStatus('ready');
        setLadderResets(0);
        setLadderSaved(false);
    }, []);

    const resetBreath = useCallback(() => {
        setBreathRound(0);
        setBreathScore(0);
        setBreathPrompt(makeBreathPrompt());
        setBreathSaved(false);
    }, []);

    const resetFocus = useCallback(() => {
        setFocusRound(0);
        setFocusScore(0);
        setFocusSignal(makeFocusSignal());
        setFocusSaved(false);
    }, []);

    const resetTurn = useCallback(() => {
        setTurnRound(0);
        setTurnScore(0);
        setTurnScenario(randomFrom(TURN_SCENARIOS));
        setTurnSaved(false);
    }, []);

    const resetSequence = useCallback(() => {
        setSequenceStep(0);
        setSequenceScore(0);
        setSequenceMessage('Pick the first calm step.');
        setSequenceOptions(makeSequenceOptions(0));
        setSequenceSaved(false);
    }, []);

    const resetTwins = useCallback(() => {
        setTwinsRound(0);
        setTwinsScore(0);
        setTwinsLeftPick(null);
        setTwinsRightPick(null);
        setTwinsMessage('Pick the target color on both sides.');
        setTwinsData(makeColorTwinsRound(0));
    }, []);

    const resetFlash = useCallback(() => {
        setFlashRound(0);
        setFlashScore(0);
        setFlashReveal(true);
        setFlashRevealSeconds(FLASH_REVEAL_SECONDS);
        setFlashData(makeFlashRound(0));
    }, []);

    const resetTrail = useCallback(() => {
        setTrailSequence(makeColorTrailSequence(COLOR_TRAIL_LENGTH));
        setTrailShowIndex(0);
        setTrailShowing(true);
        setTrailStep(0);
        setTrailMessage('Watch the color trail, then repeat it.');
    }, []);

    const resetGridHunt = useCallback((advancedMode = gridHuntAdvanced) => {
        const cfg = gridHuntConfig(advancedMode);
        setGridHuntRound(0);
        setGridHuntScore(0);
        setGridHuntStep(0);
        setGridHuntMessage('Tap the symbols in the exact order shown below.');
        setGridHuntTappedIds([]);
        setGridHuntData(makeGridHuntRound(0, cfg.size, cfg.sequenceLength));
    }, [gridHuntAdvanced]);

    const resetLetterGame = useCallback((advancedMode = letterGameAdvanced) => {
        const cfg = letterGameConfig(advancedMode);
        const nextWords = sampleLetterWords(LETTER_GAME_TOTAL_ROUNDS);

        setLetterWords(nextWords);
        setLetterRound(0);
        setLetterScore(0);
        setLetterStep(0);
        setLetterTappedIds([]);
        setLetterMessage('Tap the letters in order to build the word.');
        setLetterData(makeLetterRound(nextWords[0] || 'write', 0, cfg.size));
    }, [letterGameAdvanced]);

    const resetLineMaze = useCallback((advancedMode = lineMazeAdvanced) => {
        const cfg = lineMazeConfig(advancedMode);
        setLineMazeRound(0);
        setLineMazeScore(0);
        setLineMazeTracing(false);
        setLineMazeProgress(0);
        setLineMazeMessage('Hold start and trace the correct line to the end.');
        setLineMazeData(makeLineMazeRound(0, cfg.pathCount));
    }, [lineMazeAdvanced]);

    const resetMirror = useCallback((advancedMode = mirrorAdvanced) => {
        const cfg = mirrorConfig(advancedMode);
        setMirrorRound(0);
        setMirrorScore(0);
        setMirrorStep(0);
        setMirrorShowing(true);
        setMirrorShowIndex(0);
        setMirrorMessage('Watch the path, then tap the same points in order.');
        setMirrorData(makeMirrorRound(0, cfg.size, cfg.sequenceLength));
    }, [mirrorAdvanced]);

    const resetTraffic = useCallback((advancedMode = trafficAdvanced) => {
        const cfg = trafficConfig(advancedMode);
        setTrafficRound(0);
        setTrafficScore(0);
        setTrafficStep(0);
        setTrafficProgress(0);
        setTrafficMessage('Move on green, wait on red to stay on track.');
        setTrafficData(makeTrafficRound(0, cfg.steps));
    }, [trafficAdvanced]);

    const resetTwin = useCallback(() => {
        setTwinRound(0);
        setTwinScore(0);
        setTwinLeft(0);
        setTwinRight(0);
        setTwinExpected('left');
        setTwinMessage('Alternate Left and Right taps to move both tracks.');
    }, []);

    const startLadderLevel = useCallback((extraSeconds = 0) => {
        const cfg = ladderConfig(ladderLevel);
        setLadderGoal(cfg.goal);
        setLadderTaps(0);
        setLadderTimeLeft(cfg.seconds + extraSeconds);
        setLadderStatus('playing');
    }, [ladderLevel]);

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

    useEffect(() => {
        if (view !== 'delay' || !delayWaiting) {
            return undefined;
        }

        const id = window.setInterval(() => {
            setDelayTimer((prev) => {
                if (prev <= 1) {
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(id);
    }, [view, delayWaiting]);

    useEffect(() => {
        if (view !== 'ladder' || ladderStatus !== 'playing') {
            return undefined;
        }

        const id = window.setInterval(() => {
            setLadderTimeLeft((prev) => {
                if (prev <= 0.1) {
                    setLadderStatus('failed');
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => window.clearInterval(id);
    }, [view, ladderStatus]);

    useEffect(() => {
        if (view !== 'flash' || !flashReveal || flashRound >= FLASH_TOTAL_ROUNDS) {
            return undefined;
        }

        const id = window.setInterval(() => {
            setFlashRevealSeconds((prev) => {
                if (prev <= 1) {
                    setFlashReveal(false);
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(id);
    }, [view, flashReveal, flashRound]);

    useEffect(() => {
        if (view !== 'trail' || !trailShowing) {
            return undefined;
        }

        if (trailShowIndex >= trailSequence.length) {
            setTrailShowing(false);
            setTrailMessage('Now repeat the same color order.');
            return undefined;
        }

        const id = window.setTimeout(() => {
            setTrailShowIndex((prev) => prev + 1);
        }, COLOR_TRAIL_STEP_MS);

        return () => window.clearTimeout(id);
    }, [view, trailShowing, trailShowIndex, trailSequence]);

    useEffect(() => {
        if (view !== 'mirror' || !mirrorShowing) {
            return undefined;
        }

        if (mirrorShowIndex >= mirrorData.sequence.length) {
            setMirrorShowing(false);
            setMirrorMessage('Now copy the same path by tapping in order.');
            return undefined;
        }

        const id = window.setTimeout(() => {
            setMirrorShowIndex((prev) => prev + 1);
        }, 650);

        return () => window.clearTimeout(id);
    }, [view, mirrorShowing, mirrorShowIndex, mirrorData.sequence]);

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

        if (gameId === 'delay') {
            resetDelay();
            setView('delay');
            return;
        }

        if (gameId === 'emotion') {
            resetEmotion();
            setView('emotion');
            return;
        }

        if (gameId === 'ladder') {
            resetLadder();
            setView('ladder');
            return;
        }

        if (gameId === 'breath') {
            resetBreath();
            setView('breath');
            return;
        }

        if (gameId === 'focus') {
            resetFocus();
            setView('focus');
            return;
        }

        if (gameId === 'turn') {
            resetTurn();
            setView('turn');
            return;
        }

        if (gameId === 'sequence') {
            resetSequence();
            setView('sequence');
            return;
        }

        if (gameId === 'twins') {
            resetTwins();
            setView('twins');
            return;
        }

        if (gameId === 'flash') {
            resetFlash();
            setView('flash');
            return;
        }

        if (gameId === 'trail') {
            resetTrail();
            setView('trail');
            return;
        }

        if (gameId === 'grid-hunt') {
            resetGridHunt();
            setView('grid-hunt');
            return;
        }

        if (gameId === 'letter-path') {
            resetLetterGame();
            setView('letter-path');
            return;
        }

        if (gameId === 'line-maze') {
            resetLineMaze();
            setView('line-maze');
            return;
        }

        if (gameId === 'mirror') {
            resetMirror();
            setView('mirror');
            return;
        }

        if (gameId === 'traffic-trail') {
            resetTraffic();
            setView('traffic-trail');
            return;
        }

        if (gameId === 'twin-track') {
            resetTwin();
            setView('twin-track');
            return;
        }

        if (gameId === 'oops') {
            resetOops();
            setView('oops');
        }
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

    const handleDelayWait = () => {
        if (delayWaiting || delayRound >= DELAY_TOTAL_ROUNDS) {
            return;
        }
        setDelayTimer(4);
        setDelayWaiting(true);
    };

    const handleDelayClaim = () => {
        if (delayRound >= DELAY_TOTAL_ROUNDS) {
            return;
        }

        const waitedLongEnough = delayWaiting && delayTimer === 0;
        const gained = waitedLongEnough ? 3 : 1;
        const nextRound = delayRound + 1;

        setDelayScore((prev) => prev + gained);
        setDelayRound(nextRound);
        setDelayWaiting(false);
        setDelayTimer(4);
    };

    const handleEmotionChoice = (choice) => {
        if (emotionRound >= EMOTION_TOTAL_ROUNDS) {
            return;
        }

        const isCorrect = choice === emotionScenario.answer;
        const nextRound = emotionRound + 1;

        if (isCorrect) {
            setEmotionScore((prev) => prev + 1);
        }

        setEmotionRound(nextRound);

        if (nextRound < EMOTION_TOTAL_ROUNDS) {
            setEmotionScenario(randomFrom(EMOTION_SCENARIOS));
        }
    };

    const handleLadderTap = () => {
        if (ladderStatus !== 'playing') {
            return;
        }

        setLadderTaps((prev) => {
            const next = prev + 1;
            if (next >= ladderGoal) {
                setLadderStatus('levelComplete');
            }
            return next;
        });
    };

    const handleLadderCalmReset = () => {
        if (ladderStatus !== 'failed') {
            return;
        }
        setLadderResets((prev) => prev + 1);
        startLadderLevel(1);
    };

    const handleLadderNext = () => {
        if (ladderStatus !== 'levelComplete') {
            return;
        }

        const nextLevel = ladderLevel + 1;
        if (nextLevel >= LADDER_TOTAL_LEVELS) {
            setLadderLevel(nextLevel);
            setLadderStatus('finished');
            return;
        }

        const cfg = ladderConfig(nextLevel);
        setLadderLevel(nextLevel);
        setLadderGoal(cfg.goal);
        setLadderTaps(0);
        setLadderTimeLeft(cfg.seconds);
        setLadderStatus('ready');
    };

    const handleBreathChoice = (choice) => {
        if (breathRound >= BREATH_TOTAL_ROUNDS) {
            return;
        }

        if (choice === breathPrompt) {
            setBreathScore((prev) => prev + 1);
        }

        const nextRound = breathRound + 1;
        setBreathRound(nextRound);

        if (nextRound < BREATH_TOTAL_ROUNDS) {
            setBreathPrompt(makeBreathPrompt());
        }
    };

    const handleFocusChoice = (choice) => {
        if (focusRound >= FOCUS_TOTAL_ROUNDS) {
            return;
        }

        const shouldTap = focusSignal.kind === 'go';
        const isCorrect = (choice === 'tap' && shouldTap) || (choice === 'wait' && !shouldTap);
        if (isCorrect) {
            setFocusScore((prev) => prev + 1);
        }

        const nextRound = focusRound + 1;
        setFocusRound(nextRound);

        if (nextRound < FOCUS_TOTAL_ROUNDS) {
            setFocusSignal(makeFocusSignal());
        }
    };

    const handleTurnChoice = (choice) => {
        if (turnRound >= TURN_TOTAL_ROUNDS) {
            return;
        }

        if (choice === turnScenario.answer) {
            setTurnScore((prev) => prev + 1);
        }

        const nextRound = turnRound + 1;
        setTurnRound(nextRound);

        if (nextRound < TURN_TOTAL_ROUNDS) {
            setTurnScenario(randomFrom(TURN_SCENARIOS));
        }
    };

    const handleSequenceChoice = (choice) => {
        if (sequenceStep >= SEQUENCE_TOTAL_STEPS) {
            return;
        }

        const expected = RESET_ROUTINE_STEPS[sequenceStep];
        if (choice === expected) {
            const nextStep = sequenceStep + 1;
            setSequenceScore((prev) => prev + 1);
            setSequenceStep(nextStep);

            if (nextStep >= SEQUENCE_TOTAL_STEPS) {
                setSequenceMessage('Routine complete. Great self-control!');
                return;
            }

            setSequenceOptions(makeSequenceOptions(nextStep));
            setSequenceMessage(`Great. Now pick step ${nextStep + 1}.`);
            return;
        }

        setSequenceOptions(makeSequenceOptions(sequenceStep));
        setSequenceMessage('Close. Pause and choose the calm step.');
    };

    const handleTwinsPick = (side, colorName) => {
        if (twinsRound >= COLOR_TWINS_TOTAL_ROUNDS) {
            return;
        }

        const nextLeft = side === 'left' ? colorName : twinsLeftPick;
        const nextRight = side === 'right' ? colorName : twinsRightPick;

        if (side === 'left') {
            setTwinsLeftPick(colorName);
        } else {
            setTwinsRightPick(colorName);
        }

        if (!nextLeft || !nextRight) {
            return;
        }

        const isCorrect = nextLeft === twinsData.targetColor && nextRight === twinsData.targetColor;
        const nextRound = twinsRound + 1;

        if (isCorrect) {
            setTwinsScore((prev) => prev + 1);
            setTwinsMessage('Great match. Calm hands, calm brain.');
        } else {
            setTwinsMessage('Nice try. Slow breath and match again.');
        }

        setTwinsRound(nextRound);
        setTwinsLeftPick(null);
        setTwinsRightPick(null);

        if (nextRound < COLOR_TWINS_TOTAL_ROUNDS) {
            setTwinsData(makeColorTwinsRound(nextRound));
        }
    };

    const handleFlashChoice = (choiceKey) => {
        if (flashRound >= FLASH_TOTAL_ROUNDS || flashReveal) {
            return;
        }

        const isCorrect = choiceKey === flashData.target.key;
        const nextRound = flashRound + 1;

        if (isCorrect) {
            setFlashScore((prev) => prev + 1);
        }

        setFlashRound(nextRound);

        if (nextRound < FLASH_TOTAL_ROUNDS) {
            setFlashData(makeFlashRound(nextRound));
            setFlashReveal(true);
            setFlashRevealSeconds(FLASH_REVEAL_SECONDS);
        }
    };

    const handleTrailTap = (colorName) => {
        if (trailShowing || trailStep >= COLOR_TRAIL_LENGTH) {
            return;
        }

        const expected = trailSequence[trailStep];
        if (colorName === expected) {
            const nextStep = trailStep + 1;
            setTrailStep(nextStep);

            if (nextStep >= COLOR_TRAIL_LENGTH) {
                setTrailMessage('Memory trail complete. Excellent focus.');
                return;
            }

            setTrailMessage(`Nice. Keep going (${nextStep}/${COLOR_TRAIL_LENGTH}).`);
            return;
        }

        setTrailStep(0);
        setTrailShowIndex(0);
        setTrailShowing(true);
        setTrailMessage('Oops. Breathe and replay the trail.');
    };

    const handleGridHuntTap = (cellId) => {
        if (gridHuntRound >= GRID_HUNT_TOTAL_ROUNDS) {
            return;
        }

        const expectedId = gridHuntData.promptIds[gridHuntStep];
        if (cellId === expectedId) {
            const nextStep = gridHuntStep + 1;
            const nextTapped = [...gridHuntTappedIds, cellId];
            setGridHuntStep(nextStep);
            setGridHuntTappedIds(nextTapped);

            if (nextStep >= activeGridHuntConfig.sequenceLength) {
                const nextRound = gridHuntRound + 1;
                setGridHuntScore((prev) => prev + 1);
                setGridHuntMessage('Great sequence. Calm focus and continue.');
                setGridHuntRound(nextRound);
                setGridHuntStep(0);
                setGridHuntTappedIds([]);

                if (nextRound < GRID_HUNT_TOTAL_ROUNDS) {
                    setGridHuntData(makeGridHuntRound(nextRound, activeGridHuntConfig.size, activeGridHuntConfig.sequenceLength));
                }
                return;
            }

            setGridHuntMessage(`Good. Step ${nextStep + 1} next.`);
            return;
        }

        // Calm mode: mistakes restart the current sequence without penalty.
        setGridHuntStep(0);
        setGridHuntTappedIds([]);
        setGridHuntMessage('Oops. Slow breath and retry from step 1.');
    };

    const handleGridHuntModeToggle = () => {
        const nextAdvanced = !gridHuntAdvanced;
        setGridHuntAdvanced(nextAdvanced);
        resetGridHunt(nextAdvanced);
    };

    const handleLetterTap = (cellId, letter) => {
        if (letterRound >= LETTER_GAME_TOTAL_ROUNDS) {
            return;
        }

        const currentWord = (letterWords[letterRound] || '').toUpperCase();
        const expected = currentWord[letterStep];

        if (letter.toUpperCase() === expected) {
            const nextStep = letterStep + 1;
            setLetterStep(nextStep);
            setLetterTappedIds((prev) => [...prev, cellId]);

            if (nextStep >= currentWord.length) {
                const nextRound = letterRound + 1;
                setLetterScore((prev) => prev + 1);
                setLetterMessage('Great spelling. Calm mind, next word.');
                setLetterRound(nextRound);
                setLetterStep(0);
                setLetterTappedIds([]);

                if (nextRound < LETTER_GAME_TOTAL_ROUNDS) {
                    const nextWord = letterWords[nextRound] || 'write';
                    setLetterData(makeLetterRound(nextWord, nextRound, activeLetterGameConfig.size));
                }

                return;
            }

            setLetterMessage(`Good. Next letter: step ${nextStep + 1}.`);
            return;
        }

        // Calm mode retry: restart only the current word attempt.
        setLetterStep(0);
        setLetterTappedIds([]);
        setLetterMessage('Oops. Take one breath and start this word again.');
    };

    const handleLetterModeToggle = () => {
        const nextAdvanced = !letterGameAdvanced;
        setLetterGameAdvanced(nextAdvanced);
        resetLetterGame(nextAdvanced);
    };

    const getSvgPoint = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        return { x, y };
    };

    const handleLineMazeDown = (event) => {
        if (lineMazeRound >= NEW_TRACK_GAMES_ROUNDS) {
            return;
        }

        const point = getSvgPoint(event);
        const distToStart = Math.hypot(point.x - lineMazeData.start.x, point.y - lineMazeData.start.y);
        if (distToStart <= 8) {
            setLineMazeTracing(true);
            setLineMazeProgress(0);
            setLineMazeMessage('Great start. Keep tracing to the finish.');
        }
    };

    const handleLineMazeMove = (event) => {
        if (!lineMazeTracing || lineMazeRound >= NEW_TRACK_GAMES_ROUNDS) {
            return;
        }

        const point = getSvgPoint(event);
        const distTarget = polylineDistance(point.x, point.y, lineMazeData.target);
        const closestDistractor = Math.min(...lineMazeData.distractors.map((line) => polylineDistance(point.x, point.y, line)));

        if (distTarget > activeLineMazeConfig.tolerance || closestDistractor + 1 < distTarget) {
            setLineMazeTracing(false);
            setLineMazeProgress(0);
            setLineMazeMessage('Wrong track. Breathe and start again from the green dot.');
            return;
        }

        const progress = polylineProgress(point.x, point.y, lineMazeData.target);
        setLineMazeProgress((prev) => Math.max(prev, progress));

        const distToEnd = Math.hypot(point.x - lineMazeData.end.x, point.y - lineMazeData.end.y);
        if (progress >= 0.95 && distToEnd <= 8) {
            const nextRound = lineMazeRound + 1;
            setLineMazeScore((prev) => prev + 1);
            setLineMazeRound(nextRound);
            setLineMazeTracing(false);
            setLineMazeProgress(0);
            setLineMazeMessage('Nice tracing. Calm eyes, next maze.');

            if (nextRound < NEW_TRACK_GAMES_ROUNDS) {
                setLineMazeData(makeLineMazeRound(nextRound, activeLineMazeConfig.pathCount));
            }
        }
    };

    const handleLineMazeUp = () => {
        if (lineMazeTracing) {
            setLineMazeTracing(false);
        }
    };

    const handleLineMazeModeToggle = () => {
        const nextAdvanced = !lineMazeAdvanced;
        setLineMazeAdvanced(nextAdvanced);
        resetLineMaze(nextAdvanced);
    };

    const handleMirrorTap = (cellIndex) => {
        if (mirrorRound >= NEW_TRACK_GAMES_ROUNDS || mirrorShowing) {
            return;
        }

        const expected = mirrorData.sequence[mirrorStep];
        if (cellIndex === expected) {
            const nextStep = mirrorStep + 1;
            setMirrorStep(nextStep);

            if (nextStep >= mirrorData.sequence.length) {
                const nextRound = mirrorRound + 1;
                setMirrorScore((prev) => prev + 1);
                setMirrorRound(nextRound);
                setMirrorStep(0);
                setMirrorMessage('Excellent copy. Next pattern loading.');

                if (nextRound < NEW_TRACK_GAMES_ROUNDS) {
                    setMirrorData(makeMirrorRound(nextRound, activeMirrorConfig.size, activeMirrorConfig.sequenceLength));
                    setMirrorShowing(true);
                    setMirrorShowIndex(0);
                }
                return;
            }

            setMirrorMessage(`Good memory. Step ${nextStep + 1} next.`);
            return;
        }

        setMirrorStep(0);
        setMirrorMessage('Oops. Slow breath and retry the same pattern.');
    };

    const handleMirrorModeToggle = () => {
        const nextAdvanced = !mirrorAdvanced;
        setMirrorAdvanced(nextAdvanced);
        resetMirror(nextAdvanced);
    };

    const handleTrafficAction = (action) => {
        if (trafficRound >= NEW_TRACK_GAMES_ROUNDS) {
            return;
        }

        const signal = trafficData.signals[trafficStep];
        const isCorrect = (signal === 'go' && action === 'move') || (signal === 'stop' && action === 'wait');

        if (!isCorrect) {
            setTrafficStep(0);
            setTrafficProgress(0);
            setTrafficMessage('Wrong move. Pause, breathe, and restart this trail.');
            return;
        }

        const nextStep = trafficStep + 1;
        setTrafficStep(nextStep);
        setTrafficProgress((prev) => prev + 1);

        if (nextStep >= trafficData.signals.length) {
            const nextRound = trafficRound + 1;
            setTrafficScore((prev) => prev + 1);
            setTrafficRound(nextRound);
            setTrafficStep(0);
            setTrafficProgress(0);
            setTrafficMessage('Great control. Next trail ready.');

            if (nextRound < NEW_TRACK_GAMES_ROUNDS) {
                setTrafficData(makeTrafficRound(nextRound, activeTrafficConfig.steps));
            }
            return;
        }

        setTrafficMessage('Nice control. Keep following the signal.');
    };

    const handleTrafficModeToggle = () => {
        const nextAdvanced = !trafficAdvanced;
        setTrafficAdvanced(nextAdvanced);
        resetTraffic(nextAdvanced);
    };

    const handleTwinTap = (side) => {
        if (twinRound >= NEW_TRACK_GAMES_ROUNDS) {
            return;
        }

        if (side !== twinExpected) {
            setTwinLeft(0);
            setTwinRight(0);
            setTwinExpected('left');
            setTwinMessage('Use alternating taps: Left then Right. Calm reset.');
            return;
        }

        const target = activeTwinConfig.target;
        const nextLeft = side === 'left' ? twinLeft + 1 : twinLeft;
        const nextRight = side === 'right' ? twinRight + 1 : twinRight;

        setTwinLeft(nextLeft);
        setTwinRight(nextRight);
        setTwinExpected(side === 'left' ? 'right' : 'left');

        if (nextLeft >= target && nextRight >= target) {
            const nextRound = twinRound + 1;
            setTwinScore((prev) => prev + 1);
            setTwinRound(nextRound);
            setTwinLeft(0);
            setTwinRight(0);
            setTwinExpected('left');
            setTwinMessage('Balanced control complete. Next track.');
            return;
        }

        setTwinMessage(`Great. Next tap: ${side === 'left' ? 'Right' : 'Left'}.`);
    };

    const handleTwinModeToggle = () => {
        const nextAdvanced = !twinAdvanced;
        setTwinAdvanced(nextAdvanced);
        resetTwin();
    };

    const calmFinished = calmAttempts >= CALM_TARGET_ATTEMPTS;
    const switchFinished = switchRound >= SWITCH_TOTAL_ROUNDS;
    const oopsFinished = oopsRound >= OOPS_TOTAL_ROUNDS;
    const delayFinished = delayRound >= DELAY_TOTAL_ROUNDS;
    const emotionFinished = emotionRound >= EMOTION_TOTAL_ROUNDS;
    const ladderFinished = ladderStatus === 'finished';
    const breathFinished = breathRound >= BREATH_TOTAL_ROUNDS;
    const focusFinished = focusRound >= FOCUS_TOTAL_ROUNDS;
    const turnFinished = turnRound >= TURN_TOTAL_ROUNDS;
    const sequenceFinished = sequenceStep >= SEQUENCE_TOTAL_STEPS;
    const twinsFinished = twinsRound >= COLOR_TWINS_TOTAL_ROUNDS;
    const flashFinished = flashRound >= FLASH_TOTAL_ROUNDS;
    const trailFinished = trailStep >= COLOR_TRAIL_LENGTH;
    const gridHuntFinished = gridHuntRound >= GRID_HUNT_TOTAL_ROUNDS;
    const gridHuntPromptSymbols = gridHuntData.promptIds.map((id) => {
        const found = gridHuntData.cells.find((cell) => cell.id === id);
        return found ? found.symbol : '?';
    });
    const letterFinished = letterRound >= LETTER_GAME_TOTAL_ROUNDS;
    const letterCurrentWord = (letterWords[letterRound] || '').toUpperCase();
    const letterBuiltPart = letterCurrentWord.slice(0, letterStep);
    const lineMazeFinished = lineMazeRound >= NEW_TRACK_GAMES_ROUNDS;
    const mirrorFinished = mirrorRound >= NEW_TRACK_GAMES_ROUNDS;
    const trafficFinished = trafficRound >= NEW_TRACK_GAMES_ROUNDS;
    const twinFinished = twinRound >= NEW_TRACK_GAMES_ROUNDS;

    useEffect(() => {
        if (!calmFinished || calmSaved) {
            return;
        }

        const score = Math.round((calmHits / CALM_TARGET_ATTEMPTS) * 100);
        addProgressEntry('calmHistory', {
            score,
            hits: calmHits,
            attempts: CALM_TARGET_ATTEMPTS,
            timestamp: new Date().toISOString()
        });
        setCalmSaved(true);
    }, [addProgressEntry, calmFinished, calmSaved, calmHits]);

    useEffect(() => {
        if (!delayFinished || delaySaved) {
            return;
        }

        addProgressEntry('delayHistory', {
            score: delayScore,
            rounds: DELAY_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setDelaySaved(true);
    }, [addProgressEntry, delayFinished, delaySaved, delayScore]);

    useEffect(() => {
        if (!emotionFinished || emotionSaved) {
            return;
        }

        addProgressEntry('emotionHistory', {
            score: emotionScore,
            rounds: EMOTION_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setEmotionSaved(true);
    }, [addProgressEntry, emotionFinished, emotionSaved, emotionScore]);

    useEffect(() => {
        if (!ladderFinished || ladderSaved) {
            return;
        }

        addProgressEntry('ladderHistory', {
            levels: LADDER_TOTAL_LEVELS,
            resets: ladderResets,
            timestamp: new Date().toISOString()
        });
        setLadderSaved(true);
    }, [addProgressEntry, ladderFinished, ladderResets, ladderSaved]);

    useEffect(() => {
        if (!breathFinished || breathSaved) {
            return;
        }

        addProgressEntry('breathHistory', {
            score: breathScore,
            rounds: BREATH_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setBreathSaved(true);
    }, [addProgressEntry, breathFinished, breathSaved, breathScore]);

    useEffect(() => {
        if (!focusFinished || focusSaved) {
            return;
        }

        addProgressEntry('focusHistory', {
            score: focusScore,
            rounds: FOCUS_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setFocusSaved(true);
    }, [addProgressEntry, focusFinished, focusSaved, focusScore]);

    useEffect(() => {
        if (!turnFinished || turnSaved) {
            return;
        }

        addProgressEntry('turnHistory', {
            score: turnScore,
            rounds: TURN_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setTurnSaved(true);
    }, [addProgressEntry, turnFinished, turnSaved, turnScore]);

    useEffect(() => {
        if (!sequenceFinished || sequenceSaved) {
            return;
        }

        addProgressEntry('sequenceHistory', {
            score: sequenceScore,
            steps: SEQUENCE_TOTAL_STEPS,
            timestamp: new Date().toISOString()
        });
        setSequenceSaved(true);
    }, [addProgressEntry, sequenceFinished, sequenceSaved, sequenceScore]);

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
                <div className="brain-lab-panel brain-lab-hub-panel">
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

                        <button className="brain-game-card" onClick={() => handleStartGame('delay')}>
                            <h3>4. Delay Treasure</h3>
                            <p>Wait calmly for bigger rewards.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('emotion')}>
                            <h3>5. Emotion Coach</h3>
                            <p>Pick calm actions in tricky moments.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('ladder')}>
                            <h3>6. Frustration Ladder</h3>
                            <p>Finish harder levels and reset calmly after misses.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('breath')}>
                            <h3>7. Breath Bridge</h3>
                            <p>Match inhale and exhale prompts with steady rhythm.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('focus')}>
                            <h3>8. Focus Freeze</h3>
                            <p>Tap on Go signals and wait on Stop signals.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('turn')}>
                            <h3>9. Turn Taking Builder</h3>
                            <p>Practice social patience and calm turn-taking.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('sequence')}>
                            <h3>10. Reset Routine</h3>
                            <p>Build the 4-step calm-down sequence in order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('twins')}>
                            <h3>11. Color Twins Tap</h3>
                            <p>Find the same target color on both sides.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('flash')}>
                            <h3>12. Flash Memory Match</h3>
                            <p>Memorize shape and color, then choose the exact match.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('trail')}>
                            <h3>13. Color Trail Echo</h3>
                            <p>Watch the color sequence and tap it back in order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('grid-hunt')}>
                            <h3>14. Grid Sequence Hunt</h3>
                            <p>Find symbols in order on an 8x8 grid.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('letter-path')}>
                            <h3>15. Letter Path Builder</h3>
                            <p>Spell daily words by tapping letters in order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('line-maze')}>
                            <h3>16. Line Maze Runner</h3>
                            <p>Trace from start to end through tangled lines.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('mirror')}>
                            <h3>17. Mirror Path Copy</h3>
                            <p>Watch a point path and tap the same order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('traffic-trail')}>
                            <h3>18. Traffic Light Trail</h3>
                            <p>Move on green, wait on red, and finish the trail.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('twin-track')}>
                            <h3>19. Twin Finger Track</h3>
                            <p>Alternate left and right taps to move two tracks.</p>
                        </button>
                    </div>

                    <div className="brain-progress-board">
                        <h3>Progress Memory</h3>
                        <p>
                            Calm history: {progress.calmHistory.slice(0, 5).map((item) => `${item.score}%`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Delay history: {progress.delayHistory.slice(0, 5).map((item) => `${item.score}⭐`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Emotion history: {progress.emotionHistory.slice(0, 5).map((item) => `${item.score}/${EMOTION_TOTAL_ROUNDS}`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Games 6-10 latest: {progress.ladderHistory[0] ? `L6 resets ${progress.ladderHistory[0].resets}` : 'L6 none'} | {progress.breathHistory[0] ? `L7 ${progress.breathHistory[0].score}/${BREATH_TOTAL_ROUNDS}` : 'L7 none'} | {progress.focusHistory[0] ? `L8 ${progress.focusHistory[0].score}/${FOCUS_TOTAL_ROUNDS}` : 'L8 none'} | {progress.turnHistory[0] ? `L9 ${progress.turnHistory[0].score}/${TURN_TOTAL_ROUNDS}` : 'L9 none'} | {progress.sequenceHistory[0] ? `L10 ${progress.sequenceHistory[0].score}/${SEQUENCE_TOTAL_STEPS}` : 'L10 none'}
                        </p>
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
                                        <div className="shape-glyph" style={shapeStyle(choice.shape, choice.color)} />
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

            {view === 'delay' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Delay Treasure</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!delayFinished && (
                        <>
                            <p className="brain-instruction">
                                Wait calmly for 4 seconds to get 3 stars. Quick claim gives 1 star.
                            </p>

                            <div className="delay-timer">{delayWaiting ? `Wait: ${delayTimer}s` : 'Press Wait to start timer'}</div>

                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={handleDelayWait}>Wait Calmly</button>
                                <button className="brain-action-btn" onClick={handleDelayClaim}>Claim Stars</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {delayRound + 1}/{DELAY_TOTAL_ROUNDS}</span>
                                <span>Stars: {delayScore}</span>
                            </div>
                        </>
                    )}

                    {delayFinished && (
                        <div className="brain-result">
                            <h3>Patience power</h3>
                            <p>Total stars: {delayScore}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetDelay}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'emotion' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Emotion Coach</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!emotionFinished && (
                        <>
                            <p className="brain-instruction">Situation: {emotionScenario.prompt}</p>

                            <div className="oops-options">
                                {emotionScenario.options.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleEmotionChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {emotionRound + 1}/{EMOTION_TOTAL_ROUNDS}</span>
                                <span>Score: {emotionScore}</span>
                            </div>
                        </>
                    )}

                    {emotionFinished && (
                        <div className="brain-result">
                            <h3>Calm choices unlocked</h3>
                            <p>Correct calm responses: {emotionScore}/{EMOTION_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetEmotion}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'ladder' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Frustration Ladder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!ladderFinished && (
                        <>
                            <p className="brain-instruction">
                                Level {ladderLevel + 1}: reach {ladderGoal} taps before timer ends.
                            </p>

                            <div className="ladder-timer-track">
                                <div className="ladder-timer-fill" style={{ width: `${Math.max(0, (ladderTimeLeft / (ladderConfig(ladderLevel).seconds + (ladderStatus === 'playing' ? 0 : 1))) * 100)}%` }} />
                            </div>

                            <div className="brain-stats-row">
                                <span>Taps: {ladderTaps}/{ladderGoal}</span>
                                <span>Time: {ladderTimeLeft.toFixed(1)}s</span>
                                <span>Calm resets: {ladderResets}</span>
                            </div>

                            <div className="delay-actions">
                                {ladderStatus === 'ready' && (
                                    <button className="brain-action-btn" onClick={() => startLadderLevel()}>Start Level</button>
                                )}

                                {ladderStatus === 'playing' && (
                                    <button className="brain-action-btn" onClick={handleLadderTap}>Build Block</button>
                                )}

                                {ladderStatus === 'failed' && (
                                    <button className="brain-action-btn" onClick={handleLadderCalmReset}>Calm Reset (+1s)</button>
                                )}

                                {ladderStatus === 'levelComplete' && (
                                    <button className="brain-action-btn" onClick={handleLadderNext}>Next Level</button>
                                )}
                            </div>

                            {ladderStatus === 'failed' && (
                                <p className="oops-message">Missed this level. Breathe and try a calm reset.</p>
                            )}
                        </>
                    )}

                    {ladderFinished && (
                        <div className="brain-result">
                            <h3>Ladder complete</h3>
                            <p>You cleared all 6 levels with {ladderResets} calm resets.</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetLadder}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'breath' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Breath Bridge</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!breathFinished && (
                        <>
                            <p className="brain-instruction">Prompt: {breathPrompt}</p>
                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleBreathChoice('Inhale')}>Inhale</button>
                                <button className="brain-action-btn" onClick={() => handleBreathChoice('Exhale')}>Exhale</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {breathRound + 1}/{BREATH_TOTAL_ROUNDS}</span>
                                <span>Score: {breathScore}</span>
                            </div>
                        </>
                    )}

                    {breathFinished && (
                        <div className="brain-result">
                            <h3>Breathing rhythm built</h3>
                            <p>Correct breaths: {breathScore}/{BREATH_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetBreath}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'focus' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Focus Freeze</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!focusFinished && (
                        <>
                            <p className="brain-instruction">Signal: {focusSignal.label}</p>
                            <p className="oops-message">Tap on Go signals, wait on Stop signals.</p>
                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleFocusChoice('tap')}>Tap</button>
                                <button className="brain-action-btn" onClick={() => handleFocusChoice('wait')}>Wait</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {focusRound + 1}/{FOCUS_TOTAL_ROUNDS}</span>
                                <span>Score: {focusScore}</span>
                            </div>
                        </>
                    )}

                    {focusFinished && (
                        <div className="brain-result">
                            <h3>Great inhibition control</h3>
                            <p>Correct actions: {focusScore}/{FOCUS_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetFocus}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'turn' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Turn Taking Builder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!turnFinished && (
                        <>
                            <p className="brain-instruction">Situation: {turnScenario.prompt}</p>
                            <div className="oops-options">
                                {turnScenario.options.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleTurnChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {turnRound + 1}/{TURN_TOTAL_ROUNDS}</span>
                                <span>Score: {turnScore}</span>
                            </div>
                        </>
                    )}

                    {turnFinished && (
                        <div className="brain-result">
                            <h3>Social calm unlocked</h3>
                            <p>Turn-taking choices: {turnScore}/{TURN_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTurn}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'sequence' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Reset Routine</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!sequenceFinished && (
                        <>
                            <p className="brain-instruction">Step {sequenceStep + 1}: choose the right calm routine step.</p>
                            <p className="oops-message">{sequenceMessage}</p>

                            <div className="oops-options">
                                {sequenceOptions.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleSequenceChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Correct steps: {sequenceScore}/{SEQUENCE_TOTAL_STEPS}</span>
                            </div>
                        </>
                    )}

                    {sequenceFinished && (
                        <div className="brain-result">
                            <h3>Routine mastered</h3>
                            <p>Calm sequence score: {sequenceScore}/{SEQUENCE_TOTAL_STEPS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetSequence}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'twins' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Color Twins Tap</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!twinsFinished && (
                        <>
                            <p className="brain-instruction">
                                Target color: <strong style={{ color: colorHex(twinsData.targetColor), textTransform: 'capitalize' }}>{twinsData.targetColor}</strong>
                            </p>
                            <p className="oops-message">{twinsMessage}</p>

                            <div className="twins-board">
                                <div>
                                    <h4>Left Hand</h4>
                                    <div className="twins-options">
                                        {twinsData.leftOptions.map((colorName) => (
                                            <button
                                                key={`left-${twinsRound}-${colorName}`}
                                                className={`twins-color-btn ${twinsLeftPick === colorName ? 'selected' : ''}`}
                                                onClick={() => handleTwinsPick('left', colorName)}
                                                aria-label={`Left ${colorName}`}
                                            >
                                                <span className="twins-color-dot" style={{ background: colorHex(colorName) }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4>Right Hand</h4>
                                    <div className="twins-options">
                                        {twinsData.rightOptions.map((colorName) => (
                                            <button
                                                key={`right-${twinsRound}-${colorName}`}
                                                className={`twins-color-btn ${twinsRightPick === colorName ? 'selected' : ''}`}
                                                onClick={() => handleTwinsPick('right', colorName)}
                                                aria-label={`Right ${colorName}`}
                                            >
                                                <span className="twins-color-dot" style={{ background: colorHex(colorName) }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {twinsRound + 1}/{COLOR_TWINS_TOTAL_ROUNDS}</span>
                                <span>Matches: {twinsScore}</span>
                            </div>
                        </>
                    )}

                    {twinsFinished && (
                        <div className="brain-result">
                            <h3>Bilateral focus unlocked</h3>
                            <p>Target matches: {twinsScore}/{COLOR_TWINS_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTwins}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'flash' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Flash Memory Match</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!flashFinished && (
                        <>
                            <p className="brain-instruction">
                                Memorize the model on the right. Then pick the exact same shape and color.
                            </p>

                            <div className="flash-board">
                                <div>
                                    <h4>Choices</h4>
                                    <div className="flash-options-grid">
                                        {flashData.options.map((item) => (
                                            <button
                                                key={`${flashRound}-${item.key}`}
                                                className="flash-option-btn"
                                                disabled={flashReveal}
                                                onClick={() => handleFlashChoice(item.key)}
                                            >
                                                <div className="shape-glyph" style={shapeStyle(item.shape, item.color)} />
                                                <span>{item.color} {item.shape}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4>Model Card</h4>
                                    <div className={`flash-model-card ${flashReveal ? 'showing' : 'hidden'}`}>
                                        {flashReveal ? (
                                            <>
                                                <div className="shape-glyph" style={shapeStyle(flashData.target.shape, flashData.target.color)} />
                                                <span>{flashData.target.color} {flashData.target.shape}</span>
                                                <small>Memorize: {flashRevealSeconds}s</small>
                                            </>
                                        ) : (
                                            <span className="flash-hidden-mark">?</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {flashRound + 1}/{FLASH_TOTAL_ROUNDS}</span>
                                <span>Correct: {flashScore}</span>
                            </div>
                        </>
                    )}

                    {flashFinished && (
                        <div className="brain-result">
                            <h3>Memory power built</h3>
                            <p>Exact matches: {flashScore}/{FLASH_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetFlash}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'trail' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Color Trail Echo</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!trailFinished && (
                        <>
                            <p className="brain-instruction">Watch and copy the {COLOR_TRAIL_LENGTH}-color sequence.</p>
                            <p className="oops-message">{trailMessage}</p>

                            <div className="trail-preview">
                                {trailShowing && trailShowIndex < trailSequence.length ? (
                                    <span className="trail-preview-dot" style={{ background: colorHex(trailSequence[trailShowIndex]) }} />
                                ) : (
                                    <span className="trail-preview-dot trail-idle-dot" />
                                )}
                            </div>

                            <div className="trail-options-row">
                                {TOUCH_COLORS.map((colorName) => (
                                    <button
                                        key={`trail-${colorName}`}
                                        className="trail-color-btn"
                                        onClick={() => handleTrailTap(colorName)}
                                        disabled={trailShowing}
                                        aria-label={`Tap ${colorName}`}
                                    >
                                        <span className="trail-color-dot" style={{ background: colorHex(colorName) }} />
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Progress: {trailStep}/{COLOR_TRAIL_LENGTH}</span>
                            </div>
                        </>
                    )}

                    {trailFinished && (
                        <div className="brain-result">
                            <h3>Excellent sequence memory</h3>
                            <p>You repeated all {COLOR_TRAIL_LENGTH} colors in the right order.</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTrail}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'grid-hunt' && (
                <div className="brain-lab-panel brain-lab-compact-panel">
                    <div className="brain-lab-header">
                        <h2>Grid Sequence Hunt</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!gridHuntFinished && (
                        <>
                            <p className="brain-instruction">
                                Tap this order: <strong>{gridHuntPromptSymbols.join(' | ')}</strong>
                            </p>
                            <p className="oops-message">{gridHuntMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{gridHuntAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleGridHuntModeToggle}>
                                    {gridHuntAdvanced ? 'Switch to Easy (8x8, 4 steps)' : 'Switch to Advanced (10x10, 6 steps)'}
                                </button>
                            </div>

                            <div
                                className={`grid-hunt-board ${gridHuntAdvanced ? 'advanced-mode' : 'easy-mode'}`}
                                style={{ gridTemplateColumns: `repeat(${activeGridHuntConfig.size}, minmax(0, 1fr))` }}
                            >
                                {gridHuntData.cells.map((cell) => {
                                    const isTapped = gridHuntTappedIds.includes(cell.id);
                                    return (
                                        <button
                                            key={cell.id}
                                            className={`grid-hunt-cell ${isTapped ? 'done' : ''}`}
                                            onClick={() => handleGridHuntTap(cell.id)}
                                            aria-label={`Symbol ${cell.symbol}`}
                                        >
                                            <span className="grid-hunt-symbol">{cell.symbol}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {gridHuntRound + 1}/{GRID_HUNT_TOTAL_ROUNDS}</span>
                                <span>Step: {gridHuntStep}/{activeGridHuntConfig.sequenceLength}</span>
                                <span>Score: {gridHuntScore}</span>
                            </div>
                        </>
                    )}

                    {gridHuntFinished && (
                        <div className="brain-result">
                            <h3>Sequence hunter complete</h3>
                            <p>Correct rounds: {gridHuntScore}/{GRID_HUNT_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetGridHunt}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'letter-path' && (
                <div className="brain-lab-panel brain-lab-compact-panel">
                    <div className="brain-lab-header">
                        <h2>Letter Path Builder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!letterFinished && (
                        <>
                            <p className="brain-instruction">
                                Word to build: <strong>{letterCurrentWord}</strong>
                            </p>
                            <p className="oops-message">{letterMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{letterGameAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleLetterModeToggle}>
                                    {letterGameAdvanced ? 'Switch to Easy (8x8)' : 'Switch to Advanced (10x10)'}
                                </button>
                            </div>

                            <div className="letter-game-built">
                                Built: <strong>{letterBuiltPart || '_'}</strong>
                            </div>

                            <div
                                className={`letter-grid-board ${letterGameAdvanced ? 'advanced-mode' : 'easy-mode'}`}
                                style={{ gridTemplateColumns: `repeat(${activeLetterGameConfig.size}, minmax(0, 1fr))` }}
                            >
                                {letterData.cells.map((cell) => {
                                    const isTapped = letterTappedIds.includes(cell.id);
                                    return (
                                        <button
                                            key={cell.id}
                                            className={`letter-grid-cell ${isTapped ? 'done' : ''}`}
                                            onClick={() => handleLetterTap(cell.id, cell.letter)}
                                            aria-label={`Letter ${cell.letter}`}
                                        >
                                            <span className="letter-grid-symbol">{cell.letter}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {letterRound + 1}/{LETTER_GAME_TOTAL_ROUNDS}</span>
                                <span>Letters: {letterStep}/{letterCurrentWord.length || 0}</span>
                                <span>Score: {letterScore}</span>
                            </div>
                        </>
                    )}

                    {letterFinished && (
                        <div className="brain-result">
                            <h3>Word builder complete</h3>
                            <p>Correct words: {letterScore}/{LETTER_GAME_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetLetterGame}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'line-maze' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Line Maze Runner</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!lineMazeFinished && (
                        <>
                            <p className="brain-instruction">Trace from the green start dot to the blue finish dot. No timer.</p>
                            <p className="oops-message">{lineMazeMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{lineMazeAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleLineMazeModeToggle}>
                                    {lineMazeAdvanced ? 'Switch to Easy' : 'Switch to Advanced'}
                                </button>
                            </div>

                            <svg
                                className="line-maze-svg"
                                viewBox="0 0 100 100"
                                onPointerDown={handleLineMazeDown}
                                onPointerMove={handleLineMazeMove}
                                onPointerUp={handleLineMazeUp}
                                onPointerLeave={handleLineMazeUp}
                            >
                                {lineMazeData.distractors.map((line, idx) => (
                                    <path key={`d-${idx}`} d={pointsToPath(line)} className="line-maze-distractor" />
                                ))}
                                <path d={pointsToPath(lineMazeData.target)} className="line-maze-target" />
                                <circle cx={lineMazeData.start.x} cy={lineMazeData.start.y} r="3.6" className="line-maze-start" />
                                <circle cx={lineMazeData.end.x} cy={lineMazeData.end.y} r="3.6" className="line-maze-end" />
                            </svg>

                            <div className="brain-stats-row">
                                <span>Round: {lineMazeRound + 1}/{NEW_TRACK_GAMES_ROUNDS}</span>
                                <span>Path score: {lineMazeScore}</span>
                                <span>Progress: {Math.round(lineMazeProgress * 100)}%</span>
                            </div>
                        </>
                    )}

                    {lineMazeFinished && (
                        <div className="brain-result">
                            <h3>Maze focus complete</h3>
                            <p>Completed paths: {lineMazeScore}/{NEW_TRACK_GAMES_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetLineMaze}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'mirror' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Mirror Path Copy</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!mirrorFinished && (
                        <>
                            <p className="brain-instruction">Watch highlighted points, then tap the same sequence.</p>
                            <p className="oops-message">{mirrorMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{mirrorAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleMirrorModeToggle}>
                                    {mirrorAdvanced ? 'Switch to Easy' : 'Switch to Advanced'}
                                </button>
                            </div>

                            <div className="mirror-grid" style={{ gridTemplateColumns: `repeat(${mirrorData.size}, minmax(0, 1fr))` }}>
                                {Array.from({ length: mirrorData.size * mirrorData.size }, (_, cellIndex) => {
                                    const isShow = mirrorShowing && mirrorData.sequence[mirrorShowIndex] === cellIndex;
                                    const isDone = !mirrorShowing && mirrorData.sequence.slice(0, mirrorStep).includes(cellIndex);
                                    return (
                                        <button
                                            key={`m-${mirrorRound}-${cellIndex}`}
                                            className={`mirror-cell ${isShow ? 'show' : ''} ${isDone ? 'done' : ''}`}
                                            onClick={() => handleMirrorTap(cellIndex)}
                                            disabled={mirrorShowing}
                                            aria-label={`Mirror point ${cellIndex + 1}`}
                                        />
                                    );
                                })}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {mirrorRound + 1}/{NEW_TRACK_GAMES_ROUNDS}</span>
                                <span>Step: {mirrorStep}/{mirrorData.sequence.length}</span>
                                <span>Score: {mirrorScore}</span>
                            </div>
                        </>
                    )}

                    {mirrorFinished && (
                        <div className="brain-result">
                            <h3>Mirror memory complete</h3>
                            <p>Copied patterns: {mirrorScore}/{NEW_TRACK_GAMES_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetMirror}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'traffic-trail' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Traffic Light Trail</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!trafficFinished && (
                        <>
                            <p className="brain-instruction">Choose Move on green and Wait on red.</p>
                            <p className="oops-message">{trafficMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{trafficAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleTrafficModeToggle}>
                                    {trafficAdvanced ? 'Switch to Easy' : 'Switch to Advanced'}
                                </button>
                            </div>

                            <div className={`traffic-signal ${trafficData.signals[trafficStep] === 'go' ? 'go' : 'stop'}`}>
                                {trafficData.signals[trafficStep] === 'go' ? 'GREEN GO' : 'RED STOP'}
                            </div>

                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleTrafficAction('move')}>Move</button>
                                <button className="brain-action-btn" onClick={() => handleTrafficAction('wait')}>Wait</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {trafficRound + 1}/{NEW_TRACK_GAMES_ROUNDS}</span>
                                <span>Step: {trafficStep}/{trafficData.signals.length}</span>
                                <span>Trail score: {trafficScore}</span>
                            </div>

                            <div className="traffic-progress-track">
                                <div className="traffic-progress-fill" style={{ width: `${Math.round((trafficProgress / trafficData.signals.length) * 100)}%` }} />
                            </div>
                        </>
                    )}

                    {trafficFinished && (
                        <div className="brain-result">
                            <h3>Signal control complete</h3>
                            <p>Completed trails: {trafficScore}/{NEW_TRACK_GAMES_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTraffic}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'twin-track' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Twin Finger Track</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!twinFinished && (
                        <>
                            <p className="brain-instruction">Alternate taps: Left then Right. This is the two-finger fallback mode.</p>
                            <p className="oops-message">{twinMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{twinAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleTwinModeToggle}>
                                    {twinAdvanced ? 'Switch to Easy' : 'Switch to Advanced'}
                                </button>
                            </div>

                            <div className="twin-track-row">
                                <div>
                                    <span>Left Track</span>
                                    <div className="twin-track-bar"><div style={{ width: `${Math.round((twinLeft / activeTwinConfig.target) * 100)}%` }} /></div>
                                </div>
                                <div>
                                    <span>Right Track</span>
                                    <div className="twin-track-bar"><div style={{ width: `${Math.round((twinRight / activeTwinConfig.target) * 100)}%` }} /></div>
                                </div>
                            </div>

                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleTwinTap('left')}>Left Tap</button>
                                <button className="brain-action-btn" onClick={() => handleTwinTap('right')}>Right Tap</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {twinRound + 1}/{NEW_TRACK_GAMES_ROUNDS}</span>
                                <span>Next: {twinExpected === 'left' ? 'Left' : 'Right'}</span>
                                <span>Score: {twinScore}</span>
                            </div>
                        </>
                    )}

                    {twinFinished && (
                        <div className="brain-result">
                            <h3>Twin track complete</h3>
                            <p>Balanced rounds: {twinScore}/{NEW_TRACK_GAMES_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTwin}>Play Again</button>
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

/*

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './BrainGamesLab.css';

const CALM_TARGET_ATTEMPTS = 10;
const SWITCH_TOTAL_ROUNDS = 12;
const OOPS_TOTAL_ROUNDS = 8;
const DELAY_TOTAL_ROUNDS = 6;
const EMOTION_TOTAL_ROUNDS = 8;
const LADDER_TOTAL_LEVELS = 6;
const BREATH_TOTAL_ROUNDS = 10;
const FOCUS_TOTAL_ROUNDS = 12;
const TURN_TOTAL_ROUNDS = 8;
const SEQUENCE_TOTAL_STEPS = 4;
const COLOR_TWINS_TOTAL_ROUNDS = 8;
const FLASH_TOTAL_ROUNDS = 8;
const FLASH_REVEAL_SECONDS = 3;
const COLOR_TRAIL_LENGTH = 3;
const COLOR_TRAIL_STEP_MS = 4000;
const GRID_HUNT_EASY_SIZE = 8;
const GRID_HUNT_ADV_SIZE = 10;
const GRID_HUNT_TOTAL_ROUNDS = 8;
const GRID_HUNT_EASY_SEQUENCE_LENGTH = 4;
const GRID_HUNT_ADV_SEQUENCE_LENGTH = 6;
const LETTER_GAME_TOTAL_ROUNDS = 8;
const LETTER_GAME_EASY_SIZE = 8;
const LETTER_GAME_ADV_SIZE = 10;
const BRAIN_PROGRESS_STORAGE_KEY = 'brain-games-progress-v1';

const SHAPES = ['circle', 'square', 'triangle'];
const COLORS = ['red', 'blue', 'green', 'orange'];
const TOUCH_COLORS = ['red', 'blue', 'green', 'orange', 'pink', 'purple'];
const TOUCH_COLOR_HEX = {
    red: '#ef5959',
    blue: '#3a84ff',
    green: '#37a95f',
    orange: '#ed9a2f',
    pink: '#f36bb4',
    purple: '#8e61e8'
};

const GRID_HUNT_SYMBOLS = [
    '😀', '😢', '😎', '😍', '🤔', '😴', '😡', '🤗',
    '🌸', '🌼', '🌻', '🍀', '⭐', '🌙', '☀️', '⚡',
    '⬆️', '⬇️', '⬅️', '➡️', '↗️', '↘️', '↙️', '↖️',
    '🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚪', '⚫',
    '❤️', '💙', '💚', '💛', '💜', '🧡', '🩷', '🩵',
    '🔺', '🔻', '🔷', '🔶', '🔸', '🔹', '🟪', '🟫',
    '🚗', '🚀', '✈️', '🚲', '🛶', '🏀', '⚽', '🎈',
    '🍎', '🍌', '🍇', '🍉', '🥕', '🌽', '🍓', '🥝'
];
const GRID_HUNT_EXTRA_SYMBOLS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
const GRID_HUNT_SYMBOL_POOL = [...GRID_HUNT_SYMBOLS, ...GRID_HUNT_EXTRA_SYMBOLS];
const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const LETTER_QUESTION_WORDS = [
    'write', 'pencil', 'animal', 'school', 'friend', 'family', 'teacher', 'book', 'paper', 'eraser',
    'ruler', 'backpack', 'lunch', 'water', 'bottle', 'window', 'table', 'chair', 'clock', 'homework',
    'lesson', 'number', 'letter', 'story', 'poem', 'music', 'dance', 'art', 'color', 'paint',
    'crayon', 'marker', 'glue', 'scissors', 'folder', 'notebook', 'library', 'garden', 'flower', 'tree',
    'grass', 'cloud', 'rain', 'sunny', 'wind', 'storm', 'snow', 'river', 'ocean', 'beach',
    'mountain', 'forest', 'bird', 'rabbit', 'turtle', 'puppy', 'kitten', 'horse', 'zebra', 'monkey',
    'elephant', 'giraffe', 'lion', 'tiger', 'bear', 'shark', 'whale', 'dolphin', 'apple', 'banana',
    'orange', 'grape', 'melon', 'carrot', 'tomato', 'potato', 'cookie', 'bread', 'butter', 'cheese',
    'yogurt', 'cereal', 'soup', 'pizza', 'pasta', 'breakfast', 'dinner', 'happy', 'calm', 'brave',
    'kind', 'share', 'smile', 'thank', 'sorry', 'please', 'listen', 'focus', 'breathe', 'pause',
    'jump', 'run', 'walk', 'stand', 'sit', 'clap', 'sing', 'play', 'learn', 'think',
    'dream', 'build', 'draw', 'count', 'shape', 'circle', 'square', 'triangle', 'star', 'arrow'
];

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

const EMOTION_SCENARIOS = [
    {
        prompt: 'Your block tower falls down.',
        answer: 'Take 2 slow breaths and rebuild.',
        options: ['Yell loudly', 'Take 2 slow breaths and rebuild.', 'Throw blocks']
    },
    {
        prompt: 'You lose one round in a game.',
        answer: 'Say: I can try again.',
        options: ['Quit and slam table', 'Say: I can try again.', 'Blame others']
    },
    {
        prompt: 'A friend chooses a different game.',
        answer: 'Use calm words and take turns.',
        options: ['Use calm words and take turns.', 'Grab the toy', 'Cry and stop playing']
    },
    {
        prompt: 'You feel very angry.',
        answer: 'Pause body, breathe in and out.',
        options: ['Run away shouting', 'Pause body, breathe in and out.', 'Hit pillow very hard']
    },
    {
        prompt: 'Homework feels hard.',
        answer: 'Ask for help calmly.',
        options: ['Tear the paper', 'Ask for help calmly.', 'Say I am bad at this']
    }
];

const TURN_SCENARIOS = [
    {
        prompt: 'Friend is using the puzzle pieces now.',
        answer: 'Wait and ask for a turn.',
        options: ['Grab pieces now', 'Wait and ask for a turn.', 'Shout loudly']
    },
    {
        prompt: 'Teacher says: Your turn after Mina.',
        answer: 'Say OK and wait calmly.',
        options: ['Say OK and wait calmly.', 'Run to front line', 'Refuse to play']
    },
    {
        prompt: 'You want the same toy as your sibling.',
        answer: 'Use timer and take turns.',
        options: ['Push sibling', 'Cry loudly', 'Use timer and take turns.']
    },
    {
        prompt: 'Board game says skip one turn.',
        answer: 'Take a breath and keep playing.',
        options: ['Throw the dice', 'Take a breath and keep playing.', 'Quit the game']
    }
];

const FOCUS_SIGNALS = [
    { kind: 'go', label: 'Green Turtle' },
    { kind: 'go', label: 'Blue Smile' },
    { kind: 'stop', label: 'Red Stop Sign' },
    { kind: 'stop', label: 'Sleeping Moon' }
];

const RESET_ROUTINE_STEPS = [
    'Stop body',
    'Take 2 breaths',
    'Use calm words',
    'Try again'
];

const DEFAULT_PROGRESS = {
    calmHistory: [],
    delayHistory: [],
    emotionHistory: [],
    ladderHistory: [],
    breathHistory: [],
    focusHistory: [],
    turnHistory: [],
    sequenceHistory: []
};

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

    let choices = shuffle([correct, ...distractors]);

    // Safety guard for rendering/data edge cases: always include one valid answer.
    if (!choices.some((item) => item.id === correct.id)) {
        choices = [correct, ...distractors];
    }

    return {
        ruleType,
        ruleValue,
        choices,
        correctId: correct.id
    };
}

function makeFocusSignal() {
    return randomFrom(FOCUS_SIGNALS);
}

function makeBreathPrompt() {
    return Math.random() < 0.5 ? 'Inhale' : 'Exhale';
}

function ladderConfig(level) {
    return {
        goal: 6 + level * 2,
        seconds: Math.max(3.5, 7 - level * 0.7)
    };
}

function makeSequenceOptions(stepIndex) {
    const correct = RESET_ROUTINE_STEPS[stepIndex];
    const distractors = shuffle(RESET_ROUTINE_STEPS.filter((item) => item !== correct)).slice(0, 2);
    return shuffle([correct, ...distractors]);
}

function colorHex(colorName) {
    return TOUCH_COLOR_HEX[colorName] || '#3a84ff';
}

function makeColorOptions(targetColor, optionCount = 3) {
    return shuffle([targetColor, ...shuffle(TOUCH_COLORS.filter((item) => item !== targetColor)).slice(0, optionCount - 1)]);
}

function makeColorTwinsRound(roundIndex) {
    const targetColor = randomFrom(TOUCH_COLORS);
    return {
        roundIndex,
        targetColor,
        leftOptions: makeColorOptions(targetColor),
        rightOptions: makeColorOptions(targetColor)
    };
}

function makeFlashRound(roundIndex) {
    const pool = SHAPES.flatMap((shape) => COLORS.map((color) => ({
        key: `${color}-${shape}`,
        shape,
        color
    })));
    const target = randomFrom(pool);
    const options = shuffle([target, ...shuffle(pool.filter((item) => item.key !== target.key)).slice(0, 5)]);
    return {
        roundIndex,
        target,
        options
    };
}

function makeColorTrailSequence(length) {
    return Array.from({ length }, () => randomFrom(TOUCH_COLORS));
}

function gridHuntConfig(advancedMode) {
    if (advancedMode) {
        return {
            size: GRID_HUNT_ADV_SIZE,
            sequenceLength: GRID_HUNT_ADV_SEQUENCE_LENGTH
        };
    }

    return {
        size: GRID_HUNT_EASY_SIZE,
        sequenceLength: GRID_HUNT_EASY_SEQUENCE_LENGTH
    };
}

function makeGridHuntRound(roundIndex, size, sequenceLength) {
    const totalCells = size * size;
    const symbols = shuffle(GRID_HUNT_SYMBOL_POOL);
    const cells = Array.from({ length: totalCells }, (_, index) => ({
        id: `g${roundIndex}-${index}`,
        symbol: symbols[index] || String(index + 1)
    }));
    const promptCells = shuffle(cells).slice(0, sequenceLength);

    return {
        roundIndex,
        cells,
        promptIds: promptCells.map((item) => item.id)
    };
}

function letterGameConfig(advancedMode) {
    return {
        size: advancedMode ? LETTER_GAME_ADV_SIZE : LETTER_GAME_EASY_SIZE
    };
}

function sampleLetterWords(count) {
    return shuffle(LETTER_QUESTION_WORDS).slice(0, count);
}

function makeLetterRound(word, roundIndex, size) {
    const totalCells = size * size;
    const toRandomCase = (value) => (Math.random() < 0.5 ? value.toUpperCase() : value.toLowerCase());
    const grid = Array.from({ length: totalCells }, () => toRandomCase(randomFrom(LETTERS)));
    const indexes = shuffle(Array.from({ length: totalCells }, (_, index) => index));

    word.toUpperCase().split('').forEach((char) => {
        const slot = indexes.pop();
        if (typeof slot === 'number') {
            grid[slot] = toRandomCase(char);
        }
    });

    return {
        roundIndex,
        word,
        cells: grid.map((letter, index) => ({
            id: `w${roundIndex}-${index}`,
            letter
        }))
    };
}

function loadProgress() {
    try {
        const raw = window.localStorage.getItem(BRAIN_PROGRESS_STORAGE_KEY);
        if (!raw) return DEFAULT_PROGRESS;
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_PROGRESS,
            ...parsed,
            calmHistory: Array.isArray(parsed?.calmHistory) ? parsed.calmHistory : [],
            delayHistory: Array.isArray(parsed?.delayHistory) ? parsed.delayHistory : [],
            emotionHistory: Array.isArray(parsed?.emotionHistory) ? parsed.emotionHistory : [],
            ladderHistory: Array.isArray(parsed?.ladderHistory) ? parsed.ladderHistory : [],
            breathHistory: Array.isArray(parsed?.breathHistory) ? parsed.breathHistory : [],
            focusHistory: Array.isArray(parsed?.focusHistory) ? parsed.focusHistory : [],
            turnHistory: Array.isArray(parsed?.turnHistory) ? parsed.turnHistory : [],
            sequenceHistory: Array.isArray(parsed?.sequenceHistory) ? parsed.sequenceHistory : []
        };
    } catch (error) {
        return DEFAULT_PROGRESS;
    }
}

function saveProgress(nextProgress) {
    try {
        window.localStorage.setItem(BRAIN_PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
    } catch (error) {
        // Ignore storage write failures to keep gameplay uninterrupted.
    }
}

function shapeStyle(shape, color) {
    const palette = {
        red: '#ef5959',
        blue: '#3a84ff',
        green: '#37a95f',
        orange: '#ed9a2f'
    };

    const fill = palette[color] || '#3a84ff';

    if (shape === 'triangle') {
        return {
            width: 0,
            height: 0,
            borderLeft: '34px solid transparent',
            borderRight: '34px solid transparent',
            borderBottom: `66px solid ${fill}`
        };
    }

    if (shape === 'square') {
        return {
            width: '66px',
            height: '66px',
            borderRadius: '8px',
            background: fill
        };
    }

    return {
        width: '66px',
        height: '66px',
        borderRadius: '50%',
        background: fill
    };
}

const BrainGamesLab = ({ onBack }) => {
    const [view, setView] = useState('start');

    // Calm Game
    const [calmMeter, setCalmMeter] = useState(50);
    const [calmDirection, setCalmDirection] = useState(1);
    const [calmAttempts, setCalmAttempts] = useState(0);
    const [calmHits, setCalmHits] = useState(0);
    const [calmSaved, setCalmSaved] = useState(false);

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

    // Delay Treasure Game
    const [delayRound, setDelayRound] = useState(0);
    const [delayScore, setDelayScore] = useState(0);
    const [delayTimer, setDelayTimer] = useState(4);
    const [delayWaiting, setDelayWaiting] = useState(false);
    const [delaySaved, setDelaySaved] = useState(false);

    // Emotion Coach Game
    const [emotionRound, setEmotionRound] = useState(0);
    const [emotionScore, setEmotionScore] = useState(0);
    const [emotionSaved, setEmotionSaved] = useState(false);
    const [emotionScenario, setEmotionScenario] = useState(() => randomFrom(EMOTION_SCENARIOS));

    // Frustration Ladder Game
    const [ladderLevel, setLadderLevel] = useState(0);
    const [ladderGoal, setLadderGoal] = useState(ladderConfig(0).goal);
    const [ladderTaps, setLadderTaps] = useState(0);
    const [ladderTimeLeft, setLadderTimeLeft] = useState(ladderConfig(0).seconds);
    const [ladderStatus, setLadderStatus] = useState('ready'); // ready, playing, failed, levelComplete, finished
    const [ladderResets, setLadderResets] = useState(0);
    const [ladderSaved, setLadderSaved] = useState(false);

    // Breath Bridge Game
    const [breathRound, setBreathRound] = useState(0);
    const [breathScore, setBreathScore] = useState(0);
    const [breathPrompt, setBreathPrompt] = useState(() => makeBreathPrompt());
    const [breathSaved, setBreathSaved] = useState(false);

    // Focus Freeze Game
    const [focusRound, setFocusRound] = useState(0);
    const [focusScore, setFocusScore] = useState(0);
    const [focusSignal, setFocusSignal] = useState(() => makeFocusSignal());
    const [focusSaved, setFocusSaved] = useState(false);

    // Turn Taking Builder Game
    const [turnRound, setTurnRound] = useState(0);
    const [turnScore, setTurnScore] = useState(0);
    const [turnScenario, setTurnScenario] = useState(() => randomFrom(TURN_SCENARIOS));
    const [turnSaved, setTurnSaved] = useState(false);

    // Reset Routine Game
    const [sequenceStep, setSequenceStep] = useState(0);
    const [sequenceScore, setSequenceScore] = useState(0);
    const [sequenceMessage, setSequenceMessage] = useState('Pick the first calm step.');
    const [sequenceOptions, setSequenceOptions] = useState(() => makeSequenceOptions(0));
    const [sequenceSaved, setSequenceSaved] = useState(false);

    // Color Twins Tap Game
    const [twinsRound, setTwinsRound] = useState(0);
    const [twinsScore, setTwinsScore] = useState(0);
    const [twinsLeftPick, setTwinsLeftPick] = useState(null);
    const [twinsRightPick, setTwinsRightPick] = useState(null);
    const [twinsMessage, setTwinsMessage] = useState('Pick the target color on both sides.');
    const [twinsData, setTwinsData] = useState(() => makeColorTwinsRound(0));

    // Flash Memory Match Game
    const [flashRound, setFlashRound] = useState(0);
    const [flashScore, setFlashScore] = useState(0);
    const [flashReveal, setFlashReveal] = useState(true);
    const [flashRevealSeconds, setFlashRevealSeconds] = useState(FLASH_REVEAL_SECONDS);
    const [flashData, setFlashData] = useState(() => makeFlashRound(0));

    // Color Trail Echo Game
    const [trailSequence, setTrailSequence] = useState(() => makeColorTrailSequence(COLOR_TRAIL_LENGTH));
    const [trailShowIndex, setTrailShowIndex] = useState(0);
    const [trailShowing, setTrailShowing] = useState(true);
    const [trailStep, setTrailStep] = useState(0);
    const [trailMessage, setTrailMessage] = useState('Watch the color trail, then repeat it.');

    // Grid Sequence Hunt Game
    const [gridHuntAdvanced, setGridHuntAdvanced] = useState(false);
    const [gridHuntRound, setGridHuntRound] = useState(0);
    const [gridHuntScore, setGridHuntScore] = useState(0);
    const [gridHuntStep, setGridHuntStep] = useState(0);
    const [gridHuntMessage, setGridHuntMessage] = useState('Tap the symbols in the exact order shown below.');
    const [gridHuntTappedIds, setGridHuntTappedIds] = useState([]);
    const [gridHuntData, setGridHuntData] = useState(() => makeGridHuntRound(0, GRID_HUNT_EASY_SIZE, GRID_HUNT_EASY_SEQUENCE_LENGTH));

    const activeGridHuntConfig = useMemo(() => gridHuntConfig(gridHuntAdvanced), [gridHuntAdvanced]);

    // Letter Path Builder Game
    const initialLetterWords = useMemo(() => sampleLetterWords(LETTER_GAME_TOTAL_ROUNDS), []);
    const [letterGameAdvanced, setLetterGameAdvanced] = useState(false);
    const [letterWords, setLetterWords] = useState(initialLetterWords);
    const [letterRound, setLetterRound] = useState(0);
    const [letterScore, setLetterScore] = useState(0);
    const [letterStep, setLetterStep] = useState(0);
    const [letterTappedIds, setLetterTappedIds] = useState([]);
    const [letterMessage, setLetterMessage] = useState('Tap the letters in order to build the word.');
    const [letterData, setLetterData] = useState(() => makeLetterRound(initialLetterWords[0] || 'write', 0, LETTER_GAME_EASY_SIZE));

    const activeLetterGameConfig = useMemo(() => letterGameConfig(letterGameAdvanced), [letterGameAdvanced]);

    const [progress, setProgress] = useState(() => loadProgress());

    const addProgressEntry = useCallback((bucket, entry) => {
        setProgress((prev) => {
            const next = {
                ...prev,
                [bucket]: [entry, ...(prev[bucket] || [])].slice(0, 20)
            };
            saveProgress(next);
            return next;
        });
    }, []);

    const resetCalm = useCallback(() => {
        setCalmMeter(50);
        setCalmDirection(1);
        setCalmAttempts(0);
        setCalmHits(0);
        setCalmSaved(false);
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

    const resetDelay = useCallback(() => {
        setDelayRound(0);
        setDelayScore(0);
        setDelayTimer(4);
        setDelayWaiting(false);
        setDelaySaved(false);
    }, []);

    const resetEmotion = useCallback(() => {
        setEmotionRound(0);
        setEmotionScore(0);
        setEmotionSaved(false);
        setEmotionScenario(randomFrom(EMOTION_SCENARIOS));
    }, []);

    const resetLadder = useCallback(() => {
        const base = ladderConfig(0);
        setLadderLevel(0);
        setLadderGoal(base.goal);
        setLadderTaps(0);
        setLadderTimeLeft(base.seconds);
        setLadderStatus('ready');
        setLadderResets(0);
        setLadderSaved(false);
    }, []);

    const resetBreath = useCallback(() => {
        setBreathRound(0);
        setBreathScore(0);
        setBreathPrompt(makeBreathPrompt());
        setBreathSaved(false);
    }, []);

    const resetFocus = useCallback(() => {
        setFocusRound(0);
        setFocusScore(0);
        setFocusSignal(makeFocusSignal());
        setFocusSaved(false);
    }, []);

    const resetTurn = useCallback(() => {
        setTurnRound(0);
        setTurnScore(0);
        setTurnScenario(randomFrom(TURN_SCENARIOS));
        setTurnSaved(false);
    }, []);

    const resetSequence = useCallback(() => {
        setSequenceStep(0);
        setSequenceScore(0);
        setSequenceMessage('Pick the first calm step.');
        setSequenceOptions(makeSequenceOptions(0));
        setSequenceSaved(false);
    }, []);

    const resetTwins = useCallback(() => {
        setTwinsRound(0);
        setTwinsScore(0);
        setTwinsLeftPick(null);
        setTwinsRightPick(null);
        setTwinsMessage('Pick the target color on both sides.');
        setTwinsData(makeColorTwinsRound(0));
    }, []);

    const resetFlash = useCallback(() => {
        setFlashRound(0);
        setFlashScore(0);
        setFlashReveal(true);
        setFlashRevealSeconds(FLASH_REVEAL_SECONDS);
        setFlashData(makeFlashRound(0));
    }, []);

    const resetTrail = useCallback(() => {
        setTrailSequence(makeColorTrailSequence(COLOR_TRAIL_LENGTH));
        setTrailShowIndex(0);
        setTrailShowing(true);
        setTrailStep(0);
        setTrailMessage('Watch the color trail, then repeat it.');
    }, []);

    const resetGridHunt = useCallback((advancedMode = gridHuntAdvanced) => {
        const cfg = gridHuntConfig(advancedMode);
        setGridHuntRound(0);
        setGridHuntScore(0);
        setGridHuntStep(0);
        setGridHuntMessage('Tap the symbols in the exact order shown below.');
        setGridHuntTappedIds([]);
        setGridHuntData(makeGridHuntRound(0, cfg.size, cfg.sequenceLength));
    }, [gridHuntAdvanced]);

    const resetLetterGame = useCallback((advancedMode = letterGameAdvanced) => {
        const cfg = letterGameConfig(advancedMode);
        const nextWords = sampleLetterWords(LETTER_GAME_TOTAL_ROUNDS);

        setLetterWords(nextWords);
        setLetterRound(0);
        setLetterScore(0);
        setLetterStep(0);
        setLetterTappedIds([]);
        setLetterMessage('Tap the letters in order to build the word.');
        setLetterData(makeLetterRound(nextWords[0] || 'write', 0, cfg.size));
    }, [letterGameAdvanced]);

    const startLadderLevel = useCallback((extraSeconds = 0) => {
        const cfg = ladderConfig(ladderLevel);
        setLadderGoal(cfg.goal);
        setLadderTaps(0);
        setLadderTimeLeft(cfg.seconds + extraSeconds);
        setLadderStatus('playing');
    }, [ladderLevel]);

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

    useEffect(() => {
        if (view !== 'delay' || !delayWaiting) {
            return undefined;
        }

        const id = window.setInterval(() => {
            setDelayTimer((prev) => {
                if (prev <= 1) {
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(id);
    }, [view, delayWaiting]);

    useEffect(() => {
        if (view !== 'ladder' || ladderStatus !== 'playing') {
            return undefined;
        }

        const id = window.setInterval(() => {
            setLadderTimeLeft((prev) => {
                if (prev <= 0.1) {
                    setLadderStatus('failed');
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => window.clearInterval(id);
    }, [view, ladderStatus]);

    useEffect(() => {
        if (view !== 'flash' || !flashReveal || flashRound >= FLASH_TOTAL_ROUNDS) {
            return undefined;
        }

        const id = window.setInterval(() => {
            setFlashRevealSeconds((prev) => {
                if (prev <= 1) {
                    setFlashReveal(false);
                    window.clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(id);
    }, [view, flashReveal, flashRound]);

    useEffect(() => {
        if (view !== 'trail' || !trailShowing) {
            return undefined;
        }

        if (trailShowIndex >= trailSequence.length) {
            setTrailShowing(false);
            setTrailMessage('Now repeat the same color order.');
            return undefined;
        }

        const id = window.setTimeout(() => {
            setTrailShowIndex((prev) => prev + 1);
        }, COLOR_TRAIL_STEP_MS);

        return () => window.clearTimeout(id);
    }, [view, trailShowing, trailShowIndex, trailSequence]);

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

        if (gameId === 'delay') {
            resetDelay();
            setView('delay');
            return;
        }

        if (gameId === 'emotion') {
            resetEmotion();
            setView('emotion');
            return;
        }

        if (gameId === 'ladder') {
            resetLadder();
            setView('ladder');
            return;
        }

        if (gameId === 'breath') {
            resetBreath();
            setView('breath');
            return;
        }

        if (gameId === 'focus') {
            resetFocus();
            setView('focus');
            return;
        }

        if (gameId === 'turn') {
            resetTurn();
            setView('turn');
            return;
        }

        if (gameId === 'sequence') {
            resetSequence();
            setView('sequence');
            return;
        }

        if (gameId === 'twins') {
            resetTwins();
            setView('twins');
            return;
        }

        if (gameId === 'flash') {
            resetFlash();
            setView('flash');
            return;
        }

        if (gameId === 'trail') {
            resetTrail();
            setView('trail');
            return;
        }

        if (gameId === 'grid-hunt') {
            resetGridHunt();
            setView('grid-hunt');
            return;
        }

        if (gameId === 'letter-path') {
            resetLetterGame();
            setView('letter-path');
            return;
        }

        if (gameId === 'oops') {
            resetOops();
            setView('oops');
        }
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

    const handleDelayWait = () => {
        if (delayWaiting || delayRound >= DELAY_TOTAL_ROUNDS) {
            return;
        }
        setDelayTimer(4);
        setDelayWaiting(true);
    };

    const handleDelayClaim = () => {
        if (delayRound >= DELAY_TOTAL_ROUNDS) {
            return;
        }

        const waitedLongEnough = delayWaiting && delayTimer === 0;
        const gained = waitedLongEnough ? 3 : 1;
        const nextRound = delayRound + 1;

        setDelayScore((prev) => prev + gained);
        setDelayRound(nextRound);
        setDelayWaiting(false);
        setDelayTimer(4);
    };

    const handleEmotionChoice = (choice) => {
        if (emotionRound >= EMOTION_TOTAL_ROUNDS) {
            return;
        }

        const isCorrect = choice === emotionScenario.answer;
        const nextRound = emotionRound + 1;

        if (isCorrect) {
            setEmotionScore((prev) => prev + 1);
        }

        setEmotionRound(nextRound);

        if (nextRound < EMOTION_TOTAL_ROUNDS) {
            setEmotionScenario(randomFrom(EMOTION_SCENARIOS));
        }
    };

    const handleLadderTap = () => {
        if (ladderStatus !== 'playing') {
            return;
        }

        setLadderTaps((prev) => {
            const next = prev + 1;
            if (next >= ladderGoal) {
                setLadderStatus('levelComplete');
            }
            return next;
        });
    };

    const handleLadderCalmReset = () => {
        if (ladderStatus !== 'failed') {
            return;
        }
        setLadderResets((prev) => prev + 1);
        startLadderLevel(1);
    };

    const handleLadderNext = () => {
        if (ladderStatus !== 'levelComplete') {
            return;
        }

        const nextLevel = ladderLevel + 1;
        if (nextLevel >= LADDER_TOTAL_LEVELS) {
            setLadderLevel(nextLevel);
            setLadderStatus('finished');
            return;
        }

        const cfg = ladderConfig(nextLevel);
        setLadderLevel(nextLevel);
        setLadderGoal(cfg.goal);
        setLadderTaps(0);
        setLadderTimeLeft(cfg.seconds);
        setLadderStatus('ready');
    };

    const handleBreathChoice = (choice) => {
        if (breathRound >= BREATH_TOTAL_ROUNDS) {
            return;
        }

        if (choice === breathPrompt) {
            setBreathScore((prev) => prev + 1);
        }

        const nextRound = breathRound + 1;
        setBreathRound(nextRound);

        if (nextRound < BREATH_TOTAL_ROUNDS) {
            setBreathPrompt(makeBreathPrompt());
        }
    };

    const handleFocusChoice = (choice) => {
        if (focusRound >= FOCUS_TOTAL_ROUNDS) {
            return;
        }

        const shouldTap = focusSignal.kind === 'go';
        const isCorrect = (choice === 'tap' && shouldTap) || (choice === 'wait' && !shouldTap);
        if (isCorrect) {
            setFocusScore((prev) => prev + 1);
        }

        const nextRound = focusRound + 1;
        setFocusRound(nextRound);

        if (nextRound < FOCUS_TOTAL_ROUNDS) {
            setFocusSignal(makeFocusSignal());
        }
    };

    const handleTurnChoice = (choice) => {
        if (turnRound >= TURN_TOTAL_ROUNDS) {
            return;
        }

        if (choice === turnScenario.answer) {
            setTurnScore((prev) => prev + 1);
        }

        const nextRound = turnRound + 1;
        setTurnRound(nextRound);

        if (nextRound < TURN_TOTAL_ROUNDS) {
            setTurnScenario(randomFrom(TURN_SCENARIOS));
        }
    };

    const handleSequenceChoice = (choice) => {
        if (sequenceStep >= SEQUENCE_TOTAL_STEPS) {
            return;
        }

        const expected = RESET_ROUTINE_STEPS[sequenceStep];
        if (choice === expected) {
            const nextStep = sequenceStep + 1;
            setSequenceScore((prev) => prev + 1);
            setSequenceStep(nextStep);

            if (nextStep >= SEQUENCE_TOTAL_STEPS) {
                setSequenceMessage('Routine complete. Great self-control!');
                return;
            }

            setSequenceOptions(makeSequenceOptions(nextStep));
            setSequenceMessage(`Great. Now pick step ${nextStep + 1}.`);
            return;
        }

        setSequenceOptions(makeSequenceOptions(sequenceStep));
        setSequenceMessage('Close. Pause and choose the calm step.');
    };

    const handleTwinsPick = (side, colorName) => {
        if (twinsRound >= COLOR_TWINS_TOTAL_ROUNDS) {
            return;
        }

        const nextLeft = side === 'left' ? colorName : twinsLeftPick;
        const nextRight = side === 'right' ? colorName : twinsRightPick;

        if (side === 'left') {
            setTwinsLeftPick(colorName);
        } else {
            setTwinsRightPick(colorName);
        }

        if (!nextLeft || !nextRight) {
            return;
        }

        const isCorrect = nextLeft === twinsData.targetColor && nextRight === twinsData.targetColor;
        const nextRound = twinsRound + 1;

        if (isCorrect) {
            setTwinsScore((prev) => prev + 1);
            setTwinsMessage('Great match. Calm hands, calm brain.');
        } else {
            setTwinsMessage('Nice try. Slow breath and match again.');
        }

        setTwinsRound(nextRound);
        setTwinsLeftPick(null);
        setTwinsRightPick(null);

        if (nextRound < COLOR_TWINS_TOTAL_ROUNDS) {
            setTwinsData(makeColorTwinsRound(nextRound));
        }
    };

    const handleFlashChoice = (choiceKey) => {
        if (flashRound >= FLASH_TOTAL_ROUNDS || flashReveal) {
            return;
        }

        const isCorrect = choiceKey === flashData.target.key;
        const nextRound = flashRound + 1;

        if (isCorrect) {
            setFlashScore((prev) => prev + 1);
        }

        setFlashRound(nextRound);

        if (nextRound < FLASH_TOTAL_ROUNDS) {
            setFlashData(makeFlashRound(nextRound));
            setFlashReveal(true);
            setFlashRevealSeconds(FLASH_REVEAL_SECONDS);
        }
    };

    const handleTrailTap = (colorName) => {
        if (trailShowing || trailStep >= COLOR_TRAIL_LENGTH) {
            return;
        }

        const expected = trailSequence[trailStep];
        if (colorName === expected) {
            const nextStep = trailStep + 1;
            setTrailStep(nextStep);

            if (nextStep >= COLOR_TRAIL_LENGTH) {
                setTrailMessage('Memory trail complete. Excellent focus.');
                return;
            }

            setTrailMessage(`Nice. Keep going (${nextStep}/${COLOR_TRAIL_LENGTH}).`);
            return;
        }

        setTrailStep(0);
        setTrailShowIndex(0);
        setTrailShowing(true);
        setTrailMessage('Oops. Breathe and replay the trail.');
    };

    const handleGridHuntTap = (cellId) => {
        if (gridHuntRound >= GRID_HUNT_TOTAL_ROUNDS) {
            return;
        }

        const expectedId = gridHuntData.promptIds[gridHuntStep];
        if (cellId === expectedId) {
            const nextStep = gridHuntStep + 1;
            const nextTapped = [...gridHuntTappedIds, cellId];
            setGridHuntStep(nextStep);
            setGridHuntTappedIds(nextTapped);

            if (nextStep >= activeGridHuntConfig.sequenceLength) {
                const nextRound = gridHuntRound + 1;
                setGridHuntScore((prev) => prev + 1);
                setGridHuntMessage('Great sequence. Calm focus and continue.');
                setGridHuntRound(nextRound);
                setGridHuntStep(0);
                setGridHuntTappedIds([]);

                if (nextRound < GRID_HUNT_TOTAL_ROUNDS) {
                    setGridHuntData(makeGridHuntRound(nextRound, activeGridHuntConfig.size, activeGridHuntConfig.sequenceLength));
                }
                return;
            }

            setGridHuntMessage(`Good. Step ${nextStep + 1} next.`);
            return;
        }

        // Calm mode: mistakes restart the current sequence without penalty.
        setGridHuntStep(0);
        setGridHuntTappedIds([]);
        setGridHuntMessage('Oops. Slow breath and retry from step 1.');
    };

    const handleGridHuntModeToggle = () => {
        const nextAdvanced = !gridHuntAdvanced;
        setGridHuntAdvanced(nextAdvanced);
        resetGridHunt(nextAdvanced);
    };

    const handleLetterTap = (cellId, letter) => {
        if (letterRound >= LETTER_GAME_TOTAL_ROUNDS) {
            return;
        }

        const currentWord = (letterWords[letterRound] || '').toUpperCase();
        const expected = currentWord[letterStep];

        if (letter.toUpperCase() === expected) {
            const nextStep = letterStep + 1;
            setLetterStep(nextStep);
            setLetterTappedIds((prev) => [...prev, cellId]);

            if (nextStep >= currentWord.length) {
                const nextRound = letterRound + 1;
                setLetterScore((prev) => prev + 1);
                setLetterMessage('Great spelling. Calm mind, next word.');
                setLetterRound(nextRound);
                setLetterStep(0);
                setLetterTappedIds([]);

                if (nextRound < LETTER_GAME_TOTAL_ROUNDS) {
                    const nextWord = letterWords[nextRound] || 'write';
                    setLetterData(makeLetterRound(nextWord, nextRound, activeLetterGameConfig.size));
                }

                return;
            }

            setLetterMessage(`Good. Next letter: step ${nextStep + 1}.`);
            return;
        }

        // Calm mode retry: restart only the current word attempt.
        setLetterStep(0);
        setLetterTappedIds([]);
        setLetterMessage('Oops. Take one breath and start this word again.');
    };

    const handleLetterModeToggle = () => {
        const nextAdvanced = !letterGameAdvanced;
        setLetterGameAdvanced(nextAdvanced);
        resetLetterGame(nextAdvanced);
    };

    const calmFinished = calmAttempts >= CALM_TARGET_ATTEMPTS;
    const switchFinished = switchRound >= SWITCH_TOTAL_ROUNDS;
    const oopsFinished = oopsRound >= OOPS_TOTAL_ROUNDS;
    const delayFinished = delayRound >= DELAY_TOTAL_ROUNDS;
    const emotionFinished = emotionRound >= EMOTION_TOTAL_ROUNDS;
    const ladderFinished = ladderStatus === 'finished';
    const breathFinished = breathRound >= BREATH_TOTAL_ROUNDS;
    const focusFinished = focusRound >= FOCUS_TOTAL_ROUNDS;
    const turnFinished = turnRound >= TURN_TOTAL_ROUNDS;
    const sequenceFinished = sequenceStep >= SEQUENCE_TOTAL_STEPS;
    const twinsFinished = twinsRound >= COLOR_TWINS_TOTAL_ROUNDS;
    const flashFinished = flashRound >= FLASH_TOTAL_ROUNDS;
    const trailFinished = trailStep >= COLOR_TRAIL_LENGTH;
    const gridHuntFinished = gridHuntRound >= GRID_HUNT_TOTAL_ROUNDS;
    const gridHuntPromptSymbols = gridHuntData.promptIds.map((id) => {
        const found = gridHuntData.cells.find((cell) => cell.id === id);
        return found ? found.symbol : '?';
    });
    const letterFinished = letterRound >= LETTER_GAME_TOTAL_ROUNDS;
    const letterCurrentWord = (letterWords[letterRound] || '').toUpperCase();
    const letterBuiltPart = letterCurrentWord.slice(0, letterStep);

    useEffect(() => {
        if (!calmFinished || calmSaved) {
            return;
        }

        const score = Math.round((calmHits / CALM_TARGET_ATTEMPTS) * 100);
        addProgressEntry('calmHistory', {
            score,
            hits: calmHits,
            attempts: CALM_TARGET_ATTEMPTS,
            timestamp: new Date().toISOString()
        });
        setCalmSaved(true);
    }, [addProgressEntry, calmFinished, calmSaved, calmHits]);

    useEffect(() => {
        if (!delayFinished || delaySaved) {
            return;
        }

        addProgressEntry('delayHistory', {
            score: delayScore,
            rounds: DELAY_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setDelaySaved(true);
    }, [addProgressEntry, delayFinished, delaySaved, delayScore]);

    useEffect(() => {
        if (!emotionFinished || emotionSaved) {
            return;
        }

        addProgressEntry('emotionHistory', {
            score: emotionScore,
            rounds: EMOTION_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setEmotionSaved(true);
    }, [addProgressEntry, emotionFinished, emotionSaved, emotionScore]);

    useEffect(() => {
        if (!ladderFinished || ladderSaved) {
            return;
        }

        addProgressEntry('ladderHistory', {
            levels: LADDER_TOTAL_LEVELS,
            resets: ladderResets,
            timestamp: new Date().toISOString()
        });
        setLadderSaved(true);
    }, [addProgressEntry, ladderFinished, ladderResets, ladderSaved]);

    useEffect(() => {
        if (!breathFinished || breathSaved) {
            return;
        }

        addProgressEntry('breathHistory', {
            score: breathScore,
            rounds: BREATH_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setBreathSaved(true);
    }, [addProgressEntry, breathFinished, breathSaved, breathScore]);

    useEffect(() => {
        if (!focusFinished || focusSaved) {
            return;
        }

        addProgressEntry('focusHistory', {
            score: focusScore,
            rounds: FOCUS_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setFocusSaved(true);
    }, [addProgressEntry, focusFinished, focusSaved, focusScore]);

    useEffect(() => {
        if (!turnFinished || turnSaved) {
            return;
        }

        addProgressEntry('turnHistory', {
            score: turnScore,
            rounds: TURN_TOTAL_ROUNDS,
            timestamp: new Date().toISOString()
        });
        setTurnSaved(true);
    }, [addProgressEntry, turnFinished, turnSaved, turnScore]);

    useEffect(() => {
        if (!sequenceFinished || sequenceSaved) {
            return;
        }

        addProgressEntry('sequenceHistory', {
            score: sequenceScore,
            steps: SEQUENCE_TOTAL_STEPS,
            timestamp: new Date().toISOString()
        });
        setSequenceSaved(true);
    }, [addProgressEntry, sequenceFinished, sequenceSaved, sequenceScore]);

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
                <div className="brain-lab-panel brain-lab-hub-panel">
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

                        <button className="brain-game-card" onClick={() => handleStartGame('delay')}>
                            <h3>4. Delay Treasure</h3>
                            <p>Wait calmly for bigger rewards.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('emotion')}>
                            <h3>5. Emotion Coach</h3>
                            <p>Pick calm actions in tricky moments.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('ladder')}>
                            <h3>6. Frustration Ladder</h3>
                            <p>Finish harder levels and reset calmly after misses.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('breath')}>
                            <h3>7. Breath Bridge</h3>
                            <p>Match inhale and exhale prompts with steady rhythm.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('focus')}>
                            <h3>8. Focus Freeze</h3>
                            <p>Tap on Go signals and wait on Stop signals.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('turn')}>
                            <h3>9. Turn Taking Builder</h3>
                            <p>Practice social patience and calm turn-taking.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('sequence')}>
                            <h3>10. Reset Routine</h3>
                            <p>Build the 4-step calm-down sequence in order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('twins')}>
                            <h3>11. Color Twins Tap</h3>
                            <p>Find the same target color on both sides.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('flash')}>
                            <h3>12. Flash Memory Match</h3>
                            <p>Memorize shape and color, then choose the exact match.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('trail')}>
                            <h3>13. Color Trail Echo</h3>
                            <p>Watch the color sequence and tap it back in order.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('grid-hunt')}>
                            <h3>14. Grid Sequence Hunt</h3>
                            <p>Find symbols in order on an 8x8 grid.</p>
                        </button>

                        <button className="brain-game-card" onClick={() => handleStartGame('letter-path')}>
                            <h3>15. Letter Path Builder</h3>
                            <p>Spell daily words by tapping letters in order.</p>
                        </button>
                    </div>

                    <div className="brain-progress-board">
                        <h3>Progress Memory</h3>
                        <p>
                            Calm history: {progress.calmHistory.slice(0, 5).map((item) => `${item.score}%`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Delay history: {progress.delayHistory.slice(0, 5).map((item) => `${item.score}⭐`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Emotion history: {progress.emotionHistory.slice(0, 5).map((item) => `${item.score}/${EMOTION_TOTAL_ROUNDS}`).join(' | ') || 'No sessions yet'}
                        </p>
                        <p>
                            Games 6-10 latest: {progress.ladderHistory[0] ? `L6 resets ${progress.ladderHistory[0].resets}` : 'L6 none'} | {progress.breathHistory[0] ? `L7 ${progress.breathHistory[0].score}/${BREATH_TOTAL_ROUNDS}` : 'L7 none'} | {progress.focusHistory[0] ? `L8 ${progress.focusHistory[0].score}/${FOCUS_TOTAL_ROUNDS}` : 'L8 none'} | {progress.turnHistory[0] ? `L9 ${progress.turnHistory[0].score}/${TURN_TOTAL_ROUNDS}` : 'L9 none'} | {progress.sequenceHistory[0] ? `L10 ${progress.sequenceHistory[0].score}/${SEQUENCE_TOTAL_STEPS}` : 'L10 none'}
                        </p>
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
                                        <div className="shape-glyph" style={shapeStyle(choice.shape, choice.color)} />
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

            {view === 'delay' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Delay Treasure</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!delayFinished && (
                        <>
                            <p className="brain-instruction">
                                Wait calmly for 4 seconds to get 3 stars. Quick claim gives 1 star.
                            </p>

                            <div className="delay-timer">{delayWaiting ? `Wait: ${delayTimer}s` : 'Press Wait to start timer'}</div>

                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={handleDelayWait}>Wait Calmly</button>
                                <button className="brain-action-btn" onClick={handleDelayClaim}>Claim Stars</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {delayRound + 1}/{DELAY_TOTAL_ROUNDS}</span>
                                <span>Stars: {delayScore}</span>
                            </div>
                        </>
                    )}

                    {delayFinished && (
                        <div className="brain-result">
                            <h3>Patience power</h3>
                            <p>Total stars: {delayScore}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetDelay}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'emotion' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Emotion Coach</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!emotionFinished && (
                        <>
                            <p className="brain-instruction">Situation: {emotionScenario.prompt}</p>

                            <div className="oops-options">
                                {emotionScenario.options.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleEmotionChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {emotionRound + 1}/{EMOTION_TOTAL_ROUNDS}</span>
                                <span>Score: {emotionScore}</span>
                            </div>
                        </>
                    )}

                    {emotionFinished && (
                        <div className="brain-result">
                            <h3>Calm choices unlocked</h3>
                            <p>Correct calm responses: {emotionScore}/{EMOTION_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetEmotion}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'ladder' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Frustration Ladder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!ladderFinished && (
                        <>
                            <p className="brain-instruction">
                                Level {ladderLevel + 1}: reach {ladderGoal} taps before timer ends.
                            </p>

                            <div className="ladder-timer-track">
                                <div className="ladder-timer-fill" style={{ width: `${Math.max(0, (ladderTimeLeft / (ladderConfig(ladderLevel).seconds + (ladderStatus === 'playing' ? 0 : 1))) * 100)}%` }} />
                            </div>

                            <div className="brain-stats-row">
                                <span>Taps: {ladderTaps}/{ladderGoal}</span>
                                <span>Time: {ladderTimeLeft.toFixed(1)}s</span>
                                <span>Calm resets: {ladderResets}</span>
                            </div>

                            <div className="delay-actions">
                                {ladderStatus === 'ready' && (
                                    <button className="brain-action-btn" onClick={() => startLadderLevel()}>Start Level</button>
                                )}

                                {ladderStatus === 'playing' && (
                                    <button className="brain-action-btn" onClick={handleLadderTap}>Build Block</button>
                                )}

                                {ladderStatus === 'failed' && (
                                    <button className="brain-action-btn" onClick={handleLadderCalmReset}>Calm Reset (+1s)</button>
                                )}

                                {ladderStatus === 'levelComplete' && (
                                    <button className="brain-action-btn" onClick={handleLadderNext}>Next Level</button>
                                )}
                            </div>

                            {ladderStatus === 'failed' && (
                                <p className="oops-message">Missed this level. Breathe and try a calm reset.</p>
                            )}
                        </>
                    )}

                    {ladderFinished && (
                        <div className="brain-result">
                            <h3>Ladder complete</h3>
                            <p>You cleared all 6 levels with {ladderResets} calm resets.</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetLadder}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'breath' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Breath Bridge</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!breathFinished && (
                        <>
                            <p className="brain-instruction">Prompt: {breathPrompt}</p>
                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleBreathChoice('Inhale')}>Inhale</button>
                                <button className="brain-action-btn" onClick={() => handleBreathChoice('Exhale')}>Exhale</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {breathRound + 1}/{BREATH_TOTAL_ROUNDS}</span>
                                <span>Score: {breathScore}</span>
                            </div>
                        </>
                    )}

                    {breathFinished && (
                        <div className="brain-result">
                            <h3>Breathing rhythm built</h3>
                            <p>Correct breaths: {breathScore}/{BREATH_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetBreath}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'focus' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Focus Freeze</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!focusFinished && (
                        <>
                            <p className="brain-instruction">Signal: {focusSignal.label}</p>
                            <p className="oops-message">Tap on Go signals, wait on Stop signals.</p>
                            <div className="delay-actions">
                                <button className="brain-action-btn" onClick={() => handleFocusChoice('tap')}>Tap</button>
                                <button className="brain-action-btn" onClick={() => handleFocusChoice('wait')}>Wait</button>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {focusRound + 1}/{FOCUS_TOTAL_ROUNDS}</span>
                                <span>Score: {focusScore}</span>
                            </div>
                        </>
                    )}

                    {focusFinished && (
                        <div className="brain-result">
                            <h3>Great inhibition control</h3>
                            <p>Correct actions: {focusScore}/{FOCUS_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetFocus}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'turn' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Turn Taking Builder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!turnFinished && (
                        <>
                            <p className="brain-instruction">Situation: {turnScenario.prompt}</p>
                            <div className="oops-options">
                                {turnScenario.options.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleTurnChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {turnRound + 1}/{TURN_TOTAL_ROUNDS}</span>
                                <span>Score: {turnScore}</span>
                            </div>
                        </>
                    )}

                    {turnFinished && (
                        <div className="brain-result">
                            <h3>Social calm unlocked</h3>
                            <p>Turn-taking choices: {turnScore}/{TURN_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTurn}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'sequence' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Reset Routine</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!sequenceFinished && (
                        <>
                            <p className="brain-instruction">Step {sequenceStep + 1}: choose the right calm routine step.</p>
                            <p className="oops-message">{sequenceMessage}</p>

                            <div className="oops-options">
                                {sequenceOptions.map((option) => (
                                    <button
                                        key={option}
                                        className="brain-action-btn oops-option"
                                        onClick={() => handleSequenceChoice(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Correct steps: {sequenceScore}/{SEQUENCE_TOTAL_STEPS}</span>
                            </div>
                        </>
                    )}

                    {sequenceFinished && (
                        <div className="brain-result">
                            <h3>Routine mastered</h3>
                            <p>Calm sequence score: {sequenceScore}/{SEQUENCE_TOTAL_STEPS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetSequence}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'twins' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Color Twins Tap</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!twinsFinished && (
                        <>
                            <p className="brain-instruction">
                                Target color: <strong style={{ color: colorHex(twinsData.targetColor), textTransform: 'capitalize' }}>{twinsData.targetColor}</strong>
                            </p>
                            <p className="oops-message">{twinsMessage}</p>

                            <div className="twins-board">
                                <div>
                                    <h4>Left Hand</h4>
                                    <div className="twins-options">
                                        {twinsData.leftOptions.map((colorName) => (
                                            <button
                                                key={`left-${twinsRound}-${colorName}`}
                                                className={`twins-color-btn ${twinsLeftPick === colorName ? 'selected' : ''}`}
                                                onClick={() => handleTwinsPick('left', colorName)}
                                                aria-label={`Left ${colorName}`}
                                            >
                                                <span className="twins-color-dot" style={{ background: colorHex(colorName) }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4>Right Hand</h4>
                                    <div className="twins-options">
                                        {twinsData.rightOptions.map((colorName) => (
                                            <button
                                                key={`right-${twinsRound}-${colorName}`}
                                                className={`twins-color-btn ${twinsRightPick === colorName ? 'selected' : ''}`}
                                                onClick={() => handleTwinsPick('right', colorName)}
                                                aria-label={`Right ${colorName}`}
                                            >
                                                <span className="twins-color-dot" style={{ background: colorHex(colorName) }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {twinsRound + 1}/{COLOR_TWINS_TOTAL_ROUNDS}</span>
                                <span>Matches: {twinsScore}</span>
                            </div>
                        </>
                    )}

                    {twinsFinished && (
                        <div className="brain-result">
                            <h3>Bilateral focus unlocked</h3>
                            <p>Target matches: {twinsScore}/{COLOR_TWINS_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTwins}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'flash' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Flash Memory Match</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!flashFinished && (
                        <>
                            <p className="brain-instruction">
                                Memorize the model on the right. Then pick the exact same shape and color.
                            </p>

                            <div className="flash-board">
                                <div>
                                    <h4>Choices</h4>
                                    <div className="flash-options-grid">
                                        {flashData.options.map((item) => (
                                            <button
                                                key={`${flashRound}-${item.key}`}
                                                className="flash-option-btn"
                                                disabled={flashReveal}
                                                onClick={() => handleFlashChoice(item.key)}
                                            >
                                                <div className="shape-glyph" style={shapeStyle(item.shape, item.color)} />
                                                <span>{item.color} {item.shape}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4>Model Card</h4>
                                    <div className={`flash-model-card ${flashReveal ? 'showing' : 'hidden'}`}>
                                        {flashReveal ? (
                                            <>
                                                <div className="shape-glyph" style={shapeStyle(flashData.target.shape, flashData.target.color)} />
                                                <span>{flashData.target.color} {flashData.target.shape}</span>
                                                <small>Memorize: {flashRevealSeconds}s</small>
                                            </>
                                        ) : (
                                            <span className="flash-hidden-mark">?</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {flashRound + 1}/{FLASH_TOTAL_ROUNDS}</span>
                                <span>Correct: {flashScore}</span>
                            </div>
                        </>
                    )}

                    {flashFinished && (
                        <div className="brain-result">
                            <h3>Memory power built</h3>
                            <p>Exact matches: {flashScore}/{FLASH_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetFlash}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'trail' && (
                <div className="brain-lab-panel">
                    <div className="brain-lab-header">
                        <h2>Color Trail Echo</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!trailFinished && (
                        <>
                            <p className="brain-instruction">Watch and copy the {COLOR_TRAIL_LENGTH}-color sequence.</p>
                            <p className="oops-message">{trailMessage}</p>

                            <div className="trail-preview">
                                {trailShowing && trailShowIndex < trailSequence.length ? (
                                    <span className="trail-preview-dot" style={{ background: colorHex(trailSequence[trailShowIndex]) }} />
                                ) : (
                                    <span className="trail-preview-dot trail-idle-dot" />
                                )}
                            </div>

                            <div className="trail-options-row">
                                {TOUCH_COLORS.map((colorName) => (
                                    <button
                                        key={`trail-${colorName}`}
                                        className="trail-color-btn"
                                        onClick={() => handleTrailTap(colorName)}
                                        disabled={trailShowing}
                                        aria-label={`Tap ${colorName}`}
                                    >
                                        <span className="trail-color-dot" style={{ background: colorHex(colorName) }} />
                                    </button>
                                ))}
                            </div>

                            <div className="brain-stats-row">
                                <span>Progress: {trailStep}/{COLOR_TRAIL_LENGTH}</span>
                            </div>
                        </>
                    )}

                    {trailFinished && (
                        <div className="brain-result">
                            <h3>Excellent sequence memory</h3>
                            <p>You repeated all {COLOR_TRAIL_LENGTH} colors in the right order.</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetTrail}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'grid-hunt' && (
                <div className="brain-lab-panel brain-lab-compact-panel">
                    <div className="brain-lab-header">
                        <h2>Grid Sequence Hunt</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!gridHuntFinished && (
                        <>
                            <p className="brain-instruction">
                                Tap this order: <strong>{gridHuntPromptSymbols.join(' | ')}</strong>
                            </p>
                            <p className="oops-message">{gridHuntMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{gridHuntAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleGridHuntModeToggle}>
                                    {gridHuntAdvanced ? 'Switch to Easy (8x8, 4 steps)' : 'Switch to Advanced (10x10, 6 steps)'}
                                </button>
                            </div>

                            <div className="grid-hunt-board" style={{ gridTemplateColumns: `repeat(${activeGridHuntConfig.size}, minmax(0, 1fr))` }}>
                                {gridHuntData.cells.map((cell) => {
                                    const isTapped = gridHuntTappedIds.includes(cell.id);
                                    return (
                                        <button
                                            key={cell.id}
                                            className={`grid-hunt-cell ${isTapped ? 'done' : ''}`}
                                            onClick={() => handleGridHuntTap(cell.id)}
                                            aria-label={`Symbol ${cell.symbol}`}
                                        >
                                            <span className="grid-hunt-symbol">{cell.symbol}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {gridHuntRound + 1}/{GRID_HUNT_TOTAL_ROUNDS}</span>
                                <span>Step: {gridHuntStep}/{activeGridHuntConfig.sequenceLength}</span>
                                <span>Score: {gridHuntScore}</span>
                            </div>
                        </>
                    )}

                    {gridHuntFinished && (
                        <div className="brain-result">
                            <h3>Sequence hunter complete</h3>
                            <p>Correct rounds: {gridHuntScore}/{GRID_HUNT_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetGridHunt}>Play Again</button>
                                <button className="game-btn-back" onClick={() => setView('hub')}>Back to Games</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'letter-path' && (
                <div className="brain-lab-panel brain-lab-compact-panel">
                    <div className="brain-lab-header">
                        <h2>Letter Path Builder</h2>
                        <button className="game-btn-exit" onClick={() => setView('hub')}>Back</button>
                    </div>

                    {!letterFinished && (
                        <>
                            <p className="brain-instruction">
                                Word to build: <strong>{letterCurrentWord}</strong>
                            </p>
                            <p className="oops-message">{letterMessage}</p>

                            <div className="grid-hunt-toggle-row">
                                <span>Mode: <strong>{letterGameAdvanced ? 'Advanced' : 'Easy'}</strong></span>
                                <button className="grid-hunt-mode-toggle" onClick={handleLetterModeToggle}>
                                    {letterGameAdvanced ? 'Switch to Easy (8x8)' : 'Switch to Advanced (10x10)'}
                                </button>
                            </div>

                            <div className="letter-game-built">
                                Built: <strong>{letterBuiltPart || '_'}</strong>
                            </div>

                            <div className="letter-grid-board" style={{ gridTemplateColumns: `repeat(${activeLetterGameConfig.size}, minmax(0, 1fr))` }}>
                                {letterData.cells.map((cell) => {
                                    const isTapped = letterTappedIds.includes(cell.id);
                                    return (
                                        <button
                                            key={cell.id}
                                            className={`letter-grid-cell ${isTapped ? 'done' : ''}`}
                                            onClick={() => handleLetterTap(cell.id, cell.letter)}
                                            aria-label={`Letter ${cell.letter}`}
                                        >
                                            <span className="letter-grid-symbol">{cell.letter}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="brain-stats-row">
                                <span>Round: {letterRound + 1}/{LETTER_GAME_TOTAL_ROUNDS}</span>
                                <span>Letters: {letterStep}/{letterCurrentWord.length || 0}</span>
                                <span>Score: {letterScore}</span>
                            </div>
                        </>
                    )}

                    {letterFinished && (
                        <div className="brain-result">
                            <h3>Word builder complete</h3>
                            <p>Correct words: {letterScore}/{LETTER_GAME_TOTAL_ROUNDS}</p>
                            <div className="brain-result-actions">
                                <button className="game-btn-start" onClick={resetLetterGame}>Play Again</button>
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
*/
