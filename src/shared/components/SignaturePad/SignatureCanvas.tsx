import { PenLine } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { exportSignature } from '@/shared/utils/signature-image';
import { theme } from '@/styles/theme';
import * as S from './SignaturePad.styles';

interface Point {
  x: number;
  y: number;
}

interface SignatureCanvasProps {
  /** Data URL of the current signature. */
  value?: string;
  onChange?: (value?: string) => void;
  disabled?: boolean;
  /** Stretches the board to the available height, used by the fullscreen sheet. */
  fill?: boolean;
}

const STROKE_WIDTH = 2.4;
/** Above this the image only gets heavier, without looking any sharper. */
const MAX_PIXEL_RATIO = 2;

function pointOf(event: React.PointerEvent<HTMLCanvasElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();

  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/** Drawing surface shared by the inline field and by the fullscreen sheet. */
export function SignatureCanvas({
  value,
  onChange,
  disabled = false,
  fill = false,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef(value);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastMidpointRef = useRef<Point | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  const getContext = (): CanvasRenderingContext2D | null =>
    canvasRef.current?.getContext('2d') ?? null;

  /** Resizes the backing store to the element and repaints the stored signature. */
  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const { width, height } = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.lineWidth = STROKE_WIDTH;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = theme.colors.primary;

    const stored = imageRef.current;

    if (stored) {
      const image = new Image();

      image.addEventListener('load', () => {
        // Fits the stored drawing without stretching it: the board it was signed
        // on may have had a different size, in particular on another device.
        const scale = Math.min(width / image.width, height / image.height, 1);
        const drawnWidth = image.width * scale;
        const drawnHeight = image.height * scale;

        context.drawImage(
          image,
          (width - drawnWidth) / 2,
          (height - drawnHeight) / 2,
          drawnWidth,
          drawnHeight,
        );
      });

      image.src = stored;
    }
  }, []);

  useEffect(() => {
    prepareCanvas();

    const canvas = canvasRef.current;

    if (!canvas || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => prepareCanvas());
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [prepareCanvas]);

  // Repaints when the value changes outside the canvas, such as a form reset.
  useEffect(() => {
    if (value === imageRef.current) {
      return;
    }

    imageRef.current = value;
    setIsEmpty(!value);
    prepareCanvas();
  }, [prepareCanvas, value]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = getContext();

    if (disabled || !context) {
      return;
    }

    const point = pointOf(event);

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = point;
    lastMidpointRef.current = point;

    // A single tap should leave a dot behind, not an invisible empty path.
    context.beginPath();
    context.arc(point.x, point.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
    context.fillStyle = theme.colors.primary;
    context.fill();

    setIsEmpty(false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = getContext();
    const previous = lastPointRef.current;
    const lastMidpoint = lastMidpointRef.current;

    if (!isDrawingRef.current || !context || !previous || !lastMidpoint) {
      return;
    }

    const point = pointOf(event);
    // Curving from midpoint to midpoint, bending around the sampled point, keeps
    // the line unbroken and smooths the jitter of a finger on glass.
    const midpoint = { x: (previous.x + point.x) / 2, y: (previous.y + point.y) / 2 };

    context.beginPath();
    context.moveTo(lastMidpoint.x, lastMidpoint.y);
    context.quadraticCurveTo(previous.x, previous.y, midpoint.x, midpoint.y);
    context.stroke();

    lastPointRef.current = point;
    lastMidpointRef.current = midpoint;
  };

  const handlePointerUp = () => {
    const canvas = canvasRef.current;

    if (!isDrawingRef.current || !canvas) {
      return;
    }

    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastMidpointRef.current = null;

    const image = exportSignature(canvas);
    imageRef.current = image;
    onChange?.(image);
  };

  return (
    <S.Board $disabled={disabled} $fill={fill}>
      <S.Canvas
        ref={canvasRef}
        $fill={fill}
        aria-label="Área de assinatura"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {isEmpty ? (
        <S.Placeholder>
          <PenLine size={16} aria-hidden />
          Assine aqui
        </S.Placeholder>
      ) : null}
    </S.Board>
  );
}
