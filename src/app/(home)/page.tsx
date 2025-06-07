"use client";

import GameScreen from "@/components/game/game-screen";
import MenuScreen from "@/components/game/menu-screen";
import ResultsScreen from "@/components/game/results-screen";
import SetupScreen from "@/components/game/setup-screen";
import { Button } from "@/components/ui/button";
import { GameProvider } from "@/context/game-context";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const [currentScreen, setCurrentScreen] = useState<
		"menu" | "setup" | "game" | "results"
	>("menu");
	const { isAuthenticated } = useConvexAuth();
	const router = useRouter();

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isAuthenticated) {
			router.push("/posts");
		} else {
			router.push("/sign-in");
		}
	};

	return (
		<>
			<div className="relative z-10 space-y-8">
				<h1 className="overflow-visible bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-extrabold text-7xl text-transparent tracking-tight sm:text-8xl md:text-9xl">
					whatchamacallit
				</h1>
				<Link href="/game">
					<Button>Play Game</Button>
				</Link>
			</div>
		</>
	);
}
