export function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = units[0];
  for (let i = 0; i < units.length; i += 1) {
    unit = units[i];
    if (value < 1024 || i === units.length - 1) break;
    value /= 1024;
  }
  if (unit === 'B') return `${Math.round(value)} B`;
  return `${value.toFixed(value < 10 ? 2 : 1)} ${unit}`;
}

export function calcSavings(before, after) {
  if (!before) return '0.0% smaller';
  const ratio = ((before - after) / before) * 100;
  return `${ratio >= 0 ? ratio.toFixed(1) : `+${Math.abs(ratio).toFixed(1)}`}% ${ratio >= 0 ? 'smaller' : 'larger'}`;
}

export function withModeSuffix(name, mode) {
  const idx = name.toLowerCase().lastIndexOf('.pdf');
  if (idx < 0) return `${name}-${mode}.pdf`;
  return `${name.slice(0, idx)}-${mode}.pdf`;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
