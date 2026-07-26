import Foundation

/// Percent change from `previous` to `current`. Returns nil when `previous`
/// is 0 and `current` isn't — the change is unbounded/undefined as a ratio,
/// so callers should render something like "New" instead of a percentage.
/// Mirrors the web app's `lib/percentChange.ts`.
func percentChange(current: Decimal, previous: Decimal) -> Double? {
    if previous == 0 {
        return current == 0 ? 0 : nil
    }
    let currentValue = NSDecimalNumber(decimal: current).doubleValue
    let previousValue = NSDecimalNumber(decimal: previous).doubleValue
    return ((currentValue - previousValue) / abs(previousValue)) * 100
}
