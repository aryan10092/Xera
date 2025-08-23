import { useAuthStore } from '@/Providers/AuthProvider';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

export default function RootLayout() {
	
	
	const { session, loading, initSession } = useAuthStore()
	const queryClient = new QueryClient()

  useEffect(() => {
    initSession()
  }, [initSession])

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return
    const inAuthStack = segments[0] === 'Auth'
    if (!session && !inAuthStack) {
      router.replace('/Auth')
    } else if (session && inAuthStack) {
      router.replace('/(tabs)/Home')
    }
  }, [loading, session, segments])

	

	return (
	  <QueryClientProvider client={queryClient}>
		<Stack screenOptions={{ headerShown: false }} />
	  </QueryClientProvider>
	);
}
