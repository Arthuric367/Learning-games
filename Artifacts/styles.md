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
2.  **Implementation**: Use array shuffling (e.g., `.sort(() => Math.random() - 0.5)`) before rendering options.
3.  **Example**: In a multiple-choice game, if "B" is the correct answer, it should not always appear as the first option.

