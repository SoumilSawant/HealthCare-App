import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabsParamList } from './types';
import { colors, spacing } from '../theme/theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Typography } from '../components/Typography';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const PlaceholderTab = ({ title }: { title: string }) => (
  <SafeAreaView style={styles.placeholderSafeArea}>
    <View style={styles.placeholder}>
      <Typography variant="displayXS" color={colors.ink} align="center">
        {title}
      </Typography>
      <Typography variant="body" color={colors.inkSoft} align="center" style={{ marginTop: spacing.s }}>
        Coming soon
      </Typography>
    </View>
  </SafeAreaView>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#c2c2c2',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'home-variant' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        children={() => <PlaceholderTab title="Explore" />}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BookTab"
        children={() => <PlaceholderTab title="Book" />}
        options={{
          title: 'Book',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SessionsTab"
        children={() => <PlaceholderTab title="Sessions" />}
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    height: 84,
    paddingBottom: 12,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  placeholderSafeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
  },
});