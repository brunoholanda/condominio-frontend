import styled from 'styled-components';

export const Intro = styled.p`
  margin: ${({ theme }) => `0 0 ${theme.spacing(4)}`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
`;

export const Floor = styled.section`
  & + & {
    margin-top: ${({ theme }) => theme.spacing(4)};
  }
`;

export const FloorTitle = styled.h3`
  margin: ${({ theme }) => `0 0 ${theme.spacing(2)}`};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 600;
`;

export const Units = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Unit = styled.li`
  min-width: 52px;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  text-align: center;
`;
