import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5,
      onError: (error: unknown) => {
        console.error("Global QueryClient error:", error.message, error.stack);
      },
    },
    mutations: {
      onError: (error: unknown) => {
        console.error("Global MutationClient error:", error.message, error.stack);
      },
    },
  },
});
