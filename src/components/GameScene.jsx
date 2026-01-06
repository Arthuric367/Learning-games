import React from 'react';
import styles from './GameScene.module.css';

const GameScene = ({ question, onAnswer }) => {
    const { text, options, image, video, poster } = question;

    // Split text by "___" to insert the blank
    const parts = text.split("___");

    // Check if image is a file path (imported) or a placeholder keyword
    // Imported images will be a string path like "/src/assets/..."
    const isImagePath = image && (image.includes('/') || image.includes('.'));

    return (
        <div className={styles.scene}>
            <div className={styles.imageContainer}>
                {!isImagePath ? (
                    <div className={`${styles.placeholderImage} ${styles[image]}`}>
                        {image.replace('_', ' ').toUpperCase()}
                    </div>
                ) : video ? (
                    <video
                        src={video}
                        poster={poster}
                        autoPlay
                        loop
                        playsInline
                        className={styles.sceneImage}
                        aria-label="Question Scene"
                    >
                        {/* Fallback for browsers that don't support video */}
                        <img src={poster || image} alt="Question Scene" className={styles.sceneImage} />
                    </video>
                ) : (
                    <img src={image} alt="Question Scene" className={styles.sceneImage} />
                )}
            </div>

            <div className={styles.sentenceContainer}>
                <span className={styles.sentenceText}>
                    {parts[0]}
                    <span className={styles.blank}>___</span>
                    {parts[1]}
                </span>
            </div>

            <div className={styles.optionsContainer}>
                {options.map((option) => (
                    <button
                        key={option}
                        className={styles.optionBubble}
                        onClick={() => onAnswer(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameScene;
