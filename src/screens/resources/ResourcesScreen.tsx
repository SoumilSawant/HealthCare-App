import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Resources'>;

const FILTERS = ['All', 'Anxiety', 'Family', 'Sleep'];

export const ResourcesScreen = ({ navigation }: Props) => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            Resources
          </Typography>
        </View>

        <View style={styles.searchBar}>
          <Typography variant="body" color={colors.inkSoft}>🔍</Typography>
          <TextInput 
            placeholder="Search articles & videos"
            placeholderTextColor={colors.inkFaint}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.chipScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s }}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.chip, activeFilter === filter && styles.chipOn]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Typography variant="bodySemibold" color={activeFilter === filter ? colors.sageDeep : colors.inkSoft}>
                  {filter}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.list}>
          {/* Video Card */}
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={styles.videoThumb}>
              <Typography variant="h2" color={colors.surface}>▶</Typography>
            </View>
            <Typography variant="bodySemibold" color={colors.ink} style={{ marginTop: spacing.s }}>
              5-minute calming breath
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
              <Typography variant="small" color={colors.inkSoft}>Video · 5:12 ·</Typography>
              <View style={styles.badge}>
                <Typography variant="xs" color={colors.inkSoft} style={{ fontWeight: '500' }}>EN / MR</Typography>
              </View>
            </View>
          </TouchableOpacity>

          {/* Article Card */}
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Typography variant="bodySemibold" color={colors.ink}>
              Understanding anxiety
            </Typography>
            <View style={{ marginTop: spacing.s, gap: 6 }}>
              <View style={[styles.lineSm, { width: '85%' }]} />
              <View style={[styles.lineSm, { width: '50%' }]} />
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.badgeGold}>
                <Typography variant="xs" color={colors.gold} style={{ fontWeight: '600' }}>Article</Typography>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Typography variant="bodySemibold" color={colors.inkSoft}>🔖</Typography>
                <Typography variant="bodySemibold" color={colors.inkSoft}>⤴</Typography>
              </View>
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
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing.l,
    paddingTop: spacing.s,
  },
  header: {
    marginBottom: spacing.l,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    paddingHorizontal: spacing.m,
    height: 48,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.s,
    fontSize: 15,
    color: colors.ink,
    fontFamily: 'Outfit',
  },
  chipScroll: {
    marginBottom: spacing.l,
    marginHorizontal: -spacing.l,
    paddingHorizontal: spacing.l,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  chipOn: {
    borderColor: colors.sageDeep,
    backgroundColor: colors.sageTint,
  },
  list: {
    gap: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    ...layout.shadowSubtle,
  },
  videoThumb: {
    height: 120,
    backgroundColor: colors.inkSoft,
    borderRadius: layout.borderRadiusSmall - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.lineSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lineSm: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  badgeGold: {
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
