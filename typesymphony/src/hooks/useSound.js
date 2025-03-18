import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

// Custom hook for sound management
const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('soundEnabled') === 'true'
  );
  
  const sounds = useRef({
    keyPress: new Howl({ src: ['/sounds/key-press.mp3'], volume: 0.3 }),
    success: new Howl({ src: ['/sounds/success.mp3'], volume: 0.5 }),
    background: new Howl({ 
      src: ['/sounds/background-music.mp3'], 
      loop: true, 
      volume: 0.2
    })
  });
  
  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('soundEnabled', !soundEnabled);
    
    if (!soundEnabled) {
      // Turn sounds on
      sounds.current.background.play();
    } else {
      // Turn sounds off
      sounds.current.background.pause();
    }
  };
  
  // Play a specific sound
  const playSound = (soundName) => {
    if (soundEnabled && sounds.current[soundName]) {
      sounds.current[soundName].play();
    }
  };
  
  // Initialize on mount
  useEffect(() => {
    if (soundEnabled) {
      sounds.current.background.play();
    }
    
    // Cleanup on unmount
    return () => {
      Object.values(sounds.current).forEach(sound => {
        sound.stop();
      });
    };
  }, []);
  
  return {
    soundEnabled,
    toggleSound,
    playSound
  };
};

export default useSound;