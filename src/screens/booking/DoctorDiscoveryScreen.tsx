import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { mockDoctors } from '../../data/mockData';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<BookStackParamList, 'DoctorList'>;

export const DoctorDiscoveryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={mockDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Typography variant="h2" color={colors.primary}>Doctor List</Typography>
            <Typography variant="body" color={colors.textSecondary}>Find the right therapist for your needs.</Typography>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Typography variant="bodySemibold">{item.name}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>{item.specialization}</Typography>
                <Typography variant="caption" color={colors.primary}>{item.price}</Typography>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile', { doctorId: item.id })}>
                <Typography variant="captionSemibold" color={colors.primary}>View</Typography>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.l, gap: spacing.m },
  header: { marginBottom: spacing.m, gap: spacing.s },
  card: { marginBottom: spacing.m },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  avatar: { width: 56, height: 56, borderRadius: 28 },
});
