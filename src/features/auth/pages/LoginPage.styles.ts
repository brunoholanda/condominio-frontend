import styled from 'styled-components';

export const Page = styled.div`
  display: grid;
  place-items: center;
  min-height: calc(100vh - 180px);
  /* Mobile browsers shrink the viewport when the toolbar hides. */
  min-height: calc(100dvh - 180px);
  padding: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => `${theme.spacing(2)} 0`};
  }
`;

export const Card = styled.section`
  width: min(420px, 100%);
  padding: ${({ theme }) => theme.spacing(8)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(5)};
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.45rem;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  margin: ${({ theme }) => `${theme.spacing(2)} 0 0`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const Warning = styled.p`
  margin: ${({ theme }) => `${theme.spacing(5)} 0 0`};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  line-height: 1.5;
  text-align: center;
`;

export const FooterLink = styled.p`
  margin: ${({ theme }) => `${theme.spacing(5)} 0 0`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

export const StepDot = styled.span<{ $active?: boolean; $done?: boolean }>`
  width: ${({ $active }) => ($active ? '22px' : '8px')};
  height: 8px;
  border-radius: 999px;
  background: ${({ theme, $active, $done }) =>
    $active || $done ? theme.colors.accent : theme.colors.border};
  transition:
    width 0.2s ease,
    background 0.2s ease;
`;

export const StepLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  text-align: center;
`;

export const StepActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;
