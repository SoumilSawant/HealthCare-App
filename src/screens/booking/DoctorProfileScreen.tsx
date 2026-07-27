import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'DoctorProfile'>;

export const DoctorProfileScreen = ({ route, navigation }: Props) => {
  const { name } = route.params;
  const [activeTab, setActiveTab] = useState('About');

  const handleBook = () => {
    navigation.navigate('Booking', { doctorId: route.params.doctorId, slot: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            {name}
          </Typography>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Typography variant="h1">👩‍⚕️</Typography>
          </View>
          <Typography variant="displayXS" color={colors.ink} style={{ fontWeight: '600' }}>{name}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Typography variant="small" color={colors.inkSoft}>Clinical Psychologist · 12 yrs · </Typography>
            <Typography variant="small" color={colors.gold}>★ </Typography>
            <Typography variant="small" color={colors.inkSoft}>4.8 (214)</Typography>
          </View>
        </View>

        <View style={styles.segmentControl}>
          {['About', 'Reviews', 'Slots'].map(tab => (
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

        <Typography variant="h3" color={colors.ink} style={{ marginTop: spacing.xl, marginBottom: spacing.m }}>
          Areas of expertise
        </Typography>
        <View style={styles.chipsContainer}>
          {['Anxiety', 'Depression', 'CBT', 'Stress'].map(skill => (
            <View key={skill} style={styles.chipLiteOn}>
              <Typography variant="small" color={colors.sageDeep} style={{ fontWeight: '600' }}>{skill}</Typography>
            </View>
          ))}
        </View>

        <Typography variant="h3" color={colors.ink} style={{ marginTop: spacing.xl, marginBottom: spacing.m }}>
          Patient testimonials
        </Typography>
        <View style={styles.card}>
          <View style={[styles.lineSm, { width: '85%' }]} />
          <View style={[styles.lineSm, { width: '70%', marginTop: 6 }]} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.m }}>
            <Typography variant="small" color={colors.gold}>★★★★★ · </Typography>
            <Typography variant="small" color={colors.inkFaint}>verified after consultation</Typography>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, styles.btnGhost, { flex: 1 }]} onPress={handleBook}>
          <Typography variant="bodySemibold" color={colors.ink}>Short · ₹500</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={handleBook}>
          <Typography variant="bodySemibold" color={colors.surface}>Expert · ₹800</Typography>
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
    width: '100%', maxWidth: 768, alignSelf: 'center',

    padding: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: 100, // padding for footer
  },
  header: {
    marginBottom: spacing.l,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
    ...layout.shadowSubtle,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: colors.lineSoft,
    borderRadius: layout.borderRadiusSmall,
    padding: 2,
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chipLiteOn: {
    backgroundColor: colors.sageTint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    ...layout.shadowSubtle,
  },
  lineSm: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.m,
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
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.inkFaint,
  },
});
