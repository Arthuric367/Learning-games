import React from 'react';
import styles from './GiraffeProgress.module.css';
import giraffeBaby from '../assets/pronoun_adventure/giraffe_baby_1763827967345.png';
import giraffeGrowing from '../assets/pronoun_adventure/giraffe_growing_1763827993032.png';
import giraffeEating from '../assets/pronoun_adventure/giraffe_eating_1763828019559.png';

const GiraffeProgress = ({ score, isMilestone }) => {
  let currentImage = giraffeBaby;
  let message = "Baby Giraffe is hungry...";
  let progress = (score % 5) / 5 * 100;

  if (score >= 15) {
    currentImage = giraffeEating;
    message = "Yum! Delicious leaves!";
    progress = 100;
  } else if (score >= 10) {
    currentImage = giraffeGrowing;
    message = "Almost there! Keep going!";
  } else if (score >= 5) {
    currentImage = giraffeGrowing;
    message = "Growing taller!";
  }

  // If it's a milestone screen, make it bigger
  const containerClass = isMilestone ? `${styles.container} ${styles.milestone}` : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.imageContainer}>
        <img src={currentImage} alt="Giraffe Progress" className={styles.giraffeImage} />
      </div>
      <div className={styles.info}>
        <p className={styles.message}>{message}</p>
        {!isMilestone && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${score >= 15 ? 100 : progress}%` }}
            ></div>
          </div>
        )}
        <p className={styles.scoreText}>Score: {score} / 15</p>
      </div>
    </div>
  );
};

export default GiraffeProgress;
