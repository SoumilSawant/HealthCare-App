export const colors = {
  // Background & Surface (warm cream palette)
  bg: '#f4f1ea',
  surface: '#ffffff',
  surface2: '#faf8f3',

  // Text/Ink (warm near-black)
  ink: '#2a2e2c',
  inkSoft: '#6b726d',
  inkFaint: '#9aa19b',

  // Primary (Sage Green)
  sage: '#5b8a72',
  sageDeep: '#3f6b56',
  sageSoft: '#e3ede7',
  sageTint: '#eef4f0',

  // Accent (Warm gold)
  gold: '#c9a24b',
  goldSoft: '#f6edd8',

  // Warm tones
  blush: '#e8b4a0',
  blushSoft: '#f7e7e0',

  // Crisis/Safety (red)
  crisis: '#c5544a',
  crisisSoft: '#f8e4e1',

  // Borders & Dividers
  line: '#e7e2d8',
  lineSoft: '#f0ece3',

  // Legacy support (for existing components)
  background: '#f4f1ea',
  primary: '#5b8a72',
  primaryLight: '#3f6b56',
  secondary: '#e3ede7',
  secondaryLight: '#eef4f0',
  accent: '#c9a24b',
  accentLight: '#f6edd8',
  textPrimary: '#2a2e2c',
  textSecondary: '#6b726d',
  textLight: '#9aa19b',
  textInverse: '#ffffff',
  success: '#5b8a72',
  warning: '#c9a24b',
  error: '#c5544a',
  border: '#e7e2d8',
};

export const typography = {
  // Fraunces (serif, display)
  display: { fontFamily: 'Fraunces', fontSize: 30, fontWeight: '600' as const, lineHeight: 36, letterSpacing: -0.5 },
  displaySmall: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: '600' as const, lineHeight: 28, letterSpacing: -0.3 },
  displayXS: { fontFamily: 'Fraunces', fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },

  // Outfit (sans-serif)
  h1: { fontSize: 34, fontWeight: '600' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  bodyLarge: { fontSize: 15, fontWeight: '400' as const, lineHeight: 24 },
  body: { fontSize: 14.5, fontWeight: '400' as const, lineHeight: 22 },
  bodySemibold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  captionSemibold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  xs: { fontSize: 11.5, fontWeight: '400' as const, lineHeight: 16 },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  ml: 18,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  borderRadius: 20,
  borderRadiusSmall: 14,
  borderRadiusLarge: 28,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 34,
    elevation: 8,
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
};
