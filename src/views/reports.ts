/**
 * AuraMaster Reports & Analytics View
 * Complete financial reporting with daily breakdown (October 2026 full 31 days),
 * payment gateway distribution, and performance metrics.
 */
import { store } from '../utils/store';
import { MOCK_OCTOBER_REPORT } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../utils/toast';

export function renderReportsView(): string {
  const state = store.getState();
  const symbol = state.currentClient.currencySymbol;

  // Calculate totals for October 2026
  const totalOrders = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.orders, 0);
  const totalItems = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.itemsSold, 0);
  const totalRevenue = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.revenue, 0);
  const totalDiscount = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.discount, 0);
  const totalShipping = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.shipping, 0);
  const totalCOGS = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.cogs, 0);
  const totalExpenses = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.expenses, 0);
  const totalNetProfit = MOCK_OCTOBER_REPORT.reduce((acc, r) => acc + r.netProfit, 0);

  const dailyRowsHtml = MOCK_OCTOBER_REPORT.map((row) => `
    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      <td class="font-medium text-xs text-slate-900 dark:text-white">${row.date}</td>
      <td class="tabular-nums text-xs text-center">${row.orders}</td>
      <td class="tabular-nums text-xs text-center">${row.itemsSold}</td>
      <td class="tabular-nums text-xs font-semibold text-slate-900 dark:text-white text-right">${formatCurrency(row.revenue, symbol)}</td>
      <td class="tabular-nums text-xs text-rose-500 text-right">- ${formatCurrency(row.discount, symbol)}</td>
      <td class="tabular-nums text-xs text-slate-500 text-right">${formatCurrency(row.shipping, symbol)}</td>
      <td class="tabular-nums text-xs text-slate-600 dark:text-slate-300 text-right">${formatCurrency(row.cogs, symbol)}</td>
      <td class="tabular-nums text-xs text-amber-600 text-right">${formatCurrency(row.expenses, symbol)}</td>
      <td class="tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">${formatCurrency(row.netProfit, symbol)}</td>
    </tr>
  `).join('');

  return `
    <div class="space-y-6">
      <!-- Header with Period Selector -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Daily & Sales Performance Report</h1>
          <p class="text-xs text-slate-500">Comprehensive daily revenue, COGS, discounts, and net operational profit ledger</p>
        </div>
        <div class="flex items-center gap-2">
          <select id="report-month-select" class="form-select text-xs py-1.5 font-semibold w-auto">
            <option value="2026-10" selected>October 2026 (Daily Breakdown)</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </select>
          <button id="btn-export-report" class="btn btn-secondary btn-sm">
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- October 2026 Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Gross Revenue (Oct)</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(totalRevenue, symbol)}</div>
          <div class="text-[11px] text-slate-500 mt-1">${new Intl.NumberFormat('id-ID').format(totalOrders)} orders · ${new Intl.NumberFormat('id-ID').format(totalItems)} items</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">COGS (Product Cost)</div>
          <div class="text-lg font-bold text-slate-700 dark:text-slate-300 tabular-nums">${formatCurrency(totalCOGS, symbol)}</div>
          <div class="text-[11px] text-slate-500 mt-1">35% average product margin</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Operating Expenses</div>
          <div class="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">${formatCurrency(totalExpenses, symbol)}</div>
          <div class="text-[11px] text-slate-500 mt-1">Marketing, shipping & logistics</div>
        </div>
        <div class="card p-4 bg-emerald-500/5 border-emerald-500/20">
          <div class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">Total Net Profit</div>
          <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${formatCurrency(totalNetProfit, symbol)}</div>
          <div class="text-[11px] text-emerald-600 mt-1 font-semibold">${Math.round((totalNetProfit / totalRevenue) * 100)}% Net Margin</div>
        </div>
      </div>

      <!-- Payment Method Breakdown Strip -->
      <div class="card p-4 space-y-3">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Channel Settlement Distribution</div>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 text-[10px] uppercase font-bold">QRIS Instant</span>
            <div class="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${formatCurrency(Math.round(totalRevenue * 0.44), symbol)}</div>
            <span class="text-[10px] text-slate-500">44% Share</span>
          </div>
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 text-[10px] uppercase font-bold">Virtual Account</span>
            <div class="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${formatCurrency(Math.round(totalRevenue * 0.28), symbol)}</div>
            <span class="text-[10px] text-slate-500">28% Share</span>
          </div>
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 text-[10px] uppercase font-bold">Credit Card</span>
            <div class="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${formatCurrency(Math.round(totalRevenue * 0.15), symbol)}</div>
            <span class="text-[10px] text-slate-500">15% Share</span>
          </div>
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 text-[10px] uppercase font-bold">Bank Transfer</span>
            <div class="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${formatCurrency(Math.round(totalRevenue * 0.08), symbol)}</div>
            <span class="text-[10px] text-slate-500">8% Share</span>
          </div>
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 text-[10px] uppercase font-bold">Cash on Delivery</span>
            <div class="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${formatCurrency(Math.round(totalRevenue * 0.05), symbol)}</div>
            <span class="text-[10px] text-slate-500">5% Share</span>
          </div>
        </div>
      </div>

      <!-- Full Daily Report Table (31 Days) -->
      <div class="card overflow-hidden">
        <div class="card-header flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">Daily Ledger Breakdown (1 - 31 October 2026)</h2>
            <p class="text-xs text-slate-500">Every daily operational shift reconciled</p>
          </div>
        </div>
        <div class="table-container max-h-[520px]">
          <table class="data-table">
            <thead class="sticky top-0 z-10 shadow-2xs">
              <tr>
                <th>Date</th>
                <th class="text-center">Orders</th>
                <th class="text-center">Items</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Shipping</th>
                <th class="text-right">COGS</th>
                <th class="text-right">Expenses</th>
                <th class="text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              ${dailyRowsHtml}
            </tbody>
            <tfoot class="sticky bottom-0 bg-slate-100 dark:bg-slate-900 font-bold border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td class="text-xs">TOTAL OCTOBER 2026</td>
                <td class="text-center tabular-nums text-xs">${totalOrders}</td>
                <td class="text-center tabular-nums text-xs">${totalItems}</td>
                <td class="text-right tabular-nums text-xs text-primary">${formatCurrency(totalRevenue, symbol)}</td>
                <td class="text-right tabular-nums text-xs text-rose-500">- ${formatCurrency(totalDiscount, symbol)}</td>
                <td class="text-right tabular-nums text-xs">${formatCurrency(totalShipping, symbol)}</td>
                <td class="text-right tabular-nums text-xs">${formatCurrency(totalCOGS, symbol)}</td>
                <td class="text-right tabular-nums text-xs text-amber-600">${formatCurrency(totalExpenses, symbol)}</td>
                <td class="text-right tabular-nums text-xs text-emerald-600 dark:text-emerald-400">${formatCurrency(totalNetProfit, symbol)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initReportsEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-export-report')?.addEventListener('click', () => {
    showToast({ title: 'Exporting Ledger', message: 'Downloading daily_sales_october_2026.csv...', type: 'info' });
  });
}
