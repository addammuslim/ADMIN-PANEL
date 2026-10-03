/**
 * AuraMaster Spotlight Global Search (Ctrl + K)
 * Instant live client search across products, orders, and pages
 */
import { store } from '../utils/store';
import { formatCurrency } from '../utils/formatters';

export function openSpotlightSearch() {
  closeSpotlightSearch();

  const backdrop = document.createElement('div');
  backdrop.id = 'spotlight-modal-backdrop';
  backdrop.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4';

  backdrop.innerHTML = `
    <div class="bg-surface border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-pop">
      <!-- Search Input -->
      <div class="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="spotlight-input"
          type="text"
          placeholder="Type to search products, orders, customers, or pages..."
          class="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
          autofocus
        />
        <kbd class="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">ESC</kbd>
      </div>

      <!-- Live Results Area -->
      <div id="spotlight-results" class="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
        <!-- Default suggestions -->
        <div class="p-3 text-slate-400 text-center">
          Start typing to search products, orders, or pages...
        </div>
      </div>

      <!-- Quick Navigation Footer -->
      <div class="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span><kbd class="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑↓</kbd> to navigate</span>
          <span><kbd class="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">Enter</kbd> to select</span>
        </div>
        <span>AuraMaster Global Search</span>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  const input = backdrop.querySelector('#spotlight-input') as HTMLInputElement;
  const resultsContainer = backdrop.querySelector('#spotlight-results') as HTMLElement;

  input.focus();

  const handleSearch = () => {
    const q = input.value.trim().toLowerCase();
    const state = store.getState();

    if (!q) {
      resultsContainer.innerHTML = `
        <div class="p-3 text-slate-400 text-center">
          Start typing to search products, orders, or pages...
        </div>
      `;
      return;
    }

    const matchedProducts = state.products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedOrders = state.orders.filter(
      (o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedCustomers = state.customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    ).slice(0, 3);

    let html = '';

    if (matchedProducts.length > 0) {
      html += `<div class="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Products</div>`;
      html += matchedProducts.map((p) => `
        <button class="spotlight-item w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors" data-view="products" data-id="${p.id}">
          <div class="flex items-center gap-2.5">
            <span class="p-1 rounded bg-primary-light text-primary">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </span>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">${p.name}</div>
              <div class="text-[10px] text-slate-400">${p.sku} · ${p.category}</div>
            </div>
          </div>
          <span class="font-semibold tabular-nums text-slate-700 dark:text-slate-300">${formatCurrency(p.price, state.currentClient.currencySymbol)}</span>
        </button>
      `).join('');
    }

    if (matchedOrders.length > 0) {
      html += `<div class="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 mt-2">Orders</div>`;
      html += matchedOrders.map((o) => `
        <button class="spotlight-item w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors" data-view="orders" data-id="${o.id}">
          <div class="flex items-center gap-2.5">
            <span class="p-1 rounded bg-blue-500/10 text-blue-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </span>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">${o.orderNumber}</div>
              <div class="text-[10px] text-slate-400">${o.customerName} · ${o.status}</div>
            </div>
          </div>
          <span class="font-semibold tabular-nums text-slate-700 dark:text-slate-300">${formatCurrency(o.grandTotal, state.currentClient.currencySymbol)}</span>
        </button>
      `).join('');
    }

    if (matchedCustomers.length > 0) {
      html += `<div class="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 mt-2">Customers</div>`;
      html += matchedCustomers.map((c) => `
        <button class="spotlight-item w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors" data-view="customers" data-id="${c.id}">
          <div class="flex items-center gap-2.5">
            <span class="p-1 rounded bg-emerald-500/10 text-emerald-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">${c.name}</div>
              <div class="text-[10px] text-slate-400">${c.email}</div>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600">${c.tier}</span>
        </button>
      `).join('');
    }

    if (!html) {
      html = `
        <div class="p-6 text-center text-slate-400">
          No matches found for "<span class="font-semibold text-slate-600 dark:text-slate-300">${q}</span>"
        </div>
      `;
    }

    resultsContainer.innerHTML = html;

    // Attach click events
    resultsContainer.querySelectorAll('.spotlight-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = (btn as HTMLElement).dataset.view as any;
        const id = (btn as HTMLElement).dataset.id;
        closeSpotlightSearch();
        if (view) {
          store.navigate(view, id);
        }
      });
    });
  };

  input.addEventListener('input', handleSearch);

  // Keyboard navigation & close handlers
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSpotlightSearch();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeSpotlightSearch();
    }
  });
}

export function closeSpotlightSearch() {
  const el = document.getElementById('spotlight-modal-backdrop');
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
    document.body.style.overflow = '';
  }
}
