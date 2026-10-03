/**
 * AuraMaster Customers & Members Management View
 * Complete customer profile viewer with spending tiers, lifetime value,
 * and order history.
 */
import { store } from '../utils/store';
import { Customer } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { openModal } from '../utils/modal';
import { openOrderDetailModal } from './orders';

export function renderCustomersView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  const rowsHtml = state.customers.map((c) => {
    const tierColors: Record<string, string> = {
      Platinum: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      Gold: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      Silver: 'bg-slate-200/60 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      Bronze: 'bg-orange-500/10 text-orange-600'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <div class="flex items-center gap-3">
            <img src="${c.avatar}" alt="${c.name}" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">${c.name}</div>
              <div class="text-[11px] text-slate-400 font-mono">${c.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="text-xs text-slate-700 dark:text-slate-300">${c.email}</div>
          <div class="text-[11px] text-slate-400">${c.phone}</div>
        </td>
        <td>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${tierColors[c.tier] || 'bg-slate-100'}">
            ${c.tier}
          </span>
        </td>
        <td class="tabular-nums text-xs font-semibold">${c.ordersCount} orders</td>
        <td class="tabular-nums text-xs font-bold text-slate-900 dark:text-white">${formatCurrency(c.totalSpending, symbol)}</td>
        <td class="tabular-nums text-xs font-mono text-primary font-semibold">${c.loyaltyPoints} pts</td>
        <td class="tabular-nums text-xs text-slate-500">${c.lastOrderDate}</td>
        <td class="text-right">
          <button class="btn-customer-detail btn btn-secondary btn-sm py-1 px-2 text-xs" data-id="${c.id}">
            Profile & History
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Customers & VIP Members</h1>
          <p class="text-xs text-slate-500">Track client loyalty tiers, customer lifetime value (LTV), and purchase behavior</p>
        </div>
      </div>

      <!-- Quick KPI Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card p-3.5">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Total Members</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${state.customers.length}</div>
        </div>
        <div class="card p-3.5">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Avg Lifetime Value</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(3180000, symbol)}</div>
        </div>
        <div class="card p-3.5">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Platinum Tier</div>
          <div class="text-lg font-bold text-purple-600 dark:text-purple-400 tabular-nums">2 VIPs</div>
        </div>
        <div class="card p-3.5">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Active Retention</div>
          <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">84.2%</div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Loyalty Tier</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Points</th>
                <th>Last Order</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function openCustomerProfileModal(customerId: string) {
  const state = store.getState();
  const customer = state.customers.find((c) => c.id === customerId);
  if (!customer) return;

  const symbol = state.currentClient.currencySymbol;
  const aov = customer.ordersCount > 0 ? Math.round(customer.totalSpending / customer.ordersCount) : 0;

  // Recent orders by this customer
  const customerOrders = state.orders.filter((o) => o.customerName.toLowerCase().includes(customer.name.toLowerCase()));

  const ordersListHtml = customerOrders.length > 0
    ? customerOrders
        .map(
          (o) => `
        <div class="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <div class="font-mono font-bold text-primary">${o.orderNumber}</div>
            <div class="text-slate-400 text-[10px]">${o.date} · ${o.status}</div>
          </div>
          <div class="text-right">
            <div class="font-bold tabular-nums text-slate-900 dark:text-white">${formatCurrency(o.grandTotal, symbol)}</div>
            <button class="text-[11px] text-primary hover:underline btn-view-cust-ord" data-id="${o.id}">View Order</button>
          </div>
        </div>
      `
        )
        .join('')
    : `<div class="text-slate-400 text-xs p-3">No matching order records in recent active batch.</div>`;

  const bodyHtml = `
    <div class="space-y-5">
      <!-- Profile Header Card -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <img src="${customer.avatar}" class="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">${customer.name}</h3>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-light text-primary">${customer.tier} Tier</span>
          </div>
          <div class="text-xs text-slate-500">${customer.email} · ${customer.phone}</div>
          <div class="text-[11px] text-slate-400 mt-1">Customer since ${customer.joinDate}</div>
        </div>
      </div>

      <!-- 4 Stats Cards -->
      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white tabular-nums">${customer.ordersCount}</div>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Total Spent</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(customer.totalSpending, symbol)}</div>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Avg Order Value</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(aov, symbol)}</div>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Loyalty Points</div>
          <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${customer.loyaltyPoints}</div>
        </div>
      </div>

      <!-- Past Order History -->
      <div class="space-y-2">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Order History</div>
        <div class="space-y-2">
          ${ordersListHtml}
        </div>
      </div>
    </div>
  `;

  openModal({
    title: `Customer Profile: ${customer.name}`,
    size: 'md',
    bodyHtml,
    footerHtml: `<button class="btn btn-secondary modal-cancel-btn">Close</button>`,
    onMount: (modalEl) => {
      modalEl.querySelectorAll('.btn-view-cust-ord').forEach((b) => {
        b.addEventListener('click', () => {
          const ordId = (b as HTMLElement).dataset.id!;
          openOrderDetailModal(ordId);
        });
      });
    }
  });
}

export function initCustomersEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelectorAll('.btn-customer-detail').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      openCustomerProfileModal(id);
    });
  });
}
