"use client";

import SetupScreen from "@/components/game/setup-screen";
import { useRouter } from "next/navigation";

export default function SetupPage() {
	const router = useRouter();

	const handleNavigate = (screen: string) => {
		router.push(`/game/${screen}`);
	};

	return <SetupScreen onNavigate={handleNavigate} />;
}
