import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { mockAssessmentBuckets, mockAssessmentQuestions } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<AssessStackParamList, 'MoodAnalyzer'>;

export const MoodAnalyzerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [step, setStep] = useState<'bucket' | 'quiz'>('bucket');
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleStartQuiz = (bucketId: string) => {
    setSelectedBucket(bucketId);
    setStep('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    const questionId = mockAssessmentQuestions[currentQuestionIndex].id;
    setAnswers({ ...answers, [questionId]: optionIndex });
    
    if (currentQuestionIndex < mockAssessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate mock score
      const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0) + optionIndex;
      // Navigate to results
      navigation.navigate('AnalyzerResults', { score: totalScore });
      
      // Reset state for future visits
      setTimeout(() => {
        setStep('bucket');
        setCurrentQuestionIndex(0);
        setAnswers({});
      }, 1000);
    }
  };

  if (step === 'bucket') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Typography variant="h2" color={colors.primary}>What brings you here?</Typography>
            <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
              Select a category to personalize your assessment.
            </Typography>
          </View>
          
          <View style={styles.grid}>
            {mockAssessmentBuckets.map((bucket) => (
              <TouchableOpacity
                key={bucket.id}
                style={[styles.bucketCard, { backgroundColor: bucket.color }]}
                onPress={() => handleStartQuiz(bucket.id)}
                activeOpacity={0.8}
              >
                <Ionicons name={bucket.icon as any} size={32} color={colors.primary} />
                <Typography variant="bodySemibold" color={colors.primary} align="center" style={{ marginTop: spacing.m }}>
                  {bucket.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = mockAssessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / mockAssessmentQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Typography variant="caption" color={colors.textSecondary} align="center" style={{ marginTop: spacing.s }}>
            Question {currentQuestionIndex + 1} of {mockAssessmentQuestions.length}
          </Typography>
        </View>

        <View style={styles.questionContainer}>
          <Typography variant="h2" color={colors.primary} style={styles.questionText}>
            {currentQuestion.text}
          </Typography>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Card
                key={index}
                variant="outline"
                style={styles.optionCard}
                onPress={() => handleAnswer(index)}
              >
                <Typography variant="bodySemibold" color={colors.primary}>
                  {option}
                </Typography>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.l,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.l,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bucketCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: layout.borderRadiusLarge,
    padding: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  progressContainer: {
    marginTop: spacing.m,
    marginBottom: spacing.xxl,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    marginBottom: spacing.xxl,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: spacing.m,
  },
  optionCard: {
    paddingVertical: spacing.l,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.secondaryLight,
    borderWidth: 2,
  },
});
