// Goal and payoff dates depend on today, so they're recomputed in the browser.
// The built HTML already holds the same dates as of build day, so nothing is blank without JavaScript.
const DAY = 864e5, MONTH = 30.4375 * DAY;
const today = new Date(); today.setHours(0, 0, 0, 0);
const fmtDate = (d: Date) => d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtMonth = (d: Date) => d.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });
export const inWords = (d: Date) => {
  const m = Math.round((d.getTime() - today.getTime()) / MONTH);
  return m <= 0 ? 'this month' : m === 1 ? 'in 1 month' : m < 12 ? `in ${m} months` : `in ${Math.floor(m / 12)}y ${m % 12}m`;
};

document.querySelectorAll<HTMLElement>('[data-goal-remaining]').forEach(el => {
  const remaining = +el.dataset.goalRemaining!, monthly = +el.dataset.goalMonthly!;
  if (!monthly) return;
  const d = new Date(today.getTime() + remaining / monthly * MONTH);
  const date = el.querySelector('[data-date]'), when = el.querySelector('[data-when]');
  if (date) date.textContent = fmtDate(d);
  if (when) when.textContent = inWords(d);
});

document.querySelectorAll<HTMLElement>('[data-loan-months]').forEach(el => {
  const d = new Date(today.getFullYear(), today.getMonth() + +el.dataset.loanMonths!, 1);
  el.textContent = fmtMonth(d);
});

document.querySelectorAll<HTMLElement>('[data-next-month]').forEach(el => {
  el.textContent = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long' });
});
