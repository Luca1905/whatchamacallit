export type GamePhase = "waiting" | "answering" | "guessing" | "revealing";

export interface Player {
	id: string;
	name: string;
	score: number;
	isDoctor: boolean;
	avatar: string;
}

export interface Answer {
	id: string;
	playerId: string;
	playerName: string;
	answer: string;
	isDoctor: boolean;
}

export interface RoundState {
	currentRound: number;
	totalRounds: number;
	currentPrompt: string;
	answers: Answer[];
	selectedAnswer: string | null;
}

export interface GameState {
	players: Player[];
	roundState: RoundState;
	gamePhase: GamePhase;
}

export interface GameError {
	code:
		| "INVALID_STATE_TRANSITION"
		| "INVALID_PLAYER_COUNT"
		| "INVALID_ANSWER"
		| "GAME_OVER";
	message: string;
}

export type GameActionResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: GameError;
	  };
