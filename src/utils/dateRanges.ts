// path: src/utils/dateRanges.ts

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function weekRange(date: Date) {
  const d = new Date(date);
  const day = d.getDay() || 7; // domingo = 7
  const monday = new Date(d);
  monday.setDate(d.getDate() - day + 1);

  return {
    from: startOfDay(monday),
    to: endOfDay(new Date(monday.getTime() + 6 * 86400000)),
  };
}

export function monthRange(date: Date) {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    from: startOfDay(from),
    to: endOfDay(to),
  };
}

