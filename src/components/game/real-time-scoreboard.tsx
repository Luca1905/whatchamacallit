"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface ScoreChange {
	playerId: string;
	oldScore: number;
	newScore: number;
	timestamp: number;
}

export default function RealTimeScoreboard() {
	const { gameState } = useGameContext();
	const [scoreChanges, setScoreChanges] = useState([]);
	const [animatingPlayers, setAnimatingPlayers] = useState(new Set());

	// Track score changes for animations
	useEffect(() => {
		const newScoreChanges: ScoreChange[] = [];
		const newAnimatingPlayers = new Set();

		gameState.players.forEach((player: Player) => {
			// Find if this player's score changed (simplified simulation)
			if (Math.random() < 0.1) {
				// 10% chance of showing score animation
				newScoreChanges.push({
					playerId: player.id,
					oldScore: Math.max(0, player.score - 10),
					newScore: player.score,
					timestamp: Date.now(),
				});
				newAnimatingPlayers.add(player.id);
			}
		});

		if (newScoreChanges.length > 0) {
			setScoreChanges(newScoreChanges);
			setAnimatingPlayers(newAnimatingPlayers);

			// Clear animations after 2 seconds
			setTimeout(() => {
				setAnimatingPlayers(new Set());
			}, 2000);
		}
	}, [gameState.players]);

	// Sort players by score (descending)
	const sortedPlayers = [...gameState.players].sort(
		(a, b) => b.score - a.score,
	);

	const getPositionChange = (player: Player, currentIndex: number) => {
		// Simulate position changes (in real app, track previous positions)
		const random = Math.random();
		if (random < 0.1) return "up";
		if (random < 0.2) return "down";
		return "same";
	};

	const getScoreChangeDisplay = (playerId: string) => {
		const change = scoreChanges.find(
			(c: ScoreChange) => c.playerId === playerId,
		);
		if (!change) return null;

		const difference = change.newScore - change.oldScore;
		if (difference <= 0) return null;

		return (
			<div className="-top-2 -right-2 absolute animate-bounce rounded-full bg-green-500 px-2 py-1 font-bold text-white text-xs">
				+{difference}
			</div>
		);
	};

	return (
		<Card className="border-0 shadow-xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="h-5 w-5 text-yellow-500" />
					Live Scoreboard
					<Badge variant="secondary" className="text-xs">
						Round {gameState.roundState.currentRound}
					</Badge>
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-3">
				{sortedPlayers.map((player: Player, index: number) => {
					const isLeader = index === 0;
					const isAnimating = animatingPlayers.has(player.id);
					const positionChange = getPositionChange(player, index);

					return (
						<div
							key={player.id}
							className={`relative flex items-center justify-between rounded-lg p-3 transition-all duration-500 ${
								isLeader
									? "border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50"
									: "border border-gray-200 bg-white"
							} ${isAnimating ? "scale-105 shadow-lg" : ""}`}
						>
							{/* Position and change indicator */}
							<div className="flex items-center gap-3">
								<div className="relative">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
											isLeader
												? "bg-yellow-500 text-white"
												: "bg-gray-100 text-gray-600"
										}`}
									>
										{index + 1}
									</div>

									{/* Position change indicator */}
									{positionChange === "up" && (
										<Star className="-top-1 -right-1 absolute h-3 w-3 text-green-500" />
									)}
									{positionChange === "down" && (
										<Star className="-top-1 -right-1 absolute h-3 w-3 rotate-180 text-red-500" />
									)}
								</div>

								{/* Player info */}
								<div className="flex items-center gap-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${player.avatar}`}
									>
										{player.name.charAt(0).toUpperCase()}
									</div>

									<div>
										<div className="flex items-center gap-2">
											<span className="font-medium">{player.name}</span>
											{player.isDoctor && (
												<Crown className="h-4 w-4 text-yellow-600" />
											)}
											{isLeader && (
												<Badge className="bg-yellow-500 text-xs text-yellow-50">
													Leader
												</Badge>
											)}
										</div>
										{isLeader && (
											<div className="text-xs text-yellow-700">
												Leading by{" "}
												{sortedPlayers[1]
													? player.score - sortedPlayers[1].score
													: player.score}{" "}
												points
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Score display */}
							<div className="relative">
								<div
									className={`text-right ${isAnimating ? "animate-pulse" : ""}`}
								>
									<div
										className={`font-bold text-2xl ${
											isLeader ? "text-yellow-600" : "text-gray-700"
										}`}
									>
										{player.score}
									</div>
									<div className="text-gray-500 text-xs">points</div>
								</div>

								{/* Score change animation */}
								{getScoreChangeDisplay(player.id)}
							</div>

							{/* Leader crown decoration */}
							{isLeader && (
								<div className="-top-2 -translate-x-1/2 absolute left-1/2 transform">
									<Crown className="h-6 w-6 text-yellow-500" />
								</div>
							)}
						</div>
					);
				})}

				{/* Game progress indicator */}
				<div className="border-t pt-3">
					<div className="mb-2 flex justify-between text-gray-500 text-xs">
						<span>Game Progress</span>
						<span>
							{gameState.roundState.currentRound}/
							{gameState.roundState.totalRounds} rounds
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-gray-200">
						<div
							className="h-2 rounded-full bg-green-500 transition-all duration-500"
							style={{
								width: `${
									(gameState.roundState.currentRound /
										gameState.roundState.totalRounds) *
									100
								}%`,
							}}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
