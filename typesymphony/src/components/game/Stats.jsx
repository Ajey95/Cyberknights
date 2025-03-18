import { useGame } from '../../contexts/GameContext';
import { storyData } from '../../utils/storyData';

const StoryScene = () => {
  const { currentScene } = useGame();
  const scene = storyData[currentScene];

  return (
    <div className="mb-8">
      <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img 
            src={`/images/scenes/${scene.image}`} 
            alt={`Scene ${scene.scene}: ${scene.title}`}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = "/images/background.jpg";
            }}
          />
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-orange-700">
            Scene {scene.scene}: {scene.title}
          </h2>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {currentScene + 1} of {storyData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryScene;