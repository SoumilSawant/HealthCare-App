import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SessionsStackParamList, 'AfterSession'>;

export const AfterSessionScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            Session summary
          </Typography>
        </View>

        <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.m }}>
          Counselling notes from your doctor
        </Typography>
        <View style={styles.card}>
          <View style={[styles.lineSm, { width: '85%' }]} />
          <View style={styles.lineSm} />
          <View style={[styles.lineSm, { width: '70%' }]} />
        </View>
        <TouchableOpacity style={[styles.btnGhost, { marginVertical: spacing.l }]}>
          <Typography variant="bodySemibold" color={colors.ink}>📲 Send to my WhatsApp</Typography>
        </TouchableOpacity>

        <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.m }}>
          Documents
        </Typography>
        <View style={styles.docCard}>
          <Typography variant="body" color={colors.ink}>📄 Breathing exercise.pdf</Typography>
          <View style={styles.badge}>
            <Typography variant="xs" color={colors.ink} style={{ fontWeight: '500' }}>Get</Typography>
          </View>
        </View>
        <View style={styles.docCard}>
          <Typography variant="body" color={colors.ink}>💊 Prescription.pdf</Typography>
          <View style={styles.badge}>
            <Typography variant="xs" color={colors.ink} style={{ fontWeight: '500' }}>Get</Typography>
          </View>
        </View>

        <Typography variant="h3" color={colors.ink} style={{ marginTop: spacing.xl, marginBottom: spacing.m, textAlign: 'center' }}>
          How was your session?
        </Typography>
        <View style={styles.stars}>
          {['★', '★', '★', '★', '☆'].map((star, idx) => (
            <Typography key={idx} variant="display" color={star === '★' ? colors.gold : colors.inkFaint}>
              {star}
            </Typography>
          ))}
        </View>
        <View style={[styles.card, { height: 56, justifyContent: 'center', marginBottom: spacing.xl }]}>
          <View style={[styles.lineSm, { width: '70%', backgroundColor: colors.lineSoft }]} />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SessionsList')}>
          <Typography variant="bodySemibold" color={colors.surface}>Submit rating</Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.l,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    gap: spacing.s,
    ...layout.shadowSubtle,
  },
  lineSm: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
  },
  btnGhost: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.inkFaint,
    borderRadius: layout.borderRadiusLarge,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: layout.borderRadiusSmall,
    marginBottom: spacing.s,
    ...layout.shadowSubtle,
  },
  badge: {
    backgroundColor: colors.lineSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderColor: colors.lineSoft,
  },
  btn: {
    backgroundColor: colors.sageDeep,
    paddingVertical: 14,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
