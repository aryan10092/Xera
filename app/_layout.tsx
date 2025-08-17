import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Post from './Post';
import Home from './Home';
import Allposts from './Allposts';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#23243a',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#ffb86c',
        tabBarInactiveTintColor: '#f3f4fa',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Post') iconName = 'play-outline';
            else if (route.name === 'Profile') iconName = 'person-outline';
            else if (route.name === 'Allposts') iconName = 'search-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home}  />
      <Tab.Screen name="Allposts" component={Allposts} options={{ tabBarLabel: 'Allposts' }} />
      <Tab.Screen name="Post" component={Post} options={{ tabBarLabel: 'Post' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profile' }} />
      
    </Tab.Navigator>
  );
}
