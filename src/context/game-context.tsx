"use client";

import { addPlayer, nextRound, startGame, submitAnswer } from "@/lib/game-service";
import type { GameState } from "@/lib/game-types";
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

const initialState: GameState = {
	players: [],
	roundState: {
		currentRound: 0,
		totalRounds: 5,
		currentPrompt: "",
		answers: [],
		selectedAnswer: null,
	},
	gamePhase: "waiting",
};

export function GameProvider({ children }: { children: ReactNode }) {
	const [gameState, setGameState] = useState<GameState>(initialState);

	const handleAddPlayer = (name: string) => {
		const result = addPlayer(gameState, name);
		if (result.success) {
			setGameState((prev) => ({
				...prev,
				players: [...prev.players, result.data],
			}));
		}
	};

	const removePlayer = (playerId: string) => {
		setGameState((prev) => ({
			...prev,
			players: prev.players.filter((p) => p.id !== playerId),
		}));
	};

	const handleStartGame = () => {
		const result = startGame(gameState);
		if (result.success) {
			setGameState(result.data);
		}
	};

	const handleSubmitAnswer = (playerAnswer: string) => {
		const result = submitAnswer(gameState, playerAnswer);
		if (result.success) {
			setGameState(result.data);
		}
	};

	const selectAnswer = (answer: string) => {
		setGameState((prev) => ({
			...prev,
			roundState: {
				...prev.roundState,
				selectedAnswer: answer,
			},
		}));
	};

	const revealAnswers = () => {
		setGameState((prev) => ({
			...prev,
			gamePhase: "revealing",
		}));
	};

	const handleNextRound = () => {
		const result = nextRound(gameState);
		if (result.success) {
			setGameState(result.data);
		}
	};

	const resetGame = () => {
		setGameState({
			...initialState,
			players: gameState.players,
		});
	};

	return (
		<GameContext.Provider
			value={{
				gameState,
				addPlayer: handleAddPlayer,
				removePlayer,
				startGame: handleStartGame,
				submitAnswer: handleSubmitAnswer,
				selectAnswer,
				revealAnswers,
				nextRound: handleNextRound,
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
