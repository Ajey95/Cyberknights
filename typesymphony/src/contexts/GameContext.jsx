import { createContext, useContext, useState, useEffect } from 'react';
import { storyData } from '../utils/storyData';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Initialize game text based on current scene
  useEffect(() => {
    if (currentScene < storyData.length) {
      setCurrentText(storyData[currentScene].text);
    }
  }, [currentScene]);

  // Start game
  const startGame = () => {
    setIsGameActive(true);
    setStartTime(Date.now());
    setTypedText('');
    setErrors(0);
    setGameCompleted(false);
  };

  // Handle typing
  const handleTyping = (text) => {
    setTypedText(text);
    
    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < text.length; i++) {
      if (i >= currentText.length || text[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    // Check if paragraph is completed
    if (text.length === currentText.length && errorCount === 0) {
      completeScene();
    }
  };

  // Calculate stats
  const calculateStats = () => {
    if (!startTime || !endTime) return;

    const timeInMinutes = (endTime - startTime) / 60000;
    const words = currentText.split(' ').length;
    const calculatedWpm = Math.round(words / timeInMinutes);
    const calculatedAccuracy = Math.max(0, Math.round(100 - (errors / currentText.length * 100)));
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  };

  // Complete current scene
  const completeScene = () => {
    setEndTime(Date.now());
    setIsGameActive(false);
    
    // Check if there are more scenes
    if (currentScene < storyData.length - 1) {
      setTimeout(() => {
        setCurrentScene(prevScene => prevScene + 1);
        startGame();
      }, 1500);
    } else {
      // Game completed
      setGameCompleted(true);
      calculateStats();
    }
  };

  // Reset game
  const resetGame = () => {
    setCurrentScene(0);
    setTypedText('');
    setIsGameActive(false);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setGameCompleted(false);
  };

  const value = {
    currentScene,
    currentText,
    typedText,
    isGameActive,
    wpm,
    accuracy,
    errors,
    gameCompleted,
    startGame,
    handleTyping,
    completeScene,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};