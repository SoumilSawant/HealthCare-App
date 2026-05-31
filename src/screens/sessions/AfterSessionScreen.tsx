import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SessionsStackParamList, 'AfterSession'>;

const moods = ['Calmer', 'Neutral', 'Still anxious'];

export const AfterSessionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.primary}>After Session</Typography>
        <Typography variant="body" color={colors.textSecondary}>How do you feel after your session?</Typography>

        <View style={styles.row}>
          {moods.map((mood) => (
            <Chip key={mood} label={mood} active={selectedMood === mood} onPress={() => setSelectedMood(mood)} />
          ))}
        </View>

        <Button title="Back to Sessions" disabled={!selectedMood} onPress={() => navigation.navigate('MySessions')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  row: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
});
