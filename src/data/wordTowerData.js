// Word Tower Builder - Game Data Configuration
// This file contains all game configuration, categories, Tetris shapes, and difficulty settings

const WORD_TOWER_DATA = {
    // ===== GRID CONFIGURATION =====
    gridRows: 12,  // Vertical grid size (taller for mobile)
    gridCols: 6,   // Horizontal grid size (narrower for mobile)

    // ===== TIMING CONFIGURATION =====
    baseDropInterval: 2000,  // 2 seconds - initial drop speed
    minDropInterval: 2000,    // 2 seconds - minimum drop speed (safety limit)
    wrongClickPenalty: 2000,  // 2 seconds - time reduced on wrong click

    // ===== SCORING CONFIGURATION =====
    pointsPerBlock: 3,        // Points for matching one block
    pointsPerRow: 10,         // Points for clearing a complete row
    comboMultiplier: 2,       // Score multiplier for consecutive correct matches
    pointsToLevelUp: 100,     // Points needed to advance to next level

    // ===== DIFFICULTY CONFIGURATION =====
    warningHeight: 10,        // Show warning when blocks reach this row (out of 12)
    level1PreFill: 3,         // Number of pre-filled rows in Level 1
    level2PreFill: 5,         // Number of pre-filled rows in Level 2

    // ===== TETRIS SHAPES =====
    // Each shape is a 2D array where 1 = filled cell, 0 = empty cell
    // These are the 7 classic Tetris pieces
    shapes: {
        I: {
            pattern: [[1, 1, 1, 1]],  // Straight line (4 blocks)
            name: 'I'
        },
        O: {
            pattern: [
                [1, 1],
                [1, 1]
            ],  // Square (4 blocks)
            name: 'O'
        },
        T: {
            pattern: [
                [0, 1, 0],
                [1, 1, 1]
            ],  // T-shape (4 blocks)
            name: 'T'
        },
        L: {
            pattern: [
                [1, 0],
                [1, 0],
                [1, 1]
            ],  // L-shape (4 blocks)
            name: 'L'
        },
        J: {
            pattern: [
                [0, 1],
                [0, 1],
                [1, 1]
            ],  // J-shape (reverse L, 4 blocks)
            name: 'J'
        },
        S: {
            pattern: [
                [0, 1, 1],
                [1, 1, 0]
            ],  // S-shape (4 blocks)
            name: 'S'
        },
        Z: {
            pattern: [
                [1, 1, 0],
                [0, 1, 1]
            ],  // Z-shape (4 blocks)
            name: 'Z'
        }
    },

    // ===== WORD CATEGORIES =====
    // Each category has a name, color, and list of words (3-6 letters for young kids)
    categories: {
        colors: {
            name: 'Colors',
            color: '#9B59B6',  // Purple
            words: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PINK', 'ORANGE', 'BLACK', 'WHITE', 'BROWN', 'GRAY']
        },
        family: {
            name: 'Family',
            color: '#E91E63',  // Pink
            words: ['MOM', 'DAD', 'SISTER', 'BROTHER', 'BABY', 'GRANDMA', 'GRANDPA', 'UNCLE', 'AUNT']
        },
        animals: {
            name: 'Animals',
            color: '#4CAF50',  // Green
            words: ['DOG', 'CAT', 'BIRD', 'FISH', 'LION', 'TIGER', 'BEAR', 'MONKEY', 'RABBIT', 'MOUSE']
        },
        stationary: {
            name: 'Stationary',
            color: '#2196F3',  // Blue
            words: ['PEN', 'PENCIL', 'ERASER', 'RULER', 'BOOK', 'CRAYON', 'PAPER', 'GLUE', 'TAPE']
        },
        foods: {
            name: 'Foods',
            color: '#FF9800',  // Orange
            words: ['APPLE', 'PIZZA', 'CAKE', 'BREAD', 'RICE', 'MILK', 'EGG', 'CHEESE', 'BANANA', 'COOKIE']
        }
    },

    // ===== LEVEL-UP EFFECTS =====
    // Effects that players can choose after Level 2
    effects: {
        speedUp: {
            id: 'speedUp',
            name: 'Drop Speed Up',
            description: 'Blocks fall faster! ⚡',
            icon: '⚡',
            // Function to apply effect: reduces drop interval by 2 seconds
            apply: (currentInterval) => Math.max(WORD_TOWER_DATA.minDropInterval, currentInterval - 2000)
        },
        moreBlocks: {
            id: 'moreBlocks',
            name: 'More Blocks',
            description: 'Start with more blocks! 📦',
            icon: '📦',
            // Function to apply effect: adds 1 more pre-filled row
            apply: (currentPreFill) => currentPreFill + 1
        }
    }
};

export default WORD_TOWER_DATA;
