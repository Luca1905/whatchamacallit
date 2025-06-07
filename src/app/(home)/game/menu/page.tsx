"use client";

import MenuScreen from "@/components/game/menu-screen";
import { useRouter } from "next/navigation";

export default function MenuPage() {
	const router = useRouter();

	const handleNavigate = (screen: string) => {
		router.push(`/game/${screen}`);
	};

	return <MenuScreen onNavigate={handleNavigate} />;
}
