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
  UserInfo: { email: string };
  VerifyCode: { email: string };
  ResetPassword: { email: string; token: string };
  User: { userId: number };
  BookDetail: { bookId: number };
  AuthorDetail: { authorId: number };
};
