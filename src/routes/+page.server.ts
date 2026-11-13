import { fileURLToPath } from 'node:url';
import { PUBLIC_GRAPHQL_ENDPOINT } from '$app/env/public';
import { api } from '#lib/gql/client.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const pagePath = fileURLToPath(new URL('./+page.svelte', import.meta.url));
	const fileURL = `vscode://file/${pagePath}`;

	try {
		const result = await api(fetch).Example();
		return {
			endpoint: PUBLIC_GRAPHQL_ENDPOINT,
			result,
			error: null,
			fileURL
		};
	} catch (e) {
		return {
			endpoint: PUBLIC_GRAPHQL_ENDPOINT,
			result: null,
			error: e instanceof Error ? e.message : String(e),
			fileURL
		};
	}
};
