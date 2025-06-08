"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	UserProfile,
} from "@clerk/nextjs";
import { Gamepad2, Play, Settings, Trophy, Users } from "lucide-react";

interface MenuScreenProps {
	onNavigate: (screen: "menu" | "setup" | "play" | "results") => void;
}

export default function MenuScreen({ onNavigate }: MenuScreenProps) {
	return (
		<div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
			<div className="mb-12 space-y-4 text-center">
				<div className="mb-6 flex items-center justify-center gap-3">
					<Gamepad2 className="h-12 w-12 text-primary" />
					<h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text font-bold text-7xl text-transparent">
						Whatchamacallit
					</h1>
				</div>
				<p className="max-w-2xl text-muted-foreground text-xl leading-relaxed">
					The hilarious party game where creativity meets comedy! Fill in the
					blanks and guess the answers.
				</p>
				<Badge variant="secondary" className="px-4 py-2 text-sm">
					Nintendo Wii Style • Party Game
				</Badge>
			</div>

			<div className="grid w-full max-w-lg grid-cols-2 gap-6">
				<Card
					role="button"
					tabIndex={0}
					className="group cursor-pointer border-0 bg-gradient-to-br from-green-400 to-green-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400"
					onClick={() => onNavigate("setup")}
					onKeyDown={(e: any) =>
						(e.key === "Enter" || e.key === " ") && onNavigate("setup")
					}
				>
					<CardContent className="p-8 text-center text-white">
						<Play className="mx-auto mb-4 h-12 w-12 transition-transform group-hover:scale-110" />
						<CardTitle className="font-bold text-xl">Play Game</CardTitle>
						<p className="mt-2 text-green-100 text-sm">Start a new game</p>
					</CardContent>
				</Card>

				<Card className="group cursor-pointer border-0 bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
					<CardContent className="p-8 text-center text-white">
						<Settings className="mx-auto mb-4 h-12 w-12 transition-transform duration-300 group-hover:rotate-90" />
						<CardTitle className="font-bold text-xl">Settings</CardTitle>
						<p className="mt-2 text-purple-100 text-sm">Game options</p>
					</CardContent>
				</Card>

				<Card className="group cursor-pointer border-0 bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
					<CardContent className="p-8 text-center text-white">
						<Users className="mx-auto mb-4 h-12 w-12 transition-transform group-hover:scale-110" />
						<CardTitle className="font-bold text-xl">Players</CardTitle>
						<p className="mt-2 text-orange-100 text-sm">Manage players</p>
					</CardContent>
				</Card>

				<Card className="group cursor-pointer border-0 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
					<CardContent className="p-8 text-center text-white">
						<Trophy className="group-hover:bounce mx-auto mb-4 h-12 w-12 transition-transform" />
						<CardTitle className="font-bold text-xl">High Scores</CardTitle>
						<p className="mt-2 text-sm text-yellow-100">View records</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
