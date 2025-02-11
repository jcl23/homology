import React, { useState, useEffect } from 'react';
import styles from './TutorialModal.module.css';
const TutorialModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hideTutorial = localStorage.getItem('hideTutorial');
    if (!hideTutorial) setShowModal(true);
  }, []);

  const handleStartTutorial = () => {
    setShowModal(false);
    // Start the tutorial logic
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('hideTutorial', 'true'); // Remember user's preference
  };

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Would you like to take a tutorial to learn how to use the app?</p>
        <button onClick={handleStartTutorial}>Start Tutorial</button>
        <button onClick={handleCloseModal}>Don't Show Again</button>
      </div>
    </div>
  );
};

export default TutorialModal;
