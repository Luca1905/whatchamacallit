"use client";

import AnswersList from "@/components/game/answers-list";
import ConnectionStatus from "@/components/game/connection-status";
import EnhancedAnswerInput from "@/components/game/enhanced-answer-input";
import LoadingState from "@/components/game/loading-state";
import PlayerScoreCards from "@/components/game/player-score-cards";
import PromptCard from "@/components/game/prompt-card";
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
        {/* Header with enhanced progress */}
        <div className="mb-8 flex items-center justify-between">
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

          <PlayerScoreCards />
        </div>

        {/* Current Prompt */}
        <PromptCard prompt={gameState.roundState.currentPrompt} />

        {/* Game Phase Content */}
        {gameState.gamePhase === "answering" && <EnhancedAnswerInput />}

        {gameState.gamePhase === "guessing" && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Which answer is from Dr. Whatchamacallit?
                </div>
                
                <Badge 
                  variant={selectedAnswer ? "default" : "secondary"}
                  className="text-sm"
                >
                  {selectedAnswer ? "Answer Selected" : "Select an Answer"}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Enhanced answers list with selection */}
              <div className="grid gap-3">
                {gameState.roundState.answers.map((answer: Answer, index: number) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.answer)}
                    className={`text-left rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      selectedAnswer === answer.answer
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            selectedAnswer === answer.answer ? "default" : "secondary"
                          }
                        >
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <span className="font-medium">{answer.answer}</span>
                      </div>
                      
                      {selectedAnswer === answer.answer && (
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Separator />

              <div className="flex justify-center">
                <Button
                  onClick={handleRevealAnswers}
                  disabled={!selectedAnswer || isRevealing}
                  size="lg"
                  className="bg-blue-500 px-8 hover:bg-blue-600 disabled:opacity-50"
                >
                  {isRevealing ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Trophy className="mr-2 h-5 w-5" />
                  )}
                  {isRevealing ? "Revealing..." : "Reveal Answers"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gameState.gamePhase === "revealing" && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6" />
                Round Results!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Celebration message */}
              {showCelebration && (
                <div className={`text-center p-6 rounded-lg ${
                  isCorrectGuess() 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-orange-50 border border-orange-200"
                }`}>
                  <div className="text-4xl mb-2">
                    {isCorrectGuess() ? "🎉" : "😅"}
                  </div>
                  <h3 className={`text-xl font-bold ${
                    isCorrectGuess() ? "text-green-700" : "text-orange-700"
                  }`}>
                    {isCorrectGuess() 
                      ? "Excellent Detective Work!" 
                      : "Better Luck Next Round!"
                    }
                  </h3>
                </div>
              )}

              {/* Results grid */}
              <div className="grid gap-4">
                {gameState.roundState.answers.map((answer: Answer, index: number) => (
                  <div
                    key={answer.id}
                    className={`rounded-lg border-2 p-4 ${
                      answer.isDoctor
                        ? "border-yellow-400 bg-yellow-50"
                        : selectedAnswer === answer.answer
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={answer.isDoctor ? "default" : "secondary"}
                        >
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <span className="font-medium">{answer.answer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {answer.isDoctor && (
                          <Crown className="h-4 w-4 text-yellow-600" />
                        )}
                        {selectedAnswer === answer.answer && !answer.isDoctor && (
                          <Badge variant="outline" className="text-xs">
                            Your Guess
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-sm">
                          {answer.isDoctor
                            ? "Dr. Whatchamacallit"
                            : answer.playerName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="text-center space-y-4">
                <p className="text-lg">
                  {isCorrectGuess()
                    ? "🎉 Correct! You found Dr. Whatchamacallit's answer!"
                    : "❌ Wrong guess! Better luck next round!"}
                </p>
                
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
            </CardContent>
          </Card>
        )}

        {/* Real-time activity indicators */}
        <ConnectionStatus />
      </div>
    </div>
  );
}