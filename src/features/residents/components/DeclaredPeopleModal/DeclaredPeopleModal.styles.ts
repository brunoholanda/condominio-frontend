import styled from 'styled-components';

export const Intro = styled.p`
  margin: ${({ theme }) => `0 0 ${theme.spacing(4)}`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
`;

export const Count = styled.p`
  margin: ${({ theme }) => `${theme.spacing(3)} 0 ${theme.spacing(2)}`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
`;

/** Rola dentro do diálogo para o botão de fechar continuar ao alcance. */
export const People = styled.ul`
  display: flex;
  max-height: min(55vh, 460px);
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
`;

export const Person = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

export const Identity = styled.div`
  min-width: 0;
`;

export const Name = styled.strong`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Role = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.76rem;
`;

export const Contact = styled.div`
  flex: 0 0 auto;
  text-align: right;
`;

/** Toque no número disca direto no celular. */
export const Phone = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  white-space: nowrap;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

export const PhoneNote = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.7rem;
`;

export const Empty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing(6)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  text-align: center;
`;
