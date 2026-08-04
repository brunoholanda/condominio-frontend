import styled from 'styled-components';

export const Card = styled.section`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const PackageSummary = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
