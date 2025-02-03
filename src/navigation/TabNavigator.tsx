import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import HomeStack from '@/navigation/HomeStack';
import BookStack from '@/navigation/BookStack';
import AuthorStack from '@/navigation/AuthorStack';
import AuthStack from '@/navigation/AuthStack';
import { UserScreen } from '@/screens/user/UserScreen';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export type TabParamList = {
  HomeTab: undefined;
  BookTab: undefined;
  AuthorTab: undefined;
  UserTab: { userId: number };
  AuthTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const currentUser = useCurrentUser();

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
      {currentUser ? (
        <Tab.Screen
          name="UserTab"
          component={UserScreen}
          initialParams={{ userId: currentUser.id }}
          options={{
            tabBarLabel: '마이페이지',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      ) : (
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
