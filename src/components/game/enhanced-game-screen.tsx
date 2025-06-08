"use client";

import AnswerVisualization from "@/components/game/answer-visualization";
import AnswersList from "@/components/game/answers-list";
import ConnectionStatus from "@/components/game/connection-status";
import EnhancedAnswerInput from "@/components/game/enhanced-answer-input";
import GameAnalyticsDashboard from "@/components/game/game-analytics-dashboard";
import GamePhaseTransition from "@/components/game/game-phase-transition";
import GameStatusDisplay from "@/components/game/game-status-display";
import LiveGameFeed from "@/components/game/live-game-feed";
import LoadingState from "@/components/game/loading-state";
import PlayerDashboard from "@/components/game/player-dashboard";
import PlayerScoreCards from "@/components/game/player-score-cards";
import PromptCard from "@/components/game/prompt-card";
import RealTimeScoreboard from "@/components/game/real-time-scoreboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { Shuffle, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnhancedGameScreen() {
	const router = useRouter();
	const { gameState, nextRound, isReady } = useGameContext();

	if (!isReady) {
		return (
			<LoadingState message="Loading game..." showPlayerSkeletons={true} />
		);
	}

	// Handle next round
	const handleNextRound = async () => {
		await nextRound();
		if (gameState.roundState.currentRound >= gameState.roundState.totalRounds) {
			router.push("/game/results");
		}
	};

	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-8xl">
				{/* Enhanced layout with sidebar */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
					{/* Main game area */}
					<div className="space-y-6 lg:col-span-4">
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
										className="h-3 w-64"
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

						{/* Enhanced answer visualization for guessing and revealing phases */}
						<AnswerVisualization />

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
					<div className="max-h-screen space-y-4 overflow-y-auto lg:col-span-2">
						<RealTimeScoreboard />
						<PlayerDashboard />
						<LiveGameFeed />
						<GameAnalyticsDashboard />
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
