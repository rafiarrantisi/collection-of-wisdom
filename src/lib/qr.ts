import QRCode from 'qrcode';

export interface QrMatrix {
  size: number;
  dark: (row: number, col: number) => boolean;
}

/** Build a QR matrix synchronously so it can be rendered as crisp vector SVG. */
export function qrMatrix(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const { size, data } = qr.modules;
  return { size, dark: (r, c) => Boolean(data[r * size + c]) };
}

/** One SVG path string with a 1×1 square per dark module (quiet zone added by caller). */
export function qrPath(m: QrMatrix, offset: number): string {
  const parts: string[] = [];
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (m.dark(r, c)) parts.push(`M${c + offset} ${r + offset}h1v1h-1z`);
    }
  }
  return parts.join('');
}
