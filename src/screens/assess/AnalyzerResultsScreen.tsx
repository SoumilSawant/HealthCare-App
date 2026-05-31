import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ExploreStackParamList, 'ResultsCheckIn'>;

export const AnalyzerResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { score } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.primary}>Results Check-in</Typography>
        <Card style={styles.scoreCard}>
          <Typography variant="h1" color={colors.primary}>{score}</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Overall emotional strain score</Typography>
        </Card>

        <Card style={styles.noteCard} variant="outline">
          <Typography variant="body" color={colors.textSecondary}>
            Your check-in is complete. Continue with resources or book an expert from the Book tab.
          </Typography>
        </Card>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ResourceBank')}>
          <Typography variant="bodySemibold" color={colors.primary}>Open Resource Bank</Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  scoreCard: { alignItems: 'center', paddingVertical: spacing.xl },
  noteCard: { backgroundColor: colors.surface },
  linkButton: { alignItems: 'center', padding: spacing.m },
});
