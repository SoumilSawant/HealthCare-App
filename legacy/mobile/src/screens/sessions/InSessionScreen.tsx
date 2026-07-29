import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<SessionsStackParamList, 'InSession'>;

export const InSessionScreen = ({ navigation }: Props) => {
  const handleEndCall = () => {
    navigation.navigate('AfterSession', { sessionId: '1' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.videoArea}>
        <Typography variant="display" style={{ color: '#5d6560', fontSize: 64 }}>👩‍⚕️</Typography>
        
        <View style={styles.selfView}>
          <Typography variant="displayXS" style={{ color: '#5d6560' }}>🙂</Typography>
        </View>
        
        <View style={styles.timerBadge}>
          <Typography variant="small" color={colors.surface} style={{ fontWeight: '600' }}>⏱ 23:14 left</Typography>
        </View>

        <View style={styles.controlsBar}>
          {['🎤', '📷', '💬', '🖥️'].map((icon, idx) => (
            <TouchableOpacity key={idx} style={styles.controlBtn}>
              <Typography variant="h2">{icon}</Typography>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: colors.crisis }]} onPress={handleEndCall}>
            <Typography variant="h2">📵</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoArea}>
        <Typography variant="small" color={colors.inkSoft}>
          Timer · in-session chat · doctor-controlled screen-share · rejoin same link if you drop
        </Typography>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#23272b',
  },
  videoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selfView: {
    position: 'absolute',
    top: spacing.l,
    right: spacing.l,
    width: 80,
    height: 104,
    backgroundColor: '#31363a',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBadge: {
    position: 'absolute',
    top: spacing.l,
    left: spacing.l,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controlsBar: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.m,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: {
    backgroundColor: colors.surface,
    padding: spacing.l,
  },
});
