import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SessionsStackParamList, 'SessionsList'>;

export const SessionsScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            My sessions
          </Typography>
        </View>

        <View style={styles.segmentControl}>
          {['Upcoming', 'Past'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.segment, activeTab === tab && styles.segmentOn]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Typography variant="bodySemibold" color={activeTab === tab ? colors.ink : colors.inkSoft}>
                {tab}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Upcoming' && (
          <View style={styles.list}>
            
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Typography variant="h2">👩‍⚕️</Typography>
                  </View>
                  <View>
                    <Typography variant="bodySemibold" color={colors.ink}>Dr. A. Sharma</Typography>
                    <Typography variant="small" color={colors.inkSoft}>Today · 12:00 · Expert</Typography>
                  </View>
                </View>
                <View style={styles.badgeGold}>
                  <Typography variant="xs" color={colors.gold} style={{ fontWeight: '600' }}>in 15 min</Typography>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.btnSm} 
                onPress={() => navigation.navigate('InSession', { sessionId: '1' })}
              >
                <Typography variant="bodySemibold" color={colors.surface}>Join session →</Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Typography variant="h2">👨‍⚕️</Typography>
                  </View>
                  <View>
                    <Typography variant="bodySemibold" color={colors.ink}>Dr. R. Patil</Typography>
                    <Typography variant="small" color={colors.inkSoft}>Fri · 4:00 · Short</Typography>
                  </View>
                </View>
              </View>
              <Typography variant="small" color={colors.gold} style={{ marginVertical: 10 }}>
                Cancel before 2h → 80% refund
              </Typography>
              <View style={[styles.rowBetween, { gap: spacing.s }]}>
                <TouchableOpacity style={[styles.btnNeutral, { flex: 1 }]}>
                  <Typography variant="bodySemibold" color={colors.ink}>Reschedule</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnNeutral, { flex: 1 }]}>
                  <Typography variant="bodySemibold" color={colors.ink}>Cancel</Typography>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}

        {activeTab === 'Past' && (
          <View style={styles.list}>
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Typography variant="h2">👩‍⚕️</Typography>
                  </View>
                  <View>
                    <Typography variant="bodySemibold" color={colors.ink}>Dr. A. Sharma</Typography>
                    <Typography variant="small" color={colors.inkSoft}>Yesterday · Expert</Typography>
                  </View>
                </View>
                <View style={[styles.badgeGold, { backgroundColor: colors.sageTint }]}>
                  <Typography variant="xs" color={colors.sageDeep} style={{ fontWeight: '600' }}>Completed</Typography>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.btnNeutral, { marginTop: spacing.m }]} 
                onPress={() => navigation.navigate('AfterSession', { sessionId: '2' })}
              >
                <Typography variant="bodySemibold" color={colors.ink}>View notes & rating</Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    paddingTop: spacing.s,
  },
  header: {
    marginBottom: spacing.l,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: colors.lineSoft,
    borderRadius: layout.borderRadiusSmall,
    padding: 2,
    marginBottom: spacing.xl,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: layout.borderRadiusSmall - 2,
  },
  segmentOn: {
    backgroundColor: colors.surface,
    ...layout.shadowSubtle,
  },
  list: {
    gap: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    ...layout.shadowSubtle,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGold: {
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnSm: {
    backgroundColor: colors.sageDeep,
    paddingVertical: 10,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
  },
  btnNeutral: {
    backgroundColor: colors.bg,
    paddingVertical: 10,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
});
