import { useState, useEffect } from 'react'

interface TutorialStep {
  title: string
  content: string
  highlight?: string
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Cookie Clicker! 🍪',
    content: 'Click the giant cookie to earn cookies. Each click gives you cookies that you can spend on upgrades!',
  },
  {
    title: 'Upgrades System 📈',
    content: 'Spend your cookies on upgrades like Cursors, Grandmas, and Factories. Each upgrade generates cookies automatically (CPS - Cookies Per Second).',
  },
  {
    title: 'Level Up & XP System ⭐',
    content: 'Every time you buy an upgrade, you gain XP. Level up to increase your CPS multiplier! Higher levels = more cookies per second.',
  },
  {
    title: 'Achievements 🏆',
    content: 'Complete achievements by reaching cookie milestones. Each achievement increases your click power, making each click worth more!',
  },
  {
    title: 'Dark Mode 🌙',
    content: 'Toggle between light and dark mode using the button in the top-right corner for comfortable viewing.',
  },
  {
    title: 'Arrange Your Workspace 🪟',
    content: 'Drag window headers to move panels around. Use the resize handle (⇲) in the bottom-right corner of each panel to adjust sizes. Your layout is saved automatically!',
  },
  {
    title: 'Ready to Play! 🎮',
    content: 'You\'re all set! Start clicking and building your cookie empire. Have fun and happy baking!',
  },
]

function Tutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showTutorialButton, setShowTutorialButton] = useState(true)

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorial-completed')
    if (!tutorialCompleted) {
      setIsOpen(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('tutorial-completed', 'true')
    setCurrentStep(0)
  }

  const handleSkip = () => {
    handleClose()
  }

  const openTutorial = () => {
    setIsOpen(true)
    setCurrentStep(0)
  }

  const currentStepData = tutorialSteps[currentStep]

  return (
    <>
      {showTutorialButton && (
        <button
          className="tutorial-button"
          onClick={openTutorial}
          aria-label="Open tutorial"
          title="Learn how to play"
        >
          ❓
        </button>
      )}

      {isOpen && (
        <div className="tutorial-overlay" onClick={handleClose}>
          <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
            <button className="tutorial-close" onClick={handleClose} aria-label="Close tutorial">
              ✕
            </button>

            <div className="tutorial-content">
              <div className="tutorial-step-indicator">
                Step {currentStep + 1} of {tutorialSteps.length}
              </div>

              <h2 className="tutorial-title">{currentStepData.title}</h2>
              <p className="tutorial-text">{currentStepData.content}</p>

              <div className="tutorial-progress">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`tutorial-progress-dot ${index === currentStep ? 'active' : ''} ${
                      index < currentStep ? 'completed' : ''
                    }`}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </div>

            <div className="tutorial-actions">
              <button
                className="tutorial-btn tutorial-btn-secondary"
                onClick={handleSkip}
                disabled={false}
              >
                Skip
              </button>

              <div className="tutorial-nav">
                <button
                  className="tutorial-btn tutorial-btn-secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                <button
                  className="tutorial-btn tutorial-btn-primary"
                  onClick={handleNext}
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tutorial