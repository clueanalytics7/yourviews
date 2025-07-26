import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { router } from "@/router";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
      onError: (error: Error) => {
        console.error("Query Error:", error);
        toast.error("An unexpected error occurred", {
          description: error.message || "Please try again later.",
        });
      },
    },
    mutations: {
      onError: (error: Error) => {
        console.error("Mutation Error:", error);
        toast.error("An unexpected error occurred", {
          description: error.message || "Please try again later.",
        });
      },
    },
  },
});



const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
