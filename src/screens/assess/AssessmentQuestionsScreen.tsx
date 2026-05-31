import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { mockAssessmentQuestions } from '../../data/mockData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ExploreStackParamList, 'AssessmentQuestions'>;

export const AssessmentQuestionsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const question = mockAssessmentQuestions[index];
  const progress = ((index + 1) / mockAssessmentQuestions.length) * 100;

  const answer = (value: number) => {
    const total = score + value;
    if (index === mockAssessmentQuestions.length - 1) {
      navigation.navigate('ResultsCheckIn', { score: total });
      return;
    }
    setScore(total);
    setIndex((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h3" color={colors.primary}>{route.params.bucketTitle}</Typography>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Typography variant="caption" color={colors.textSecondary}>Question {index + 1} / {mockAssessmentQuestions.length}</Typography>

        <Typography variant="h2" color={colors.primary} style={styles.question}>{question.text}</Typography>

        <View style={styles.optionWrap}>
          {question.options.map((option, optionIndex) => (
            <Card key={option} variant="outline" onPress={() => answer(optionIndex + 1)} style={styles.optionCard}>
              <Typography variant="bodySemibold">{option}</Typography>
            </Card>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l },
  progressBg: { height: 8, borderRadius: 6, backgroundColor: colors.border, marginTop: spacing.m, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  question: { marginTop: spacing.l, marginBottom: spacing.l },
  optionWrap: { gap: spacing.m },
  optionCard: { backgroundColor: colors.surface },
});
