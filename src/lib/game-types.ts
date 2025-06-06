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

export interface GameState {
	players: Player[];
	currentRound: number;
	totalRounds: number;
	currentPrompt: string;
	answers: Answer[];
	selectedAnswer: string | null;
	gamePhase: "waiting" | "answering" | "guessing" | "revealing";
}
