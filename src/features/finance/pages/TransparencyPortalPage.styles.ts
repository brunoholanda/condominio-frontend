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

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  min-width: 0;
`;

export const Title = styled.strong`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.02rem;
  overflow-wrap: anywhere;
`;

export const Amount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  white-space: nowrap;
`;

export const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const AttachmentsHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(5)};

  button {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.surface};
    padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
    min-height: 40px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const DetailCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  max-width: 760px;
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.down.md} {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const Notes = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const AttachmentList = styled.div`
  .ant-list-item {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing(2)};
  }

  .ant-list-item-meta {
    min-width: 0;
    flex: 1 1 200px;
  }

  .ant-list-item-meta-title {
    overflow-wrap: anywhere;
  }

  .ant-list-item-action {
    margin-inline-start: 0;
  }

  ${({ theme }) => theme.media.down.md} {
    .ant-list-item-action {
      width: 100%;
      padding-inline-start: 0;

      > li {
        padding: 0;
      }

      .ant-btn {
        width: 100%;
        justify-content: center;
        min-height: 40px;
      }
    }
  }
`;
