import { api } from "@/../convex/_generated/api";
import { LatestPost } from "@/app/_components/post";
import { preloadQuery } from "convex/nextjs";

export default async function Home() {
	const preloadedPost = await preloadQuery(api.posts.getLatest);
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<LatestPost preloadedPost={preloadedPost} />
			</div>
		</main>
	);
}
