import styled from 'styled-components';

export const Grid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  grid-template-columns: 1fr;

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Card = styled.article`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(4)}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Badge = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.accentSoft};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

export const Content = styled.div`
  min-width: 0;
`;

export const Label = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Value = styled.strong`
  display: block;
  font-size: 1.6rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Note = styled.span`
  display: block;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Botão discreto dentro do card, para não competir com o número. */
export const Action = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;
