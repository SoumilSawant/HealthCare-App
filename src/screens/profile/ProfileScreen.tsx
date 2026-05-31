import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = () => {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="h2" color={colors.primary}>User Profile</Typography>

        <Card style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} style={styles.avatar} />
          <Typography variant="h3" color={colors.primary}>Sarah Jenkins</Typography>
          <Typography variant="caption" color={colors.textSecondary}>sarah@example.com</Typography>
        </Card>

        <Card variant="outline">
          <Typography variant="bodySemibold">Care Preferences</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Language: English</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Mode: Video + Chat</Typography>
        </Card>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Typography variant="bodySemibold" color={colors.error}>Log Out</Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.l, gap: spacing.l },
  profileCard: { alignItems: 'center', gap: spacing.s },
  avatar: { width: 86, height: 86, borderRadius: 43, marginBottom: spacing.s },
  logoutButton: {
    backgroundColor: colors.crisisBg,
    padding: spacing.m,
    borderRadius: 20,
    alignItems: 'center',
  },
});
