export const fmtOrden = (n) =>
  n != null ? String(n).padStart(8, '0') : '—';
