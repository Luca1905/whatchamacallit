"use client";

import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

interface PlayerActivity {
  playerId: string;
  playerName: string;
  isTyping: boolean;
  lastActivity: Date;
}

export default function PlayerActivityIndicator() {
  const { gameState, roomCode } = useGameContext();
  const [activities, setActivities] = useState([]);

  // Simulate activity tracking (in real app, this would come from Convex)
  useEffect(() => {
    if (gameState.gamePhase === "answering") {
      // Simulate some players typing
      const activeActivities = gameState.players
        .filter((player: Player) => Math.random() > 0.7) // Randomly show some as typing
        .map((player: Player) => ({
          playerId: player.id,
          playerName: player.name,
          isTyping: true,
          lastActivity: new Date(),
        }));
      
      setActivities(activeActivities);
    } else {
      setActivities([]);
    }
  }, [gameState.gamePhase, gameState.players]);

  if (!roomCode || activities.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Player Activity</span>
        </div>
        
        <div className="space-y-1">
          {activities.map((activity: PlayerActivity) => (
            <div key={activity.playerId} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-600">
                  {activity.playerName}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                typing...
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}