export const colors = {
  background: '#f4f1ea',
  surface: '#fffdf8',
  primary: '#5b8a72',
  primaryDeep: '#4f7864',
  secondary: '#dfe8de',
  accent: '#b17f59',
  textPrimary: '#2c3a32',
  textSecondary: '#6f7f74',
  textLight: '#95a296',
  textInverse: '#ffffff',
  border: '#d9dfd5',
  success: '#5b8a72',
  warning: '#c89259',
  error: '#b44a4a',
  crisisBg: '#f7e2e2',
};

export const fonts = {
  display: 'serif',
  body: 'sans-serif',
};

export const typography = {
  h1: { fontSize: 34, lineHeight: 42, fontWeight: '700' as const, fontFamily: fonts.display },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const, fontFamily: fonts.display },
  h3: { fontSize: 22, lineHeight: 30, fontWeight: '600' as const, fontFamily: fonts.display },
  bodyLarge: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const, fontFamily: fonts.body },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, fontFamily: fonts.body },
  bodySemibold: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const, fontFamily: fonts.body },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, fontFamily: fonts.body },
  captionSemibold: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const, fontFamily: fonts.body },
  small: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, fontFamily: fonts.body },
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
  borderRadius: 20,
  borderRadiusSmall: 12,
  borderRadiusLarge: 24,
  shadow: {
    shadowColor: '#264533',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  shadowSubtle: {
    shadowColor: '#264533',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
};
