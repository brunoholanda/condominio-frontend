import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(3)};
`;

export const AlertBanner = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted ?? '#f7f4ef'};
  border: 1px solid ${({ theme }) => theme.colors.border};

  p {
    margin: 4px 0 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
