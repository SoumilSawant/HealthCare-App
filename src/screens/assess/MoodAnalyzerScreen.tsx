import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { mockAssessmentBuckets } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExploreStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'MoodBucket'>;

export const MoodAnalyzerScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="h2" color={colors.primary}>Mood Analyzer</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Select your focus bucket to begin assessment.
        </Typography>

        <View style={styles.grid}>
          {mockAssessmentBuckets.map((bucket) => (
            <TouchableOpacity
              key={bucket.id}
              style={[styles.bucketCard, { backgroundColor: bucket.color }]}
              onPress={() => navigation.navigate('AssessmentQuestions', { bucketId: bucket.id, bucketTitle: bucket.title })}
              activeOpacity={0.85}
            >
              <Ionicons name={bucket.icon as any} size={28} color={colors.primary} />
              <Typography variant="bodySemibold" color={colors.primary} align="center" style={{ marginTop: spacing.s }}>
                {bucket.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.l },
  subtitle: { marginTop: spacing.s, marginBottom: spacing.l },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bucketCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
});
