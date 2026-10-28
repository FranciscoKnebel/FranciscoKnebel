import { existsSync, readFileSync } from 'node:fs';

export function metricAsset(filename: string) {
  if (!existsSync(filename)) return null;
  const svg = readFileSync(filename, 'utf8').match(/<svg\b[^>]*>/)?.[0];
  if (!svg) return null;
  const width = Number(svg.match(/\bwidth="([\d.]+)"/)?.[1]);
  const height = Number(svg.match(/\bheight="([\d.]+)"/)?.[1]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return { src: `/${filename}`, width, height };
}
