import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { LanguageConsentScreen } from '../screens/auth/LanguageConsentScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OtpLoginScreen } from '../screens/auth/OtpLoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ConsentScreen } from '../screens/auth/ConsentScreen';
import { ProfileSetupScreen } from '../screens/auth/ProfileSetupScreen';
import { DoctorLoginScreen } from '../screens/auth/DoctorLoginScreen';
import { DoctorRegisterScreen } from '../screens/auth/DoctorRegisterScreen';
import { DoctorPendingScreen } from '../screens/auth/DoctorPendingScreen';

import { AuthWebLayout } from '../components/AuthWebLayout';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <AuthWebLayout>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LanguageConsent" component={LanguageConsentScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpLogin" component={OtpLoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Consent" component={ConsentScreen} />
        <Stack.Screen name="Profile" component={ProfileSetupScreen} />
        <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
        <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
        <Stack.Screen name="DoctorPending" component={DoctorPendingScreen} />
      </Stack.Navigator>
    </AuthWebLayout>
  );
};
