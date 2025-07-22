import { useState, useCallback, useEffect } from "react";
import {
  useStateTogether,
  useFunctionTogether,
  useMyId,
  useConnectedUsers,
  useIsSynchronized,
  useStateTogetherWithPerUserValues,
} from "react-together";
import { RaceModelUtils, RaceState } from "../models/RaceModel";

export function useMultiplayerRace() {
  const myId = useMyId();
  const connectedUsers = useConnectedUsers();
  const isSynchronized = useIsSynchronized();

  // Debug state
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Synchronized state with proper default
  const [raceState, setRaceState] = useStateTogether<RaceState>(
    "race-state",
    RaceModelUtils.createInitialState()
  );

  // Force reset if state is in invalid initial state
  useEffect(() => {
    if (raceState) {
      // Only reset if racing with no players (invalid state)
      // Don't reset finished states - they should stay finished
      if (
        raceState.status === "racing" &&
        Object.keys(raceState.players).length === 0
      ) {
        console.log(
          "⚠️ Detected invalid initial state (racing with no players), resetting..."
        );
        setRaceState(RaceModelUtils.createInitialState());
      }
    } else {
      console.log(
        "⚠️ No race state available, this might be a synchronization issue"
      );
    }
  }, [raceState, setRaceState]);

  // Per-user hits using useStateTogetherWithPerUserValues
  const [myHits, setMyHits] = useStateTogetherWithPerUserValues<number>(
    "player-hits",
    0
  );
  const [allPlayerHits, setAllPlayerHits] = useStateTogetherWithPerUserValues<
    Record<string, number>
  >("all-player-hits", {});

  // Race timing state
  const [raceStartTime, setRaceStartTime] = useStateTogether<number | null>(
    "race-start-time",
    null
  );
  const [playerCompletionTimes, setPlayerCompletionTimes] =
    useStateTogetherWithPerUserValues<Record<string, number>>(
      "player-completion-times",
      {}
    );

  // Synchronized functions for multiplayer
  const startRaceTogether = useFunctionTogether("start-race", () => {
    setRaceState((prev) => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();

      // More permissive check - allow starting if not already racing or finished
      if (
        currentState.status !== "racing" &&
        currentState.status !== "finished" &&
        Object.keys(currentState.players).length > 0
      ) {
        const newState = RaceModelUtils.startRace(currentState);
        return newState;
      } else {
        return currentState;
      }
    });

    // Reset all player hits when race starts
    setAllPlayerHits({});

    // Record race start time
    setRaceStartTime(Date.now());
  });

  const endRaceTogether = useFunctionTogether("end-race", () => {
    setRaceState((prev) => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();

      // Allow ending if racing or if we have a valid state
      if (
        currentState.status === "racing" ||
        currentState.status === "waiting"
      ) {
        const newState = RaceModelUtils.endRace(currentState);
        return newState;
      }
      return currentState;
    });
  });

  const resetRaceTogether = useFunctionTogether("reset-race", () => {
    setRaceState((prev) => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();
      // Always allow reset
      const newState = RaceModelUtils.resetRace(currentState);

      // Reset all player hits when race resets
      setAllPlayerHits({});

      // Clear timing data
      setRaceStartTime(null);
      setPlayerCompletionTimes({});

      return newState;
    });
  });

  const playerMoveTogether = useFunctionTogether(
    "player-move",
    (playerId: string, success: boolean) => {
      if (success) {
        // Update the specific player's hits
        setAllPlayerHits((prev) => {
          const newHits = {
            ...prev,
            [playerId]: (prev[playerId] || 0) + 1,
          };
          return newHits;
        });

        // Update race state
        setRaceState((prev) => {
          if (prev) {
            const newState = RaceModelUtils.handlePlayerMove(
              prev,
              playerId,
              success
            );
            return newState;
          }
          return prev;
        });
      } else {
      }
    }
  );

  // Handle race actions
  const startRace = useCallback(() => {
    startRaceTogether();
  }, [startRaceTogether]);

  const endRace = useCallback(() => {
    endRaceTogether();
  }, [endRaceTogether]);

  const resetRace = useCallback(() => {
    resetRaceTogether();
  }, [resetRaceTogether]);

  const forceReset = useCallback(() => {
    // Force create a fresh initial state
    const freshState = RaceModelUtils.createInitialState();

    setRaceState(freshState);
    setAllPlayerHits({});
    setRaceStartTime(null);
    setPlayerCompletionTimes({});
  }, [
    setRaceState,
    setAllPlayerHits,
    setRaceStartTime,
    setPlayerCompletionTimes,
  ]);

  const makeMove = useCallback(
    (success: boolean) => {
      if (myId && success) {
        playerMoveTogether(myId, success);
      }
    },
    [myId, playerMoveTogether]
  );



  // Connection monitoring
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSynchronized && connectionAttempts < 3) {
        setConnectionAttempts((prev) => prev + 1);
        setConnectionError(
          `Connection attempt ${
            connectionAttempts + 1
          }/3 failed. Check your internet connection.`
        );
      } else if (!isSynchronized && connectionAttempts >= 3) {
        setConnectionError(
          "Failed to connect after 3 attempts. Please refresh the page or check your internet connection."
        );
      }
    }, 5000); // Wait 5 seconds before showing error

    return () => clearTimeout(timer);
  }, [isSynchronized, connectionAttempts]);

  // Clear error when connected
  useEffect(() => {
    if (isSynchronized) {
      setConnectionError(null);
      setConnectionAttempts(0);
    }
  }, [isSynchronized]);

  // Auto-join players when they connect
  useEffect(() => {
    if (
      myId &&
      connectedUsers &&
      raceState &&
      raceState.players &&
      !raceState.players[myId]
    ) {
      const playerData = {
        id: myId,
        name: `Player ${myId.slice(0, 6)}`,
        logo: "/globe.svg",
        color: "#8B5CF6",
      };

      setRaceState((prev) => {
        const newState = RaceModelUtils.addPlayer(prev, playerData);
        return newState;
      });
    }
  }, [myId, connectedUsers, raceState, setRaceState]);

  // Remove disconnected players
  useEffect(() => {
    if (connectedUsers && raceState && raceState.players) {
      const connectedIds = new Set(connectedUsers.map((user) => user.userId));
      setRaceState((prev) => {
        let updatedState = prev;
        Object.keys(updatedState.players).forEach((playerId) => {
          if (!connectedIds.has(playerId)) {
            updatedState = RaceModelUtils.removePlayer(updatedState, playerId);
          }
        });
        return updatedState;
      });
    }
  }, [connectedUsers, raceState, setRaceState]);

  // Race completion logic for less than 3 players
  useEffect(() => {
    if (raceState && raceState.status === "racing") {
      const players = Object.values(raceState.players);
      const playerCount = players.length;

      // Use allPlayerHits to determine finished players instead of player.finished
      const finishedPlayers = players.filter(
        (p) => (allPlayerHits[p.id] || 0) >= 10
      ).length;

      // If less than 3 players, wait for all to finish or auto-finish after 5 minutes
      if (playerCount < 3) {
        const shouldFinish = finishedPlayers === playerCount && playerCount > 0;

        if (shouldFinish) {
          setRaceState((prev) => ({
            ...prev,
            status: "finished",
          }));
        }
      } else {
        // If 3 or more players, finish when first 3 complete
        const shouldFinish = finishedPlayers >= 3;

        if (shouldFinish) {
          setRaceState((prev) => ({
            ...prev,
            status: "finished",
          }));
        }
      }
    }
  }, [raceState, setRaceState, allPlayerHits]);

  // Track individual player completion times
  useEffect(() => {
    if (raceState && raceState.status === "racing" && raceStartTime) {
      const players = Object.values(raceState.players);

      players.forEach((player) => {
        const playerHits = allPlayerHits[player.id] || 0;
        const hasCompleted = playerHits >= 10;
        const hasCompletionTime = playerCompletionTimes[player.id];

        // Record completion time when player first reaches 10 hits
        if (hasCompleted && !hasCompletionTime) {
          const completionTime = Date.now() - raceStartTime;
          setPlayerCompletionTimes((prev) => ({
            ...prev,
            [player.id]: completionTime,
          }));
        }
      });
    }
  }, [
    raceState,
    allPlayerHits,
    raceStartTime,
    playerCompletionTimes,
    setPlayerCompletionTimes,
  ]);

  // Auto-finish timer for less than 3 players (5 minutes)
  useEffect(() => {
    if (raceState && raceState.status === "racing") {
      const players = Object.values(raceState.players);
      const playerCount = players.length;

      if (playerCount < 3) {
        const timer = setTimeout(() => {
          setRaceState((prev) => ({
            ...prev,
            status: "finished",
          }));
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearTimeout(timer);
      }
    }
  }, [raceState, setRaceState]);

  // Ensure raceState is never undefined
  const safeRaceState = raceState || RaceModelUtils.createInitialState();

  return {
    raceState: safeRaceState,
    myId,
    connectedUsers,
    isSynchronized,
    connectionError,
    connectionAttempts,
    startRace,
    endRace,
    resetRace,
    forceReset,
    playerMove: makeMove,
    getPlayer: (playerId: string) =>
      RaceModelUtils.getPlayer(safeRaceState, playerId),
    getPlayers: () => RaceModelUtils.getPlayers(safeRaceState),
    getFinishOrder: () => safeRaceState.finishOrder,
    getStatus: () => safeRaceState.status,
    isPlayerFinished: (playerId: string) => {
      // Use allPlayerHits to determine if player is finished
      const playerHits = allPlayerHits[playerId] || 0;
      return playerHits >= 10;
    },
    getPlayerPlace: (playerId: string) =>
      RaceModelUtils.getPlayerPlace(safeRaceState, playerId),
    myHits: myHits || 0,
    setMyHits,
    allPlayerHits: allPlayerHits || {},
    raceStartTime: raceStartTime || null,
    playerCompletionTimes: playerCompletionTimes || {},
  };
}
