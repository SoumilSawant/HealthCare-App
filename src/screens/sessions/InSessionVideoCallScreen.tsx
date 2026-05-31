import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SessionsStackParamList, 'InSessionVideoCall'>;

export const InSessionVideoCallScreen: React.FC<Props> = ({ route, navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.videoStage}>
          <Typography variant="h3" color={colors.textInverse}>In-Session Video Call</Typography>
          <Typography variant="caption" color={colors.textInverse}>Session ID: {route.params.sessionId}</Typography>
        </View>
        <Button title="End Session" onPress={() => navigation.navigate('AfterSession', { sessionId: route.params.sessionId })} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  videoStage: {
    flex: 1,
    backgroundColor: colors.primaryDeep,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
  },
});
