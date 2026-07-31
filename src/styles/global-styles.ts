import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  ${({ theme }) => theme.media.down.md} {
    /* iOS Safari zooms in when a focused field has text smaller than 16px. */
    .ant-input,
    .ant-input-number-input,
    .ant-select-single .ant-select-selector,
    .ant-picker-input > input {
      font-size: 16px;
    }

    /* Comfortable touch targets on the repeated rows and table actions. */
    .ant-btn-sm {
      height: 32px;
      padding-inline: ${({ theme }) => theme.spacing(2)};
    }
  }
`;
