// Global ambient type declarations

// Module declarations for external libraries
declare module "convex/values" {
	export const v: any;
}

declare module "convex/server" {
	export const mutation: any;
	export const query: any;
	export const internalMutation: any;
	export const internalQuery: any;
	export const internalAction: any;
	export const action: any;
	export type MutationCtx = any;
	export type QueryCtx = any;
	export type ActionCtx = any;
	export const defineSchema: any;
	export const defineTable: any;
}

declare module "@convex-dev/auth/server" {
	export const getAuthUserId: any;
}

declare module "lucide-react" {
	import type * as React from "react";
	export type LucideProps = React.SVGProps<SVGSVGElement> & {
		size?: number | string;
		className?: string;
	};
	export const ArrowLeft: React.FC<LucideProps>;
	export const Star: React.FC<LucideProps>;
	export const Send: React.FC<LucideProps>;
	export const Shuffle: React.FC<LucideProps>;
	export const Crown: React.FC<LucideProps>;
	export const Users: React.FC<LucideProps>;
	export const Play: React.FC<LucideProps>;
	export const Settings: React.FC<LucideProps>;
	export const Trophy: React.FC<LucideProps>;
	export const Gamepad2: React.FC<LucideProps>;
	export const AlertTriangle: React.FC<LucideProps>;
}

declare module "@clerk/nextjs" {
	import type * as React from "react";
	export const UserButton: React.FC<{ afterSignOutUrl?: string }>;
	export const SignInButton: React.FC<{ mode?: "modal" | "redirect" }>;
	export const SignedIn: React.FC<{ children?: React.ReactNode }>;
	export const SignedOut: React.FC<{ children?: React.ReactNode }>;
	export const SignIn: React.FC<{ forceRedirectUrl?: string }>;
	export const ClerkProvider: React.FC<{ children?: React.ReactNode }>;
	export const useAuth: () => any;
	export const UserProfile: React.FC<any>;
}

declare module "next/navigation" {
	export function useRouter(): {
		push(href: string): void;
		replace(href: string): void;
		back(): void;
		forward(): void;
	};
	export function redirect(url: string): never;
}

// JSX namespace - ensure all standard HTML elements are available
declare global {
	namespace JSX {
		interface IntrinsicElements {
			// HTML elements
			div: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLDivElement>,
				HTMLDivElement
			>;
			span: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLSpanElement>,
				HTMLSpanElement
			>;
			button: React.DetailedHTMLProps<
				React.ButtonHTMLAttributes<HTMLButtonElement>,
				HTMLButtonElement
			>;
			input: React.DetailedHTMLProps<
				React.InputHTMLAttributes<HTMLInputElement>,
				HTMLInputElement
			>;
			p: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLParagraphElement>,
				HTMLParagraphElement
			>;
			h1: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLHeadingElement>,
				HTMLHeadingElement
			>;
			h2: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLHeadingElement>,
				HTMLHeadingElement
			>;
			h3: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLHeadingElement>,
				HTMLHeadingElement
			>;
			form: React.DetailedHTMLProps<
				React.FormHTMLAttributes<HTMLFormElement>,
				HTMLFormElement
			>;
			img: React.DetailedHTMLProps<
				React.ImgHTMLAttributes<HTMLImageElement>,
				HTMLImageElement
			>;
			svg: React.SVGProps<SVGSVGElement>;
			path: React.SVGProps<SVGPathElement>;
			title: React.SVGProps<SVGTitleElement>;
			// Add more as needed
		}
	}
}

// React types fix
declare module "react" {
	export class Component<P = {}, S = {}> {
		constructor(props?: P, context?: any) {}
		props: P;
		state: S;
		context: any;
		refs: any;
		setState: (state: Partial<S>) => void;
		forceUpdate: () => void;
		render(): any;
		componentDidCatch?(error: any, errorInfo: any): void;
		static getDerivedStateFromError?(error: any): any;
	}
	export const useState: any;
	export const useEffect: any;
	export const useMemo: any;
	export const createContext: any;
	export const useContext: any;
	export const forwardRef: any;
	export const Suspense: any;
	
	// Types
	export type ReactNode = any;
	export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
	export type FC<P = {}> = any;
	export type Ref<T> = any;
	export type ErrorInfo = any;

	interface ComponentPropsWithoutRef<T extends React.ElementType> {
		[key: string]: any;
	}

	interface ComponentProps<T extends React.ElementType> {
		[key: string]: any;
	}
}

declare module "convex/react" {
	export const useMutation: any;
	export const useQuery: any;
	export const useConvexAuth: any;
	export const ConvexProvider: any;
	export const ConvexReactClient: any;
}

declare module "class-variance-authority" {
	export const cva: any;
	export type VariantProps<T> = any;
}

declare module "@radix-ui/react-slot" {
	import * as React from "react";
	export const Slot: React.FC<any>;
}

declare module "@radix-ui/react-avatar" {
	import * as React from "react";
	export const Root: React.FC<any>;
	export const Image: React.FC<any>;
	export const Fallback: React.FC<any>;
	export type AvatarProps = any;
	export type AvatarImageProps = any;
	export type AvatarFallbackProps = any;
}

declare module "@radix-ui/react-progress" {
	import * as React from "react";
	export const Root: React.FC<any>;
	export const Indicator: React.FC<any>;
	export type ProgressProps = any;
	export type ProgressIndicatorProps = any;
}

declare module "@radix-ui/react-separator" {
	import * as React from "react";
	export const Root: React.FC<any>;
	export type SeparatorProps = any;
}

declare module "tailwind-merge" {
	export const twMerge: any;
}

declare module "clsx" {
	export type ClassValue = any;
	export const clsx: any;
}

declare module "react/jsx-runtime" {
	export const jsx: any;
	export const jsxs: any;
	export const Fragment: any;
}

declare module "react/jsx-dev-runtime" {
	export const jsx: any;
	export const jsxs: any;
	export const Fragment: any;
}
