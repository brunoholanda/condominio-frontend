import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const drift = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulseLine = keyframes`
  0%,
  100% {
    opacity: 0.35;
    transform: scaleY(0.7);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
`;

export const Shell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: #0a1a2c;
  color: #eef2f6;
  font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
  scroll-behavior: smooth;

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sr-only:focus {
    position: fixed;
    z-index: 100;
    top: 8px;
    left: 8px;
    width: auto;
    height: auto;
    padding: 12px 16px;
    margin: 0;
    clip: auto;
    overflow: visible;
    white-space: normal;
    border-radius: 8px;
    background: #b8944a;
    color: #0f2740;
    font-weight: 700;
    text-decoration: none;
  }
`;

export const Topbar = styled.header<{ $scrolled?: boolean }>`
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(5)}`};
  background: ${({ $scrolled }) =>
    $scrolled ? 'rgba(8, 20, 33, 0.88)' : 'transparent'};
  border-bottom: 1px solid
    ${({ $scrolled }) => ($scrolled ? 'rgba(184, 148, 74, 0.18)' : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(14px)' : 'none')};
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    backdrop-filter 0.25s ease;

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(8)}`};
  }
`;

export const BrandMark = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: #fff;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
`;

export const BrandDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 0 3px rgba(184, 148, 74, 0.18);
`;

export const TopNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.media.down.sm} {
    a[data-nav='recursos'],
    a[data-nav='planos'] {
      display: none;
    }
  }
`;

export const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.92rem;
  font-weight: 500;
  text-decoration: none;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing(2)};

  &:hover {
    color: #fff;
  }
`;

export const NavCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 ${({ theme }) => theme.spacing(4)};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  ${({ theme }) => theme.media.down.sm} {
    padding: 0 ${({ theme }) => theme.spacing(3)};
    font-size: 0.82rem;
  }

  &:hover {
    background: #c9a65a;
    transform: translateY(-1px);
  }
`;

export const Hero = styled.section`
  position: relative;
  display: grid;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  padding: ${({ theme }) =>
    `${theme.spacing(18)} ${theme.spacing(5)} ${theme.spacing(12)}`};

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) =>
      `${theme.spacing(20)} ${theme.spacing(8)} ${theme.spacing(14)}`};
  }
`;

export const HeroBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 78% 28%, rgba(184, 148, 74, 0.28), transparent 58%),
    radial-gradient(ellipse 55% 45% at 12% 78%, rgba(24, 58, 92, 0.95), transparent 52%),
    linear-gradient(168deg, #071320 0%, #0f2740 46%, #14304a 100%);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: linear-gradient(to bottom, transparent, black 18%, black 68%, transparent);
    pointer-events: none;
  }
`;

export const Skyline = styled.svg`
  position: absolute;
  right: -2%;
  bottom: 0;
  width: min(760px, 94vw);
  height: auto;
  opacity: 0.92;
  animation: ${drift} 14s ease-in-out infinite;
  pointer-events: none;

  ${({ theme }) => theme.media.down.md} {
    right: -22%;
    width: 128vw;
    opacity: 0.48;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 38rem;
`;

export const HeroBrand = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.accent};
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(2.55rem, 9vw, 4.5rem);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.03em;
  animation: ${rise} 0.7s ease-out both;
`;

export const HeroTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: #fff;
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 500;
  line-height: 1.28;
  animation: ${rise} 0.75s ease-out 0.08s both;
`;

export const HeroLead = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(5)};
  max-width: 34ch;
  color: rgba(238, 242, 246, 0.78);
  font-size: 1.06rem;
  line-height: 1.55;
  animation: ${rise} 0.75s ease-out 0.16s both;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  animation: ${rise} 0.75s ease-out 0.24s both;

  ${({ theme }) => theme.media.down.sm} {
    flex-direction: column;

    > a {
      width: 100%;
    }
  }
`;

export const ScrollHint = styled.a`
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: ${({ theme }) => theme.spacing(5)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  animation: ${rise} 1s ease-out 0.5s both;

  ${({ theme }) => theme.media.down.md} {
    display: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ScrollHintLine = styled.span`
  width: 1px;
  height: 28px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.accent}, transparent);
  transform-origin: top center;
  animation: ${pulseLine} 2s ease-in-out infinite;
`;

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing(5)};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(184, 148, 74, 0.35);
  }
`;

export const GhostButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing(5)};
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(5)}`};
  background: #eef1f5;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) => `${theme.spacing(20)} ${theme.spacing(8)}`};
  }
`;

export const SectionInner = styled.div`
  width: min(1080px, 100%);
  margin: 0 auto;
`;

export const SectionEyebrow = styled.p<{ $onDark?: boolean }>`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme, $onDark }) => ($onDark ? theme.colors.accent : theme.colors.primary)};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: ${({ $onDark }) => ($onDark ? 0.95 : 0.7)};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.65rem, 3.2vw, 2.2rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const SectionLead = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(10)};
  max-width: 42ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.05rem;
  line-height: 1.55;
`;

export const BenefitList = styled.ul`
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 0;
    gap: ${({ theme }) => theme.spacing(2)};
  }
`;

