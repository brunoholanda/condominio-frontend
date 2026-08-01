import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Board = styled.div<{ $disabled: boolean; $fill?: boolean }>`
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  ${({ $fill }) => ($fill ? 'flex: 1; min-height: 0;' : '')}
`;

export const Canvas = styled.canvas<{ $fill?: boolean }>`
  display: block;
  width: 100%;
  height: ${({ $fill }) => ($fill ? '100%' : '200px')};
  /* Keeps the finger drawing instead of scrolling the page. */
  touch-action: none;
  cursor: crosshair;

  ${({ theme }) => theme.media.down.md} {
    height: ${({ $fill }) => ($fill ? '100%' : '170px')};
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

export const ToolbarActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const Overlay = styled.dialog`
  /* Fills the visible area even with the mobile browser bars on screen. */
  width: 100vw;
  max-width: 100vw;
  height: 100dvh;
  max-height: 100dvh;
  margin: 0;
  border: 0;
  padding: ${({ theme }) => theme.spacing(4)};
  padding-bottom: max(${({ theme }) => theme.spacing(4)}, env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &[open] {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(3)};
  }
`;

export const SheetHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const SheetTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SheetActions = styled.footer`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  /* Confirming is the rightmost, largest target; clearing stays on the far left. */
  > :last-child {
    flex: 1;
  }

  ${({ theme }) => theme.media.up.sm} {
    justify-content: flex-end;

    > :last-child {
      flex: 0 0 auto;
    }
  }
`;
