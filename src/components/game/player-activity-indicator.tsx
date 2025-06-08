"use client";

import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/context/game-context";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Users } from "lucide-react";

export default function PlayerActivityIndicator() {
	const { gameState, roomCode } = useGameContext();
	const activities =
		useQuery(
			api.playerActivity.getPlayerActivities,
			gameState.gamePhase === "answering" && roomCode ? { roomCode } : "skip",
		) ?? [];

	if (!roomCode || activities.length === 0) return null;

	return (
		<div className="fixed bottom-4 left-4 z-40">
			<div className="rounded-lg border bg-white/90 p-3 shadow-lg backdrop-blur-sm">
				<div className="mb-2 flex items-center gap-2">
					<Users className="h-4 w-4 text-blue-500" />
					<span className="font-medium text-gray-700 text-sm">
						Player Activity
					</span>
				</div>

				<div className="space-y-1">
					{activities.map((activity) => {
						return (
							<div key={activity.playerId} className="flex items-center gap-2">
								<div className="flex items-center gap-1">
									<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
									<span className="text-gray-600 text-xs">
										{activity.playerName}
									</span>
								</div>
								<Badge variant="secondary" className="text-xs">
									typing...
								</Badge>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
