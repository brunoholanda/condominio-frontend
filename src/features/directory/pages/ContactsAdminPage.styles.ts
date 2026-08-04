import styled from 'styled-components';

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
  min-width: 0;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  overflow-wrap: anywhere;
`;

export const Detail = styled.div`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) => theme.media.down.md} {
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;

export const OrderButtons = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-left: auto;
`;
