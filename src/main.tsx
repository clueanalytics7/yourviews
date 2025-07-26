import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './QueryClient';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import * as gtag from '@/lib/gtag';

router.subscribe((state) => {
  if (state.historyAction !== 'POP') {
    gtag.pageview(state.location.pathname + state.location.search);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
