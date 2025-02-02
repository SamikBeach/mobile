import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import HomeStack from '@/navigation/HomeStack';
import BookStack from '@/navigation/BookStack';
import AuthorStack from '@/navigation/AuthorStack';
import { useAuth } from '@/hooks/useAuth';
import AuthStack from '@/navigation/AuthStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { currentUser } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="BookTab"
        component={BookStack}
        options={{
          tabBarLabel: '책',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AuthorTab"
        component={AuthorStack}
        options={{
          tabBarLabel: '작가',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {!currentUser && (
        <Tab.Screen
          name="AuthTab"
          component={AuthStack}
          options={{
            tabBarLabel: '로그인',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
