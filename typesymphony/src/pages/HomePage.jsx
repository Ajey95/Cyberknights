import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [fireAnimation, setFireAnimation] = useState(false);

  // Trigger animations after component mount
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setFireAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-amber-100 font-serif">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-repeat opacity-10" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/indian-flower.png")' }}>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-no-repeat bg-contain opacity-20"
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rangoli.png")' }}>
      </div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-no-repeat bg-contain opacity-20"
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rangoli.png")' }}>
      </div>
      
      {/* Animated border */}
      <div className={`fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-700 via-yellow-500 to-orange-600 ${mounted ? 'animate-borderFlow' : ''}`}></div>
      <div className={`fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-yellow-500 to-amber-700 ${mounted ? 'animate-borderFlowReverse' : ''}`}></div>
      <div className={`fixed top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-amber-700 via-yellow-500 to-orange-600 ${mounted ? 'animate-borderFlowVertical' : ''}`}></div>
      <div className={`fixed top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-orange-600 via-yellow-500 to-amber-700 ${mounted ? 'animate-borderFlowVerticalReverse' : ''}`}></div>
      
      {/* Floating Rangoli patterns */}
      <div className={`absolute left-10 top-40 w-16 h-16 bg-no-repeat bg-contain opacity-30 ${mounted ? 'animate-float1' : ''}`}
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rangoli.png")' }}>
      </div>
      <div className={`absolute right-10 bottom-40 w-20 h-20 bg-no-repeat bg-contain opacity-30 ${mounted ? 'animate-float2' : ''}`}
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rangoli.png")' }}>
      </div>
      
      {/* Hero section */}
      <div className="bg-gradient-to-b from-orange-700 to-orange-600 text-white py-16 relative overflow-hidden">
        {/* Decorative SVG mandala pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg width="800" height="800" viewBox="0 0 800 800" className={`${mounted ? 'animate-spin-slow' : ''}`}>
            <circle cx="400" cy="400" r="380" fill="none" stroke="#FFF" strokeWidth="2" />
            <circle cx="400" cy="400" r="320" fill="none" stroke="#FFF" strokeWidth="2" />
            <circle cx="400" cy="400" r="260" fill="none" stroke="#FFF" strokeWidth="2" />
            <g>
              {[...Array(16)].map((_, i) => (
                <path key={i} 
                  d={`M 400 400 L ${400 + 380 * Math.cos(i * Math.PI / 8)} ${400 + 380 * Math.sin(i * Math.PI / 8)}`} 
                  stroke="#FFF" 
                  strokeWidth="2"
                />
              ))}
            </g>
            {[...Array(32)].map((_, i) => (
              <circle key={i} 
                cx={400 + 320 * Math.cos(i * Math.PI / 16)} 
                cy={400 + 320 * Math.sin(i * Math.PI / 16)} 
                r="5" 
                fill="#FFF" 
              />
            ))}
          </svg>
        </div>
        
        <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center transition-all duration-1000 ease-out font-serif ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
               style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            <span className="text-yellow-300">Type</span>Symphony
          </h1>
          
          <div className={`h-1 w-40 bg-yellow-300 mb-6 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
          
          <p className={`text-xl mb-8 text-center max-w-2xl transition-all duration-1000 delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Enhance your typing skills with a cultural twist. Experience traditional Indian storytelling while practicing your typing speed and accuracy.
          </p>
          
          <div className={`transition-all duration-1000 delay-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/game">
                  <Button className={`text-lg px-8 py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 shadow-md transition-all duration-300 ${fireAnimation ? 'animate-buttonPulse' : ''}`}>
                    Start Typing
                  </Button>
                </Link>
                <Link to="/storylines">
                  <Button className="text-lg px-8 py-3 bg-orange-800 hover:bg-orange-900 active:bg-red-900 shadow-md transition-all duration-300">
                    Explore Stories
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/login">
                  <Button className="text-lg px-8 py-3 w-full sm:w-auto border-2 border-yellow-300 bg-transparent hover:bg-yellow-800/30 active:bg-yellow-900/50 shadow-md transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className={`text-lg px-8 py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 w-full sm:w-auto shadow-md transition-all duration-300 ${fireAnimation ? 'animate-buttonPulse' : ''}`}>
                    Sign Up
                  </Button>
                </Link>
                <Link to="/storylines">
                  <Button className="text-lg px-8 py-3 bg-orange-800 hover:bg-orange-900 active:bg-red-900 w-full sm:w-auto shadow-md transition-all duration-300">
                    Preview Stories
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className={`text-3xl font-bold mb-8 text-center text-orange-800 transition-all duration-1000 delay-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Experience the Magic of Ancient India
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`bg-white p-6 rounded-lg shadow-md border border-amber-200 transform transition-all duration-700 delay-800 ease-out hover:shadow-xl hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
               style={{backgroundImage: 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.2), rgba(254, 243, 199, 0.05))'}}>
            <div className="w-16 h-16 bg-orange-100 rounded-full mb-4 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4 text-orange-700 border-b-2 border-amber-200 pb-2">
              Indian Folk Tales
            </h2>
            <p className="text-gray-700">
              Type through traditional Indian stories featuring Krish, Trish, and Baltiboy. Experience the cultural richness while improving your typing skills.
            </p>
          </div>
          
          <div className={`bg-white p-6 rounded-lg shadow-md border border-amber-200 transform transition-all duration-700 delay-900 ease-out hover:shadow-xl hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
               style={{backgroundImage: 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.2), rgba(254, 243, 199, 0.05))'}}>
            <div className="w-16 h-16 bg-orange-100 rounded-full mb-4 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4 text-orange-700 border-b-2 border-amber-200 pb-2">
              Holi Color Effects
            </h2>
            <p className="text-gray-700">
              Enjoy vibrant Holi-inspired color effects with each keystroke. The better you type, the more colorful your experience becomes.
            </p>
          </div>
          
          <div className={`bg-white p-6 rounded-lg shadow-md border border-amber-200 transform transition-all duration-700 delay-1000 ease-out hover:shadow-xl hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
               style={{backgroundImage: 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.2), rgba(254, 243, 199, 0.05))'}}>
            <div className="w-16 h-16 bg-orange-100 rounded-full mb-4 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4 text-orange-700 border-b-2 border-amber-200 pb-2">
              Track Your Progress
            </h2>
            <p className="text-gray-700">
              Monitor your typing speed and accuracy. Compete with others on the leaderboard and see your improvement over time.
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative footer element */}
      <div className="h-16 bg-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-repeat-x opacity-30"
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/indian-flower.png")' }}>
        </div>
        <div className="h-full flex items-center justify-center text-white">
          <p className="text-sm">Immerse yourself in the beauty of Indian storytelling</p>
        </div>
      </div>
      
      {/* Style definitions for animations */}
      <style jsx global>{`
        @keyframes borderFlow {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes borderFlowReverse {
          0% { background-position: 100% 0; }
          100% { background-position: 0% 0; }
        }
        @keyframes borderFlowVertical {
          0% { background-position: 0 0%; }
          100% { background-position: 0 100%; }
        }
        @keyframes borderFlowVerticalReverse {
          0% { background-position: 0 100%; }
          100% { background-position: 0 0%; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-borderFlow {
          animation: borderFlow 15s linear infinite;
          background-size: 200% 100%;
        }
        .animate-borderFlowReverse {
          animation: borderFlowReverse 15s linear infinite;
          background-size: 200% 100%;
        }
        .animate-borderFlowVertical {
          animation: borderFlowVertical 15s linear infinite;
          background-size: 100% 200%;
        }
        .animate-borderFlowVerticalReverse {
          animation: borderFlowVerticalReverse 15s linear infinite;
          background-size: 100% 200%;
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 12s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 120s linear infinite;
        }
        .animate-buttonPulse {
          animation: buttonPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;