import styled from 'styled-components';

export const Section = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(6)}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const Body = styled.div`
  padding: ${({ theme }) => `${theme.spacing(6)} ${theme.spacing(6)} ${theme.spacing(2)}`};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(1)}`};
  }
`;
