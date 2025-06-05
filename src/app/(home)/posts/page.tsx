import { api } from "@/../convex/_generated/api";
import { LatestPost } from "@/app/(home)/_components/post";
import { preloadQuery } from "convex/nextjs";

export default async function Home() {
	const preloadedPost = await preloadQuery(api.posts.getLatest);

	return (
		<div className="container relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16 text-black">
			<LatestPost preloadedPost={preloadedPost} />
		</div>
	);
}
