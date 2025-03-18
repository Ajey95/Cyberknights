import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

// Import Google Fonts in your main CSS file or index.html:
// <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&display=swap" rel="stylesheet">

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load users from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Process users to get their best scores
        const processedUsers = storedUsers.map(user => {
          if (!user.scores || user.scores.length === 0) {
            return {
              ...user,
              bestWpm: 0,
              bestAccuracy: 0,
              avgWpm: 0
            };
          }
          
          // Calculate best and average scores
          const bestWpm = Math.max(...user.scores.map(score => score.wpm));
          const bestAccuracy = Math.max(...user.scores.map(score => score.accuracy));
          const avgWpm = Math.round(
            user.scores.reduce((sum, score) => sum + score.wpm, 0) / user.scores.length
          );
          
          return {
            ...user,
            bestWpm,
            bestAccuracy,
            avgWpm
          };
        });
        
        // Sort by best WPM (highest first)
        const sortedUsers = processedUsers.sort((a, b) => b.bestWpm - a.bestWpm);
        
        setUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: "url('/indian-pattern-bg.png')", 
      backgroundSize: "400px",
      backgroundRepeat: "repeat",
      backgroundAttachment: "fixed",
      backgroundColor: "#f7e9d7"
    }}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="rounded-lg overflow-hidden" style={{
          boxShadow: "0 4px 20px rgba(131, 77, 33, 0.4)",
          border: "1px solid #c9a063",
          background: "linear-gradient(rgba(255, 251, 240, 0.92), rgba(255, 251, 240, 0.92))",
          fontFamily: "'Mukta', sans-serif"
        }}>
          <div className="px-6 py-8 text-white" style={{
            background: "linear-gradient(135deg, #9c2c13 0%, #c6430f 100%)",
            borderBottom: "3px solid #c9a063",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Decorative corner embellishments */}
            <div className="absolute top-0 left-0 w-16 h-16" style={{
              background: "url('/corner-motif.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              transform: "rotate(0deg)",
              opacity: 0.3
            }}></div>
            <div className="absolute top-0 right-0 w-16 h-16" style={{
              background: "url('/corner-motif.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              transform: "rotate(90deg)",
              opacity: 0.3
            }}></div>
            
            <h1 className="text-3xl font-bold mb-2" style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              color: "#f9e0b8",
              letterSpacing: "0.05em"
            }}>
              महारथी सूची
              <span className="block text-xl mt-1" style={{letterSpacing: "0.03em"}}>Leaderboard</span>
            </h1>
            <p className="text-orange-100" style={{
              fontStyle: "italic",
              textShadow: "0px 1px 1px rgba(0,0,0,0.3)"
            }}>
              See how your skills rank among the greatest scribes
            </p>
          </div>
          
          <div className="p-6" style={{
            backgroundImage: "url('/subtle-parchment.png')",
            backgroundSize: "cover"
          }}>
            {loading ? (
              <p className="text-center py-8" style={{color: "#78350f"}}>Loading ancient scrolls...</p>
            ) : users.length === 0 ? (
              <p className="text-center py-8" style={{color: "#78350f"}}>The scrolls await the first scribe.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 3px"
                }}>
                  <thead>
                    <tr>
                      <th className="px-4 py-3" style={{
                        color: "#78350f",
                        fontWeight: "bold",
                        borderBottom: "2px solid #c9a063",
                        textAlign: "left"
                      }}>Rank</th>
                      <th className="px-4 py-3" style={{
                        color: "#78350f",
                        fontWeight: "bold",
                        borderBottom: "2px solid #c9a063",
                        textAlign: "left"
                      }}>Name</th>
                      <th className="px-4 py-3" style={{
                        color: "#78350f",
                        fontWeight: "bold",
                        borderBottom: "2px solid #c9a063",
                        textAlign: "left"
                      }}>Best WPM</th>
                      <th className="px-4 py-3" style={{
                        color: "#78350f",
                        fontWeight: "bold",
                        borderBottom: "2px solid #c9a063",
                        textAlign: "left"
                      }}>Best Accuracy</th>
                      <th className="px-4 py-3" style={{
                        color: "#78350f",
                        fontWeight: "bold",
                        borderBottom: "2px solid #c9a063",
                        textAlign: "left"
                      }}>Avg. WPM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} style={{
                        background: index === 0 
                          ? "linear-gradient(to right, rgba(253, 230, 138, 0.4), rgba(252, 211, 77, 0.1))" 
                          : index === 1 
                            ? "linear-gradient(to right, rgba(229, 231, 235, 0.4), rgba(209, 213, 219, 0.1))" 
                            : index === 2 
                              ? "linear-gradient(to right, rgba(180, 83, 9, 0.2), rgba(180, 83, 9, 0.05))" 
                              : "rgba(255, 251, 240, 0.4)",
                        transition: "all 0.3s ease",
                      }}>
                        <td className="px-4 py-3 font-medium" style={{
                          color: index < 3 ? "#78350f" : "#57534e",
                          fontWeight: index < 3 ? "bold" : "normal",
                          position: "relative"
                        }}>
                          {index < 3 && (
                            <span style={{
                              position: "absolute",
                              left: "-5px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "10px",
                              height: "10px",
                              background: index === 0 ? "#fcd34d" : index === 1 ? "#9ca3af" : "#b45309",
                              borderRadius: "50%"
                            }}></span>
                          )}
                          {index + 1}
                        </td>
                        <td className="px-4 py-3" style={{
                          color: "#57534e",
                          fontWeight: index < 3 ? "bold" : "normal"
                        }}>
                          {user.name}
                        </td>
                        <td className="px-4 py-3" style={{
                          color: "#b45309",
                          fontWeight: "bold"
                        }}>
                          {user.bestWpm}
                        </td>
                        <td className="px-4 py-3" style={{
                          color: "#78350f"
                        }}>
                          {user.bestAccuracy}%
                        </td>
                        <td className="px-4 py-3" style={{
                          color: "#78350f"
                        }}>
                          {user.avgWpm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link to="/game">
                <button 
                  className="px-8 py-3 text-white font-bold rounded-md transition-all duration-300 transform hover:scale-105" 
                  style={{
                    background: "linear-gradient(135deg, #b45309 0%, #9c2c13 100%)",
                    border: "2px solid #c9a063",
                    boxShadow: "0 2px 10px rgba(156, 44, 19, 0.3)",
                    fontFamily: "'Mukta', sans-serif",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    btn.style.background = "linear-gradient(135deg, #9c2c13 0%, #b45309 100%)";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    btn.style.background = "linear-gradient(135deg, #b45309 0%, #9c2c13 100%)";
                  }}
                >
                  <span className="relative z-10">Begin Your Scripture</span>
                  {/* Add decorative elements before and after the text */}
                  <span 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                    style={{
                      backgroundImage: "url('/lotus-icon.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      opacity: 0.7
                    }}
                  ></span>
                  <span 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                    style={{
                      backgroundImage: "url('/lotus-icon.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      opacity: 0.7
                    }}
                  ></span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom element */}
        <div className="h-8 w-full mt-2 mx-auto" style={{
          backgroundImage: "url('/border-pattern.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.7,
          maxWidth: "300px"
        }}></div>
      </div>
      
      <style jsx>{`
        @keyframes borderGlow {
          0% { box-shadow: 0 0 5px rgba(201, 160, 99, 0.3); }
          50% { box-shadow: 0 0 15px rgba(201, 160, 99, 0.7); }
          100% { box-shadow: 0 0 5px rgba(201, 160, 99, 0.3); }
        }
        
        tr:hover {
          animation: borderGlow 1.5s infinite;
          background-color: rgba(253, 230, 138, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;