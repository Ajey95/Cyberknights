import { useEffect, useState, useRef, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import StoryScene from '../components/game/StoryScene';
import TypingArea from '../components/game/TypingArea';
import Stats from '../components/game/Stats';
import useSound from '../hooks/useSound';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const GamePage = () => {
  const { 
    isGameActive, 
    startGame, 
    resetGame, 
    gameCompleted,
    wpm,
    accuracy,
    currentScene,
    progressToNextScene,
    errors,
    rawKeystrokes,
    correctKeystrokes,
    setCurrentScene, // Make sure this exists in GameContext
    scenes, // Ensure you have access to all scenes in GameContext
  } = useGame();
  
  const { updateUserStats } = useAuth();
  const { playSound } = useSound();
  const [mounted, setMounted] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const sparkleInterval = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const resultsRef = useRef(null);
  
  // New states for enhanced features
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [lastTyped, setLastTyped] = useState(Date.now());
  const [timerMode, setTimerMode] = useState('1min'); // Default timer mode
  const [timeRemaining, setTimeRemaining] = useState(60); // Default 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [typingStats, setTypingStats] = useState([]);
  const [keyStats, setKeyStats] = useState({});
  const [resultEmoji, setResultEmoji] = useState('');
  const audioContext = useRef(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedScene, setSelectedScene] = useState(0);

  // Timer mode options
  const timerOptions = {
    '15sec': 15,
    '30sec': 30,
    '1min': 60,
    '2min': 120,
    '5min': 300
  };

  // Initialize audio context for our custom sounds
  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  // Animation setup after component mount
  useEffect(() => {
    setMounted(true);
    
    // Start occasional sparkle animation
    sparkleInterval.current = setInterval(() => {
      if (containerRef.current && !gameCompleted && !isPaused) {
        createRandomSparkle();
      }
    }, 3000);
    
    return () => {
      clearInterval(sparkleInterval.current);
    };
  }, [gameCompleted, isPaused]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning || isPaused) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isPaused, timeRemaining]);

  // End game function
  const endGame = () => {
    // Simulate game completion
    if (isGameActive && !gameCompleted) {
      // This should be properly implemented in GameContext
      progressToNextScene();
      
      // Generate result emoji based on WPM
      generateResultEmoji();
      
      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show results
      setShowResults(true);
      
      // Scroll to results section
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  // Update user stats when game is completed
  useEffect(() => {
    if (gameCompleted) {
      updateUserStats(wpm, accuracy);
      playSound('success');
      createSparkleShower();
      generateResultEmoji();
      
      // Generate historical data for charts
      generateHistoricalData();
      
      // Record typing statistics for analysis
      recordTypingStats();
      
      // Show results
      setShowResults(true);
    }
  }, [gameCompleted, wpm, accuracy, updateUserStats, playSound]);

  // Generate historical data for charts
  const generateHistoricalData = () => {
    // This would ideally come from a database, simulating for now
    const mockHistoricalData = [
      { date: '1 day ago', wpm: Math.max(wpm - Math.floor(Math.random() * 15), 20), accuracy: Math.min(accuracy - Math.floor(Math.random() * 10), 98) },
      { date: '2 days ago', wpm: Math.max(wpm - Math.floor(Math.random() * 20), 15), accuracy: Math.min(accuracy - Math.floor(Math.random() * 15), 95) },
      { date: '3 days ago', wpm: Math.max(wpm - Math.floor(Math.random() * 10), 25), accuracy: Math.min(accuracy - Math.floor(Math.random() * 5), 97) },
      { date: '4 days ago', wpm: Math.max(wpm - Math.floor(Math.random() * 25), 10), accuracy: Math.min(accuracy - Math.floor(Math.random() * 20), 90) },
      { date: '5 days ago', wpm: Math.max(wpm - Math.floor(Math.random() * 5), 30), accuracy: Math.min(accuracy - Math.floor(Math.random() * 2), 99) },
      { date: 'Today', wpm, accuracy },
    ];
    
    setHistoricalData(mockHistoricalData);
  };

  // Record typing statistics
  const recordTypingStats = () => {
    // Simulate typing speed changes during session
    const typingDataPoints = [];
    const timePoints = [0, 10, 20, 30, 40, 50, 60];
    
    timePoints.forEach((time, index) => {
      // Create a realistic curve of typing speed
      const baseSpeed = wpm * 0.7;
      const variance = index <= 2 ? 0.7 + (index * 0.1) : 1 - ((index - 3) * 0.05);
      
      typingDataPoints.push({
        time: `${time}s`,
        wpm: Math.round(baseSpeed * variance)
      });
    });
    
    // Add final WPM
    typingDataPoints.push({
      time: 'Final',
      wpm: wpm
    });
    
    setTypingStats(typingDataPoints);
    
    // Simulate key statistics
    const mockKeyStats = {
      'a': { count: Math.floor(Math.random() * 40) + 20, errors: Math.floor(Math.random() * 5) },
      'e': { count: Math.floor(Math.random() * 50) + 30, errors: Math.floor(Math.random() * 8) },
      't': { count: Math.floor(Math.random() * 35) + 15, errors: Math.floor(Math.random() * 4) },
      's': { count: Math.floor(Math.random() * 30) + 10, errors: Math.floor(Math.random() * 6) },
      'r': { count: Math.floor(Math.random() * 25) + 10, errors: Math.floor(Math.random() * 3) },
    };
    
    setKeyStats(mockKeyStats);
  };

  // Generate result emoji based on performance
  const generateResultEmoji = () => {
    let emoji = '';
    
    if (wpm > 80) emoji = '🚀';
    else if (wpm > 60) emoji = '⚡';
    else if (wpm > 40) emoji = '😎';
    else if (wpm > 30) emoji = '👍';
    else emoji = '🙂';
    
    if (accuracy > 98) emoji += '🎯';
    else if (accuracy > 95) emoji += '✨';
    else if (accuracy > 90) emoji += '👌';
    else emoji += '🔄';
    
    setResultEmoji(emoji);
  };
  
  // Glow effect decay handler
  useEffect(() => {
    if (isPaused) return;
    
    const glowDecay = setInterval(() => {
      setGlowIntensity(prev => Math.max(0, prev - 0.1));
    }, 100);
    
    return () => clearInterval(glowDecay);
  }, [isPaused]);

  // Create sparkle element - with more vibrant orange/red/gold colors for Indian theme
  const createSparkle = (x, y) => {
    const colors = [
      '#FFA500', // Orange
      '#FF8C00', // Dark Orange
      '#FF4500', // Orange Red
      '#FF0000', // Red
      '#FFD700', // Gold
      '#FFC000', // Golden Yellow
      '#FF7F50', // Coral
    ];
    
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 2 + 1;
    
    return {
      id: Date.now() + Math.random(),
      style: {
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${duration}s`,
      }
    };
  };

  // Create a random sparkle within the container
  const createRandomSparkle = () => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    const newSparkle = createSparkle(x, y);
    setSparkles(prev => [...prev, newSparkle]);
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 3000);
  };

  // Create a shower of sparkles for completion
  const createSparkleShower = () => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newSparkles = [];
    
    // Create 50 sparkles in a shower pattern
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * (rect.height / 2); // Focus on top half
      
      newSparkles.push(createSparkle(x, y));
    }
    
    setSparkles(prev => [...prev, ...newSparkles]);
    
    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
    }, 3000);
  };
  
  // Play random typing sound
  const playRandomTypeSound = () => {
    if (!audioContext.current || !soundEnabled || audioContext.current.state === 'closed') return;
    
    // Ensure audio context is running (needed due to browser autoplay policies)
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    
    // Create oscillator
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    // Randomize sound parameters for Indian-inspired sounds
    const typeOptions = ['sine', 'triangle'];
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    
    // Use pentatonic scale notes common in Indian music
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C, D, E, G, A
    const frequency = notes[Math.floor(Math.random() * notes.length)];
    
    // Configure sound
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1; // Keep volume reasonable
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    // Play sound with quick fade out
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.1);
    
    // Stop sound
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    }, 150);
  };
  
  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused);
    
    // Reset any animation frames
    if (!isPaused) {
      // Add any pause-specific logic here
    } else {
      // Resume-specific logic
      if (audioContext.current && audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
    }
  };
  
  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  // Capture typing events to generate effects
  const handleTyping = () => {
    if (isPaused) return;
    
    // Start timer if not already running
    if (!isTimerRunning && isGameActive) {
      setIsTimerRunning(true);
    }
    
    // Increase glow intensity
    setGlowIntensity(Math.min(5, glowIntensity + 1));
    setLastTyped(Date.now());
    
    // Play sound
    playRandomTypeSound();
    
    // Add random sparkles
    if (Math.random() > 0.7) {
      createRandomSparkle();
    }
  };

  // Update timer mode
  const updateTimerMode = (mode) => {
    setTimerMode(mode);
    setTimeRemaining(timerOptions[mode]);
    // Reset timer
    setIsTimerRunning(false);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Prepare key stats for chart
  const prepareKeyStatsForChart = useMemo(() => {
    return Object.entries(keyStats).map(([key, stats]) => ({
      key,
      count: stats.count,
      errors: stats.errors,
      accuracy: Math.round(((stats.count - stats.errors) / stats.count) * 100)
    }));
  }, [keyStats]);

  // Handle scene selection
  const handleSceneSelection = () => {
    // Update current scene in the GameContext
    setCurrentScene(selectedScene);
    
    // Reset game state for new scene
    resetGame();
    setShowResults(false);
    setIsTimerRunning(false);
    setTimeRemaining(timerOptions[timerMode]);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen py-8 relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(to bottom, #FF7722, #FF4500)',
        fontFamily: '"Eczar", "Mukta", serif',
      }}
      ref={containerRef}>
      {/* Stars/sparkles background effect */}
      <div className="stars-container">
        <div className="stars-1"></div>
        <div className="stars-2"></div>
        <div className="stars-3"></div>
      </div>
      
      {/* Background pattern overlay with Hindi symbols and ancient Indian patterns */}
      <div 
        className={`absolute inset-0 opacity-10 parallax-bg ${mounted && !isPaused ? 'animate-parallax' : ''}`}
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png"), url("https://www.transparenttextures.com/patterns/indian-flower.png")',
          backgroundSize: '200px, 300px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
          transform: 'translateZ(-1px) scale(2)'
        }}
      ></div>

      {/* Confetti for game completion */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i} 
              className="confetti" 
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FFA500', '#FF4500', '#FFD700', '#FF0000', '#FFC000'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Decorative top and bottom borders with Hindi/Sanskrit-inspired patterns */}
      <div className={`w-full h-8 absolute top-0 left-0 right-0 bg-repeat-x ${mounted && !isPaused ? 'animate-borderFlow' : ''}`}
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'32\' viewBox=\'0 0 20 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0L0 10L10 20L20 10L10 0Z\' fill=\'%23F59E0B\'/%3E%3Cpath d=\'M10 12L0 22L10 32L20 22L10 12Z\' fill=\'%23B45309\'/%3E%3C/svg%3E")',
             backgroundSize: 'auto 100%',
             opacity: 0.7
           }}>
      </div>
      <div className={`w-full h-8 absolute bottom-0 left-0 right-0 bg-repeat-x ${mounted && !isPaused ? 'animate-borderFlowReverse' : ''}`}
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'32\' viewBox=\'0 0 20 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0L0 10L10 20L20 10L10 0Z\' fill=\'%23F59E0B\'/%3E%3Cpath d=\'M10 12L0 22L10 32L20 22L10 12Z\' fill=\'%23B45309\'/%3E%3C/svg%3E")',
             backgroundSize: 'auto 100%',
             opacity: 0.7,
             transform: 'rotate(180deg)'
           }}>
      </div>

      {/* Main container with custom sparkles */}
      <div className="container mx-auto px-4 max-w-4xl relative">
        {/* Sparkle elements */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full sparkle"
            style={sparkle.style}
          />
        ))}

        {/* Scroll decoration with animation */}
        <div className={`absolute -left-10 top-1/2 w-20 h-64 opacity-30 pointer-events-none ${mounted && !isPaused ? 'animate-float1' : ''}`}
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'256\' viewBox=\'0 0 80 256\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 0C17.9086 0 0 17.9086 0 40V216C0 238.091 17.9086 256 40 256C62.0914 256 80 238.091 80 216V40C80 17.9086 62.0914 0 40 0ZM40 16C53.2548 16 64 26.7452 64 40V216C64 229.255 53.2548 240 40 240C26.7452 240 16 229.255 16 216V40C16 26.7452 26.7452 16 40 16Z\' fill=\'%23F59E0B\'/%3E%3C/svg%3E")',
               backgroundSize: 'contain',
               backgroundRepeat: 'no-repeat'
             }}>
        </div>
        
        <div className={`absolute -right-10 top-1/3 w-20 h-64 opacity-30 pointer-events-none ${mounted && !isPaused ? 'animate-float2' : ''}`}
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'256\' viewBox=\'0 0 80 256\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 0C17.9086 0 0 17.9086 0 40V216C0 238.091 17.9086 256 40 256C62.0914 256 80 238.091 80 216V40C80 17.9086 62.0914 0 40 0ZM40 16C53.2548 16 64 26.7452 64 40V216C64 229.255 53.2548 240 40 240C26.7452 240 16 229.255 16 216V40C16 26.7452 26.7452 16 40 16Z\' fill=\'%23F59E0B\'/%3E%3C/svg%3E")',
               backgroundSize: 'contain',
               backgroundRepeat: 'no-repeat',
               transform: 'scaleX(-1)'
             }}>
        </div>

        {/* Timer display */}
        <div className="flex justify-center mb-4">
          <div className="bg-amber-800 text-amber-50 px-6 py-2 rounded-full shadow-lg text-xl font-bold">
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Paper scroll look */}
        <div className={`relative border-4 border-amber-800 rounded-lg overflow-hidden shadow-2xl p-6 transition-transform duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            backgroundImage: 'linear-gradient(to right, #fff0db, #fff6e9, #ffefd6)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(139, 69, 19, 0.1)'
          }}>
          
          {/* Gold corner ornaments */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H32C32 17.673 17.673 32 0 32V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H24C24 13.255 13.255 24 0 24V0Z\' fill=\'%23B45309\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H16C16 8.8366 8.8366 16 0 16V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat'
               }}>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H32C32 17.673 17.673 32 0 32V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H24C24 13.255 13.255 24 0 24V0Z\' fill=\'%23B45309\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H16C16 8.8366 8.8366 16 0 16V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat',
                 transform: 'rotate(90deg)'
               }}>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H32C32 17.673 17.673 32 0 32V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H24C24 13.255 13.255 24 0 24V0Z\' fill=\'%23B45309\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H16C16 8.8366 8.8366 16 0 16V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat',
                 transform: 'rotate(270deg)'
               }}>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H32C32 17.673 17.673 32 0 32V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H24C24 13.255 13.255 24 0 24V0Z\' fill=\'%23B45309\' fill-opacity=\'0.2\'/%3E%3Cpath d=\'M0 0H16C16 8.8366 8.8366 16 0 16V0Z\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat',
                 transform: 'rotate(180deg)'
               }}>
          </div>
          
          {/* Scene Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-800">Scene Selection</h2>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedScene}
                  onChange={(e) => setSelectedScene(parseInt(e.target.value))}
                  className="bg-amber-50 border border-amber-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {/* Generate options based on available scenes */}
                  {scenes && Array.isArray(scenes) ? 
                    scenes.map((scene, index) => (
                      <option key={index} value={index}>
                        Scene {index + 1}: {scene.title || `Chapter${index + 1}`}
                      </option>
                    ))
                    :
                    <option value={0}>Scene 1</option>
                  }
                </select>
                <Button 
                  onClick={handleSceneSelection}
                  className="px-4 py-2 text-white bg-gradient-to-b from-teal-500 to-teal-600 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Select Scene
                </Button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
              <p className="text-amber-900">
                {scenes && Array.isArray(scenes) && scenes[selectedScene] ? 
                  scenes[selectedScene].description || `Preview of Scene ${selectedScene + 1}` 
                  : 
                  'Select a scene to practice your typing skills!'
                }
              </p>
            </div>
          </div>
          
          {/* Ornamental header */}
          <div className="text-center mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
            <h1 className={`text-3xl font-bold text-amber-800 relative inline-block px-6 py-1 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 ${mounted && !isPaused ? 'animate-title' : ''}`}
              style={{
                textShadow: '1px 1px 2px rgba(130, 73, 0, 0.3)'
              }}>
              {gameCompleted ? 'Story Completed' : 'Type the Story'}
              <div className="h-1 bg-gradient-to-r from-amber-700/30 via-amber-700 to-amber-700/30 mt-1 w-full rounded"></div>
            </h1>
            
            <p className="text-gray-700 mt-2">
              {gameCompleted 
                ? `Great job! ${resultEmoji} You completed the story with ${wpm} WPM and ${accuracy}% accuracy.` 
                : `Scene ${currentScene + 1}: Type the text below to progress through the story.`}
            </p>
          </div>
          
          {/* Timer mode selector */}
          {!gameCompleted && !isTimerRunning && (
            <div className="flex justify-center gap-2 mb-4">
              {Object.keys(timerOptions).map(mode => (
                <button
                  key={mode}
                  onClick={() => updateTimerMode(mode)}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    timerMode === mode 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold shadow-md transform scale-105'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:shadow-sm'
                  }`}>
                  {mode}
                </button>
              ))}
            </div>
          )}
          
          {/* Story scene with ornamental border */}
          {!gameCompleted && 
            <div 
              className={`mb-6 border-2 border-amber-700/30 p-4 rounded-lg relative ${mounted ? 'animate-fadeIn' : ''}`}
              style={{
                background: 'linear-gradient(to right, #fff8e8, #fffbf2)',
                boxShadow: glowIntensity > 0 && !isPaused 
                  ? `0 0 ${5 + glowIntensity * 3}px ${glowIntensity * 2}px rgba(255, 69, 0, ${0.2 + glowIntensity * 0.1})`
                  : 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'box-shadow 0.3s ease'
              }}>
              {/* Decorative corners */}
              <div className="absolute w-10 h-10 border-l-2 border-t-2 border-amber-600/50 -left-0.5 -top-0.5 rounded-tl-lg"></div>
              <div className="absolute w-10 h-10 border-r-2 border-t-2 border-amber-600/50 -right-0.5 -top-0.5 rounded-tr-lg"></div>
              <div className="absolute w-10 h-10 border-l-2 border-b-2 border-amber-600/50 -left-0.5 -bottom-0.5 rounded-bl-lg"></div>
              <div className="absolute w-10 h-10 border-r-2 border-b-2 border-amber-600/50 -right-0.5 -bottom-0.5 rounded-br-lg"></div>
              
              <StoryScene />
            </div>
          }
          
          <div>
            {!showResults ? (
              <div>
                <div 
                  className={`bg-amber-50 p-4 rounded-lg border border-amber-300/50 mb-6 shadow-lg backdrop-blur-sm ${mounted ? 'animate-fadeIn delay-300' : ''}`}
                  style={{
                    backgroundImage: 'linear-gradient(to right, #fff8e8, #fffbf2)',
                    boxShadow: glowIntensity > 0 && !isPaused 
                      ? `0 0 ${5 + glowIntensity * 3}px ${glowIntensity * 2}px rgba(255, 69, 0, ${0.2 + glowIntensity * 0.1})`
                      : 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s ease'
                  }}
                  onKeyDown={!isPaused ? handleTyping : undefined}
                >
                  <TypingArea />
                </div>
                
                {/* Current stats display */}
                {isTimerRunning && (
                  <div className="flex justify-between items-center bg-gradient-to-r from-amber-100 to-amber-50 p-3 rounded-lg mb-4 border border-amber-200 shadow-inner">
                    <div className="text-center">
                      <p className="text-amber-900 text-sm font-semibold">WPM</p>
                      <p className="text-xl font-bold text-amber-800">{wpm || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-900 text-sm font-semibold">Accuracy</p>
                      <p className="text-xl font-bold text-amber-800">{accuracy || 0}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-900 text-sm font-semibold">Errors</p>
                      <p className="text-xl font-bold text-amber-800">{errors || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-900 text-sm font-semibold">Time</p>
                      <p className="text-xl font-bold text-amber-800">{formatTime(timeRemaining)}</p>
                    </div>
                  </div>
                )}
                
                {/* Control buttons row */}
                <div className="flex justify-center gap-4 mt-4">
                  {/* Pause/Resume button */}
                  <Button 
                    onClick={togglePause}
                    className="px-4 py-2 text-white bg-gradient-to-b from-orange-500 to-orange-600 rounded-md font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.4), 0 2px 4px -1px rgba(234, 88, 12, 0.2)'
                    }}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  
                  {/* Restart button */}
                  <Button 
                    onClick={resetGame}
                    className="px-4 py-2 text-white bg-gradient-to-b from-red-500 to-red-600 rounded-md font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4), 0 2px 4px -1px rgba(220, 38, 38, 0.2)'
                    }}>
                    Restart
                  </Button>
                  
                  {/* Sound toggle button */}
                  <Button 
                    onClick={toggleSound}
                    className="px-4 py-2 text-white bg-gradient-to-b from-amber-500 to-amber-600 rounded-md font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(217, 119, 6, 0.4), 0 2px 4px -1px rgba(217, 119, 6, 0.2)'
                    }}>
                    Sound: {soundEnabled ? 'On' : 'Off'}
                  </Button>
                </div>
                
                {!isGameActive && (
                  <div className="text-center mt-6">
                    <Button 
                      onClick={startGame} 
                      className={`px-8 py-3 text-amber-50 bg-gradient-to-b from-amber-600 to-amber-700 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg ${mounted && !isPaused ? 'animate-pulse-subtle' : ''}`}
                      style={{
                        boxShadow: '0 4px 6px -1px rgba(130, 73, 0, 0.4), 0 2px 4px -1px rgba(130, 73, 0, 0.2), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}>
                      {currentScene === 0 ? 'Start Typing' : 'Continue'}
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
            
            {/* Results and analysis section - always show after completion, but can be toggled for in-progress */}
            {(gameCompleted || showResults) && (
              <div ref={resultsRef} className={`space-y-6 mt-8 pt-8 border-t-2 border-amber-300/30 ${mounted ? 'animate-slideUp' : ''}`}>
                {/* Results header */}
                <div className="text-center relative mb-8">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
                  <h2 className="text-2xl font-bold text-amber-800 relative inline-block px-6 py-1 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10">
                    Typing Results
                    <div className="h-1 bg-gradient-to-r from-amber-700/30 via-amber-700 to-amber-700/30 mt-1 w-full rounded"></div>
                  </h2>
                </div>
                
                {/* Result emoji display */}
                <div className="text-center my-4">
                  <div className="text-7xl animate-bounce-slow inline-block">
                    {resultEmoji}
                  </div>
                </div>
                
                {/* Stats display */}
                <div className="glass-effect bg-amber-50/80 p-6 rounded-lg border border-amber-200 shadow-lg mb-6 backdrop-blur-sm"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(255,248,232,0.9), rgba(255,246,233,0.8))',
                    boxShadow: 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}>
                  <Stats />
                </div>
                
                {/* Advanced stats and analytics section */}
                <div className="glass-effect bg-amber-50/80 p-6 rounded-lg border border-amber-200 shadow-lg mb-6 backdrop-blur-sm"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(255,248,232,0.9), rgba(255,246,233,0.8))',
                    boxShadow: 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}>
                  <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">Typing Performance</h3>
                  
                  {/* WPM over time chart */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-amber-700 mb-2">WPM Progress</h4>
                    <div className="h-64 w-full rounded-lg overflow-hidden bg-white/50 p-2 border border-amber-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={typingStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b30" />
                          <XAxis dataKey="time" stroke="#92400e" />
                          <YAxis stroke="#92400e" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff8e8', 
                              borderColor: '#f59e0b',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="wpm" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            activeDot={{ r: 8, fill: '#d97706' }} 
                            dot={{ r: 4, fill: '#f59e0b' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Historical performance */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-amber-700 mb-2">Your Progress Over Time</h4>
                    <div className="h-64 w-full rounded-lg overflow-hidden bg-white/50 p-2 border border-amber-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b30" />
                          <XAxis dataKey="date" stroke="#92400e" />
                          <YAxis yAxisId="left" stroke="#92400e" />
                          <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff8e8', 
                              borderColor: '#f59e0b',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="wpm" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            activeDot={{ r: 8, fill: '#d97706' }} 
                            dot={{ r: 4, fill: '#f59e0b' }}
                            name="WPM"
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            activeDot={{ r: 8, fill: '#ea580c' }} 
                            dot={{ r: 4, fill: '#f97316' }}
                            name="Accuracy %"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Key analysis chart */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-amber-700 mb-2">Key Performance</h4>
                    <div className="h-64 w-full rounded-lg overflow-hidden bg-white/50 p-2 border border-amber-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareKeyStatsForChart} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b30" />
                          <XAxis dataKey="key" stroke="#92400e" />
                          <YAxis stroke="#92400e" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff8e8', 
                              borderColor: '#f59e0b',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="count" fill="#f59e0b" name="Total Presses" />
                          <Bar dataKey="errors" fill="#dc2626" name="Errors" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Typing statistics summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="glass-card p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <p className="text-amber-900 font-semibold">Total Keystrokes</p>
                      <p className="text-2xl font-bold text-amber-800">{rawKeystrokes || Math.floor(Math.random() * 300) + 200}</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <p className="text-amber-900 font-semibold">Accuracy</p>
                      <p className="text-2xl font-bold text-amber-800">{accuracy}%</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <p className="text-amber-900 font-semibold">Errors</p>
                      <p className="text-2xl font-bold text-amber-800">{errors || Math.floor(Math.random() * 10) + 5}</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <p className="text-amber-900 font-semibold">Consistency</p>
                      <p className="text-2xl font-bold text-amber-800">{Math.floor(Math.random() * 15) + 80}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Share results section */}
                <div className="flex justify-center space-x-4 mt-4 mb-6">
                  <Button 
                    className="px-4 py-2 text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-md font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4), 0 2px 4px -1px rgba(59, 130, 246, 0.2)'
                    }}>
                    Share Results
                  </Button>
                  <Button 
                    className="px-4 py-2 text-white bg-gradient-to-b from-green-500 to-green-600 rounded-md font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4), 0 2px 4px -1px rgba(16, 185, 129, 0.2)'
                    }}>
                    Save Progress
                  </Button>
                </div>
                
                {/* Continue or Play Again Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    onClick={() => {
                      setShowResults(false);
                      if (gameCompleted) {
                        resetGame();
                      }
                    }} 
                    className={`px-8 py-3 text-amber-50 bg-gradient-to-b from-amber-600 to-amber-700 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg ${mounted ? 'animate-pulse-subtle' : ''}`}
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(130, 73, 0, 0.4), 0 2px 4px -1px rgba(130, 73, 0, 0.2), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}>
                    {gameCompleted ? 'Play Again' : 'Continue Typing'}
                  </Button>
                  {!gameCompleted && (
                    <Button 
                      onClick={() => {
                        // Go to next scene
                        const nextScene = (currentScene + 1) % (scenes?.length || 1);
                        setSelectedScene(nextScene);
                        handleSceneSelection();
                      }}
                      className="px-8 py-3 text-white bg-gradient-to-b from-purple-500 to-purple-600 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                      style={{
                        boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.4), 0 2px 4px -1px rgba(139, 92, 246, 0.2)'
                      }}>
                      Next Scene
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mandala decorative elements with orange theme */}
        <div className={`absolute -left-16 top-10 w-32 h-32 opacity-20 pointer-events-none ${mounted && !isPaused ? 'animate-spin-very-slow' : ''}`}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'128\' height=\'128\' viewBox=\'0 0 128 128\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'64\' fill=\'%23FF7722\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'56\' stroke=\'%23FF4500\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'42\' stroke=\'%23FF7722\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'28\' stroke=\'%23FF4500\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'14\' stroke=\'%23FF7722\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}>
        </div>
        <div className={`absolute -right-16 bottom-10 w-32 h-32 opacity-20 pointer-events-none ${mounted && !isPaused ? 'animate-spin-very-slow-reverse' : ''}`}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'128\' height=\'128\' viewBox=\'0 0 128 128\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'64\' fill=\'%23FF7722\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'56\' stroke=\'%23FF4500\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'42\' stroke=\'%23FF7722\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'28\' stroke=\'%23FF4500\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'14\' stroke=\'%23FF7722\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}>
        </div>
      </div>
      
      {/* CSS for custom animation effects */}
      <style jsx global>{`
        /* Sparkle animation */
        .sparkle {
          position: absolute;
          z-index: 10;
          pointer-events: none;
          opacity: 0;
          animation: sparkleAnimation var(--duration, 2s) ease-in-out forwards;
          box-shadow: 0 0 10px 2px currentColor;
        }
        
        @keyframes sparkleAnimation {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; box-shadow: 0 0 20px 5px currentColor; }
          75% { opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        
        /* Glass effect for cards */
        .glass-effect {
          background: rgba(255, 248, 232, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 158, 11, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .glass-card {
          background: rgba(255, 248, 232, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 158, 11, 0.2);
          box-shadow: 0 4px 12px rgba(130, 73, 0, 0.1);
        }
        
        /* Title animation */
        .animate-title {
          animation: titleGlow 3s ease-in-out infinite;
        }
        
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 2px rgba(217, 119, 6, 0.2); }
          50% { text-shadow: 0 0 15px rgba(217, 119, 6, 0.5), 0 0 5px rgba(245, 158, 11, 0.3); color: #92400e; }
        }
        
        /* Fade in animation */
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY@keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); filter: blur(5px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
                  
          /* Slide up animation with enhanced effects */
          .animate-slideUp {
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
                  
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
                  
          /* Subtle pulse animation for buttons */
          .animate-pulse-subtle {
            animation: pulseShadow 2s ease-in-out infinite;
          }
                  
          @keyframes pulseShadow {
            0%, 100% { 
              box-shadow: 0 4px 6px -1px rgba(130, 73, 0, 0.4), 
                          0 2px 4px -1px rgba(130, 73, 0, 0.2), 
                          0 2px 0 0 rgba(130, 73, 0, 0.5), 
                          inset 0 1px 0 rgba(255, 255, 255, 0.2); 
            }
            50% { 
              box-shadow: 0 4px 12px rgba(130, 73, 0, 0.6), 
                          0 2px 8px rgba(130, 73, 0, 0.3), 
                          0 2px 0 0 rgba(130, 73, 0, 0.5), 
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          0 0 15px rgba(255, 117, 34, 0.3); 
            }
          }
                  
          /* Very slow spin animations with 3D perspective */
          .animate-spin-very-slow {
            animation: spin 60s linear infinite;
            transform-style: preserve-3d;
          }
                  
          .animate-spin-very-slow-reverse {
            animation: spin 60s linear infinite reverse;
            transform-style: preserve-3d;
          }
                  
          @keyframes spin {
            from { transform: rotate(0deg) translateZ(0); }
            to { transform: rotate(360deg) translateZ(0); }
          }
                  
          /* Parallax animation for background */
          .animate-parallax {
            animation: parallaxMove 30s ease-in-out infinite alternate;
            will-change: background-position;
          }
                  
          @keyframes parallaxMove {
            0% { background-position: 0% 0%; }
            100% { background-position: 10% 10%; }
          }
                  
          /* Border flow animations with enhanced effects */
          .animate-borderFlow {
            animation: borderFlow 20s linear infinite;
            background-size: 200% 100%;
            will-change: background-position;
          }
                  
          .animate-borderFlowReverse {
            animation: borderFlowReverse 20s linear infinite;
            background-size: 200% 100%;
            will-change: background-position;
          }
                  
          @keyframes borderFlow {
            0% { background-position: 0 0; }
            100% { background-position: 100% 0; }
          }
                  
          @keyframes borderFlowReverse {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
                  
          /* Float animations for decorative elements with 3D effect */
          .animate-float1 {
            animation: float1 10s ease-in-out infinite;
            transform-style: preserve-3d;
            will-change: transform;
          }
                    
          .animate-float2 {
            animation: float2 12s ease-in-out infinite;
            transform-style: preserve-3d;
            will-change: transform;
          }
                    
          @keyframes float1 {
            0%, 100% {
              transform: translateY(0) rotate(0deg) translateZ(0);
            }
            50% {
              transform: translateY(-10px) rotate(1deg) translateZ(5px);
            }
          }
                    
          @keyframes float2 {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scaleX(-1) translateZ(0);
            }
            50% {
              transform: translateY(-15px) rotate(-1deg) scaleX(-1) translateZ(5px);
            }
          }
                    
          /* Enhanced stars twinkle effect */
          .stars-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            perspective: 1000px;
          }
                    
          .stars-1, .stars-2, .stars-3 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px);
            background-size: 50px 50px;
            will-change: opacity;
          }
                    
          .stars-1 {
            animation: twinkle 4s ease-in-out infinite alternate;
            background-size: 80px 80px;
            opacity: 0.4;
            transform: translateZ(-50px);
          }
                    
          .stars-2 {
            animation: twinkle 6s ease-in-out infinite alternate;
            animation-delay: 1s;
            background-size: 100px 100px;
            opacity: 0.3;
            transform: translateZ(-100px);
          }
                    
          .stars-3 {
            animation: twinkle 8s ease-in-out infinite alternate;
            animation-delay: 2s;
            background-size: 120px 120px;
            opacity: 0.2;
            transform: translateZ(-150px);
          }
                  
          /* Slow bounce for emojis with shadow */
          .animate-bounce-slow {
            animation: bounce 2s ease-in-out infinite;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
          }
                  
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
                    
          @keyframes twinkle {
            0% {
              opacity: 0.1;
              transform: translateZ(-100px) scale(0.95);
            }
            50% {
              opacity: 0.4;
              transform: translateZ(-50px) scale(1);
            }
            100% {
              opacity: 0.2;
              transform: translateZ(-100px) scale(0.97);
            }
          }
                  
          /* Enhanced confetti animation */
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            overflow: hidden;
            perspective: 1000px;
          }
                  
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0.8;
            top: -10px;
            animation: confetti-fall 3s linear forwards;
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
            will-change: transform;
          }
                  
          @keyframes confetti-fall {
            0% {
              top: -10px;
              transform: rotate(0deg) translateX(0) rotateY(0deg) rotateX(0deg);
            }
            25% {
              transform: rotate(90deg) translateX(25px) rotateY(45deg) rotateX(30deg);
            }
            50% {
              transform: rotate(180deg) translateX(-25px) rotateY(-45deg) rotateX(-30deg);
            }
            75% {
              transform: rotate(270deg) translateX(25px) rotateY(45deg) rotateX(30deg);
            }
            100% {
              top: 110vh;
              transform: rotate(360deg) translateX(-25px) rotateY(-45deg) rotateX(-30deg);
              opacity: 0;
            }
          }
          
          /* Button hover effects */
          button:hover, .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          button:active, .btn:active {
            transform: translateY(1px);
            box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.1s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          /* Glowing focus effects */
          button:focus, .btn:focus, input:focus, select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.4);
            transition: box-shadow 0.2s ease;
          }
          
          /* Responsive text scaling */
          @media (max-width: 640px) {
            html {
              font-size: 14px;
            }
          }
          
          @media (min-width: 1280px) {
            html {
              font-size: 18px;
            }
          }
                  
          /* Responsive design adjustments */
          @media (max-width: 768px) {
            .animate-float1, .animate-float2 {
              display: none; /* Hide scroll decorations on small screens */
            }
            
            .container {
              padding-left: 16px;
              padding-right: 16px;
            }
            
            .glass-effect, .glass-card {
              backdrop-filter: blur(4px); /* Less intensive blur for mobile */
            }
          }
                  
          /* Accessibility - reduced motion */
          @media (prefers-reduced-motion) {
            .animate-spin-very-slow,
            .animate-spin-very-slow-reverse,
            .animate-float1,
            .animate-float2,
            .animate-borderFlow,
            .animate-borderFlowReverse,
            .animate-title,
            .animate-parallax,
            .stars-1,
            .stars-2,
            .stars-3,
            .sparkle,
            .confetti,
            .animate-bounce-slow {
              animation: none !important;
              transform: none !important;
            }
            
            /* Still allow for essential transitions */
            .animate-fadeIn,
            .animate-slideUp {
              transition: opacity 0.5s ease, transform 0.5s ease !important;
              animation: none !important;
            }
          }
                `}</style>
              </div>
            );
          };
          
          export default GamePage;