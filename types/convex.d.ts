// Comprehensive type declarations for Convex modules
// This file provides TypeScript definitions for convex/values, convex/server, and convex/react

//
// ===== CONVEX/VALUES MODULE =====
//
declare module "convex/values" {
	// Base validator interface
	export interface Validator<
		Type = any,
		Optionality extends "required" | "optional" = "required",
		FieldType = any,
	> {
		readonly type: Type;
		readonly optionality: Optionality;
		readonly fieldType: FieldType;
	}

	// Extract the TypeScript type from a validator
	export type ValidatorType<V> = V extends Validator<infer T, any, any>
		? T
		: never;

	// ID type for referencing documents in specific tables
	export type Id<TableName extends string = string> = string & {
		readonly __tableName: TableName;
		readonly __brand: "Id";
	};

	// Primitive validator interfaces
	export type VString = () => Validator<string, "required", string>;

	export type VNumber = () => Validator<number, "required", number>;

	export type VBigInt = () => Validator<bigint, "required", bigint>;

	export type VBoolean = () => Validator<boolean, "required", boolean>;

	export type VNull = () => Validator<null, "required", null>;

	export type VAny = () => Validator<any, "required", any>;

	export type VBytes = () => Validator<ArrayBuffer, "required", ArrayBuffer>;

	// Complex validator interfaces
	export type VArray = <T>(
		element: Validator<T, any, any>,
	) => Validator<T[], "required", T[]>;

	export type VObject = <T extends Record<string, Validator<any, any, any>>>(
		fields: T,
	) => Validator<
		{ [K in keyof T]: ValidatorType<T[K]> },
		"required",
		{ [K in keyof T]: ValidatorType<T[K]> }
	>;

	export type VRecord = <
		K extends Validator<string, any, any>,
		V extends Validator<any, any, any>,
	>(
		keyValidator: K,
		valueValidator: V,
	) => Validator<
		Record<ValidatorType<K>, ValidatorType<V>>,
		"required",
		Record<ValidatorType<K>, ValidatorType<V>>
	>;

	export type VUnion = <T extends readonly Validator<any, any, any>[]>(
		...types: T
	) => Validator<
		ValidatorType<T[number]>,
		"required",
		ValidatorType<T[number]>
	>;

	export type VOptional = <T, O, F>(
		type: Validator<T, O, F>,
	) => Validator<T | undefined, "optional", T | undefined>;

	export type VLiteral = <T extends string | number | boolean | null>(
		value: T,
	) => Validator<T, "required", T>;

	export type VId = <TableName extends string>(
		tableName: TableName,
	) => Validator<Id<TableName>, "required", Id<TableName>>;

	// Main validator object
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

//
// ===== CONVEX/SERVER MODULE =====
//
declare module "convex/server" {
	// Re-export essential types from convex/values
	import type { Validator, ValidatorType, Id } from "convex/values";

	// Document interface - all Convex documents have these fields
	export interface GenericDocument {
		_id: Id<any>;
		_creationTime: number;
	}

	// Table definition interface
	export interface TableDefinition {
		index(name: string, fields: string[]): TableDefinition;
		searchIndex(
			name: string,
			config: {
				searchField: string;
				filterFields?: string[];
			},
		): TableDefinition;
		vectorIndex(
			name: string,
			config: {
				vectorField: string;
				dimensions: number;
				filterFields?: string[];
			},
		): TableDefinition;
	}

	// Schema definition functions
	export function defineTable(
		definition: Record<string, Validator<any, any, any>>,
	): TableDefinition;

	export function defineSchema(
		schema: Record<string, TableDefinition>,
		options?: { strictTableNameTypes?: boolean },
	): any;

	// Database read operations
	export interface DatabaseReader {
		get<T extends GenericDocument>(id: Id<any>): Promise<T | null>;
		query<T extends GenericDocument>(tableName: string): QueryInitializer<T>;
		normalizeId<TableName extends string>(
			tableName: TableName,
			id: string,
		): Id<TableName> | null;
	}

	// Database write operations
	export interface DatabaseWriter extends DatabaseReader {
		insert<T extends Record<string, any>>(
			tableName: string,
			value: T,
		): Promise<Id<any>>;
		patch<T extends GenericDocument>(
			id: Id<any>,
			value: Partial<Omit<T, "_id" | "_creationTime">>,
		): Promise<void>;
		replace<T extends GenericDocument>(
			id: Id<any>,
			value: Omit<T, "_id" | "_creationTime">,
		): Promise<void>;
		delete(id: Id<any>): Promise<void>;
	}

