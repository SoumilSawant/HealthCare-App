import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { mockAppointments } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useAuth();
  const nextAppointment = mockAppointments[0];

  const handleCallHelpline = () => {
    // In a real app, use Linking.openURL('tel:14416')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary}>{t('greeting')}</Typography>
          <Typography variant="body" color={colors.textSecondary}>{t('feelingToday')}</Typography>
        </View>

        {/* Daily Motivation */}
        <Card style={styles.quoteCard} variant="flat">
          <Ionicons name="leaf-outline" size={24} color={colors.accent} style={{ marginBottom: spacing.s }} />
          <Typography variant="bodySemibold" color={colors.primary}>
            {t('quote')}
          </Typography>
        </Card>

        {/* Primary CTA (Mood Check) */}
        <TouchableOpacity 
          style={styles.moodCta} 
          activeOpacity={0.8}
        >
          <View style={styles.moodCtaContent}>
            <Typography variant="h3" color={colors.textInverse}>{t('startMoodCheck')}</Typography>
            <Typography variant="caption" color={colors.secondaryLight} style={{ marginTop: spacing.xs }}>
              {t('moodCheckSubtitle')}
            </Typography>
          </View>
          <View style={styles.moodCtaIcon}>
            <Ionicons name="heart-half" size={32} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity 
          style={styles.expertCta} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('DoctorDiscovery')}
        >
          <Typography variant="bodySemibold" color={colors.primary}>{t('bookExpert')}</Typography>
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Widgets */}
        <Typography variant="h3" style={styles.sectionTitle}>{t('upcomingAppointments')}</Typography>
        {nextAppointment ? (
          <Card style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.dateBadge}>
                <Typography variant="small" color={colors.primary} align="center">
                  {nextAppointment.date === 'Tomorrow' ? t('tomorrow') : nextAppointment.date}
                </Typography>
                <Typography variant="bodySemibold" color={colors.primary} align="center">
                  {nextAppointment.time.split(' ')[0]}
                </Typography>
              </View>
              <View style={styles.appointmentInfo}>
                <Typography variant="bodySemibold">{nextAppointment.doctorName}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {nextAppointment.type === 'Video Consultation' ? t('videoConsultation') : nextAppointment.type}
                </Typography>
              </View>
            </View>
            <View style={styles.appointmentActions}>
              <TouchableOpacity style={styles.joinButton}>
                <Ionicons name="videocam-outline" size={16} color={colors.textInverse} />
                <Typography variant="captionSemibold" color={colors.textInverse} style={{ marginLeft: spacing.xs }}>
                  {t('joinCall')}
                </Typography>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <Typography variant="body" color={colors.textSecondary}>{t('noAppointments')}</Typography>
        )}

        {/* Corporate Sessions */}
        <Card style={styles.corporateBanner} variant="outline">
          <View style={{ flex: 1 }}>
            <Typography variant="bodySemibold" color={colors.primary}>{t('corporateWellness')}</Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              {t('corporateSubtitle')}
            </Typography>
          </View>
          <Ionicons name="business-outline" size={32} color={colors.secondary} />
        </Card>

        {/* Emergency Footer */}
        <View style={styles.emergencyFooter}>
          <Typography variant="captionSemibold" color={colors.error} style={{ marginBottom: spacing.s }}>
            {t('emergencyHelpline')}
          </Typography>
          <TouchableOpacity style={styles.emergencyCard} onPress={handleCallHelpline} activeOpacity={0.8}>
            <View>
              <Typography variant="bodySemibold" color={colors.textPrimary}>Tele MANAS</Typography>
              <Typography variant="caption" color={colors.textSecondary}>{t('teleManasSubtitle')}</Typography>
            </View>
            <View style={styles.callIconBadge}>
              <Ionicons name="call" size={20} color={colors.surface} />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
    marginBottom: spacing.l,
  },
  quoteCard: {
    backgroundColor: colors.secondaryLight,
    marginBottom: spacing.l,
  },
  moodCta: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadiusLarge,
    padding: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    ...layout.shadowSubtle,
  },
  moodCtaContent: {
    flex: 1,
    paddingRight: spacing.m,
  },
  moodCtaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertCta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  appointmentCard: {
    marginBottom: spacing.l,
  },
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  dateBadge: {
    backgroundColor: colors.secondaryLight,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.s,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  appointmentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  appointmentActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
    alignItems: 'flex-end',
  },
  joinButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
  },
  corporateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  emergencyFooter: {
    marginTop: spacing.xl,
    paddingTop: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emergencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEE2E2', // Light red background
    padding: spacing.m,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  callIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
