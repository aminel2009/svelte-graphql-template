import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_GRAPHQL_ENDPOINT: {
		public: true,
		static: true,
		description: 'URL of the GraphQL API used by the generated SDK.',
		schema: (value) => value || 'http://localhost:3000/api/graphql'
	}
});
