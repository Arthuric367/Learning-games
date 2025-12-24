# Game UI Style Guide

## Buttons

All games should use the following standard button styles and texts to ensure consistency.

### Exit Button
- **Text**: "Exit"
- **Style**: Orange background, White text.
- **CSS Class**: `game-btn-exit`
- **Usage**: Displayed in the game area (usually top-right or top-left) to allow the user to quit the current game.

### Game Start Button
- **Text**: "Game Start"
- **Style**: Green background, White text, Large font.
- **CSS Class**: `game-btn-start`
- **Usage**: Main action button on the Start Screen.

### Back to Main Menu Button
- **Text**: "Back to Main Menu"
- **Style**: Blue/Info background, White text.
- **CSS Class**: `game-btn-back`
- **Usage**: Secondary action on Start Screen, Win Screen, or Game Over Screen to return to the app's main menu.

## Game Container Rules
All games must adhere to the following CSS rules to ensure proper display and interaction on iPad devices.

### Container Style
- **CSS Class**: Game specific container (e.g., `.sentence-train-container`)
- **Required Properties**:
  ```css
  width: 100%;
  height: 90vh; /* Viewport height for iPad */
  overflow: hidden; /* Prevent scrolling */
  touch-action: none; /* Prevent browser gestures like scroll/zoom */
  position: relative;
  width: 100%;
  height: 90vh; /* Viewport height for iPad */
  overflow: hidden; /* Prevent scrolling */
  touch-action: none; /* Prevent browser gestures like scroll/zoom */
  position: relative;
  padding-top: max(20px, env(safe-area-inset-top)); /* Respect iPad Safe Area */
  box-sizing: border-box;
  ```
- **Note**: Ensure internal content uses `box-sizing: border-box` and appropriate flexbox layouts to fit within this fixed 90vh container.

## Start Screens

All games should use the standard Start Screen layout to ensure consistency and prevent scrolling issues.

### Layout Container
- **CSS Class**: `.game-start-screen`
- **Style**:
    - Flexbox column, centered content.
    - **Background**: White with high opacity (e.g., 90%).
    - **Padding**: 30px 20px.
    - **Max-Width**: 600px.
    - **Border Radius**: 25px.
- **Usage**: Wraps the entire content of the start screen state.

### Elements
1.  **Title**
    - **CSS Class**: `.game-start-title`
    - **Style**: Font size 2.5rem - 3rem, dark color.
2.  **Image**
    - **CSS Class**: `.game-start-image`
    - **Style**: Max-height 250px, object-fit contain. Important to prevent header/footer overflow.
3.  **Buttons Area**
    - **Required Buttons**:
        - "Game Start" (`.game-btn-start`)
        - "Back to Main Menu" (`.game-btn-back`)

## Game Action States

Each game must be structured into independent states with specific UI requirements.

### 1. Start Screen (`start_screen`)
The entry point of the game.
- **Visible Buttons**:
    1.  **Game Start**
    2.  **Back to Main Menu**

### 2. Playing (`playing`)
The active gameplay state.
- **Visible Buttons**:
    - **Exit** (`.game-btn-exit`): Positioned in the header/corner.
- **Note**: No other navigation buttons should be visible.

### 3. Next Question Overlay (`next_question`)
An overlay or distinct state that appears after a round/question is completed correctly.
- **Purpose**: Celebrates the success and gives the user a pause before the next challenge.
- **Visual Requirements**:
    - **Centered Overlay**: Darkened background with a centered, high-contrast popup.
    - **Celebratory Text**: Encouraging messages with emojis (e.g., "You are correct! ✨").
    - **Celebratory Image**: High-quality cartoon image (e.g., cake, star, trophy) to reward the child visually.
    - **Single Action Button**: "Next Question" button to proceed.

### 4. Win Screen (`win_screen`)
Displayed when the game is successfully completed.
- **Visible Buttons**:
    1.  **Play Again** (Styled like Start Button)
    2.  **Back to Main Menu**

### 5. Game Over (`game_over`)
Displayed when the player loses (if applicable).
- **Visible Buttons**:
    1.  **Play Again** (Styled like Start Button)
    2.  **Back to Main Menu**

## Audio and Feedback

