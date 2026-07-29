import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'DoctorDiscovery'>;

const FILTERS = ['All', 'Marathi', 'Hindi', 'Top rated'];

const DOCTORS = [
  { id: '1', name: 'Dr. A. Sharma', role: 'Clinical Psychologist', exp: '12 yrs', rating: '4.8', price: '₹800', icon: '👩‍⚕️' },
  { id: '2', name: 'Dr. R. Patil', role: 'Psychiatrist', exp: '9 yrs', rating: '4.6', price: '₹1,200', icon: '👨‍⚕️' },
  { id: '3', name: 'Dr. M. Khan', role: 'Counselor', exp: '6 yrs', rating: '4.9', price: '₹600', icon: '🧑‍⚕️' },
];

export const DoctorDiscoveryScreen = ({ navigation }: Props) => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            Choose your doctor
          </Typography>
        </View>

        <View style={styles.chipScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s }}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.chip, activeFilter === filter && styles.chipOn]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Typography variant="bodySemibold" color={activeFilter === filter ? colors.sageDeep : colors.inkSoft}>
                  {filter}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.list}>
          {DOCTORS.map(doc => (
            <TouchableOpacity 
              key={doc.id} 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DoctorProfile', { doctorId: doc.id, name: doc.name })}
            >
              <View style={styles.avatar}>
                <Typography variant="displayXS">{doc.icon}</Typography>
              </View>
              
              <View style={styles.cardMid}>
                <Typography variant="bodySemibold" color={colors.ink} style={{ fontWeight: '700' }}>{doc.name}</Typography>
                <Typography variant="small" color={colors.inkSoft} style={{ marginVertical: 2 }}>{doc.role}</Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="xs" color={colors.inkSoft}>{doc.exp} · </Typography>
                  <Typography variant="xs" color={colors.gold}>★ </Typography>
                  <Typography variant="xs" color={colors.inkSoft}>{doc.rating}</Typography>
                </View>
              </View>
              
              <View style={styles.cardRight}>
                <Typography variant="bodySemibold" color={colors.ink} style={{ fontWeight: '700' }}>{doc.price}</Typography>
                <Typography variant="xs" color={colors.inkSoft} style={{ fontSize: 10 }}>for Nashik</Typography>
                <View style={styles.badge}>
                  <Typography variant="xs" color={colors.sageDeep} style={{ fontWeight: '600' }}>Today</Typography>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
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
  list: {
    gap: spacing.m,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    gap: spacing.m,
    alignItems: 'center',
    ...layout.shadowSubtle,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMid: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: colors.sageTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 5,
  },
});
