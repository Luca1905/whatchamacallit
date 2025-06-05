export default function AppLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="scanlines">
			<div className="screen">
				<canvas id="canvas" className="picture" />
				<div className="overlay">{children}</div>
			</div>
		</main>
	);
}
