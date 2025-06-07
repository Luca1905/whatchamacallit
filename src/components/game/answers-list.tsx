"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/game-context";
import { useEffect } from "react";

export default function AnswersList() {
	const { gameState, selectAnswer } = useGameContext();

	// Keyboard shortcut: press A, B, C, D keys to select answers
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			const key = e.key.toUpperCase();
			const index = key.charCodeAt(0) - 65;
			if (index >= 0 && index < gameState.roundState.answers.length) {
				const ans = gameState.roundState.answers[index];
				if (ans) selectAnswer(ans.answer);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameState.roundState.answers, selectAnswer]);

	return (
		<div className="grid gap-3">
			{gameState.roundState.answers.map((answer, index) => (
				<Button
					key={answer.id}
					variant={
						gameState.roundState.selectedAnswer === answer.answer
							? "default"
							: "outline"
					}
					onClick={() => selectAnswer(answer.answer)}
					className="h-auto justify-start p-6 text-left text-lg transition-transform hover:scale-[1.02]"
				>
					<div className="flex items-center gap-3">
						<Badge variant="secondary">{String.fromCharCode(65 + index)}</Badge>
						<span>{answer.answer}</span>
					</div>
				</Button>
			))}
		</div>
	);
}
