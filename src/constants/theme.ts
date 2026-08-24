export const Colors = {
  // Main Palette
  paper: '#F6F4EA',
  paperDeep: '#EFECE0',
  navy: '#243757',
  navySoft: '#2E456A',
  teal: '#3A5F6F',
  sand: '#DAD5B7',
  sandLight: '#E7E3CF',
  taupe: '#C2B79B',
  stone: '#665E52',

  // UI Accents and alphas
  borderLight: 'rgba(36, 55, 87, 0.1)',
  borderMedium: 'rgba(36, 55, 87, 0.15)',
  borderDashed: 'rgba(36, 55, 87, 0.25)',
  textMuted: 'rgba(102, 94, 82, 0.7)',
  textPlaceholder: 'rgba(36, 55, 87, 0.5)',
  sandMuted: 'rgba(218, 213, 183, 0.7)',
  sandSoft: 'rgba(218, 213, 183, 0.6)',
  navyAlpha15: 'rgba(246, 244, 234, 0.15)',
  tealAlpha05: 'rgba(58, 95, 111, 0.05)',
  tealAlpha20: 'rgba(58, 95, 111, 0.2)',
  paperDeepAlpha50: 'rgba(239, 236, 224, 0.5)',
  white: '#FFFFFF',
} as const;

export const Typography = {
  fraunces: 'Fraunces_400Regular',
  frauncesMedium: 'Fraunces_500Medium',
  frauncesSemiBold: 'Fraunces_600SemiBold',
  frauncesItalic: 'Fraunces_400Regular_Italic',
  frauncesSemiBoldItalic: 'Fraunces_600SemiBold_Italic',
  
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
};

export const Shadows = {
  card: {
    shadowColor: '#243757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardSelected: {
    shadowColor: '#243757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHover: {
    shadowColor: '#243757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;


