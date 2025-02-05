export type TabParamList = {
  HomeTab: undefined;
  BookTab: undefined;
  AuthorTab: undefined;
  UserTab: { userId: number };
  AuthTab: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  BookList: undefined;
  AuthorList: undefined;
  Review: { reviewId: number };
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  InitiateRegistration: { email: string };
  VerifyCode: { email: string };
  User: { userId: number };
  BookDetail: { bookId: number };
  AuthorDetail: { authorId: number };
  WriteReview: { bookId: number; reviewId?: number };
  Settings: undefined;
};
