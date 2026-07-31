import type { ThemeConfig } from 'antd';

import { theme } from './theme';

/** Keeps Ant Design visually aligned with the styled-components tokens. */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: theme.colors.primary,
    colorInfo: theme.colors.primary,
    colorSuccess: theme.colors.success,
    colorError: theme.colors.danger,
    colorText: theme.colors.text,
    colorTextSecondary: theme.colors.textMuted,
    colorBorder: theme.colors.border,
    colorBgLayout: theme.colors.background,
    borderRadius: 8,
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  components: {
    Form: {
      labelColor: theme.colors.textMuted,
      itemMarginBottom: 18,
    },
    Input: {
      paddingBlock: 7,
    },
  },
};
