import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AssessStackParamList, 'AnalyzerResults'>;

export const AnalyzerResultsScreen = ({ route, navigation }: Props) => {
  const { score } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.scoreRing}>
          <Typography variant="display" color={colors.ink}>
            {score}<Typography variant="h3" color={colors.inkSoft}>/15</Typography>
          </Typography>
          <Typography variant="bodySemibold" color={colors.inkSoft} style={{ marginTop: 4 }}>
            Moderate
          </Typography>
        </View>

        <View style={[styles.card, { alignItems: 'center', marginBottom: spacing.xl }]}>
          <Typography variant="body" color={colors.ink} align="center" style={{ lineHeight: 22 }}>
            Your responses suggest <Typography variant="bodySemibold" color={colors.ink}>moderate stress</Typography>. This is common and very workable — here are good next steps.
          </Typography>
        </View>

        <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.m }}>
          What would help most
        </Typography>

        <TouchableOpacity style={styles.cardRow} activeOpacity={0.8} onPress={() => navigation.navigate('Safety')}>
          <View style={styles.avatar}>
            <Typography variant="h3">💬</Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="bodySemibold" color={colors.ink}>Short Consultation</Typography>
            <Typography variant="small" color={colors.inkSoft}>Quick session with a doctor</Typography>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cardRow, styles.recommendedCard]} activeOpacity={0.8}>
          <View style={[styles.avatar, { backgroundColor: colors.sage }]}>
            <Typography variant="h3">⭐</Typography>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="bodySemibold" color={colors.ink}>Expert Consultation</Typography>
              <View style={styles.badge}>
                <Typography variant="xs" color={colors.sageDeep} style={{ fontWeight: '600' }}>Recommended</Typography>
              </View>
            </View>
            <Typography variant="small" color={colors.inkSoft}>Full detailed session</Typography>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardRow} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Typography variant="h3">📚</Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="bodySemibold" color={colors.ink}>Resource Bank</Typography>
            <Typography variant="small" color={colors.inkSoft}>Self-help videos & articles</Typography>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGhost}>
          <Typography variant="bodySemibold" color={colors.ink}>Save to my profile</Typography>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    width: '100%', maxWidth: 768, alignSelf: 'center',

    padding: spacing.l,
    paddingTop: spacing.xl,
  },
  scoreRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.l,
    borderTopColor: colors.lineSoft, // Simulating a partially filled ring
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    ...layout.shadowSubtle,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginBottom: spacing.m,
    gap: spacing.m,
    ...layout.shadowSubtle,
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: colors.sage,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.sageTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  btnGhost: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
  },
});
