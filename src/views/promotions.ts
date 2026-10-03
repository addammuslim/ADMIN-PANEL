/**
 * AuraMaster Promotions & Coupon Management Views
 * Coupon generation, discount logic, usage limits, and calendar scheduling.
 */
import { store } from '../utils/store';
import { Promotion } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../utils/toast';
import { openModal, closeModal } from '../utils/modal';

export function renderPromotionsView(): string {
  const state = store.getState();
  const symbol = state.currentClient.currencySymbol;

  const rowsHtml = state.promotions.map((p) => {
    const statusBadges: Record<string, string> = {
      Active: 'badge-success',
      Scheduled: 'badge-info',
      Expired: 'badge-neutral'
    };

    const valueDisplay =
      p.type === 'Percentage'
        ? `${p.value}% OFF`
        : p.type === 'Fixed Amount'
        ? `${formatCurrency(p.value, symbol)} OFF`
        : 'Free Shipping';

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">${p.code}</span>
            <button class="btn-copy-code text-slate-400 hover:text-primary p-1" data-code="${p.code}" title="Copy coupon code">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </td>
        <td class="text-xs font-semibold text-slate-800 dark:text-slate-200">${valueDisplay}</td>
        <td class="text-xs text-slate-600 dark:text-slate-300 tabular-nums">${formatCurrency(p.minSpend, symbol)}</td>
        <td>
          <div class="text-xs font-mono text-slate-800 dark:text-slate-200 tabular-nums">${p.usageCount} / ${p.usageLimit}</div>
          <div class="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div class="bg-primary h-full rounded-full" style="width: ${Math.min(100, Math.round((p.usageCount / p.usageLimit) * 100))}%;"></div>
          </div>
        </td>
        <td class="tabular-nums text-[11px] text-slate-500">${p.startDate} - ${p.endDate}</td>
        <td>
          <span class="badge ${statusBadges[p.status]}">
            <span class="badge-dot"></span>
            ${p.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Promotions & Vouchers</h1>
          <p class="text-xs text-slate-500">Configure discount campaigns, referral vouchers, flash sales, and bundle perks</p>
        </div>
        <button id="btn-create-coupon" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>+ Create Coupon</span>
        </button>
      </div>

      <!-- Coupons Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Value</th>
                <th>Min Spend</th>
                <th>Usage Progress</th>
                <th>Active Period</th>
                <th>Status</th>
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

export function openCreateCouponModal() {
  const symbol = store.getState().currentClient.currencySymbol;

  const randomCode = 'SAVE' + Math.floor(10 + Math.random() * 90);

  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Coupon Code *</label>
          <div class="flex items-center gap-1.5">
            <input id="cp-form-code" type="text" class="form-input font-mono uppercase" value="${randomCode}" />
            <button id="btn-gen-code" type="button" class="btn btn-secondary btn-sm py-2 px-2" title="Generate random code">Auto</button>
          </div>
        </div>
        <div>
          <label class="form-label">Discount Type</label>
          <select id="cp-form-type" class="form-select">
            <option value="Percentage">Percentage Discount (%)</option>
            <option value="Fixed Amount">Fixed Amount (${symbol})</option>
            <option value="Free Shipping">Free Shipping</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Discount Value</label>
          <input id="cp-form-val" type="number" class="form-input font-mono" value="15" />
        </div>
        <div>
          <label class="form-label">Minimum Spend (${symbol})</label>
          <input id="cp-form-min" type="number" class="form-input font-mono" value="250000" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Max Usage Limit</label>
          <input id="cp-form-limit" type="number" class="form-input font-mono" value="500" />
        </div>
        <div>
          <label class="form-label">End Date</label>
          <input id="cp-form-end" type="date" class="form-input" value="2026-10-31" />
        </div>
      </div>
    </div>
  `;

  openModal({
    title: 'Create New Discount Coupon',
    size: 'sm',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button id="btn-save-coupon" class="btn btn-primary">Save Coupon</button>
    `,
    onMount: (modalEl) => {
      modalEl.querySelector('#btn-gen-code')?.addEventListener('click', () => {
        const inp = modalEl.querySelector('#cp-form-code') as HTMLInputElement;
        inp.value = 'PROMO' + Math.floor(100 + Math.random() * 900);
      });

      modalEl.querySelector('#btn-save-coupon')?.addEventListener('click', () => {
        const code = (modalEl.querySelector('#cp-form-code') as HTMLInputElement).value.trim().toUpperCase();
        if (!code) {
          showToast({ title: 'Validation Error', message: 'Coupon code is required.', type: 'danger' });
          return;
        }

        const newPromo: Promotion = {
          id: `promo-${Date.now()}`,
          code,
          type: (modalEl.querySelector('#cp-form-type') as HTMLSelectElement).value as any,
          value: parseFloat((modalEl.querySelector('#cp-form-val') as HTMLInputElement).value || '10'),
          minSpend: parseFloat((modalEl.querySelector('#cp-form-min') as HTMLInputElement).value || '0'),
          usageCount: 0,
          usageLimit: parseInt((modalEl.querySelector('#cp-form-limit') as HTMLInputElement).value || '100', 10),
          startDate: '2026-10-02',
          endDate: (modalEl.querySelector('#cp-form-end') as HTMLInputElement).value || '2026-10-31',
          status: 'Active'
        };

        store.setState({ promotions: [newPromo, ...store.getState().promotions] });
        showToast({ title: 'Coupon Created', message: `Code ${code} is now live!`, type: 'success' });
        closeModal();
        store.navigate('promotions');
      });
    }
  });
}

export function initPromotionsEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-create-coupon')?.addEventListener('click', openCreateCouponModal);

  container.querySelectorAll('.btn-copy-code').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = (btn as HTMLElement).dataset.code!;
      navigator.clipboard.writeText(code).then(() => {
        showToast({ title: 'Code Copied', message: `${code} copied to clipboard!`, type: 'info' });
      });
    });
  });
}
