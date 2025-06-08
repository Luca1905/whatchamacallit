import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: any;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	refs: any = {};

	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
			}

			return (
				<div className="flex min-h-[200px] items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-6">
					<div className="text-center">
						<h2 className="mb-2 text-lg font-semibold text-destructive">Something went wrong</h2>
						<p className="mb-4 text-sm text-muted-foreground">
							{this.state.error?.message || "An unexpected error occurred"}
						</p>
						<button
							onClick={this.resetError}
							className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
						>
							Try again
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}