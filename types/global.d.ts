// Global ambient type declarations added by AI assistant

// 1. Safeguard module resolutions if IDE/tsc cannot find them (they already ship
//    proper d.ts files, but declaring them here avoids "cannot find module" in
//    mis-configured editors).

declare module "convex/values";
declare module "convex/server";
declare module "@convex-dev/auth/server";

declare module "lucide-react" {
  import * as React from "react";
  export type LucideProps = React.SVGProps<SVGSVGElement> & { size?: number | string };
  export const ArrowLeft: React.FC<LucideProps>;
  // add other icons on demand using `any` to avoid bloating types
  export const Star: React.FC<any>;
  const all: Record<string, React.FC<any>>;
  export default all;
}

declare module "@clerk/nextjs" {
  import * as React from "react";
  export const UserButton: React.FC<{ afterSignOutUrl?: string }>;
  export const SignInButton: React.FC<{ mode?: "modal" | "redirect" }>;
  // other Clerk components can be added as needed
}

// next/navigation types are already shipped with Next.js 15+; this is a guard
// for editors that mis-detect the path.

declare module "next/navigation" {
  export const useRouter: () => { push: (href: string) => void };
}

// 2. JSX.IntrinsicElements stub (only if editor still complains)
//    This is normally provided by @types/react, but some tools look for it in
//    project files.

import "react";

declare global {
  namespace JSX {
    // Re-export the intrinsic elements from the React typings
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}