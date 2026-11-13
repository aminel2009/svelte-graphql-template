/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
	T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { type GraphQLClient, type RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
};

export type Media = {
	__typename?: 'Media';
	alt: Scalars['String']['output'];
	id: Scalars['Int']['output'];
};

export type Query = {
	__typename?: 'Query';
	allMedia: Maybe<AllMedia>;
};

export type QueryAllMediaArgs = {
	limit: InputMaybe<Scalars['Int']['input']>;
	page: InputMaybe<Scalars['Int']['input']>;
};

export type AllMedia = {
	__typename?: 'allMedia';
	docs: Array<Media>;
	totalDocs: Maybe<Scalars['Int']['output']>;
};

export type ExampleQueryVariables = Exact<{ [key: string]: never }>;

export type ExampleQuery = { __typename: 'Query' };

export const ExampleDocument = gql`
	query Example {
		__typename
	}
`;

export type SdkFunctionWrapper = <T>(
	action: (requestHeaders?: Record<string, string>) => Promise<T>,
	operationName: string,
	operationType?: string,
	variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) =>
	action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
	return {
		Example(
			variables?: ExampleQueryVariables,
			requestHeaders?: GraphQLClientRequestHeaders,
			signal?: RequestInit['signal']
		): Promise<ExampleQuery> {
			return withWrapper(
				(wrappedRequestHeaders) =>
					client.request<ExampleQuery>({
						document: ExampleDocument,
						variables,
						requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
						signal
					}),
				'Example',
				'query',
				variables
			);
		}
	};
}
export type Sdk = ReturnType<typeof getSdk>;
