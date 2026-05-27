import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<AssessStackParamList, 'AnalyzerResults'>;

export const AnalyzerResultsScreen: React.FC<Props> = ({ route }) => {
  const { score } = route.params;
  const navigation = useNavigation<any>();

  let interpretation = "You're experiencing some mild stress, which is completely normal. A little self-care could go a long way.";
  if (score > 4) {
    interpretation = "You're dealing with moderate emotional strain. Speaking with a professional could help you navigate these feelings.";
  }
  if (score > 7) {
    interpretation = "Your responses indicate significant distress. We strongly recommend booking a session with one of our experts.";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.scoreHeader}>
          <View style={styles.scoreCircle}>
            <Typography variant="h1" color={colors.primary}>{score}</Typography>
            <Typography variant="caption" color={colors.textSecondary}>/ 9</Typography>
          </View>
          <Typography variant="h3" color={colors.primary} style={{ marginTop: spacing.m }}>
            Assessment Complete
          </Typography>
          <Typography variant="body" color={colors.textSecondary} align="center" style={{ marginTop: spacing.s, paddingHorizontal: spacing.l }}>
            {interpretation}
          </Typography>
        </View>

        <Typography variant="h3" color={colors.textPrimary} style={styles.actionTitle}>
          Recommended Next Steps
        </Typography>

        <View style={styles.actionMap}>
          {/* Action 1 */}
          <Card style={styles.actionCard} onPress={() => {}}>
            <View style={[styles.iconBadge, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="call" size={24} color="#0284C7" />
            </View>
            <View style={styles.actionText}>
              <Typography variant="bodySemibold" color={colors.textPrimary}>Short Consultation</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Quick 15-min call to gain clarity.</Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </Card>

          {/* Action 2 */}
          <Card style={styles.actionCard} onPress={() => navigation.navigate('DoctorDiscovery')}>
            <View style={[styles.iconBadge, { backgroundColor: '#FEF08A' }]}>
              <Ionicons name="medical" size={24} color="#CA8A04" />
            </View>
            <View style={styles.actionText}>
              <Typography variant="bodySemibold" color={colors.textPrimary}>Book an Expert</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Detailed 45-min therapeutic session.</Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </Card>

          {/* Action 3 */}
          <Card style={styles.actionCard} onPress={() => navigation.navigate('ResourcesTab')}>
            <View style={[styles.iconBadge, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="library" size={24} color="#16A34A" />
            </View>
            <View style={styles.actionText}>
              <Typography variant="bodySemibold" color={colors.textPrimary}>Resource Bank</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Self-help tools, meditation & reading.</Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.l,
    paddingBottom: spacing.xxl,
  },
  scoreHeader: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusLarge,
    ...layout.shadowSubtle,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionTitle: {
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  actionMap: {
    gap: spacing.m,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  actionText: {
    flex: 1,
  },
});
