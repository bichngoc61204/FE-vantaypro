export const uid = () => `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
export const norm = (s) => (s || "").toLowerCase().trim();

export const parseISODate = (d) => new Date(`${d}T00:00:00`);
export const fmtDate = (d) => d.toISOString().slice(0, 10);

export function getCurrentYearId(years) {
  return years.find((y) => y.is_current)?.id || years[0]?.id;
}

export function isBetween(dateStr, fromStr, toStr) {
  const d = parseISODate(dateStr);
  return d >= parseISODate(fromStr) && d <= parseISODate(toStr);
}

export function timeToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

export function dtToDateStr(dt) {
  return dt.slice(0, 10);
}

export function dtToTimeStr(dt) {
  return dt.slice(11, 16);
}

export function statusPill(status) {
  switch (status) {
    case "CLOSED":
      return "pill--danger";
    case "IN_PROGRESS":
      return "pill--warn";
    case "GENERATED":
      return "pill--info";
    case "DRAFT":
    default:
      return "pill--muted";
  }
}
