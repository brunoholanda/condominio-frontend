import styled from 'styled-components';

export const Intro = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(5)};
  max-width: 52rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.55;
`;

export const SectionTitle = styled.h2`
  margin: ${({ theme }) => `${theme.spacing(2)} 0 ${theme.spacing(3)}`};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 600;
`;

export const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

export const ToggleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const ToggleInfo = styled.div`
  min-width: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Card = styled.article<{ $muted?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  opacity: ${({ $muted }) => ($muted ? 0.72 : 1)};
`;

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 600;
`;

export const Hint = styled.p`
  margin: ${({ theme }) => `${theme.spacing(1)} 0 0`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
  line-height: 1.45;
`;

export const Path = styled.code`
  display: block;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  word-break: break-all;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: auto;

  ${({ theme }) => theme.media.down.md} {
    > .ant-btn {
      flex: 1 1 100%;
      min-height: 44px;
    }
  }
`;
