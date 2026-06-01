import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

const getTimeGreeting = (language: string) => {
  const hour = new Date().getHours();
  if (language === 'hi') {
    if (hour < 12) return 'शुभ प्रभात';
    if (hour < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  }
  if (language === 'mr') {
    if (hour < 12) return 'शुभ सकाळ';
    if (hour < 17) return 'नमस्कार';
    return 'शुभ संध्याकाळ';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getFirstName = (fullName?: string) => {
  if (!fullName) return 'Aarav';
  return fullName.trim().split(/\s+/)[0] || 'Aarav';
};

const QuickCard = ({
  title,
  icon,
  bg,
  titleColor = colors.ink,
  width,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  bg: string;
  titleColor?: string;
  width: number;
  onPress?: () => void;
}) => (
  <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.quickCard, { backgroundColor: bg, width }]}>
    <View style={styles.quickCardIconWrap}>{icon}</View>
    <Typography variant="bodySemibold" color={titleColor} align="center" style={styles.quickCardLabel}>
      {title}
    </Typography>
  </TouchableOpacity>
);

export const HomeScreen = () => {
  const { user, t, language } = useAuth();
  const { width } = useWindowDimensions();
  const firstName = getFirstName(user?.fullName);
  const greeting = getTimeGreeting(language);

  const getLocalizedGreeting = (name: string) => {
    const base = t('greeting');
    if (language === 'hi' || language === 'mr') {
      return base.replace('सारा', name);
    }
    return base.replace('Sarah', name);
  };

  const quickCardWidth = Math.min((width - spacing.ml * 2 - spacing.s) / 2, 170);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.headerRow}>
          <View style={styles.greetingWrap}>
            <Typography variant="body" color={colors.inkSoft} style={styles.greetingLabel}>
              {greeting}
            </Typography>
            <Typography variant="display" color={colors.ink} style={styles.nameText}>
              {getLocalizedGreeting(firstName)}
            </Typography>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Typography variant="displayXS" color={colors.surface} style={styles.heroTitle}>
            {t('feelingToday')}
          </Typography>
          <Typography variant="bodySemibold" color="rgba(255,255,255,0.85)" style={styles.heroSubtitle}>
            {t('moodCheckSubtitle')}
          </Typography>

          <TouchableOpacity activeOpacity={0.9} style={styles.heroButton}>
            <Typography variant="bodySemibold" color={colors.surface} align="center">
              {t('startMoodCheck')}  →
            </Typography>
          </TouchableOpacity>

          <Typography variant="bodySemibold" color="rgba(255,255,255,0.78)" align="center" style={styles.heroLink}>
            {t('bookExpert')}
          </Typography>
        </View>

        <Typography variant="small" color={colors.inkFaint} style={styles.sectionLabel}>
          {language === 'hi' ? 'त्वरित पहुँच' : language === 'mr' ? 'त्वरित प्रवेश' : 'QUICK ACCESS'}
        </Typography>

        <View style={styles.grid}>
          <QuickCard
            title={t('findExpert')}
            bg={colors.surface}
            width={quickCardWidth}
            icon={<MaterialCommunityIcons name="compass-outline" size={28} color="#d3a13f" />}
            onPress={() => {}}
          />
          <QuickCard
            title={t('resources')}
            bg={colors.surface}
            width={quickCardWidth}
            icon={<MaterialCommunityIcons name="view-grid-plus" size={28} color="#4a6fdc" />}
            onPress={() => {}}
          />
          <QuickCard
            title={t('corporateWellness')}
            bg={colors.surface}
            width={quickCardWidth}
            icon={<MaterialCommunityIcons name="account-group" size={28} color="#5c3b94" />}
            onPress={() => {}}
          />
          <QuickCard
            title={t('emergencyHelpline')}
            bg="#fde7e6"
            width={quickCardWidth}
            titleColor="#db5348"
            icon={<View style={styles.sosBadge}><Typography variant="bodySemibold" color={colors.surface}>SOS</Typography></View>}
            onPress={() => {}}
          />
        </View>

        <Typography variant="small" color={colors.inkFaint} style={styles.sectionLabel}>
          {language === 'hi' ? 'दैनिक प्रेरणा' : language === 'mr' ? 'दैनिक प्रेरणा' : 'DAILY MOTIVATION'}
        </Typography>

        <View style={styles.motivationCard}>
          <View style={styles.quoteBlock}>
            <View style={styles.quoteGlow} />
            <Typography variant="displaySmall" color="rgba(255,255,255,0.95)" align="center" style={styles.quoteTextContent}>
              {t('quote')}
            </Typography>
          </View>
          <Typography variant="displaySmall" color={colors.ink} style={styles.motivationText}>
            {language === 'hi' ? 'छोटे कदम भी मायने रखते हैं।' : language === 'mr' ? 'लहान पावले देखील महत्त्वाची आहेत.' : 'Small steps count too.'}
          </Typography>
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
    paddingHorizontal: spacing.ml,
    paddingTop: spacing.s,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  greetingWrap: {
    flex: 1,
    paddingRight: spacing.m,
  },
  greetingLabel: {
    marginBottom: 2,
  },
  nameText: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  heroCard: {
    backgroundColor: colors.sage,
    borderRadius: 28,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  heroTitle: {
    maxWidth: 280,
  },
  heroSubtitle: {
    marginTop: spacing.s,
    marginBottom: spacing.m,
    fontSize: 16,
    lineHeight: 20,
    maxWidth: 290,
  },
  heroButton: {
    backgroundColor: colors.gold,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.s,
    shadowColor: '#a06d12',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroLink: {
    fontSize: 15,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: spacing.s,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  quickCard: {
    minHeight: 108,
    borderRadius: 22,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  quickCardIconWrap: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  quickCardLabel: {
    fontSize: 18,
    lineHeight: 22,
  },
  sosBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#ff6a87',
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 14,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  quoteBlock: {
    minHeight: 128,
    borderRadius: 20,
    backgroundColor: '#d9b05a',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
  },
  quoteGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#e2b78a',
    opacity: 0.35,
  },
  quoteTextContent: {
    paddingHorizontal: spacing.l,
    fontSize: 17,
    lineHeight: 24,
  },
  motivationText: {
    marginTop: spacing.s,
    paddingHorizontal: spacing.xs,
    fontSize: 22,
    lineHeight: 28,
  },
});