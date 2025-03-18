import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../shared/Button';
import Input from '../shared/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const loginSuccess = login(email, password);
      
      if (loginSuccess) {
        navigate('/game');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a test user for easy login (only if no users exist)
  const createTestUser = () => {
    // Get current users
    let users = [];
    try {
      const storedUsers = localStorage.getItem('users');
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      users = [];
    }
    
    // Create test user if no users exist
    if (users.length === 0) {
      const testUser = {
        id: 'test1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        scores: []
      };
      
      localStorage.setItem('users', JSON.stringify([testUser]));
      setFormData({
        email: 'test@example.com',
        password: 'password'
      });
      
      return true;
    }
    
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      
      <div className="mt-4">
        <button 
          type="button" 
          onClick={() => {
            if (createTestUser()) {
              setError('Test user created! You can now login with the credentials filled in the form.');
            } else {
              setError('Users already exist. Please use your registered credentials.');
            }
          }}
          className="text-sm text-orange-600 hover:underline"
        >
          Create test user
        </button>
      </div>
    </form>
  );
};

export default LoginForm;