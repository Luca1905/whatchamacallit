"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/context/game-context";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
});
export default function SetupScreen() {
	const router = useRouter();
	const { roomCode, createRoom, joinRoom } = useGameContext();
	const player = useQuery(api.user.getPlayer);
	const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		const success = joinRoom(data.pin);
		if (!success) {
			form.setError("pin", {
				message: "Invalid room code",
			});
		}
	}

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
					<div className="flex w-full justify-center space-y-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-2/3 space-y-6"
							>
								<FormField
									control={form.control}
									name="pin"
									render={({ field }) => (
										<FormItem>
											<FormLabel>One-Time Password</FormLabel>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</FormControl>
											<FormDescription>
												Join a room by entering the room code.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Join Room</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
