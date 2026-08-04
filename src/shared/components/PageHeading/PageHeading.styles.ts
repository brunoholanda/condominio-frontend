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
    font-size: 1.25rem;
  }
`;

export const Description = styled.p`
  margin: ${({ theme }) => `${theme.spacing(1)} 0 0`};
  max-width: 60ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;

  ${({ theme }) => theme.media.down.md} {
    font-size: 0.85rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    width: 100%;

    > .ant-btn,
    > .ant-space {
      flex: 1 1 auto;
      min-width: min(100%, 140px);
    }

    > .ant-btn {
      min-height: 44px;
    }

    > .ant-space {
      width: 100%;
    }
  }
`;
