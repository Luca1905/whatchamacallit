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
	const submissionProgress =
		totalPlayers > 0 ? (answersSubmitted / totalPlayers) * 100 : 0;

	// Calculate player statistics
	const playerStats = gameState.players.map((player: Player) => {
		const playerAnswers = gameState.roundState.answers.filter(
			(answer: any) => answer.playerId === player.id,
		);
		const hasSubmittedThisRound = playerAnswers.length > 0;

		return {
			...player,
			hasSubmittedThisRound,
			answersSubmitted: playerAnswers.length,
			rank:
				gameState.players.filter((p: Player) => p.score > player.score).length +
				1,
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
					<div className="flex items-center justify-between">
						<span className="text-gray-600 text-sm">Current Phase:</span>
						<Badge variant="outline" className="capitalize">
							{gameState.gamePhase}
						</Badge>
					</div>

					{/* Round progress */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Round Progress:</span>
							<span className="font-medium">
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
						<div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
							<div className="flex items-center gap-2">
								<Crown className="h-4 w-4 text-yellow-600" />
								<span className="font-medium text-sm text-yellow-800">
									Current Leader:
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium text-yellow-800">
									{currentLeader.name}
								</span>
								<Badge className="bg-yellow-500 text-white text-xs">
									{currentLeader.score} pts
								</Badge>
							</div>
						</div>
					)}

					{/* Doctor indicator */}
					{doctorPlayer && (
						<div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3">
							<div className="flex items-center gap-2">
								<Crown className="h-4 w-4 text-purple-600" />
								<span className="font-medium text-purple-800 text-sm">
									Dr. Whatchamacallit:
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium text-purple-800">
									{doctorPlayer.name}
								</span>
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
							className={`flex items-center justify-between rounded-lg border-2 p-3 transition-all ${
								player.rank === 1 && player.score > 0
									? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50"
									: player.isDoctor
										? "border-purple-200 bg-purple-50"
										: "border-gray-200 bg-white"
							}`}
						>
							{/* Player info */}
							<div className="flex items-center gap-3">
								{/* Rank badge */}
								<div
									className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
										player.rank === 1 && player.score > 0
											? "bg-yellow-500 text-white"
											: "bg-gray-100 text-gray-600"
									}`}
								>
									{player.rank}
								</div>

								{/* Avatar */}
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${player.avatar}`}
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
									<div className="text-gray-500 text-xs">
										{player.score} points
										{gameState.gamePhase === "answering" && (
											<span className="ml-2">
												•{" "}
												{player.hasSubmittedThisRound
													? "Submitted"
													: "Writing..."}
											</span>
										)}
									</div>
								</div>
							</div>

							{/* Status indicators */}
							<div className="flex items-center gap-2">
								{/* Submission status */}
								{gameState.gamePhase === "answering" && (
									<div
										className={`h-3 w-3 rounded-full ${
											player.hasSubmittedThisRound
												? "bg-green-500"
												: "animate-pulse bg-orange-400"
										}`}
									/>
								)}

								{/* Connection status */}
								<div
									className="h-2 w-2 rounded-full bg-green-500"
									title="Online"
								/>

								{/* Score badge */}
								<Badge
									variant={
										player.rank === 1 && player.score > 0
											? "default"
											: "secondary"
									}
									className="text-xs"
								>
									{player.score}
								</Badge>
							</div>
						</div>
					))}

					{/* Phase-specific information */}
					<div className="border-t pt-3">
						{gameState.gamePhase === "waiting" && (
							<div className="text-center text-gray-500 text-sm">
								Waiting for game to start...
							</div>
						)}

						{gameState.gamePhase === "answering" && (
							<div className="text-center text-gray-600 text-sm">
								<Send className="mr-2 inline h-4 w-4" />
								{answersSubmitted === totalPlayers
									? "All answers submitted! Moving to guessing..."
									: `Waiting for ${totalPlayers - answersSubmitted} more answers...`}
							</div>
						)}

						{gameState.gamePhase === "guessing" && (
							<div className="text-center text-gray-600 text-sm">
								<Star className="mr-2 inline h-4 w-4" />
								Players are guessing Dr. Whatchamacallit's answer...
							</div>
						)}

						{gameState.gamePhase === "revealing" && (
							<div className="text-center text-gray-600 text-sm">
								<Trophy className="mr-2 inline h-4 w-4" />
								Results revealed! Preparing for next round...
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
