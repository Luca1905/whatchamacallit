"use client";

import AnswerSubmission from "@/components/game/answer-submission";
import GameStateDisplay from "@/components/game/game-state-display";
import MultiplayerPlayerList from "@/components/game/multiplayer-player-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/context/game-context";
import { Gamepad2, Star, Users } from "lucide-react";

export default function MultiplayerDemo() {
	const { gameState, roomCode, isReady } = useGameContext();

	if (!isReady || !roomCode) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
				<div className="mx-auto max-w-6xl">
					<Card className="border-0 shadow-lg">
						<CardContent className="p-12 text-center">
							<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
							<h2 className="mb-2 font-semibold text-gray-700 text-xl">
								Loading Multiplayer Components
							</h2>
							<p className="text-gray-500">
								Setting up real-time game state and Convex integration...
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<div className="mb-4 flex items-center justify-center gap-3">
						<Gamepad2 className="h-8 w-8 text-blue-600" />
						<h1 className="font-bold text-4xl text-gray-900">
							Multiplayer Game Components
						</h1>
					</div>
					<p className="mx-auto max-w-2xl text-gray-600 text-lg">
						Real-time UI components for multiplayer game state display and
						interaction through Convex
					</p>
					<div className="mt-4 flex items-center justify-center gap-4">
						<div className="flex items-center gap-2">
							<div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
							<span className="font-medium text-green-600 text-sm">
								Live Updates Active
							</span>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<span className="text-gray-500 text-sm">Room: {roomCode}</span>
						<Separator orientation="vertical" className="h-4" />
						<span className="text-gray-500 text-sm">
							Phase: {gameState.gamePhase}
						</span>
					</div>
				</div>

				{/* Component Grid Layout */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Column - Game State */}
					<div className="space-y-6 lg:col-span-1">
						<div>
							<h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 text-xl">
								<Star className="h-5 w-5 text-yellow-500" />
								Game State Display
							</h2>
							<GameStateDisplay />
						</div>

						<div>
							<h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 text-xl">
								<Users className="h-5 w-5 text-blue-500" />
								Player Management
							</h2>
							<MultiplayerPlayerList />
						</div>
					</div>

					{/* Right Columns - Game Interaction */}
					<div className="lg:col-span-2">
						<h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 text-xl">
							<Gamepad2 className="h-5 w-5 text-green-500" />
							Game Interaction
						</h2>

						{/* Answer Submission (shown during answering phase) */}
						<AnswerSubmission />

						{/* Component Information Card */}
						{gameState.gamePhase !== "answering" && (
							<Card className="border-0 shadow-lg">
								<CardHeader>
									<CardTitle>Real-Time Multiplayer Features</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div>
											<h3 className="mb-3 font-semibold text-gray-800">
												✨ Key Features
											</h3>
											<ul className="space-y-2 text-gray-600 text-sm">
												<li>
													• <strong>Real-time updates</strong> via Convex
												</li>
												<li>
													• <strong>Live player tracking</strong> and status
												</li>
												<li>
													• <strong>Instant game state sync</strong> across
													players
												</li>
												<li>
													• <strong>Responsive design</strong> for all devices
												</li>
												<li>
													• <strong>Professional animations</strong> and
													transitions
												</li>
												<li>
													• <strong>Error handling</strong> and loading states
												</li>
											</ul>
										</div>

										<div>
											<h3 className="mb-3 font-semibold text-gray-800">
												🎮 Components Included
											</h3>
											<ul className="space-y-2 text-gray-600 text-sm">
												<li>
													• <strong>GameStateDisplay</strong> - Live game
													information
												</li>
												<li>
													• <strong>MultiplayerPlayerList</strong> - Player
													management
												</li>
												<li>
													• <strong>AnswerSubmission</strong> - Real-time answer
													input
												</li>
												<li>
													• <strong>Real-time timers</strong> and progress bars
												</li>
												<li>
													• <strong>Live activity tracking</strong> per player
												</li>
												<li>
													• <strong>Instant feedback</strong> and notifications
												</li>
											</ul>
										</div>
									</div>

									<Separator />

									<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
										<h4 className="mb-2 font-medium text-blue-800">
											🚀 How to Use
										</h4>
										<p className="text-blue-700 text-sm">
											These components automatically sync with your Convex
											database. Simply include them in your game layout and
											they'll handle all real-time updates, player interactions,
											and state management. Perfect for multiplayer party games,
											trivia, and collaborative experiences.
										</p>
									</div>

									<div className="grid grid-cols-3 gap-4 text-center">
										<div>
											<div className="font-bold text-2xl text-blue-600">
												{gameState.players.length}
											</div>
											<div className="text-gray-500 text-xs">
												Connected Players
											</div>
										</div>
										<div>
											<div className="font-bold text-2xl text-green-600">
												{gameState.roundState.currentRound}
											</div>
											<div className="text-gray-500 text-xs">Current Round</div>
										</div>
										<div>
											<div className="font-bold text-2xl text-purple-600">
												{gameState.roundState.answers.length}
											</div>
											<div className="text-gray-500 text-xs">Submissions</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-12 text-center">
					<Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
						<CardContent className="p-6">
							<p className="mb-2 text-gray-600">
								🎉 <strong>Multiplayer components ready for production!</strong>
							</p>
							<p className="text-gray-500 text-sm">
								All components feature real-time Convex integration, responsive
								design, and professional animations.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
