"use client";

import { ReactTogether, useConnectedUsers } from "react-together";
import React from "react";

interface ReactTogetherWrapperProps {
  children: React.ReactNode;
}

export default function ReactTogetherWrapper({
  children,
}: ReactTogetherWrapperProps) {
  const sessionParams = {
    appId: process.env.NEXT_PUBLIC_DEFAULT_APP_ID!,
    apiKey: process.env.NEXT_PUBLIC_MULTISYNQ_API_KEY!,
    name: process.env.NEXT_PUBLIC_DEFAULT_SESSION_NAME!,
    password: process.env.NEXT_PUBLIC_DEFAULT_SESSION_PASSWORD!,
    rememberUsers: true,
  };

  return (
    <ReactTogether sessionParams={sessionParams} rememberUsers={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                  🏇
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Chog Race
                  </h1>
                  <p className="text-xs text-gray-600">
                    Real-time Multiplayer Racing
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ConnectedUsersDisplay />
              </div>
            </div>
          </div>
        </nav>

        <main className="relative z-10">{children}</main>
      </div>
    </ReactTogether>
  );
}

function ConnectedUsersDisplay() {
  const connectedUsers = useConnectedUsers();

  if (!connectedUsers || connectedUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-600">
          {connectedUsers.length} user{connectedUsers.length !== 1 ? "s" : ""}{" "}
          online
        </span>
      </div>
    </div>
  );
}
