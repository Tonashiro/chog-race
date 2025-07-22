import React from 'react';
import Button from './ui/Button';
import { ConnectedUser } from '../types/shared';

interface GameControlsProps {
  currentStatus: string;
  isSynchronized: boolean;
  connectedUsers: ConnectedUser[] | null;
  onStartRace: () => void;
  onEndRace: () => void;
  onResetRace: () => void;
  onForceReset: () => void;
  onTestSync?: () => void;
}

/**
 * Component for game control buttons
 */
const GameControls: React.FC<GameControlsProps> = ({
  currentStatus,
  isSynchronized,
  connectedUsers,
  onStartRace,
  onEndRace,
  onResetRace,
  onForceReset,
  onTestSync
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-4 justify-center">
        {currentStatus === "idle" && (
          <>
            <Button
              variant="success"
              size="lg"
              onClick={onStartRace}
              disabled={
                !isSynchronized ||
                !connectedUsers ||
                connectedUsers.length === 0
              }
            >
              Start Race
            </Button>
            <div className="text-sm text-gray-600">
              Debug: {isSynchronized ? "✅ Synced" : "❌ Not synced"} | Users:{" "}
              {connectedUsers?.length || 0} | Status: {currentStatus}
            </div>
          </>
        )}

        {currentStatus === "finished" && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Race completed! View results below.
            </p>
          </div>
        )}

        {currentStatus === "racing" && (
          <>
            <Button
              variant="danger"
              size="lg"
              onClick={onEndRace}
            >
              End Race
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onResetRace}
            >
              Reset Race
            </Button>
          </>
        )}

        {/* Force Reset button for debugging */}
        {currentStatus === "finished" && (
          <Button
            variant="warning"
            size="sm"
            onClick={onForceReset}
          >
            🔧 Force Reset
          </Button>
        )}

        {/* Test Sync button for debugging */}
        {onTestSync && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onTestSync}
          >
            🧪 Test Sync
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameControls; 