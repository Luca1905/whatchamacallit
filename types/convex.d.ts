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
  // Core validator types
  export interface Validator<Type = any, Optionality = "required" | "optional", FieldType = any> {
    readonly type: Type;
    readonly optionality: Optionality;
    readonly fieldType: FieldType;
  }

  export type ValidatorType<V> = V extends Validator<infer T, any, any> ? T : never;
  export type Id<TableName extends string = string> = string & { readonly __tableName: TableName };

  // Validator function interfaces
  export interface VString {
    (): Validator<string, "required", string>;
  }
  
  export interface VNumber {
    (): Validator<number, "required", number>;
  }
  
  export interface VBigInt {
    (): Validator<bigint, "required", bigint>;
  }
  
  export interface VBoolean {
    (): Validator<boolean, "required", boolean>;
  }
  
  export interface VNull {
    (): Validator<null, "required", null>;
  }
  
  export interface VAny {
    (): Validator<any, "required", any>;
  }
  
  export interface VBytes {
    (): Validator<ArrayBuffer, "required", ArrayBuffer>;
  }
  
  export interface VArray {
    <T>(element: Validator<T, any, any>): Validator<T[], "required", T[]>;
  }
  
  export interface VObject {
    <T extends Record<string, Validator<any, any, any>>>(
      fields: T
    ): Validator<
      { [K in keyof T]: ValidatorType<T[K]> },
      "required",
      { [K in keyof T]: ValidatorType<T[K]> }
    >;
  }
  
  export interface VRecord {
    <K extends Validator<string, any, any>, V extends Validator<any, any, any>>(
      keyValidator: K,
      valueValidator: V
    ): Validator<Record<ValidatorType<K>, ValidatorType<V>>, "required", Record<ValidatorType<K>, ValidatorType<V>>>;
  }
  
  export interface VUnion {
    <T extends readonly Validator<any, any, any>[]>(
      ...types: T
    ): Validator<ValidatorType<T[number]>, "required", ValidatorType<T[number]>>;
  }
  
  export interface VOptional {
    <T, O, F>(
      type: Validator<T, O, F>
    ): Validator<T | undefined, "optional", T | undefined>;
  }
  
  export interface VLiteral {
    <T extends string | number | boolean | null>(
      value: T
    ): Validator<T, "required", T>;
  }
  
  export interface VId {
    <TableName extends string>(tableName: TableName): Validator<Id<TableName>, "required", Id<TableName>>;
  }

  // Main v export
  export const v: {
    string: VString;
    number: VNumber;
    bigint: VBigInt;
    boolean: VBoolean;
    null: VNull;
    any: VAny;
    bytes: VBytes;
    array: VArray;
    object: VObject;
    record: VRecord;
    union: VUnion;
    optional: VOptional;
    literal: VLiteral;
    id: VId;
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