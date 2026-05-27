import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
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
  const [consentGiven, setConsentGiven] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleLanguageSelect = (langId: string) => {
    setSelectedLang(langId as any);
    setLanguage(langId as any);
  };

  const handleContinue = () => {
    if (consentGiven) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary}>{t('welcome')}</Typography>
          <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
            {t('safeSpace')}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>{t('chooseLang')}</Typography>
          {languages.map((lang) => (
            <Card
              key={lang.id}
              variant={selectedLang === lang.id ? 'elevated' : 'outline'}
              style={[
                styles.langCard,
                selectedLang === lang.id && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => handleLanguageSelect(lang.id)}
            >
              <Typography 
                variant={selectedLang === lang.id ? 'bodySemibold' : 'body'}
                color={selectedLang === lang.id ? colors.primary : colors.textPrimary}
              >
                {lang.name}
              </Typography>
              {selectedLang === lang.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </Card>
          ))}
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity 
          style={styles.consentContainer} 
          onPress={() => setConsentGiven(!consentGiven)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, consentGiven && styles.checkboxActive]}>
            {consentGiven && <Ionicons name="checkmark" size={16} color={colors.surface} />}
          </View>
          <Typography variant="caption" color={colors.textSecondary} style={styles.consentText}>
            {t('agreeConsent')}
          </Typography>
        </TouchableOpacity>

        <Button 
          title={t('continue')} 
          onPress={handleContinue} 
          disabled={!consentGiven}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.l,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  langCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
    paddingVertical: spacing.m,
  },
  spacer: {
    flex: 1,
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  consentText: {
    flex: 1,
    lineHeight: 20,
  },
  button: {
    marginBottom: spacing.m,
  },
});
