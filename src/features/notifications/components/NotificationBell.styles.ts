import styled from 'styled-components';

export const Trigger = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const Panel = styled.div`
  width: min(360px, 92vw);
  max-height: 420px;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PanelTitle = styled.strong`
  font-size: 0.95rem;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

export const Item = styled.li<{ $unread?: boolean }>`
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $unread }) =>
    $unread ? theme.colors.background : theme.colors.surface};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: 0;
  }
`;

export const ItemTitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const ItemBody = styled.p`
  margin: 0 0 6px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ItemMeta = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  margin: 24px 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
`;
