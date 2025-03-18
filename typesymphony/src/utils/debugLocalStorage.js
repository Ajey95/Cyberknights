// Utility functions to help with debugging localStorage
const debugLocalStorage = {
    // Print all localStorage contents to console
    printAll: () => {
      console.log('--- localStorage Contents ---');
      
      if (localStorage.length === 0) {
        console.log('localStorage is empty');
        return;
      }
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key);
          const parsedValue = JSON.parse(value);
          console.log(`${key}:`, parsedValue);
        } catch (error) {
          console.log(`${key}: ${localStorage.getItem(key)} (not JSON)`);
        }
      }
      
      console.log('----------------------------');
    },
    
    // Clear specific keys
    clearItems: (keys) => {
      keys.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared items: ${keys.join(', ')}`);
    },
    
    // Clear all localStorage
    clearAll: () => {
      localStorage.clear();
      console.log('All localStorage items cleared');
    },
    
    // Get current users
    getUsers: () => {
      try {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
      } catch (error) {
        console.error('Error parsing users:', error);
        return [];
      }
    },
    
    // Get current user
    getCurrentUser: () => {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Error parsing current user:', error);
        return null;
      }
    },
    
    // Add a test user
    addTestUser: () => {
      const testUser = {
        id: Date.now().toString(),
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        scores: []
      };
      
      let users = [];
      try {
        const storedUsers = localStorage.getItem('users');
        users = storedUsers ? JSON.parse(storedUsers) : [];
      } catch (error) {
        users = [];
      }
      
      // Add test user if it doesn't exist
      if (!users.find(u => u.email === testUser.email)) {
        users.push(testUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Test user added:', testUser);
      } else {
        console.log('Test user already exists');
      }
      
      return testUser;
    }
  };
  
  export default debugLocalStorage;