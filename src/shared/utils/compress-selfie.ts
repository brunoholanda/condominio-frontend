/** Teto da selfie de ponto (envio + armazenamento). */
export const MAX_SELFIE_BYTES = 150 * 1024;

/** Lado maior inicial da selfie (proporção reduzida para celular). */
const MAX_EDGE_PX = 960;

const QUALITY_STEPS = [0.82, 0.72, 0.62, 0.52, 0.42, 0.34];
const SCALE_STEPS = [1, 0.85, 0.7, 0.55, 0.45];

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function drawScaled(source: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const target = document.createElement('canvas');
  target.width = width;
  target.height = height;

  const ctx = target.getContext('2d');

  if (!ctx) {
    return source;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);

  return target;
}

/** Reduz o frame da câmera mantendo proporção e cabendo em até 150 KB (JPEG). */
export function fitSelfieCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const edge = Math.max(source.width, source.height);

  if (edge <= MAX_EDGE_PX) {
    return source;
  }

  return drawScaled(source, MAX_EDGE_PX / edge);
}

/**
 * Comprime a selfie para JPEG ≤ 150 KB, baixando qualidade e depois a resolução.
 * Sempre retorna um blob JPEG (melhor esforço se o limite não for atingido).
 */
export async function compressSelfieBlob(source: HTMLCanvasElement): Promise<Blob> {
  const fitted = fitSelfieCanvas(source);
  let best: Blob | null = null;

  for (const scale of SCALE_STEPS) {
    const canvas = scale === 1 ? fitted : drawScaled(fitted, scale);

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, 'image/jpeg', quality);

      if (!blob) {
        continue;
      }

      best = blob;

      if (blob.size <= MAX_SELFIE_BYTES) {
        return blob;
      }
    }
  }

  if (best) {
    return best;
  }

  throw new Error('Não foi possível comprimir a selfie.');
}
