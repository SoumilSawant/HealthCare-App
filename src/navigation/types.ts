import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  LanguageConsent: undefined;
  Login: undefined;
  ConsentPrivacy: undefined;
  RegisterProfile: undefined;
};

export type HomeStackParamList = {
  HomeDashboard: undefined;
  CrisisSafety: undefined;
};

export type ExploreStackParamList = {
  MoodBucket: undefined;
  AssessmentQuestions: { bucketId: string; bucketTitle: string };
  ResultsCheckIn: { score: number };
  ResourceBank: undefined;
};

export type BookStackParamList = {
  DoctorList: undefined;
  DoctorProfile: { doctorId: string };
  SlotBookingPayment: { doctorId: string };
  BookingConfirmed: { doctorName: string; slot: string };
};

export type SessionsStackParamList = {
  MySessions: undefined;
  InSessionVideoCall: { sessionId: string };
  AfterSession: { sessionId: string };
};

export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ExploreTab: NavigatorScreenParams<ExploreStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  SessionsTab: NavigatorScreenParams<SessionsStackParamList>;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};
