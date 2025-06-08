"use client";

import MenuScreen from "@/components/game/menu-screen";
import { useConvexAuth } from "convex/react";
import { redirect, useRouter } from "next/navigation";

export default function MenuPage() {
	const router = useRouter();
	const { isAuthenticated } = useConvexAuth();

	const handleNavigate = (screen: string) => {
		router.push(`/game/${screen}`);
	};

	if (!isAuthenticated) {
		redirect("/sign-in");
	}
	console.log("user authenticated");

	return <MenuScreen onNavigate={handleNavigate} />;
}
