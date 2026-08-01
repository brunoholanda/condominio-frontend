import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const CodeField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Countdown = styled.p<{ $expired: boolean }>`
  margin: 0;
  color: ${({ theme, $expired }) => ($expired ? theme.colors.danger : theme.colors.textMuted)};
  font-size: 0.82rem;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.sm} {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;
