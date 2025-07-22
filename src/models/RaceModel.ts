export interface Player {
  id: string;
  name: string;
  logo: string;
  color?: string;
  progress: number;
  finished: boolean;
  finishedAt?: number;
  place: number;
  hits: number;
}

export interface RaceState {
  status: "waiting" | "racing" | "finished";
  players: Record<string, Player>;
  finishOrder: string[];
  startTime?: number;
  maxHits: number;
}

/**
 * Race state utilities for use with react-together hooks
 */
export class RaceModelUtils {
  /**
   * Create initial race state
   */
  static createInitialState(): RaceState {
    const state: RaceState = {
      status: "waiting",
      players: {},
      finishOrder: [],
      maxHits: 10,
    };
    return state;
  }

  /**
   * Add a player to the race
   */
  static addPlayer(
    state: RaceState | undefined,
    playerData: { id: string; name: string; logo: string; color?: string }
  ): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      state = this.createInitialState();
    }

    const player: Player = {
      id: playerData.id,
      name: playerData.name,
      logo: playerData.logo,
      color: playerData.color,
      progress: 0,
      finished: false,
      place: 0,
      hits: 0,
    };

    return {
      ...state,
      players: {
        ...state.players,
        [player.id]: player,
      },
    };
  }

  /**
   * Remove a player from the race
   */
  static removePlayer(
    state: RaceState | undefined,
    playerId: string
  ): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      return this.createInitialState();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [playerId]: removed, ...remainingPlayers } = state.players;
    return {
      ...state,
      players: remainingPlayers,
    };
  }

  /**
   * Handle player move
   */
  static handlePlayerMove(
    state: RaceState | undefined,
    playerId: string,
    success: boolean
  ): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      return this.createInitialState();
    }

    const player = state.players[playerId];
    if (!player || state.status !== "racing" || player.finished) {
      return state;
    }

    if (success) {
      const newHits = player.hits + 1;
      const newProgress = Math.min(1, newHits / state.maxHits);
      const isFinished = newHits >= state.maxHits;

      const updatedPlayer = {
        ...player,
        hits: newHits,
        progress: newProgress,
        finished: isFinished,
        finishedAt: isFinished ? Date.now() : undefined,
        place: isFinished ? state.finishOrder.length + 1 : 0,
      };

      const newFinishOrder = isFinished
        ? [...state.finishOrder, playerId]
        : state.finishOrder;

      const allFinished = Object.values(state.players).every((p) =>
        p.id === playerId ? updatedPlayer.finished : p.finished
      );

      const newState: RaceState = {
        ...state,
        players: {
          ...state.players,
          [playerId]: updatedPlayer,
        },
        finishOrder: newFinishOrder,
        status: allFinished ? "finished" : state.status,
      };

      return newState;
    }

    return state;
  }

  /**
   * Start the race
   */
  static startRace(state: RaceState | undefined): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      return this.createInitialState();
    }

    if (state.status === "waiting" && Object.keys(state.players).length > 0) {
      return {
        ...state,
        status: "racing",
        startTime: Date.now(),
        finishOrder: [],
        players: Object.fromEntries(
          Object.entries(state.players).map(([id, player]) => [
            id,
            { ...player, progress: 0, finished: false, hits: 0, place: 0 },
          ])
        ),
      };
    }
    return state;
  }

  /**
   * End the race
   */
  static endRace(state: RaceState | undefined): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      return this.createInitialState();
    }

    return {
      ...state,
      status: "finished",
    };
  }

  /**
   * Reset the race
   */
  static resetRace(state: RaceState | undefined): RaceState {
    // If state is undefined, create a new one
    if (!state) {
      return this.createInitialState();
    }

    return {
      ...state,
      status: "waiting",
      finishOrder: [],
      startTime: undefined,
      players: Object.fromEntries(
        Object.entries(state.players).map(([id, player]) => [
          id,
          { ...player, progress: 0, finished: false, hits: 0, place: 0 },
        ])
      ),
    };
  }

  /**
   * Get player by ID
   */
  static getPlayer(
    state: RaceState | undefined,
    playerId: string
  ): Player | undefined {
    if (!state || !state.players) {
      return undefined;
    }
    return state.players[playerId];
  }

  /**
   * Get all players
   */
  static getPlayers(state: RaceState | undefined): Player[] {
    if (!state || !state.players) {
      return [];
    }
    return Object.values(state.players);
  }

  /**
   * Check if player is finished
   */
  static isPlayerFinished(
    state: RaceState | undefined,
    playerId: string
  ): boolean {
    if (!state || !state.players) {
      return false;
    }
    return state.players[playerId]?.finished || false;
  }

  /**
   * Get player place
   */
  static getPlayerPlace(
    state: RaceState | undefined,
    playerId: string
  ): number {
    if (!state || !state.players) {
      return 0;
    }
    return state.players[playerId]?.place || 0;
  }
}
