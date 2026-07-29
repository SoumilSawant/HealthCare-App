import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import { FirebaseAuthService } from '../../services/FirebaseAuthService';
import FrappeAuthService from '../../services/FrappeAuthService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpLogin'>;

export const OtpLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const normalizeMobileNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return digits.slice(2);
    return digits;
  };

  const getErrorMessage = (fallback: string, errorValue: unknown) => {
    if (errorValue instanceof Error) return errorValue.message || fallback;
    return fallback;
  };

  const handleSendOtp = async () => {
    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    if (normalizedMobile.length !== 10) return;

    setError('');
    setLoading(true);
    try {
      const confirmationResult = await FirebaseAuthService.requestOtp(normalizedMobile);
      setConfirmation(confirmationResult);
      setStep('verify');
    } catch (err) {
      setError(getErrorMessage('Failed to send OTP. Please try again.', err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6 || !confirmation) return;

    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    setError('');
    setLoading(true);
    try {
      // 1. Verify with Firebase
      await FirebaseAuthService.verifyOtp(confirmation, otp);
      
      // 2. Get Firebase ID token
      const firebaseToken = await FirebaseAuthService.getFirebaseIdToken();
      if (!firebaseToken) throw new Error('Failed to get secure token.');
      
      // 3. Send token to Frappe backend to create session
      // For now, we mock the response until Frappe backend is ready
      // const response = await FrappeAuthService.loginWithFirebase(firebaseToken);
      const mockResponse = { user: normalizedMobile, full_name: 'Firebase User' };
      
      login({ userId: mockResponse.user, mobileNumber: normalizedMobile, fullName: mockResponse.full_name });
    } catch (err) {
      setError(getErrorMessage('Invalid OTP code.', err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.backButton} onPress={() => step === 'verify' ? setStep('request') : navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.ink} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <Typography variant="displaySmall" color={colors.surface}>🌿</Typography>
            </View>
          </View>

          <View style={styles.header}>
            <Typography variant="displayXS" color={colors.ink} align="center">
              {step === 'request' ? 'Log in with OTP' : 'Verify OTP'}
            </Typography>
            <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
              {step === 'request' ? 'Enter your mobile number' : `Enter the 6-digit code sent to +91 ${normalizeMobileNumber(mobileNumber)}`}
            </Typography>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Typography variant="small" color={colors.crisis} align="center">{error}</Typography>
            </View>
          )}

          {step === 'request' ? (
            <View style={styles.fieldContainer}>
              <Typography variant="small" color={colors.inkSoft} style={styles.label}>Mobile number</Typography>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixContainer}>
                  <Typography variant="bodySemibold" color={colors.inkSoft}>+91</Typography>
                </View>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter your number" 
                  keyboardType="phone-pad" 
                  value={mobileNumber} 
                  onChangeText={setMobileNumber} 
                  placeholderTextColor={colors.inkFaint} 
                  maxLength={10}
                  autoFocus
                />
              </View>
            </View>
          ) : (
            <View style={styles.fieldContainer}>
              <Typography variant="small" color={colors.inkSoft} style={styles.label}>6-Digit OTP</Typography>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="------" 
                  keyboardType="number-pad" 
                  maxLength={6}
                  value={otp} 
                  onChangeText={setOtp} 
                  placeholderTextColor={colors.inkFaint} 
                  autoFocus
                />
              </View>
            </View>
          )}

          <Button 
            title={step === 'request' ? 'Send OTP' : 'Verify & Log in'} 
            variant="primary" 
            onPress={step === 'request' ? handleSendOtp : handleVerifyOtp} 
            disabled={step === 'request' ? normalizeMobileNumber(mobileNumber).length !== 10 : otp.length < 6} 
            loading={loading} 
            style={styles.button} 
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  scrollContent: { padding: spacing.ml, paddingVertical: spacing.l, width: '100%', maxWidth: 480, alignSelf: 'center' },
  backButton: { marginBottom: spacing.m },
  logoContainer: { alignItems: 'center', marginBottom: spacing.l },
  logoMark: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  header: { marginBottom: spacing.l },
  subtitle: { marginTop: spacing.s },
  fieldContainer: { marginBottom: spacing.m },
  label: { marginBottom: spacing.xs, color: colors.inkSoft },
  inputWrapper: { height: 50, borderWidth: 1.5, borderColor: colors.line, borderRadius: layout.borderRadiusSmall, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  prefixContainer: { paddingHorizontal: spacing.m, borderRightWidth: 1.5, borderColor: colors.line, height: '100%', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: spacing.m, fontSize: 14, color: colors.ink, fontFamily: 'Outfit', letterSpacing: 2, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) },
  button: { marginVertical: spacing.s, marginTop: spacing.l },
  errorBox: { backgroundColor: colors.crisisSoft, borderRadius: layout.borderRadiusSmall, borderWidth: 1, borderColor: colors.crisis, padding: spacing.m, marginBottom: spacing.m },
});
