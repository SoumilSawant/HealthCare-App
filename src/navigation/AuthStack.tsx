import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { LanguageConsentScreen } from '../screens/auth/LanguageConsentScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ConsentPrivacyScreen } from '../screens/auth/ConsentPrivacyScreen';
import { RegisterProfileScreen } from '../screens/auth/RegisterProfileScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguageConsent" component={LanguageConsentScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ConsentPrivacy" component={ConsentPrivacyScreen} />
      <Stack.Screen name="RegisterProfile" component={RegisterProfileScreen} />
    </Stack.Navigator>
  );
};
