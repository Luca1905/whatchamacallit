"use client";

import { api } from "@/../convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export function LatestPost(props: {
	preloadedPost: Preloaded<typeof api.posts.getLatest>;
}) {
	const latestPost = usePreloadedQuery(props.preloadedPost);
	const [name, setName] = useState("");
	const createPost = useMutation(api.posts.create);
	const { isAuthenticated, isLoading } = useConvexAuth();

	const username = useQuery(api.user.getUsername);

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	if (!isAuthenticated) {
		redirect("/sign-in");
	}

	return (
		<div className="w-full max-w-xs text-black">
			<p>Hello {username ?? "User"}</p>{" "}
			{latestPost ? (
				<p className="truncate">Your most recent post: {latestPost.name}</p>
			) : (
				<p>You have no posts yet.</p>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createPost({ name });
				}}
				className="flex flex-col gap-2"
			>
				<input
					type="text"
					placeholder="..."
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-full border border-gray-400 px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
				/>
				<button
					type="submit"
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition"
				>
					submit
				</button>
			</form>
		</div>
	);
}
