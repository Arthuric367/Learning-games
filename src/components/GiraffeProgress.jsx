import React from 'react';
import styles from './GiraffeProgress.module.css';
import giraffeBabyImg from '../assets/pronoun_adventure/giraffe_baby_1763827967345.png';
import giraffeBabyVideo from '../assets/pronoun_adventure/Giraffe_baby.mp4';
import giraffeGrowingImg from '../assets/pronoun_adventure/giraffe_growing_1763827993032.png';
import giraffeGrowingVideo from '../assets/pronoun_adventure/Giraffe_Growing.mp4';
import giraffeEatingImg from '../assets/pronoun_adventure/giraffe_eating_1763828019559.png';
import giraffeEatingVideo from '../assets/pronoun_adventure/Giraffe_Eating.mp4';

const GiraffeProgress = ({ score, isMilestone, maxScore = 5 }) => {
  let currentVideo = giraffeBabyVideo;
  let currentPoster = giraffeBabyImg;
  let message = "Baby Giraffe is hungry...";
  let progress = (score / maxScore) * 100;

  if (score === 0) {
    currentVideo = giraffeBabyVideo;
    currentPoster = giraffeBabyImg;
    message = "Baby Giraffe is hungry...";
  } else if (score >= maxScore) {
    currentVideo = giraffeEatingVideo;
    currentPoster = giraffeEatingImg;
    message = "Yum! Delicious leaves!";
    progress = 100;
  } else if (score >= 3) {
    currentVideo = giraffeGrowingVideo;
    currentPoster = giraffeGrowingImg;
    message = "Growing taller!";
  }

  // If it's a milestone screen, make it bigger
  const containerClass = isMilestone ? `${styles.container} ${styles.milestone}` : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.imageContainer}>
        <video
          src={currentVideo}
          poster={currentPoster}
          autoPlay
          loop
          playsInline
          muted
          className={styles.giraffeImage}
          style={{ objectFit: 'contain' }}
        >
          <img src={currentPoster} alt="Giraffe Progress" className={styles.giraffeImage} />
        </video>
      </div>
      <div className={styles.info}>
        <p className={styles.message}>{message}</p>
        {!isMilestone && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <p className={styles.scoreText}>Score: {score} / {maxScore}</p>
      </div>
    </div>
  );
};

export default GiraffeProgress;
