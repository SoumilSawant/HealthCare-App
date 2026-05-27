import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Booking'>;

const dates = ['12 May', '13 May', '14 May'];
const times = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM'];

export const BookingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    // Simulate payment delay
    setTimeout(() => {
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBadge}>
            <Ionicons name="checkmark" size={64} color={colors.surface} />
          </View>
          <Typography variant="h2" color={colors.primary} style={{ marginTop: spacing.xl }}>Booking Confirmed!</Typography>
          <Typography variant="body" color={colors.textSecondary} align="center" style={{ marginTop: spacing.s, paddingHorizontal: spacing.l }}>
            Your session has been successfully scheduled. You will receive a meeting link shortly.
          </Typography>
          <Button 
            title="Back to Home" 
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: spacing.xxl, width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary}>Select Time Slot</Typography>
        </View>

        <Typography variant="h3" style={styles.sectionTitle}>Date</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
          {dates.map((date) => (
            <TouchableOpacity 
              key={date}
              style={[styles.chip, selectedDate === date && styles.chipActive]}
              onPress={() => setSelectedDate(date)}
            >
              <Typography variant="bodySemibold" color={selectedDate === date ? colors.surface : colors.textPrimary}>
                {date}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Typography variant="h3" style={[styles.sectionTitle, { marginTop: spacing.l }]}>Time</Typography>
        <View style={styles.grid}>
          {times.map((time) => (
            <TouchableOpacity 
              key={time}
              style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Typography variant="body" color={selectedTime === time ? colors.surface : colors.textPrimary}>
                {time}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Typography variant="body" color={colors.textSecondary}>Total Payable</Typography>
          <Typography variant="h3" color={colors.primary}>₹1200</Typography>
        </View>
        <Button 
          title="Proceed to Pay" 
          onPress={handlePayment} 
          disabled={!selectedTime}
        />
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
    padding: spacing.l,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  scrollSection: {
    flexGrow: 0,
    marginBottom: spacing.m,
  },
  chip: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: layout.borderRadiusLarge,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.m,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  timeChip: {
    width: '30%',
    paddingVertical: spacing.m,
    alignItems: 'center',
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    padding: spacing.l,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIconBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...layout.shadow,
  },
});
