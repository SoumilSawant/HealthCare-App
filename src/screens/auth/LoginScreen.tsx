import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout, typography } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = () => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [inputValue, setInputValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { login, t } = useAuth();

  const handleSendOtp = () => {
    if (inputValue.length > 5) {
      setOtpSent(true);
    }
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      login();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary}>
            {otpSent ? t('verifyIdentity') : t('signInTitle')}
          </Typography>
          <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
            {otpSent 
              ? `${t('otpSentMsg')} ${inputValue}` 
              : t('signInSubtitle')}
          </Typography>
          {otpSent && (
            <View style={styles.tipContainer}>
              <Typography variant="captionSemibold" color={colors.primary}>
                {t('prototypeTip')}
              </Typography>
            </View>
          )}
        </View>

        {!otpSent ? (
          <View style={styles.form}>
            <View style={styles.tabs}>
              <TouchableOpacity 
                style={[styles.tab, method === 'mobile' && styles.activeTab]}
                onPress={() => setMethod('mobile')}
              >
                <Typography variant="bodySemibold" color={method === 'mobile' ? colors.primary : colors.textSecondary}>
                  {t('mobile')}
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, method === 'email' && styles.activeTab]}
                onPress={() => setMethod('email')}
              >
                <Typography variant="bodySemibold" color={method === 'email' ? colors.primary : colors.textSecondary}>
                  {t('email')}
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="captionSemibold" color={colors.textSecondary} style={styles.label}>
                {method === 'mobile' ? t('mobileNumber') : t('emailAddress')}
              </Typography>
              <TextInput
                style={styles.input}
                placeholder={method === 'mobile' ? '+91 99999 99999' : 'name@example.com'}
                keyboardType={method === 'mobile' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                value={inputValue}
                onChangeText={setInputValue}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <Button 
              title={t('getOtp')} 
              onPress={handleSendOtp}
              disabled={inputValue.length < 5}
              style={{ marginTop: spacing.l }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Typography variant="captionSemibold" color={colors.textSecondary} style={styles.label}>
                4-Digit Code
              </Typography>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="0000"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                placeholderTextColor={colors.textLight}
              />
            </View>
            <Button 
              title={t('verifyContinue')} 
              onPress={handleVerify}
              disabled={otp.length !== 4}
              style={{ marginTop: spacing.l }}
            />
            <TouchableOpacity style={styles.resendButton} onPress={() => setOtpSent(false)}>
              <Typography variant="bodySemibold" color={colors.primary} align="center">
                {t('changeNumberResend')}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.l,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  tipContainer: {
    marginTop: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.secondaryLight,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  form: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  inputContainer: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    ...typography.body,
    color: colors.textPrimary,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: 8,
    fontWeight: '700',
  },
  resendButton: {
    marginTop: spacing.xl,
    padding: spacing.m,
  },
});
