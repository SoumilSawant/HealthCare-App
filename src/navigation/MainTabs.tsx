import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabsParamList, AssessStackParamList, BookingStackParamList, SessionsStackParamList } from './types';
import { colors } from '../theme/theme';

import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Assess Stack
import { MoodAnalyzerScreen } from '../screens/assess/MoodAnalyzerScreen';
import { AssessmentScreen } from '../screens/assess/AssessmentScreen';
import { AnalyzerResultsScreen } from '../screens/assess/AnalyzerResultsScreen';
import { SafetyScreen } from '../screens/assess/SafetyScreen';

// Booking Stack
import { DoctorDiscoveryScreen } from '../screens/booking/DoctorDiscoveryScreen';
import { DoctorProfileScreen } from '../screens/booking/DoctorProfileScreen';
import { BookingScreen } from '../screens/booking/BookingScreen';
import { BookingConfirmedScreen } from '../screens/booking/BookingConfirmedScreen';

// Sessions Stack
import { SessionsScreen } from '../screens/sessions/SessionsScreen';
import { InSessionScreen } from '../screens/sessions/InSessionScreen';
import { AfterSessionScreen } from '../screens/sessions/AfterSessionScreen';

// Profile Stack
import { PastConsultationsScreen } from '../screens/profile/PastConsultationsScreen';
import { NotesPrescriptionsScreen } from '../screens/profile/NotesPrescriptionsScreen';
import { SavedResourcesScreen } from '../screens/profile/SavedResourcesScreen';
import { PaymentMethodsScreen } from '../screens/profile/PaymentMethodsScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { HelpSupportScreen } from '../screens/profile/HelpSupportScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const AssessStack = createNativeStackNavigator<AssessStackParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const SessionsStack = createNativeStackNavigator<SessionsStackParamList>();
const ProfileStack = createNativeStackNavigator<any>();

const ExploreStackNavigator = () => (
  <AssessStack.Navigator screenOptions={{ headerShown: false }}>
    <AssessStack.Screen name="MoodAnalyzer" component={MoodAnalyzerScreen} />
    <AssessStack.Screen name="Assessment" component={AssessmentScreen} />
    <AssessStack.Screen name="AnalyzerResults" component={AnalyzerResultsScreen} />
    <AssessStack.Screen name="Safety" component={SafetyScreen} />
  </AssessStack.Navigator>
);

const BookStackNavigator = () => (
  <BookingStack.Navigator screenOptions={{ headerShown: false }}>
    <BookingStack.Screen name="DoctorDiscovery" component={DoctorDiscoveryScreen} />
    <BookingStack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    <BookingStack.Screen name="Booking" component={BookingScreen} />
    <BookingStack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
  </BookingStack.Navigator>
);

const SessionsStackNavigator = () => (
  <SessionsStack.Navigator screenOptions={{ headerShown: false }}>
    <SessionsStack.Screen name="SessionsList" component={SessionsScreen} />
    <SessionsStack.Screen name="InSession" component={InSessionScreen} />
    <SessionsStack.Screen name="AfterSession" component={AfterSessionScreen} />
  </SessionsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="PastConsultations" component={PastConsultationsScreen} />
    <ProfileStack.Screen name="NotesPrescriptions" component={NotesPrescriptionsScreen} />
    <ProfileStack.Screen name="SavedResources" component={SavedResourcesScreen} />
    <ProfileStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
  </ProfileStack.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.sageDeep,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'home-variant' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreStackNavigator}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BookTab"
        component={BookStackNavigator}
        options={{
          title: 'Book',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SessionsTab"
        component={SessionsStackNavigator}
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -10 },
    height: 84,
    paddingBottom: 12,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Outfit',
  },
  tabItem: {
    paddingTop: 2,
  },
});