import React from "react";

interface ConnectionStatusProps {
  isSynchronized: boolean;
  connectionError: string | null;
  connectionAttempts: number;
  onRefresh: () => void;
}

/**
 * Component for displaying connection status and handling connection errors
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isSynchronized,
  connectionError,
  onRefresh,
}) => {
  if (!isSynchronized && !connectionError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connecting to multiplayer...
          </h2>
          <p className="text-gray-600">
            Please wait while we establish the connection.
          </p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Connection Error
          </h3>
          <p className="text-red-700 mb-4">{connectionError}</p>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;
