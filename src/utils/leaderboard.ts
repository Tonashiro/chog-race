/**
 * Utility functions for leaderboard calculations and data processing
 */

import { formatCompletionTime } from "./timing";
import { GamePlayer } from "../types/shared";

export interface LeaderboardPlayer {
  id: string;
  name: string;
  logo: string;
  hits: number;
  completionTime: number | null;
  isCurrentUser: boolean;
  place: number;
}

export interface LeaderboardData {
  players: LeaderboardPlayer[];
  totalPlayers: number;
  showTrophies: number;
}

/**
 * Creates leaderboard data from game state
 * @param players - Array of players from game state
 * @param allPlayerHits - Record of player hits
 * @param playerCompletionTimes - Record of player completion times
 * @param myId - Current user's ID
 * @returns Processed leaderboard data
 */
export const createLeaderboardData = (
  players: GamePlayer[],
  allPlayerHits: Record<string, number>,
  playerCompletionTimes: Record<string, number>,
  myId: string | null
): LeaderboardData => {
  try {
    const playerCount = players.length;
    
    // Sort players by hits (descending) and then by completion time
    const sortedPlayers = players
      .map(player => ({
        ...player,
        hits: allPlayerHits[player.id] || 0,
        completionTime: playerCompletionTimes[player.id] || null,
        isCurrentUser: player.id === myId
      }))
      .sort((a, b) => {
        // First sort by hits (descending)
        if (b.hits !== a.hits) {
          return b.hits - a.hits;
        }
        // If hits are equal, sort by completion time (earlier is better)
        if (a.completionTime && b.completionTime) {
          return a.completionTime - b.completionTime;
        }
        // If one has completion time and other doesn't, completed one wins
        if (a.completionTime && !b.completionTime) return -1;
        if (!a.completionTime && b.completionTime) return 1;
        // If neither has completion time, maintain order
        return 0;
      })
      .map((player, index) => ({
        ...player,
        place: index + 1
      }));

    return {
      players: sortedPlayers,
      totalPlayers: playerCount,
      showTrophies: playerCount < 3 ? sortedPlayers.length : 3
    };
  } catch (error) {
    console.error("Error creating leaderboard data:", error);
    return { players: [], totalPlayers: 0, showTrophies: 0 };
  }
};

/**
 * Formats player stats for display
 * @param player - Player data
 * @returns Formatted stats string
 */
export const formatPlayerStats = (player: LeaderboardPlayer): string => {
  const stats = `${player.hits}/10 hits`;
  if (player.completionTime) {
    return `${stats} • ${formatCompletionTime(player.completionTime)}`;
  }
  return stats;
}; 