To ensure a consistent and natural user experience, all games must use the central audio utility for speech synthesis and sound effects.

### Speech Synthesis
- **Utility**: Use `speakWithFemaleVoice` or `speakEncouraging` from `../utils/audio.js`.
- **Consistency**: All spoken text (sentences, instructions, feedback) should use this utility to ensure the same high-quality voice is used across the entire application.
- **Natural Sound**: The utility is configured to prioritize the browser's high-quality default voice. Avoid implementing local `speechSynthesis` calls within individual game components.

### Sound Effects
- **Utility**: Use `playSound(type)` from `../utils/audio.js`.
- **Standard Types**:
    - `'correct'`: Plays a success sound and an encouraging message.
    - `'incorrect'`: Plays a "try again" message.
    - `'win'`: Plays a victory sound (if defined).
## Asset Organization

To keep the project manageable and clean, all assets must be organized into specific subdirectories within `src/assets/`.

### Directory Structure
- **Root `src/assets/`**: Common assets used across multiple games or by the main application (e.g., `celebration_cake.png`, `main_menu_hero.png`, `shield_icon.png`).
- **Game-Specific Folders**: Each major game has its own dedicated folder:
    - `pronoun_adventure/`
    - `question_word_racer/`
    - `wonder_world_blaster/`
    - `puzzle_matcher/`
    - `listening_bridge/`
    - `sentence_train/`
    - `adjective_artist/`
    - `spelling_bee/`

### Rules
1.  **Isolation**: Game-specific sprites, backgrounds, and icons should live only in their respective folder.
2.  **Naming**: Use descriptive, lowercase filenames with underscores (e.g., `race_car.png`).
3.  **Imports**: Always point imports to the full path: `import myImg from '../assets/game_name/my_img.png'`.
4.  **CSS**: Use relative paths in CSS: `background-image: url('../assets/game_name/bg.png')`.

## Game Design Best Practices

### Randomization
To ensure educational games remain engaging and prevent children from memorizing patterns:
1.  **Randomize Answer Positions**: Always shuffle the order of options/choices so the correct answer appears in different positions each round.
2.  **Session Randomization**: Randomly select a fixed number of questions (standard is 5) from the database at the start of each session or when "Try Again" is clicked.
3.  **Round-by-Round Variety**: In interactive or theme-based games, ensure targets, colors, or themes are randomized for each round within the 5-round session.
4.  **Implementation**: Use array shuffling (e.g., `.sort(() => Math.random() - 0.5)`) for both answer positions and session pools.

## Round-Based Game Control Pattern

For games with a fixed number of questions/rounds (e.g., 5 questions to win), follow this proven pattern based on the Spelling Bee Garden implementation.

### Game Type Comparison

The application supports three main game control patterns:

| Game Type | Win Condition | Lose Condition | Progress Indicator | Examples |
|-----------|--------------|----------------|-------------------|----------|
| **HP-based** | Complete objective before HP depletes | HP reaches 0 | Health bar/hearts | Pronoun Adventure |
| **Time-based** | Complete objective before time expires | Timer reaches 0 | Countdown timer | Question Word Racer |
| **Round-based** | Complete all N rounds (e.g., 5) | N/A (no fail state) | Round counter (e.g., "3/5") | Spelling Bee Garden |

### Data Structure Pattern

Separate game configuration from content in your data file (e.g., `spellingBeeData.js`):

```javascript
const GAME_DATA = {
    roundsPerSession: 5,  // Configuration constant
    vocabulary: [         // Content pool (larger than roundsPerSession)
        { id: 'item1', /* question data */ },
        { id: 'item2', /* question data */ },
        // ... more items
    ]
};
```

**Key Principles**:
- Define `roundsPerSession` as a constant at the data level
- Keep the content pool larger than `roundsPerSession` for variety
- Structure each item with a unique `id` and all necessary question data

### State Management

Implement these essential state variables:

```javascript
const [gameState, setGameState] = useState('start');  // start, playing, next_question, win
const [currentRound, setCurrentRound] = useState(0);  // 1-indexed for display
const [sessionVocabulary, setSessionVocabulary] = useState([]);  // Randomized subset
const [currentWord, setCurrentWord] = useState(null);  // Current question data
```

