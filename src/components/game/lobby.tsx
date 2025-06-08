"use client";

import PlayerList from "@/components/game/player-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft, CheckCircle, Loader2, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Lobby() {
	const router = useRouter();
	const { gameState, startGame, roomCode, isReady, setIsReady } =
		useGameContext();
	const isHost = useQuery(
		api.rooms.playerIsHost,
		roomCode ? { roomCode } : "skip",
	);

	if (!isReady) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-blue-50">
				<LoadingSpinner size={48} className="text-blue-600" />
			</div>
		);
	}

	const handleStartGame = () => {
		startGame();
		router.push("/game/play");
	};

	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 flex items-center gap-4">
					<Button
						variant="ghost"
						size="lg"
						onClick={() => router.push("/game")}
						className="hover:bg-blue-100"
					>
						<ArrowLeft className="mr-2 h-5 w-5" />
						Back to Menu
					</Button>
					<div>
						<h2 className="font-bold text-4xl text-blue-600">Game Lobby</h2>
						<p className="text-muted-foreground">
							Add players and configure your game
						</p>
						Code: {roomCode}
					</div>
				</div>

				<div className="grid w-full gap-8">
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
							{isHost ? (
								<Button
									onClick={handleStartGame}
									disabled={gameState.players.length < 2}
									size="lg"
									className="bg-blue-500 px-8 hover:bg-blue-600"
								>
									<Play className="mr-2 h-5 w-5" />
									Start Game
								</Button>
							) : (
								<Button
									size="lg"
									className="bg-gray-500 px-8 hover:bg-gray-600"
									onClick={() => setIsReady(true)}
									disabled={isReady}
								>
									{isReady ? (
										<>
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											Ready
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-5 w-5" />
											Ready
										</>
									)}
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
