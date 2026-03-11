export function localDateToUtcStartIso(date: string) {
  const [y, m, d] = date.split("-").map(Number);

  const local = new Date(y, m - 1, d, 0, 0, 0);

  return new Date(
    local.getTime() - local.getTimezoneOffset() * 60000
  ).toISOString();
}

export function localDateToUtcEndIso(date: string) {
  const [y, m, d] = date.split("-").map(Number);

  const local = new Date(y, m - 1, d, 23, 59, 59);

  return new Date(
    local.getTime() - local.getTimezoneOffset() * 60000
  ).toISOString();
}
