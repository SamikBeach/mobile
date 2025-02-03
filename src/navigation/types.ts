import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type UserStackParamList = {
  Profile: {
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
  Profile: undefined;
  Login: undefined;
  ResetPassword: {
    email: string;
    token: string;
  };
  // ... 다른 프로필 관련 스크린들
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  AuthTab: NavigatorScreenParams<AuthStackParamList>;
  Review: {
    reviewId: number;
  };
  Book: {
    bookId: number;
  };
  // ... 다른 모달 스크린들
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
