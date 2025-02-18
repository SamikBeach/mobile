import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Library, User } from '@/components/icons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { UserScreen } from '@/screens/user/UserScreen';
import { RootStackParamList, TabParamList } from './types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import BookScreen from '@/screens/book/BookScreen';
import AuthorScreen from '@/screens/author/AuthorScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { ReviewScreen } from '@/screens/review/ReviewScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { BookDetailScreen } from '@/screens/book/BookDetailScreen';
import { AuthorDetailScreen } from '@/screens/author/AuthorDetailScreen';
import { WriteReviewScreen } from '@/screens/review/WriteReviewScreen/WriteReviewScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import InitiateRegistrationScreen from '@/screens/auth/InitiateRegistrationScreen';
import VerifyCodeScreen from '@/screens/auth/VerifyCodeScreen';
import { TermsScreen } from '@/screens/auth/TermsScreen';
import { PrivacyScreen } from '@/screens/auth/PrivacyScreen';
import { Logo } from '@/components/common/Logo';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity, StyleSheet, Platform, View } from 'react-native';
import { SearchModal } from '@/components/common/Search/SearchModal';
import { NavigationContainer } from '@react-navigation/native';
import { ResetPasswordRequestScreen } from '@/screens/auth/reset-password/ResetPasswordRequestScreen';
import { colors } from '@/styles/theme';
import { BlockedUsersScreen } from '@/screens/user/BlockedUsersScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitle: '뒤로',
        }}>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="BookDetail"
          component={withTabNavigator(BookDetailScreen)}
          options={{ headerTitle: '도서 상세' }}
        />
        <Stack.Screen
          name="AuthorDetail"
          component={withTabNavigator(AuthorDetailScreen)}
          options={{ headerTitle: '작가 상세' }}
        />
        <Stack.Screen
          name="WriteReview"
          component={WriteReviewScreen}
          options={{ headerTitle: '리뷰 작성' }}
        />
        <Stack.Screen
          name="User"
          component={withTabNavigator(UserScreen)}
          options={{ headerShown: false }}
        />
        {/* ... other common screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator() {
  const currentUser = useCurrentUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="Home" />}
      </Tab.Screen>
      <Tab.Screen
        name="BookTab"
        options={{
          tabBarLabel: '책',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="BookList" />}
      </Tab.Screen>
      <Tab.Screen
        name="AuthorTab"
        options={{
          tabBarLabel: '작가',
          tabBarIcon: ({ color, size }) => <Icon name="users" size={size} color={color} />,
        }}>
        {() => <StackNavigator initialRouteName="AuthorList" />}
      </Tab.Screen>
      {currentUser ? (
        <Tab.Screen
          name="UserTab"
          options={{
            tabBarLabel: '마이페이지',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => <StackNavigator initialRouteName="User" />}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="AuthTab"
          options={{
            tabBarLabel: '로그인',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}>
          {() => <StackNavigator initialRouteName="Login" />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

function StackNavigator({ initialRouteName }: { initialRouteName: keyof RootStackParamList }) {
  const [searchVisible, setSearchVisible] = useState(false);

  const SearchButton = () => (
    <TouchableOpacity
      onPress={() => setSearchVisible(true)}
      style={styles.headerButton}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
      <Icon name="search" size={24} color={colors.gray[600]} />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitle: '뒤로',
        }}
        initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: () => (
              <View style={styles.headerLeftContainer}>
                <Logo size="sm" />
              </View>
            ),
            headerTitle: '',
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <SearchButton />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="BookList"
          component={BookScreen}
          options={{ headerTitle: '책', headerShown: false }}
        />
        <Stack.Screen
          name="AuthorList"
          component={AuthorScreen}
          options={{ headerTitle: '작가', headerShown: false }}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{ headerTitle: '마이페이지', headerShown: false }}
        />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ headerTitle: '리뷰' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '로그인' }} />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerTitle: '회원가입' }}
        />
        <Stack.Screen
          name="ResetPasswordRequest"
          component={ResetPasswordRequestScreen}
          options={{ headerTitle: '비밀번호 재설정' }}
        />
        <Stack.Screen
          name="InitiateRegistration"
          component={InitiateRegistrationScreen}
          options={{ headerTitle: '회원정보 입력' }}
        />
        <Stack.Screen
          name="VerifyCode"
          component={VerifyCodeScreen}
          options={{ headerTitle: '이메일 인증' }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ headerTitle: '도서 상세' }}
        />
        <Stack.Screen
          name="AuthorDetail"
          component={AuthorDetailScreen}
          options={{ headerTitle: '작가 상세' }}
        />
        <Stack.Screen
          name="WriteReview"
          component={WriteReviewScreen}
          options={{ headerTitle: '리뷰 작성' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerTitle: '설정' }}
        />
        <Stack.Screen
          name="BlockedUsers"
          component={BlockedUsersScreen}
          options={{
            headerShown: true,
            title: '차단한 사용자',
          }}
        />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ headerTitle: '이용약관' }} />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ headerTitle: '개인정보처리방침' }}
        />
      </Stack.Navigator>
      <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'android' ? -8 : 0,
  },
  headerLeftContainer: {
    marginLeft: 12,
  },
  headerRightContainer: {
    marginRight: 12,
  },
});

function withTabNavigator(Component: React.ComponentType<any>) {
  return function TabWrappedScreen(props: any) {
    const currentUser = useCurrentUser();

    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarLabel: '홈',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}>
          {() => <Component {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="BookTab"
          component={BookScreen}
          options={{
            tabBarLabel: '책',
            tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="AuthorTab"
          component={AuthorScreen}
          options={{
            tabBarLabel: '작가',
            tabBarIcon: ({ color, size }) => <Icon name="users" size={size} color={color} />,
          }}
        />
        {currentUser ? (
          <Tab.Screen
            name="UserTab"
            component={UserScreen}
            options={{
              tabBarLabel: '마이페이지',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        ) : (
          <Tab.Screen
            name="AuthTab"
            component={LoginScreen}
            options={{
              tabBarLabel: '로그인',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        )}
      </Tab.Navigator>
    );
  };
}
