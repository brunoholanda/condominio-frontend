import styled from 'styled-components';

export const Hint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Info = styled.div`
  flex: 1;
  min-width: 180px;
`;

export const Name = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const Email = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    width: 100%;

    > * {
      flex: 1 1 auto;
    }
  }
`;

export const RoleHelp = styled.ul`
  margin: ${({ theme }) => theme.spacing(2)} 0 0;
  padding-left: ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  line-height: 1.5;
`;
