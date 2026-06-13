import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirmed'>;

export const BookingConfirmedScreen = () => {
  const navigation = useNavigation<any>();

  const handleViewSessions = () => {
    // Navigate to SessionsTab
    navigation.navigate('SessionsTab');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            All set!
          </Typography>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarLarge}>
            <Typography variant="display" color={colors.surface}>✓</Typography>
          </View>
          <Typography variant="displayXS" color={colors.ink} style={{ fontWeight: '600', marginBottom: 4 }}>
            You're booked!
          </Typography>
          <Typography variant="small" color={colors.inkSoft}>
            with Dr. Sharma · Today 12:00 PM
          </Typography>

          <View style={styles.card}>
            <View style={styles.row}>
              <Typography variant="small" color={colors.inkSoft}>Reason</Typography>
              <Typography variant="bodySemibold" color={colors.ink} style={{ fontSize: 13 }}>Anxiety</Typography>
            </View>
            <View style={styles.row}>
              <Typography variant="small" color={colors.inkSoft}>Mode</Typography>
              <Typography variant="bodySemibold" color={colors.ink} style={{ fontSize: 13 }}>Video · 1:1</Typography>
            </View>
            <View style={styles.row}>
              <Typography variant="small" color={colors.inkSoft}>Session link</Typography>
              <View style={styles.badge}>
                <Typography variant="xs" color={colors.ink} style={{ fontWeight: '500' }}>Active 15 min before</Typography>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Typography variant="bodySemibold" color={colors.surface}>Add to calendar</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} onPress={handleViewSessions}>
          <Typography variant="bodySemibold" color={colors.ink}>View in My Sessions</Typography>
        </TouchableOpacity>
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
    padding: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.l,
  },
  content: {
    alignItems: 'center',
    paddingTop: spacing.l,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginTop: spacing.l,
    gap: 14,
    ...layout.shadowSubtle,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.lineSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
    backgroundColor: colors.bg,
    gap: spacing.m,
  },
  btn: {
    backgroundColor: colors.sageDeep,
    paddingVertical: 14,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
