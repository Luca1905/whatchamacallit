import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GameProvider } from "@/context/game-context";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type React from "react";
import { Suspense } from "react";

export default function GameLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<GameProvider>
			<div className="font-sans antialiased">
				<div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
					<Suspense
						fallback={<LoadingSpinner size={48} className="text-blue-500" />}
					>
						{children}
					</Suspense>
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
