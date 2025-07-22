/**
 * Utility functions for timing and time formatting
 */

/**
 * Formats completion time in a readable format
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string (e.g., "2m 15s" or "45s")
 */
export const formatCompletionTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Formats a timestamp as a readable time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Calculates the duration between two timestamps
 * @param startTime - Start timestamp in milliseconds
 * @param endTime - End timestamp in milliseconds
 * @returns Duration in milliseconds
 */
export const calculateDuration = (startTime: number, endTime: number): number => {
  return endTime - startTime;
}; 