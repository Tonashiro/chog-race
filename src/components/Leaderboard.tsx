import React from 'react';
import Button from './ui/Button';
import { LeaderboardData, formatPlayerStats } from '../utils/leaderboard';
import { getTrophyEmoji } from '../utils/gameLogic';
import { formatTimestamp } from '../utils/timing';

interface LeaderboardProps {
  leaderboardData: LeaderboardData;
  raceStartTime: number | null;
  onStartNewRace: () => void;
}

/**
 * Component for displaying race results and leaderboard
 */
const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboardData,
  raceStartTime,
  onStartNewRace
}) => {
  return (
    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🏁 Race Results</h2>
        <p className="text-gray-600">Final standings</p>
        {raceStartTime && (
          <p className="text-sm text-gray-500 mt-1">
            Race started at {formatTimestamp(raceStartTime)}
          </p>
        )}
      </div>
      
      <div className="space-y-3">
        {leaderboardData.players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 ${
              player.isCurrentUser 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 font-bold text-gray-700">
                {player.place}
              </div>
              
              <div className="flex items-center gap-3">
                <img
                  src={player.logo}
                  alt="Player Logo"
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {player.name}
                    {player.isCurrentUser && <span className="ml-2 text-blue-600">(You)</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPlayerStats(player)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {player.place <= leaderboardData.showTrophies && (
                <div className="text-2xl">
                  {getTrophyEmoji(player.place)}
                </div>
              )}
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {player.hits === 10 ? 'Finished' : `${player.hits}/10`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">
          {leaderboardData.totalPlayers < 3 
            ? 'All players receive trophies!' 
            : 'Top 3 players receive trophies!'
          }
        </p>
        <Button
          variant="success"
          size="lg"
          onClick={onStartNewRace}
        >
          🏁 Start New Race
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard; 