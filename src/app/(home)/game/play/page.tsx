"use client";

import GameScreen from "@/components/game/game-screen";
import { useRouter } from "next/navigation";

export default function GamePlayPage() {
	const router = useRouter();

	const handleNavigate = (screen: string) => {
		router.push(`/game/${screen}`);
	};

	return <GameScreen onNavigate={handleNavigate} />;
}
