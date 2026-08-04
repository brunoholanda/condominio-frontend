import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: inherit;
  text-decoration: none;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

export const Title = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.02rem;
  overflow-wrap: anywhere;
`;

export const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export const DetailCard = styled.article`
  max-width: 760px;
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  h2 {
    overflow-wrap: anywhere;
  }

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const DetailBody = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.98rem;
  line-height: 1.7;
  white-space: pre-wrap;
`;
