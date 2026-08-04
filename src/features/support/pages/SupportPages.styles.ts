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

export const FormCard = styled.section`
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: ${rise} 0.4s ease both;

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};

    button[type='submit'] {
      width: 100%;
      min-height: 44px;
    }
  }
`;

export const FormTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.15rem;
  font-weight: 650;
`;

export const FormHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const CategoryGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const CategoryOption = styled.button<{ $active?: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing(1)};
  min-height: 88px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentSoft : theme.colors.surfaceMuted)};
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.98rem;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.82rem;
    line-height: 1.4;
  }
`;

export const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const SectionHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  font-weight: 650;
`;

export const SectionDesc = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
`;

export const FilterBar = styled.div`
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

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Row = styled.article`
  padding: ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;

export const Subject = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.35;
`;

export const Body = styled.p`
  margin: ${({ theme }) => theme.spacing(3)} 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

export const ToggleBody = styled.button`
  margin-top: ${({ theme }) => theme.spacing(3)};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
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
    max-width: 40ch;
    line-height: 1.5;
  }
`;

export const AdminFilters = styled.div`
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

export const ExpandBody = styled.div`
  max-width: 720px;
  white-space: pre-wrap;
  line-height: 1.55;
`;
