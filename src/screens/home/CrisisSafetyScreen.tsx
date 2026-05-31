import React from 'react';
import { View, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme/theme';

export const CrisisSafetyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.error}>You are not alone</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          If you are in immediate danger, contact local emergency services now.
        </Typography>

        <View style={styles.card}>
          <Typography variant="bodySemibold" color={colors.textPrimary}>24/7 Support</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Tele MANAS Helpline: 14416</Typography>
          <Button
            title="Call 14416"
            onPress={() => Linking.openURL('tel:14416')}
            style={{ marginTop: spacing.m }}
          />
        </View>

        <View style={styles.card}>
          <Typography variant="bodySemibold" color={colors.textPrimary}>Grounding Checklist</Typography>
          <Typography variant="caption" color={colors.textSecondary}>1. Breathe slowly for 60 seconds</Typography>
          <Typography variant="caption" color={colors.textSecondary}>2. Move to a safe space</Typography>
          <Typography variant="caption" color={colors.textSecondary}>3. Contact a trusted person</Typography>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  subtitle: { marginTop: spacing.s },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.l },
});
