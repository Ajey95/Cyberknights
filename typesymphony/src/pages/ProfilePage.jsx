import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  
  // Sort scores by date (most recent first)
  const sortedScores = currentUser.scores 
    ? [...currentUser.scores].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];
  
  // Calculate average WPM and accuracy
  const averageWpm = sortedScores.length > 0
    ? Math.round(sortedScores.reduce((sum, score) => sum + score.wpm, 0) / sortedScores.length)
    : 0;
  
  const averageAccuracy = sortedScores.length > 0
    ? Math.round(sortedScores.reduce((sum, score) => sum + score.accuracy, 0) / sortedScores.length)
    : 0;
  
  // Get best score
  const bestScore = sortedScores.length > 0
    ? sortedScores.reduce((best, score) => score.wpm > best.wpm ? score : best, sortedScores[0])
    : null;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-orange-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">
              {currentUser.name}'s Profile
            </h1>
            <p className="text-orange-100">
              Track your typing progress
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <p className="text-sm text-orange-800">Total Games</p>
                <p className="text-2xl font-bold text-orange-700">
                  {sortedScores.length}
                </p>
              </div>
              
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <p className="text-sm text-orange-800">Avg. Speed</p>
                <p className="text-2xl font-bold text-orange-700">
                  {averageWpm} WPM
                </p>
              </div>
              
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <p className="text-sm text-orange-800">Avg. Accuracy</p>
                <p className="text-2xl font-bold text-orange-700">
                  {averageAccuracy}%
                </p>
              </div>
            </div>
            
            {bestScore && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-orange-700">
                  Best Performance
                </h2>
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-green-800">Speed</p>
                      <p className="text-xl font-bold text-green-700">
                        {bestScore.wpm} WPM
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-green-800">Accuracy</p>
                      <p className="text-xl font-bold text-green-700">
                        {bestScore.accuracy}%
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-green-800">Date</p>
                      <p className="text-xl font-bold text-green-700">
                        {new Date(bestScore.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold mb-4 text-orange-700">
                Recent Games
              </h2>
              
              {sortedScores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Speed (WPM)</th>
                        <th className="px-4 py-2">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedScores.slice(0, 5).map((score, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">
                            {new Date(score.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {score.wpm}
                          </td>
                          <td className="px-4 py-2">
                            {score.accuracy}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">
                  You haven't completed any games yet.
                </p>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/game">
                <Button className="px-8 py-3">
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;