import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../state/authContext";
import "./GameTutorial.styles.css";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "wait" | "explain";
  highlight?: string[];
  nextButton?: string;
  skipButton?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Super Tic-Tac-Toe! 🎮",
    content:
      "This is a strategic twist on the classic game. You'll play on a 3x3 grid of 3x3 boards. Let's learn how to play!",
    position: "center",
    action: "explain",
    nextButton: "Let's Start!",
  },
  {
    id: "board_explanation",
    title: "The Game Board 📋",
    content:
      "This is your game board. It's made up of 9 smaller boards, each with 9 cells. You can see the main board in the center.",
    position: "center",
    action: "explain",
    nextButton: "Got it!",
  },
  {
    id: "first_move",
    title: "Your First Move 🎯",
    content:
      "As the starting player, you can place your mark (X) anywhere on the board. Click on any cell to make your first move!",
    position: "top",
    action: "click",
    target: ".cell-container",
    highlight: [".cell-container"],
    nextButton: "I'll try!",
  },
  {
    id: "active_board",
    title: "Active Board Rule 🔄",
    content:
      "After your move, the next player must play in the board that corresponds to the cell you just played. This is the 'active board' rule that makes the game strategic!",
    position: "top",
    action: "explain",
    nextButton: "Understood!",
  },
  {
    id: "winning_small",
    title: "Winning Small Boards 🏆",
    content:
      "When you get 3 in a row in any small board, you win that board! The winning line will be highlighted, and that board becomes yours.",
    position: "top",
    action: "explain",
    nextButton: "Cool!",
  },
  {
    id: "winning_big",
    title: "Winning the Big Game 🎉",
    content:
      "To win the entire game, you need to get 3 small boards in a row on the big board. This creates a line of victory across the main grid!",
    position: "top",
    action: "explain",
    nextButton: "Amazing!",
  },
  {
    id: "strategy_tips",
    title: "Strategy Tips 💡",
    content:
      "• Control the center boards for better positioning\n• Block your opponent's winning moves\n• Try to force them into unfavorable positions\n• Think several moves ahead!",
    position: "top",
    action: "explain",
    nextButton: "Great tips!",
  },
  {
    id: "features",
    title: "Game Features ⚡",
    content:
      "• Chat with your opponent during the game\n• Sound effects for moves and wins\n• Time limits to keep games moving\n• Achievements to unlock as you play!",
    position: "top",
    action: "explain",
    nextButton: "Awesome!",
  },
  {
    id: "ready",
    title: "You're Ready! 🚀",
    content:
      "You now know how to play Super Tic-Tac-Toe! Create a room to challenge a friend, or join an existing game. Good luck and have fun!",
    position: "center",
    action: "explain",
    nextButton: "Let's Play!",
    skipButton: "Maybe Later",
  },
];

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const GameTutorial: React.FC<GameTutorialProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Handle step navigation
  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const skipTutorial = () => {
    onClose();
  };

  // Handle step actions
  useEffect(() => {
    if (!isOpen || !step) return;

    // Clear previous highlights
    setHighlightedElements([]);

    // Handle different step actions
    switch (step.action) {
      case "click":
        if (step.highlight) {
          setHighlightedElements(step.highlight);
        }
        break;
      case "wait":
        // Auto-advance after a delay
        const timer = setTimeout(() => {
          nextStep();
        }, 3000);
        return () => clearTimeout(timer);
      case "explain":
        // Just show the explanation
        break;
    }
  }, [currentStep, isOpen, step]);

  // Handle clicks on highlighted elements
  useEffect(() => {
    if (!highlightedElements.length) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHighlighted = highlightedElements.some(
        (selector) => target.closest(selector) || target.matches(selector)
      );

      if (isHighlighted) {
        e.preventDefault();
        e.stopPropagation();
        nextStep();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [highlightedElements]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevStep();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen || !step) return null;

  return (
    <div className="tutorial-overlay" ref={overlayRef}>
      {/* Highlighted elements */}
      {highlightedElements.map((selector, index) => (
        <div
          key={index}
          className="tutorial-highlight"
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
      ))}

      {/* Tutorial step */}
      <div
        ref={stepRef}
        className={`tutorial-step ${step.position} ${
          isAnimating ? "animating" : ""
        }`}
      >
        <div className="tutorial-content">
          <div className="tutorial-header">
            <h2 className="tutorial-title">{step.title}</h2>
            <div className="tutorial-progress">
              {currentStep + 1} / {tutorialSteps.length}
            </div>
          </div>

          <div className="tutorial-body">
            <p className="tutorial-text">{step.content}</p>
          </div>

          <div className="tutorial-actions">
            {currentStep > 0 && (
              <button
                className="tutorial-btn tutorial-btn-secondary"
                onClick={prevStep}
              >
                ← Previous
              </button>
            )}

            <div className="tutorial-actions-main">
              <button
                className="tutorial-btn tutorial-btn-primary"
                onClick={nextStep}
              >
                {step.nextButton || (isLastStep ? "Complete" : "Next")}
              </button>

              {step.skipButton && (
                <button
                  className="tutorial-btn tutorial-btn-secondary"
                  onClick={skipTutorial}
                >
                  {step.skipButton}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="tutorial-progress-bar">
            <div
              className="tutorial-progress-fill"
              style={{
                width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Navigation hints */}
        <div className="tutorial-hints">
          <div className="tutorial-hint">
            <kbd>←</kbd> <kbd>→</kbd> Navigate
          </div>
          <div className="tutorial-hint">
            <kbd>Esc</kbd> Skip
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTutorial;
