import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Board = styled.div<{ $disabled: boolean }>`
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 200px;
  /* Keeps the finger drawing instead of scrolling the page. */
  touch-action: none;
  cursor: crosshair;

  ${({ theme }) => theme.media.down.md} {
    height: 170px;
  }
`;

/** Baseline hint drawn over the canvas so it never ends up inside the image. */
export const Placeholder = styled.div`
  position: absolute;
  inset: auto ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(6)};
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(2)};
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  pointer-events: none;
  user-select: none;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Hint = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;
