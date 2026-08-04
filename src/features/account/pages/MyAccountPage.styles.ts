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
  gap: ${({ theme }) => theme.spacing(8)};
  animation: ${rise} 0.45s ease both;
`;

export const Profile = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.15rem;
  font-weight: 700;
`;

export const ProfileText = styled.div`
  min-width: 0;
`;

export const ProfileName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  font-weight: 600;
`;

export const ProfileEmail = styled.p`
  margin: 2px 0 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PlanPanel = styled.section`
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(7)};
  border-radius: ${({ theme }) => theme.radii.lg};
  background:
    radial-gradient(120% 80% at 100% 0%, rgba(184, 148, 74, 0.28), transparent 55%),
    linear-gradient(145deg, #0f2740 0%, #183a5c 55%, #0c1d30 100%);
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: ${rise} 0.5s ease 0.05s both;

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(5)};
  }
`;

export const PlanEyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PlanHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const PlanTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
`;

export const PlanPrice = styled.p`
  margin: ${({ theme }) => theme.spacing(2)} 0 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 1.05rem;

  strong {
    color: ${({ theme }) => theme.colors.accent};
    font-size: 1.35rem;
    font-weight: 700;
  }
`;

export const PlanSummary = styled.p`
  margin: ${({ theme }) => theme.spacing(3)} 0 0;
  max-width: 42ch;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const Highlights = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(5)} 0 0;
  padding: 0;
  list-style: none;

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Highlight = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(2)};
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.9rem;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const TrialBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(0, 0, 0, 0.18);
`;

export const TrialLabel = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.82);

  strong {
    color: #fff;
  }
`;

export const TrialTrack = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
`;

export const TrialFill = styled.div<{ $ratio: number }>`
  height: 100%;
  width: ${({ $ratio }) => `${Math.min(100, Math.max(0, $ratio * 100))}%`};
  border-radius: inherit;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent}, #e0c48a);
  transition: width 0.6s ease;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(5)};

  .ant-btn {
    min-height: 44px;
  }

  ${({ theme }) => theme.media.down.md} {
    flex-direction: column;

    .ant-btn {
      width: 100%;
    }
  }
`;

export const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
  animation: ${rise} 0.5s ease 0.12s both;
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
  font-size: 1.15rem;
  font-weight: 600;
`;

export const SectionDesc = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const UpgradeGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const UpgradeOption = styled.button`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.card};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const UpgradeName = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 700;
`;

export const UpgradePrice = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.95rem;
  font-weight: 700;
`;

export const UpgradeSummary = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.45;
`;

export const UpgradeCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.88rem;
  font-weight: 600;
`;

export const TicketList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TicketItem = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const TicketMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TicketSubject = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.98rem;
  font-weight: 600;
`;

export const EmptyTickets = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-items: start;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(4)};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: left;

  p {
    margin: 0;
    max-width: 42ch;
    line-height: 1.5;
  }
`;
