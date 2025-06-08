"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Trophy, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ScoreChange {
  playerId: string;
  oldScore: number;
  newScore: number;
  timestamp: number;
}

export default function RealTimeScoreboard() {
  const { gameState } = useGameContext();
  const [scoreChanges, setScoreChanges] = useState([]);
  const [animatingPlayers, setAnimatingPlayers] = useState(new Set());

  // Track score changes for animations
  useEffect(() => {
    const newScoreChanges: ScoreChange[] = [];
    const newAnimatingPlayers = new Set();

    gameState.players.forEach((player: Player) => {
      // Find if this player's score changed (simplified simulation)
      if (Math.random() < 0.1) { // 10% chance of showing score animation
        newScoreChanges.push({
          playerId: player.id,
          oldScore: Math.max(0, player.score - 10),
          newScore: player.score,
          timestamp: Date.now(),
        });
        newAnimatingPlayers.add(player.id);
      }
    });

    if (newScoreChanges.length > 0) {
      setScoreChanges(newScoreChanges);
      setAnimatingPlayers(newAnimatingPlayers);

      // Clear animations after 2 seconds
      setTimeout(() => {
        setAnimatingPlayers(new Set());
      }, 2000);
    }
  }, [gameState.players]);

  // Sort players by score (descending)
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

  const getPositionChange = (player: Player, currentIndex: number) => {
    // Simulate position changes (in real app, track previous positions)
    const random = Math.random();
    if (random < 0.1) return "up";
    if (random < 0.2) return "down";
    return "same";
  };

  const getScoreChangeDisplay = (playerId: string) => {
    const change = scoreChanges.find((c: ScoreChange) => c.playerId === playerId);
    if (!change) return null;

    const difference = change.newScore - change.oldScore;
    if (difference <= 0) return null;

    return (
      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
        +{difference}
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Live Scoreboard
          <Badge variant="secondary" className="text-xs">
            Round {gameState.roundState.currentRound}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {sortedPlayers.map((player: Player, index: number) => {
          const isLeader = index === 0;
          const isAnimating = animatingPlayers.has(player.id);
          const positionChange = getPositionChange(player, index);

          return (
            <div
              key={player.id}
              className={`relative flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                isLeader
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                  : "bg-white border border-gray-200"
              } ${isAnimating ? "scale-105 shadow-lg" : ""}`}
            >
              {/* Position and change indicator */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isLeader
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Position change indicator */}
                  {positionChange === "up" && (
                    <Star className="absolute -top-1 -right-1 h-3 w-3 text-green-500" />
                  )}
                  {positionChange === "down" && (
                    <Star className="absolute -top-1 -right-1 h-3 w-3 text-red-500 rotate-180" />
                  )}
                </div>

                {/* Player info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${player.avatar}`}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.name}</span>
                      {player.isDoctor && (
                        <Crown className="h-4 w-4 text-yellow-600" />
                      )}
                      {isLeader && (
                        <Badge className="bg-yellow-500 text-yellow-50 text-xs">
                          Leader
                        </Badge>
                      )}
                    </div>
                    {isLeader && (
                      <div className="text-xs text-yellow-700">
                        Leading by{" "}
                        {sortedPlayers[1]
                          ? player.score - sortedPlayers[1].score
                          : player.score}{" "}
                        points
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Score display */}
              <div className="relative">
                <div
                  className={`text-right ${
                    isAnimating ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      isLeader ? "text-yellow-600" : "text-gray-700"
                    }`}
                  >
                    {player.score}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>

                {/* Score change animation */}
                {getScoreChangeDisplay(player.id)}
              </div>

              {/* Leader crown decoration */}
              {isLeader && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
              )}
            </div>
          );
        })}

        {/* Game progress indicator */}
        <div className="pt-3 border-t">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Game Progress</span>
            <span>
              {gameState.roundState.currentRound}/
              {gameState.roundState.totalRounds} rounds
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (gameState.roundState.currentRound /
                    gameState.roundState.totalRounds) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}