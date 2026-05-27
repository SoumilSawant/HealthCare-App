export const colors = {
  // Backgrounds
  background: '#F9FAFB', // Off-white/light gray
  surface: '#FFFFFF',    // Pure white for cards/surfaces
  
  // Primary (Sage & Forest Green)
  primary: '#2B5B4C',    // Deep forest green
  primaryLight: '#4A7C6B', // Lighter forest green
  secondary: '#88A99C',  // Sage green
  secondaryLight: '#E8F0ED', // Very light sage green for backgrounds
  
  // Accents (Warm & calming)
  accent: '#D99D79',     // Soft coral/terracotta
  accentLight: '#F3E5DC',
  
  // Text
  textPrimary: '#1F2937', // Dark slate
  textSecondary: '#6B7280', // Medium gray
  textLight: '#9CA3AF',   // Light gray
  textInverse: '#FFFFFF', // White text on dark backgrounds
  
  // States
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Borders & Dividers
  border: '#E5E7EB',
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySemibold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  captionSemibold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  borderRadius: 16,
  borderRadiusSmall: 8,
  borderRadiusLarge: 24,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  shadowSubtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
};
