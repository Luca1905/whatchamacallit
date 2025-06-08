"use client";

import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useGameContext } from "@/context/game-context";

interface LoadingStateProps {
	message?: string;
	showPlayerSkeletons?: boolean;
}

export default function LoadingState({
	message = "Loading game state...",
	showPlayerSkeletons = false,
}: LoadingStateProps) {
	const { isReady } = useGameContext();

	if (isReady) return null;

	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-6xl">
				{/* Header skeleton */}
				<div className="mb-8 flex items-center justify-between">
					<div className="space-y-2">
						<div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
						<div className="h-4 w-64 animate-pulse rounded-md bg-gray-200" />
					</div>

					{showPlayerSkeletons && (
						<div className="flex gap-2">
							<div className="h-16 w-20 animate-pulse rounded-md bg-gray-200" />
							<div className="h-16 w-20 animate-pulse rounded-md bg-gray-200" />
							<div className="h-16 w-20 animate-pulse rounded-md bg-gray-200" />
						</div>
					)}
				</div>

				{/* Main content skeleton */}
				<Card className="border-0 shadow-xl">
					<CardContent className="space-y-6 p-6">
						<div className="text-center">
							<LoadingSpinner />
							<span className="font-medium text-gray-700 text-lg">
								{message}
							</span>
						</div>

						<div className="h-32 w-full animate-pulse rounded-md bg-gray-200" />
						<div className="h-20 w-full animate-pulse rounded-md bg-gray-200" />

						<div className="grid grid-cols-2 gap-4">
							<div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
							<div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
						</div>
					</CardContent>
				</Card>

				{/* Additional skeleton content */}
				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="h-24 w-full animate-pulse rounded-md bg-gray-200" />
					<div className="h-24 w-full animate-pulse rounded-md bg-gray-200" />
					<div className="h-24 w-full animate-pulse rounded-md bg-gray-200" />
				</div>
			</div>
		</div>
	);
}
