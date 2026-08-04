import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
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
  --page-font: 'Source Sans 3', 'Segoe UI', sans-serif;
  --display-font: 'Fraunces', Georgia, serif;

  position: relative;
  max-width: 720px;
  margin: ${({ theme }) => `-${theme.spacing(2)} auto 0`};
  font-family: var(--page-font);
  animation: ${fadeUp} 0.45s ease both;

  &::before {
    content: '';
    position: absolute;
    inset: -${({ theme }) => theme.spacing(4)} -${({ theme }) => theme.spacing(6)} auto;
    height: 220px;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 70% 80% at 0% 0%, rgba(184, 148, 74, 0.16), transparent 55%),
      linear-gradient(180deg, rgba(15, 39, 64, 0.03) 0%, transparent 100%);
  }
`;

export const Header = styled.header`
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

export const BrandMark = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.accent};
  font-family: var(--display-font);
  font-size: 1.1rem;
  font-weight: 600;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: clamp(1.55rem, 3vw, 1.9rem);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const Lead = styled.p`
  margin: ${({ theme }) => `${theme.spacing(2)} 0 0`};
  max-width: 42ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.98rem;
  line-height: 1.5;
`;

export const StepsWrap = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  .ant-steps-item-title {
    font-size: 0.82rem !important;
  }

  ${({ theme }) => theme.media.down.md} {
    .ant-steps-item-title {
      display: none;
    }
  }
`;

export const Panel = styled.section`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  animation: ${fadeUp} 0.35s ease both;

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const StepHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--display-font);
  font-size: 1.2rem;
  font-weight: 600;
`;

export const StepHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.45;
`;

export const SlugPreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }

  code {
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: rgba(15, 39, 64, 0.06);
    font-size: 0.92em;
  }
`;

export const UnitCount = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-family: var(--display-font);
    font-size: 1.15rem;
  }
`;

export const CoordsRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.up.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ReviewGrid = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  margin: 0;
`;

export const ReviewItem = styled.div`
  display: grid;
  gap: 4px;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const ReviewLabel = styled.dt`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const ReviewValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.98rem;
  line-height: 1.45;
  word-break: break-word;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.down.md} {
    flex-direction: column-reverse;

    > .ant-btn {
      width: 100%;
      min-height: 44px;
    }
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    flex-direction: column;

    > .ant-btn {
      width: 100%;
      min-height: 44px;
    }
  }
`;
