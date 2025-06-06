"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";

export default function PlayerScoreCards() {
	const { gameState } = useGameContext();

	return (
		<div className="flex gap-4">
			{gameState.players.slice(0, 4).map((player) => (
				<Card key={player.id} className="border-0 shadow-md">
					<CardContent className="p-4 text-center">
						<Avatar className={`${player.avatar} mx-auto mb-2 text-white`}>
							<AvatarFallback className="bg-inherit">
								{player.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="max-w-20 truncate font-semibold text-sm">
							{player.name}
						</div>
						<div className="font-bold text-2xl text-green-600">
							{player.score}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
