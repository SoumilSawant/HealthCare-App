import React, { useMemo, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';
import { mockDoctors } from '../../data/mockData';

type Props = NativeStackScreenProps<BookStackParamList, 'SlotBookingPayment'>;

const dates = ['Mon 12', 'Tue 13', 'Wed 14'];
const slots = ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'];

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const doctor = useMemo(() => mockDoctors.find((d) => d.id === route.params.doctorId) ?? mockDoctors[0], [route.params.doctorId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="h2" color={colors.primary}>Slot Booking & Payment</Typography>
        <Typography variant="caption" color={colors.textSecondary}>{doctor.name}</Typography>

        <Typography variant="bodySemibold" style={styles.section}>Select date</Typography>
        <View style={styles.row}>
          {dates.map((date) => (
            <Chip key={date} label={date} active={selectedDate === date} onPress={() => setSelectedDate(date)} />
          ))}
        </View>

        <Typography variant="bodySemibold" style={styles.section}>Select slot</Typography>
        <View style={styles.rowWrap}>
          {slots.map((slot) => (
            <Chip key={slot} label={slot} active={selectedSlot === slot} onPress={() => setSelectedSlot(slot)} />
          ))}
        </View>

        <View style={styles.paymentCard}>
          <Typography variant="caption" color={colors.textSecondary}>Total Payable</Typography>
          <Typography variant="h3" color={colors.primary}>{doctor.price.replace('/ session', '')}</Typography>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Proceed to Pay"
          onPress={() => navigation.navigate('BookingConfirmed', { doctorName: doctor.name, slot: `${selectedDate}, ${selectedSlot}` })}
          disabled={!selectedSlot}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.l, gap: spacing.s },
  section: { marginTop: spacing.l },
  row: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
  rowWrap: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
  paymentCard: { marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: 20, padding: spacing.l },
  footer: { padding: spacing.l, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
