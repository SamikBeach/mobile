import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  Review: {
    reviewId: number;
  };
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
  SignUp: undefined;
  UserInfo: { email: string };
  VerifyCode: { email: string };
  ResetPassword: {
    email: string;
    token: string;
  };
};

export type UserStackParamList = {
  User: {
    userId?: number;
  };
};

export type TabParamList = {
  HomeTab: undefined;
  BookTab: undefined;
  AuthorTab: undefined;
  UserTab: { userId: number };
  AuthTab: undefined;
};

export type RootStackParamList = {
  Tab: NavigatorScreenParams<TabParamList>;
  Review: { reviewId: number };
  Login: undefined;
  SignUp: undefined;
  UserInfo: { email: string };
  VerifyCode: { email: string };
  ResetPassword: { email: string; token: string };
  User: { userId: number };
  BookDetail: { bookId: number };
  AuthorDetail: { authorId: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
