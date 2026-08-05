import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(6)};
  animation: ${rise} 0.4s ease both;
`;

/** Conteúdo do wizard dentro do Modal (desktop). */
export const ModalBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`;

export const Card = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
    gap: ${({ theme }) => theme.spacing(5)};
  }
`;

export const StepsWrap = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .ant-steps-item-process .ant-steps-item-icon {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
    color: ${({ theme }) => theme.colors.accent};
  }

  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after,
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const StepPanel = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing(5)};
  animation: ${rise} 0.35s ease both;
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const StepIcon = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StepTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.3;
`;

export const StepDesc = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
  line-height: 1.45;
`;

export const StepBody = styled.div`
  display: grid;
  gap: 0;
`;

export const FieldGrid = styled.div`
  display: grid;
  gap: 0 ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.media.up.md} {
    grid-template-columns: 1fr 1fr;

    > .span-2 {
      grid-column: 1 / -1;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.down.md} {
    flex-direction: column-reverse;

    > * {
      width: 100%;
    }

    button {
      width: 100%;
      min-height: 44px;
    }
  }
`;

export const ActionsRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-left: auto;

  ${({ theme }) => theme.media.down.md} {
    width: 100%;
    margin-left: 0;

    > * {
      flex: 1;
    }
  }
`;

export const ProgressHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;
