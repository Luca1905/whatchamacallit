import { GameProvider } from "@/context/game-context";
import React, { Suspense } from "react";
import ErrorBoundary from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function GameLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<GameProvider>
			<div className="font-sans antialiased">
				<div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
					<ErrorBoundary>
						<Suspense
							fallback={<LoadingSpinner size={48} className="text-blue-500" />}
						>
							{children}
						</Suspense>
					</ErrorBoundary>
					<SignedOut>
						<SignInButton mode="modal" />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</GameProvider>
	);
}
