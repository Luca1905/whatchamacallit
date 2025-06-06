"use client";

import { avatarColors, prompts } from "@/lib/game-data";
import type { Answer, GameState, Player } from "@/lib/game-types";
import { type ReactNode, createContext, useContext, useState } from "react";

interface GameContextType {
	gameState: GameState;
	addPlayer: (name: string) => void;
	removePlayer: (playerId: string) => void;
	startGame: () => void;
	submitAnswer: (answer: string) => void;
	selectAnswer: (answer: string) => void;
	revealAnswers: () => void;
	nextRound: () => void;
	resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
	const [gameState, setGameState] = useState<GameState>({
		players: [],
		currentRound: 0,
		totalRounds: 5,
		currentPrompt: "",
		answers: [],
		selectedAnswer: null,
		gamePhase: "waiting",
	});

	const addPlayer = (name: string) => {
		if (name.trim() && gameState.players.length < 8) {
			const newPlayer: Player = {
				id: Date.now().toString(),
				name: name.trim(),
				score: 0,
				isDoctor: gameState.players.length === 0,
				avatar: avatarColors[gameState.players.length % avatarColors.length],
			};
			setGameState((prev) => ({
				...prev,
				players: [...prev.players, newPlayer],
			}));
		}
	};

	const removePlayer = (playerId: string) => {
		setGameState((prev) => ({
			...prev,
			players: prev.players.filter((p) => p.id !== playerId),
		}));
	};

	const startGame = () => {
		if (gameState.players.length >= 2) {
			setGameState((prev) => ({
				...prev,
				currentPrompt: prompts[Math.floor(Math.random() * prompts.length)],
				currentRound: 1,
				gamePhase: "answering",
			}));
		}
	};

	const submitAnswer = (playerAnswer: string) => {
		if (playerAnswer.trim()) {
			const doctorPlayer = gameState.players.find((p) => p.isDoctor);
			const doctorAnswer = `${playerAnswer} (but with extra mystery!)`;

			const allAnswers: Answer[] = [
				{
					playerId: "player",
					playerName: "You",
					answer: playerAnswer,
					isDoctor: false,
				},
				{
					playerId: doctorPlayer?.id || "",
					playerName: doctorPlayer?.name || "Dr. Whatchamacallit",
					answer: doctorAnswer,
					isDoctor: true,
				},
				// Add some AI-generated fake answers for variety
				{
					playerId: "ai1",
					playerName: "Mystery Player",
					answer: "chocolate-covered pickles",
					isDoctor: false,
				},
				{
					playerId: "ai2",
					playerName: "Mystery Player",
					answer: "my neighbor's lawn gnome",
					isDoctor: false,
				},
			];

			// Shuffle answers
			const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

			setGameState((prev) => ({
				...prev,
				answers: shuffledAnswers,
				gamePhase: "guessing",
			}));
		}
	};

	const selectAnswer = (answer: string) => {
		setGameState((prev) => ({
			...prev,
			selectedAnswer: answer,
		}));
	};

	const revealAnswers = () => {
		setGameState((prev) => ({
			...prev,
			gamePhase: "revealing",
		}));
	};

	const nextRound = () => {
		// Award points logic would go here
		const correctAnswer = gameState.answers.find((a) => a.isDoctor)?.answer;

		if (gameState.selectedAnswer === correctAnswer) {
			// Update player scores
			setGameState((prev) => ({
				...prev,
				players: prev.players.map((player) =>
					player.id === "player"
						? { ...player, score: player.score + 10 }
						: player,
				),
			}));
		}

		if (gameState.currentRound >= gameState.totalRounds) {
			return;
		}

		const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
		setGameState((prev) => ({
			...prev,
			currentPrompt: newPrompt,
			currentRound: prev.currentRound + 1,
			answers: [],
			selectedAnswer: null,
			gamePhase: "answering",
		}));
	};

	const resetGame = () => {
		setGameState({
			players: gameState.players,
			currentRound: 0,
			totalRounds: 5,
			currentPrompt: "",
			answers: [],
			selectedAnswer: null,
			gamePhase: "waiting",
		});
	};

	return (
		<GameContext.Provider
			value={{
				gameState,
				addPlayer,
				removePlayer,
				startGame,
				submitAnswer,
				selectAnswer,
				revealAnswers,
				nextRound,
				resetGame,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}

export function useGameContext() {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
}
