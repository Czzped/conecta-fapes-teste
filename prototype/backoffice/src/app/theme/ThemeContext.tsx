import React, { createContext, useContext, useMemo } from 'react';

export interface ThemeTokens {
  bgPage: string;
  bgSurface: string;
  bgSurfaceMuted: string;
  bgCard: string;
  bgInput: string;
  bgHover: string;
  bgChip: string;
  bgChipActive: string;
  bgSidebar: string;
  bgHeader: string;
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  iconColor: string;
  iconSubdued: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  success: string;
  successSoft: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

const buildTokens = (isLight: boolean): ThemeTokens => ({
  bgPage:         isLight ? '#fafafa'                : '#0a0a0a',
  bgSurface:      isLight ? '#ffffff'                : '#171717',
  bgSurfaceMuted: isLight ? '#f5f5f5'                : 'rgba(255,255,255,0.04)',
  bgCard:         isLight ? '#ffffff'                : 'rgba(255,255,255,0.04)',
  bgInput:        isLight ? '#ffffff'                : 'rgba(23, 23, 23,0.82)',
  bgHover:        isLight ? 'rgba(0,0,0,0.04)'       : 'rgba(255,255,255,0.06)',
  bgChip:         isLight ? '#f5f5f5'                : 'rgba(255,255,255,0.06)',
  bgChipActive:   '#00c1af',
  bgSidebar:      isLight ? '#ffffff'                : 'rgba(23, 23, 23, 0.96)',
  bgHeader:       isLight ? 'rgba(255,255,255,0.92)' : 'rgba(23, 23, 23, 0.82)',
  borderDefault:  isLight ? '#e5e5e5'                : 'rgba(255,255,255,0.12)',
  borderSubtle:   isLight ? '#f5f5f5'                : 'rgba(255,255,255,0.08)',
  borderStrong:   isLight ? '#d4d4d4'                : 'rgba(255,255,255,0.2)',
  textPrimary:    isLight ? '#171717'                : '#ffffff',
  textSecondary:  isLight ? '#525252'                : 'rgba(255,255,255,0.7)',
  textMuted:      isLight ? '#a3a3a3'                : 'rgba(255,255,255,0.5)',
  iconColor:      isLight ? '#525252'                : '#ffffff',
  iconSubdued:    isLight ? '#a3a3a3'                : 'rgba(255,255,255,0.5)',
  accent:         '#00c1af',
  accentSoft:     isLight ? 'rgba(0,193,175,0.12)'   : 'rgba(0,193,175,0.18)',
  accentText:     isLight ? '#fafafa'                : '#0a0a0a',
  danger:         '#ef4444',
  dangerSoft:     'rgba(239,68,68,0.12)',
  warning:        '#f59e0b',
  warningSoft:    'rgba(245,158,11,0.16)',
  success:        '#10b981',
  successSoft:    'rgba(16,185,129,0.14)',
  shadowSm:       isLight ? '0 1px 3px rgba(23, 23, 23,0.08)'  : '0 1px 3px rgba(0,0,0,0.3)',
  shadowMd:       isLight ? '0 8px 24px rgba(23, 23, 23,0.08)' : '0 8px 24px rgba(0,0,0,0.32)',
  shadowLg:       isLight ? '0 18px 48px rgba(23, 23, 23,0.12)': '0 18px 48px rgba(0,0,0,0.45)',
});

interface ThemeContextValue {
  isLight: boolean;
  T: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  isLight: boolean;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ isLight, children }) => {
  const value = useMemo(() => ({ isLight, T: buildTokens(isLight) }), [isLight]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeTokens = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { isLight: false, T: buildTokens(false) };
  }
  return ctx;
};
