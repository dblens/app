// app/providers.tsx
'use client'
import React, { ReactNode } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    persistence: 'localStorage', // or 'cookie' for cookies, 'memory' for memory storage
    loaded: (posthog) => {
      console.log('PostHog loaded successfully');
    },
    // other initialization options can be added here
  });
}

interface CSPostHogProviderProps {
  children: ReactNode;
}

export function CSPostHogProvider({ children }: CSPostHogProviderProps) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
