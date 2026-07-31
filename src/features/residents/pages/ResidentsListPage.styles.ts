import styled from 'styled-components';

export const Filters = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr) 200px;
  }
`;

export const Unit = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.04em;
`;

export const RowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(1)};
`;
