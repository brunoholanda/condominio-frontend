import { App as AntdApp, ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

import { AuthProvider } from '@/features/auth/hooks/use-auth';
import { GlobalStyles } from '@/styles/global-styles';
import { antdTheme } from '@/styles/antd-theme';
import { theme } from '@/styles/theme';

dayjs.locale('pt-br');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ptBR} theme={antdTheme}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <AntdApp>
            <AuthProvider>{children}</AuthProvider>
          </AntdApp>
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
