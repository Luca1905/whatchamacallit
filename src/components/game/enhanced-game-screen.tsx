"use client";

import AnswersList from "@/components/game/answers-list";
import ConnectionStatus from "@/components/game/connection-status";
import EnhancedAnswerInput from "@/components/game/enhanced-answer-input";
import GamePhaseTransition from "@/components/game/game-phase-transition";
import GameStatusDisplay from "@/components/game/game-status-display";
import LoadingState from "@/components/game/loading-state";
import PlayerScoreCards from "@/components/game/player-score-cards";
import PromptCard from "@/components/game/prompt-card";
import RealTimeScoreboard from "@/components/game/real-time-scoreboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import type { Answer } from "@/lib/game-types";
import { Crown, Shuffle, Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnhancedGameScreen() {
  const router = useRouter();
  const { gameState, revealAnswers, nextRound, isReady } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Show loading state if not ready
  if (!isReady) {
    return <LoadingState message="Loading game..." showPlayerSkeletons={true} />;
  }

  // Handle answer selection in guessing phase
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle reveal answers
  const handleRevealAnswers = async () => {
    if (!selectedAnswer) return;
    
    setIsRevealing(true);
    try {
      await revealAnswers();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (error) {
      console.error("Failed to reveal answers:", error);
    } finally {
      setIsRevealing(false);
    }
  };

  // Handle next round
  const handleNextRound = async () => {
    setSelectedAnswer(null);
    await nextRound();
    if (gameState.roundState.currentRound >= gameState.roundState.totalRounds) {
      router.push("/game/results");
    }
  };

  // Check if player guessed correctly
  const isCorrectGuess = () => {
    const doctorAnswer = gameState.roundState.answers.find((a: Answer) => a.isDoctor);
    return selectedAnswer === doctorAnswer?.answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Enhanced layout with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main game area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header with enhanced progress */}
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="flex items-center gap-2 font-bold text-3xl text-green-600">
                  <Star className="h-8 w-8" />
                  Round {gameState.roundState.currentRound} of{" "}
                  {gameState.roundState.totalRounds}
                </h2>
                
                <div className="flex items-center gap-4">
                  <Progress
                    value={
                      (gameState.roundState.currentRound /
                        gameState.roundState.totalRounds) *
                      100
                    }
                    className="w-64 h-3"
                  />
                  <Badge variant="outline" className="text-sm">
                    Phase: {gameState.gamePhase}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Current Prompt */}
            <PromptCard prompt={gameState.roundState.currentPrompt} />

            {/* Game Phase Content */}
            {gameState.gamePhase === "answering" && <EnhancedAnswerInput />}

            {/* Basic answers list for now */}
            {(gameState.gamePhase === "guessing" || gameState.gamePhase === "revealing") && (
              <AnswersList />
            )}

            {/* Next round button for revealing phase */}
            {gameState.gamePhase === "revealing" && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleNextRound}
                  size="lg"
                  className="bg-green-500 px-8 hover:bg-green-600"
                >
                  {gameState.roundState.currentRound >=
                  gameState.roundState.totalRounds
                    ? "View Final Results"
                    : "Next Round"}
                  <Shuffle className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar with real-time info */}
          <div className="lg:col-span-1 space-y-4 max-h-screen overflow-y-auto">
            <RealTimeScoreboard />
            <GameStatusDisplay />
          </div>
        </div>

        {/* Phase transitions and other overlays */}
        <GamePhaseTransition />
        {/* Real-time activity indicators */}
        <ConnectionStatus />
      </div>
    </div>
  );
}