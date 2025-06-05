"use client";

import { GitHubLogo } from "@/components/ui/GitHubLogo";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInWithGitHub({
	forceRedirectUrl,
}: { forceRedirectUrl: string }) {
	const { signIn } = useAuthActions();
	return (
		<Button
			className="flex-1"
			variant="outline"
			type="button"
			onClick={() => void signIn("github", { redirectTo: forceRedirectUrl })}
		>
			<GitHubLogo className="mr-2 h-4 w-4" /> GitHub
		</Button>
	);
}
