import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginForm from '../components/auth/LoginForm';

// Embedded CSS using style tags
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rozha+One&display=swap');

  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: 'Mukta', sans-serif;
    position: relative;
    overflow: hidden;
    background-color: #fff3e0;
  }

  .login-bg-pattern {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8;
  }

  .rangoli-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .rangoli-particle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.7;
    pointer-events: none;
    animation: float-up 3s ease-out forwards;
  }

  @keyframes float-up {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    100% {
      transform: scale(1.5) rotate(360deg);
      opacity: 0;
    }
  }

  .temple-silhouette {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 L0,80 L40,80 L40,60 L60,60 L60,40 L80,40 L80,60 L100,60 L100,80 L140,80 L140,60 L160,60 L160,40 L180,40 L180,60 L200,60 L200,80 L240,80 L240,60 L260,60 L260,40 L280,40 L280,60 L300,60 L300,80 L340,80 L340,60 L360,60 L360,40 L380,40 L380,60 L400,60 L400,80 L440,80 L440,60 L460,60 L460,40 L480,40 L480,60 L500,60 L480,80 L520,80 L520,60 L540,60 L540,40 L560,40 L560,60 L580,60 L580,80 L620,80 L620,60 L640,60 L640,40 L660,40 L660,60 L680,60 L680,80 L720,80 L720,60 L740,60 L740,40 L760,40 L760,60 L780,60 L780,80 L820,80 L820,60 L840,60 L840,40 L860,40 L860,60 L880,60 L880,80 L920,80 L920,60 L940,60 L940,40 L960,40 L960,60 L980,60 L980,80 L1000,80 L1000,120 Z' fill='%23783e04' fill-opacity='0.3'/%3E%3C/svg%3E");
    background-size: cover;
    background-position: bottom center;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .login-card-container {
    max-width: 28rem;
    width: 100%;
    position: relative;
  }

  .card-entrance {
    animation: card-entrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes card-entrance {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .login-card-border {
    position: absolute;
    inset: -0.75rem;
    background: linear-gradient(to right, #d97706, #b91c1c, #d97706);
    border-radius: 0.5rem;
    filter: blur(8px);
    opacity: 0.75;
    z-index: -10;
  }

  .login-card {
    background: linear-gradient(to right, #fffbeb, #fef3c7);
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 2px solid #92400e;
    position: relative;
  }

  .corner-decoration {
    position: absolute;
    width: 4rem;
    height: 4rem;
    pointer-events: none;
    opacity: 0.7;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0,0 C30,10 40,30 50,50 C50,40 60,30 80,20 C90,10 100,0 100,0 L100,100 L0,100 Z' fill='%23b45309' fill-opacity='0.2'/%3E%3Cpath d='M20,0 C30,20 40,40 45,45 C42,48 20,80 0,90 L0,0 Z' fill='%23b45309' fill-opacity='0.2'/%3E%3Ccircle cx='25' cy='25' r='10' fill='%23b45309' fill-opacity='0.3'/%3E%3C/svg%3E");
  }

  .top-left {
    top: 0;
    left: 0;
  }

  .top-right {
    top: 0;
    right: 0;
    transform: rotate(90deg);
  }

  .bottom-left {
    bottom: 0;
    left: 0;
    transform: rotate(-90deg);
  }

  .bottom-right {
    bottom: 0;
    right: 0;
    transform: rotate(180deg);
  }

  .login-header {
    background: linear-gradient(to right, #991b1b, #dc2626, #991b1b);
    padding: 2rem 1.5rem;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .header-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 60c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm0-50c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm-20 20c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm40 0c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z'/%3E%3C/g%3E%3C/svg%3E");
  }

  .fade-slide-down {
    animation: fade-slide-down 0.8s ease-out forwards;
    animation-delay: 0.2s;
    opacity: 0;
  }

  @keyframes fade-slide-down {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header-title {
    font-family: 'Rozha One', serif;
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .header-divider {
    height: 0.25rem;
    width: 4rem;
    background-color: #fcd34d;
    border-radius: 9999px;
    margin-bottom: 1rem;
  }

  .header-subtitle {
    color: #fecaca;
  }

  .login-body {
    padding: 2rem;
    position: relative;
  }

  .background-mandala {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.05;
    pointer-events: none;
  }

  .mandala-image {
    width: 75%;
    height: auto;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='70' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='50' fill='none' stroke='%23b45309' stroke-width='1'/%3E%3Cpath d='M10,100 H190 M100,10 V190 M29.3,29.3 L170.7,170.7 M29.3,170.7 L170.7,29.3' stroke='%23b45309' stroke-width='1'/%3E%3C/svg%3E");
  }

  .fade-slide-up {
    animation: fade-slide-up 0.8s ease-out forwards;
    animation-delay: 0.4s;
    opacity: 0;
  }

  @keyframes fade-slide-up {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .signup-link {
    display: inline-block;
    color: #b91c1c;
    font-weight: 500;
    position: relative;
  }

  .signup-link:hover {
    color: #991b1b;
  }

  .signup-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #b91c1c;
    transition: width 0.3s ease;
  }

  .signup-link:hover::after {
    width: 100%;
  }
`;

const LoginPage = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Add rangoli particle effect
    const createRangoliParticle = () => {
      const colors = ['#FF9933', '#FFFFFF', '#138808', '#FFC107', '#E91E63', '#9C27B0'];
      const container = document.querySelector('.rangoli-container');
      if (!container) return;
      
      const particle = document.createElement('div');
      particle.className = 'rangoli-particle';
      
      // Random position
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      
      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Apply styles
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = color;
      particle.style.width = `${5 + Math.random() * 5}px`;
      particle.style.height = particle.style.width;
      
      // Add to DOM
      container.appendChild(particle);
      
      // Remove after animation completes
      setTimeout(() => {
        particle.remove();
      }, 3000);
    };
    
    // Create particles at intervals
    const intervalId = setInterval(createRangoliParticle, 300);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {/* Inject styles */}
      <style>{styles}</style>
      
      <div className="login-container">
        {/* Background pattern */}
        <div className="login-bg-pattern"></div>
        
        {/* Rangoli particle container */}
        <div className="rangoli-container"></div>
        
        {/* Temple silhouette at bottom */}
        <div className="temple-silhouette"></div>
        
        <div className={`login-card-container ${showAnimation ? 'card-entrance' : ''}`}>
          {/* Decorative border */}
          <div className="login-card-border"></div>
          
          {/* Main card */}
          <div className="login-card">
            {/* Corner decorations */}
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>
            
            {/* Header section */}
            <div className="login-header">
              {/* Decorative pattern */}
              <div className="header-pattern"></div>
              
              <div className={`${showAnimation ? 'fade-slide-down' : ''}`}>
                <h1 className="header-title">Welcome Back</h1>
                <div className="header-divider"></div>
                <p className="header-subtitle">
                  Login to continue your typing journey
                </p>
              </div>
            </div>
            
            {/* Form section */}
            <div className="login-body">
              {/* Background mandala */}
              <div className="background-mandala">
                <div className="mandala-image"></div>
              </div>
              
              <div className={`${showAnimation ? 'fade-slide-up' : ''}`}>
                <LoginForm />
                
                <div className="mt-6 text-center text-sm">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="signup-link">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;