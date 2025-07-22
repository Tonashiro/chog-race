import { useState, useCallback, useEffect } from 'react';
import { 
  useStateTogether, 
  useFunctionTogether, 
  useMyId, 
  useConnectedUsers,
  useIsSynchronized,
  useStateTogetherWithPerUserValues
} from 'react-together';
import { RaceModelUtils, RaceState } from '../models/RaceModel';

export function useMultiplayerRace() {
  const myId = useMyId();
  const connectedUsers = useConnectedUsers();
  const isSynchronized = useIsSynchronized();

  // Debug state
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Synchronized state with proper default
  const [raceState, setRaceState] = useStateTogether<RaceState>('race-state', RaceModelUtils.createInitialState());

  // Debug initial state
  useEffect(() => {
    // Throttled logging - only log once on mount
    const logOnce = () => {
      console.log('🎯 Initial race state:', raceState);
      console.log('🎯 Expected initial state:', RaceModelUtils.createInitialState());
    };
    logOnce();
  }, [raceState]);

  // Debug state changes
  useEffect(() => {
    // Throttled logging - only log every 2 seconds
    if (Date.now() % 2000 < 100) {
      console.log('🔄 Race state changed:', raceState);
    }
  }, [raceState]);

  // Force reset if state is in invalid initial state
  useEffect(() => {
    if (raceState) {
      console.log('🔍 Checking race state validity:', {
        status: raceState.status,
        playerCount: Object.keys(raceState.players).length,
        isFinished: raceState.status === 'finished',
        hasNoPlayers: Object.keys(raceState.players).length === 0
      });
      
      // Only reset if racing with no players (invalid state)
      // Don't reset finished states - they should stay finished
      if (raceState.status === 'racing' && Object.keys(raceState.players).length === 0) {
        console.log('⚠️ Detected invalid initial state (racing with no players), resetting...');
        setRaceState(RaceModelUtils.createInitialState());
      }
    } else {
      console.log('⚠️ No race state available, this might be a synchronization issue');
    }
  }, [raceState, setRaceState]);

  // Per-user hits using useStateTogetherWithPerUserValues
  const [myHits, setMyHits] = useStateTogetherWithPerUserValues<number>('player-hits', 0);
  const [allPlayerHits, setAllPlayerHits] = useStateTogetherWithPerUserValues<Record<string, number>>('all-player-hits', {});
  
  // Race timing state
  const [raceStartTime, setRaceStartTime] = useStateTogether<number | null>('race-start-time', null);
  const [playerCompletionTimes, setPlayerCompletionTimes] = useStateTogetherWithPerUserValues<Record<string, number>>('player-completion-times', {});

  // Synchronized functions for multiplayer
  const startRaceTogether = useFunctionTogether('start-race', () => {
    console.log('🚀 startRaceTogether called');
    
    setRaceState(prev => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();
      
      console.log('🔄 startRaceTogether state check:', { 
        currentState, 
        status: currentState.status, 
        playerCount: Object.keys(currentState.players).length 
      });
      
      // More permissive check - allow starting if not already racing or finished
      if (currentState.status !== 'racing' && currentState.status !== 'finished' && Object.keys(currentState.players).length > 0) {
        console.log('✅ Starting race...');
        const newState = RaceModelUtils.startRace(currentState);
        console.log('🔄 Race state updated:', newState);
        return newState;
      } else {
        console.log('❌ Cannot start race:', { 
          status: currentState.status, 
          playerCount: Object.keys(currentState.players).length 
        });
        return currentState;
      }
    });
    
    // Reset all player hits when race starts
    setAllPlayerHits({});
    
    // Record race start time
    setRaceStartTime(Date.now());
    console.log('⏱️ Race start time recorded:', Date.now());
  });

  const endRaceTogether = useFunctionTogether('end-race', () => {
    console.log('🛑 endRaceTogether called');
    setRaceState(prev => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();
      
      console.log('🔄 endRaceTogether state check:', { currentState, status: currentState.status });
      
      // Allow ending if racing or if we have a valid state
      if (currentState.status === 'racing' || currentState.status === 'waiting') {
        console.log('✅ Ending race...');
        const newState = RaceModelUtils.endRace(currentState);
        console.log('🔄 Race ended, new state:', newState);
        return newState;
      }
      console.log('❌ Cannot end race - not in valid state');
      return currentState;
    });
  });

  const resetRaceTogether = useFunctionTogether('reset-race', () => {
    console.log('🔄 resetRaceTogether called');
    setRaceState(prev => {
      // Ensure we always have a valid state
      const currentState = prev || RaceModelUtils.createInitialState();
      
      console.log('🔄 resetRaceTogether state check:', { currentState, status: currentState.status });
      
      // Always allow reset
      console.log('✅ Resetting race...');
      const newState = RaceModelUtils.resetRace(currentState);
      console.log('🔄 Race reset, new state:', newState);
      
      // Reset all player hits when race resets
      setAllPlayerHits({});
      
      // Clear timing data
      setRaceStartTime(null);
      setPlayerCompletionTimes({});
      console.log('⏱️ Race timing data cleared');
      
      return newState;
    });
  });

  const playerMoveTogether = useFunctionTogether('player-move', (playerId: string, success: boolean) => {
    // Throttled logging - only log every 1 second
    if (Date.now() % 1000 < 100) {
      console.log('🎯 playerMoveTogether called:', { playerId, success });
    }
    
    if (success) {
      console.log('✅ Processing successful move for player:', playerId);
      
      // Update the specific player's hits
      setAllPlayerHits(prev => {
        const newHits = {
          ...prev,
          [playerId]: (prev[playerId] || 0) + 1
        };
        // Throttled logging - only log every 2 seconds
        if (Date.now() % 2000 < 100) {
          console.log('📊 Updated player hits:', newHits);
        }
        return newHits;
      });
      
      // Update race state
      setRaceState(prev => {
        if (prev) {
          // Throttled logging - only log every 2 seconds
          if (Date.now() % 2000 < 100) {
            console.log('🔄 Updating race state for player move:', { playerId, success });
          }
          const newState = RaceModelUtils.handlePlayerMove(prev, playerId, success);
          // Throttled logging - only log every 2 seconds
          if (Date.now() % 2000 < 100) {
            console.log('🔄 New race state after move:', newState);
          }
          return newState;
        }
        // Throttled logging - only log every 2 seconds
        if (Date.now() % 2000 < 100) {
          console.log('❌ No race state to update');
        }
        return prev;
      });
    } else {
      // Throttled logging - only log every 2 seconds
      if (Date.now() % 2000 < 100) {
        console.log('❌ Move failed for player:', playerId);
      }
    }
  });

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
    console.log('🔄 Force reset called');
    
    // Force create a fresh initial state
    const freshState = RaceModelUtils.createInitialState();
    console.log('🔄 Creating fresh initial state:', freshState);
    
    setRaceState(freshState);
    setAllPlayerHits({});
    setRaceStartTime(null);
    setPlayerCompletionTimes({});
    
    console.log('✅ Force reset completed');
  }, [setRaceState, setAllPlayerHits, setRaceStartTime, setPlayerCompletionTimes]);

  const makeMove = useCallback((success: boolean) => {
    if (myId && success) {
      console.log('🎯 makeMove called:', { myId, success });
      playerMoveTogether(myId, success);
    }
  }, [myId, playerMoveTogether]);

  // Test function to verify synchronization
  const testSync = useCallback(() => {
    console.log('🧪 Testing synchronization...');
    setRaceState(prev => {
      const testState = prev || RaceModelUtils.createInitialState();
      console.log('🧪 Test state update:', testState);
      return testState;
    });
  }, [setRaceState]);

  // Connection monitoring
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSynchronized && connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        setConnectionError(`Connection attempt ${connectionAttempts + 1}/3 failed. Check your internet connection.`);
      } else if (!isSynchronized && connectionAttempts >= 3) {
        setConnectionError('Failed to connect after 3 attempts. Please refresh the page or check your internet connection.');
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
    // Throttled logging - only log every 3 seconds
    if (Date.now() % 3000 < 100) {
      console.log('👥 Auto-join effect:', { myId, connectedUsers, raceState });
    }
    
    if (myId && connectedUsers && raceState && raceState.players && !raceState.players[myId]) {
      console.log('➕ Adding player:', myId);
      const playerData = {
        id: myId,
        name: `Player ${myId.slice(0, 6)}`,
        logo: '/globe.svg',
        color: '#8B5CF6',
      };

      setRaceState(prev => {
        const newState = RaceModelUtils.addPlayer(prev, playerData);
        console.log('✅ Player added, new state:', newState);
        return newState;
      });
    }
  }, [myId, connectedUsers, raceState, setRaceState]);

  // Remove disconnected players
  useEffect(() => {
    if (connectedUsers && raceState && raceState.players) {
      const connectedIds = new Set(connectedUsers.map(user => user.userId));
      setRaceState(prev => {
        let updatedState = prev;
        Object.keys(updatedState.players).forEach(playerId => {
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
    if (raceState && raceState.status === 'racing') {
      const players = Object.values(raceState.players);
      const playerCount = players.length;
      
      // Use allPlayerHits to determine finished players instead of player.finished
      const finishedPlayers = players.filter(p => (allPlayerHits[p.id] || 0) >= 10).length;
      
      console.log('🏁 Race completion check:', {
        playerCount,
        finishedPlayers,
        allPlayerHits,
        status: raceState.status
      });
      
      // If less than 3 players, wait for all to finish or auto-finish after 5 minutes
      if (playerCount < 3) {
        const shouldFinish = finishedPlayers === playerCount && playerCount > 0;
        
        if (shouldFinish) {
          console.log('🏁 All players finished (less than 3), ending race');
          setRaceState(prev => ({
            ...prev,
            status: 'finished'
          }));
        }
      } else {
        // If 3 or more players, finish when first 3 complete
        const shouldFinish = finishedPlayers >= 3;
        
        if (shouldFinish) {
          console.log('🏁 First 3 players finished, ending race');
          setRaceState(prev => ({
            ...prev,
            status: 'finished'
          }));
        }
      }
    }
  }, [raceState, setRaceState, allPlayerHits]);

  // Track individual player completion times
  useEffect(() => {
    if (raceState && raceState.status === 'racing' && raceStartTime) {
      const players = Object.values(raceState.players);
      
      players.forEach(player => {
        const playerHits = allPlayerHits[player.id] || 0;
        const hasCompleted = playerHits >= 10;
        const hasCompletionTime = playerCompletionTimes[player.id];
        
        // Record completion time when player first reaches 10 hits
        if (hasCompleted && !hasCompletionTime) {
          const completionTime = Date.now() - raceStartTime;
          setPlayerCompletionTimes(prev => ({
            ...prev,
            [player.id]: completionTime
          }));
          console.log(`⏱️ Player ${player.id} completed race in ${completionTime}ms`);
        }
      });
    }
  }, [raceState, allPlayerHits, raceStartTime, playerCompletionTimes, setPlayerCompletionTimes]);

  // Auto-finish timer for less than 3 players (5 minutes)
  useEffect(() => {
    if (raceState && raceState.status === 'racing') {
      const players = Object.values(raceState.players);
      const playerCount = players.length;
      
      if (playerCount < 3) {
        const timer = setTimeout(() => {
          console.log('⏰ 5 minutes elapsed, auto-finishing race');
          setRaceState(prev => ({
            ...prev,
            status: 'finished'
          }));
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearTimeout(timer);
      }
    }
  }, [raceState, setRaceState]);

  // Ensure raceState is never undefined
  const safeRaceState = raceState || RaceModelUtils.createInitialState();

  // Debug state synchronization
  useEffect(() => {
    console.log('🔄 State synchronization check:', {
      hasRaceState: !!raceState,
      safeRaceStateStatus: safeRaceState.status,
      isSynchronized,
      myId,
      connectedUsersCount: connectedUsers?.length
    });
  }, [raceState, safeRaceState.status, isSynchronized, myId, connectedUsers]);

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
    getPlayer: (playerId: string) => RaceModelUtils.getPlayer(safeRaceState, playerId),
    getPlayers: () => RaceModelUtils.getPlayers(safeRaceState),
    getFinishOrder: () => safeRaceState.finishOrder,
    getStatus: () => safeRaceState.status,
    isPlayerFinished: (playerId: string) => {
      // Use allPlayerHits to determine if player is finished
      const playerHits = allPlayerHits[playerId] || 0;
      return playerHits >= 10;
    },
    getPlayerPlace: (playerId: string) => RaceModelUtils.getPlayerPlace(safeRaceState, playerId),
    myHits: myHits || 0,
    setMyHits,
    allPlayerHits: allPlayerHits || {},
    raceStartTime: raceStartTime || null,
    playerCompletionTimes: playerCompletionTimes || {},
    testSync,
  };
} 