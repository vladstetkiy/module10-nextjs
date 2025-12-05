import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export { QueryClientProvider, queryClient };

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request to ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
};

const libApi = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'GET' });
  },

  async post(endpoint: string, body: unknown) {
    return fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

const useApiQuery = <TData = unknown, TError = Error>(
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TData, TError>({
    queryKey: [endpoint],
    queryFn: () => fetchWithAuth(endpoint, { method: 'GET' }),
    ...options,
  });
};

const useApiMutation = <TVariables = unknown, TData = unknown, TError = Error>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables: TVariables) =>
      fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(variables),
      }),
    ...options,
  });
};

const useApiGet = <TData = unknown, TError = Error>(
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) => useApiQuery<TData, TError>(endpoint, options);

const useApiPost = <TVariables = unknown, TData = unknown, TError = Error>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) => useApiMutation<TVariables, TData, TError>(endpoint, 'POST', options);

export {
  libApi as default,
  libApi,
  useApiQuery,
  useApiMutation,
  useApiGet,
  useApiPost,
  getAuthToken,
};

export type ApiQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>;
export type ApiMutationOptions<TVariables, TData, TError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;
