import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookStackParamList, 'BookingConfirmed'>;

export const BookingConfirmedScreen: React.FC<Props> = ({ route, navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.primary}>Booking Confirmed</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Your session with {route.params.doctorName} is confirmed for {route.params.slot}.
        </Typography>
        <Button title="Back to Doctor List" onPress={() => navigation.navigate('DoctorList')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: spacing.l, gap: spacing.m },
  subtitle: { marginBottom: spacing.m },
});
