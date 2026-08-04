import styled from 'styled-components';

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
  line-height: 1.3;
`;

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
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
