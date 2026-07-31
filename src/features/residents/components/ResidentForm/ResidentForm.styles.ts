import styled from 'styled-components';

export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const Actions = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    gap: ${({ theme }) => theme.spacing(2)};
    padding-bottom: max(${({ theme }) => theme.spacing(4)}, env(safe-area-inset-bottom));

    /* Thumb-sized targets that split the width of the bar. */
    > * {
      flex: 1;
      height: 44px;
    }
  }
`;
