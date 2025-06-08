"use client";

import MenuScreen from "@/components/game/menu-screen";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

export default function MenuPage() {
	const { isAuthenticated } = useConvexAuth();

	if (!isAuthenticated) {
		redirect("/sign-in");
	}
	console.log("user authenticated");

	return <MenuScreen />;
}
