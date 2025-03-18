import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../shared/Button';
import Input from '../shared/Input';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const { register } = useAuth();
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
    
    const { name, email, password, confirmPassword } = formData;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Register user
      const registrationSuccess = register(name, email, password);
      
      if (registrationSuccess) {
        navigate('/game');
      } else {
        setError('Email already in use');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <Input
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        required
      />
      
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
      
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
      />
      
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;