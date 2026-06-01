import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import FrappeAuthService from '../../services/FrappeAuthService';
import { FirebaseAuthService } from '../../services/FirebaseAuthService';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, t, language } = useAuth();

  const normalizeMobileNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return digits.slice(2);
    return digits;
  };

  const getErrorMessage = (fallback: string, errorValue: unknown) => {
    if (errorValue instanceof Error) return errorValue.message || fallback;
    return fallback;
  };

  const handleLogin = async () => {
    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    if (normalizedMobile.length !== 10 || password.trim().length === 0) return;

    setError('');
    setLoading(true);
    try {
      const response = await FrappeAuthService.loginWithPassword(normalizedMobile, password.trim());
      login({ userId: response.user, mobileNumber: normalizedMobile, fullName: response.full_name || response.user });
    } catch (err) {
      setError(getErrorMessage('Password login failed. Check the backend URL and credentials.', err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await FirebaseAuthService.signInWithGoogle();
      
      const firebaseToken = await FirebaseAuthService.getFirebaseIdToken();
      if (!firebaseToken) throw new Error('Failed to get secure token.');
      
      // Mock response for Frappe
      const mockResponse = { user: userCredential.user.email || 'google_user', full_name: userCredential.user.displayName || 'Google User' };
      login({ userId: mockResponse.user, mobileNumber: '', fullName: mockResponse.full_name, email: userCredential.user.email || undefined });
    } catch (err: any) {
      // Ignore user cancelled error from native module
      if (err.code !== 'SIGN_IN_CANCELLED') {
        setError(getErrorMessage('Google Sign-In failed.', err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Appbar */}
        <View style={styles.appbar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <Typography variant="displaySmall" color={colors.surface}>🌿</Typography>
            </View>
          </View>

          <View style={styles.header}>
            <Typography variant="displayXS" color={colors.ink} align="center">{t('signInTitle')}</Typography>
            <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>{t('signInSubtitle')}</Typography>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Typography variant="small" color={colors.crisis} align="center">{error}</Typography>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>{t('mobileNumber')}</Typography>
            <View style={styles.inputWrapper}>
              <View style={styles.prefixContainer}>
                <Typography variant="bodySemibold" color={colors.inkSoft}>+91</Typography>
              </View>
              <TextInput style={styles.input} placeholder="Enter your number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} placeholderTextColor={colors.inkFaint} maxLength={10} />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>
              {language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'}
            </Typography>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor={colors.inkFaint} />
            </View>
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Typography variant="small" color={colors.sageDeep} align="right">
              {language === 'hi' ? 'पासवर्ड भूल गए?' : language === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot password?'}
            </Typography>
          </TouchableOpacity>

          <Button 
            title={language === 'hi' ? 'लॉग इन करें' : language === 'mr' ? 'लॉग इन करा' : 'Log in'} 
            variant="primary" 
            onPress={handleLogin} 
            disabled={normalizeMobileNumber(mobileNumber).length !== 10 || password.length === 0} 
            loading={loading} 
            style={styles.button} 
          />

          <Button 
            title={language === 'hi' ? 'ओटीपी से लॉग इन करें' : language === 'mr' ? 'ओटीपी द्वारे लॉग इन करा' : 'Log in with OTP instead'} 
            variant="ghost" 
            onPress={() => navigation.navigate('OtpLogin')} 
            style={styles.button} 
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Typography variant="small" color={colors.inkFaint} style={styles.dividerText}>
              {language === 'hi' ? 'या इससे जारी रखें' : language === 'mr' ? 'किंवा याद्वारे पुढे जा' : 'or continue with'}
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={loading}>
              <MaterialCommunityIcons name="google" size={24} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Typography variant="body" color={colors.inkSoft} align="center">
              {language === 'hi' ? 'यहाँ नए हैं? ' : language === 'mr' ? 'येथे नवीन आहात? ' : 'New here? '}
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Typography variant="bodySemibold" color={colors.sageDeep}>
                  {language === 'hi' ? 'खाता बनाएं' : language === 'mr' ? 'खाते तयार करा' : 'Create an account'}
                </Typography>
              </TouchableOpacity>
            </Typography>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  appbar: {
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : spacing.s,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    ...layout.shadowSubtle,
  },
  scrollContent: { padding: spacing.ml, paddingVertical: spacing.s, paddingBottom: spacing.xxl },
  logoContainer: { alignItems: 'center', marginBottom: spacing.l },
  logoMark: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  header: { marginBottom: spacing.l },
  subtitle: { marginTop: spacing.s },
  fieldContainer: { marginBottom: spacing.m },
  label: { marginBottom: spacing.xs, color: colors.inkSoft },
  inputWrapper: { height: 50, borderWidth: 1.5, borderColor: colors.line, borderRadius: layout.borderRadiusSmall, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  prefixContainer: { paddingHorizontal: spacing.m, borderRightWidth: 1.5, borderColor: colors.line, height: '100%', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: spacing.m, fontSize: 14, color: colors.ink, fontFamily: 'Outfit', ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) },
  forgotButton: { alignItems: 'flex-end', marginVertical: spacing.xs, marginBottom: spacing.m },
  button: { marginVertical: spacing.s },
  signupContainer: { marginTop: spacing.l },
  errorBox: { backgroundColor: colors.crisisSoft, borderRadius: layout.borderRadiusSmall, borderWidth: 1, borderColor: colors.crisis, padding: spacing.m, marginBottom: spacing.m },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.l },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { marginHorizontal: spacing.m },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
  socialButton: { flex: 1, height: 60, borderWidth: 1.5, borderColor: colors.line, borderRadius: layout.borderRadiusSmall, justifyContent: 'center', alignItems: 'center', marginHorizontal: spacing.xs },
});
