import { SignInWithGitHub } from "@/components/ui/SignInWithGitHub";

export default function Home() {
	return (
		<div>
			<SignInWithGitHub forceRedirectUrl={"/posts"} />
		</div>
	);
}
