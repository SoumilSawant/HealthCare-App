import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  LanguageConsent: undefined;
  Login: undefined;
  OtpLogin: undefined;
  Signup: undefined;
  Consent: { mobileNumber: string; password: string; verified?: boolean };
  Profile: { mobileNumber: string; password: string };
  DoctorLogin: undefined;
  DoctorRegister: undefined;
  DoctorPending: { email: string; reason?: string };
};

export type MainTabsParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  BookTab: undefined;
  SessionsTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Resources: undefined;
};

export type AssessStackParamList = {
  MoodAnalyzer: undefined;
  Assessment: { bucketId: string; title: string };
  AnalyzerResults: { score: number };
  Safety: undefined;
};

export type BookingStackParamList = {
  DoctorDiscovery: undefined;
  DoctorProfile: { doctorId: string; name: string };
  Booking: { doctorId: string; slot: string };
  BookingConfirmed: undefined;
};

export type SessionsStackParamList = {
  SessionsList: undefined;
  InSession: { sessionId: string };
  AfterSession: { sessionId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  PastConsultations: undefined;
  NotesPrescriptions: undefined;
  SavedResources: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};
