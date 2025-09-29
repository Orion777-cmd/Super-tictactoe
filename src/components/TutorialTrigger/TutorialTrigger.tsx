import React, { useState, useEffect } from "react";
import { useAuth } from "../../state/authContext";
import GameTutorial from "../GameTutorial/GameTutorial";
import "./TutorialTrigger.styles.css";

interface TutorialTriggerProps {
  children?: React.ReactNode;
}

const TutorialTrigger: React.FC<TutorialTriggerProps> = ({ children }) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Check if user has seen tutorial before
  useEffect(() => {
    if (user) {
      const tutorialSeen = localStorage.getItem(`tutorial_seen_${user.userId}`);
      setHasSeenTutorial(!!tutorialSeen);
    }
  }, [user]);

  const handleStartTutorial = () => {
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.userId}`, "true");
      setHasSeenTutorial(true);
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  // Don't show tutorial trigger if user has already seen it
  if (hasSeenTutorial) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Tutorial trigger button */}
      <div className="tutorial-trigger">
        <button
          className="tutorial-trigger-btn"
          onClick={handleStartTutorial}
          title="Learn how to play"
        >
          <span className="tutorial-trigger-icon">🎓</span>
          <span className="tutorial-trigger-text">Tutorial</span>
        </button>
      </div>

      {/* Tutorial modal */}
      <GameTutorial
        isOpen={showTutorial}
        onClose={handleTutorialClose}
        onComplete={handleTutorialComplete}
      />
    </>
  );
};

export default TutorialTrigger;
