"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center space-y-8">
				<h1 className="overflow-visible bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-extrabold text-7xl text-transparent tracking-tight sm:text-8xl md:text-9xl">
					whatchamacallit
				</h1>
				<Link href="/game">
					<Button>Play Game</Button>
				</Link>
			</div>
		</>
	);
}
