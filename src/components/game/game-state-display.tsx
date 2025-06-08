"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { 
  Crown, 
  Gamepad2, 
  Send, 
  Star, 
  Trophy, 
  Users 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function GameStateDisplay() {
  const { gameState, roomCode, isReady } = useGameContext();
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer for current phase
  useEffect(() => {
    if (gameState.gamePhase === "waiting") {
      setTimeElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeElapsed((prev: number) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gamePhase, gameState.roundState.currentRound]);

  // Reset timer when phase changes
  useEffect(() => {
    setTimeElapsed(0);
  }, [gameState.gamePhase]);

  if (!isReady || !roomCode) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <span className="ml-2 text-gray-600">Loading game state...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPlayers = gameState.players.length;
  const answersSubmitted = gameState.roundState.answers.length;
  const submissionProgress = totalPlayers > 0 ? (answersSubmitted / totalPlayers) * 100 : 0;
  const roundProgress = gameState.roundState.totalRounds > 0 
    ? (gameState.roundState.currentRound / gameState.roundState.totalRounds) * 100 
    : 0;

  const currentLeader = gameState.players.reduce((leader: Player, player: Player) => 
    player.score > leader.score ? player : leader
  , { score: -1, name: "None", id: "", isDoctor: false, avatar: "" } as Player);

  const doctorPlayer = gameState.players.find((p: Player) => p.isDoctor);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInfo = () => {
    switch (gameState.gamePhase) {
      case "waiting":
        return {
          title: "Waiting to Start",
          description: "Game hasn't started yet",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
      case "answering":
        return {
          title: "Answering Phase",
          description: "Players are submitting their answers",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case "guessing":
        return {
          title: "Guessing Phase",
          description: "Find Dr. Whatchamacallit's answer",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
      case "revealing":
        return {
          title: "Results Phase",
          description: "Revealing the answers",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      default:
        return {
          title: "Unknown Phase",
          description: "Game status unclear",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-blue-500" />
          Game State
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Phase Status */}
        <div className={`p-4 rounded-lg border-2 ${phaseInfo.bgColor} ${phaseInfo.borderColor}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${phaseInfo.color}`}>
              {phaseInfo.title}
            </h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{phaseInfo.description}</p>
        </div>

        {/* Room Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {roomCode}
            </div>
            <div className="text-xs text-gray-500">Room Code</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalPlayers}
            </div>
            <div className="text-xs text-gray-500">Players</div>
          </div>
        </div>

        <Separator />

        {/* Round Progress */}
        {gameState.roundState.totalRounds > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Round Progress</span>
              <span className="text-sm text-gray-600">
                {gameState.roundState.currentRound} / {gameState.roundState.totalRounds}
              </span>
            </div>
            <Progress value={roundProgress} className="h-2" />
          </div>
        )}

        {/* Submission Progress (during answering phase) */}
        {gameState.gamePhase === "answering" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Answers Submitted</span>
              <span className="text-sm text-gray-600">
                {answersSubmitted} / {totalPlayers}
              </span>
            </div>
            <Progress value={submissionProgress} className="h-2" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Send className="h-4 w-4" />
              {answersSubmitted === totalPlayers
                ? "All answers received!"
                : `Waiting for ${totalPlayers - answersSubmitted} more answers...`
              }
            </div>
          </div>
        )}

        <Separator />

        {/* Current Leader */}
        {currentLeader.score > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Current Leader
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentLeader.avatar}`}
                >
                  {currentLeader.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-yellow-800">
                  {currentLeader.name}
                </span>
                <Badge className="bg-yellow-500 text-white text-xs">
                  {currentLeader.score} pts
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Dr. Whatchamacallit */}
        {doctorPlayer && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Dr. Whatchamacallit
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${doctorPlayer.avatar}`}
                >
                  {doctorPlayer.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-purple-800">
                  {doctorPlayer.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Round {gameState.roundState.currentRound}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Connection Status:</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 font-medium">Live</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {gameState.players.reduce((sum: number, p: Player) => sum + p.score, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {gameState.roundState.answers.length}
            </div>
            <div className="text-xs text-gray-500">Answers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-gray-500">Phase Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}