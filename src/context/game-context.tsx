"use client";

import { api } from "@/convex/_generated/api";
import { avatarColors } from "@/lib/game-data";
import type { Answer, GamePhase, GameState, Player } from "@/lib/game-types";
import { useMutation, useQuery } from "convex/react";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

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
	roomCode: string | null;
	isReady: boolean;
	createRoom: () => void;
	joinRoom: (roomCode: string) => Promise<void>;
	setIsReady: (isReady: boolean) => void;
}

const GameContext = createContext(undefined as GameContextType | undefined);

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
	const [roomCode, setRoomCode] = useState(null as string | null);
	const [selectedAnswer, setSelectedAnswer] = useState(null as string | null);
	const backendState = useQuery(
		api.game.getGameState,
		roomCode ? { roomCode } : "skip",
	);

	const createRoom = useMutation(api.rooms.createRoom);
	const joinRoomMutation = useMutation(api.rooms.joinRoom);
	const startGameMutation = useMutation(api.game.startGame);
	const submitAnswerMutation = useMutation(api.game.submitAnswer);
	const selectAnswerMutation = useMutation(api.game.selectAnswer);
	const nextRoundMutation = useMutation(api.game.nextRound);

	// Derived gameState for UI
	const [isReady, setIsReady] = useState(false);

	const gameState: GameState = useMemo(() => {
		if (!backendState) return initialState;

		const players: Player[] = backendState.players.map(
			(p: any, idx: number) => ({
				id: p._id,
				name: p.username,
				score: p.score,
				isDoctor: p.isDoctor,
				avatar: p.avatar || avatarColors[idx % avatarColors.length],
			}),
		);

		let roundState = {
			currentRound: 0,
			totalRounds: 0,
			currentPrompt: "",
			answers: [] as Answer[],
			selectedAnswer: selectedAnswer,
		};
		if (backendState.roundState) {
			const answers: Answer[] = backendState.roundState.answers.map(
				(a: any) => ({
					id: a._id,
					playerId: a.playerId,
					playerName:
						players.find((pl) => pl.id === a.playerId)?.name || "Player",
					answer: a.answer,
					isDoctor: a.isDoctor,
				}),
			);

			roundState = {
				currentRound: backendState.roundState.currentRound,
				totalRounds: backendState.roundState.totalRounds,
				currentPrompt: backendState.roundState.currentPrompt,
				answers,
				selectedAnswer: selectedAnswer,
			};
		}

		return {
			players,
			roundState,
			gamePhase: backendState.gamePhase as GamePhase,
		};
	}, [backendState, selectedAnswer]);

	// Functions
	const addPlayer = (_name: string) => {
		// Managed by backend via joinRoom; no-op on client.
	};

	const removePlayer = (_playerId: string) => {
		// Not implemented yet.
	};

	const startGame = async () => {
		if (!roomCode) return;
		await startGameMutation({ roomCode, totalRounds: 5 });
	};

	const submitAnswer = async (answer: string) => {
		if (!roomCode) return;
		await submitAnswerMutation({ roomCode, answer });
	};

	const selectAnswer = (answer: string) => {
		setSelectedAnswer(answer);
	};

	const revealAnswers = async () => {
		if (!roomCode || !selectedAnswer) return;
		await selectAnswerMutation({ roomCode, selectedAnswer });
	};

	const nextRound = async () => {
		if (!roomCode) return;
		await nextRoundMutation({ roomCode });
	};

	const resetGame = () => {
		setSelectedAnswer(null);
	};

	const handleCreateRoom = async () => {
		try {
			const code = await createRoom();
			setRoomCode(String(code));
		} catch (e) {
			console.error(e);
		}
	};

	const handleJoinRoom = async (code: string) => {
		try {
			const success = await joinRoomMutation({ roomCode: code });
			if (success) {
				setRoomCode(code);
			} else {
				toast.error("Invalid room code", {
					description: "Please try again.",
				});
			}
		} catch (e) {
			console.error(e);
		}
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
				roomCode,
				isReady,
				setIsReady,
				createRoom: handleCreateRoom,
				joinRoom: handleJoinRoom,
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
