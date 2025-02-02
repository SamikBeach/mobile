import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type BookStackParamList = {
  BookList: undefined;
  BookDetail: {
    bookId: number;
  };
};

export type RootStackParamList = {
  Book: undefined;
  Home: undefined;
  Review: {
    reviewId: number;
  };
  // ... 다른 스크린들
} & BookStackParamList; // BookStack의 스크린들도 포함

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
