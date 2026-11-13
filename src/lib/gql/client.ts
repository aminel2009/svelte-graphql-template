import { GraphQLClient } from 'graphql-request';
import { PUBLIC_GRAPHQL_ENDPOINT } from '$app/env/public';
import { getSdk } from './generated.ts';

type ClientConfig = NonNullable<ConstructorParameters<typeof GraphQLClient>[1]>;

export type ApiOptions = {
	endpoint?: string;
	headers?: ClientConfig['headers'];
};

export const api = (fetchFn: typeof fetch = fetch, options: ApiOptions = {}) =>
	getSdk(
		new GraphQLClient(options.endpoint ?? PUBLIC_GRAPHQL_ENDPOINT, {
			fetch: fetchFn,
			headers: options.headers
		})
	);
