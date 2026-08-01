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