export const BenefitItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => `${theme.spacing(6)} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${rise} 0.7s ease-out both;

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(4)};
    padding: ${({ theme }) =>
      `${theme.spacing(2)} ${theme.spacing(5)} ${theme.spacing(2)} ${theme.spacing(5)}`};
    border-bottom: 0;
    border-left: 2px solid ${({ theme }) => theme.colors.accent};
  }

  &:nth-child(2) {
    animation-delay: 0.08s;
  }

  &:nth-child(3) {
    animation-delay: 0.16s;
  }
`;

export const BenefitIndex = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1;
`;

export const BenefitTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
`;

export const BenefitText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;
`;

export const StepsSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(5)}`};
  background:
    radial-gradient(ellipse 50% 70% at 10% 40%, rgba(184, 148, 74, 0.12), transparent 55%),
    #0f2740;
  color: #fff;

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) => `${theme.spacing(20)} ${theme.spacing(8)}`};
  }
`;

export const StepsTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(10)};
  max-width: 18ch;
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.65rem, 3.2vw, 2.2rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const StepsList = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.spacing(8)};
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing(10)};
  }
`;

export const StepItem = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  max-width: 32ch;
`;

export const StepNumber = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(184, 148, 74, 0.55);
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.accent};
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
`;

export const StepTitle = styled.h3`
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
`;

export const StepText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.98rem;
  line-height: 1.55;
`;

export const PlansSection = styled(Section)`
  background: linear-gradient(180deg, #e8edf3 0%, #eef1f5 55%, #f3f5f8 100%);
`;

export const PlanGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }
`;

export const PlanCard = styled.button<{ $active: boolean; $featured?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing(5)};
  border: 2px solid
    ${({ theme, $active, $featured }) =>
      $active ? theme.colors.accent : $featured ? 'rgba(184, 148, 74, 0.55)' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $active }) => ($active ? '#0f2740' : '#fff')};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.text)};
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? '0 18px 44px rgba(15, 39, 64, 0.28)' : '0 6px 20px rgba(15, 39, 64, 0.06)'};
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const PlanName = styled.span`
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 600;
`;

export const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const PlanAmount = styled.strong`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const PlanPeriod = styled.span`
  opacity: 0.7;
  font-size: 0.9rem;
`;

export const PlanSummary = styled.p`
  margin: 0;
  opacity: 0.85;
  font-size: 0.95rem;
  line-height: 1.45;
`;

export const PlanFeatures = styled.ul`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  padding: 0;
  list-style: none;
  width: 100%;

  li {
    position: relative;
    padding: ${({ theme }) => `${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(5)}`};
    font-size: 0.92rem;
    line-height: 1.4;
    opacity: 0.9;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.7em;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const PlanBadge = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border-radius: 999px;
  background: rgba(184, 148, 74, 0.2);
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const PlanCta = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.72);
`;

export const PlanCtaHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

export const PlanCtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.down.sm} {
    flex-direction: column;
    align-items: stretch;

    > a {
      width: 100%;
    }
  }
`;

export const DarkCta = styled.section`
  padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(5)}`};
  background:
    radial-gradient(ellipse 55% 80% at 85% 40%, rgba(184, 148, 74, 0.2), transparent 55%),
    linear-gradient(145deg, #0a1a2c, #0f2740 55%, #163652);
  color: #fff;
  text-align: center;

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) => `${theme.spacing(20)} ${theme.spacing(8)}`};
  }
`;

export const DarkCtaInner = styled.div`
  width: min(560px, 100%);
  margin: 0 auto;
  animation: ${rise} 0.7s ease-out both;
`;

export const DarkCtaTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.65rem, 3.2vw, 2.3rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const DarkCtaLead = styled.p`
  margin: 0 auto ${({ theme }) => theme.spacing(7)};
  max-width: 36ch;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.55;
`;

export const LightGhostButton = styled(GhostButton)`
  color: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: rgba(15, 39, 64, 0.05);
  }
`;

export const Footer = styled.footer`
  background: #06101c;
  color: rgba(255, 255, 255, 0.62);
  border-top: 1px solid rgba(184, 148, 74, 0.22);
`;

export const FooterInner = styled.div`
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing(10)} ${theme.spacing(5)} ${theme.spacing(6)}`};

  ${({ theme }) => theme.media.up.md} {
    padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(8)} ${theme.spacing(7)}`};
  }
`;

export const FooterTop = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(8)};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 0.7fr));
    gap: ${({ theme }) => theme.spacing(10)};
    align-items: start;
  }
`;

export const FooterBrandCol = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  max-width: 34ch;
`;

export const FooterBrand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  width: fit-content;
  color: #fff;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const FooterTagline = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.92rem;
  line-height: 1.55;
`;

export const FooterCol = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  align-content: start;
`;

export const FooterColTitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const FooterLink = styled.a`
  width: fit-content;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.92rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(9)};
  padding-top: ${({ theme }) => theme.spacing(5)};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  line-height: 1.5;

  ${({ theme }) => theme.media.up.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

export const FooterLegal = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.48);
`;

export const FooterMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  color: rgba(255, 255, 255, 0.48);

  a,
  button {
    color: rgba(255, 255, 255, 0.72);

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;
