"use client";

import ConnectionStatus from "@/components/game/connection-status";
import LoadingState from "@/components/game/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import { api } from "@/convex/_generated/api";
import type { Player } from "@/lib/game-types";
import { useQuery } from "convex/react";
import { ArrowLeft, Crown, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnhancedLobby() {
	const router = useRouter();
	const { gameState, startGame, roomCode, isReady } = useGameContext();
	const [isStarting, setIsStarting] = useState(false);
	// Determine host by fetching room info and current player
	const room = useQuery(api.rooms.getRoom, roomCode ? { roomCode } : "skip");
	const currentPlayer = useQuery(api.user.getPlayer);
	const isHost = Boolean(
		room && currentPlayer && room.hostId === currentPlayer._id,
	);
	// Redirect non-host players when the game phase changes from waiting
	useEffect(() => {
		if (!isReady) return;
		if (!isHost && gameState.gamePhase !== "waiting") {
			router.push("/game/play");
		}
	}, [isReady, isHost, gameState.gamePhase, router]);

	if (!isReady) {
		return (
			<LoadingState message="Loading lobby..." showPlayerSkeletons={true} />
		);
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
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<Button variant="outline" onClick={handleBack} className="mb-4">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Menu
						</Button>

						<h1 className="font-bold text-4xl text-green-600">Game Lobby</h1>
						<p className="text-lg text-muted-foreground">
							Waiting for players to join...
						</p>
					</div>

					{/* Room info */}
					<div className="text-right">
						<div className="mb-2">
							<span className="text-muted-foreground text-sm">Room Code:</span>
							<div className="font-bold font-mono text-2xl text-green-600">
								{roomCode}
							</div>
						</div>
						<div className="flex items-center justify-end gap-2">
							<Users className="h-4 w-4 text-blue-500" />
							<span className="text-sm">
								{gameState.players.length} player
								{gameState.players.length !== 1 ? "s" : ""} joined
							</span>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
									<div className="py-8 text-center">
										<div className="mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-blue-500" />
										<p className="text-muted-foreground">
											Waiting for players to join...
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{gameState.players.map((player: Player) => (
											<div
												key={player.id}
												className={`flex items-center justify-between rounded-lg border-2 p-3 ${
													player.isDoctor
														? "border-yellow-400 bg-yellow-50"
														: "border-gray-200 bg-white"
												}`}
											>
												<div className="flex items-center gap-3">
													<div
														className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${player.avatar}`}
													>
														{player.name.charAt(0).toUpperCase()}
													</div>
													<span className="font-medium">{player.name}</span>
												</div>

												<div className="flex items-center gap-2">
													{player.isDoctor && (
														<div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1">
															<Crown className="h-3 w-3 text-yellow-600" />
															<span className="font-medium text-xs text-yellow-700">
																Dr. Whatchamacallit
															</span>
														</div>
													)}
													<div
														className="h-2 w-2 rounded-full bg-green-500"
														title="Online"
													/>
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
								<div className="space-y-2 text-sm">
									<p>
										🎯 <strong>Goal:</strong> Find Dr. Whatchamacallit's answer!
									</p>
									<p>
										✏️ <strong>Round 1:</strong> Everyone submits a creative
										answer
									</p>
									<p>
										🕵️ <strong>Round 2:</strong> Guess which answer is the
										doctor's
									</p>
									<p>
										🏆 <strong>Scoring:</strong> Get points for correct guesses
									</p>
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
											className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${doctorPlayer.avatar}`}
										>
											{doctorPlayer.name.charAt(0).toUpperCase()}
										</div>
										<span className="font-medium">{doctorPlayer.name}</span>
									</div>
									<p className="mt-2 text-sm text-yellow-700">
										This player will be the mysterious doctor for the first
										round!
									</p>
								</CardContent>
							</Card>
						)}

						{/* Start game */}
						<Card className="border-0 shadow-xl">
							<CardContent className="pt-6">
								{!canStartGame ? (
									<div className="space-y-3 text-center">
										<p className="text-muted-foreground text-sm">
											Need at least {minPlayersRequired} players to start
										</p>
										<p className="text-muted-foreground text-xs">
											({minPlayersRequired - gameState.players.length} more
											needed)
										</p>
									</div>
								) : isHost ? (
									<Button
										onClick={handleStartGame}
										disabled={isStarting}
										size="lg"
										className="w-full bg-green-500 hover:bg-green-600"
									>
										{isStarting ? (
											<div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
										) : (
											<Play className="mr-2 h-5 w-5" />
										)}
										{isStarting ? "Starting..." : "Start Game"}
									</Button>
								) : (
									<div className="text-center text-muted-foreground text-sm">
										Waiting for host to start the game...
									</div>
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
