"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UsernameSetup() {
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const createPlayer = useMutation(api.user.createPlayer);
	const player = useQuery(api.user.getPlayer);
	const router = useRouter();

	// If player already exists, redirect to setup
	useEffect(() => {
		if (player) {
			router.push("/game/setup");
		}
	}, [player, router]);

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (!username.trim()) return;

		setIsLoading(true);
		try {
			const { existing, playerId } = await createPlayer({
				username: username.trim(),
			});
			console.log("created player id: ", playerId);
			// Don't redirect here - let the useEffect handle it when player is loaded
		} catch (error) {
			console.error("Failed to create player:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="relative z-10 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
			<div className="mx-auto max-w-md text-center">
				<h2 className="mb-8 font-bold text-4xl text-blue-600">
					Choose Your Username
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						placeholder="Enter your username..."
						value={username}
						onChange={(e: any) => setUsername(e.target.value)}
						className="text-center text-lg"
						maxLength={20}
					/>
					<Button
						type="submit"
						size="lg"
						className="w-full bg-blue-500 hover:bg-blue-600"
						disabled={!username.trim() || isLoading}
					>
						{isLoading ? "Creating..." : "Continue"}
					</Button>
				</form>
			</div>
		</div>
	);
}
