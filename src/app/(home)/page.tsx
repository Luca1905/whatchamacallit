"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
	const { isAuthenticated } = useConvexAuth();
	const router = useRouter();

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isAuthenticated) {
			router.push("/posts");
		} else {
			router.push("/sign-in");
		}
	};

	return (
		<>
			<div className="relative z-10 space-y-8">
				<h1 className="overflow-visible bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-extrabold text-7xl text-transparent tracking-tight sm:text-8xl md:text-9xl">
					whatchamacallit
				</h1>
				<div className="relative z-10">
					<form onSubmit={handleFormSubmit}>
						<Button
							type="submit"
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							Get Started
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
