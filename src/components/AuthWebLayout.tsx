import React from 'react';
import { View, StyleSheet, Platform, ImageBackground } from 'react-native';
import { Typography } from './Typography';
import { colors, layout, spacing } from '../theme/theme';

export const AuthWebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      <View style={styles.leftPane}>
        {/* We can use a nice subtle gradient or solid color if no image is available. For now, solid sage green with branding. */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoMark}>
            <Typography variant="display" color={colors.surface}>🌿</Typography>
          </View>
          <Typography variant="h1" color={colors.surface} style={styles.brandTitle}>
            SoulPlace
          </Typography>
          <Typography variant="body" color="rgba(255,255,255,0.8)" style={styles.brandSubtitle}>
            Your safe space for mental wellness and healing.
          </Typography>
        </View>
      </View>
      <View style={styles.rightPane}>
        {/* The navigator (children) will take up this space and its screens are naturally centered thanks to our earlier updates */}
        <View style={styles.rightContentWrapper}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.bg,
  },
  leftPane: {
    flex: 1,
    backgroundColor: colors.sageDeep,
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  brandingContainer: {
    maxWidth: 480,
    alignSelf: 'center',
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  brandTitle: {
    fontSize: 48,
    marginBottom: spacing.s,
  },
  brandSubtitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  rightPane: {
    flex: 1.2,
    backgroundColor: colors.bg,
  },
  rightContentWrapper: {
    flex: 1,
    // Provide a subtle shadow edge between the left and right pane on Web
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: -10, height: 0 },
    elevation: 5,
    backgroundColor: colors.bg,
  }
});
