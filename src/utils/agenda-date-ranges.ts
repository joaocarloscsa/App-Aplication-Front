// path: frontend/src/utils/agenda-date-ranges.ts

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function dayRange(d: Date) {
  return {
    from: startOfDay(d),
    to: endOfDay(d),
  };
}

export function weekRange(d: Date) {
  const day = d.getDay() || 7; // domingo = 7
  const monday = new Date(d);
  monday.setDate(d.getDate() - day + 1);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: startOfDay(monday),
    to: endOfDay(sunday),
  };
}

export function monthRange(d: Date) {
  const from = new Date(d.getFullYear(), d.getMonth(), 1);
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 0);

  return {
    from: startOfDay(from),
    to: endOfDay(to),
  };
}

export function yearRange(d: Date) {
  const from = new Date(d.getFullYear(), 0, 1);
  const to = new Date(d.getFullYear(), 11, 31);

  return {
    from: startOfDay(from),
    to: endOfDay(to),
  };
}

export function rangeByView(
  view: "day" | "week" | "month" | "year",
  reference: Date
) {
  switch (view) {
    case "day":
      return dayRange(reference);
    case "week":
      return weekRange(reference);
    case "month":
      return monthRange(reference);
    case "year":
      return yearRange(reference);
  }
}

