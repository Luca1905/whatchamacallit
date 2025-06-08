"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/context/game-context";
import { Crown, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface AnswerState {
	text: string;
	isSubmitting: boolean;
	isSubmitted: boolean;
	error: string | null;
}

export default function EnhancedAnswerInput() {
	const { gameState, submitAnswer } = useGameContext();
	const [answerState, setAnswerState] = useState({
		text: "",
		isSubmitting: false,
		isSubmitted: false,
		error: null,
	});

	const [timeLeft, setTimeLeft] = useState(60); // 60 second timer
	const [charactersTyped, setCharactersTyped] = useState(0);

	// Timer countdown
	useEffect(() => {
		if (
			gameState.gamePhase === "answering" &&
			timeLeft > 0 &&
			!answerState.isSubmitted
		) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [gameState.gamePhase, timeLeft, answerState.isSubmitted]);

	// Reset state when game phase changes
	useEffect(() => {
		if (gameState.gamePhase !== "answering") {
			setAnswerState({
				text: "",
				isSubmitting: false,
				isSubmitted: false,
				error: null,
			});
			setTimeLeft(60);
		}
	}, [gameState.gamePhase]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setAnswerState((prev: AnswerState) => ({
			...prev,
			text: value,
			error: null,
		}));
		setCharactersTyped(value.length);
	};

	const handleSubmit = async () => {
		if (!answerState.text.trim()) {
			setAnswerState((prev: AnswerState) => ({
				...prev,
				error: "Please enter an answer",
			}));
			return;
		}

		setAnswerState((prev: AnswerState) => ({
			...prev,
			isSubmitting: true,
			error: null,
		}));

		try {
			await submitAnswer(answerState.text);
			setAnswerState((prev: AnswerState) => ({
				...prev,
				isSubmitting: false,
				isSubmitted: true,
			}));
		} catch (error) {
			setAnswerState((prev: AnswerState) => ({
				...prev,
				isSubmitting: false,
				error: "Failed to submit answer. Please try again.",
			}));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !answerState.isSubmitting) {
			handleSubmit();
		}
	};

	if (gameState.gamePhase !== "answering") return null;

	return (
		<Card className="border-0 shadow-xl">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Send className="h-5 w-5" />
						Your Creative Answer
					</div>

					{/* Timer and character count */}
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Characters:</span>
							<span
								className={
									charactersTyped > 100 ? "text-orange-500" : "text-gray-600"
								}
							>
								{charactersTyped}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Time:</span>
							<span
								className={
									timeLeft < 20 ? "font-bold text-red-500" : "text-gray-600"
								}
							>
								{Math.floor(timeLeft / 60)}:
								{(timeLeft % 60).toString().padStart(2, "0")}
							</span>
						</div>
					</div>
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Time progress bar */}
				<Progress value={((60 - timeLeft) / 60) * 100} className="h-2" />

				{answerState.isSubmitted ? (
					<div className="flex items-center justify-center p-8 text-center">
						<div className="space-y-3">
							<Crown className="mx-auto h-12 w-12 text-green-500" />
							<h3 className="font-medium text-green-700 text-lg">
								Answer Submitted!
							</h3>
							<p className="text-muted-foreground">
								Waiting for other players to finish...
							</p>
							<div className="mt-4 flex items-center justify-center gap-2">
								<div className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
								<span className="text-gray-600 text-sm">
									{gameState.players.length -
										gameState.roundState.answers.length}{" "}
									players remaining
								</span>
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="flex gap-4">
							<Input
								placeholder="Replace 'whatchamacallit' with your creative answer..."
								value={answerState.text}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								className="p-4 text-lg"
								disabled={answerState.isSubmitting || timeLeft === 0}
							/>
							<Button
								onClick={handleSubmit}
								disabled={
									!answerState.text.trim() ||
									answerState.isSubmitting ||
									timeLeft === 0
								}
								size="lg"
								className="bg-green-500 px-8 hover:bg-green-600 disabled:opacity-50"
							>
								{answerState.isSubmitting ? (
									<div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
								) : (
									<Send className="mr-2 h-5 w-5" />
								)}
								{answerState.isSubmitting ? "Submitting..." : "Submit"}
							</Button>
						</div>

						{answerState.error && (
							<div className="mt-2 text-red-500 text-sm">
								{answerState.error}
							</div>
						)}

						<p className="text-muted-foreground text-sm">
							Be creative! The funnier, the better. Other players will try to
							guess which answer came from Dr. Whatchamacallit.
						</p>

						{timeLeft < 20 && (
							<div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
								<p className="font-medium text-orange-700 text-sm">
									⏰ Time is running out! Submit your answer soon.
								</p>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
