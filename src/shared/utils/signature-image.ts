/** Storage ceiling accepted by the API for a signature image. */
const MAX_SIGNATURE_BYTES = 256 * 1024;

/** Tried in order: the first copy that fits the limit is the one that is sent. */
const PNG_SCALES = [1, 0.75, 0.5];
const JPEG_ATTEMPTS = [
  { scale: 0.75, quality: 0.85 },
  { scale: 0.6, quality: 0.75 },
  { scale: 0.5, quality: 0.6 },
];

export function dataUrlByteLength(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;

  return (base64.length * 3) / 4 - padding;
}

function render(
  source: HTMLCanvasElement,
  scale: number,
  type: 'image/png' | 'image/jpeg',
  quality?: number,
): string {
  const target = document.createElement('canvas');
  target.width = Math.max(1, Math.round(source.width * scale));
  target.height = Math.max(1, Math.round(source.height * scale));

  const context = target.getContext('2d');

  if (!context) {
    return source.toDataURL(type, quality);
  }

  // JPEG has no transparency, so the ink needs an opaque background to stay readable.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, target.width, target.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, target.width, target.height);

  return target.toDataURL(type, quality);
}

/**
 * Exports the drawing as the sharpest image that still fits the storage limit.
 *
 * A signature is mostly flat colour, so the lossless full-size PNG normally wins
 * on the first attempt; the smaller copies only exist so that a very large
 * screen or a very dense scribble never blocks the resident from submitting.
 */
export function exportSignature(source: HTMLCanvasElement): string {
  for (const scale of PNG_SCALES) {
    const png = render(source, scale, 'image/png');

    if (dataUrlByteLength(png) <= MAX_SIGNATURE_BYTES) {
      return png;
    }
  }

  for (const { scale, quality } of JPEG_ATTEMPTS) {
    const jpeg = render(source, scale, 'image/jpeg', quality);

    if (dataUrlByteLength(jpeg) <= MAX_SIGNATURE_BYTES) {
      return jpeg;
    }
  }

  return render(source, 0.35, 'image/jpeg', 0.5);
}
