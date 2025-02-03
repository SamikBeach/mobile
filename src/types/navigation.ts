import type { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from '@/navigation/AuthStack';

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: undefined;
  AuthorTab: undefined;
  AuthTab?: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type BookStackParamList = {
  Book: undefined;
};

export type AuthorStackParamList = {
  Author: undefined;
};
