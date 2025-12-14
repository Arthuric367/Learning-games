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
An overlay or distinct state that appears after a round/question is completed (e.g., correct answer, round finished).
- **Purpose**: Gives the user a pause before the next challenge.
- **Visible Buttons**:
    - **Next Question / Continue**: Single button to proceed to the next round.

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
