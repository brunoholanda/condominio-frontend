import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.6rem;
  font-weight: 600;

  ${({ theme }) => theme.media.down.md} {
    font-size: 1.3rem;
  }
`;

export const Description = styled.p`
  margin: ${({ theme }) => `${theme.spacing(1)} 0 0`};
  max-width: 60ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    width: 100%;

    > * {
      flex: 1;
      height: 40px;
    }
  }
`;
