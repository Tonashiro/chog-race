/**
 * Shared types used across multiple components and utilities
 */

/**
 * Basic player interface used in multiple places
 */
export interface GamePlayer {
  id: string;
  name: string;
  logo: string;
}

/**
 * Connected user interface
 */
export interface ConnectedUser {
  userId: string;
} 