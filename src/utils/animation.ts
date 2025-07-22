/**
 * Calculates the left position (in %) for a horse based on its progress.
 * @param progress A number between 0 (start) and 1 (finish)
 * @returns CSS left value as a string (e.g., '50%')
 */
export function getHorseLeftPosition(progress: number): string {
  const min = 2; // start closer to the left edge
  const max = 90; // stop at the very end of the track
  const clamped = Math.max(0, Math.min(1, progress));
  return `${min + (max - min) * clamped}%`;
} 