import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

const queryClient = new QueryClient()

export default function TabsLayout() {
	
	return (
		<>
			<StatusBar style="light" />
			<QueryClientProvider client={queryClient}>
			<Tabs
				screenOptions={({ route }) => ({
					headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: '#000000',
					borderTopWidth: 0,
					height: 70,
					paddingBottom: 10,
					paddingTop: 10,
				},
				tabBarActiveTintColor: '#f3f4fa',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarIcon: ({ color, size }) => {
					if (route.name === 'Home') {
                 return <Ionicons name="home" size={size} color={color} />;
                  } else if (route.name === 'Post') {
                    return <FontAwesome name="plus-square-o" size={size} color={color} />;
                 } else if (route.name === 'Profile') {
                    return <Ionicons name="person-outline" size={size} color={color} />;
                 } else if (route.name === 'Allposts') {
                    return <Ionicons name="search-outline" size={size} color={color} />;
                  }
                  return null;
				},
			})}
		>
			<Tabs.Screen name="Home" options={{ href: '/(tabs)/Home', tabBarLabel: 'Home' }} />
			<Tabs.Screen name="Allposts" options={{ href: '/(tabs)/Allposts', tabBarLabel: 'Allposts' }} />
			<Tabs.Screen name="Post" options={{ href: '/(tabs)/Post', tabBarLabel: 'Post' }} />
			<Tabs.Screen name="Profile" options={{ href: '/(tabs)/Profile', headerShown: false, tabBarLabel: 'Profile' }} />

		</Tabs>
		</QueryClientProvider>
		</>
	);
}



