import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<AssessStackParamList, 'MoodAnalyzer'>;

const BUCKETS = [
  { id: '1', title: 'Individual wellbeing', icon: '🌱' },
  { id: '2', title: 'Career counseling', icon: '💼' },
  { id: '3', title: 'Adolescent counseling', icon: '🎒' },
  { id: '4', title: 'Family counseling', icon: '🏠' },
  { id: '5', title: 'Couple / marital', icon: '💞' },
  { id: '6', title: 'Anxiety / Depression', icon: '🌧️' },
];

export const MoodAnalyzerScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSelectBucket = (bucket: typeof BUCKETS[0]) => {
    navigation.navigate('Assessment', { bucketId: bucket.id, title: bucket.title });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="displayXS" color={colors.ink} style={{ marginBottom: 4 }}>
            What's on your mind?
          </Typography>
          <Typography variant="small" color={colors.inkSoft} style={{ marginBottom: 8 }}>
            Pick one area. No wrong answers — this is a check-in, not a test.
          </Typography>
        </View>

        <View style={styles.list}>
          {BUCKETS.map((bucket) => (
            <TouchableOpacity
              key={bucket.id}
              style={styles.card}
              onPress={() => handleSelectBucket(bucket)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Typography variant="h2">{bucket.icon}</Typography>
                </View>
                <View>
                  <Typography variant="bodySemibold" color={colors.ink}>
                    {bucket.title}
                  </Typography>
                  <View style={styles.lineSm} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
            </TouchableOpacity>
          ))}
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
  container: {
    width: '100%', maxWidth: 768, alignSelf: 'center',

    padding: spacing.l,
    paddingTop: spacing.xxl,
  },
  header: {
    marginBottom: spacing.l,
  },
  list: {
    gap: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...layout.shadowSubtle,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineSm: {
    height: 3,
    backgroundColor: colors.line,
    borderRadius: 2,
    marginTop: 6,
    width: '70%',
  },
});
