"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/context/game-context";
import { api } from "convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetupScreen() {
	const router = useRouter();
	const { roomCode, createRoom, joinRoom } = useGameContext();
	const [joinId, setJoinId] = useState("");
	const player = useQuery(api.user.getPlayer);
	const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

	useEffect(() => {
		if (roomCode) {
			router.push("/game/lobby");
		}
	}, [roomCode, router]);

	if (isAuthLoading || player === undefined) {
		return (
			<div className="flex min-h-screen items-center justify-center p-6">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
					<p className="mt-4 text-blue-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || player === null) {
		redirect("/game/setup/username");
	}

	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-md text-center">
				<h2 className="font-bold text-4xl text-primary">Multiplayer Lobby</h2>
				<div className="mt-8 space-y-4">
					<Button onClick={createRoom} size="lg" className="w-full">
						Create Room
					</Button>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
					</div>
					<div className="space-y-4">
						<Input
							placeholder="Enter room code..."
							value={joinId}
							onChange={(e: any) => setJoinId(e.target.value)}
							onKeyDown={(e: any) => e.key === "Enter" && joinRoom(joinId)}
						/>
						<Button onClick={() => joinRoom(joinId)} disabled={!joinId.trim()}>
							Join Room
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
