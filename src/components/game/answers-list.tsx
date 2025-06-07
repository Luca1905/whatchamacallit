"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/game-context";

export default function AnswersList() {
	const { gameState, selectAnswer } = useGameContext();

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
