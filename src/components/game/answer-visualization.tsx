"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Answer, Player } from "@/lib/game-types";
import { Crown, Send, Star, Trophy } from "lucide-react";
import { useState } from "react";

export default function AnswerVisualization() {
	const { gameState, selectAnswer, revealAnswers } = useGameContext();
	const [selectedAnswerId, setSelectedAnswerId] = useState(null);
	const [hoveredAnswerId, setHoveredAnswerId] = useState(null);

	// Don't show during non-relevant phases
	if (
		gameState.gamePhase !== "guessing" &&
		gameState.gamePhase !== "revealing"
	) {
		return null;
	}

	const answers = gameState.roundState.answers;
	const isGuessingPhase = gameState.gamePhase === "guessing";
	const isRevealingPhase = gameState.gamePhase === "revealing";

	const handleAnswerSelect = (answer: Answer) => {
		if (!isGuessingPhase) return;

		setSelectedAnswerId(answer.id);
		selectAnswer(answer.answer);
	};

	const handleRevealAnswers = async () => {
		if (!selectedAnswerId) return;
		await revealAnswers();
	};

	const getAnswerStyle = (answer: Answer) => {
		const isSelected = selectedAnswerId === answer.id;
		const isHovered = hoveredAnswerId === answer.id;
		const isDoctor = answer.isDoctor;

		const baseClasses =
			"p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer";

		if (isRevealingPhase && isDoctor) {
			return `${baseClasses} border-yellow-400 bg-yellow-50 shadow-lg transform scale-105`;
		}

		if (isRevealingPhase && isSelected && !isDoctor) {
			return `${baseClasses} border-red-300 bg-red-50`;
		}

		if (isRevealingPhase) {
			return `${baseClasses} border-gray-200 bg-gray-50`;
		}

		if (isSelected) {
			return `${baseClasses} border-blue-500 bg-blue-50 shadow-md transform scale-102`;
		}

		if (isHovered) {
			return `${baseClasses} border-blue-300 bg-blue-25 shadow-sm transform scale-101`;
		}

		return `${baseClasses} border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm`;
	};

	const doctorAnswer = answers.find((answer: Answer) => answer.isDoctor);
	const correctGuess =
		selectedAnswerId &&
		doctorAnswer &&
		answers.find((a: Answer) => a.id === selectedAnswerId)?.answer ===
			doctorAnswer.answer;

	return (
		<Card className="border-0 shadow-xl">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{isGuessingPhase ? (
							<>
								<Crown className="h-5 w-5 text-purple-500" />
								Which answer is from Dr. Whatchamacallit?
							</>
						) : (
							<>
								<Trophy className="h-5 w-5 text-green-500" />
								Round Results
							</>
						)}
					</div>

					{isGuessingPhase && (
						<Badge
							variant={selectedAnswerId ? "default" : "secondary"}
							className="text-sm"
						>
							{selectedAnswerId ? "Answer Selected" : "Select an Answer"}
						</Badge>
					)}

					{isRevealingPhase && (
						<Badge
							variant={correctGuess ? "default" : "destructive"}
							className="text-sm"
						>
							{correctGuess ? "Correct Guess!" : "Wrong Guess"}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Instructions */}
				{isGuessingPhase && (
					<div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
						<p className="font-medium text-purple-700 text-sm">
							🕵️ Detective Time! Click on the answer you think came from Dr.
							Whatchamacallit.
						</p>
					</div>
				)}

				{isRevealingPhase && (
					<div
						className={`rounded-lg border p-3 ${
							correctGuess
								? "border-green-200 bg-green-50"
								: "border-orange-200 bg-orange-50"
						}`}
					>
						<p
							className={`font-medium text-sm ${
								correctGuess ? "text-green-700" : "text-orange-700"
							}`}
						>
							{correctGuess
								? "🎉 Excellent detective work! You found Dr. Whatchamacallit's answer!"
								: "😅 Better luck next round! Dr. Whatchamacallit fooled you this time."}
						</p>
					</div>
				)}

				{/* Answers Grid */}
				<div className="grid gap-3">
					{answers.map((answer: Answer, index: number) => {
						const player = gameState.players.find(
							(p: Player) => p.id === answer.playerId,
						);

						return (
							<div
								key={answer.id}
								className={getAnswerStyle(answer)}
								onClick={() => handleAnswerSelect(answer)}
								onMouseEnter={() => setHoveredAnswerId(answer.id)}
								onMouseLeave={() => setHoveredAnswerId(null)}
							>
								<div className="flex items-center justify-between">
									{/* Answer content */}
									<div className="flex flex-1 items-center gap-3">
										<Badge
											variant={
												isRevealingPhase && answer.isDoctor
													? "default"
													: selectedAnswerId === answer.id
														? "default"
														: "secondary"
											}
											className={`${
												isRevealingPhase && answer.isDoctor
													? "bg-yellow-500 text-white"
													: ""
											}`}
										>
											{String.fromCharCode(65 + index)}
										</Badge>

										<span className="flex-1 font-medium text-gray-900">
											"{answer.answer}"
										</span>
									</div>

									{/* Answer metadata */}
									<div className="flex items-center gap-2">
										{/* Selection indicator */}
										{isGuessingPhase && selectedAnswerId === answer.id && (
											<div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
												<div className="h-2 w-2 rounded-full bg-white" />
											</div>
										)}

										{/* Doctor reveal */}
										{isRevealingPhase && answer.isDoctor && (
											<div className="flex items-center gap-1">
												<Crown className="h-4 w-4 text-yellow-600" />
												<span className="font-medium text-sm text-yellow-700">
													Dr. Whatchamacallit
												</span>
											</div>
										)}

										{/* Player reveal */}
										{isRevealingPhase && !answer.isDoctor && (
											<div className="flex items-center gap-2">
												{selectedAnswerId === answer.id && (
													<Badge variant="outline" className="text-xs">
														Your Guess
													</Badge>
												)}
												<span className="text-gray-600 text-sm">
													{player?.name || "Unknown Player"}
												</span>
											</div>
										)}

										{/* Player avatar for revealing phase */}
										{isRevealingPhase && player && (
											<div
												className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-white text-xs ${player.avatar}`}
											>
												{player.name.charAt(0).toUpperCase()}
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Action buttons */}
				{isGuessingPhase && (
					<div className="flex justify-center border-t pt-4">
						<Button
							onClick={handleRevealAnswers}
							disabled={!selectedAnswerId}
							size="lg"
							className="bg-purple-500 px-8 hover:bg-purple-600 disabled:opacity-50"
						>
							<Trophy className="mr-2 h-5 w-5" />
							Reveal the Truth!
						</Button>
					</div>
				)}

				{/* Statistics */}
				<div className="border-t pt-4">
					<div className="grid grid-cols-2 gap-4 text-center">
						<div>
							<div className="font-bold text-gray-900 text-lg">
								{answers.length}
							</div>
							<div className="text-gray-500 text-xs">Total Answers</div>
						</div>
						<div>
							<div className="font-bold text-gray-900 text-lg">
								{gameState.roundState.currentRound}
							</div>
							<div className="text-gray-500 text-xs">Current Round</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
