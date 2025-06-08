// Type declarations for Convex modules to ensure proper module resolution

declare module "convex/server" {
  export function defineSchema(schema: any): any;
  export function defineTable(definition: any): any;
  export function mutation(config: any): any;
  export function query(config: any): any;
  export function action(config: any): any;
  export type MutationCtx = any;
  export type QueryCtx = any;
  export type ActionCtx = any;
}

declare module "convex/values" {
  export const v: {
    string(): any;
    number(): any;
    boolean(): any;
    null(): any;
    any(): any;
    array(element: any): any;
    object(fields: any): any;
    union(...types: any[]): any;
    optional(type: any): any;
    id(tableName: string): any;
  };
}

declare module "convex/react" {
  export function useQuery(query: any, args?: any): any;
  export function useMutation(mutation: any): any;
  export function useAction(action: any): any;
  export function ConvexProvider(props: any): any;
  export function useConvexAuth(): any;
}

declare module "convex" {
  export * from "convex/server";
  export * from "convex/values";
  export * from "convex/react";
}