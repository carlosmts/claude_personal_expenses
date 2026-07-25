/**
 * Percent change from `previous` to `current`. Returns null when `previous`
 * is 0 and `current` isn't — the change is unbounded/undefined as a ratio,
 * so callers should render something like "New" instead of a percentage.
 */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}
