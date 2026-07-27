import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import FrappeAuthService from '../../services/FrappeAuthService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'DoctorLogin'>;

type LoginInputProps = React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
};

const LoginInput = ({ icon, rightElement, style, ...props }: LoginInputProps) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={18} color={colors.inkFaint} style={styles.inputIcon} />
    <TextInput {...props} style={[styles.input, style]} />
    {rightElement}
  </View>
);

export const DoctorLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsDoctor } = useAuth();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async () => {
    if (!isEmailValid || password.trim().length === 0) return;
    setError('');
    setLoading(true);
    try {
      const doctor = await FrappeAuthService.loginDoctor(email.trim().toLowerCase(), password.trim());

      if (doctor.approvalStatus === 'pending' || doctor.approvalStatus === 'rejected') {
        navigation.navigate('DoctorPending', {
          email: doctor.email,
          reason: doctor.rejectionReason,
        });
        return;
      }

      loginAsDoctor({
        userId: doctor.email,
        mobileNumber: doctor.mobileNumber,
        fullName: doctor.fullName,
        email: doctor.email,
        role: 'doctor',
        approvalStatus: 'approved',
        specialization: doctor.specialization,
        medicalRegNumber: doctor.medicalRegNumber,
      });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.appbar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <MaterialCommunityIcons name="stethoscope" size={30} color={colors.surface} />
            </View>
            <View style={styles.badge}>
              <Typography variant="xs" color={colors.sageDeep} style={{ fontWeight: '600' }}>
                Doctor Portal
              </Typography>
            </View>
          </View>

          <View style={styles.header}>
            <Typography variant="displayXS" color={colors.ink} align="center">
              Welcome, Doctor
            </Typography>
            <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
              Sign in to your professional account
            </Typography>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.crisis} style={{ marginRight: 6 }} />
              <Typography variant="small" color={colors.crisis} style={{ flex: 1 }}>{error}</Typography>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>Professional Email</Typography>
            <LoginInput
              icon="mail-outline"
              placeholder="doctor@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.inkFaint}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>Password</Typography>
            <LoginInput
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={colors.inkFaint}
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.inkFaint} />
                </TouchableOpacity>
              }
            />
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Typography variant="small" color={colors.sageDeep} align="right">
              Forgot password?
            </Typography>
          </TouchableOpacity>

          <Button
            title="Sign In"
            variant="primary"
            onPress={handleLogin}
            disabled={!isEmailValid || password.length === 0}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Typography variant="small" color={colors.inkFaint} style={styles.dividerText}>
              New to the platform?
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerCard}
            onPress={() => navigation.navigate('DoctorRegister')}
            activeOpacity={0.85}
          >
            <View style={styles.registerCardContent}>
              <View style={styles.registerIconWrapper}>
                <MaterialCommunityIcons name="account-plus-outline" size={22} color={colors.sageDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="bodySemibold" color={colors.ink}>Register as a Doctor</Typography>
                <Typography variant="small" color={colors.inkSoft} style={{ marginTop: 2 }}>
                  Submit your credentials for admin approval
                </Typography>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </View>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.sageDeep} style={{ marginRight: 6, marginTop: 1 }} />
            <Typography variant="small" color={colors.inkSoft} style={{ flex: 1, lineHeight: 18 }}>
              Doctor accounts are verified by our admin team before access is granted to ensure patient safety.
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
  scrollContent: {
    padding: spacing.ml,
    paddingVertical: spacing.s,
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  logoContainer: { alignItems: 'center', marginBottom: spacing.l },
  logoMark: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.sageDeep,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    ...layout.shadowSubtle,
  },
  badge: {
    backgroundColor: colors.sageTint,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.sageSoft,
  },
  header: { marginBottom: spacing.l },
  subtitle: { marginTop: spacing.s },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.crisisSoft,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.crisis,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  fieldContainer: { marginBottom: spacing.m },
  label: { marginBottom: spacing.xs, color: colors.inkSoft },
  inputWrapper: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: { marginLeft: spacing.m, marginRight: spacing.s },
  input: {
    flex: 1,
    paddingRight: spacing.m,
    fontSize: 14,
    color: colors.ink,
    fontFamily: 'Outfit',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  eyeButton: { paddingHorizontal: spacing.m },
  forgotButton: { alignItems: 'flex-end', marginBottom: spacing.m },
  button: { marginVertical: spacing.s },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.l },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { marginHorizontal: spacing.m },
  registerCard: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1.5,
    borderColor: colors.line,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...layout.shadowSubtle,
  },
  registerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  registerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.sageTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.sageTint,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginTop: spacing.s,
  },
});
