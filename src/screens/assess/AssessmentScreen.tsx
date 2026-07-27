import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AssessStackParamList, 'Assessment'>;

const QUESTIONS = [
  "Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?",
  "How often have you been feeling down, depressed, or hopeless?",
  "How often have you had trouble falling or staying asleep, or sleeping too much?",
  "How often have you felt tired or had little energy?",
  "How often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?"
];

const OPTIONS = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day"
];

export const AssessmentScreen = ({ route, navigation }: Props) => {
  const { title } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const selectedOption = answers[currentQuestionIndex];

  const handleNext = () => {
    if (selectedOption === undefined) return;
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate mock score
      const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
      navigation.navigate('AnalyzerResults', { score: totalScore });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.sageDeep} align="center">
            {title}
          </Typography>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <Typography variant="small" color={colors.inkSoft}>
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </Typography>

        <Typography variant="displaySmall" color={colors.ink} style={styles.questionText}>
          {QUESTIONS[currentQuestionIndex]}
        </Typography>

        <View style={styles.optionsContainer}>
          {OPTIONS.map((option, index) => {
            const isSelected = selectedOption === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.qopt, isSelected && styles.qoptOn]}
                onPress={() => setAnswers({ ...answers, [currentQuestionIndex]: index })}
                activeOpacity={0.8}
              >
                <View style={[styles.rad, isSelected && styles.radOn]}>
                  {isSelected && <View style={styles.radInner} />}
                </View>
                <Typography variant="body" color={colors.ink} style={{ flex: 1 }}>
                  {option}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btn, styles.btnNeutral, { flex: 1 }]} onPress={handleBack}>
            <Typography variant="bodySemibold" color={colors.ink}>Back</Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, { flex: 1.6, opacity: selectedOption === undefined ? 0.5 : 1 }]} 
            onPress={handleNext}
            disabled={selectedOption === undefined}
          >
            <Typography variant="bodySemibold" color={colors.surface}>
              {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish →' : 'Next →'}
            </Typography>
          </TouchableOpacity>
        </View>
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
    width: '100%', maxWidth: 768, alignSelf: 'center',

    flex: 1,
    padding: spacing.l,
  },
  header: {
    paddingVertical: spacing.s,
    marginBottom: spacing.l,
  },
  progressContainer: {
    marginBottom: spacing.s,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.line,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.sage,
  },
  questionText: {
    marginTop: spacing.s,
    marginBottom: spacing.xl,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: spacing.s,
    flex: 1,
  },
  qopt: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    ...layout.shadowSubtle,
  },
  qoptOn: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageTint,
  },
  rad: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.inkSoft,
    marginRight: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radOn: {
    borderColor: colors.sageDeep,
  },
  radInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sageDeep,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.m,
    paddingTop: spacing.m,
  },
  btn: {
    backgroundColor: colors.sageDeep,
    paddingVertical: 14,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNeutral: {
    backgroundColor: colors.lineSoft,
  },
});
