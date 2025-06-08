"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { 
  Crown, 
  Send, 
  Star, 
  Trophy, 
  Users
} from "lucide-react";
import { useState, useEffect } from "react";

interface PlayerActivityStatus {
  isActive: boolean;
  lastSeen: Date;
  hasSubmittedThisRound: boolean;
}

export default function MultiplayerPlayerList() {
  const { gameState, roomCode, isReady } = useGameContext();
  const [playerActivity, setPlayerActivity] = useState({});

  // Simulate player activity tracking (in real app, this would come from Convex)
  useEffect(() => {
    if (!isReady) return;

    const updateActivity = () => {
      const newActivity: Record<string, PlayerActivityStatus> = {};
      
      gameState.players.forEach((player: Player) => {
        const hasSubmitted = gameState.roundState.answers.some(
          (answer: any) => answer.playerId === player.id
        );
        
        newActivity[player.id] = {
          isActive: true, // In real app, this would be based on last activity
          lastSeen: new Date(),
          hasSubmittedThisRound: hasSubmitted
        };
      });
      
      setPlayerActivity(newActivity);
    };

    updateActivity();
    const interval = setInterval(updateActivity, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [gameState.players, gameState.roundState.answers, isReady]);

  if (!isReady || !roomCode) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <span className="ml-2 text-gray-600">Loading players...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort players by score (descending) for leaderboard view
  const sortedPlayers = [...gameState.players].sort((a: Player, b: Player) => b.score - a.score);

  const totalPlayers = gameState.players.length;
  const answersSubmitted = gameState.roundState.answers.length;
  const activePlayers = Object.values(playerActivity).filter((activity: any) => activity.isActive).length;

  const getPlayerStatusColor = (player: Player) => {
    const activity = playerActivity[player.id];
    if (!activity) return "bg-gray-100";
    
    if (gameState.gamePhase === "answering") {
      return activity.hasSubmittedThisRound ? "bg-green-100" : "bg-orange-100";
    }
    
    return activity.isActive ? "bg-green-100" : "bg-gray-100";
  };

  const getPlayerStatusIcon = (player: Player) => {
    const activity = playerActivity[player.id];
    if (!activity) return Star;
    
    if (gameState.gamePhase === "answering") {
      return activity.hasSubmittedThisRound ? Star : Send;
    }
    
    return activity.isActive ? Star : Send;
  };

  const getPlayerStatusText = (player: Player) => {
    const activity = playerActivity[player.id];
    if (!activity) return "Offline";
    
    if (gameState.gamePhase === "answering") {
      return activity.hasSubmittedThisRound ? "Submitted" : "Writing...";
    }
    
    return activity.isActive ? "Online" : "Away";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Players ({totalPlayers})
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600">{activePlayers} online</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Game phase specific summary */}
        {gameState.gamePhase === "answering" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Answer Progress</span>
              <span className="text-sm text-blue-600">
                {answersSubmitted} / {totalPlayers} submitted
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answersSubmitted / totalPlayers) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Player list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedPlayers.map((player: Player, index: number) => {
            const StatusIcon = getPlayerStatusIcon(player);
            const statusColor = getPlayerStatusColor(player);
            const statusText = getPlayerStatusText(player);
            
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
                  index === 0 && player.score > 0
                    ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50"
                    : player.isDoctor
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Player info */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 && player.score > 0
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${player.avatar}`}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name and details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{player.name}</span>
                      {player.isDoctor && (
                        <Crown className="h-4 w-4 text-purple-600" />
                      )}
                      {index === 0 && player.score > 0 && (
                        <Trophy className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{player.score} points</span>
                      {gameState.gamePhase !== "waiting" && (
                        <>
                          <span>•</span>
                          <span>{statusText}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and actions */}
                <div className="flex items-center gap-2">
                  {/* Activity status */}
                  <div className={`p-1 rounded-full ${statusColor}`}>
                    <StatusIcon className="h-3 w-3" />
                  </div>

                  {/* Score badge */}
                  <Badge 
                    variant={index === 0 && player.score > 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {player.score}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {gameState.players.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">No players in the room</p>
            <p className="text-gray-400 text-sm">Share room code: {roomCode}</p>
          </div>
        )}

        {/* Room summary */}
        {gameState.players.length > 0 && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-900">{totalPlayers}</div>
                <div className="text-gray-500">Players</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {gameState.players.reduce((sum: number, p: Player) => sum + p.score, 0)}
                </div>
                <div className="text-gray-500">Total Points</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{activePlayers}</div>
                <div className="text-gray-500">Online</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}