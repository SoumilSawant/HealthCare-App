import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { colors, spacing, layout, typography } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [inputValue, setInputValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { t } = useAuth();
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotDone]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
        </View>

        <Typography variant="h2" color={colors.primary}>{otpSent ? t('verifyIdentity') : t('signInTitle')}</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>{t('signInSubtitle')}</Typography>

        {!otpSent ? (
          <>
            <View style={styles.tabRow}>
              <Chip label={t('mobile')} active={method === 'mobile'} onPress={() => setMethod('mobile')} />
              <Chip label={t('email')} active={method === 'email'} onPress={() => setMethod('email')} />
            </View>

            <TextInput
              style={styles.input}
              placeholder={method === 'mobile' ? '+91 99999 99999' : 'name@example.com'}
              keyboardType={method === 'mobile' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              value={inputValue}
              onChangeText={setInputValue}
              placeholderTextColor={colors.textLight}
            />
            <Button title={t('getOtp')} onPress={() => setOtpSent(true)} disabled={inputValue.length < 5} style={styles.buttonGap} />
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="0000"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
              placeholderTextColor={colors.textLight}
            />
            <Button
              title={t('verifyContinue')}
              onPress={() => navigation.navigate('ConsentPrivacy')}
              disabled={otp.length !== 4}
              style={styles.buttonGap}
            />
            <TouchableOpacity onPress={() => setOtpSent(false)}>
              <Typography variant="captionSemibold" align="center" color={colors.primary}>{t('changeNumberResend')}</Typography>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l },
  stepRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.l, marginTop: spacing.m },
  stepDot: { width: 24, height: 6, borderRadius: 4, backgroundColor: colors.border },
  stepDotDone: { backgroundColor: colors.primaryDeep },
  stepDotActive: { backgroundColor: colors.primary },
  subtitle: { marginTop: spacing.s, marginBottom: spacing.l },
  tabRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.m },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    ...typography.body,
    color: colors.textPrimary,
  },
  otpInput: { textAlign: 'center', fontSize: 30, letterSpacing: 10, fontWeight: '700' },
  buttonGap: { marginTop: spacing.l },
});
