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

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Review: {
    reviewId: number;
  };
  Book: {
    bookId: number;
  };
  WriteReview: {
    bookId: number;
    reviewId?: number;
  };
  Author: NavigatorScreenParams<AuthorStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
  ResetPassword: {
    email: string;
    token: string;
  };
  // ... 다른 스크린들
} & BookStackParamList; // BookStack의 스크린들도 포함

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
