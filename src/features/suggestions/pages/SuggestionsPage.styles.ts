import styled from 'styled-components';

export const Card = styled.section`
  max-width: 640px;
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

export const Commitment = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.92rem;
  line-height: 1.6;
`;

export const Verified = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.9rem;
  overflow-wrap: anywhere;
`;

export const Success = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.1rem;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Row = styled.article`
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const Body = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;
