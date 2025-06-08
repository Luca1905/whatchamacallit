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
	const [selectedAnswerId, setSelectedAnswerId] = useState(
		null as string | null,
	);
	const [hoveredAnswerId, setHoveredAnswerId] = useState(null as string | null);

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

				{/* Reveal instructions */}
				{isRevealingPhase && (
					<div className="rounded-lg border border-green-200 bg-green-50 p-3">
						<p className="font-medium text-green-700 text-sm">
							🏆 Results are in! Here's how everyone did.
						</p>
					</div>
				)}

				{/* Answer cards */}
				<div className="grid gap-4">
					{answers.map((answer: Answer, index: number) => (
						<div
							key={answer.id}
							className={getAnswerStyle(answer)}
							onClick={() => handleAnswerSelect(answer)}
							onMouseEnter={() => setHoveredAnswerId(answer.id)}
							onMouseLeave={() => setHoveredAnswerId(null)}
						>
							<div className="flex items-center justify-between">
								<Badge variant={answer.isDoctor ? "default" : "secondary"}>
									{String.fromCharCode(65 + index)}
								</Badge>
								<span className="font-medium">{answer.answer}</span>
							</div>
							{isRevealingPhase && (
								<div className="mt-2 flex items-center justify-between text-muted-foreground text-sm">
									{answer.isDoctor ? (
										<div className="flex items-center gap-2">
											<Crown className="h-4 w-4 text-yellow-500" />
											Dr. Whatchamacallit
										</div>
									) : (
										<span>{answer.playerName}</span>
									)}
								</div>
							)}
						</div>
					))}
				</div>

				{/* Reveal button */}
				{isGuessingPhase && (
					<div className="flex justify-center pt-4">
						<Button
							onClick={handleRevealAnswers}
							disabled={!selectedAnswerId}
							size="lg"
							className="bg-accent text-accent-foreground hover:bg-accent/90"
						>
							Reveal Answers
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
