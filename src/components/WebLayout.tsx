import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { colors, layout, spacing } from '../theme/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MainTabsParamList } from '../navigation/types';

export const WebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const navigation = useNavigation<NavigationProp<any>>();

  const tabs = [
    { name: 'HomeTab', label: 'Home', icon: 'home-variant' },
    { name: 'ExploreTab', label: 'Explore', icon: 'compass-outline' },
    { name: 'BookTab', label: 'Book', icon: 'calendar-plus' },
    { name: 'SessionsTab', label: 'Sessions', icon: 'calendar-month-outline' },
    { name: 'ProfileTab', label: 'Profile', icon: 'account-outline' }
  ];

  return (
    <View style={styles.webContainer}>
      <View style={styles.topNav}>
        <View style={styles.navContent}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Typography variant="bodySemibold" color={colors.surface}>🌿</Typography>
            </View>
            <Typography variant="h3" color={colors.ink} style={{ marginLeft: spacing.s }}>
              SoulPlace
            </Typography>
          </View>
          <View style={styles.linksRow}>
            {tabs.map(tab => (
              <TouchableOpacity 
                key={tab.name} 
                onPress={() => navigation.navigate('Main', { screen: tab.name })} 
                style={styles.navLink}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name={tab.icon as any} size={20} color={colors.inkSoft} style={{ marginRight: spacing.xs }} />
                <Typography variant="bodySemibold" color={colors.inkSoft}>{tab.label}</Typography>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.inkSoft} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.pageContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topNav: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    height: 70,
    justifyContent: 'center',
    zIndex: 10,
    ...layout.shadowSm,
  },
  navContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.sageDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.l,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: spacing.xs,
  },
  pageContent: {
    flex: 1,
    backgroundColor: colors.bg,
  }
});
