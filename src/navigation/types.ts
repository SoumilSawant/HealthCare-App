import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  LanguageConsent: undefined;
  Login: undefined;
  Signup: undefined;
  Consent: { mobileNumber: string; password: string; verified?: boolean };
  Profile: { mobileNumber: string; password: string };
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
  DoctorDiscovery: undefined;
  Booking: undefined;
};

export type AssessStackParamList = {
  MoodAnalyzer: undefined;
  AnalyzerResults: { score: number };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};

// Define screen props globally or use inline in components
