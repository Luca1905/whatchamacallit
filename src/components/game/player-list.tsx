"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/game-context";
import { Crown } from "lucide-react";

export default function PlayerList() {
	const { gameState, removePlayer } = useGameContext();

	return (
		<div className="max-h-64 space-y-3 overflow-y-auto">
			{gameState.players.map((player: any, index: number) => (
				<div
					key={player.id}
					className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
				>
					<div className="flex items-center gap-3">
						<Avatar className={`${player.avatar} text-white`}>
							<AvatarFallback className="bg-inherit">
								{player.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center gap-2 font-semibold">
								{player.name}
								{player.isDoctor && (
									<Badge variant="secondary" className="text-xs">
										<Crown className="mr-1 h-3 w-3" />
										Dr.
									</Badge>
								)}
							</div>
							<div className="text-muted-foreground text-sm">
								Player {index + 1}
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => removePlayer(player.id)}
						className="text-red-500 hover:bg-red-50 hover:text-red-700"
					>
						Remove
					</Button>
				</div>
			))}

			{gameState.players.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					No players added yet. Add some players to get started!
				</div>
			)}
		</div>
	);
}
