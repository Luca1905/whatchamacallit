"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { GamePhase } from "@/lib/game-types";
import { Crown, Send, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface PhaseTransition {
  from: GamePhase;
  to: GamePhase;
  timestamp: number;
}

export default function GamePhaseTransition() {
  const { gameState } = useGameContext();
  const [currentTransition, setCurrentTransition] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Track phase changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Simulate phase transition detection (in real app, track previous phase)
    if (gameState.gamePhase !== "waiting") {
      const transition = {
        from: "waiting" as GamePhase,
        to: gameState.gamePhase,
        timestamp: Date.now(),
      };

      setCurrentTransition(transition);
      setIsVisible(true);

      // Hide transition after 3 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentTransition(null), 500); // Wait for animation
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameState.gamePhase]);

  const getPhaseInfo = (phase: GamePhase) => {
    switch (phase) {
      case "waiting":
        return {
          icon: Star,
          title: "Waiting",
          description: "Setting up the game...",
          color: "bg-gray-500",
          bgColor: "bg-gray-50",
        };
      case "answering":
        return {
          icon: Send,
          title: "Answer Time",
          description: "Submit your creative answers!",
          color: "bg-blue-500",
          bgColor: "bg-blue-50",
        };
      case "guessing":
        return {
          icon: Crown,
          title: "Guessing Time",
          description: "Find Dr. Whatchamacallit's answer!",
          color: "bg-purple-500",
          bgColor: "bg-purple-50",
        };
      case "revealing":
        return {
          icon: Trophy,
          title: "Results",
          description: "See the answers and scores!",
          color: "bg-green-500",
          bgColor: "bg-green-50",
        };
      default:
        return {
          icon: Star,
          title: "Game",
          description: "Playing...",
          color: "bg-gray-500",
          bgColor: "bg-gray-50",
        };
    }
  };

  if (!currentTransition || !isVisible) return null;

  const fromPhase = getPhaseInfo(currentTransition.from);
  const toPhase = getPhaseInfo(currentTransition.to);
  const ToIcon = toPhase.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card 
        className={`w-96 mx-4 border-0 shadow-2xl transform transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <CardContent className={`p-8 text-center ${toPhase.bgColor}`}>
          {/* Animated icon */}
          <div className="relative mb-6">
            <div 
              className={`w-20 h-20 rounded-full ${toPhase.color} flex items-center justify-center mx-auto animate-bounce`}
            >
              <ToIcon className="h-10 w-10 text-white" />
            </div>
            
            {/* Pulsing ring */}
            <div 
              className={`absolute inset-0 w-20 h-20 rounded-full ${toPhase.color} opacity-30 animate-ping mx-auto`}
            />
          </div>

          {/* Phase title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {toPhase.title}
          </h2>

          {/* Phase description */}
          <p className="text-gray-600 mb-4">
            {toPhase.description}
          </p>

          {/* Phase badge */}
          <Badge className={`${toPhase.color} text-white`}>
            Round {gameState.roundState.currentRound}
          </Badge>

          {/* Countdown dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}