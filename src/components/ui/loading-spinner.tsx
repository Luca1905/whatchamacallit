import { cn } from "@/lib/utils";
import type React from "react";

interface LoadingSpinnerProps {
	size?: number;
	className?: string;
	[key: string]: any;
}

/**
 * Minimal animated spinner used as a loading indicator. Accepts Tailwind
 * utility classes via `className` and custom size via `size` prop.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = (
	props: LoadingSpinnerProps,
) => {
	const { className, size = 16, ...rest } = props;
	return (
		<div
			role="status"
			aria-label="loading"
			className={cn(
				"animate-spin rounded-full border-2 border-muted-foreground border-t-transparent",
				className,
			)}
			style={{ width: size, height: size }}
			{...rest}
		/>
	);
};

export default LoadingSpinner;
