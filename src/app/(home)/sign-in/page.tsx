"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
	const { signIn } = useAuthActions();
	const router = useRouter();
	return (
		<div className="relative z-10 mx-auto flex max-w-[384px] flex-col gap-4">
			<>
				<h2 className="font-semibold text-2xl tracking-tight">
					Sign in anonymously
				</h2>
				<Button
					type="submit"
					onClick={() => {
						signIn("anonymous").then(() => router.push("/posts"));
					}}
				>
					Sign in
				</Button>
			</>
		</div>
	);
}
