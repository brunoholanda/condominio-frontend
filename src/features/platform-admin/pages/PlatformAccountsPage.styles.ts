import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(7)};
  animation: ${rise} 0.45s ease both;
`;

export const Intro = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)};
  border-radius: ${({ theme }) => theme.radii.lg};
  background:
    radial-gradient(100% 120% at 100% 0%, rgba(184, 148, 74, 0.2), transparent 50%),
    linear-gradient(135deg, #0f2740, #183a5c);
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const IntroIcon = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
`;

export const IntroText = styled.div`
  min-width: 0;
  flex: 1;
`;

export const IntroTitle = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 650;
`;

export const IntroDesc = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  line-height: 1.45;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.up.lg} {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

export const Stat = styled.button<{ $active?: boolean }>`
  display: grid;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentSoft : theme.colors.surface)};
  color: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadows.card : 'none')};
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

export const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.3;
`;

export const Toolbar = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.down.md} {
    > * {
      flex: 1 1 100%;
      width: 100% !important;
      max-width: 100%;
    }
  }
`;

export const AccountCell = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const AccountName = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  line-height: 1.3;
`;

export const AccountEmail = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpandBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
  max-width: 720px;
  padding: ${({ theme }) => theme.spacing(1)} 0;
`;

export const ExpandMeta = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  margin: 0;

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.82rem;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
  }
`;

export const ExpandActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ExpandActionLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const Empty = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-items: start;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(5)};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};

  p {
    margin: 0;
    max-width: 42ch;
    line-height: 1.5;
  }
`;

export const ErrorBox = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-items: start;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};

  p {
    margin: 0;
    line-height: 1.5;
  }
`;
