import { useEffect, useState, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import StoryScene from '../components/game/StoryScene';
import TypingArea from '../components/game/TypingArea';
import Stats from '../components/game/Stats';
import useSound from '../hooks/useSound';

const GamePage = () => {
  const { 
    isGameActive, 
    startGame, 
    resetGame, 
    gameCompleted,
    wpm,
    accuracy,
    currentScene
  } = useGame();
  
  const { updateUserStats } = useAuth();
  const { playSound } = useSound();
  const [mounted, setMounted] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const sparkleInterval = useRef(null);
  const containerRef = useRef(null);

  // Update user stats when game is completed
  useEffect(() => {
    if (gameCompleted) {
      updateUserStats(wpm, accuracy);
      playSound('success');
      createSparkleShower();
    }
  }, [gameCompleted, wpm, accuracy, updateUserStats, playSound]);

  // Animation setup after component mount
  useEffect(() => {
    setMounted(true);
    
    // Start occasional sparkle animation
    sparkleInterval.current = setInterval(() => {
      if (containerRef.current && !gameCompleted) {
        createRandomSparkle();
      }
    }, 3000);
    
    return () => {
      clearInterval(sparkleInterval.current);
    };
  }, [gameCompleted]);

  // Create sparkle element
  const createSparkle = (x, y) => {
    const colors = [
      '#FFD700', // Gold
      '#FF8C00', // Dark Orange
      '#FF4500', // Orange Red
      '#B22222', // Fire Brick
      '#8B4513', // Saddle Brown
      '#CD853F', // Peru
      '#DAA520', // Goldenrod
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

  return (
    <div className="min-h-screen py-8 relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(to bottom, #3D1E09, #5F331F)',
        fontFamily: '"Eczar", "Mukta", serif',
      }}>
      {/* Stars/sparkles background effect */}
      <div className="stars-container">
        <div className="stars-1"></div>
        <div className="stars-2"></div>
        <div className="stars-3"></div>
      </div>
      
      {/* Background pattern overlay with parallax effect */}
      <div 
        className={`absolute inset-0 opacity-10 parallax-bg ${mounted ? 'animate-parallax' : ''}`}
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/gplay.png"), url("https://www.transparenttextures.com/patterns/indian-flower.png")',
          backgroundSize: '200px, 300px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
          transform: 'translateZ(-1px) scale(2)'
        }}
      ></div>

      {/* Decorative top and bottom borders */}
      <div className={`w-full h-8 absolute top-0 left-0 right-0 bg-repeat-x ${mounted ? 'animate-borderFlow' : ''}`}
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'32\' viewBox=\'0 0 20 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0L0 10L10 20L20 10L10 0Z\' fill=\'%23F59E0B\'/%3E%3Cpath d=\'M10 12L0 22L10 32L20 22L10 12Z\' fill=\'%23B45309\'/%3E%3C/svg%3E")',
             backgroundSize: 'auto 100%',
             opacity: 0.7
           }}>
      </div>
      <div className={`w-full h-8 absolute bottom-0 left-0 right-0 bg-repeat-x ${mounted ? 'animate-borderFlowReverse' : ''}`}
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'32\' viewBox=\'0 0 20 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0L0 10L10 20L20 10L10 0Z\' fill=\'%23F59E0B\'/%3E%3Cpath d=\'M10 12L0 22L10 32L20 22L10 12Z\' fill=\'%23B45309\'/%3E%3C/svg%3E")',
             backgroundSize: 'auto 100%',
             opacity: 0.7,
             transform: 'rotate(180deg)'
           }}>
      </div>

      {/* Main container with custom sparkles */}
      <div className="container mx-auto px-4 max-w-3xl relative" ref={containerRef}>
        {/* Sparkle elements */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full sparkle"
            style={sparkle.style}
          />
        ))}

        {/* Scroll decoration with animation */}
        <div className={`absolute -left-10 top-1/2 w-20 h-64 opacity-30 pointer-events-none ${mounted ? 'animate-float1' : ''}`}
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'256\' viewBox=\'0 0 80 256\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 0C17.9086 0 0 17.9086 0 40V216C0 238.091 17.9086 256 40 256C62.0914 256 80 238.091 80 216V40C80 17.9086 62.0914 0 40 0ZM40 16C53.2548 16 64 26.7452 64 40V216C64 229.255 53.2548 240 40 240C26.7452 240 16 229.255 16 216V40C16 26.7452 26.7452 16 40 16Z\' fill=\'%23F59E0B\'/%3E%3C/svg%3E")',
               backgroundSize: 'contain',
               backgroundRepeat: 'no-repeat'
             }}>
        </div>
        
        <div className={`absolute -right-10 top-1/3 w-20 h-64 opacity-30 pointer-events-none ${mounted ? 'animate-float2' : ''}`}
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'256\' viewBox=\'0 0 80 256\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 0C17.9086 0 0 17.9086 0 40V216C0 238.091 17.9086 256 40 256C62.0914 256 80 238.091 80 216V40C80 17.9086 62.0914 0 40 0ZM40 16C53.2548 16 64 26.7452 64 40V216C64 229.255 53.2548 240 40 240C26.7452 240 16 229.255 16 216V40C16 26.7452 26.7452 16 40 16Z\' fill=\'%23F59E0B\'/%3E%3C/svg%3E")',
               backgroundSize: 'contain',
               backgroundRepeat: 'no-repeat',
               transform: 'scaleX(-1)'
             }}>
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
          
          {/* Ornamental header */}
          <div className="text-center mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
            <h1 className={`text-3xl font-bold text-amber-800 relative inline-block px-6 py-1 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 ${mounted ? 'animate-title' : ''}`}
              style={{
                textShadow: '1px 1px 2px rgba(130, 73, 0, 0.3)'
              }}>
              {gameCompleted ? 'Story Completed' : 'Type the Story'}
              <div className="h-1 bg-gradient-to-r from-amber-700/30 via-amber-700 to-amber-700/30 mt-1 w-full rounded"></div>
            </h1>
            
            <p className="text-gray-700 mt-2">
              {gameCompleted 
                ? 'Great job! You have completed the story.' 
                : 'Type the text below to progress through the story.'}
            </p>
          </div>
          
          {/* Story scene with ornamental border */}
          {!gameCompleted && 
            <div className={`mb-6 border-2 border-amber-700/30 p-4 rounded-lg relative ${mounted ? 'animate-fadeIn' : ''}`}
              style={{
                background: 'linear-gradient(to right, #fff8e8, #fffbf2)',
                boxShadow: 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
              {/* Decorative corners */}
              <div className="absolute w-10 h-10 border-l-2 border-t-2 border-amber-600/50 -left-0.5 -top-0.5 rounded-tl-lg"></div>
              <div className="absolute w-10 h-10 border-r-2 border-t-2 border-amber-600/50 -right-0.5 -top-0.5 rounded-tr-lg"></div>
              <div className="absolute w-10 h-10 border-l-2 border-b-2 border-amber-600/50 -left-0.5 -bottom-0.5 rounded-bl-lg"></div>
              <div className="absolute w-10 h-10 border-r-2 border-b-2 border-amber-600/50 -right-0.5 -bottom-0.5 rounded-br-lg"></div>
              
              <StoryScene />
            </div>
          }
          
          {gameCompleted ? (
            <div className={`space-y-6 ${mounted ? 'animate-slideUp' : ''}`}>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-lg"
                style={{
                  backgroundImage: 'linear-gradient(to right, #fff8e8, #fffbf2)',
                  boxShadow: 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                <Stats />
              </div>
              
              <div className="text-center mt-6">
                <Button 
                  onClick={resetGame} 
                  className={`px-8 py-3 text-amber-50 bg-gradient-to-b from-amber-600 to-amber-700 rounded font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl ${mounted ? 'animate-pulse-subtle' : ''}`}
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(130, 73, 0, 0.4), 0 2px 4px -1px rgba(130, 73, 0, 0.2), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}>
                  Play Again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className={`bg-amber-50 p-4 rounded-lg border border-amber-300/50 mb-6 shadow-lg ${mounted ? 'animate-fadeIn delay-300' : ''}`}
                style={{
                  backgroundImage: 'linear-gradient(to right, #fff8e8, #fffbf2)',
                  boxShadow: 'inset 0 2px 4px 0 rgba(130, 73, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                <TypingArea />
              </div>
              
              {!isGameActive && (
                <div className="text-center mt-6">
                  <Button 
                    onClick={startGame} 
                    className={`px-8 py-3 text-amber-50 bg-gradient-to-b from-amber-600 to-amber-700 rounded font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl ${mounted ? 'animate-pulse-subtle' : ''}`}
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(130, 73, 0, 0.4), 0 2px 4px -1px rgba(130, 73, 0, 0.2), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}>
                    {currentScene === 0 ? 'Start Typing' : 'Continue'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mandala decorative elements */}
        <div className={`absolute -left-16 top-10 w-32 h-32 opacity-20 pointer-events-none ${mounted ? 'animate-spin-very-slow' : ''}`}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'128\' height=\'128\' viewBox=\'0 0 128 128\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'64\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'56\' stroke=\'%23B45309\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'42\' stroke=\'%23F59E0B\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'28\' stroke=\'%23B45309\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'14\' stroke=\'%23F59E0B\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}>
        </div>
        <div className={`absolute -right-16 bottom-10 w-32 h-32 opacity-20 pointer-events-none ${mounted ? 'animate-spin-very-slow-reverse' : ''}`}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'128\' height=\'128\' viewBox=\'0 0 128 128\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'64\' fill=\'%23F59E0B\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'56\' stroke=\'%23B45309\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'42\' stroke=\'%23F59E0B\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'28\' stroke=\'%23B45309\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3Ccircle cx=\'64\' cy=\'64\' r=\'14\' stroke=\'%23F59E0B\' stroke-opacity=\'0.4\' stroke-width=\'2\'/%3E%3C/svg%3E")',
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Slide up animation */
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Subtle pulse animation for buttons */
        .animate-pulse-subtle {
          animation: pulseShadow 2s ease-in-out infinite;
        }
        
        @keyframes pulseShadow {
          0%, 100% { box-shadow: 0 4px 6px -1px rgba(130, 73, 0, 0.4), 0 2px 4px -1px rgba(130, 73, 0, 0.2), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 4px 12px rgba(130, 73, 0, 0.6), 0 2px 8px rgba(130, 73, 0, 0.3), 0 2px 0 0 rgba(130, 73, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
        }
        
        /* Very slow spin animations */
        .animate-spin-very-slow {
          animation: spin 60s linear infinite;
        }
        
        .animate-spin-very-slow-reverse {
          animation: spin 60s linear infinite reverse;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Parallax animation for background */
        .animate-parallax {
          animation: parallaxMove 30s ease-in-out infinite alternate;
        }
        
        @keyframes parallaxMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 10% 10%; }
        }
        
        /* Border flow animations */
        .animate-borderFlow {
          animation: borderFlow 20s linear infinite;
          background-size: 200% 100%;
        }
        
        .animate-borderFlowReverse {
          animation: borderFlowReverse 20s linear infinite;
          background-size: 200% 100%;
        }
        
        @keyframes borderFlow {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }
        
        @keyframes borderFlowReverse {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
        
        /* Float animations for decorative elements */
        .animate-float1 {
            animation: float1 10s ease-in-out infinite;
          }
          
          .animate-float2 {
            animation: float2 12s ease-in-out infinite;
          }
          
          @keyframes float1 {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(1deg);
            }
          }
          
          @keyframes float2 {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scaleX(-1);
            }
            50% {
              transform: translateY(-15px) rotate(-1deg) scaleX(-1);
            }
          }
          
          /* Stars twinkle effect */
          .stars-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }
          
          .stars-1 {
            animation: twinkle 4s ease-in-out infinite alternate;
          }
          
          .stars-2 {
            animation: twinkle 6s ease-in-out infinite alternate;
            animation-delay: 1s;
          }
          
          .stars-3 {
            animation: twinkle 8s ease-in-out infinite alternate;
            animation-delay: 2s;
          }
          
          @keyframes twinkle {
            0% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 0.3;
            }
          }
          
          /* Responsive design adjustments */
          @media (max-width: 768px) {
            .animate-float1, .animate-float2 {
              display: none; /* Hide scroll decorations on small screens */
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
            .sparkle {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default GamePage;