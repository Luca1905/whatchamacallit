import { SignInWithGitHub } from "@/components/ui/SignInWithGitHub";

export default function Home() {
	return (
		<div className="relative z-10">
			<SignInWithGitHub forceRedirectUrl={"/posts"} />
		</div>
	);
}
