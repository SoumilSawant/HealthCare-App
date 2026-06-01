import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const normalizeMobileNumber = (value: string) => value.trim().replace(/\s+/g, '');

  const handleContinue = () => {
    const normalizedMobile = normalizeMobileNumber(mobileNumber);

    if (normalizedMobile.length <= 5 || password.trim().length < 6) {
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      return;
    }

    navigation.navigate('Consent', {
      mobileNumber: normalizedMobile,
      password: password.trim(),
      verified: false,
    });
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
                autoFocus
              />
            </View>
          </View>

          <Typography variant="xs" color={colors.inkFaint} style={styles.helperText}>
            We will use this number to continue your onboarding.
          </Typography>

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>
              Create password
            </Typography>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Choose a password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={colors.inkFaint}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>
              Confirm password
            </Typography>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={colors.inkFaint}
              />
            </View>
          </View>

          <Typography variant="xs" color={colors.inkFaint} style={styles.helperText}>
            This password will be stored for future logins.
          </Typography>

          <Button
            title="Continue"
            variant="primary"
            onPress={handleContinue}
            disabled={mobileNumber.length < 5 || password.trim().length < 6 || password.trim() !== confirmPassword.trim()}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Typography variant="body" color={colors.inkSoft} align="center">
              Already have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Typography variant="bodySemibold" color={colors.sageDeep}>Log in</Typography>
              </TouchableOpacity>
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
