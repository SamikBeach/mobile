import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from '@/navigation/AuthStack';

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  AuthorTab: NavigatorScreenParams<AuthorStackParamList>;
  AuthTab?: NavigatorScreenParams<AuthStackParamList>;
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