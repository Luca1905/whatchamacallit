import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="relative z-10 flex min-h-screen items-center justify-center">
			<SignIn forceRedirectUrl={"/game/setup"} />
		</div>
	);
}
