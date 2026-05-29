export function formatNumber(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Not logged";
  }

  return `${Math.round(value * 10) / 10}${suffix}`;
}

export function sum(values: Array<number | null | undefined>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

export function average(
  values: Array<number | null | undefined>,
): number | null {
  const realValues = values.filter(
    (value): value is number => value !== null && value !== undefined,
  );

  if (realValues.length === 0) {
    return null;
  }

  return sum(realValues) / realValues.length;
}

export function currency(value: number, code = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(value);
}
