import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { HomeStackParamList } from './HomeStack';

export type UserStackParamList = {
  User: {
    userId?: number; // 없으면 현재 유저
  };
  EditProfile: undefined;
  Settings: undefined;
};

export type BookStackParamList = {
  BookList: undefined;
  BookDetail: {
    bookId: number;
  };
};

export type AuthorStackParamList = {
  AuthorList: undefined;
  AuthorDetail: { authorId: number };
};

export type AuthStackParamList = {
  Login: undefined;
  ResetPassword: {
    email: string;
    token: string;
  };
};

export type ProfileStackParamList = {
  Profile: {
    userId: number;
  };
};

export type RootStackParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  AuthorTab: NavigatorScreenParams<AuthorStackParamList>;
  AuthTab: NavigatorScreenParams<AuthStackParamList>;
  UserTab: NavigatorScreenParams<UserStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
