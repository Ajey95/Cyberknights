import { useState } from 'react';
import { Link } from 'react-router-dom';
import { storyData } from '../utils/storyData';
import Button from '../components/shared/Button';
import { useAuth } from '../contexts/AuthContext';

const StorylinesPage = () => {
  const { isAuthenticated } = useAuth();
  const [expandedScene, setExpandedScene] = useState(null);

  // Toggle scene expansion
  const toggleScene = (index) => {
    if (expandedScene === index) {
      setExpandedScene(null);
    } else {
      setExpandedScene(index);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">
              The Story of Krish, Trish, and Baltiboy
            </h1>
            <p className="text-orange-100">
              Explore the captivating folk tale used in our typing adventure
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                This traditional Indian folk tale follows the adventures of two monkeys 
                and a clever cat. Read through the story below, then practice your 
                typing skills with this enchanting narrative.
              </p>
              
              {isAuthenticated ? (
                <Link to="/game">
                  <Button className="w-full mb-6">
                    Start Typing This Story
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="w-full mb-6">
                    Login to Start Typing
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="space-y-4">
              {storyData.map((scene, index) => (
                <div 
                  key={index}
                  className="border border-orange-200 rounded-lg overflow-hidden"
                >
                  <div 
                    className="bg-orange-100 p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleScene(index)}
                  >
                    <h3 className="font-bold text-orange-800">
                      Scene {scene.scene}: {scene.title}
                    </h3>
                    <span className="text-orange-800">
                      {expandedScene === index ? '▲' : '▼'}
                    </span>
                  </div>
                  
                  {expandedScene === index && (
                    <div className="p-4 bg-white">
                      <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded">
                        <img 
                          src={`/images/scenes/${scene.image}`} 
                          alt={`Scene ${scene.scene}: ${scene.title}`}
                          className="w-full h-48 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/images/background.jpg";
                          }}
                        />
                      </div>
                      
                      <p className="text-gray-700">{scene.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              {isAuthenticated ? (
                <Link to="/game">
                  <Button className="px-8 py-3">
                    Practice Typing Now
                  </Button>
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link to="/login">
                    <Button className="px-8 py-3">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="px-8 py-3 bg-orange-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorylinesPage;