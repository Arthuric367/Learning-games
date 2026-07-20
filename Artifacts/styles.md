# Game UI Style Guide

This guide defines the shared interaction, layout, asset, and game-flow rules for touch-first educational games in this project.

## Scope

These rules are for:
- iPhone Safari
- iPad Safari
- touch-first mobile browsers
- responsive web play on phones and tablets

Core interaction rule:
- Horizontal scrolling must be blocked.
- Vertical scrolling is allowed when content needs it.

## Buttons

All games should reuse the shared button classes for visual consistency.

### Shared Button Classes

#### Exit Button
- Text: `Exit`
- Style: Orange background, white text.
- CSS class: `game-btn-exit`
- Usage: Displayed in the game area header or corner to leave the current game.

#### Primary Action Button
- Style: Green background, white text, large font.
- CSS class: `game-btn-start`
- Usage: Main positive action such as start, play again, next level, or retry.

#### Secondary Navigation Button
- Style: Blue/info background, white text.
- CSS class: `game-btn-back`
- Usage: Returns to the main menu or game hub.

### Button Text Standards

There are 2 approved button-text systems.

#### Standard Game Texts
- `Game Start`
- `Back to Main Menu`
- `Play Again`
- `Exit`

#### Brain Games Lab Texts
- `Enter Brain Lab`
- `Play Again`
- `Back to Games`
- `Back`
- `Exit`

Rule:
- Keep the shared CSS classes.
- Allow text labels to vary by game family.

## Game Container Rules

Every game must choose the correct container pattern based on its interaction model.

### Universal Container Requirements

All game containers must satisfy these base rules:

```css
width: 100%;
max-width: 100vw;
min-height: 100vh;
min-height: 100dvh;
overflow-x: hidden;
position: relative;
box-sizing: border-box;
padding-top: max(20px, env(safe-area-inset-top));
-webkit-overflow-scrolling: touch;
-webkit-tap-highlight-color: transparent;
```

Layout rule:
- Internal content must use `box-sizing: border-box`, `max-width: 100%`, and responsive flex/grid layouts.
- No child element should expand wider than the viewport.

### Container Pattern A: Scrollable Page Games

Use this for games where the page may need vertical scrolling on phones.

Examples:
- long menus
- tall game boards
- content-rich instruction screens

```css
.game-container {
    overflow-x: hidden;
    overflow-y: auto;
    touch-action: pan-y;
}
```

### Container Pattern B: Fixed-Screen Tap Games

Use this for games that fully fit in one active play area and should not page-scroll during play.

Examples:
- fixed tap boards
- simple matching games
- compact response games

```css
.game-container {
    overflow: hidden;
    touch-action: manipulation;
}
```

Note:
- Use this only when the entire playing layout safely fits on target devices.

### Container Pattern C: Drag, Trace, or Draw Games

Use this for games with canvas, SVG, tracing, drawing, or free finger movement.

Examples:
- line tracing
- path drawing
- drag routing

Outer container:

```css
.game-container {
    overflow-x: hidden;
    overflow-y: auto;
    touch-action: pan-y;
}
```

Interactive surface:

```css
.game-surface {
    touch-action: none;
}
```

Rule:
- The page may allow vertical layout behavior.
- The actual play surface must suppress browser gesture interference.

## Global Browser Interaction Protection

Long-press suppression should be handled globally, not repeated inside every game.

### Global App-Shell Rule

Apply these protections once at the app shell or root wrapper:

```jsx
<div
    onContextMenu={(event) => event.preventDefault()}
    onDragStart={(event) => event.preventDefault()}
>
```

### Global CSS Rule

```css
body,
#root {
    overflow-x: hidden;
    max-width: 100vw;
}

#root,
#root * {
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
}
```

### Per-Game Rule

Do not duplicate long-press suppression inside every game by default.

Only add local interaction overrides when:
- a specific game has a special drawing surface
- a child element still triggers browser behavior unexpectedly
- a media element needs stricter control than the app shell already provides

### Important Limitation

- iPhone Safari cannot guarantee full suppression of every native long-press behavior in every case.
- This is the standard browser-side approach and should be applied consistently.

## Start Screens

All games should use the standard start screen layout unless a game family intentionally defines a different branded entry state.

### Layout Container
- CSS class: `.game-start-screen`
- Style:
    - Flexbox column, centered content.
    - Background: White with high opacity.
    - Padding: `30px 20px`.
    - Max-width: `600px`.
    - Border radius: `25px`.
- Usage: Wraps the entire content of the start screen state.

### Start Screen Elements
1. Title
     - CSS class: `.game-start-title`
     - Style: Font size `2.5rem - 3rem`, dark color.
2. Image
     - CSS class: `.game-start-image`
     - Style: Max-height `250px`, `object-fit: contain`.
3. Buttons Area
     - Required actions depend on game family.

### Start Screen Text Rules

#### Standard Games
- `Game Start`
- `Back to Main Menu`

#### Brain Games Lab
- `Enter Brain Lab`
- `Back to Main Menu`

## Game Action States

Each game should be structured into clear states, but the exact pattern may vary by game type.

