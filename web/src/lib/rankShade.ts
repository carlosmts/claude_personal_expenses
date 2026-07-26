// Greyscale ramp used to shade chart slices/bars by sort position rather
// than by category or person identity — the biggest slice is darkest,
// tapering to light grey. Matches the Finbond reference design, where e.g.
// a donut chart's biggest category is near-black and the smallest is pale
// grey regardless of what that category actually is.
const RANK_SHADES = ['#0f172a', '#475569', '#94a3b8', '#cbd5e1', '#e2e8f0'];

export function rankShade(index: number): string {
  return RANK_SHADES[Math.min(index, RANK_SHADES.length - 1)];
}
