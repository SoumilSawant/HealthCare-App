import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const SavedResourcesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Typography variant="h2" color={colors.ink}>Saved Resources</Typography>
      </View>
      <View style={styles.container}>
        <Ionicons name="bookmark-outline" size={64} color={colors.inkFaint} style={styles.icon} />
        <Typography variant="body" color={colors.inkSoft} style={{ textAlign: 'center' }}>
          Your saved articles and videos will appear here.
        </Typography>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.l, borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  backButton: { marginRight: spacing.m },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  icon: { marginBottom: spacing.m },
});
