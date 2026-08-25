// Relative luminance (WCAG) to decide whether a light or dark foreground
// reads better on a given accent background. Needed because the bold accent
// palette mixes light colors (lime, amber) with medium/dark ones (purple,
// teal) — a single hardcoded white/black choice looks wrong on half of them.
function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.substring(i, i + 2), 16) / 255);
  const [rl, gl, bl] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function contrastText(backgroundHex: string): '#141414' | '#FFFFFF' {
  return luminance(backgroundHex) > 0.55 ? '#141414' : '#FFFFFF';
}
