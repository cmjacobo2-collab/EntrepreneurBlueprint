/**
 * Across the Table — design tokens.
 * Exact values from the design-system spec (handoff README). Use these everywhere;
 * do not hardcode colors/sizes in components.
 */
export const color = {
  navy700: '#1B344F', // --brand-primary: buttons, headings, authority
  navy800: '#14283F',
  navy900: '#0E1B2C',
  navy600: '#244463', // links
  navy050: '#E8EDF2',
  forest600: '#246049', // --brand-secondary: growth, "go", toggles on, progress
  forest700: '#1C4D3A',
  forest050: '#E7F0EB',
  forest100: '#CDE0D5',
  gold500: '#C8962E', // --brand-accent: eyebrows, key stats, focus ring
  gold600: '#B07D1E',
  gold700: '#946312',
  gold050: '#F7EEDB',
  gold100: '#EBD9B0',
  cream50: '#FBF8F2', // page bg (never pure white)
  cream100: '#F4EFE5',
  white: '#FFFFFF', // cards
  ink900: '#15202E',
  ink700: '#344150',
  ink600: '#4A576A',
  ink500: '#647281',
  textFaint: '#9AA6B2',
  borderSubtle: '#ECE6DA',
  borderDefault: '#E0D9CB',
  borderStrong: '#CFC6B4',
  sand300: '#D8CDB8',
  red600: '#A8392B',
  red050: '#F6E7E4',
  red100: '#E8C9C3',
} as const;

export const radius = { sm: 8, md: 10, lg: 14, pill: 999 } as const;

export const space = (n: number) => n * 4; // 4px base unit

export const font = {
  // Loaded via expo-font in App.tsx (Google Fonts). Sentence case headings only.
  display: 'SchibstedGrotesk_800ExtraBold',
  displayBold: 'SchibstedGrotesk_700Bold',
  body: 'HankenGrotesk_400Regular',
  bodyMed: 'HankenGrotesk_500Medium',
  bodySemi: 'HankenGrotesk_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
} as const;

export const shadow = {
  card: {
    shadowColor: '#14283F',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHover: {
    shadowColor: '#14283F',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;

export const motion = { fast: 130, base: 200, slow: 320 } as const;

/** Decision banner colors (go / adjust / stop / none) resolved to hex. */
export const decisionBanner = {
  go: { bg: color.forest600, fg: color.white },
  adjust: { bg: color.gold500, fg: color.navy900 },
  stop: { bg: color.navy700, fg: color.white },
  none: { bg: color.cream100, fg: color.navy700 },
} as const;
