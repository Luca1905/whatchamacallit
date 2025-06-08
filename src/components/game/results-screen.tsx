"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import { Crown, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResultsScreen() {
	const router = useRouter();
	const { gameState, resetGame } = useGameContext();

	const handlePlayAgain = () => {
		resetGame();
		router.push("/game/lobby");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6">
			<div className="mx-auto max-w-4xl text-center">
				<div className="mb-8">
					<Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
					<h2 className="mb-2 font-bold text-4xl text-purple-600">
						Game Complete!
					</h2>
					<p className="text-muted-foreground text-xl">
						Here are the final results
					</p>
				</div>

				<Card className="mb-8 border-0 shadow-xl">
					<CardHeader>
						<CardTitle>Final Scores</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{gameState.players
								.sort((a, b) => b.score - a.score)
								.map((player, index) => (
									<div
										key={player.id}
										className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
									>
										<div className="flex items-center gap-4">
											<Badge
												variant={index === 0 ? "default" : "secondary"}
												className="px-3 py-1 text-lg"
											>
												#{index + 1}
											</Badge>
											<Avatar className={`${player.avatar} text-white`}>
												<AvatarFallback className="bg-inherit">
													{player.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="font-semibold text-lg">
												{player.name}
											</span>
											{index === 0 && (
												<Crown className="h-5 w-5 text-yellow-500" />
											)}
										</div>
										<div className="font-bold text-2xl">{player.score}</div>
									</div>
								))}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-center gap-4">
					<Button onClick={handlePlayAgain} size="lg" variant="outline">
						Play Again
					</Button>
					<Button
						onClick={() => router.push("/game/lobby")}
						size="lg"
						className="bg-purple-500 hover:bg-purple-600"
					>
						Back to Menu
					</Button>
				</div>
			</div>
		</div>
	);
}
