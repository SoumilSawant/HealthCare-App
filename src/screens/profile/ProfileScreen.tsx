import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: '1', title: 'Past Consultations', icon: 'time-outline' },
    { id: '2', title: 'Notes & Prescriptions', icon: 'document-text-outline' },
    { id: '3', title: 'Saved Resources', icon: 'bookmark-outline' },
    { id: '4', title: 'Payment Methods', icon: 'card-outline' },
    { id: '5', title: 'Settings', icon: 'settings-outline' },
    { id: '6', title: 'Help & Support', icon: 'help-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Typography variant="h2" color={colors.primary}>
              {(user?.fullName || 'User').charAt(0).toUpperCase()}
            </Typography>
          </View>
          <View style={styles.userInfo}>
            <Typography variant="h2" color={colors.primary}>{user?.fullName || 'User'}</Typography>
            <Typography variant="body" color={colors.textSecondary}>+91 {user?.mobileNumber || ''}</Typography>
            <Typography variant="caption" color={colors.primary} style={styles.editProfile}>
              Edit Profile
            </Typography>
          </View>
        </View>

        <Card style={styles.statsCard} variant="flat">
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Sessions</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Resources</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Assessments</Typography>
          </View>
        </Card>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
                <Typography variant="bodySemibold" style={styles.menuItemText}>{item.title}</Typography>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Typography variant="bodySemibold" color={colors.error} style={{ marginLeft: spacing.s }}>
            Log Out
          </Typography>
        </TouchableOpacity>

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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.m,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.l,
    backgroundColor: '#e2ece9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  editProfile: {
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.l,
    marginBottom: spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusLarge,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...layout.shadowSubtle,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: spacing.m,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.l,
    backgroundColor: '#FEE2E2',
    borderRadius: layout.borderRadiusLarge,
  },
});