	// Query building interfaces
	export interface QueryInitializer<T extends GenericDocument> {
		collect(): Promise<T[]>;
		first(): Promise<T | null>;
		unique(): Promise<T | null>;
		take(n: number): Promise<T[]>;
		order(order: "asc" | "desc"): QueryInitializer<T>;
		filter(
			predicate: (q: FilterBuilder<T>) => FilterExpression<boolean>,
		): QueryInitializer<T>;
		withIndex<IndexName extends string>(
			indexName: IndexName,
			indexRange?: (q: IndexRangeBuilder<T, IndexName>) => IndexRange,
		): QueryInitializer<T>;
		paginate(paginationOpts: PaginationOptions): Promise<PaginationResult<T>>;
	}

	export interface FilterBuilder<T> {
		eq<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		neq<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		gt<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		gte<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		lt<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		lte<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): FilterExpression<boolean>;
		field<FieldName extends keyof T>(field: FieldName): T[FieldName];
		and(...expressions: FilterExpression<boolean>[]): FilterExpression<boolean>;
		or(...expressions: FilterExpression<boolean>[]): FilterExpression<boolean>;
	}

	export interface FilterExpression<T> {
		readonly __type: T;
	}

	export interface IndexRangeBuilder<T, IndexName extends string> {
		eq<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): IndexRange;
		gt<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): IndexRangeBuilder<T, IndexName>;
		gte<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): IndexRangeBuilder<T, IndexName>;
		lt<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): IndexRange;
		lte<FieldName extends keyof T>(
			field: FieldName,
			value: T[FieldName],
		): IndexRange;
	}

	export interface IndexRange {}

	// Pagination interfaces
	export interface PaginationOptions {
		numItems: number;
		cursor?: string;
	}

	export interface PaginationResult<T> {
		page: T[];
		continueCursor: string | null;
		isDone: boolean;
	}

	// Authentication interfaces
	export interface UserIdentity {
		tokenIdentifier: string;
		subject: string;
		issuer: string;
		name?: string;
		email?: string;
		nickname?: string;
		pictureUrl?: string;
		[key: string]: any;
	}

	export interface AuthenticationManager {
		getUserIdentity(): Promise<UserIdentity | null>;
	}

	// Storage interfaces
	export interface StorageWriter {
		store(blob: Blob): Promise<Id<"_storage">>;
		delete(storageId: Id<"_storage">): Promise<void>;
		getUrl(storageId: Id<"_storage">): Promise<string | null>;
		getMetadata(storageId: Id<"_storage">): Promise<{
			contentType?: string;
			size: number;
			sha256: string;
		} | null>;
	}

	export interface StorageReader {
		getUrl(storageId: Id<"_storage">): Promise<string | null>;
		getMetadata(storageId: Id<"_storage">): Promise<{
			contentType?: string;
			size: number;
			sha256: string;
		} | null>;
	}

	// Scheduler interfaces
	export interface Scheduler {
		runAfter<Args extends Record<string, any>>(
			delayMs: number,
			functionReference: any,
			args: Args,
		): Promise<Id<"_scheduled_functions">>;
		runAt<Args extends Record<string, any>>(
			timestamp: Date | number,
			functionReference: any,
			args: Args,
		): Promise<Id<"_scheduled_functions">>;
		cancel(id: Id<"_scheduled_functions">): Promise<void>;
	}

	// Function context interfaces
	export interface QueryCtx {
		db: DatabaseReader;
		auth: AuthenticationManager;
	}

	export interface MutationCtx {
		db: DatabaseWriter;
		auth: AuthenticationManager;
		storage: StorageWriter;
		scheduler: Scheduler;
	}

	export interface ActionCtx {
		auth: AuthenticationManager;
		storage: StorageReader;
		scheduler: Scheduler;
		runQuery: <T>(query: any, args?: any) => Promise<T>;
		runMutation: <T>(mutation: any, args?: any) => Promise<T>;
		runAction: <T>(action: any, args?: any) => Promise<T>;
	}

	// Function configuration interfaces
	export interface FunctionArgs {
		[key: string]: Validator<any, any, any>;
	}

	export interface QueryConfig<Args extends FunctionArgs, Returns> {
		args: Args;
		returns?: Validator<Returns, any, any>;
		handler: (
			ctx: QueryCtx,
			args: { [K in keyof Args]: ValidatorType<Args[K]> },
		) => Promise<Returns> | Returns;
	}

	export interface MutationConfig<Args extends FunctionArgs, Returns> {
		args: Args;
		returns?: Validator<Returns, any, any>;
		handler: (
			ctx: MutationCtx,
			args: { [K in keyof Args]: ValidatorType<Args[K]> },
		) => Promise<Returns> | Returns;
	}

	export interface ActionConfig<Args extends FunctionArgs, Returns> {
		args: Args;
		returns?: Validator<Returns, any, any>;
		handler: (
			ctx: ActionCtx,
			args: { [K in keyof Args]: ValidatorType<Args[K]> },
		) => Promise<Returns> | Returns;
	}

	// Function definition functions
	export function query<Args extends FunctionArgs, Returns>(
		config: QueryConfig<Args, Returns>,
	): any;

	export function mutation<Args extends FunctionArgs, Returns>(
		config: MutationConfig<Args, Returns>,
	): any;

	export function action<Args extends FunctionArgs, Returns>(
		config: ActionConfig<Args, Returns>,
	): any;

	// Re-export types for convenience
	export type { Validator, ValidatorType, Id } from "convex/values";
}

