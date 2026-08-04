import styled from 'styled-components';

export const SummaryGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const SummaryCard = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

export const SummaryLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const SummaryValue = styled.p`
  margin: ${({ theme }) => theme.spacing(2)} 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 700;
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.media.down.md} {
    > * {
      flex: 1 1 100%;
      width: 100% !important;
      max-width: 100%;
    }
  }
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ItemCard = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

export const CardTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const CardTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 650;
`;

export const CardMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  line-height: 1.45;
`;

export const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};

  > button {
    flex: 1 1 auto;
    min-height: 40px;
  }
`;

export const CardEmpty = styled.p`
  margin: ${({ theme }) => theme.spacing(8)} 0;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export const CardPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const PixPanel = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
  justify-items: center;
  text-align: center;
`;

export const PixQr = styled.img`
  width: min(240px, 100%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(2)};
  background: #fff;
`;

export const PixPayload = styled.textarea`
  width: 100%;
  min-height: 96px;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  resize: vertical;
`;

export const SettingsHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;
