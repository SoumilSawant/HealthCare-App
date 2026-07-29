import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Consent'>;

export const ConsentScreen: React.FC<Props> = ({ navigation, route }) => {
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const mobileNumber = route.params?.mobileNumber || '';
  const password = route.params?.password || '';

  const handleContinue = () => {
    if (consent1 && consent2) {
      navigation.navigate('Profile', { mobileNumber, password });
    }
  };

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
          Before we begin
        </Typography>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar with Shield Icon */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarLarge}>
            <Typography variant="displaySmall" color={colors.sageDeep}>
              🛡️
            </Typography>
          </View>
        </View>

        {/* Heading */}
        <Typography variant="displayXS" color={colors.ink} align="center" style={styles.heading}>
          Your privacy matters
        </Typography>
        <Typography variant="body" color={colors.inkSoft} align="center" style={styles.subtitle}>
          Here's how we use, store and protect your information.
        </Typography>

        {/* Privacy Policy Card */}
        <TouchableOpacity style={styles.policyCard}>
          <View style={styles.placeholderLines}>
            <View style={[styles.line, { width: '85%' }]} />
            <View style={styles.line} />
            <View style={[styles.line, { width: '70%' }]} />
            <View style={[styles.line, { width: '50%' }]} />
          </View>
          <Typography variant="small" color={colors.sageDeep} style={styles.readMoreLink}>
            Read full Privacy Policy & Terms →
          </Typography>
        </TouchableOpacity>

        {/* Consent Items */}
        <View style={styles.consentItem}>
          <TouchableOpacity
            style={[styles.checkbox, consent1 && styles.checkboxChecked]}
            onPress={() => setConsent1(!consent1)}
          >
            {consent1 && (
              <Typography variant="bodySemibold" color={colors.surface}>
                ✓
              </Typography>
            )}
          </TouchableOpacity>
          <Typography variant="body" color={colors.inkSoft}>
            I understand how my data is used and stored.
          </Typography>
        </View>

        <View style={styles.consentItem}>
          <TouchableOpacity
            style={[styles.checkbox, consent2 && styles.checkboxChecked]}
            onPress={() => setConsent2(!consent2)}
          >
            {consent2 && (
              <Typography variant="bodySemibold" color={colors.surface}>
                ✓
              </Typography>
            )}
          </TouchableOpacity>
          <Typography variant="body" color={colors.inkSoft}>
            I agree to the Privacy Policy and Terms of Use.
          </Typography>
        </View>

        {/* Buttons */}
        <Button
          title="Accept & continue"
          variant="primary"
          onPress={handleContinue}
          disabled={!consent1 || !consent2}
          style={styles.button}
        />

        <Button
          title="Not now"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />

        {/* Note */}
        <View style={styles.note}>
          <Typography variant="xs" color="#7d6321">
            <Typography variant="xs" style={{ fontWeight: '700' }}>
              💡 Your consent
            </Typography>
            {' Reusable, version-stamped consent component — logged for audit. A declining user can still reach Emergency Helplines; we never trap someone behind a wall.'}
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
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.sageSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.l,
  },
  policyCard: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...layout.shadowSm,
  },
  placeholderLines: {
    marginBottom: spacing.m,
  },
  line: {
    height: 9,
    backgroundColor: colors.lineSoft,
    borderRadius: 6,
    marginVertical: spacing.xs,
  },
  readMoreLink: {
    marginTop: spacing.m,
    fontWeight: '600',
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
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
