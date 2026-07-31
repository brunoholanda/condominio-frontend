/** Raw queries, also usable with `matchMedia` when behaviour depends on the layout. */
export const queries = {
  upSm: '(min-width: 576px)',
  upMd: '(min-width: 768px)',
  upLg: '(min-width: 1024px)',
  downSm: '(max-width: 575.98px)',
  downMd: '(max-width: 767.98px)',
} as const;

/** Design tokens shared by styled-components and the Ant Design theme. */
export const theme = {
  colors: {
    primary: '#0f2740',
    primaryHover: '#183a5c',
    accent: '#b8944a',
    accentSoft: '#f3ead6',
    background: '#f2f4f8',
    surface: '#ffffff',
    surfaceMuted: '#fafbfd',
    border: '#e2e8f0',
    text: '#16222f',
    textMuted: '#5f7183',
    danger: '#cf3c26',
    success: '#2e7d32',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  shadows: {
    card: '0 6px 24px rgba(15, 39, 64, 0.07)',
    header: '0 2px 12px rgba(15, 39, 64, 0.12)',
  },
  spacing: (steps: number) => `${steps * 4}px`,
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '1024px',
  },
  /** Ready-made blocks; `down` stops just before `up` so they never overlap. */
  media: {
    up: {
      sm: `@media ${queries.upSm}`,
      md: `@media ${queries.upMd}`,
      lg: `@media ${queries.upLg}`,
    },
    down: {
      sm: `@media ${queries.downSm}`,
      md: `@media ${queries.downMd}`,
    },
  },
} as const;

export type AppTheme = typeof theme;
