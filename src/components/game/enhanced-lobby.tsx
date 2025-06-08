"use client";

import ConnectionStatus from "@/components/game/connection-status";
import LoadingState from "@/components/game/loading-state";
import PlayerList from "@/components/game/player-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { ArrowLeft, Play, Users, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnhancedLobby() {
  const router = useRouter();
  const { gameState, startGame, roomCode, isReady } = useGameContext();
  const [isStarting, setIsStarting] = useState(false);

  if (!isReady) {
    return <LoadingState message="Loading lobby..." showPlayerSkeletons={true} />;
  }

  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      await startGame();
      router.push("/game/play");
    } catch (error) {
      console.error("Failed to start game:", error);
      setIsStarting(false);
    }
  };

  const handleBack = () => {
    router.push("/game");
  };

  const doctorPlayer = gameState.players.find((p: Player) => p.isDoctor);
  const minPlayersRequired = 3;
  const canStartGame = gameState.players.length >= minPlayersRequired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
            
            <h1 className="font-bold text-4xl text-green-600">
              Game Lobby
            </h1>
            <p className="text-muted-foreground text-lg">
              Waiting for players to join...
            </p>
          </div>

          {/* Room info */}
          <div className="text-right">
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Room Code:</span>
              <div className="font-mono text-2xl font-bold text-green-600">
                {roomCode}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {gameState.players.length} player{gameState.players.length !== 1 ? 's' : ''} joined
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players list */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players ({gameState.players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameState.players.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping inline-block mr-2" />
                    <p className="text-muted-foreground">
                      Waiting for players to join...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gameState.players.map((player: Player) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                          player.isDoctor
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${player.avatar}`}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {player.isDoctor && (
                            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                              <Crown className="h-3 w-3 text-yellow-600" />
                              <span className="text-xs font-medium text-yellow-700">
                                Dr. Whatchamacallit
                              </span>
                            </div>
                          )}
                          <div className="h-2 w-2 bg-green-500 rounded-full" title="Online" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game info and controls */}
          <div className="space-y-6">
            {/* Game rules */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>🎯 <strong>Goal:</strong> Find Dr. Whatchamacallit's answer!</p>
                  <p>✏️ <strong>Round 1:</strong> Everyone submits a creative answer</p>
                  <p>🕵️ <strong>Round 2:</strong> Guess which answer is the doctor's</p>
                  <p>🏆 <strong>Scoring:</strong> Get points for correct guesses</p>
                </div>
              </CardContent>
            </Card>

            {/* Current doctor */}
            {doctorPlayer && (
              <Card className="border-2 border-yellow-400 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Dr. Whatchamacallit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div 
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${doctorPlayer.avatar}`}
                    >
                      {doctorPlayer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{doctorPlayer.name}</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    This player will be the mysterious doctor for the first round!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Start game */}
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6">
                {!canStartGame ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Need at least {minPlayersRequired} players to start
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({minPlayersRequired - gameState.players.length} more needed)
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleStartGame}
                    disabled={isStarting}
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {isStarting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Play className="mr-2 h-5 w-5" />
                    )}
                    {isStarting ? "Starting..." : "Start Game"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connection status */}
        <ConnectionStatus />
      </div>
    </div>
  );
}