"use client";

import React from "react";
import { useMultiplayerRace } from "../hooks/useMultiplayerRace";
import { useDebouncedClick } from "../hooks/useDebouncedClick";
import { useRaceResults } from "../hooks/useRaceResults";
import { createLeaderboardData } from "../utils/leaderboard";
import { getDisplayStatus } from "../utils/gameLogic";
import ConnectionStatus from "../components/ConnectionStatus";
import GameControls from "../components/GameControls";
import GameArea from "../components/GameArea";
import GameStats from "../components/GameStats";
import Leaderboard from "../components/Leaderboard";

/**
 * Main page for the Chog Race game.
 */
const RacePage: React.FC = () => {
  return <MultiplayerRaceGame />;
};

/**
 * Multiplayer race game component.
 */
const MultiplayerRaceGame: React.FC = () => {
  const {
    myId,
    connectedUsers,
    isSynchronized,
    connectionError,
    connectionAttempts,
    startRace,
    endRace,
    resetRace,
    forceReset,
    playerMove,
    getPlayers,
    getFinishOrder,
    getStatus,
    allPlayerHits,
    raceStartTime,
    playerCompletionTimes,
    testSync,
  } = useMultiplayerRace();

  const { debouncedClick } = useDebouncedClick();
  const { getRaceResults } = useRaceResults(getPlayers, allPlayerHits);

  // Get current status as display status
  const currentStatus = getDisplayStatus(getStatus());

  // Handle page refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle player move
  const handlePlayerMove = (success: boolean) => {
    if (myId && currentStatus === "racing") {
      playerMove(success);
    }
  };

  // Create leaderboard data
  const leaderboardData = createLeaderboardData(
    getPlayers(),
    allPlayerHits,
    playerCompletionTimes,
    myId
  );

  // Show connection status if not synchronized
  if (!isSynchronized || connectionError) {
    return (
      <ConnectionStatus
        isSynchronized={isSynchronized}
        connectionError={connectionError}
        connectionAttempts={connectionAttempts}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Game Controls */}
      <GameControls
        currentStatus={currentStatus}
        isSynchronized={isSynchronized}
        connectedUsers={connectedUsers}
        onStartRace={() => debouncedClick(startRace, "Start Race")}
        onEndRace={() => debouncedClick(endRace, "End Race")}
        onResetRace={() => debouncedClick(resetRace, "Reset Race")}
        onForceReset={() => debouncedClick(forceReset, "Force Reset")}
        onTestSync={() => debouncedClick(testSync, "Test Sync")}
      />

      {/* Game Area */}
      <GameArea
        currentStatus={currentStatus}
        myId={myId}
        allPlayerHits={allPlayerHits}
        getRaceResults={getRaceResults}
        onPlayerMove={handlePlayerMove}
      />

      {/* Game Stats */}
      <GameStats
        currentStatus={currentStatus}
        finishOrder={getFinishOrder()}
        players={getPlayers()}
        allPlayerHits={allPlayerHits}
        myId={myId}
      />

      {/* Leaderboard - Show when race is finished */}
      {currentStatus === "finished" && (
        <Leaderboard
          leaderboardData={leaderboardData}
          raceStartTime={raceStartTime}
          onStartNewRace={() => debouncedClick(resetRace, "New Race")}
        />
      )}
    </div>
  );
};

export default RacePage;
