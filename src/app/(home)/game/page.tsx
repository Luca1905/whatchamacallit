"use client";

import { GameProvider } from "@/context/game-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamePage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to menu by default
		router.push("/game/menu");
	}, [router]);

	return null;
}
