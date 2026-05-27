import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { mockResources, mockResourceCategories } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export const ResourceBankScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResources = activeCategory === 'All' 
    ? mockResources 
    : mockResources.filter(r => r.category === activeCategory);

  const renderResource = ({ item }: { item: typeof mockResources[0] }) => (
    <Card style={styles.resourceCard} variant="elevated">
      <ImageBackground 
        source={{ uri: item.image }} 
        style={styles.imageBackground}
        imageStyle={{ borderRadius: layout.borderRadiusSmall }}
      >
        <View style={styles.badgeContainer}>
          <View style={styles.typeBadge}>
            <Ionicons 
              name={item.type === 'Video' ? 'play-circle' : 'document-text'} 
              size={12} 
              color={colors.textInverse} 
            />
            <Typography variant="small" color={colors.textInverse} style={{ marginLeft: 4 }}>
              {item.type}
            </Typography>
          </View>
          <TouchableOpacity style={styles.saveBadge}>
            <Ionicons name={item.saved ? "bookmark" : "bookmark-outline"} size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Typography variant="captionSemibold" color={colors.secondary}>{item.category}</Typography>
        <Typography variant="bodySemibold" style={styles.title} numberOfLines={2}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary}>{item.readTime}</Typography>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Typography variant="h2" color={colors.primary}>Resource Bank</Typography>
        <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
          Explore tools, articles, and videos for your well-being.
        </Typography>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {mockResourceCategories.map(category => (
            <TouchableOpacity 
              key={category}
              style={[styles.filterChip, activeCategory === category && styles.filterChipActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Typography 
                variant="captionSemibold" 
                color={activeCategory === category ? colors.surface : colors.textPrimary}
              >
                {category}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredResources}
        keyExtractor={item => item.id}
        renderItem={renderResource}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    paddingBottom: spacing.m,
  },
  filterSection: {
    marginBottom: spacing.m,
  },
  filterScroll: {
    paddingHorizontal: spacing.l,
    gap: spacing.s,
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listContainer: {
    padding: spacing.l,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  resourceCard: {
    marginBottom: spacing.l,
    padding: 0,
    overflow: 'hidden',
  },
  imageBackground: {
    height: 160,
    width: '100%',
    justifyContent: 'flex-start',
    padding: spacing.s,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBadge: {
    backgroundColor: colors.surface,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.m,
  },
  title: {
    marginTop: spacing.xs,
    marginBottom: spacing.s,
    lineHeight: 22,
  },
});
