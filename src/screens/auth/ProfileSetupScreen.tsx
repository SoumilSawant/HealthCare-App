import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import FrappeAuthService from '../../services/FrappeAuthService';

type Props = NativeStackScreenProps<any, 'Profile'>;

export const ProfileSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [livingStatus, setLivingStatus] = useState<'family' | 'alone' | null>('family');
  const [therapyExperience, setTherapyExperience] = useState<'yes' | 'no' | null>('no');
  const [consentChecked, setConsentChecked] = useState(false);
  const { login } = useAuth();

  const mobileNumber = route.params?.mobileNumber || '';
  const password = route.params?.password || '';

  const handleContinue = async () => {
    if (name && age && gender && consentChecked) {
      await FrappeAuthService.saveLocalAccount({
        mobileNumber,
        password,
        fullName: name,
      });

      login({
        userId: mobileNumber || name,
        mobileNumber,
        fullName: name,
        age: Number(age),
        gender,
        livingStatus: livingStatus || 'family',
        therapyExperience: therapyExperience === 'yes',
      });
    }
  };

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Typography
        variant="small"
        color={selected ? colors.sageDeep : colors.inkSoft}
        style={{ fontWeight: selected ? '600' : '500' }}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Appbar */}
      <View style={styles.appbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Typography variant="displaySmall" color={colors.ink}>
            ‹
          </Typography>
        </TouchableOpacity>
        <Typography variant="h2" color={colors.ink} style={styles.appbarTitle}>
          Tell us about you
        </Typography>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Typography variant="xs" color={colors.inkFaint} style={styles.progressText}>
            Step 1 of 3 · Helps us recommend the right support
          </Typography>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Typography variant="small" color={colors.inkSoft} style={styles.label}>
            Name
          </Typography>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.inkFaint}
            />
          </View>
        </View>

        {/* Age & Gender Row */}
        <View style={styles.rowContainer}>
          <View style={[styles.fieldContainer, { flex: 1 }]}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>
              Age
            </Typography>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="—"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                placeholderTextColor={colors.inkFaint}
              />
            </View>
          </View>

          <View style={[styles.fieldContainer, { flex: 1.5, marginLeft: spacing.s }]}>
            <Typography variant="small" color={colors.inkSoft} style={styles.label}>
              Gender
            </Typography>
            <View>
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setGenderOpen(!genderOpen)}
              >
                <Typography variant="small" color={gender ? colors.ink : colors.inkFaint}>
                  {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Select gender'}
                </Typography>
                <Typography variant="small" color={colors.inkFaint}>
                  {genderOpen ? '▴' : '▾'}
                </Typography>
              </TouchableOpacity>

              {genderOpen && (
                <View style={styles.dropdownMenu}>
                  {(['male', 'female', 'other'] as const).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.dropdownItem, gender === option && styles.dropdownItemSelected]}
                      onPress={() => {
                        setGender(option);
                        setGenderOpen(false);
                      }}
                    >
                      <Typography variant="small" color={gender === option ? colors.sageDeep : colors.inkSoft}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Living Status */}
        <View style={styles.fieldContainer}>
          <Typography variant="small" color={colors.inkSoft} style={styles.label}>
            Living status
          </Typography>
          <View style={styles.chipsContainer}>
            <Chip
              label="With family"
              selected={livingStatus === 'family'}
              onPress={() => setLivingStatus('family')}
            />
            <Chip
              label="Alone"
              selected={livingStatus === 'alone'}
              onPress={() => setLivingStatus('alone')}
            />
          </View>
        </View>

        {/* Therapy Experience */}
        <View style={styles.fieldContainer}>
          <Typography variant="small" color={colors.inkSoft} style={styles.label}>
            Been to therapy before?
          </Typography>
          <View style={styles.chipsContainer}>
            <Chip
              label="Yes"
              selected={therapyExperience === 'yes'}
              onPress={() => setTherapyExperience('yes')}
            />
            <Chip
              label="No"
              selected={therapyExperience === 'no'}
              onPress={() => setTherapyExperience('no')}
            />
          </View>
        </View>

        {/* Consent */}
        <View style={styles.consentItem}>
          <TouchableOpacity
            style={[styles.checkbox, consentChecked && styles.checkboxChecked]}
            onPress={() => setConsentChecked(!consentChecked)}
          >
            {consentChecked && (
              <Typography variant="bodySemibold" color={colors.surface}>
                ✓
              </Typography>
            )}
          </TouchableOpacity>
          <Typography variant="body" color={colors.inkSoft}>
            I consent to share this for my care.
          </Typography>
        </View>

        {/* Button */}
        <Button
          title="Continue"
          variant="primary"
          onPress={handleContinue}
          disabled={!name || !age || !gender || !consentChecked}
          style={styles.button}
        />

        {/* Note */}
        <View style={styles.note}>
          <Typography variant="xs" color="#7d6321">
            <Typography variant="xs" style={{ fontWeight: '700' }}>
              💡 Smart signup
            </Typography>
            {' The profile form is now shorter and sends you directly to Home when completed.'}
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  appbarTitle: {
    flex: 1,
    marginLeft: spacing.m,
  },
  scrollContent: {
    padding: spacing.ml,
    paddingVertical: spacing.m,
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
    paddingHorizontal: spacing.m,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    fontFamily: 'Outfit',
  },
  dropdownField: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownMenu: {
    marginTop: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...layout.shadowSm,
  },
  dropdownItem: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  dropdownItemSelected: {
    backgroundColor: colors.sageSoft,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 30,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...layout.shadowSm,
  },
  chipSelected: {
    backgroundColor: colors.sageSoft,
    borderColor: colors.sage,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.m,
    marginBottom: spacing.m,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
    marginTop: spacing.xs,
  },
  checkboxChecked: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  button: {
    marginVertical: spacing.s,
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