**State Descriptions**:
- `gameState`: Controls which UI screen is displayed
- `currentRound`: Tracks progress (1-indexed: 1, 2, 3, 4, 5)
- `sessionVocabulary`: The randomized subset of questions for this session
- `currentWord`: The active question/item being displayed

### Round Flow Control

#### 1. Session Initialization (`handleStart`)

```javascript
const handleStart = () => {
    // Shuffle the full pool and select N items
    const shuffled = [...GAME_DATA.vocabulary].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, GAME_DATA.roundsPerSession);
    
    setSessionVocabulary(selected);
    setCurrentRound(1);  // Start at round 1 (1-indexed)
    initRound(0, selected);  // Load first question (0-indexed array)
};
```

#### 2. Round Initialization (`initRound`)

```javascript
const initRound = useCallback((roundIndex, vocab = null) => {
    const currentVocab = vocab || sessionVocabulary;
    const word = currentVocab[roundIndex];  // 0-indexed array access
    
    // Shuffle options for this round (additional randomization)
    const shuffledOptions = [...word.options].sort(() => Math.random() - 0.5);
    const wordWithShuffledOptions = { ...word, options: shuffledOptions };
    
    setCurrentWord(wordWithShuffledOptions);
    setGameState('playing');
    
    // Optional: Speak instructions
    setTimeout(() => speakWithFemaleVoice(`Instruction for ${word.name}`), 500);
}, [sessionVocabulary]);
```

#### 3. Answer Validation and Round Completion

```javascript
const handleAnswer = (userAnswer) => {
    if (userAnswer === currentWord.correctAnswer) {
        playSound('correct');
        
        setTimeout(() => {
            // Check if more rounds remain
            if (currentRound < GAME_DATA.roundsPerSession) {
                setGameState('next_question');  // Show celebration overlay
            } else {
                playSound('win');
                setGameState('win');  // All rounds complete!
            }
        }, 1000);
    } else {
        playSound('incorrect');
        // Allow retry (stay in 'playing' state)
    }
};
```

#### 4. Advancing to Next Round

```javascript
const handleNextRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    initRound(nextRound - 1);  // Convert to 0-indexed for array access
};
```

### UI Implementation

#### Round Progress Display

```jsx
<div className="sb-header">
    <div className="sb-round-info">
        Round {currentRound} / {GAME_DATA.roundsPerSession}
    </div>
    <button className="game-btn-exit" onClick={onBack}>Exit</button>
</div>
```

#### Next Question Overlay

```jsx
{gameState === 'next_question' && (
    <div className="sb-overlay">
        <div className="sb-overlay-content">
            <img src={celebrationImg} alt="Success" className="sb-success-img" />
            <h2 className="sb-success-text">Great Job! 🎉</h2>
            <button className="game-btn-start" onClick={handleNextRound}>
                Next Level
            </button>
        </div>
    </div>
)}
```

### Key Implementation Details

1. **Index Management**: Use 0-indexed arrays but 1-indexed display
   - `currentRound`: 1, 2, 3, 4, 5 (for UI display)
   - Array access: `sessionVocabulary[currentRound - 1]`

2. **Randomization Layers**:
   - **Session level**: Shuffle and select N items from full pool
   - **Round level**: Shuffle answer options for each question

3. **State Transitions**:
   - `start` → `playing` (on Game Start)
   - `playing` → `next_question` (on correct answer, if rounds remain)
   - `next_question` → `playing` (on Next Level button)
   - `playing` → `win` (on correct answer, if last round)
   - `win` → `playing` (on Play Again, resets session)

4. **No Fail State**: Round-based games typically don't have a "game over" state. Players can retry incorrect answers until they succeed.

5. **Session Reset**: On "Play Again", re-shuffle and select a new subset to ensure variety.

### Best Practices

- **Clear Separation**: Keep `next_question` celebration distinct from round advancement logic
- **Callback Dependencies**: Include `sessionVocabulary` in `initRound` dependencies
- **Audio Timing**: Use `setTimeout` to delay speech after state changes
- **Vocabulary Passing**: Pass `selected` vocabulary to `initRound` on first call to avoid race conditions
- **Progress Feedback**: Always show current round and total rounds in the UI
- **Celebration**: Use the `next_question` state to give positive reinforcement between rounds

