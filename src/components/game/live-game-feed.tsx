"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/game-context";
import type { Player } from "@/lib/game-types";
import { Crown, Send, Star, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface GameEvent {
	id: string;
	type:
		| "player_joined"
		| "answer_submitted"
		| "phase_changed"
		| "round_started"
		| "score_awarded";
	message: string;
	player?: Player;
	timestamp: Date;
	data?: any;
}

export default function LiveGameFeed() {
	const { gameState, roomCode } = useGameContext();
	const [events, setEvents] = useState([] as GameEvent[]);
	const [isExpanded, setIsExpanded] = useState(false);

	// Generate events based on game state changes
	useEffect(() => {
		const newEvents: GameEvent[] = [];

		// Phase change events
		if (gameState.gamePhase !== "waiting") {
			newEvents.push({
				id: `phase-${Date.now()}`,
				type: "phase_changed" as const,
				message: `Game entered ${gameState.gamePhase} phase`,
				timestamp: new Date(),
				data: { phase: gameState.gamePhase },
			});
		}

		// Round progression events
		if (gameState.roundState.currentRound > 0) {
			newEvents.push({
				id: `round-${gameState.roundState.currentRound}`,
				type: "round_started" as const,
				message: `Round ${gameState.roundState.currentRound} started`,
				timestamp: new Date(),
				data: { round: gameState.roundState.currentRound },
			});
		}

		// Answer submission events (simulated based on current answers)
		gameState.roundState.answers.forEach((answer: any) => {
			const player = gameState.players.find(
				(p: Player) => p.id === answer.playerId,
			);
			if (player) {
				newEvents.push({
					id: `answer-${answer.playerId}-${gameState.roundState.currentRound}`,
					type: "answer_submitted" as const,
					message: `${player.name} submitted their answer`,
					player,
					timestamp: new Date(),
					data: { round: gameState.roundState.currentRound },
				});
			}
		});

		// Player join events
		gameState.players.forEach((player: Player) => {
			newEvents.push({
				id: `join-${player.id}`,
				type: "player_joined" as const,
				message: `${player.name} joined the game`,
				player,
				timestamp: new Date(),
			});
		});

		// Keep only recent events and avoid duplicates
		if (newEvents.length > 0) {
			setEvents((prevEvents: GameEvent[]) => {
				const existingIds = new Set(prevEvents.map((e: GameEvent) => e.id));
				const uniqueNewEvents = newEvents.filter(
					(e: GameEvent) => !existingIds.has(e.id),
				);

				const allEvents = [...prevEvents, ...uniqueNewEvents]
					.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
					.slice(0, 20); // Keep last 20 events

				return allEvents;
			});
		}
	}, [gameState.gamePhase, gameState.roundState, gameState.players]);

	const getEventIcon = (type: GameEvent["type"]) => {
		switch (type) {
			case "player_joined":
				return Users;
			case "answer_submitted":
				return Send;
			case "phase_changed":
				return Star;
			case "round_started":
				return Trophy;
			case "score_awarded":
				return Crown;
			default:
				return Star;
		}
	};

	const getEventColor = (type: GameEvent["type"]) => {
		switch (type) {
			case "player_joined":
				return "text-green-600";
			case "answer_submitted":
				return "text-blue-600";
			case "phase_changed":
				return "text-purple-600";
			case "round_started":
				return "text-orange-600";
			case "score_awarded":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	};

	const formatTimestamp = (timestamp: Date) => {
		return timestamp.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	if (!roomCode) return null;

	const displayEvents = isExpanded ? events : events.slice(0, 5);

	return (
		<Card className="border-0 shadow-lg">
			<CardHeader
				className="cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Star className="h-5 w-5 text-blue-500" />
						Live Game Feed
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className="text-xs">
							{events.length} events
						</Badge>
						<span className="text-gray-500 text-xs">
							{isExpanded ? "Click to collapse" : "Click to expand"}
						</span>
					</div>
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-3">
				{displayEvents.length === 0 ? (
					<div className="py-4 text-center text-gray-500">
						<Star className="mx-auto mb-2 h-8 w-8 opacity-50" />
						<p className="text-sm">No recent activity</p>
					</div>
				) : (
					<>
						{displayEvents.map((event: GameEvent) => {
							const Icon = getEventIcon(event.type);
							const colorClass = getEventColor(event.type);

							return (
								<div
									key={event.id}
									className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
								>
									{/* Event icon */}
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${colorClass} border-current`}
									>
										<Icon className="h-4 w-4" />
									</div>

									{/* Event content */}
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between">
											<p className="truncate font-medium text-gray-900 text-sm">
												{event.message}
											</p>
											<span className="ml-2 text-gray-500 text-xs">
												{formatTimestamp(event.timestamp)}
											</span>
										</div>

										{/* Player info if available */}
										{event.player && (
											<div className="mt-1 flex items-center gap-2">
												<div
													className={`h-4 w-4 rounded-full ${event.player.avatar} flex-shrink-0`}
												/>
												<span className="text-gray-600 text-xs">
													{event.player.name}
												</span>
												{event.player.isDoctor && (
													<Crown className="h-3 w-3 text-yellow-500" />
												)}
											</div>
										)}

										{/* Additional event data */}
										{event.data && (
											<div className="mt-1">
												{event.data.phase && (
													<Badge variant="outline" className="text-xs">
														{event.data.phase}
													</Badge>
												)}
												{event.data.round && (
													<Badge variant="outline" className="text-xs">
														Round {event.data.round}
													</Badge>
												)}
											</div>
										)}
									</div>
								</div>
							);
						})}

						{/* Show more indicator */}
						{!isExpanded && events.length > 5 && (
							<div className="pt-2 text-center">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setIsExpanded(true);
									}}
									className="text-blue-600 text-xs hover:text-blue-700 hover:underline"
								>
									Show {events.length - 5} more events...
								</button>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
