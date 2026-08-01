import { Alert } from 'antd';
import styled from 'styled-components';

export const Notice = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

export const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const Group = styled.section``;

export const GroupTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => `0 0 ${theme.spacing(3)}`};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
`;

/** Pares rótulo/valor em uma coluna no celular e duas a partir do tablet. */
export const Fields = styled.dl`
  display: grid;
  gap: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  margin: 0;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Field = styled.div``;

export const FieldLabel = styled.dt`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const FieldValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.92rem;
`;

export const Cards = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Card = styled.li`
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

export const CardTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
`;

export const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

/** A assinatura foi desenhada em fundo branco: mantém o quadro claro. */
export const Signature = styled.img`
  display: block;
  width: 100%;
  height: 150px;
  margin-top: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  object-fit: contain;
`;

export const Timestamps = styled.footer`
  margin-top: ${({ theme }) => theme.spacing(6)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    > * {
      flex: 1;
      height: 44px;
    }
  }
`;
