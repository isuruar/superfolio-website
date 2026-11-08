// Sample figures for every product shot on the site. Made up: never a real person's finances.
// Everything is derived from these so the numbers agree across sections.

export const BASE = 'NZD';

export const assets = [
  { name: 'Everyday account',   type: 'cash',   value: 4820 },
  { name: 'Rainy-day savings',  type: 'cash',   value: 12400 },
  { name: 'Savings in Singapore', type: 'cash', value: 5500, original: { code: 'SGD', amount: 4260 } },
  { name: 'KiwiSaver Growth',   type: 'funds',  value: 38650 },
  { name: 'Index fund',         type: 'funds',  value: 9210 },
  { name: 'ASX shares',         type: 'stocks', value: 6540, original: { code: 'AUD', amount: 6000 } },
  { name: '2019 hatchback',     type: 'other',  value: 14300 },
] as const;

export const loan = { name: 'Car loan', balance: 8400, monthly: 420, rate: 9.9 };

export const typeMeta = {
  funds:  { label: 'Unit trusts', token: '--type-funds' },
  cash:   { label: 'Cash',        token: '--type-cash' },
  other:  { label: 'Vehicle',     token: '--type-other' },
  stocks: { label: 'Stocks',      token: '--type-stocks' },
} as const;

export const totalAssets = assets.reduce((s, a) => s + a.value, 0);          // 91,420
export const netWorth = totalAssets - loan.balance;                           // 83,020

export const byType = (Object.keys(typeMeta) as (keyof typeof typeMeta)[]).map(k => {
  const value = assets.filter(a => a.type === k).reduce((s, a) => s + a.value, 0);
  return { key: k, ...typeMeta[k], value, share: value / totalAssets };
});

// Net-worth snapshots (1st of each month). The last one is today's net worth.
export const history = [
  { date: '2026-05-01', total: 71400 },
  { date: '2026-06-01', total: 72950 },
  { date: '2026-07-01', total: 74100 },
  { date: '2026-08-01', total: 76800 },
  { date: '2026-09-01', total: 78350 },
  { date: '2026-10-01', total: 81180 },
  { date: '2026-11-01', total: netWorth },
];

export const goals = [
  { name: 'Emergency fund',    kind: 'Savings',     saved: 12400, target: 15000, monthly: 250 },
  { name: 'Trip to Japan', kind: 'Savings',     saved: 3920,  target: 6000,  monthly: 320 },
  { name: 'Pay off car loan',  kind: 'Loan payoff', loan: true },
  { name: 'New laptop',        kind: 'Savings',     saved: 2000,  target: 2000,  monthly: 0, reached: '2026-10-03' },
  { name: 'House deposit',     kind: 'Savings',     saved: 0,     target: 80000, monthly: 0 },
] as const;

// Spending plan, weekly. Monthly figures are derived (× 52 ÷ 12).
export const plan = {
  takeHome: 1550,
  fixed: 841,        // rent, power, groceries, phone
  investments: 128,  // KiwiSaver, index fund
  savings: 367,      // goals
};
export const freeToSpend = plan.takeHome - plan.fixed - plan.investments - plan.savings;   // 214

// Values due for the monthly check-in.
export const checkIn = [
  { name: 'KiwiSaver Growth',   value: 'NZ$38,650',     checked: '6 weeks ago' },
  { name: 'Index fund',         value: 'NZ$9,210',      checked: '5 weeks ago' },
  { name: 'Savings in Singapore', value: 'SGD 4,260', checked: '5 weeks ago' },
];

export const currencies = ['NZD', 'AUD', 'USD', 'GBP', 'EUR', 'SGD', 'CAD', 'CHF', 'HKD', 'JPY',
  'CNY', 'INR', 'LKR', 'MYR', 'PHP', 'THB', 'AED', 'SAR', 'ZAR', 'KWD'];

// ── Helpers ──
export const money = (v: number, code = 'NZ$') => `${v < 0 ? '−' : ''}${code}${Math.round(Math.abs(v)).toLocaleString('en-NZ')}`;
export const short = (v: number) => `NZ$${(v / 1000).toFixed(1)}K`;
export const pct = (v: number) => `${Math.round(v * 100)}%`;
export const fmtDate = (d: Date) => d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtMonth = (d: Date) => d.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });

// Month-by-month payoff, the way the app's schedule works: interest accrues monthly, payment comes off.
export function payoff(balance: number, monthly: number, ratePct: number, from = new Date()) {
  const r = ratePct / 100 / 12;
  let b = balance, months = 0, interest = 0;
  while (b > 0.005 && months < 600) { const i = b * r; interest += i; b = b + i - monthly; months++; }
  const end = new Date(from.getFullYear(), from.getMonth() + months, 1);
  return { months, interest, end };
}
