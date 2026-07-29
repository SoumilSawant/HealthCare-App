import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'Booking'>;

const DATES = ['Today', 'Tomorrow', 'Wed', 'Thu'];
const SLOTS = [
  { time: '9:00', available: false },
  { time: '10:30', available: true },
  { time: '12:00', available: true },
  { time: '3:00', available: true },
  { time: '4:30', available: false },
  { time: '6:00', available: true },
];

export const BookingScreen = ({ navigation }: Props) => {
  const [activeDate, setActiveDate] = useState('Today');
  const [activeSlot, setActiveSlot] = useState('12:00');
  const [consentChecked, setConsentChecked] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            Pick a time
          </Typography>
        </View>

        <View style={styles.chipScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s }}>
            {DATES.map(date => (
              <TouchableOpacity
                key={date}
                style={[styles.chip, activeDate === date && styles.chipOn]}
                onPress={() => setActiveDate(date)}
                activeOpacity={0.8}
              >
                <Typography variant="bodySemibold" color={activeDate === date ? colors.sageDeep : colors.inkSoft}>
                  {date}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.slotsGrid}>
          {SLOTS.map((slot, idx) => (
            <TouchableOpacity
              key={idx}
              disabled={!slot.available}
              style={[
                styles.slotBtn,
                !slot.available && styles.slotOff,
                activeSlot === slot.time && styles.slotOn
              ]}
              onPress={() => setActiveSlot(slot.time)}
              activeOpacity={0.8}
            >
              <Typography 
                variant="bodySemibold" 
                color={
                  !slot.available ? colors.inkFaint 
                  : activeSlot === slot.time ? colors.sageDeep 
                  : colors.ink
                }
              >
                {slot.time}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.consentItem} 
          activeOpacity={0.8}
          onPress={() => setConsentChecked(!consentChecked)}
        >
          <View style={[styles.check, consentChecked && styles.checkOn]}>
            {consentChecked && <Typography variant="small" color={colors.surface} style={{ fontWeight: '700' }}>✓</Typography>}
          </View>
          <Typography variant="body" color={colors.ink} style={{ flex: 1 }}>
            I've read the fees & refund policy and accept the teleconsultation disclaimer.
          </Typography>
        </TouchableOpacity>

        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Typography variant="body" color={colors.ink}>Expert consultation</Typography>
            <Typography variant="bodySemibold" color={colors.ink}>₹800</Typography>
          </View>
          <View style={[styles.receiptRow, { marginVertical: spacing.xs }]}>
            <Typography variant="body" color={colors.inkSoft}>Platform fee</Typography>
            <Typography variant="body" color={colors.inkSoft}>₹40</Typography>
          </View>
          <View style={styles.totalRow}>
            <Typography variant="bodySemibold" color={colors.ink} style={{ fontSize: 16 }}>Total</Typography>
            <Typography variant="bodySemibold" color={colors.ink} style={{ fontSize: 16 }}>₹840</Typography>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => navigation.navigate('BookingConfirmed')}
        >
          <Typography variant="bodySemibold" color={colors.surface}>🔒 Pay securely · ₹840</Typography>
        </TouchableOpacity>
        <Typography variant="xs" color={colors.inkSoft} align="center" style={{ marginTop: spacing.s }}>
          Cards · UPI · wallets
        </Typography>
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
    width: '100%', maxWidth: 768, alignSelf: 'center',

    padding: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: 100, // padding for footer
  },
  header: {
    marginBottom: spacing.l,
  },
  chipScroll: {
    marginBottom: spacing.l,
    marginHorizontal: -spacing.l,
    paddingHorizontal: spacing.l,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  chipOn: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageTint,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  slotBtn: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  slotOff: {
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  slotOn: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageTint,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkOn: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageDeep,
  },
  receiptCard: {
    backgroundColor: colors.surface2,
    padding: spacing.m,
    borderRadius: layout.borderRadiusSmall,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.m,
    marginTop: spacing.s,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderColor: colors.lineSoft,
  },
  btn: {
    backgroundColor: colors.sageDeep,
    paddingVertical: 14,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
