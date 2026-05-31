import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavProp = NativeStackNavigationProp<SessionsStackParamList, 'MySessions'>;

export const MySessionsScreen = () => {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.primary}>My Sessions</Typography>

        <Card style={styles.sessionCard}>
          <Typography variant="bodySemibold">Today • 4:00 PM</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Dr. Shruti Sharma • Video session</Typography>
          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('InSessionVideoCall', { sessionId: 's1' })}>
            <Typography variant="captionSemibold" color={colors.primary}>Join Session</Typography>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  sessionCard: { gap: spacing.s },
  link: { alignSelf: 'flex-start', marginTop: spacing.s },
});
