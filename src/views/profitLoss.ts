/**
 * AuraMaster Profit & Loss (P&L) Statement View
 * Real financial statement structure adhering to the specified Net Profit formula
 */
import { store } from '../utils/store';
import { formatCurrency } from '../utils/formatters';

export function renderProfitLossView(): string {
  const state = store.getState();
  const symbol = state.currentClient.currencySymbol;

  // Financial baseline for current fiscal month
  const grossSales = 128450000;
  const discounts = 6420000;
  const refunds = 1250000;
  const netRevenue = grossSales - discounts - refunds;

  const productCost = 44950000;
  const inboundFreight = 2100000;
  const packaging = 4500000;
  const totalCOGS = productCost + inboundFreight + packaging;

  const grossProfit = netRevenue - totalCOGS;
  const grossMarginPct = Math.round((grossProfit / netRevenue) * 100);

  const marketingExpense = 14500000;
  const shippingExpense = 3400000;
  const salaryExpense = 22000000;
  const hostingExpense = 2850000;
  const otherExpense = 4900000;
  const totalOpEx = marketingExpense + shippingExpense + salaryExpense + hostingExpense + otherExpense;

  const netProfit = grossProfit - totalOpEx;
  const netMarginPct = Math.round((netProfit / netRevenue) * 100);

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Profit & Loss Statement (P&L)</h1>
          <p class="text-xs text-slate-500">Official monthly income statement calculated according to GAAP accounting principles</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">Fiscal Period:</span>
          <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">October 2026</span>
          <button onclick="window.print()" class="btn btn-secondary btn-sm">Print Statement</button>
        </div>
      </div>

      <!-- KPI Summary Header Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Net Revenue</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(netRevenue, symbol)}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">After discounts & returns</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Gross Profit</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(grossProfit, symbol)}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">${grossMarginPct}% Gross Margin</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Operating Expenses</div>
          <div class="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">${formatCurrency(totalOpEx, symbol)}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">5 expense categories</div>
        </div>
        <div class="card p-4 bg-emerald-500/10 border-emerald-500/20">
          <div class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">Net Profit</div>
          <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${formatCurrency(netProfit, symbol)}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">${netMarginPct}% Net Margin</div>
        </div>
      </div>

      <!-- Financial Statement Detail Table -->
      <div class="card p-6 font-sans">
        <div class="border-b pb-4 mb-4 flex justify-between items-center text-xs">
          <span class="font-bold uppercase tracking-wider text-slate-400">Account Classification</span>
          <span class="font-bold uppercase tracking-wider text-slate-400">Amount (${symbol})</span>
        </div>

        <div class="space-y-6 text-xs">
          <!-- SECTION 1: REVENUE -->
          <div>
            <div class="font-bold text-sm text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">1. Revenue</div>
            <div class="space-y-1.5 pl-3">
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Gross Retail Sales</span>
                <span class="font-mono tabular-nums">${formatCurrency(grossSales, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-rose-500">
                <span>Less: Promotional Discounts & Coupons</span>
                <span class="font-mono tabular-nums">- ${formatCurrency(discounts, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-rose-500">
                <span>Less: Customer Refunds & Returns</span>
                <span class="font-mono tabular-nums">- ${formatCurrency(refunds, symbol)}</span>
              </div>
              <div class="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-2 rounded">
                <span>Total Net Revenue</span>
                <span class="font-mono tabular-nums">${formatCurrency(netRevenue, symbol)}</span>
              </div>
            </div>
          </div>

          <!-- SECTION 2: COGS -->
          <div>
            <div class="font-bold text-sm text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">2. Cost of Goods Sold (COGS)</div>
            <div class="space-y-1.5 pl-3">
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Product Raw Materials & Manufacturing</span>
                <span class="font-mono tabular-nums">${formatCurrency(productCost, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Inbound Freight & Warehouse Handling</span>
                <span class="font-mono tabular-nums">${formatCurrency(inboundFreight, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Product Boxes & Packaging Materials</span>
                <span class="font-mono tabular-nums">${formatCurrency(packaging, symbol)}</span>
              </div>
              <div class="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-2 rounded">
                <span>Total COGS</span>
                <span class="font-mono tabular-nums">${formatCurrency(totalCOGS, symbol)}</span>
              </div>
            </div>
          </div>

          <!-- GROSS PROFIT SUB-TOTAL -->
          <div class="p-3 rounded-lg bg-primary-light/50 border border-primary/20 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
            <span>GROSS PROFIT (Net Revenue - COGS)</span>
            <span class="font-mono tabular-nums text-primary text-base">${formatCurrency(grossProfit, symbol)} (${grossMarginPct}%)</span>
          </div>

          <!-- SECTION 3: OPERATING EXPENSES -->
          <div>
            <div class="font-bold text-sm text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">3. Operating Expenses (OpEx)</div>
            <div class="space-y-1.5 pl-3">
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Marketing, Meta & Google Ad Spend</span>
                <span class="font-mono tabular-nums">${formatCurrency(marketingExpense, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Outbound Courier & Shipping Logistics</span>
                <span class="font-mono tabular-nums">${formatCurrency(shippingExpense, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Employee & Clinical Staff Salaries</span>
                <span class="font-mono tabular-nums">${formatCurrency(salaryExpense, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Cloud Infrastructure & Hosting Services</span>
                <span class="font-mono tabular-nums">${formatCurrency(hostingExpense, symbol)}</span>
              </div>
              <div class="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>General, Lab Stability & Office Operational</span>
                <span class="font-mono tabular-nums">${formatCurrency(otherExpense, symbol)}</span>
              </div>
              <div class="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-2 rounded">
                <span>Total Operating Expenses</span>
                <span class="font-mono tabular-nums">${formatCurrency(totalOpEx, symbol)}</span>
              </div>
            </div>
          </div>

          <!-- FINAL NET PROFIT -->
          <div class="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-300">Net Operational Profit</div>
              <p class="text-[11px] text-emerald-700/80">Formula: Net Revenue - COGS - OpEx</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">${formatCurrency(netProfit, symbol)}</div>
              <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">${netMarginPct}% Net Profit Margin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
