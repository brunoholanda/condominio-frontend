export interface DownloadedFile {
  blob: Blob;
  fileName: string;
}

const FILE_NAME_PATTERN = /filename="?([^";]+)"?/i;

/** Reads the name the API suggested in `Content-Disposition`. */
export function fileNameFromDisposition(disposition: unknown, fallback: string): string {
  if (typeof disposition !== 'string') {
    return fallback;
  }

  return FILE_NAME_PATTERN.exec(disposition)?.[1] ?? fallback;
}

/** Hands the file to the browser without leaving the page. */
export function saveFile({ blob, fileName }: DownloadedFile): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
