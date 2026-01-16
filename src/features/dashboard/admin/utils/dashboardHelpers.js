
export function makeTrend30Days(todayISO, opts = {}) {
  const { basePresentRate = 0.945, volatility = 0.02, baseLate = 52 } = opts;
  const days = 30;

  // deterministic pseudo
  let seed = hashString(todayISO + JSON.stringify(opts));
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const iso = shiftISO(todayISO, -i);
    const label = iso.slice(5).replace("-", "/"); // MM/DD
    const wave = Math.sin((i / 6) * Math.PI) * (volatility * 0.7);
    const noise = (rand() - 0.5) * volatility;
    const presentRate = clamp((basePresentRate + wave + noise) * 100, 86, 99.4);
    const absentRate = clamp(100 - presentRate - clamp((0.03 + (rand() - 0.5) * 0.01) * 100, 1.4, 4.2), 0.8, 6.5);
    const lateRate = clamp(100 - presentRate - absentRate, 1.2, 8.0);
    const lateCount = Math.round(baseLate * (lateRate / 5.2) + (rand() - 0.5) * 12);
    out.push({
      iso,
      label,
      presentRate: round1(presentRate),
      lateCount: Math.max(0, lateCount),
      absentRate: round1(absentRate),
    });
  }
  return out;
}

export function shiftISO(iso, deltaDays) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function round1(v) {
  return Math.round(v * 10) / 10;
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function formatInt(n) {
  return new Intl.NumberFormat("vi-VN").format(n);
}
