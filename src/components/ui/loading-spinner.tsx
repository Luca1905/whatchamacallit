import { cn } from "@/lib/utils";
import type React from "react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: number;
}

/**
 * Minimal animated spinner used as a loading indicator. Accepts Tailwind
 * utility classes via `className` and custom size via `size` prop.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	className,
	size = 16,
	...props
}) => (
	<div
		role="status"
		aria-label="loading"
		className={cn(
			"animate-spin rounded-full border-2 border-muted-foreground border-t-transparent",
			className,
		)}
		style={{ width: size, height: size }}
		{...props}
	/>
);

export default LoadingSpinner;
