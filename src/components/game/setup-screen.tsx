"use client";

import PlayerList from "@/components/game/player-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { ArrowLeft, Play, Plus, Users } from "lucide-react";
import { useState } from "react";

interface SetupScreenProps {
	onNavigate: (screen: "menu" | "setup" | "play" | "results") => void;
}

export default function SetupScreen({ onNavigate }: SetupScreenProps) {
	const { gameState, addPlayer, startGame, roomId, createRoom, joinRoom } = useGameContext();
	const [newPlayerName, setNewPlayerName] = useState("");
	const [joinId, setJoinId] = useState("");

	// If no room, prompt to create or join
	if (!roomId) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
				<div className="mx-auto max-w-md text-center">
					<h2 className="font-bold text-4xl text-blue-600">Multiplayer Lobby</h2>
					<div className="mt-8 space-y-4">
						<Button onClick={createRoom} size="lg" className="w-full bg-green-500 hover:bg-green-600">
							Create Room
						</Button>
						<div className="flex gap-2">
							<Input
								placeholder="Enter Room ID"
								value={joinId}
								onChange={(e) => setJoinId(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && joinRoom(joinId)}
							/>
							<Button onClick={() => joinRoom(joinId)} disabled={!joinId.trim()}>
								Join Room
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const handleAddPlayer = () => {
		if (newPlayerName.trim()) {
			addPlayer(newPlayerName);
			setNewPlayerName("");
		}
	};

	const handleStartGame = () => {
		startGame();
		onNavigate("play");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 flex items-center gap-4">
					<Button
						variant="ghost"
						size="lg"
						onClick={() => onNavigate("menu")}
						className="hover:bg-blue-100"
					>
						<ArrowLeft className="mr-2 h-5 w-5" />
						Back to Menu
					</Button>
					<div>
						<h2 className="font-bold text-4xl text-blue-600">Game Setup</h2>
						<p className="text-muted-foreground">
							Add players and configure your game
						</p>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					<Card className="border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Plus className="h-5 w-5" />
								Add Players
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-3">
								<Input
									placeholder="Enter player name..."
									value={newPlayerName}
									onChange={(e) => setNewPlayerName(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
									className="text-lg"
								/>
								<Button
									onClick={handleAddPlayer}
									disabled={
										gameState.players.length >= 8 || !newPlayerName.trim()
									}
									className="bg-green-500 hover:bg-green-600"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{gameState.players.length < 2 && (
								<Alert>
									<AlertDescription>
										You need at least 2 players to start the game.
									</AlertDescription>
								</Alert>
							)}

							<div className="text-muted-foreground text-sm">
								Players: {gameState.players.length}/8
							</div>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Current Players
							</CardTitle>
						</CardHeader>
						<CardContent>
							<PlayerList />
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />

				<Card className="border-0 shadow-lg">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="mb-2 font-semibold text-xl">Ready to Play?</h3>
								<p className="text-muted-foreground">
									{gameState.players.length >= 2
										? `${gameState.players.length} players ready • ${gameState.roundState.totalRounds} rounds`
										: "Add at least 2 players to continue"}
								</p>
							</div>
							<Button
								onClick={handleStartGame}
								disabled={gameState.players.length < 2}
								size="lg"
								className="bg-blue-500 px-8 hover:bg-blue-600"
							>
								<Play className="mr-2 h-5 w-5" />
								Start Game
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
