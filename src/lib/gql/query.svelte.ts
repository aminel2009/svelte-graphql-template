type CacheEntry = { data: unknown; timestamp: number };

// Plain (non-reactive) Map on purpose: the cache is shared module state, reactivity lives in each useQuery.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const cache = new Map<string, CacheEntry>();

export type QueryOptions = { ttlMs?: number };

export function clearQueryCache(prefix?: string): void {
	if (prefix === undefined) {
		cache.clear();
		return;
	}
	for (const key of cache.keys()) {
		if (key.startsWith(prefix)) cache.delete(key);
	}
}

export function useQuery<TData, TVars = undefined>(
	key: string,
	queryFn: (vars: TVars) => Promise<TData>,
	{ ttlMs = 5 * 60_000 }: QueryOptions = {}
) {
	let data = $state<TData | undefined>(undefined);
	let error = $state<Error | undefined>(undefined);
	let loading = $state(false);
	let latestRequestId = 0;

	async function execute(
		...args: undefined extends TVars
			? [vars?: TVars, forceRefresh?: boolean]
			: [vars: TVars, forceRefresh?: boolean]
	): Promise<TData | undefined> {
		const [vars, forceRefresh = false] = args as [TVars, boolean | undefined];
		const cacheKey = `${key}:${JSON.stringify(vars ?? null)}`;
		const cached = cache.get(cacheKey);

		if (cached && !forceRefresh) {
			data = cached.data as TData;
			// Fresh: serve from cache, no request.
			if (Date.now() - cached.timestamp < ttlMs) return data;
			// Stale: keep showing cached data while revalidating below.
		} else {
			loading = true;
		}

		error = undefined;
		const requestId = ++latestRequestId;

		try {
			const result = await queryFn(vars);
			cache.set(cacheKey, { data: result, timestamp: Date.now() });
			if (requestId === latestRequestId) {
				data = result;
			}
			return result;
		} catch (e) {
			if (requestId === latestRequestId) {
				error = e instanceof Error ? e : new Error(String(e));
			}
			return undefined;
		} finally {
			if (requestId === latestRequestId) {
				loading = false;
			}
		}
	}

	function reset(): void {
		latestRequestId++;
		data = undefined;
		error = undefined;
		loading = false;
	}

	return {
		get data() {
			return data;
		},
		get error() {
			return error;
		},
		get loading() {
			return loading;
		},
		execute,
		reset
	};
}
