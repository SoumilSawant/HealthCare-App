import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabsParamList, HomeStackParamList, AssessStackParamList } from './types';
import { colors } from '../theme/theme';

import { HomeScreen } from '../screens/home/HomeScreen';
import { DoctorDiscoveryScreen } from '../screens/booking/DoctorDiscoveryScreen';
import { BookingScreen } from '../screens/booking/BookingScreen';

import { MoodAnalyzerScreen } from '../screens/assess/MoodAnalyzerScreen';
import { AnalyzerResultsScreen } from '../screens/assess/AnalyzerResultsScreen';

import { ResourceBankScreen } from '../screens/resources/ResourceBankScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AssessStack = createNativeStackNavigator<AssessStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="DoctorDiscovery" component={DoctorDiscoveryScreen} />
    <HomeStack.Screen name="Booking" component={BookingScreen} />
  </HomeStack.Navigator>
);

const AssessStackNavigator = () => (
  <AssessStack.Navigator screenOptions={{ headerShown: false }}>
    <AssessStack.Screen name="MoodAnalyzer" component={MoodAnalyzerScreen} />
    <AssessStack.Screen name="AnalyzerResults" component={AnalyzerResultsScreen} />
  </AssessStack.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AssessTab') {
            iconName = focused ? 'heart-half' : 'heart-half-outline';
          } else if (route.name === 'ResourcesTab') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="AssessTab" 
        component={AssessStackNavigator} 
        options={{ title: 'Assess' }} 
      />
      <Tab.Screen 
        name="ResourcesTab" 
        component={ResourceBankScreen} 
        options={{ title: 'Resources' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};
