import styled, { css } from 'styled-components';

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

const unitChip = css`
  min-width: 52px;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-variant-numeric: tabular-nums;
  text-align: center;
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const UnitButton = styled.button`
  ${unitChip}
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const VacantUnitButton = styled.button`
  ${unitChip}
  background: ${({ theme }) => theme.colors.surface};
  border-style: dashed;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const VacantSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
