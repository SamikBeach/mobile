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
  InitiateRegistration: { email: string };
  VerifyCode: { email: string };
  SignUp: undefined;
  RequestResetPassword: undefined;
  ResetPassword: undefined;
  User: { userId: number };
  BookDetail: { bookId: number };
  AuthorDetail: { authorId: number };
  WriteReview: { bookId: number; reviewId?: number };
  Settings: undefined;
};
