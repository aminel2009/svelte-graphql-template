import type { CodegenConfig } from '@graphql-codegen/cli';

try {
	process.loadEnvFile?.();
} catch {
	// .env file is optional; fallback to environment variables or default local endpoint
}

const schemaUrl =
	process.env.GRAPHQL_SCHEMA_URL ||
	process.env.PUBLIC_GRAPHQL_ENDPOINT ||
	'http://localhost:3000/api/graphql';

const config: CodegenConfig = {
	schema: schemaUrl,
	documents: ['src/**/*.gql'],
	overwrite: true,
	hooks: { afterAllFileWrite: ['prettier --write'] },
	generates: {
		'src/lib/gql/generated.ts': {
			plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
			config: {
				useTypeImports: true,
				enumsAsTypes: true,
				avoidOptionals: true,
				skipTypename: false,
				rawRequest: false,
				dedupeFragments: true
			}
		}
	}
};

export default config;
