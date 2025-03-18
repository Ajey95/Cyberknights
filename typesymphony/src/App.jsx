import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import StorylinesPage from './pages/StorylinesPage';
import Navbar from './components/shared/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/storylines" element={<StorylinesPage />} />
          <Route path="/game" element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;