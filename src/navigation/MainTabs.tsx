import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  MainTabsParamList,
  HomeStackParamList,
  ExploreStackParamList,
  BookStackParamList,
  SessionsStackParamList,
} from './types';
import { colors } from '../theme/theme';

import { HomeScreen } from '../screens/home/HomeScreen';
import { CrisisSafetyScreen } from '../screens/home/CrisisSafetyScreen';
import { MoodAnalyzerScreen } from '../screens/assess/MoodAnalyzerScreen';
import { AssessmentQuestionsScreen } from '../screens/assess/AssessmentQuestionsScreen';
import { AnalyzerResultsScreen } from '../screens/assess/AnalyzerResultsScreen';
import { ResourceBankScreen } from '../screens/resources/ResourceBankScreen';
import { DoctorDiscoveryScreen } from '../screens/booking/DoctorDiscoveryScreen';
import { DoctorProfileScreen } from '../screens/booking/DoctorProfileScreen';
import { BookingScreen } from '../screens/booking/BookingScreen';
import { BookingConfirmedScreen } from '../screens/booking/BookingConfirmedScreen';
import { MySessionsScreen } from '../screens/sessions/MySessionsScreen';
import { InSessionVideoCallScreen } from '../screens/sessions/InSessionVideoCallScreen';
import { AfterSessionScreen } from '../screens/sessions/AfterSessionScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const BookStack = createNativeStackNavigator<BookStackParamList>();
const SessionsStack = createNativeStackNavigator<SessionsStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeDashboard" component={HomeScreen} />
    <HomeStack.Screen name="CrisisSafety" component={CrisisSafetyScreen} />
  </HomeStack.Navigator>
);

const ExploreStackNavigator = () => (
  <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
    <ExploreStack.Screen name="MoodBucket" component={MoodAnalyzerScreen} />
    <ExploreStack.Screen name="AssessmentQuestions" component={AssessmentQuestionsScreen} />
    <ExploreStack.Screen name="ResultsCheckIn" component={AnalyzerResultsScreen} />
    <ExploreStack.Screen name="ResourceBank" component={ResourceBankScreen} />
  </ExploreStack.Navigator>
);

const BookStackNavigator = () => (
  <BookStack.Navigator screenOptions={{ headerShown: false }}>
    <BookStack.Screen name="DoctorList" component={DoctorDiscoveryScreen} />
    <BookStack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    <BookStack.Screen name="SlotBookingPayment" component={BookingScreen} />
    <BookStack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
  </BookStack.Navigator>
);

const SessionsStackNavigator = () => (
  <SessionsStack.Navigator screenOptions={{ headerShown: false }}>
    <SessionsStack.Screen name="MySessions" component={MySessionsScreen} />
    <SessionsStack.Screen name="InSessionVideoCall" component={InSessionVideoCallScreen} />
    <SessionsStack.Screen name="AfterSession" component={AfterSessionScreen} />
  </SessionsStack.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            HomeTab: 'home-outline',
            ExploreTab: 'compass-outline',
            BookTab: 'calendar-outline',
            SessionsTab: 'videocam-outline',
            ProfileTab: 'person-outline',
          };

          return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab" component={ExploreStackNavigator} options={{ title: 'Explore' }} />
      <Tab.Screen name="BookTab" component={BookStackNavigator} options={{ title: 'Book' }} />
      <Tab.Screen name="SessionsTab" component={SessionsStackNavigator} options={{ title: 'Sessions' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
