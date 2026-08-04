import styled from 'styled-components';

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

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const PackageCard = styled.article`
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

export const CardUnit = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 650;
`;

export const CardDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.45;
`;

export const CardMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
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

export const SigningSessionPanel = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2)} 0;

  img {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing(2)};
    background: ${({ theme }) => theme.colors.surface};
  }

  p {
    margin: 0;
    max-width: 360px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const SigningWaiting = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

export const SigningExpiry = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

export const SignaturePreview = styled.img`
  display: block;
  width: 100%;
  max-width: 360px;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;
