import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LanguageConsent'>;

const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'Hindi (हिंदी)' },
  { id: 'mr', name: 'Marathi (मराठी)' },
];

export const LanguageConsentScreen = () => {
  const { setLanguage, t, language } = useAuth();
  const [selectedLang, setSelectedLang] = useState(language);
  const navigation = useNavigation<NavigationProp>();

  const handleLanguageSelect = (langId: 'en' | 'hi' | 'mr') => {
    setSelectedLang(langId);
    setLanguage(langId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>
        <Typography variant="h1" color={colors.primary}>{t('welcome')}</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {t('safeSpace')}
        </Typography>

        <Typography variant="h3" style={styles.sectionTitle}>{t('chooseLang')}</Typography>
        {languages.map((lang) => (
          <Card
            key={lang.id}
            variant="outline"
            style={[styles.langCard, selectedLang === lang.id && styles.langCardActive]}
            onPress={() => handleLanguageSelect(lang.id as 'en' | 'hi' | 'mr')}
          >
            <Typography variant="bodySemibold" color={selectedLang === lang.id ? colors.primary : colors.textPrimary}>
              {lang.name}
            </Typography>
            {selectedLang === lang.id ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
          </Card>
        ))}

        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.consentCard} activeOpacity={0.9}>
            <Typography variant="caption" color={colors.textSecondary}>{t('agreeConsent')}</Typography>
          </TouchableOpacity>
          <Button title={t('continue')} onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l },
  stepRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.l, marginTop: spacing.m },
  stepDot: { width: 24, height: 6, borderRadius: 4, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.primary },
  subtitle: { marginTop: spacing.s, marginBottom: spacing.xl },
  sectionTitle: { marginBottom: spacing.m },
  langCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  langCardActive: { borderColor: colors.primary, backgroundColor: colors.secondary },
  bottomArea: { marginTop: 'auto', gap: spacing.m },
  consentCard: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m },
});
