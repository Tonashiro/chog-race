/**
 * Represents a participant in the race.
 */
export interface Participant {
  /** Unique identifier for the participant */
  id: string;
  /** Display name of the participant */
  name: string;
  /** Path to the logo image for the participant */
  logo: string;
  /** Participant color theme */
  color?: string;
}

/**
 * Represents the result of a participant in the race.
 */
export interface RaceResult {
  /** The participant */
  participant: Participant;
  /** Average time in milliseconds */
  avgTimeMs: number;
  /** Total time in seconds */
  totalTimeSec: number;
  /** Placement (1 = first, 2 = second, etc.) */
  place: number;
  /** Progress of the horse in the race (0 = start, 1 = finish) */
  progress: number;
  /** Whether this participant has finished the race */
  finished: boolean;
  /** Timestamp when the participant finished */
  finishedAt?: number;
}

/**
 * Enum for the current status of the race.
 */
export type RaceStatus = 'idle' | 'racing' | 'finished'; 