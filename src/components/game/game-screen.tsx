"use client";

import AnswersList from "@/components/game/answers-list";
import PlayerScoreCards from "@/components/game/player-score-cards";
import PromptCard from "@/components/game/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { Crown, Send, Shuffle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GameScreen() {
	const router = useRouter();
	const { gameState, submitAnswer, revealAnswers, nextRound } =
		useGameContext();
	const [playerAnswer, setPlayerAnswer] = useState("");

	const handleSubmitAnswer = () => {
		if (playerAnswer.trim()) {
			submitAnswer(playerAnswer);
			setPlayerAnswer("");
		}
	};

	const handleNextRound = () => {
		nextRound();
		if (gameState.roundState.currentRound >= gameState.roundState.totalRounds) {
			router.push("/game/results");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="flex items-center gap-2 font-bold text-3xl text-green-600">
							<Star className="h-8 w-8" />
							Round {gameState.roundState.currentRound} of{" "}
							{gameState.roundState.totalRounds}
						</h2>
						<Progress
							value={
								(gameState.roundState.currentRound /
									gameState.roundState.totalRounds) *
								100
							}
							className="mt-2 w-64"
						/>
					</div>

					<PlayerScoreCards />
				</div>

				{/* Current Prompt */}
				<PromptCard prompt={gameState.roundState.currentPrompt} />

				{/* Game Phase Content */}
				{gameState.gamePhase === "answering" && (
					<Card className="border-0 shadow-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Send className="h-5 w-5" />
								Your Creative Answer
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-4">
								<Input
									placeholder="Replace 'whatchamacallit' with your creative answer..."
									value={playerAnswer}
									onChange={(e: any) => setPlayerAnswer(e.target.value)}
									className="p-4 text-lg"
									onKeyDown={(e: any) => e.key === "Enter" && handleSubmitAnswer()}
								/>
								<Button
									onClick={handleSubmitAnswer}
									disabled={!playerAnswer.trim()}
									size="lg"
									className="bg-green-500 px-8 hover:bg-green-600"
								>
									<Send className="mr-2 h-5 w-5" />
									Submit
								</Button>
							</div>
							<p className="text-muted-foreground text-sm">
								Be creative! The funnier, the better. Other players will try to
								guess which answer came from Dr. Whatchamacallit.
							</p>
						</CardContent>
					</Card>
				)}

				{gameState.gamePhase === "guessing" && (
					<Card className="border-0 shadow-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Crown className="h-5 w-5" />
								Which answer is from Dr. Whatchamacallit?
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<AnswersList />

							<Separator />

							<div className="flex justify-center">
								<Button
									onClick={revealAnswers}
									disabled={!gameState.roundState.selectedAnswer}
									size="lg"
									className="bg-blue-500 px-8 hover:bg-blue-600"
								>
									Reveal Answers
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{gameState.gamePhase === "revealing" && (
					<Card className="border-0 shadow-xl">
						<CardHeader>
							<CardTitle className="text-center">Round Results!</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4">
								{gameState.roundState.answers.map((answer: any, index: number) => (
									<div
										key={answer.id}
										className={`rounded-lg border-2 p-4 ${
											answer.isDoctor
												? "border-yellow-400 bg-yellow-50"
												: "border-gray-200 bg-gray-50"
										}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<Badge
													variant={answer.isDoctor ? "default" : "secondary"}
												>
													{String.fromCharCode(65 + index)}
												</Badge>
												<span className="font-medium">{answer.answer}</span>
											</div>
											<div className="flex items-center gap-2">
												{answer.isDoctor && (
													<Crown className="h-4 w-4 text-yellow-600" />
												)}
												<span className="text-muted-foreground text-sm">
													{answer.isDoctor
														? "Dr. Whatchamacallit"
														: answer.playerName}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>

							<Separator />

							<div className="text-center">
								<p className="mb-4 text-lg">
									{gameState.roundState.selectedAnswer ===
									gameState.roundState.answers.find((a: any) => a.isDoctor)?.answer
										? "🎉 Correct! You found Dr. Whatchamacallit's answer!"
										: "❌ Wrong guess! Better luck next round!"}
								</p>
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
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
