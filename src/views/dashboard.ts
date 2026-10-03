/**
 * AuraMaster Main Executive Dashboard View
 * ThemeForest-grade SaaS dashboard with KPIs, responsive SVG charts,
 * category breakdown, recent orders, and activity timeline.
 */
import { store } from '../utils/store';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { renderAreaSplineChart, renderDonutChart } from '../utils/charts';

export function renderDashboardView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  // Recent 5 orders
  const recentOrders = state.orders.slice(0, 5);

  const ordersTableRows = recentOrders
    .map((o) => {
      const statusBadges: Record<string, string> = {
        Completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        Shipped: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        Processing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        Pending: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        Cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      };

      return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
        <td class="font-medium text-slate-900 dark:text-white font-mono text-xs">${o.orderNumber}</td>
        <td>
          <div class="font-medium text-slate-800 dark:text-slate-200">${o.customerName}</div>
          <div class="text-[11px] text-slate-400">${o.paymentMethod}</div>
        </td>
        <td class="tabular-nums text-xs text-slate-500">${o.date}</td>
        <td class="tabular-nums text-xs">${o.itemsCount} items</td>
        <td class="font-semibold text-slate-900 dark:text-white tabular-nums">${formatCurrency(o.grandTotal, symbol)}</td>
        <td>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${statusBadges[o.status] || 'bg-slate-100 text-slate-600'}">
            ${o.status}
          </span>
        </td>
        <td class="text-right">
          <button class="nav-link-btn text-xs font-semibold text-primary hover:underline" data-view="order-detail" data-id="${o.id}">
            View
          </button>
        </td>
      </tr>
    `;
    })
    .join('');

  // Top 4 products
  const topProducts = [...state.products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4)
    .map(
      (p) => `
    <div class="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-none">
      <div class="flex items-center gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
        <div class="truncate max-w-[180px] sm:max-w-xs">
          <div class="font-medium text-xs text-slate-900 dark:text-white truncate">${p.name}</div>
          <div class="text-[11px] text-slate-400">${p.category} · <span class="tabular-nums font-mono">${p.soldCount} sold</span></div>
        </div>
      </div>
      <div class="text-right">
        <div class="font-semibold text-xs text-slate-900 dark:text-white tabular-nums">${formatCurrency(p.price, symbol)}</div>
        <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Bestseller</div>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="space-y-6">
      <!-- Welcome Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-3 backdrop-blur-xs">
            <span class="w-2 h-2 rounded-full" style="background-color: var(--primary);"></span>
            <span>Master Template · Live Client: ${client.name}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome back, ${client.adminName}</h1>
          <p class="text-slate-300 text-xs sm:text-sm mt-1">Here is what is happening across your store and operations today. Total revenue is up by 14.8% this month.</p>
        </div>

        <div class="relative z-10 flex flex-wrap items-center gap-3">
          <button id="dash-switch-preset-btn" class="btn btn-sm bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Switch Preset
          </button>
          <button class="nav-link-btn btn btn-sm btn-primary" data-view="orders">
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      <!-- 6 KPI Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-5">
        <!-- KPI 1: Total Revenue -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Total Revenue</span>
            <span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight truncate" title="${formatCurrency(124850000, symbol)}">${formatCurrency(124850000, symbol)}</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                +14.8%
              </span>
              <span class="text-slate-400 text-[11px]">vs last mo</span>
            </div>
          </div>
        </div>

        <!-- KPI 2: Total Orders -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Total Orders</span>
            <span class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">1,482</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                +8.2%
              </span>
              <span class="text-slate-400 text-[11px]">vs last mo</span>
            </div>
          </div>
        </div>

        <!-- KPI 3: Total Customers -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Customers</span>
            <span class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">940</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                +12.4%
              </span>
              <span class="text-slate-400 text-[11px]">active base</span>
            </div>
          </div>
        </div>

        <!-- KPI 4: Total Products -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Catalog SKU</span>
            <span class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">${state.products.length}</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                3 Low stock
              </span>
              <span class="text-slate-400 text-[11px]">in catalog</span>
            </div>
          </div>
        </div>

        <!-- KPI 5: Net Profit -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Net Profit</span>
            <span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight truncate" title="${formatCurrency(54820000, symbol)}">${formatCurrency(54820000, symbol)}</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                +16.2%
              </span>
              <span class="text-slate-400 text-[11px]">margin</span>
            </div>
          </div>
        </div>

        <!-- KPI 6: Conversion Rate -->
        <div class="card p-5 flex flex-col justify-between min-w-0 hover:border-primary/40 transition-colors">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">Conversion</span>
            <span class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </span>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">3.42%</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                +0.6%
              </span>
              <span class="text-slate-400 text-[11px]">funnel rate</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section: Revenue Area Chart + Category Donut Chart -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Revenue Overview Chart Card (2 Cols on xl) -->
        <div class="card xl:col-span-2">
          <div class="card-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Revenue Overview</h2>
              <p class="text-xs text-slate-500">Gross sales performance over the recent operational period</p>
            </div>
            <!-- Range Switcher -->
            <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button class="px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 chart-range-btn" data-range="7d">7 Days</button>
              <button class="px-2.5 py-1 rounded-md font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs chart-range-btn" data-range="30d">30 Days</button>
              <button class="px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 chart-range-btn" data-range="12m">12 Mo</button>
            </div>
          </div>
          <div class="card-body">
            <div id="dashboard-revenue-chart" class="w-full"></div>
          </div>
        </div>

        <!-- Sales by Category Donut Chart (1 Col on xl) -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Sales by Category</h2>
              <p class="text-xs text-slate-500">Distribution of revenue across collections</p>
            </div>
          </div>
          <div class="card-body flex items-center justify-center p-6">
            <div id="dashboard-category-chart" class="w-full"></div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Top Products / Activity -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Recent Orders Table (2 Cols on xl) -->
        <div class="card xl:col-span-2">
          <div class="card-header flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Recent Orders</h2>
              <p class="text-xs text-slate-500">Latest customer orders awaiting fulfillment</p>
            </div>
            <button class="nav-link-btn text-xs font-semibold text-primary hover:underline" data-view="orders">
              View All Orders →
            </button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${ordersTableRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products & Funnel (1 Col) -->
        <div class="card flex flex-col justify-between">
          <div class="card-header flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Top Performing</h2>
              <p class="text-xs text-slate-500">Best-selling inventory this month</p>
            </div>
            <button class="nav-link-btn text-xs font-semibold text-primary hover:underline" data-view="products">
              Inventory →
            </button>
          </div>
          <div class="card-body py-2">
            ${topProducts}
          </div>
          <!-- Conversion Funnel Mini Section -->
          <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 rounded-b-xl space-y-2">
            <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">Checkout Conversion Funnel</div>
            <div class="space-y-1.5 text-[11px]">
              <div>
                <div class="flex justify-between text-slate-500 mb-0.5">
                  <span>Product Views</span>
                  <span class="font-mono font-medium">18,420</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-primary h-full w-[100%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-slate-500 mb-0.5">
                  <span>Add to Cart (28.4%)</span>
                  <span class="font-mono font-medium">5,231</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-primary h-full w-[28.4%] rounded-full opacity-80"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-slate-500 mb-0.5">
                  <span>Purchased (12.1%)</span>
                  <span class="font-mono font-medium">1,482</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full w-[12.1%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initDashboardCharts() {
  const revEl = document.getElementById('dashboard-revenue-chart');
  if (revEl) {
    // 30 Days sample points
    const points = [
      { label: 'Oct 1', value: 3400000 },
      { label: 'Oct 3', value: 4100000 },
      { label: 'Oct 5', value: 2900000 },
      { label: 'Oct 7', value: 5200000 },
      { label: 'Oct 9', value: 4800000 },
      { label: 'Oct 11', value: 6100000 },
      { label: 'Oct 13', value: 5900000 },
      { label: 'Oct 15', value: 7200000 },
      { label: 'Oct 17', value: 6800000 },
      { label: 'Oct 19', value: 8100000 },
      { label: 'Oct 21', value: 7600000 },
      { label: 'Oct 23', value: 9200000 },
      { label: 'Oct 25', value: 8900000 },
      { label: 'Oct 27', value: 10400000 },
      { label: 'Oct 29', value: 9800000 },
      { label: 'Oct 31', value: 11200000 }
    ];

    renderAreaSplineChart(revEl, points, {
      height: 240,
      valuePrefix: store.getState().currentClient.currencySymbol + ' '
    });
  }

  const catEl = document.getElementById('dashboard-category-chart');
  if (catEl) {
    renderDonutChart(
      catEl,
      [
        { label: 'Face Treatment', value: 48, color: 'var(--primary)' },
        { label: 'Moisturizers', value: 24, color: '#0ea5e9' },
        { label: 'Cleansers', value: 16, color: '#10b981' },
        { label: 'Sun Protection', value: 12, color: '#f59e0b' }
      ],
      'Units'
    );
  }
}
