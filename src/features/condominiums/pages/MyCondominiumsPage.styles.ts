import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const softIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Page = styled.div`
  --page-font: 'Source Sans 3', 'Segoe UI', sans-serif;
  --display-font: 'Fraunces', Georgia, serif;

  position: relative;
  margin: ${({ theme }) => `-${theme.spacing(2)} 0 0`};
  font-family: var(--page-font);
  animation: ${fadeUp} 0.5s ease both;

  &::before {
    content: '';
    position: absolute;
    inset: -${({ theme }) => theme.spacing(6)} -${({ theme }) => theme.spacing(8)} auto;
    height: min(48vh, 420px);
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 90% 75% at 8% 0%, rgba(184, 148, 74, 0.22), transparent 58%),
      radial-gradient(ellipse 60% 55% at 92% 18%, rgba(15, 39, 64, 0.09), transparent 52%),
      linear-gradient(180deg, rgba(15, 39, 64, 0.035) 0%, transparent 72%);
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
`;

export const Hero = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => `${theme.spacing(4)} 0 ${theme.spacing(1)}`};
  animation: ${softIn} 0.55s ease both;

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.7fr);
    align-items: end;
    gap: ${({ theme }) => theme.spacing(8)};
    min-height: clamp(160px, 22vh, 220px);
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;
`;

export const BrandMark = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.accent};
  font-family: var(--display-font);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

export const Greeting = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.015em;
`;

export const Lead = styled.p`
  margin: ${({ theme }) => `${theme.spacing(2.5)} 0 0`};
  max-width: 36ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.02rem;
  line-height: 1.55;
`;

export const HeroAside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.up.md} {
    align-items: flex-end;
  }
`;

export const PrimaryCta = styled.div`
  ${({ theme }) => theme.media.down.md} {
    width: 100%;

    > .ant-btn {
      width: 100%;
      min-height: 48px;
    }
  }
`;

export const QuietLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(0.5)};

  ${({ theme }) => theme.media.up.md} {
    justify-content: flex-end;
  }
`;

export const QuietLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(2)}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(15, 39, 64, 0.05);
  }
`;

export const PlanChip = styled.span`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing(3.5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.84rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: 1.15rem;
  font-weight: 600;
`;

export const SectionMeta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

export const SearchWrap = styled.div`
  flex: 1 1 220px;
  max-width: 320px;

  ${({ theme }) => theme.media.down.md} {
    flex: 1 1 100%;
    max-width: none;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3.5)};
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.up.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const CondoLink = styled(Link)<{ $delay?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  min-height: 180px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease,
    background 0.18s ease;
  animation: ${fadeUp} 0.42s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }

  &:focus-visible {
    outline-offset: 3px;
  }
`;

export const CondoTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Monogram = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.accentSoft};
  font-family: var(--display-font);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease;

  ${CondoLink}:hover & {
    transform: scale(1.05);
  }
`;

export const CondoBody = styled.div`
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

export const CondoName = styled.span`
  display: -webkit-box;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: 1.12rem;
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const CondoMeta = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.84rem;
`;

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border};
`;

export const CondoAddress = styled.span`
  display: -webkit-box;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  line-height: 1.4;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const CondoFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RoleBadge = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const EnterHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
  transition:
    color 0.15s ease,
    transform 0.15s ease;

  ${CondoLink}:hover & {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(2px);
  }
`;

export const AddCondo = styled.button<{ $delay?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-height: 180px;
  margin: 0;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font: inherit;
  font-size: 0.95rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
    transform: translateY(-3px);
  }
`;

export const Empty = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => `${theme.spacing(7)} 0 ${theme.spacing(4)}`};
  animation: ${fadeUp} 0.45s ease both;

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 0.85fr);
    align-items: end;
    gap: ${({ theme }) => theme.spacing(8)};
  }
`;

export const EmptyCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const EmptyTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const EmptyText = styled.p`
  margin: 0;
  max-width: 40ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  line-height: 1.55;
`;

export const EmptySteps = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const EmptyStep = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing(2.5)};
  align-items: start;
`;

export const StepIndex = styled.span`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: 0.85rem;
  font-weight: 600;
`;

export const StepCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StepTitle = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.92rem;
  font-weight: 600;
`;

export const StepText = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.84rem;
  line-height: 1.4;
`;

export const Footnote = styled.p`
  margin: ${({ theme }) => `${theme.spacing(2)} 0 0`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.84rem;
  line-height: 1.5;

  code {
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: rgba(15, 39, 64, 0.06);
    font-size: 0.9em;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NoResults = styled.p`
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing(6)} 0`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
  text-align: center;
`;

export const SkeletonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;
