export type TabParamList = {
  HomeTab: undefined;
  BookTab: undefined;
  AuthorTab: undefined;
  UserTab: { userId: number } | undefined;
  AuthTab: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  BookList: undefined;
  AuthorList: undefined;
  User: { userId: number };
  BookDetail: { bookId: number };
  AuthorDetail: { authorId: number };
  Review: { reviewId: number };
  WriteReview: { bookId: number; reviewId?: number };
  Login: undefined;
  SignUp: undefined;
  RequestResetPassword: undefined;
  ResetPassword: undefined;
  InitiateRegistration: { email: string };
  VerifyCode: { email: string };
  Settings: undefined;
  Terms: undefined;
  Privacy: undefined;
};

export type ParamList = RootStackParamList & TabParamList;
