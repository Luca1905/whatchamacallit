"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Send, Star, Trophy, Users } from "lucide-react";
import { useMemo } from "react";

export default function GameAnalyticsDashboard() {
	const { gameState, roomCode } = useGameContext();

	// Calculate comprehensive game statistics
	const analytics = useMemo(() => {
		const totalPlayers = gameState.players.length;
		const currentRound = gameState.roundState.currentRound;
		const totalRounds = gameState.roundState.totalRounds;
		const answersThisRound = gameState.roundState.answers.length;

		// Score analysis
		const scores = gameState.players.map((p: Player) => p.score);
		const maxScore = Math.max(...scores, 0);
		const minScore = Math.min(...scores, 0);
		const avgScore =
			scores.length > 0
				? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
				: 0;
		const totalPointsAwarded = scores.reduce(
			(a: number, b: number) => a + b,
			0,
		);

		// Player performance analysis
		const playersWithScores = gameState.players.filter(
			(p: Player) => p.score > 0,
		);
		const leadersCount = gameState.players.filter(
			(p: Player) => p.score === maxScore && maxScore > 0,
		).length;

		// Round progress
		const gameProgress =
			totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
		const answersProgress =
			totalPlayers > 0 ? (answersThisRound / totalPlayers) * 100 : 0;

		// Engagement metrics
		const participationRate =
			totalPlayers > 0 ? (answersThisRound / totalPlayers) * 100 : 0;
		const averageAnswerLength =
			gameState.roundState.answers.length > 0
				? gameState.roundState.answers.reduce(
						(acc: number, answer: any) => acc + answer.answer.length,
						0,
					) / gameState.roundState.answers.length
				: 0;

		return {
			totalPlayers,
			currentRound,
			totalRounds,
			answersThisRound,
			maxScore,
			minScore,
			avgScore,
			totalPointsAwarded,
			playersWithScores: playersWithScores.length,
			leadersCount,
			gameProgress,
			answersProgress,
			participationRate,
			averageAnswerLength,
		};
	}, [gameState]);

	if (!roomCode) return null;

	const doctorPlayer = gameState.players.find((p: Player) => p.isDoctor);
	const currentLeader = gameState.players.reduce(
		(leader: Player, player: Player) =>
			player.score > leader.score ? player : leader,
		{
			score: -1,
			name: "No one",
			id: "",
			isDoctor: false,
			avatar: "",
		} as Player,
	);

	return (
		<div className="space-y-4">
			{/* Game Progress Overview */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Star className="h-5 w-5 text-blue-500" />
						Game Analytics
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Overall game progress */}
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center">
							<div className="font-bold text-2xl text-blue-600">
								{analytics.currentRound}
							</div>
							<div className="text-gray-500 text-xs">Current Round</div>
							<Progress value={analytics.gameProgress} className="mt-2 h-2" />
						</div>
						<div className="text-center">
							<div className="font-bold text-2xl text-green-600">
								{analytics.totalPlayers}
							</div>
							<div className="text-gray-500 text-xs">Total Players</div>
							<div className="mt-2 flex items-center justify-center">
								<div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
								<span className="text-green-600 text-xs">All Online</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Score Statistics */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5 text-yellow-500" />
						Score Analysis
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="font-bold text-lg text-yellow-600">
								{analytics.maxScore}
							</div>
							<div className="text-gray-500 text-xs">Highest Score</div>
						</div>
						<div>
							<div className="font-bold text-blue-600 text-lg">
								{Math.round(analytics.avgScore)}
							</div>
							<div className="text-gray-500 text-xs">Average Score</div>
						</div>
						<div>
							<div className="font-bold text-lg text-purple-600">
								{analytics.totalPointsAwarded}
							</div>
							<div className="text-gray-500 text-xs">Total Points</div>
						</div>
					</div>

					{/* Current leader highlight */}
					{currentLeader.score > 0 && (
						<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Crown className="h-4 w-4 text-yellow-600" />
									<span className="font-medium text-sm text-yellow-800">
										Leading the pack:
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
						</div>
					)}
				</CardContent>
			</Card>

			{/* Round Activity */}
			{gameState.roundState.currentRound > 0 && (
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Send className="h-5 w-5 text-purple-500" />
							Round {analytics.currentRound} Activity
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Participation metrics */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Participation Rate:</span>
								<span className="font-medium">
									{Math.round(analytics.participationRate)}%
								</span>
							</div>
							<Progress value={analytics.participationRate} className="h-2" />
						</div>

						{/* Answer submission status */}
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center">
								<div className="font-bold text-green-600 text-lg">
									{analytics.answersThisRound}
								</div>
								<div className="text-gray-500 text-xs">Answers Submitted</div>
							</div>
							<div className="text-center">
								<div className="font-bold text-lg text-orange-600">
									{analytics.totalPlayers - analytics.answersThisRound}
								</div>
								<div className="text-gray-500 text-xs">Players Remaining</div>
							</div>
						</div>

						{/* Creative metrics */}
						{analytics.averageAnswerLength > 0 && (
							<div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
								<div className="text-center">
									<div className="font-medium text-purple-800 text-sm">
										Average Answer Length
									</div>
									<div className="font-bold text-lg text-purple-600">
										{Math.round(analytics.averageAnswerLength)} characters
									</div>
									<div className="mt-1 text-purple-600 text-xs">
										{analytics.averageAnswerLength > 20
											? "Players are being creative! 🎨"
											: "Short and sweet answers 📝"}
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Player Insights */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-green-500" />
						Player Insights
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Quick stats */}
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center">
							<div className="font-bold text-green-600 text-lg">
								{analytics.playersWithScores}
							</div>
							<div className="text-gray-500 text-xs">Players Scoring</div>
						</div>
						<div className="text-center">
							<div className="font-bold text-blue-600 text-lg">
								{analytics.leadersCount}
							</div>
							<div className="text-gray-500 text-xs">
								{analytics.leadersCount === 1 ? "Clear Leader" : "Tied Leaders"}
							</div>
						</div>
					</div>

					{/* Doctor info */}
					{doctorPlayer && (
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Crown className="h-4 w-4 text-blue-600" />
									<span className="font-medium text-blue-800 text-sm">
										Dr. Whatchamacallit:
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-white text-xs ${doctorPlayer.avatar}`}
									>
										{doctorPlayer.name.charAt(0).toUpperCase()}
									</div>
									<span className="font-medium text-blue-800">
										{doctorPlayer.name}
									</span>
									<Badge variant="secondary" className="text-xs">
										{doctorPlayer.score} pts
									</Badge>
								</div>
							</div>
						</div>
					)}

					{/* Game phase insights */}
					<div className="text-center">
						<Badge variant="outline" className="capitalize">
							{gameState.gamePhase} Phase
						</Badge>
						<div className="mt-1 text-gray-500 text-xs">
							{gameState.gamePhase === "waiting" && "Game hasn't started yet"}
							{gameState.gamePhase === "answering" &&
								"Players are crafting their answers"}
							{gameState.gamePhase === "guessing" &&
								"Time to find the doctor's answer!"}
							{gameState.gamePhase === "revealing" && "Moment of truth!"}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Room Information */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="text-sm">Room Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Room Code:</span>
						<Badge variant="outline" className="font-mono text-xs">
							{roomCode}
						</Badge>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Game Mode:</span>
						<span className="font-medium">Dr. Whatchamacallit</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Connection:</span>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span className="text-green-600 text-xs">Live</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
