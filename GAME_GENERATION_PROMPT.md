# Game Generation Prompt Template

**Role:** Expert Game Developer & Educational Technology Specialist

**Objective:**
Create an engaging, interactive web-based educational game for children (Target Age: 5-7 years).

## Project Overview
**Theme:** [Insert Theme, e.g., Dinosaurs, Space, Underwater]
**Learning Goal:** [Insert Goal, e.g., English Pronouns, Basic Math, Vocabulary]
**Platform:** Web (Mobile/Tablet responsive, specifically iPad touch-friendly).

## Technical Specifications
- **Framework:** React (Latest)
- **Build Tool:** Vite
- **Styling:** CSS Modules or Vanilla CSS (Focus on animations and responsiveness)
- **Language:** JavaScript/JSX

## Core Features & Mechanics

1.  **Game Loop:**
    - Present a question (text + audio).
    - Display visual options (images/text).
    - User selects an answer.
    - Immediate feedback (Audio + Visual).

2.  **Progression System:**
    - **Visual Growth:** A central character or element that evolves/grows with correct answers (e.g., "Make the giraffe grow").
    - **Milestones:** Special animations or pauses at certain scores (e.g., 5, 10 points).
    - **Victory:** A celebration scene (e.g., dancing characters) upon reaching the target score (e.g., 15 points).

3.  **Feedback Mechanisms:**
    - **Correct Answer:** Positive sound effect, character animation, score increment.
    - **Incorrect Answer:** "Shake" effect on screen/card, gentle "try again" sound, no score penalty.

4.  **Audio Integration:**
    - **Text-to-Speech (TTS):** Read questions and answers aloud using browser API or provided assets.
    - **Sound Effects:** Pre-loaded sounds for correct/incorrect actions and victory.

5.  **UI/UX Design:**
    - **Style:** Cartoon/Hand-drawn aesthetic. Bright, engaging colors.
    - **Accessibility:** Large touch targets for children.
    - **Bilingual Support:** Interface elements should support dual languages (e.g., English/Chinese) for parent instructions.

## Data Structure
- Questions should be stored in a structured format (JSON/Array) to allow for easy shuffling and expansion.
- Example structure:
  ```json
  {
    "id": 1,
    "question": "___ is a dinosaur.",
    "options": ["He", "She", "It"],
    "answer": "He",
    "image": "dino_1.png"
  }
  ```

## Deliverables
1.  Fully functional source code.
2.  `README.md` with installation and running instructions.
3.  Placeholder assets or instructions for asset generation.
