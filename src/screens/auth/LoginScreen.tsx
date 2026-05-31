import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout, typography } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();

  const handleLogin = () => {
    if (mobileNumber.length > 5 && password.length > 0) {
      login();
    }
  };

  const handleSendOtp = () => {
    if (mobileNumber.length > 5) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!showOtp ? (
            <>
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
                  Welcome back
                </Typography>
                <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
                  Log in to continue your journey
                </Typography>
              </View>

              {/* Mobile Number Field */}
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
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Password
                </Typography>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={colors.inkFaint}
                  />
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Typography variant="small" color={colors.sageDeep} align="right">
                  Forgot password?
                </Typography>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                title="Log in"
                variant="primary"
                onPress={handleLogin}
                disabled={mobileNumber.length < 5 || password.length === 0}
                style={styles.button}
              />

              {/* OTP Alternative */}
              <Button
                title="Log in with OTP instead"
                variant="outline"
                onPress={() => setShowOtp(true)}
                style={styles.button}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Typography variant="small" color={colors.inkFaint} style={styles.dividerText}>
                  or continue with
                </Typography>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Typography variant="bodyLarge">🇬</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Typography variant="bodyLarge">🍎</Typography>
                </TouchableOpacity>
              </View>

              {/* Signup Link */}
              <View style={styles.signupContainer}>
                <Typography variant="body" color={colors.inkSoft} align="center">
                  New here?
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Typography variant="bodySemibold" color={colors.sageDeep}> Create an account</Typography>
                  </TouchableOpacity>
                </Typography>
              </View>

              {/* Note */}
              <View style={styles.note}>
                <Typography variant="xs" color={colors.goldSoft === '#f6edd8' ? colors.gold : '#7d6321'}>
                  <Typography variant="xs" style={{ fontWeight: '700' }}>
                    💡 Login offers
                  </Typography>
                  {' OTP as a one-tap alternative to password — important for users who return rarely and won\'t remember a password. Google/Apple wired but optional.'}
                </Typography>
              </View>
            </>
          ) : (
            <>
              {/* OTP Screen */}
              <View style={styles.header}>
                <Typography variant="displayXS" color={colors.ink} align="center">
                  {otpSent ? 'Verify your number' : 'Log in with OTP'}
                </Typography>
                <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
                  {otpSent ? `Enter the 4-digit code sent to ${mobileNumber}` : 'Enter your mobile number'}
                </Typography>
              </View>

              {!otpSent ? (
                <>
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
                      />
                    </View>
                  </View>

                  <Button
                    title="Send OTP"
                    variant="primary"
                    onPress={handleSendOtp}
                    disabled={mobileNumber.length < 5}
                    style={styles.button}
                  />
                </>
              ) : (
                <>
                  <View style={styles.fieldContainer}>
                    <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                      4-Digit Code
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
                      />
                    </View>
                  </View>

                  <Button
                    title="Verify & Continue"
                    variant="primary"
                    onPress={handleVerifyOtp}
                    disabled={otp.length !== 4}
                    style={styles.button}
                  />

                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Typography variant="body" color={colors.sageDeep} align="center">
                      Change number / Resend
                    </Typography>
                  </TouchableOpacity>
                </>
              )}

              {/* Back Button */}
              <TouchableOpacity onPress={() => { setShowOtp(false); setOtpSent(false); setOtp(''); }}>
                <Typography variant="body" color={colors.inkSoft} align="center" style={styles.backButton}>
                  ← Back to password login
                </Typography>
              </TouchableOpacity>
            </>
          )}
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
  forgotButton: {
    alignItems: 'flex-end',
    marginVertical: spacing.xs,
    marginBottom: spacing.m,
  },
  button: {
    marginVertical: spacing.s,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    marginHorizontal: spacing.m,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.s,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...layout.shadowSm,
  },
  signupContainer: {
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
  backButton: {
    marginTop: spacing.l,
  },
});
