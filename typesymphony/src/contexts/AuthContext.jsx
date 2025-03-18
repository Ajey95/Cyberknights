import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // Get users from localStorage
    let users = [];
    try {
      const storedUsers = localStorage.getItem('users');
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Error parsing users data:', error);
      return false;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  // Register function
  const register = (name, email, password) => {
    // Get users from localStorage
    let users = [];
    try {
      const storedUsers = localStorage.getItem('users');
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Error parsing users data:', error);
      users = []; // Reset to empty array if parsing fails
    }
    
    // Check if user already exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password, 
      scores: [] 
    };
    
    // Add user to list
    users.push(newUser);
    
    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Update user stats
  const updateUserStats = (wpm, accuracy) => {
    if (!currentUser) return;
    
    // Create updated user object
    const updatedUser = { 
      ...currentUser,
      scores: [...(currentUser.scores || []), { 
        wpm, 
        accuracy, 
        date: new Date().toISOString() 
      }]
    };
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update users list
    let users = [];
    try {
      const storedUsers = localStorage.getItem('users');
      users = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
    
    // Update state
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserStats,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};