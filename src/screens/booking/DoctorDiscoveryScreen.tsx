import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { mockDoctors } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'DoctorDiscovery'>;

// Helper to translate specialization dynamically
const getSpecializationKey = (spec: string): any => {
  switch (spec) {
    case 'Clinical Psychologist': return 'clinicalPsychologist';
    case 'Psychiatrist': return 'psychiatrist';
    case 'Counseling Psychologist': return 'counselingPsychologist';
    case 'Couples Therapist': return 'couplesTherapist';
    default: return null;
  }
};

// Helper to translate city dynamically
const getCityKey = (city: string): any => {
  switch (city) {
    case 'Mumbai': return 'mumbai';
    case 'Delhi': return 'delhi';
    case 'Bangalore': return 'bangalore';
    case 'Pune': return 'pune';
    default: return null;
  }
};

// Helper to translate experience dynamically
const getExpKey = (exp: string): any => {
  switch (exp) {
    case '8 Years Exp.': return 'exp8';
    case '12 Years Exp.': return 'exp12';
    case '5 Years Exp.': return 'exp5';
    case '10 Years Exp.': return 'exp10';
    default: return null;
  }
};

export const DoctorDiscoveryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useAuth();

  const renderDoctor = ({ item }: { item: typeof mockDoctors[0] }) => {
    const specKey = getSpecializationKey(item.specialization);
    const cityKey = getCityKey(item.city);
    const expKey = getExpKey(item.experience);

    return (
      <Card style={styles.doctorCard} variant="elevated">
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={styles.infoContainer}>
            <Typography variant="bodySemibold">{item.name}</Typography>
            <Typography variant="caption" color={colors.primary}>
              {specKey ? t(specKey) : item.specialization}
            </Typography>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Typography variant="caption" color={colors.textSecondary} style={styles.metaText}>
                {cityKey ? t(cityKey) : item.city}
              </Typography>
              <Typography variant="caption" color={colors.textLight}> • </Typography>
              <Ionicons name="briefcase-outline" size={14} color={colors.textSecondary} />
              <Typography variant="caption" color={colors.textSecondary} style={styles.metaText}>
                {expKey ? t(expKey) : item.experience}
              </Typography>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View>
            <Typography variant="caption" color={colors.textSecondary}>{t('consultationFee')}</Typography>
            <Typography variant="bodySemibold" color={colors.primary}>
              {item.price.replace('/ session', t('perSession'))}
            </Typography>
          </View>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking')}
            activeOpacity={0.8}
          >
            <Typography variant="captionSemibold" color={colors.textInverse}>{t('bookSession')}</Typography>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={mockDoctors}
        keyExtractor={item => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Typography variant="h2" color={colors.primary}>{t('findExpert')}</Typography>
            <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
              {t('findExpertSub')}
            </Typography>
          </View>
        }
      />
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
  doctorCard: {
    marginBottom: spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: spacing.m,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaText: {
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: layout.borderRadiusLarge,
  },
});
