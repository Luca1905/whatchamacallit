"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { Send, Star, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnswerSubmission() {
  const { gameState, submitAnswer, roomCode, isReady } = useGameContext();
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 second timer
  const [submitError, setSubmitError] = useState("");

  // Check if current user has already submitted an answer this round
  useEffect(() => {
    // In a real app, this would check against the current user's ID
    // For now, we'll simulate based on answers length
    const totalAnswers = gameState.roundState.answers.length;
    const totalPlayers = gameState.players.length;
    setHasSubmitted(totalAnswers >= totalPlayers);
  }, [gameState.roundState.answers, gameState.players]);

  // Timer countdown for answer submission
  useEffect(() => {
    if (gameState.gamePhase !== "answering" || hasSubmitted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          // Time's up - auto submit if there's an answer
          if (answer.trim() && !isSubmitting && !hasSubmitted) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gamePhase, hasSubmitted, answer, isSubmitting]);

  // Reset form when round changes
  useEffect(() => {
    setAnswer("");
    setIsSubmitting(false);
    setHasSubmitted(false);
    setTimeRemaining(60);
    setSubmitError("");
  }, [gameState.roundState.currentRound]);

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitAnswer(answer.trim());
      setHasSubmitted(true);
      setAnswer(""); // Clear the input after successful submission
    } catch (error) {
      setSubmitError("Failed to submit answer. Please try again.");
      console.error("Answer submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Don't show during non-answering phases
  if (gameState.gamePhase !== "answering") {
    return null;
  }

  if (!isReady || !roomCode) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPlayers = gameState.players.length;
  const answersSubmitted = gameState.roundState.answers.length;
  const submissionProgress = totalPlayers > 0 ? (answersSubmitted / totalPlayers) * 100 : 0;
  const remainingPlayers = totalPlayers - answersSubmitted;

  const getTimeColor = () => {
    if (timeRemaining > 30) return "text-green-600";
    if (timeRemaining > 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (timeRemaining > 30) return "bg-green-500";
    if (timeRemaining > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-500" />
            Submit Your Answer
          </div>
          <div className={`font-mono text-lg ${getTimeColor()}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current prompt reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Complete this sentence:</h3>
          <p className="text-blue-700 italic">
            "{gameState.roundState.currentPrompt}"
          </p>
        </div>

        {/* Timer progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time Remaining</span>
            <span className={getTimeColor()}>
              {timeRemaining}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
              style={{ width: `${(timeRemaining / 60) * 100}%` }}
            />
          </div>
        </div>

        <Separator />

        {/* Answer input */}
        {!hasSubmitted ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your Answer:
              </label>
              <Input
                value={answer}
                onChange={(e: any) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your creative answer here..."
                className="text-lg p-4 border-2 focus:border-blue-500"
                maxLength={100}
                disabled={isSubmitting || timeRemaining === 0}
                autoFocus
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{answer.length}/100 characters</span>
                <span>Press Enter to submit</span>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting || timeRemaining === 0}
              size="lg"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Answer
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <Trophy className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Answer Submitted!</h3>
              <p className="text-green-700 text-sm">
                Great job! Waiting for other players to finish...
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Submission progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Submission Progress
            </span>
            <span className="text-sm text-gray-600">
              {answersSubmitted} / {totalPlayers} players
            </span>
          </div>
          
          <Progress value={submissionProgress} className="h-3" />
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            {remainingPlayers === 0 
              ? "All answers submitted! Moving to next phase..."
              : `Waiting for ${remainingPlayers} more ${remainingPlayers === 1 ? 'player' : 'players'}...`
            }
          </div>
        </div>

        {/* Helpful tips */}
        {!hasSubmitted && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">💡 Tips for a great answer:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Be creative and unexpected</li>
              <li>• Keep it family-friendly</li>
              <li>• Make it memorable and fun</li>
              <li>• Think about what would make others laugh</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}