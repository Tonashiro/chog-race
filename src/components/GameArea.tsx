import React from 'react';
import RaceTrack from './RaceTrack';
import MoveGameBar from './MoveGameBar';
import { getMoveGameSettings } from '../utils/gameLogic';
import { RaceResult, RaceStatus } from '../types';

interface GameAreaProps {
  currentStatus: string;
  myId: string | null;
  allPlayerHits: Record<string, number>;
  getRaceResults: () => RaceResult[];
  onPlayerMove: (success: boolean) => void;
}

/**
 * Component for the main game area including race track and move game bar
 */
const GameArea: React.FC<GameAreaProps> = ({
  currentStatus,
  myId,
  allPlayerHits,
  getRaceResults,
  onPlayerMove
}) => {
  const currentPlayerHits = myId ? allPlayerHits[myId] || 0 : 0;
  const isPlayerFinished = currentPlayerHits >= 10;
  const shouldShowMoveGameBar = currentStatus === "racing" && 
    myId && 
    !isPlayerFinished && 
    (allPlayerHits[myId] || 0) < 10;

  const { speed, targetWidth } = getMoveGameSettings(currentPlayerHits);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-8">
      <div className="flex flex-col items-center gap-6">
        {/* Move Game Bar - Only show for current player during race */}
        {shouldShowMoveGameBar && (
          <div className="w-full max-w-md">
            <MoveGameBar
              key={currentPlayerHits} // Force re-render when hits change
              isActive={true}
              speed={speed}
              targetWidth={targetWidth}
              attempt={(currentPlayerHits) + 1}
              maxAttempts={10}
              onResult={onPlayerMove}
            />
          </div>
        )}

        {/* Completion message */}
        {currentStatus === "racing" && myId && isPlayerFinished && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              🎉 Race Complete! You&apos;ve completed all 10 moves! Waiting for other players to finish...
            </p>
          </div>
        )}

        {/* Race Track */}
        <div className="w-full">
          <RaceTrack
            results={getRaceResults()}
            status={currentStatus as RaceStatus}
            currentUserId={myId || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default GameArea; 