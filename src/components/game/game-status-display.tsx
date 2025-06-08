"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Send, Star, Trophy, Users } from "lucide-react";

export default function GameStatusDisplay() {
	const { gameState, roomCode } = useGameContext();

	const getPhaseInfo = () => {
		switch (gameState.gamePhase) {
			case "waiting":
				return {
					icon: Star,
					title: "Waiting",
					description: "Setting up the game...",
					color: "text-gray-600",
					bgColor: "bg-gray-50",
				};
			case "answering":
				return {
					icon: Send,
					title: "Answer Time",
					description: "Players are submitting answers",
					color: "text-blue-600",
					bgColor: "bg-blue-50",
				};
			case "guessing":
				return {
					icon: Crown,
					title: "Guessing Time",
					description: "Finding Dr. Whatchamacallit's answer",
					color: "text-purple-600",
					bgColor: "bg-purple-50",
				};
			case "revealing":
				return {
					icon: Trophy,
					title: "Results",
					description: "Viewing answers and scores",
					color: "text-green-600",
					bgColor: "bg-green-50",
				};
			default:
				return {
					icon: Star,
					title: "Game",
					description: "Playing...",
					color: "text-gray-600",
					bgColor: "bg-gray-50",
				};
		}
	};

	const phaseInfo = getPhaseInfo();
	const PhaseIcon = phaseInfo.icon;

	const answersSubmitted = gameState.roundState.answers.length;
	const totalPlayers = gameState.players.length;
	const answerProgress =
		totalPlayers > 0 ? (answersSubmitted / totalPlayers) * 100 : 0;

	// Find current leader by sorting players by score
	const sortedPlayers = [...gameState.players].sort(
		(a: Player, b: Player) => b.score - a.score,
	);
	const currentLeader = sortedPlayers[0] || {
		score: -1,
		name: "No one",
		id: "",
		isDoctor: false,
		avatar: "",
	};

	return (
		<div className="space-y-4">
			{/* Phase Status */}
			<Card className="border-0 shadow-lg">
				<CardHeader className={`${phaseInfo.bgColor} rounded-t-lg`}>
					<CardTitle className="flex items-center gap-2">
						<PhaseIcon className={`h-5 w-5 ${phaseInfo.color}`} />
						<span className={phaseInfo.color}>{phaseInfo.title}</span>
						<Badge variant="outline" className="ml-auto">
							Round {gameState.roundState.currentRound}
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<p className="mb-3 text-gray-600 text-sm">{phaseInfo.description}</p>

					{/* Answer progress for answering phase */}
					{gameState.gamePhase === "answering" && (
						<div className="space-y-2">
							<div className="flex justify-between text-gray-500 text-xs">
								<span>Answers submitted</span>
								<span>
									{answersSubmitted}/{totalPlayers}
								</span>
							</div>
							<Progress value={answerProgress} className="h-2" />
						</div>
					)}
				</CardContent>
			</Card>

			{/* Game Progress */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<Trophy className="h-4 w-4 text-yellow-500" />
						Game Progress
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex justify-between text-gray-500 text-xs">
						<span>Rounds completed</span>
						<span>
							{gameState.roundState.currentRound}/
							{gameState.roundState.totalRounds}
						</span>
					</div>
					<Progress
						value={
							(gameState.roundState.currentRound /
								gameState.roundState.totalRounds) *
							100
						}
						className="h-2"
					/>

					{/* Current leader */}
					{currentLeader.score > 0 && (
						<div className="border-t pt-2">
							<div className="flex items-center justify-between">
								<span className="text-gray-500 text-xs">Current leader:</span>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">
										{currentLeader.name}
									</span>
									<Badge variant="secondary" className="text-xs">
										{currentLeader.score} pts
									</Badge>
									{currentLeader.isDoctor && (
										<Crown className="h-3 w-3 text-yellow-500" />
									)}
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Room Info */}
			{roomCode && (
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<Users className="h-4 w-4 text-blue-500" />
							Room Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-gray-500 text-xs">Room Code:</span>
							<Badge variant="outline" className="font-mono">
								{roomCode}
							</Badge>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-gray-500 text-xs">Players online:</span>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
								<span className="font-medium text-sm">{totalPlayers}</span>
							</div>
						</div>

						{/* Doctor indicator */}
						{gameState.players.some((p: Player) => p.isDoctor) && (
							<div className="flex items-center justify-between">
								<span className="text-gray-500 text-xs">
									Dr. Whatchamacallit:
								</span>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">
										{gameState.players.find((p: Player) => p.isDoctor)?.name}
									</span>
									<Crown className="h-3 w-3 text-yellow-500" />
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
