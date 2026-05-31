import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'ConsentPrivacy'>;

export const ConsentPrivacyScreen = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotDone]} />
          <View style={[styles.stepDot, styles.stepDotDone]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <Typography variant="h2" color={colors.primary}>Privacy & Consent</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Your records are encrypted and used only for your care journey.
        </Typography>

        <View style={styles.privacyCard}>
          <Typography variant="bodySemibold" color={colors.textPrimary}>What we collect</Typography>
          <Typography variant="caption" color={colors.textSecondary}>• Basic profile details</Typography>
          <Typography variant="caption" color={colors.textSecondary}>• Assessment responses</Typography>
          <Typography variant="caption" color={colors.textSecondary}>• Session booking and notes</Typography>
        </View>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsentGiven(!consentGiven)} activeOpacity={0.8}>
          <View style={[styles.checkbox, consentGiven && styles.checkboxActive]}>
            {consentGiven ? <Ionicons name="checkmark" size={14} color={colors.textInverse} /> : null}
          </View>
          <Typography variant="caption" color={colors.textSecondary} style={styles.checkboxText}>
            I agree to the Privacy Policy and consent to secure processing of my information.
          </Typography>
        </TouchableOpacity>

        <View style={styles.bottomArea}>
          <Button title="Continue" disabled={!consentGiven} onPress={() => navigation.navigate('RegisterProfile')} />
        </View>
      </View>
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
  privacyCard: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.l, gap: spacing.s },
  checkboxRow: { flexDirection: 'row', marginTop: spacing.l },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxText: { flex: 1 },
  bottomArea: { marginTop: 'auto' },
});
