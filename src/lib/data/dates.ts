export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function startOfWeek(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function lastNDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return toIsoDate(date);
  });
}

export function isThisWeek(date: string) {
  const target = new Date(`${date}T00:00:00`);
  return target >= startOfWeek();
}

export function isThisMonth(date: string) {
  const target = new Date(`${date}T00:00:00`);
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth()
  );
}
