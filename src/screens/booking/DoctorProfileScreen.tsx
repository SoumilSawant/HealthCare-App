import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';
import { mockDoctors } from '../../data/mockData';

type Props = NativeStackScreenProps<BookStackParamList, 'DoctorProfile'>;

export const DoctorProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const doctor = mockDoctors.find((item) => item.id === route.params.doctorId) ?? mockDoctors[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card style={styles.hero}>
          <Image source={{ uri: doctor.image }} style={styles.avatar} />
          <Typography variant="h3" color={colors.primary}>{doctor.name}</Typography>
          <Typography variant="body" color={colors.textSecondary}>{doctor.specialization}</Typography>
          <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
            {doctor.experience} • {doctor.city} • {doctor.price}
          </Typography>
        </Card>
        <Card variant="outline">
          <Typography variant="body" color={colors.textSecondary}>
            Calm, empathetic care with evidence-based interventions tailored to your goals.
          </Typography>
        </Card>
        <Button title="Book Slot" onPress={() => navigation.navigate('SlotBookingPayment', { doctorId: doctor.id })} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l, gap: spacing.l },
  hero: { alignItems: 'center' },
  avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: spacing.m },
});
