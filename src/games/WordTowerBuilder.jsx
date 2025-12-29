import React, { useState, useEffect, useCallback, useRef } from 'react';
import './WordTowerBuilder.css';
import { playSound, speakWithFemaleVoice } from '../utils/audio';
import WORD_TOWER_DATA from '../data/wordTowerData';

// Asset Imports
import constructionBg from '../assets/word_tower/construction_bg.png';
import craneImg from '../assets/word_tower/crane.png';
import workerHappy from '../assets/word_tower/worker_happy.png';
import workerWorried from '../assets/word_tower/worker_worried.png';
import workerCrying from '../assets/word_tower/worker_crying.png';
import cakeImg from '../assets/celebration_cake.png';

const WordTowerBuilder = ({ onBack }) => {
    // ===== GAME STATE =====
    // Controls which screen is displayed: start, playing, effect_selection, level_up, game_over
    const [gameState, setGameState] = useState('start');

    // ===== GRID STATE =====
    // 2D array (12 rows × 6 cols) where each cell contains:
    // { word, category, color, pieceId } or null if empty
    const [grid, setGrid] = useState([]);

    // ===== CURRENT PIECE STATE =====
    // The falling Tetris piece: { shape, word, category, color, position: {row, col}, id }
    const [currentPiece, setCurrentPiece] = useState(null);

    // ===== THEME & CATEGORY STATE =====
    // Current active category that player needs to match
    const [currentTheme, setCurrentTheme] = useState(null);
    // Previous theme to avoid repetition in random selection
    const [previousTheme, setPreviousTheme] = useState(null);

    // ===== SCORING & PROGRESSION STATE =====
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(1);  // Starts at 1, becomes 2 on consecutive correct

    // ===== DIFFICULTY STATE =====
    const [dropInterval, setDropInterval] = useState(WORD_TOWER_DATA.baseDropInterval);
    const [preFillRows, setPreFillRows] = useState(WORD_TOWER_DATA.level1PreFill);
    const [appliedEffects, setAppliedEffects] = useState([]);  // Track which effects were chosen

    // ===== TIMER STATE =====
    // Tracks when the next auto-drop should occur
    const [nextDropTime, setNextDropTime] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(dropInterval);
    
    // ===== TOP ROW SPAWN TIMER =====
    // Tracks when to spawn a new piece at the top every 10 seconds
    const [nextTopSpawnTime, setNextTopSpawnTime] = useState(null);

    // ===== UI STATE =====
    const [workerState, setWorkerState] = useState('happy');  // happy, worried, crying
    const [showWarning, setShowWarning] = useState(false);    // Warning when blocks reach row 10

    // ===== REFS =====
    const dropTimerRef = useRef(null);
    const countdownRef = useRef(null);
    const topSpawnTimerRef = useRef(null);
    const addPieceToTopRef = useRef(null);

    // ===== UTILITY FUNCTIONS =====

    /**
     * Creates an empty grid (12 rows × 6 cols)
     */
    const createEmptyGrid = useCallback(() => {
        return Array(WORD_TOWER_DATA.gridRows).fill(null).map(() =>
            Array(WORD_TOWER_DATA.gridCols).fill(null)
        );
    }, []);

    /**
     * Finds the center cell of a Tetris shape for word display
     * @param {Array} shape - 2D array representing piece shape
     * @returns {Object} {row, col} of the center cell
     */
    const findCenterCell = useCallback((shape) => {
        const filledCells = [];
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    filledCells.push({ row: r, col: c });
                }
            }
        }
        // Return the middle filled cell (or first if only one)
        const middleIndex = Math.floor(filledCells.length / 2);
        return filledCells[middleIndex] || { row: 0, col: 0 };
    }, []);

    /**
     * Generates a random Tetris piece with a word from a random category
     * @returns {Object} Piece object with shape, word, category, color, position, id
     */
    const generatePiece = useCallback(() => {
        // Get random shape
        const shapeKeys = Object.keys(WORD_TOWER_DATA.shapes);
        const randomShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
        const shape = WORD_TOWER_DATA.shapes[randomShapeKey];

        // Get random category
        const categoryKeys = Object.keys(WORD_TOWER_DATA.categories);
        const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const category = WORD_TOWER_DATA.categories[randomCategoryKey];

        // Get random word from category
        const randomWord = category.words[Math.floor(Math.random() * category.words.length)];

        // Calculate starting position (centered horizontally, at top)
        const startCol = Math.floor((WORD_TOWER_DATA.gridCols - shape.pattern[0].length) / 2);

        // Find the center cell of the piece for word display
        const centerCell = findCenterCell(shape.pattern);

        return {
            shape: shape.pattern,
            shapeName: shape.name,
            word: randomWord,
            category: randomCategoryKey,
            color: category.color,
            position: { row: 0, col: startCol },
            id: Date.now() + Math.random(),  // Unique ID for this piece
            centerCell: centerCell  // Which cell should display the word
        };
    }, [findCenterCell]);

    /**
     * Selects a random theme (category) for the current level
     * In Level 2+, ensures it's different from previous theme
     */
    const selectRandomTheme = useCallback(() => {
        const categoryKeys = Object.keys(WORD_TOWER_DATA.categories);

        // In Level 2+, avoid repeating the same theme
        if (level >= 2 && previousTheme) {
            const availableThemes = categoryKeys.filter(key => key !== previousTheme);
            const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            setPreviousTheme(newTheme);
            setCurrentTheme(newTheme);

            // Announce new theme
            const themeName = WORD_TOWER_DATA.categories[newTheme].name;
            setTimeout(() => speakWithFemaleVoice(`Find ${themeName}!`), 500);
        } else {
            // Level 1: just pick random theme
            const newTheme = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            setPreviousTheme(newTheme);
            setCurrentTheme(newTheme);

            const themeName = WORD_TOWER_DATA.categories[newTheme].name;
            setTimeout(() => speakWithFemaleVoice(`Find ${themeName}!`), 500);
        }
    }, [level, previousTheme]);

    /**
     * Pre-fills the bottom rows with random blocks
     * Used at level start for difficulty
     * @param {number} numRows - Number of rows to pre-fill
     * @param {string} matchingTheme - Theme to use for 50% of blocks (Level 1)
     */
    const preFillGrid = useCallback((numRows, matchingTheme) => {
        const newGrid = createEmptyGrid();
        const categoryKeys = Object.keys(WORD_TOWER_DATA.categories);

        for (let row = WORD_TOWER_DATA.gridRows - numRows; row < WORD_TOWER_DATA.gridRows; row++) {
            for (let col = 0; col < WORD_TOWER_DATA.gridCols; col++) {
                // 50% chance to fill this cell
                if (Math.random() < 0.5) {
                    // In Level 1, 50% should match theme, 50% random
                    // In Level 2+, ensure at least some matches exist
                    let categoryKey;
                    if (level === 1) {
                        categoryKey = Math.random() < 0.5 ? matchingTheme :
                            categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                    } else {
                        // Level 2+: random categories, but ensure some matches
                        categoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                    }

                    const category = WORD_TOWER_DATA.categories[categoryKey];
                    const randomWord = category.words[Math.floor(Math.random() * category.words.length)];

                    newGrid[row][col] = {
                        word: randomWord,
                        category: categoryKey,
                        color: category.color,
                        pieceId: `prefill-${row}-${col}`
                    };
                }
            }
        }

        setGrid(newGrid);
    }, [createEmptyGrid, level]);

    /**
     * Checks if a piece can be placed at a specific position
     * @param {Array} shape - 2D array representing piece shape
     * @param {number} row - Row position
     * @param {number} col - Column position
     * @param {Array} gridToCheck - Grid to check against (optional, uses current grid if not provided)
     * @returns {boolean} True if position is valid
     */
    const canPlacePiece = useCallback((shape, row, col, gridToCheck = null) => {
        // If no grid provided, we'll need to get it from state in the calling function
        const checkGrid = gridToCheck || grid;
        
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const gridRow = row + r;
                    const gridCol = col + c;

                    // Check boundaries
                    if (gridRow < 0 || gridRow >= WORD_TOWER_DATA.gridRows ||
                        gridCol < 0 || gridCol >= WORD_TOWER_DATA.gridCols) {
                        return false;
                    }

                    // Check if cell is occupied
                    if (checkGrid[gridRow] && checkGrid[gridRow][gridCol] !== null) {
                        return false;
                    }
                }
            }
        }
        return true;
    }, [grid]);

    /**
     * Locks the current piece into the grid
     * Called when piece can't move down anymore
     */
    const lockPiece = useCallback(() => {
        if (!currentPiece) return;

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            const { shape, position, word, category, color, id, centerCell } = currentPiece;

            // Place each cell of the piece into the grid
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] === 1) {
                        const gridRow = position.row + r;
                        const gridCol = position.col + c;
                        const isCenterCell = (r === centerCell.row && c === centerCell.col);

                        if (gridRow >= 0 && gridRow < WORD_TOWER_DATA.gridRows) {
                            newGrid[gridRow][gridCol] = {
                                word: isCenterCell ? word : '',  // Only center cell shows word
                                category,
                                color,
                                pieceId: id,
                                hasWord: isCenterCell
                            };
                        }
                    }
                }
            }

            // Check for game over (blocks reached top)
            if (position.row <= 1) {
                // Check if any blocks in top 2 rows
                const topBlocked = newGrid.slice(0, 2).some(row => row.some(cell => cell !== null));
                if (topBlocked) {
                    setGameState('game_over');
                    playSound('incorrect');
                    return newGrid;
                }
            }

            // Check for warning (blocks at row 10 or higher)
            const highestBlock = newGrid.findIndex(row => row.some(cell => cell !== null));
            if (highestBlock >= 0 && highestBlock <= WORD_TOWER_DATA.warningHeight - WORD_TOWER_DATA.gridRows) {
                setShowWarning(true);
                setWorkerState('crying');
            }

            return newGrid;
        });
        
        setCurrentPiece(null);

        // Generate next piece after a short delay
        setTimeout(() => {
            const newPiece = generatePiece();
            setCurrentPiece(newPiece);
        }, 500);

    }, [currentPiece, generatePiece]);

    /**
     * Moves the current piece down by one row
     * Called by timer or manually
     */
    const dropPiece = useCallback(() => {
        if (!currentPiece) return;

        const newRow = currentPiece.position.row + 1;

        // Check if piece can move down
        if (canPlacePiece(currentPiece.shape, newRow, currentPiece.position.col)) {
            setCurrentPiece({
                ...currentPiece,
                position: { ...currentPiece.position, row: newRow }
            });
        } else {
            // Can't move down, lock the piece
            lockPiece();
        }
    }, [currentPiece, canPlacePiece, lockPiece]);

    /**
     * Moves the current piece left or right
     * @param {string} direction - 'left' or 'right'
     */
    const movePiece = useCallback((direction) => {
        if (!currentPiece || gameState !== 'playing') return;

        const newCol = direction === 'left' ?
            currentPiece.position.col - 1 :
            currentPiece.position.col + 1;

        // Check if piece can move in that direction
        if (canPlacePiece(currentPiece.shape, currentPiece.position.row, newCol)) {
            setCurrentPiece({
                ...currentPiece,
                position: { ...currentPiece.position, col: newCol }
            });
        }
    }, [currentPiece, canPlacePiece, gameState]);

    /**
     * Handles keyboard controls
     */
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameState !== 'playing') return;

            if (e.key === 'ArrowLeft') {
                movePiece('left');
            } else if (e.key === 'ArrowRight') {
                movePiece('right');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, movePiece]);

    /**
     * Removes a piece from the grid by its pieceId
     * @param {string} pieceId - ID of the piece to remove
     */
    const removePieceById = useCallback((pieceId) => {
        let resultGrid;
        setGrid(prevGrid => {
            resultGrid = prevGrid.map(row =>
                row.map(cell => cell && cell.pieceId === pieceId ? null : cell)
            );
            return resultGrid;
        });
        return resultGrid;
    }, []);

    /**
     * Applies gravity: makes blocks fall down to fill empty spaces
     * @param {Array} currentGrid - The grid to apply gravity to
     * @returns {Array} Updated grid after gravity
     */
    const applyGravity = useCallback((currentGrid) => {
        let newGrid = currentGrid.map(row => [...row]);
        let changed = true;

        // Keep applying gravity until no more changes
        while (changed) {
            changed = false;

            // Scan from bottom to top
            for (let row = WORD_TOWER_DATA.gridRows - 2; row >= 0; row--) {
                for (let col = 0; col < WORD_TOWER_DATA.gridCols; col++) {
                    // If current cell has a block and cell below is empty
                    if (newGrid[row][col] !== null && newGrid[row + 1][col] === null) {
                        // Move block down
                        newGrid[row + 1][col] = newGrid[row][col];
                        newGrid[row][col] = null;
                        changed = true;
                    }
                }
            }
        }

        return newGrid;
    }, []);

    /**
     * Checks for and clears complete rows
     * @param {Array} currentGrid - The grid to check
     * @returns {Object} { clearedGrid, rowsCleared }
     */
    const checkAndClearRows = useCallback((currentGrid) => {
        let newGrid = [...currentGrid];
        let rowsCleared = 0;

        // Check each row from bottom to top
        for (let row = WORD_TOWER_DATA.gridRows - 1; row >= 0; row--) {
            // Check if row is complete (all cells filled)
            const isComplete = newGrid[row].every(cell => cell !== null);

            if (isComplete) {
                // Clear the row
                newGrid[row] = Array(WORD_TOWER_DATA.gridCols).fill(null);
                rowsCleared++;
            }
        }

        // Apply gravity after clearing rows
        if (rowsCleared > 0) {
            newGrid = applyGravity(newGrid);
        }

        return { clearedGrid: newGrid, rowsCleared };
    }, [applyGravity]);

    /**
     * Adds a new piece to the top of the grid, pushing existing blocks down
     */
    const addPieceToTop = useCallback(() => {
        setGrid(prevGrid => {
            const newPiece = generatePiece();
            const { shape, position, word, category, color, id, centerCell } = newPiece;
            
            // Calculate how many rows the piece needs
            const pieceHeight = shape.length;
            
            // Check if adding this piece would cause game over
            const wouldCauseGameOver = prevGrid.slice(0, pieceHeight).some(row => row.some(cell => cell !== null));
            
            if (wouldCauseGameOver) {
                setGameState('game_over');
                playSound('incorrect');
                return prevGrid;
            }
            
            // Shift all existing rows down by pieceHeight
            const newGrid = createEmptyGrid();
            
            // Copy existing grid shifted down
            for (let r = 0; r < WORD_TOWER_DATA.gridRows - pieceHeight; r++) {
                for (let c = 0; c < WORD_TOWER_DATA.gridCols; c++) {
                    if (prevGrid[r]) {
                        newGrid[r + pieceHeight][c] = prevGrid[r][c];
                    }
                }
            }
            
            // Add the new piece at the top, centered horizontally
            const startCol = Math.floor((WORD_TOWER_DATA.gridCols - shape[0].length) / 2);
            
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] === 1) {
                        const gridCol = startCol + c;
                        const isCenterCell = (r === centerCell.row && c === centerCell.col);
                        
                        if (gridCol >= 0 && gridCol < WORD_TOWER_DATA.gridCols) {
                            newGrid[r][gridCol] = {
                                word: isCenterCell ? word : '',  // Only center cell shows word
                                category,
                                color,
                                pieceId: id,
                                hasWord: isCenterCell
                            };
                        }
                    }
                }
            }
            
            // Check for complete rows
            const { clearedGrid, rowsCleared } = checkAndClearRows(newGrid);
            if (rowsCleared > 0) {
                const rowPoints = rowsCleared * WORD_TOWER_DATA.pointsPerRow;
                setScore(prev => prev + rowPoints);
            }
            
            // Check for warning
            const highestBlock = clearedGrid.findIndex(row => row.some(cell => cell !== null));
            if (highestBlock >= 0 && highestBlock <= WORD_TOWER_DATA.warningHeight - WORD_TOWER_DATA.gridRows) {
                setShowWarning(true);
                setWorkerState('crying');
            }
            
            return rowsCleared > 0 ? clearedGrid : newGrid;
        });
    }, [generatePiece, createEmptyGrid, checkAndClearRows]);

    // Store the latest addPieceToTop in a ref to avoid circular dependencies
    useEffect(() => {
        addPieceToTopRef.current = addPieceToTop;
    }, [addPieceToTop]);

    /**
     * Handles clicking on a block in the grid
     * @param {number} row - Row of clicked block
     * @param {number} col - Column of clicked block
     */
    const handleBlockClick = useCallback((row, col) => {
        if (gameState !== 'playing') return;

        setGrid(prevGrid => {
            const clickedCell = prevGrid[row][col];
            if (!clickedCell) return prevGrid;  // Empty cell

            // Check if clicked block matches current theme
            if (clickedCell.category === currentTheme) {
                // CORRECT MATCH!
                playSound('correct');
                speakWithFemaleVoice(clickedCell.word);

                // Remove the entire piece (all blocks with same pieceId)
                let newGrid = prevGrid.map(r =>
                    r.map(cell => cell && cell.pieceId === clickedCell.pieceId ? null : cell)
                );

                // Apply gravity
                newGrid = applyGravity(newGrid);

                // Check for complete rows
                const { clearedGrid, rowsCleared } = checkAndClearRows(newGrid);

                // Update score
                const blockPoints = WORD_TOWER_DATA.pointsPerBlock * combo;
                const rowPoints = rowsCleared * WORD_TOWER_DATA.pointsPerRow * combo;
                const totalPoints = blockPoints + rowPoints;

                setScore(prev => prev + totalPoints);

                // Increase combo (consecutive correct)
                setCombo(WORD_TOWER_DATA.comboMultiplier);

                // Reset worker to happy
                setWorkerState('happy');
                setShowWarning(false);

                // In Level 2+, change theme after each correct match
                if (level >= 2) {
                    selectRandomTheme();
                }
                
                return clearedGrid;

            } else {
                // WRONG MATCH!
                playSound('incorrect');
                speakWithFemaleVoice('Try another block!');

                // Reset combo
                setCombo(1);

                // Apply penalty: reduce timer by 2 seconds
                setNextDropTime(prev => prev - WORD_TOWER_DATA.wrongClickPenalty);

                // Show worried worker
                setWorkerState('worried');

                // Flash timer red (handled in CSS)
                setTimeout(() => setWorkerState('happy'), 1000);
                
                return prevGrid;
            }
        });
    }, [gameState, currentTheme, combo, level, applyGravity, checkAndClearRows, selectRandomTheme]);

    /**
     * Starts a new game
     */
    const handleStart = useCallback(() => {
        // Reset all state
        setScore(0);
        setLevel(1);
        setCombo(1);
        setDropInterval(WORD_TOWER_DATA.baseDropInterval);
        setPreFillRows(WORD_TOWER_DATA.level1PreFill);
        setAppliedEffects([]);
        setWorkerState('happy');
        setShowWarning(false);

        // Select initial theme
        const categoryKeys = Object.keys(WORD_TOWER_DATA.categories);
        const initialTheme = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        setCurrentTheme(initialTheme);
        setPreviousTheme(initialTheme);

        // Create grid with pre-fill
        if (WORD_TOWER_DATA.level1PreFill > 0) {
            preFillGrid(WORD_TOWER_DATA.level1PreFill, initialTheme);
        } else {
            setGrid(createEmptyGrid());
        }

        // Generate first piece
        const firstPiece = generatePiece();
        setCurrentPiece(firstPiece);

        // Start game
        setGameState('playing');
        setNextDropTime(Date.now() + WORD_TOWER_DATA.baseDropInterval);
        setNextTopSpawnTime(Date.now() + 10000);  // First top spawn after 10 seconds

        // Announce theme
        const themeName = WORD_TOWER_DATA.categories[initialTheme].name;
        setTimeout(() => speakWithFemaleVoice(`Find ${themeName}!`), 500);

    }, [createEmptyGrid, generatePiece, preFillGrid]);

    /**
     * Handles level up
     */
    useEffect(() => {
        if (score >= WORD_TOWER_DATA.pointsToLevelUp * level && gameState === 'playing') {
            // Level up!
            const newLevel = level + 1;
            setLevel(newLevel);

            playSound('win');

            // Level 2: Enable random theme mode
            if (newLevel === 2) {
                setGameState('level_up');
                setTimeout(() => {
                    // Add pre-fill rows for Level 2
                    setPreFillRows(WORD_TOWER_DATA.level2PreFill);
                    preFillGrid(WORD_TOWER_DATA.level2PreFill, currentTheme);
                    selectRandomTheme();
                    setGameState('playing');
                }, 2000);
            } else {
                // Level 3+: Show effect selection
                setGameState('effect_selection');
            }
        }
    }, [score, level, gameState, currentTheme, preFillGrid, selectRandomTheme]);

    /**
     * Applies a selected effect
     * @param {string} effectId - ID of the effect to apply
     */
    const applyEffect = useCallback((effectId) => {
        const effect = WORD_TOWER_DATA.effects[effectId];

        if (effectId === 'speedUp') {
            const newInterval = effect.apply(dropInterval);
            setDropInterval(newInterval);
        } else if (effectId === 'moreBlocks') {
            const newPreFill = effect.apply(preFillRows);
            setPreFillRows(newPreFill);
            preFillGrid(newPreFill, currentTheme);
        }

        setAppliedEffects([...appliedEffects, effectId]);
        setGameState('playing');

        speakWithFemaleVoice(`${effect.name} activated!`);
    }, [dropInterval, preFillRows, appliedEffects, currentTheme, preFillGrid]);

    /**
     * Auto-drop timer
     */
    useEffect(() => {
        if (gameState !== 'playing' || !currentPiece) return;

        // Update countdown every 100ms
        countdownRef.current = setInterval(() => {
            const remaining = nextDropTime - Date.now();
            setTimeRemaining(Math.max(0, remaining));

            // Time to drop
            if (remaining <= 0) {
                dropPiece();
                setNextDropTime(Date.now() + dropInterval);
            }
        }, 100);

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [gameState, currentPiece, nextDropTime, dropInterval, dropPiece]);

    /**
     * Top spawn timer - adds new piece to top every 10 seconds
     */
    useEffect(() => {
        if (gameState !== 'playing' || !nextTopSpawnTime) return;

        topSpawnTimerRef.current = setInterval(() => {
            const remaining = nextTopSpawnTime - Date.now();
            
            // Time to spawn at top
            if (remaining <= 0) {
                if (addPieceToTopRef.current) {
                    addPieceToTopRef.current();
                }
                setNextTopSpawnTime(Date.now() + 10000);  // Next spawn in 10 seconds
            }
        }, 100);

        return () => {
            if (topSpawnTimerRef.current) {
                clearInterval(topSpawnTimerRef.current);
            }
        };
    }, [gameState, nextTopSpawnTime]);

    /**
     * Renders the grid with current piece overlay
     */
    const renderGrid = () => {
        const gridWithPiece = grid.map(row => [...row]);

        // Overlay current piece
        if (currentPiece) {
            const { shape, position, word, category, color, id, centerCell } = currentPiece;
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] === 1) {
                        const gridRow = position.row + r;
                        const gridCol = position.col + c;
                        const isCenterCell = (r === centerCell.row && c === centerCell.col);
                        
                        if (gridRow >= 0 && gridRow < WORD_TOWER_DATA.gridRows) {
                            gridWithPiece[gridRow][gridCol] = {
                                word: isCenterCell ? word : '',  // Only center cell shows word
                                category,
                                color,
                                pieceId: id,
                                isCurrent: true,
                                hasWord: isCenterCell
                            };
                        }
                    }
                }
            }
        }

        return gridWithPiece.map((row, rowIndex) => (
            <div key={rowIndex} className="wtb-grid-row">
                {row.map((cell, colIndex) => (
                    <div
                        key={colIndex}
                        className={`wtb-cell ${cell ? 'wtb-filled' : ''} ${cell?.isCurrent ? 'wtb-current' : ''}`}
                        style={{ backgroundColor: cell ? cell.color : 'transparent' }}
                        onClick={() => handleBlockClick(rowIndex, colIndex)}
                    >
                        {cell && cell.word && <span className="wtb-word">{cell.word}</span>}
                    </div>
                ))}
            </div>
        ));
    };

    // ===== RENDER =====
    return (
        <div className="word-tower-container" style={{ backgroundImage: `url(${constructionBg})` }}>
            {/* CRANE AT TOP */}
            <img src={craneImg} alt="Crane" className="wtb-crane" />

            {/* START SCREEN */}
            {gameState === 'start' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">🏗️ Word Tower Builder 🏗️</h1>
                    <img src={workerHappy} alt="Worker" className="game-start-image" />
                    <p className="game-start-description">Match words by category to build your tower!</p>
                    <button className="game-btn-start" onClick={handleStart}>Game Start</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}

            {/* PLAYING SCREEN */}
            {gameState === 'playing' && (
                <div className="wtb-gameplay">
                    {/* Header */}
                    <div className="wtb-header">
                        <div className="wtb-info">
                            <div className="wtb-score">Score: {score}</div>
                            <div className="wtb-level">Level {level}</div>
                            <div className="wtb-theme">
                                Theme: <span style={{ color: WORD_TOWER_DATA.categories[currentTheme]?.color }}>
                                    {WORD_TOWER_DATA.categories[currentTheme]?.name}
                                </span>
                            </div>
                            {combo > 1 && <div className="wtb-combo">×{combo} COMBO!</div>}
                        </div>
                        <button className="game-btn-exit" onClick={onBack}>Exit</button>
                    </div>

                    {/* Timer Bar */}
                    <div className="wtb-timer-container">
                        <div
                            className="wtb-timer-bar"
                            style={{ width: `${(timeRemaining / dropInterval) * 100}%` }}
                        />
                    </div>

                    {/* Worker Character */}
                    <div className="wtb-worker">
                        <img
                            src={workerState === 'crying' ? workerCrying :
                                workerState === 'worried' ? workerWorried : workerHappy}
                            alt="Worker"
                            className="wtb-worker-img"
                        />
                    </div>

                    {/* Grid */}
                    <div className={`wtb-grid ${showWarning ? 'wtb-warning' : ''}`}>
                        {renderGrid()}
                    </div>

                    {/* Controls */}
                    <div className="wtb-controls">
                        <button className="wtb-control-btn" onClick={() => movePiece('left')}>◀ Left</button>
                        <button className="wtb-control-btn" onClick={() => movePiece('right')}>Right ▶</button>
                    </div>
                </div>
            )}

            {/* EFFECT SELECTION SCREEN */}
            {gameState === 'effect_selection' && (
                <div className="wtb-overlay">
                    <div className="wtb-overlay-content">
                        <h2>Level {level} - Choose Your Challenge!</h2>
                        <div className="wtb-effect-cards">
                            {Object.values(WORD_TOWER_DATA.effects).map(effect => (
                                <div
                                    key={effect.id}
                                    className="wtb-effect-card"
                                    onClick={() => applyEffect(effect.id)}
                                >
                                    <div className="wtb-effect-icon">{effect.icon}</div>
                                    <div className="wtb-effect-name">{effect.name}</div>
                                    <div className="wtb-effect-desc">{effect.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* LEVEL UP SCREEN */}
            {gameState === 'level_up' && (
                <div className="wtb-overlay">
                    <div className="wtb-overlay-content">
                        <img src={cakeImg} alt="Level Up" className="wtb-success-img" />
                        <h2>Level {level}! 🎉</h2>
                        <p>Random themes activated!</p>
                    </div>
                </div>
            )}

            {/* GAME OVER SCREEN */}
            {gameState === 'game_over' && (
                <div className="game-start-screen">
                    <h1 className="game-start-title">Tower Collapsed!</h1>
                    <img src={workerCrying} alt="Game Over" className="game-start-image" />
                    <p className="game-start-description">Final Score: {score}</p>
                    <p className="game-start-description">Level Reached: {level}</p>
                    <button className="game-btn-start" onClick={handleStart}>Play Again</button>
                    <div style={{ marginTop: '20px' }}>
                        <button className="game-btn-back" onClick={onBack}>Back to Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordTowerBuilder;
