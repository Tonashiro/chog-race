import React from 'react';
import { GamePlayer } from '../types/shared';

interface GameStatsProps {
  currentStatus: string;
  finishOrder: string[];
  players: GamePlayer[];
  allPlayerHits: Record<string, number>;
  myId: string | null;
}

/**
 * Component for displaying game statistics
 */
const GameStats: React.FC<GameStatsProps> = ({
  currentStatus,
  finishOrder,
  players,
  allPlayerHits,
  myId
}) => {
  if (currentStatus === "idle") {
    return null;
  }

  const currentPlayerHits = myId ? allPlayerHits[myId] || 0 : 0;
  const isPlayerFinished = currentPlayerHits >= 10;

  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {finishOrder.length}
          </div>
          <div className="text-sm text-gray-600">Finished</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {players.length}
          </div>
          <div className="text-sm text-gray-600">Total Players</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {currentPlayerHits}
          </div>
          <div className="text-sm text-gray-600">Your Hits</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {isPlayerFinished ? '✅' : '🏃'}
          </div>
          <div className="text-sm text-gray-600">Your Status</div>
        </div>
      </div>
      
      {/* Player Progress */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Player Progress</h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  {player.id.slice(0, 8)}
                </span>
                {player.id === myId && (
                  <span className="text-blue-600 font-medium">(You)</span>
                )}
                {allPlayerHits[player.id] !== undefined && (
                  <span className="text-green-600 font-medium">
                    ({allPlayerHits[player.id]}/10)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStats; 