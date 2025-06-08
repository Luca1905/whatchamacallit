import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="relative z-10">
			<SignIn forceRedirectUrl={"/game/setup"} />
		</div>
	);
}
