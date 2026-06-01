
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import FrappeAuthService from '../../services/FrappeAuthService';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const normalizeMobileNumber = (value: string) => value.trim().replace(/\s+/g, '');

  const getErrorMessage = (fallback: string, errorValue: unknown) => {
    if (errorValue instanceof Error) return errorValue.message || fallback;
    return fallback;
  };

  const handleLogin = async () => {
    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    if (normalizedMobile.length <= 5 || password.trim().length === 0) return;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <Typography variant="displaySmall" color={colors.surface}>🌿</Typography>
            </View>
          </View>

          <View style={styles.header}>
            <Typography variant="displayXS" color={colors.ink} align="center">Welcome back</Typography>
            <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>Log in with your Frappe account</Typography>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Typography variant="small" color={colors.crisis} align="center">{error}</Typography>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>Mobile number</Typography>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="+91 ｜ Enter your number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} placeholderTextColor={colors.inkFaint} />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>Password</Typography>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor={colors.inkFaint} />
            </View>
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Typography variant="small" color={colors.sageDeep} align="right">Forgot password?</Typography>
          </TouchableOpacity>

          <Button title="Log in" variant="primary" onPress={handleLogin} disabled={mobileNumber.length < 5 || password.length === 0} loading={loading} style={styles.button} />

          <View style={styles.signupContainer}>
            <Typography variant="body" color={colors.inkSoft} align="center">New here?
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Typography variant="bodySemibold" color={colors.sageDeep}> Create an account</Typography>
              </TouchableOpacity>
            </Typography>
          </View>

          <View style={styles.note}>
            <Typography variant="xs" color={colors.goldSoft === '#f6edd8' ? colors.gold : '#7d6321'}>
              <Typography variant="xs" style={{ fontWeight: '700' }}>💡 Saved password</Typography>
              {' Use the password you created during signup to log back in.'}
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
  scrollContent: { padding: spacing.ml, paddingVertical: spacing.l },
  logoContainer: { alignItems: 'center', marginBottom: spacing.l },
  logoMark: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  header: { marginBottom: spacing.l },
  subtitle: { marginTop: spacing.s },
  fieldContainer: { marginBottom: spacing.m },
  label: { marginBottom: spacing.xs, color: colors.inkSoft },
  inputWrapper: { height: 50, borderWidth: 1.5, borderColor: colors.line, borderRadius: layout.borderRadiusSmall, backgroundColor: colors.surface, justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: spacing.m, fontSize: 14, color: colors.ink, fontFamily: 'Outfit' },
  forgotButton: { alignItems: 'flex-end', marginVertical: spacing.xs, marginBottom: spacing.m },
  button: { marginVertical: spacing.s },
  signupContainer: { marginTop: spacing.l },
  note: { backgroundColor: colors.goldSoft, borderRadius: layout.borderRadiusSmall, padding: spacing.m, marginTop: spacing.l, borderWidth: 1, borderColor: '#ecdcb0' },
  errorBox: { backgroundColor: colors.crisisSoft, borderRadius: layout.borderRadiusSmall, borderWidth: 1, borderColor: colors.crisis, padding: spacing.m, marginBottom: spacing.m },
});
