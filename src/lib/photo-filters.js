/*
 * Media editor filters (Figma 1493:3544 "Filters" panel), as CSS filter strings.
 * `k` is intensity in 0–1. Shared by the editor canvas and the Create post preview.
 */
export const PHOTO_FILTERS = {
  original: () => 'none',
  warm: (k) => `sepia(${0.35 * k}) saturate(${1 + 0.3 * k})`,
  golden: (k) => `sepia(${0.5 * k}) saturate(${1 + 0.5 * k}) brightness(${1 + 0.05 * k})`,
  soft: (k) => `contrast(${1 - 0.15 * k}) brightness(${1 + 0.08 * k})`,
  mono: (k) => `grayscale(${k})`,
  fade: (k) => `contrast(${1 - 0.25 * k}) brightness(${1 + 0.15 * k}) saturate(${1 - 0.3 * k})`,
};

/* CSS `filter` value for a filter id at an intensity of 0–100. */
export function photoFilter(id, intensity = 100) {
  const fn = PHOTO_FILTERS[id];
  return fn ? fn(intensity / 100) : 'none';
}
