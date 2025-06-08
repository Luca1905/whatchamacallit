"use client";

import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/context/game-context";
import { Users } from "lucide-react";

export default function ConnectionStatus() {
  const { gameState, isReady, roomCode } = useGameContext();

  if (!roomCode) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-3">
          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              isReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <Badge variant={isReady ? "default" : "destructive"} className="text-xs">
              {isReady ? "Live" : "Connecting..."}
            </Badge>
          </div>

          {/* Players online */}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">
              {gameState.players.length}
            </span>
          </div>

          {/* Room code */}
          <Badge variant="outline" className="text-xs font-mono">
            {roomCode}
          </Badge>
        </div>
      </div>
    </div>
  );
}