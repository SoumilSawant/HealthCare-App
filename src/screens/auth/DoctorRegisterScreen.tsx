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
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { AuthStackParamList } from '../../navigation/types';
import FrappeAuthService from '../../services/FrappeAuthService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'DoctorRegister'>;

const SPECIALIZATIONS = [
  'Psychiatrist',
  'Psychologist',
  'Clinical Counselor',
  'Therapist',
  'Mental Health Nurse',
  'Social Worker',
  'Other',
];

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];

const StepIndicator = ({ step, total }: { step: number; total: number }) => (
  <View style={stepStyles.container}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[
          stepStyles.dot,
          i < step ? stepStyles.dotDone : i === step - 1 ? stepStyles.dotActive : stepStyles.dotInactive,
        ]}
      />
    ))}
    <Typography variant="small" color={colors.inkSoft} style={stepStyles.label}>
      Step {step} of {total}
    </Typography>
  </View>
);

const stepStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.l, gap: spacing.s },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: colors.sageDeep, borderRadius: 4 },
  dotDone: { backgroundColor: colors.sage },
  dotInactive: { backgroundColor: colors.line },
  label: { marginLeft: 'auto' as any },
});

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  secureTextEntry?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
  maxLength?: number;
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  icon,
  rightElement,
  maxLength,
}: InputFieldProps) => (
  <View style={styles.fieldContainer}>
    <Typography variant="small" color={colors.inkSoft} style={styles.label}>{label}</Typography>
    <View style={styles.inputWrapper}>
      {icon && <Ionicons name={icon} size={18} color={colors.inkFaint} style={styles.inputIcon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.inkFaint}
        autoCapitalize="none"
        maxLength={maxLength}
      />
      {rightElement}
    </View>
  </View>
);

export const DoctorRegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [experience, setExperience] = useState('');

  // Step 2 fields
  const [medicalRegNumber, setMedicalRegNumber] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [degreeCertNote, setDegreeCertNote] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isMobileValid = /^\d{10}$/.test(mobile.trim());

  const step1Valid =
    fullName.trim().length >= 2 &&
    isEmailValid &&
    isMobileValid &&
    password.length >= 6 &&
    password === confirmPassword &&
    specialization.length > 0 &&
    experience.length > 0;

  const step2Valid = medicalRegNumber.trim().length >= 5 && selectedLanguages.length > 0;

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang],
    );
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!step2Valid) return;
    setError('');
    setLoading(true);
    try {
      await FrappeAuthService.registerDoctor({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: mobile.trim(),
        password: password,
        specialization,
        yearsOfExperience: parseInt(experience, 10) || 0,
        medicalRegNumber: medicalRegNumber.trim(),
        languages: selectedLanguages,
        degreeCertificatePath: degreeCertNote.trim() || undefined,
      });
      navigation.replace('DoctorPending', { email: email.trim().toLowerCase() });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Appbar */}
        <View style={styles.appbar}>
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </TouchableOpacity>
          <Typography variant="bodySemibold" color={colors.ink} style={{ marginLeft: spacing.m }}>
            Doctor Registration
          </Typography>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <StepIndicator step={step} total={2} />

          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.crisis} style={{ marginRight: 6 }} />
              <Typography variant="small" color={colors.crisis} style={{ flex: 1 }}>{error}</Typography>
            </View>
          )}

          {step === 1 && (
            <>
              <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.m }}>
                Personal Information
              </Typography>

              <InputField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Dr. Jane Smith" icon="person-outline" />
              <InputField label="Professional Email" value={email} onChangeText={setEmail} placeholder="doctor@example.com" icon="mail-outline" keyboardType="email-address" />
              <InputField label="Mobile Number" value={mobile} onChangeText={setMobile} placeholder="10-digit number" icon="call-outline" keyboardType="phone-pad" maxLength={10} />

              {/* Password */}
              <InputField
                label="Create Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                icon="lock-closed-outline"
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.inkFaint} />
                  </TouchableOpacity>
                }
              />
              <InputField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                icon="lock-closed-outline"
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.inkFaint} />
                  </TouchableOpacity>
                }
              />

              {/* Specialization picker */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>Specialization</Typography>
                <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowSpecPicker(v => !v)} activeOpacity={0.8}>
                  <Ionicons name="medkit-outline" size={18} color={colors.inkFaint} style={styles.inputIcon} />
                  <Typography variant="body" color={specialization ? colors.ink : colors.inkFaint} style={{ flex: 1 }}>
                    {specialization || 'Select specialization'}
                  </Typography>
                  <Ionicons name={showSpecPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.inkFaint} style={{ marginRight: spacing.m }} />
                </TouchableOpacity>
                {showSpecPicker && (
                  <View style={styles.dropdownList}>
                    {SPECIALIZATIONS.map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.dropdownItem, specialization === s && styles.dropdownItemActive]}
                        onPress={() => { setSpecialization(s); setShowSpecPicker(false); }}
                      >
                        <Typography variant="body" color={specialization === s ? colors.sageDeep : colors.ink}>{s}</Typography>
                        {specialization === s && <Ionicons name="checkmark" size={16} color={colors.sageDeep} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <InputField
                label="Years of Experience"
                value={experience}
                onChangeText={(t: string) => setExperience(t.replace(/\D/g, ''))}
                placeholder="e.g. 5"
                icon="time-outline"
                keyboardType="numeric"
                maxLength={2}
              />

              <Button
                title="Continue"
                variant="primary"
                onPress={handleNext}
                disabled={!step1Valid}
                style={styles.button}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.m }}>
                Professional Credentials
              </Typography>

              <InputField
                label="Medical Registration Number"
                value={medicalRegNumber}
                onChangeText={setMedicalRegNumber}
                placeholder="MCI/State Council number"
                icon="card-outline"
              />

              {/* Languages */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Languages Spoken (select all that apply)
                </Typography>
                <View style={styles.chipGrid}>
                  {LANGUAGES.map(lang => (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.chip, selectedLanguages.includes(lang) && styles.chipActive]}
                      onPress={() => toggleLanguage(lang)}
                      activeOpacity={0.75}
                    >
                      <Typography
                        variant="small"
                        color={selectedLanguages.includes(lang) ? colors.sageDeep : colors.inkSoft}
                        style={{ fontWeight: selectedLanguages.includes(lang) ? '600' : '400' }}
                      >
                        {lang}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Degree Certificate - placeholder */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Degree Certificate
                </Typography>
                <TouchableOpacity style={styles.uploadArea} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="file-upload-outline" size={28} color={colors.inkFaint} />
                  <Typography variant="small" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
                    Tap to upload (PDF / Image)
                  </Typography>
                  <Typography variant="xs" color={colors.inkFaint}>
                    {/* TODO: Implement file picker */}
                    Feature coming soon
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Admin notice */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={18} color={colors.sageDeep} style={{ marginRight: spacing.s, marginTop: 1 }} />
                <Typography variant="small" color={colors.inkSoft} style={{ flex: 1, lineHeight: 18 }}>
                  Your application will be reviewed by our admin team. You'll be notified once your account is approved. This typically takes 1–2 business days.
                </Typography>
              </View>

              <Button
                title="Submit Application"
                variant="primary"
                onPress={handleSubmit}
                disabled={!step2Valid}
                loading={loading}
                style={styles.button}
              />
              <Button
                title="Back"
                variant="ghost"
                onPress={() => setStep(1)}
                style={styles.button}
              />
            </>
          )}
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
    paddingVertical: spacing.m,
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
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
  pickerTrigger: {
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
  dropdownList: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  dropdownItemActive: { backgroundColor: colors.sageTint },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageTint,
  },
  uploadArea: {
    height: 100,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: { marginVertical: spacing.s },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.sageTint,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
});
