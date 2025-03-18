import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const createStars = () => {
      const numStars = 50;
      const navbar = document.querySelector('.navbar');
      for (let i = 0; i < numStars; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        navbar.appendChild(star);
      }
    };
    createStars();
  }, []);

  return (
    <nav className="navbar relative bg-gradient-to-r from-orange-700 to-red-500 shadow-2xl p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide neon-glow">
          TypeSymphony
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/storylines" className="nav-link">Stories</Link>

          {isAuthenticated ? (
            <>
              <Link to="/game" className="nav-link">Play</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={logout} className="nav-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* CSS Styles inside JSX */}
      <style jsx>{`
        @keyframes moveBackground {
          0% { background-position: 0 0; }
          100% { background-position: 200% 200%; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .navbar {
          position: relative;
          overflow: hidden;
          background-size: 300% 300%;
          animation: moveBackground 10s infinite alternate linear;
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .neon-glow {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 140, 0, 0.6);
        }

        .nav-link {
          position: relative;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          transition: all 0.3s ease-in-out;
          padding: 8px 14px;
          border-radius: 6px;
        }

        .nav-link:hover {
          color: #ffcc70;
          transform: scale(1.1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
        }

        .star {
          position: absolute;
          width: 5px;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
          animation: sparkle 3s infinite alternate;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
