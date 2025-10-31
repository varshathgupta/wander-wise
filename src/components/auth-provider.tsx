'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      // Refetch session only when window is focused after 5 minutes
      refetchInterval={5 * 60}
      // Refetch on window focus only if session is older than 5 minutes
      refetchOnWindowFocus={true}
      // Don't refetch when tab becomes visible
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
