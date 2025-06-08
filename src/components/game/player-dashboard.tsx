"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Send, Star, Trophy, Users } from "lucide-react";

export default function PlayerDashboard() {
  const { gameState, roomCode } = useGameContext();

  if (!roomCode) return null;

  const totalPlayers = gameState.players.length;
  const answersSubmitted = gameState.roundState.answers.length;
  const submissionProgress = totalPlayers > 0 ? (answersSubmitted / totalPlayers) * 100 : 0;

  // Calculate player statistics
  const playerStats = gameState.players.map((player: Player) => {
    const playerAnswers = gameState.roundState.answers.filter((answer: any) => answer.playerId === player.id);
    const hasSubmittedThisRound = playerAnswers.length > 0;
    
    return {
      ...player,
      hasSubmittedThisRound,
      answersSubmitted: playerAnswers.length,
      rank: gameState.players.filter((p: Player) => p.score > player.score).length + 1,
    };
  });

  // Sort players by rank
  const sortedPlayers = playerStats.sort((a: any, b: any) => a.rank - b.rank);

  const currentLeader = sortedPlayers[0];
  const doctorPlayer = gameState.players.find((p: Player) => p.isDoctor);

  return (
    <div className="space-y-4">
      {/* Game Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Game Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current phase */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Phase:</span>
            <Badge variant="outline" className="capitalize">
              {gameState.gamePhase}
            </Badge>
          </div>

          {/* Round progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Round Progress:</span>
              <span className="font-medium">
                {gameState.roundState.currentRound}/{gameState.roundState.totalRounds}
              </span>
            </div>
            <Progress 
              value={(gameState.roundState.currentRound / gameState.roundState.totalRounds) * 100} 
              className="h-2" 
            />
          </div>

          {/* Submission progress (only during answering) */}
          {gameState.gamePhase === "answering" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Answers Submitted:</span>
                <span className="font-medium">
                  {answersSubmitted}/{totalPlayers}
                </span>
              </div>
              <Progress value={submissionProgress} className="h-2" />
            </div>
          )}

          {/* Current leader */}
          {currentLeader && currentLeader.score > 0 && (
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Current Leader:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-800">{currentLeader.name}</span>
                <Badge className="bg-yellow-500 text-white text-xs">
                  {currentLeader.score} pts
                </Badge>
              </div>
            </div>
          )}

          {/* Doctor indicator */}
          {doctorPlayer && (
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Dr. Whatchamacallit:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-purple-800">{doctorPlayer.name}</span>
                <Badge variant="secondary" className="text-xs">
                  Round {gameState.roundState.currentRound}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player List with Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Players ({totalPlayers})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedPlayers.map((player: any, index: number) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                player.rank === 1 && player.score > 0
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300"
                  : player.isDoctor
                  ? "bg-purple-50 border-purple-200"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Player info */}
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    player.rank === 1 && player.score > 0
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {player.rank}
                </div>

                {/* Avatar */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${player.avatar}`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>

                {/* Name and status */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{player.name}</span>
                    {player.isDoctor && (
                      <Crown className="h-4 w-4 text-purple-600" />
                    )}
                    {player.rank === 1 && player.score > 0 && (
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {player.score} points
                    {gameState.gamePhase === "answering" && (
                      <span className="ml-2">
                        • {player.hasSubmittedThisRound ? "Submitted" : "Writing..."}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2">
                {/* Submission status */}
                {gameState.gamePhase === "answering" && (
                  <div className={`h-3 w-3 rounded-full ${
                    player.hasSubmittedThisRound ? "bg-green-500" : "bg-orange-400 animate-pulse"
                  }`} />
                )}

                {/* Connection status */}
                <div className="h-2 w-2 bg-green-500 rounded-full" title="Online" />

                {/* Score badge */}
                <Badge 
                  variant={player.rank === 1 && player.score > 0 ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {player.score}
                </Badge>
              </div>
            </div>
          ))}

          {/* Phase-specific information */}
          <div className="pt-3 border-t">
            {gameState.gamePhase === "waiting" && (
              <div className="text-center text-sm text-gray-500">
                Waiting for game to start...
              </div>
            )}
            
            {gameState.gamePhase === "answering" && (
              <div className="text-center text-sm text-gray-600">
                <Send className="h-4 w-4 inline mr-2" />
                {answersSubmitted === totalPlayers
                  ? "All answers submitted! Moving to guessing..."
                  : `Waiting for ${totalPlayers - answersSubmitted} more answers...`
                }
              </div>
            )}
            
            {gameState.gamePhase === "guessing" && (
              <div className="text-center text-sm text-gray-600">
                <Star className="h-4 w-4 inline mr-2" />
                Players are guessing Dr. Whatchamacallit's answer...
              </div>
            )}
            
            {gameState.gamePhase === "revealing" && (
              <div className="text-center text-sm text-gray-600">
                <Trophy className="h-4 w-4 inline mr-2" />
                Results revealed! Preparing for next round...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}