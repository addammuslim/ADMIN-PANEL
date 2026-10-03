/**
 * AuraMaster Orders Management View & Invoice Modal
 * Complete ecommerce order lifecycle with status progression timeline,
 * line item breakdowns, and printable invoice viewer.
 */
import { store } from '../utils/store';
import { Order } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../utils/toast';
import { openModal } from '../utils/modal';

interface OrderFilterState {
  search: string;
  status: string;
  paymentStatus: string;
}

const orderFilterState: OrderFilterState = {
  search: '',
  status: 'all',
  paymentStatus: 'all'
};

export function renderOrdersView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  const filteredOrders = state.orders.filter((o) => {
    const matchesSearch =
      !orderFilterState.search ||
      o.orderNumber.toLowerCase().includes(orderFilterState.search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderFilterState.search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderFilterState.search.toLowerCase());

    const matchesStatus = orderFilterState.status === 'all' || o.status === orderFilterState.status;
    const matchesPayment = orderFilterState.paymentStatus === 'all' || o.paymentStatus === orderFilterState.paymentStatus;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const rowsHtml = filteredOrders.map((o) => {
    const statusBadges: Record<string, string> = {
      Completed: 'badge-success',
      Shipped: 'badge-info',
      Packed: 'badge-primary',
      Processing: 'badge-warning',
      Confirmed: 'badge-primary',
      Pending: 'badge-neutral',
      Cancelled: 'badge-danger',
      Refunded: 'badge-neutral'
    };

    const paymentBadges: Record<string, string> = {
      Paid: 'text-emerald-600 bg-emerald-500/10',
      Unpaid: 'text-amber-600 bg-amber-500/10',
      Refunded: 'text-slate-600 bg-slate-200'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <button class="nav-link-btn font-mono font-bold text-xs text-primary hover:underline" data-view="order-detail" data-id="${o.id}">
            ${o.orderNumber}
          </button>
        </td>
        <td>
          <div class="font-medium text-slate-900 dark:text-white text-xs">${o.customerName}</div>
          <div class="text-[11px] text-slate-400">${o.customerPhone}</div>
        </td>
        <td class="tabular-nums text-xs text-slate-500">${o.date}</td>
        <td class="text-xs">
          <span class="font-medium text-slate-800 dark:text-slate-200">${o.itemsCount} items</span>
          <span class="text-slate-400 text-[10px] block truncate max-w-[140px]">${o.items[0]?.name || ''}</span>
        </td>
        <td>
          <div class="text-xs text-slate-700 dark:text-slate-300">${o.paymentMethod}</div>
          <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${paymentBadges[o.paymentStatus]}">
            ${o.paymentStatus}
          </span>
        </td>
        <td>
          <div class="text-xs font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(o.grandTotal, symbol)}</div>
        </td>
        <td>
          <span class="badge ${statusBadges[o.status] || 'badge-neutral'}">
            <span class="badge-dot"></span>
            ${o.status}
          </span>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-2">
            <button class="btn-view-order btn btn-secondary btn-sm py-1 px-2 text-xs" data-id="${o.id}">
              Details
            </button>
            <button class="btn-print-invoice btn btn-ghost btn-sm py-1 px-1.5 text-slate-500 hover:text-slate-900" data-id="${o.id}" title="Print Invoice">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Orders & Fulfillment</h1>
          <p class="text-xs text-slate-500">Track and dispatch customer purchases, monitor payment gateways, and issue receipts</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-export-orders" class="btn btn-secondary btn-sm">
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="card p-3.5 flex flex-wrap items-center gap-3">
        <div class="relative min-w-[220px] flex-1 max-w-sm">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            id="filter-order-search"
            type="text"
            placeholder="Search order number or customer..."
            value="${orderFilterState.search}"
            class="form-input text-xs pl-9 py-1.5"
          />
        </div>

        <select id="filter-order-status" class="form-select text-xs py-1.5 w-auto">
          <option value="all">All Order Statuses</option>
          <option value="Pending" ${orderFilterState.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${orderFilterState.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Processing" ${orderFilterState.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Packed" ${orderFilterState.status === 'Packed' ? 'selected' : ''}>Packed</option>
          <option value="Shipped" ${orderFilterState.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Completed" ${orderFilterState.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Cancelled" ${orderFilterState.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>

        <select id="filter-order-payment" class="form-select text-xs py-1.5 w-auto">
          <option value="all">All Payment Statuses</option>
          <option value="Paid" ${orderFilterState.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
          <option value="Unpaid" ${orderFilterState.paymentStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
          <option value="Refunded" ${orderFilterState.paymentStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
        </select>
      </div>

      <!-- Orders Data Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Placed Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="8" class="p-8 text-center text-slate-400">No orders found.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function openOrderDetailModal(orderId: string) {
  const state = store.getState();
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return;

  const symbol = state.currentClient.currencySymbol;

  const timelineSteps = [
    { title: 'Order Created', desc: order.date, done: true },
    { title: 'Payment Confirmed', desc: order.paymentStatus === 'Paid' ? 'Verified' : 'Awaiting transfer', done: order.paymentStatus === 'Paid' },
    { title: 'Processing & Packed', desc: 'Warehouse fulfillment', done: ['Processing', 'Packed', 'Shipped', 'Completed'].includes(order.status) },
    { title: 'Shipped with Courier', desc: order.trackingNumber ? `${order.courier} (${order.trackingNumber})` : 'Awaiting dispatch', done: ['Shipped', 'Completed'].includes(order.status) },
    { title: 'Delivered & Completed', desc: order.status === 'Completed' ? 'Signed by recipient' : 'In transit', done: order.status === 'Completed' }
  ];

  const timelineHtml = timelineSteps
    .map(
      (s, i) => `
    <div class="flex items-start gap-3">
      <div class="flex flex-col items-center">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
        }">
          ${s.done ? '✓' : i + 1}
        </div>
        ${i < timelineSteps.length - 1 ? `<div class="w-0.5 h-8 ${s.done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}"></div>` : ''}
      </div>
      <div>
        <div class="text-xs font-bold ${s.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}">${s.title}</div>
        <div class="text-[11px] text-slate-500">${s.desc}</div>
      </div>
    </div>
  `
    )
    .join('');

  const itemsHtml = order.items
    .map(
      (item) => `
    <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-none text-xs">
      <div>
        <div class="font-semibold text-slate-800 dark:text-slate-200">${item.name}</div>
        <div class="text-[11px] text-slate-400 tabular-nums">${item.quantity}x @ ${formatCurrency(item.price, symbol)}</div>
      </div>
      <div class="font-semibold tabular-nums text-slate-900 dark:text-white">${formatCurrency(item.total, symbol)}</div>
    </div>
  `
    )
    .join('');

  const bodyHtml = `
    <div class="space-y-6">
      <!-- Status Banner & Quick Action -->
      <div class="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
          <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>${order.status}</span>
            <span class="text-slate-300">·</span>
            <span class="text-xs font-medium text-emerald-600">${order.paymentStatus} via ${order.paymentMethod}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500 font-medium">Update Status:</label>
          <select id="modal-order-status-select" class="form-select text-xs py-1 w-auto">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Packed" ${order.status === 'Packed' ? 'selected' : ''}>Packed</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>

      <!-- 2 Columns: Details & Timeline -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Customer & Delivery -->
        <div class="space-y-4">
          <div class="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="text-xs font-bold uppercase text-slate-400">Customer & Contact</div>
            <div class="text-xs">
              <div class="font-bold text-slate-900 dark:text-white">${order.customerName}</div>
              <div class="text-slate-500">${order.customerEmail}</div>
              <div class="text-slate-500">${order.customerPhone}</div>
            </div>
          </div>

          <div class="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="text-xs font-bold uppercase text-slate-400">Shipping Destination</div>
            <div class="text-xs text-slate-700 dark:text-slate-300">
              ${order.shippingAddress}
            </div>
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500">
              <span>Courier: <strong class="text-slate-800 dark:text-slate-200">${order.courier}</strong></span>
              <span>Tracking: <strong class="font-mono text-primary">${order.trackingNumber || 'Pending'}</strong></span>
            </div>
          </div>
        </div>

        <!-- Fulfillment Stepper -->
        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div class="text-xs font-bold uppercase text-slate-400 mb-4">Fulfillment Timeline</div>
          <div class="space-y-1">
            ${timelineHtml}
          </div>
        </div>
      </div>

      <!-- Items Table & Financial Breakdown -->
      <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
        <div class="text-xs font-bold uppercase text-slate-400">Line Items</div>
        <div>
          ${itemsHtml}
        </div>
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span class="tabular-nums font-mono">${formatCurrency(order.subtotal, symbol)}</span>
          </div>
          ${
            order.discount > 0
              ? `<div class="flex justify-between text-rose-500">
                  <span>Coupon Discount</span>
                  <span class="tabular-nums font-mono">- ${formatCurrency(order.discount, symbol)}</span>
                </div>`
              : ''
          }
          <div class="flex justify-between text-slate-500">
            <span>Shipping Cost</span>
            <span class="tabular-nums font-mono">${formatCurrency(order.shippingFee, symbol)}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Grand Total</span>
            <span class="tabular-nums font-mono">${formatCurrency(order.grandTotal, symbol)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  openModal({
    title: `Order Details: ${order.orderNumber}`,
    size: 'lg',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Close</button>
      <button id="modal-btn-print" class="btn btn-secondary">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Print Invoice
      </button>
    `,
    onMount: (modalEl) => {
      const select = modalEl.querySelector('#modal-order-status-select') as HTMLSelectElement;
      select?.addEventListener('change', () => {
        store.updateOrderStatus(order.id, select.value as any);
        showToast({ title: 'Status Updated', message: `Order marked as ${select.value}.`, type: 'success' });
      });

      modalEl.querySelector('#modal-btn-print')?.addEventListener('click', () => {
        openInvoicePrintModal(order);
      });
    }
  });
}

export function openInvoicePrintModal(order: Order) {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  const invoiceHtml = `
    <div class="p-6 bg-white text-slate-900 rounded-lg max-w-xl mx-auto space-y-6 text-xs font-sans">
      <!-- Invoice Header -->
      <div class="flex items-center justify-between border-b pb-4">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-900">${client.name}</h2>
          <p class="text-slate-500 text-[11px]">${client.tagline}</p>
        </div>
        <div class="text-right">
          <span class="text-base font-bold font-mono text-slate-900">INVOICE</span>
          <p class="font-mono text-slate-500 text-[11px]">${order.orderNumber}</p>
          <p class="text-slate-400 text-[10px]">${order.date}</p>
        </div>
      </div>

      <!-- Bill To & Ship To -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Billed To</span>
          <div class="font-bold text-slate-800">${order.customerName}</div>
          <div class="text-slate-500">${order.customerEmail}</div>
          <div class="text-slate-500">${order.customerPhone}</div>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Shipping Details</span>
          <div class="text-slate-600">${order.shippingAddress}</div>
          <div class="text-[11px] text-slate-500 mt-1">Courier: ${order.courier} (${order.trackingNumber || 'Pending'})</div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-[10px] uppercase text-slate-400">
            <th class="py-2">Item Description</th>
            <th class="py-2 text-right">Price</th>
            <th class="py-2 text-center">Qty</th>
            <th class="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${order.items
            .map(
              (it) => `
            <tr>
              <td class="py-2.5 font-medium">${it.name}</td>
              <td class="py-2.5 text-right tabular-nums">${formatCurrency(it.price, symbol)}</td>
              <td class="py-2.5 text-center tabular-nums">${it.quantity}</td>
              <td class="py-2.5 text-right font-semibold tabular-nums">${formatCurrency(it.total, symbol)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="border-t pt-3 space-y-1 text-right">
        <div class="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span class="tabular-nums font-mono">${formatCurrency(order.subtotal, symbol)}</span>
        </div>
        ${
          order.discount > 0
            ? `<div class="flex justify-between text-rose-600">
                <span>Discount</span>
                <span class="tabular-nums font-mono">- ${formatCurrency(order.discount, symbol)}</span>
              </div>`
            : ''
        }
        <div class="flex justify-between text-slate-500">
          <span>Shipping Fee</span>
          <span class="tabular-nums font-mono">${formatCurrency(order.shippingFee, symbol)}</span>
        </div>
        <div class="flex justify-between text-base font-bold text-slate-900 border-t pt-2 mt-2">
          <span>Total Paid</span>
          <span class="tabular-nums font-mono">${formatCurrency(order.grandTotal, symbol)}</span>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="text-center text-[10px] text-slate-400 pt-4 border-t">
        Thank you for choosing ${client.name}. For questions, contact support@auraglow.id
      </div>
    </div>
  `;

  openModal({
    title: `Invoice Preview: ${order.orderNumber}`,
    size: 'md',
    bodyHtml: invoiceHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Close</button>
      <button onclick="window.print()" class="btn btn-primary">Print Now</button>
    `
  });
}

export function initOrdersEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#filter-order-search')?.addEventListener('input', (e) => {
    orderFilterState.search = (e.target as HTMLInputElement).value;
    store.navigate('orders');
  });

  container.querySelector('#filter-order-status')?.addEventListener('change', (e) => {
    orderFilterState.status = (e.target as HTMLSelectElement).value;
    store.navigate('orders');
  });

  container.querySelector('#filter-order-payment')?.addEventListener('change', (e) => {
    orderFilterState.paymentStatus = (e.target as HTMLSelectElement).value;
    store.navigate('orders');
  });

  container.querySelectorAll('.btn-view-order').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      openOrderDetailModal(id);
    });
  });

  container.querySelectorAll('.btn-print-invoice').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const ord = store.getState().orders.find((o) => o.id === id);
      if (ord) openInvoicePrintModal(ord);
    });
  });

  container.querySelector('#btn-export-orders')?.addEventListener('click', () => {
    showToast({ title: 'Exporting Orders', message: 'Generating CSV file...', type: 'info' });
  });
}
