import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Signup'>;

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (mobileNumber.length > 5) {
      setOtpSent(true);
      // Here you would call the Frappe API to send OTP
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      // Navigate to Consent screen
      navigation.navigate('Consent', { mobileNumber, verified: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <Typography variant="displaySmall" color={colors.surface}>
                🌿
              </Typography>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Typography variant="displayXS" color={colors.ink} align="center">
              Create your account
            </Typography>
            <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
              Join Soul Place on your journey to wellness
            </Typography>
          </View>

          {!otpSent ? (
            <>
              {/* Step 1: Phone Number */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Mobile number
                </Typography>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="+91 ｜ Enter your number"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholderTextColor={colors.inkFaint}
                    autoFocus
                  />
                </View>
              </View>

              <Typography variant="xs" color={colors.inkFaint} style={styles.helperText}>
                We'll send you a verification code
              </Typography>

              <Button
                title="Send verification code"
                variant="primary"
                onPress={handleSendOtp}
                disabled={mobileNumber.length < 5}
                style={styles.button}
              />
            </>
          ) : (
            <>
              {/* Step 2: OTP Verification */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '50%' }]} />
                </View>
                <Typography variant="xs" color={colors.inkFaint} style={styles.progressText}>
                  Step 1 of 3 · Verifying your number
                </Typography>
              </View>

              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  4-Digit verification code
                </Typography>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="0000"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                    placeholderTextColor={colors.inkFaint}
                    autoFocus
                  />
                </View>
              </View>

              <Typography variant="xs" color={colors.inkFaint} style={styles.helperText}>
                Code sent to {mobileNumber}
              </Typography>

              <Button
                title="Verify & Continue"
                variant="primary"
                onPress={handleVerifyOtp}
                disabled={otp.length !== 4}
                style={styles.button}
              />

              <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(''); }}>
                <Typography variant="body" color={colors.sageDeep} align="center">
                  Use different number / Resend code
                </Typography>
              </TouchableOpacity>
            </>
          )}

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <Typography variant="body" color={colors.inkSoft} align="center">
              Already have an account? <Typography variant="bodySemibold" color={colors.sageDeep}>Log in</Typography>
            </Typography>
          </View>

          {/* Note */}
          <View style={styles.note}>
            <Typography variant="xs" color="#7d6321">
              <Typography variant="xs" style={{ fontWeight: '700' }}>
                💡 Quick signup
              </Typography>
              {' We just need your phone number to get started. Your information stays private and secure.'}
            </Typography>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.ml,
    paddingVertical: spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  header: {
    marginBottom: spacing.l,
  },
  subtitle: {
    marginTop: spacing.s,
  },
  progressContainer: {
    marginBottom: spacing.l,
  },
  progressBar: {
    height: 7,
    backgroundColor: colors.lineSoft,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: spacing.m,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.sage,
  },
  progressText: {
    marginBottom: spacing.s,
  },
  fieldContainer: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.inkSoft,
  },
  inputWrapper: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.m,
    fontSize: 14,
    color: colors.ink,
    fontFamily: 'Outfit',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: '700',
  },
  helperText: {
    marginBottom: spacing.m,
    marginLeft: spacing.xs,
  },
  button: {
    marginVertical: spacing.s,
  },
  loginContainer: {
    marginTop: spacing.l,
  },
  note: {
    backgroundColor: colors.goldSoft,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginTop: spacing.l,
    borderWidth: 1,
    borderColor: '#ecdcb0',
  },
});
