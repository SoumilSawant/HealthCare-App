import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

 type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeDashboard'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" color={colors.primary}>Home Dashboard</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Welcome back. Choose your next support action.
        </Typography>

        <Card style={styles.heroCard} variant="elevated">
          <Typography variant="h3" color={colors.primary}>Daily Check-in</Typography>
          <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
            Use Explore tab for mood bucket assessment and results.
          </Typography>
        </Card>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.85}>
            <Ionicons name="compass-outline" size={24} color={colors.primary} />
            <Typography variant="bodySemibold" style={styles.gridLabel}>Explore</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.85}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Typography variant="bodySemibold" style={styles.gridLabel}>Book Doctor</Typography>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.crisisCard}
          onPress={() => navigation.navigate('CrisisSafety')}
          activeOpacity={0.85}
        >
          <View>
            <Typography variant="bodySemibold" color={colors.error}>Crisis Support</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Immediate safety resources and helplines</Typography>
          </View>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.error} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.l, paddingBottom: spacing.xxl },
  subtitle: { marginTop: spacing.s, marginBottom: spacing.l },
  heroCard: { marginBottom: spacing.l },
  grid: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.l },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius,
    padding: spacing.l,
    alignItems: 'center',
    ...layout.shadowSubtle,
  },
  gridLabel: { marginTop: spacing.s },
  crisisCard: {
    backgroundColor: colors.crisisBg,
    borderRadius: layout.borderRadius,
    padding: spacing.l,
    borderColor: '#efcaca',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
