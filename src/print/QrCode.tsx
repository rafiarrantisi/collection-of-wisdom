import { qrMatrix, qrPath } from '../lib/qr';

const QUIET = 4; // modules of quiet zone, per the QR spec

/** Vector QR code; encodes the exact URL given. */
export function QrCode({ url, className }: { url: string; className?: string }) {
  const m = qrMatrix(url);
  const total = m.size + QUIET * 2;
  return (
    <svg
      className={className ?? 'qr'}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label={`Kode QR untuk ${url}`}
      shapeRendering="crispEdges"
      data-qr={url}
    >
      <rect width={total} height={total} fill="#FAF7F1" />
      <path d={qrPath(m, QUIET)} fill="#2B2621" />
    </svg>
  );
}
