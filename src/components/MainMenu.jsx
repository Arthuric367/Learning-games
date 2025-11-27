import React from 'react'; // HMR Trigger
import './MainMenu.css';

function MainMenu({ onSelectGame }) {
    const games = [
        {
            id: 'pronoun-adventure',
            title: 'Pronoun Picnic',
            subtitle: 'Dino & Friends',
            emoji: '🦖🦒',
            description: 'Learn pronouns with Dino!',
            color: '#4CAF50'
        },
        {
            id: 'question-word-racer',
            title: 'Question Word Racer',
            subtitle: 'Speed & Grammar',
            emoji: '🏎️🦖',
            description: 'Race and learn Who, What, Where!',
            color: '#FF9800'
        },
        {
            id: 'puzzle-matcher',
            title: 'Preposition Puzzle',
            subtitle: 'In, On, Under',
            emoji: '🧩🖼️',
            description: 'Solve puzzles with prepositions!',
            color: '#2196F3'
        },
        {
            id: 'wonder-world-blaster',
            title: 'Wonder World Blaster',
            subtitle: 'Category Shooter',
            emoji: '🎯✈️',
            description: 'Pop bubbles and defeat the monster!',
            color: '#9C27B0'
        }
    ];

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1 className="menu-title">🎮 Arthur's Learning Games 🎮</h1>
                <p className="menu-subtitle">Choose a game to start learning!</p>

                <div className="games-grid">
                    {games.map(game => (
                        <div
                            key={game.id}
                            className="game-card"
                            style={{ borderColor: game.color }}
                            onClick={() => onSelectGame(game.id)}
                        >
                            <div className="game-emoji">{game.emoji}</div>
                            <h2 className="game-title">{game.title}</h2>
                            <p className="game-subtitle">{game.subtitle}</p>
                            <p className="game-description">{game.description}</p>
                            <button
                                className="play-btn"
                                style={{ backgroundColor: game.color }}
                            >
                                Play Now! 開始玩
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainMenu;
