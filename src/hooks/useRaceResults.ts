import { useCallback } from 'react';
import { RaceResult } from '../types';
import { GamePlayer } from '../types/shared';

/**
 * Custom hook for managing race results calculations
 */
export const useRaceResults = (
  getPlayers: () => GamePlayer[],
  allPlayerHits: Record<string, number>
) => {
  /**
   * Convert multiplayer state to race results for display
   */
  const getRaceResults = useCallback((): RaceResult[] => {
    try {
      const players = getPlayers();
      const results = players.map((player, index) => {
        // Use allPlayerHits for progress calculation instead of player.progress
        const playerHits = allPlayerHits[player.id] || 0;
        const progress = Math.min(1, playerHits / 10); // 10 is maxHits
        const finished = playerHits >= 10;
        
        // Throttled logging - only log every 2 seconds
        if (Date.now() % 2000 < 100) {
          console.log('🏇 Player progress calculation:', {
            playerId: player.id,
            playerName: player.name,
            playerHits,
            calculatedProgress: progress,
            finished,
            maxHits: 10
          });
        }
        
        return {
          participant: {
            id: player.id,
            name: player.name,
            logo: player.logo,
          },
          progress,
          place: index + 1,
          avgTimeMs: 0, // Not used in multiplayer mode
          totalTimeSec: 0, // Not used in multiplayer mode
          finished,
          finishedAt: finished ? Date.now() : undefined,
        };
      });

      // Throttled logging - only log every 3 seconds
      if (Date.now() % 3000 < 100) {
        console.log('🏇 Race results for horses:', results.map(r => ({
          id: r.participant.id,
          name: r.participant.name,
          progress: r.progress,
          place: r.place,
          finished: r.finished
        })));
      }

      return results;
    } catch (error) {
      console.error("Error getting race results:", error);
      return [];
    }
  }, [getPlayers, allPlayerHits]);

  return { getRaceResults };
}; 