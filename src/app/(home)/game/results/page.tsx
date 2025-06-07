"use client";

import ResultsScreen from "@/components/game/results-screen";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
	const router = useRouter();

	const handleNavigate = (screen: string) => {
		router.push(`/game/${screen}`);
	};

	return <ResultsScreen onNavigate={handleNavigate} />;
}
