/**
 * Utility functions for game logic and calculations
 */

/**
 * Calculates move game settings based on player hits
 * @param myHits - Current number of hits for the player
 * @returns Object with speed and targetWidth
 */
export const getMoveGameSettings = (myHits: number) => {
  const speed = 3 + myHits * 0.8;
  const targetWidth = Math.max(24, 80 - myHits * 6);
  return { speed, targetWidth };
};

/**
 * Gets trophy emoji based on player place
 * @param place - Player's place (1, 2, 3, etc.)
 * @returns Trophy emoji string
 */
export const getTrophyEmoji = (place: number): string => {
  switch (place) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
};

/**
 * Converts race status to display status
 * @param status - Race status from game state
 * @returns Display status string
 */
export const getDisplayStatus = (status: string): string => {
  switch (status) {
    case "waiting":
      return "idle";
    case "racing":
      return "racing";
    case "finished":
      return "finished";
    default:
      return "idle";
  }
}; 