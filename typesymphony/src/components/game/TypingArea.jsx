import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import useSound from '../../hooks/useSound';
import HoliEffect from '../shared/HoliEffect';

const TypingArea = () => {
  const { 
    currentText, 
    typedText, 
    handleTyping, 
    isGameActive 
  } = useGame();
  
  const { playSound } = useSound();
  const [position, setPosition] = useState(null);
  const [showEffect, setShowEffect] = useState(false);
  
  const textAreaRef = useRef(null);

  // Focus on text area when game becomes active
  useEffect(() => {
    if (isGameActive && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isGameActive]);

  // Handle key press
  const handleKeyPress = (e) => {
    if (!isGameActive) return;
    
    // Update typed text
    const newText = e.target.value;
    handleTyping(newText);
    
    // Play sound and create color effect for correct typing
    if (newText.length > typedText.length && 
        newText[newText.length - 1] === currentText[newText.length - 1]) {
      playSound('keyPress');
      
      // Create position for effect
      const cursorPosition = getCursorPosition();
      if (cursorPosition) {
        setPosition(cursorPosition);
        setShowEffect(true);
        
        // Reset effect after a short delay
        setTimeout(() => setShowEffect(false), 100);
      }
    }
  };

  // Get cursor position for effect
  const getCursorPosition = () => {
    if (!textAreaRef.current) return null;
    
    // Calculate position based on text area
    const rect = textAreaRef.current.getBoundingClientRect();
    const cursorIndex = textAreaRef.current.selectionStart;
    
    // Simple approximation - we'll use the center of the text area
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    };
  };

  // Render each character with appropriate styling
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = '';
      
      if (index < typedText.length) {
        // Already typed character
        className = typedText[index] === char ? 'char-correct' : 'char-incorrect';
      } else if (index === typedText.length) {
        // Current character
        className = 'char-current';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="relative">
      <div className="p-6 bg-white rounded-lg shadow-md mb-4">
        <div className="typing-text mb-4">
          {renderText()}
        </div>
        
        <textarea
          ref={textAreaRef}
          value={typedText}
          onChange={handleKeyPress}
          disabled={!isGameActive}
          className="opacity-0 absolute inset-0 w-full h-full cursor-default"
          autoFocus={isGameActive}
        />
      </div>
      
      <HoliEffect active={showEffect} position={position} />
    </div>
  );
};

export default TypingArea;