const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'EUR',
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}
