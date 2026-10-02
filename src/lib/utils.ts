// Ссылка с учётом подпапки на GitHub Pages: url('recipes/pirog') → /family-cookbook/recipes/pirog/
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return clean ? `${base}/${clean}${clean.includes('.') ? '' : '/'}` : `${base}/`;
}

// 0.5 → «½», 1.25 → «1¼», 0.333 → «⅓», 2.4 → «2,4»
const FRACTIONS: [number, string][] = [
  [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾'],
];

export function formatAmount(value: number): string {
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest < 0.02) return String(whole);
  if (whole < 10) {
    for (const [f, sign] of FRACTIONS) {
      if (Math.abs(rest - f) < 0.03) return (whole ? String(whole) : '') + sign;
    }
  }
  const digits = value >= 10 ? 0 : 1;
  return value.toFixed(digits).replace(/\.0$/, '').replace('.', ',');
}

// Пересчитанное количество в разумной точности:
// штуки — до целых, меньше одной — половинка (1¼ яйца → 1), граммы и миллилитры — до целых (8,75 г → 9 г).
export function scaleAmount(base: number, factor: number, unit?: string | null): number {
  const v = base * factor;
  const u = (unit ?? '').trim().toLowerCase();
  if (u.startsWith('шт')) return v < 0.75 ? 0.5 : Math.round(v);
  if (u === 'г' || u === 'мл') return Math.max(1, Math.round(v));
  return v;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