### Common States

#### 1. Start Screen (`start_screen`)
- Entry point of the game.
- Typical buttons:
    - primary start action
    - back navigation action

#### 2. Playing (`playing`)
- Active gameplay state.
- Visible button:
    - `Exit` (`game-btn-exit`)

#### 3. Next Question Overlay (`next_question`)
- Optional state.
- Good for round-based games that benefit from a celebration pause.
- Visual requirements:
    - centered overlay
    - celebratory text
    - celebratory image or reward media
    - single next action button

#### 3.5. Wrong Answer Screen (`wrong_answer`)
- Optional state.
- Best for HP/lives systems or games that need a visible failure beat.
- Visual requirements:
    - centered overlay
    - clear incorrect message
    - failure image or video when appropriate
    - encouraging text
    - single continue or next action button

#### 4. Win Screen (`win_screen`)
- Completion state.
- Typical buttons:
    - `Play Again`
    - `Back to Main Menu` or `Back to Games`

#### 5. Game Over (`game_over`)
- Optional loss state.
- Use only when the game truly has a fail condition.

### Important Design Note

These are common states, not mandatory for every future game.

Other valid structures include:
- calm retry loops
- level ladder games
- immediate next-round transitions
- freeplay/no-fail activities
- motor-control surfaces without overlay breaks

## Audio and Feedback

All games should use the shared audio utilities for consistency.

### Speech Synthesis
- Utility: `speakWithFemaleVoice` or `speakEncouraging` from `../utils/audio.js`
- Rule: Avoid raw local `speechSynthesis` calls inside individual game files.

### Sound Effects
- Utility: `playSound(type)` from `../utils/audio.js`
- Standard types:
    - `'correct'`
    - `'incorrect'`
    - `'win'`

## Asset Organization

All assets belong under `src/assets/`.

### Root Shared Assets

Use the root of `src/assets/` for reusable, cross-game, or application-level assets.

Examples:
- `celebration_cake.png`
- `main_menu_hero.png`
- `shield_icon.png`
- `win_screen_celebration.png`

### Game-Specific Asset Folders

Use subfolders for assets tied to a specific game only.

Current folder structure:
- `adjective_artist/`
- `listening_bridge/`
- `pronoun_adventure/`
- `puzzle_matcher/`
- `question_word_racer/`
- `sentence_train/`
- `spelling_bee/`
- `wonder_world_blaster/`
- `word_tower/`

### Asset Rules
1. Isolation
     - Game-specific images, audio, video, and animation files live only in that game's own folder.
2. Shared root usage
     - Universal celebration, menu, or application assets live in root `src/assets/`.
3. Media types
     - Game-specific folders may contain images, audio, or video.
     - Example: a file like `Adventurer_Fall.mp4` belongs in that game's own asset folder, not the shared root.
4. Naming
     - Use descriptive lowercase filenames with underscores when practical.
5. Imports
     - Use full paths such as `import myImg from '../assets/game_name/my_img.png'`.
6. CSS references
     - Use relative asset paths in CSS when needed.

## Game Design Best Practices

### Randomization

Randomization is a configurable per-game design decision, but anti-memorization behavior is mandatory.

#### Mandatory Rule

Every fresh session must reshuffle or re-randomize the playable content.

This applies when the user taps:
- `Game Start`
- `Play Again`
- any button that begins a fresh session

Purpose:
- Prevent the child from memorizing a fixed order or answer pattern across plays.

#### Recommended Randomization Options

Use the combination that fits the game:
1. Shuffle answer positions
2. Shuffle session question pool
3. Shuffle round order
4. Shuffle targets, colors, boards, or tracks
5. Shuffle prompt wording when applicable

#### Configuration Rule

- Round count, session size, difficulty pool, and board variation are per-game decisions.
- Do not assume a universal default such as 5 rounds.

## Round and Session Patterns

Round-based control is one valid pattern, not the default for all future games.

### Supported Pattern Types

Examples include:
- HP-based games
- time-based games
- round-based games
- level ladder games
- calm retry loop games
- freeplay/no-fail games

### Round-Based Pattern Example

The Spelling Bee Garden style pattern remains a valid reference for games that benefit from:
- a defined round count
- between-round celebration overlays
- explicit session progress indicators

Example data pattern:

```javascript
const GAME_DATA = {
    roundsPerSession: 5,
    vocabulary: [
        { id: 'item1' },
        { id: 'item2' }
    ]
};
```

Example state pattern:

```javascript
const [gameState, setGameState] = useState('start');
const [currentRound, setCurrentRound] = useState(0);
const [sessionVocabulary, setSessionVocabulary] = useState([]);
const [currentWord, setCurrentWord] = useState(null);
```

### Round-Based Best Practices

1. Use 0-indexed arrays and 1-indexed display labels.
2. Shuffle both the session pool and answer/option order when needed.
3. Re-randomize every new session.
4. Choose overlays only when they improve pacing for that specific game.
5. Prefer calm retry loops instead of hard fail states when educational flow matters more than punishment.

## Maintenance Rule

When new interaction models are introduced, update this guide before scaling that pattern to multiple games.

