# Project Function Design

## Overview
Pronoun Picnic is a collection of educational mini-games designed for children to learn English concepts such as pronouns, sentence structure, question words, and vocabulary.

## Game Modules

### 1. Sentence Train
**Concept**: Sentence Construction
**Goal**: Assemble a scrambled sentence by placing words in the correct order on train cars.
**Mechanics**:
- **Drag & Drop**: User drags word cards from a bank to empty slots on the train.
- **Validation**: Game checks if the sequence matches the target sentence.
- **Feedback**:
    - **Correct**: Train moves out, score increases (+8).
    - **Win Screen**: Displays "Choo Choo! Great Job!" with "Next Sentence" and "Back to Main Menu" options.

### 2. Pronoun Adventure
**Concept**: Pronoun Usage
**Goal**: Help a growing giraffe by answering pronoun questions.
**Mechanics**:
- **Quiz**: Multiple-choice questions about pronouns (e.g., "_____ is my friend").
- **Progression**:
    - Correct answers grow the giraffe.
    - Milestones at scores 5 and 10.
- **Feedback**:
    - **Correct**: Giraffe eats leaves, positive audio.
    - **Incorrect**: Screen shakes, "Try again" audio.

### 3. Puzzle Matcher
**Concept**: Prepositions & Vocabulary
**Goal**: Reveal a hidden picture by answering preposition questions.
**Mechanics**:
- **Grid Reveal**: An image is covered by a 3x3 grid.
- **Quiz**: Correctly answering a question unlocks a grid piece.
- **Feedback**:
    - **Correct**: Grid piece disappears, revealing part of the image.
    - **Win**: Full image revealed when all questions are answered.

### 4. Question Word Racer
**Concept**: Question Words (Who, What, Where, When, Why)
**Goal**: Race a car by choosing the correct question word.
**Mechanics**:
- **Racing & Speed**: Correct answers increase car speed; incorrect answers slow it down.
- **Power-ups**: 3 correct answers in a row grant a Shield to block Dino Attacks.
- **Hazards**: Random Dino attacks can slow the player down if unshielded.

### 5. Wonder World Blaster
**Concept**: Category Classification
**Goal**: Pop bubbles containing items that match a specific category (e.g., "Fruit", "Animal") to defeat a monster.
**Mechanics**:
- **Shooting**: Click on bubbles floating up.
- **Boss Fight**: Correct hits damage the boss (5 HP).
- **Levels**:
    - **Level 1**: Practice/Unlimited Lives.
    - **Level 2**: Challenge/5 Lives.
- **Combo System**: Consecutive correct hits build a combo.

### 6. Listening Bridge
**Concept**: Listening Comprehension
**Goal**: Build a bridge for an adventurer by arranging words to match a spoken sentence.
**Mechanics**:
- **Audio**: Button to play/replay the target sentence.
- **Drag & Drop**: Place words on bridge planks.
- **Validation**: Bridge completes if the word order matches the audio.
- **Feedback**: Adventurer crosses the bridge on win.

## Common UI Elements
- **Start Screen**: Standardized card layout with Title, Image, Game Start, and Back to Main Menu buttons.
- **Exit Button**: Orange "Exit" button in the top corner during gameplay.
- **Win/Game Over Screen**: Celebration/Status screen with "Play Again" and "Back to Main Menu" options.
- **Next Question**: Overlay or state between rounds.

## System Architecture

### Data Management
- **Rule**: All game data (questions, words, levels, assets paths) must be decoupled from the component logic.
- **Location**: All data files must reside in `src/data`.
- **Implementation**: Games should import data from these files rather than having hardcoded arrays within the `.jsx` files.

### Asset Management
- **Rule**: Each game must have a dedicated folder under `src/assets` (e.g., `src/assets/sentence_train`).
- **Organization**: All images, sounds, and specific media for that game must be stored within its dedicated folder.
- **Documentation**: If a specific asset structure or naming convention is required, it should be documented within the game's design section.
