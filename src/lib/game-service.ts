import { avatarColors, prompts } from "./game-data";
import type {
	GameActionResult,
	GameError,
	GamePhase,
	GameState,
	Player,
	RoundState,
} from "./game-types";

const validTransitions: Record<GamePhase, GamePhase[]> = {
	waiting: ["answering"],
	answering: ["guessing"],
	guessing: ["revealing"],
	revealing: ["answering", "waiting"],
};

function validateStateTransition(
	currentPhase: GamePhase,
	targetPhase: GamePhase,
): GameActionResult<void> {
	if (!validTransitions[currentPhase].includes(targetPhase)) {
		return {
			success: false,
			error: {
				code: "INVALID_STATE_TRANSITION",
				message: `Cannot transition from ${currentPhase} to ${targetPhase}`,
			},
		};
	}

	return { success: true, data: undefined };
}

export function addPlayer(
	state: GameState,
	name: string,
): GameActionResult<Player> {
	if (state.players.length >= 8) {
		return {
			success: false,
			error: {
				code: "INVALID_PLAYER_COUNT",
				message: "Maximum number of players reached",
			},
		};
	}

	const newPlayer: Player = {
		id: Date.now().toString(),
		name: name.trim(),
		score: 0,
		isDoctor: state.players.length === 0,
		avatar: avatarColors[state.players.length % avatarColors.length] || "",
	};

	return { success: true, data: newPlayer };
}

export function startGame(state: GameState): GameActionResult<GameState> {
	const transitionResult = validateStateTransition(
		state.gamePhase,
		"answering",
	);
	if (!transitionResult.success) return transitionResult;

	if (state.players.length < 2) {
		return {
			success: false,
			error: {
				code: "INVALID_PLAYER_COUNT",
				message: "Need at least 2 players to start the game",
			},
		};
	}

	const newRoundState: RoundState = {
		currentRound: 1,
		totalRounds: 5,
		currentPrompt: prompts[Math.floor(Math.random() * prompts.length)] || "",
		answers: [],
		selectedAnswer: null,
	};

	return {
		success: true,
		data: {
			...state,
			roundState: newRoundState,
			gamePhase: "answering",
		},
	};
}

export function submitAnswer(
	state: GameState,
	playerAnswer: string,
): GameActionResult<GameState> {
	const transitionResult = validateStateTransition(state.gamePhase, "guessing");
	if (!transitionResult.success) return transitionResult;

	if (!playerAnswer.trim()) {
		return {
			success: false,
			error: {
				code: "INVALID_ANSWER",
				message: "Answer cannot be empty",
			},
		};
	}

	const doctorPlayer = state.players.find((p) => p.isDoctor);
	if (!doctorPlayer) {
		return {
			success: false,
			error: {
				code: "INVALID_STATE_TRANSITION",
				message: "No doctor player found",
			},
		};
	}

	const doctorAnswer = `${playerAnswer} (but with extra mystery!)`;

	const allAnswers = [
		{
			id: "player",
			playerId: "player",
			playerName: "You",
			answer: playerAnswer,
			isDoctor: false,
		},
		{
			id: doctorPlayer.id,
			playerId: doctorPlayer.id,
			playerName: doctorPlayer.name,
			answer: doctorAnswer,
			isDoctor: true,
		},
		{
			id: "ai1",
			playerId: "ai1",
			playerName: "Mystery Player",
			answer: "chocolate-covered pickles",
			isDoctor: false,
		},
		{
			id: "ai2",
			playerId: "ai2",
			playerName: "Mystery Player",
			answer: "my neighbor's lawn gnome",
			isDoctor: false,
		},
	];

	const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

	return {
		success: true,
		data: {
			...state,
			roundState: {
				...state.roundState,
				answers: shuffledAnswers,
			},
			gamePhase: "guessing",
		},
	};
}

export function nextRound(state: GameState): GameActionResult<GameState> {
	if (state.roundState.currentRound >= state.roundState.totalRounds) {
		return {
			success: false,
			error: {
				code: "GAME_OVER",
				message: "Game is already complete",
			},
		};
	}

	const transitionResult = validateStateTransition(
		state.gamePhase,
		"answering",
	);
	if (!transitionResult.success) return transitionResult;

	const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
	const newRoundState: RoundState = {
		...state.roundState,
		currentRound: state.roundState.currentRound + 1,
		currentPrompt: newPrompt || "",
		answers: [],
		selectedAnswer: null,
	};

	return {
		success: true,
		data: {
			...state,
			roundState: newRoundState,
			gamePhase: "answering",
		},
	};
}
