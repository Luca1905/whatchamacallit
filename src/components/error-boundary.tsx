import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

/**
 * Simple reusable Error Boundary to catch React rendering errors inside
 * client-side components. Use it by wrapping problematic sub-trees.
 */
export class ErrorBoundary extends React.Component<
	React.PropsWithChildren,
	ErrorBoundaryState
> {
	public state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	handleReset = (): void => {
		this.setState({ hasError: false, error: undefined });
	};

	override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.error("Uncaught error:", error, errorInfo);
	}

	override render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-md border border-red-300 bg-red-50 p-6 text-center">
					<AlertTriangle className="h-8 w-8 text-red-600" />
					<h2 className="font-semibold text-red-700">Something went wrong</h2>
					<p className="text-sm text-red-600">
						{this.state.error?.message ?? "Unknown error"}
					</p>
					<Button onClick={this.handleReset}>Try again</Button>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;