//
// ===== CONVEX/REACT MODULE =====
//
declare module "convex/react" {
	import type { GenericDocument } from "convex/server";

	// Convex React client
	export interface IConvexReactClient {
		setAuth(
			fetchToken: (args: { forceRefreshToken: boolean }) => Promise<
				string | null
			>,
		): void;
		clearAuth(): void;
		connectionState(): {
			isWebSocketConnected: boolean;
			hasInflightRequests: boolean;
		};
		close(): void;
	}

	export interface ConvexReactClient extends IConvexReactClient {
		connectionState(): {
			isWebSocketConnected: boolean;
			hasInflightRequests: boolean;
		};
		clearAuth(): void;
		setAuth(
			fetchToken: (args: { forceRefreshToken: boolean }) => Promise<
				string | null
			>,
		): void;
		close(): void;
	}

	export interface ConvexReactClientConstructor {
		new (url: string): ConvexReactClient;
		(url: string): ConvexReactClient;
	}

	export const ConvexReactClient: ConvexReactClientConstructor;

	// Basic React hooks
	export function useQuery<T = any>(query: any, args?: any): T | undefined;

	export function useMutation<T = any>(
		mutation: any,
	): (args?: any) => Promise<T>;

	export function useAction<T = any>(action: any): (args?: any) => Promise<T>;

	// Paginated query hook
	export interface PaginatedQueryResult<T> {
		results: T[];
		status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
		isLoading: boolean;
		loadMore: (numItems: number) => void;
	}

	export function usePaginatedQuery<
		T extends GenericDocument = GenericDocument,
	>(
		query: any,
		args: any,
		options: { initialNumItems: number },
	): PaginatedQueryResult<T>;

	// Multiple queries hook
	export interface QueryResult<T> {
		data: T | undefined;
		error: Error | undefined;
		isLoading: boolean;
	}

	export function useQueries<T = any>(
		queries: Array<{ query: any; args?: any }>,
	): Array<QueryResult<T>>;

	// Provider component
	export interface ConvexProviderProps {
		client: ConvexReactClient;
		children: React.ReactNode;
	}

	export function ConvexProvider(
		props: ConvexProviderProps,
	): React.ReactElement;

	// Authentication hook
	export interface ConvexAuthState {
		isAuthenticated: boolean;
		isLoading: boolean;
	}

	export function useConvexAuth(): ConvexAuthState;

	// Optimistic updates
	export interface OptimisticUpdate<T> {
		args: any;
		id: string;
		kind: "replace" | "remove";
		value?: T;
	}

	export function useOptimisticAction<T>(
		action: any,
	): (optimisticUpdate: OptimisticUpdate<T>) => Promise<T>;

	// Preloading
	export function Preloaded<T>(props: {
		query: any;
		args?: any;
		children: (result: T) => React.ReactNode;
	}): React.ReactElement;

	export function usePreloadedQuery<T = any>(preloadedQuery: any): T;
}

//
// ===== CONVEX/REACT-CLERK MODULE =====
//
declare module "convex/react-clerk" {
	import type { IConvexReactClient } from "convex/react";

	export interface UseAuth {
		isLoaded: boolean;
		isSignedIn?: boolean;
		userId?: string | null;
		sessionId?: string | null;
		getToken: (options?: { forceRefreshToken?: boolean }) => Promise<
			string | null
		>;
	}

	export interface ConvexProviderWithClerkProps {
		client: IConvexReactClient;
		useAuth: () => UseAuth;
		children: React.ReactNode;
	}

	export function ConvexProviderWithClerk(
		props: ConvexProviderWithClerkProps,
	): React.ReactElement;
}

//
// ===== GLOBAL CONVEX TYPES =====
//
declare global {
	namespace Convex {
		// Base document interface
		interface Document {
			_id: string;
			_creationTime: number;
		}

		// Data model interface for type generation
		interface DataModel {
			[tableName: string]: Document;
		}
	}
}
