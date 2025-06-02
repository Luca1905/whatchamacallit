"use client";

import { api } from "@/../convex/_generated/api";
import { useMutation } from "convex/react";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useState } from "react";

export function LatestPost(props: {
	preloadedPost: Preloaded<typeof api.posts.getLatest>;
}) {
	const latestPost = usePreloadedQuery(props.preloadedPost);

	const [name, setName] = useState("");
	const createPost = useMutation(api.posts.create);

	return (
		<div className="w-full max-w-xs">
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
					placeholder="Title"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
				/>
				<button
					type="submit"
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
				>
					submit
				</button>
			</form>
		</div>
	);
}
