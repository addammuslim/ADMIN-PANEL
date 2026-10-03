/**
 * AuraMaster Expense Management View
 * Operational expense logging with category classification and approval flows.
 */
import { store } from '../utils/store';
import { Expense } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../utils/toast';
import { openModal, closeModal, confirmAction } from '../utils/modal';

export function renderExpensesView(): string {
  const state = store.getState();
  const symbol = state.currentClient.currencySymbol;

  const totalExpense = state.expenses.reduce((acc, e) => acc + e.amount, 0);

  const rowsHtml = state.expenses.map((exp) => {
    const statusBadges: Record<string, string> = {
      Approved: 'badge-success',
      Pending: 'badge-warning',
      Reimbursed: 'badge-info'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <div class="font-bold text-xs text-slate-900 dark:text-white">${exp.name}</div>
          <div class="text-[11px] text-slate-400">${exp.notes}</div>
        </td>
        <td>
          <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            ${exp.category}
          </span>
        </td>
        <td class="tabular-nums text-xs font-bold text-slate-900 dark:text-white">${formatCurrency(exp.amount, symbol)}</td>
        <td class="tabular-nums text-xs text-slate-500">${exp.date}</td>
        <td>
          <span class="badge ${statusBadges[exp.status]}">
            <span class="badge-dot"></span>
            ${exp.status}
          </span>
        </td>
        <td class="text-right">
          <button class="btn-delete-expense p-1 text-slate-400 hover:text-rose-600 transition-colors" data-id="${exp.id}" title="Delete expense">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Expense Tracker</h1>
          <p class="text-xs text-slate-500">Record and verify company disbursements, operational vendor bills, and payroll</p>
        </div>
        <button id="btn-add-expense" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>+ Log Expense</span>
        </button>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Total Operational Spend</div>
          <div class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${formatCurrency(totalExpense, symbol)}</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Top Category</div>
          <div class="text-lg font-bold text-primary">Marketing & Ads</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Approval Rate</div>
          <div class="text-lg font-bold text-emerald-600">100% Verified</div>
        </div>
      </div>

      <!-- Expenses Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Expense Item & Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th class="text-right">Action</th>
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

export function openAddExpenseModal() {
  const symbol = store.getState().currentClient.currencySymbol;

  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div>
        <label class="form-label">Expense Title / Vendor *</label>
        <input id="exp-form-name" type="text" class="form-input" placeholder="e.g. Meta Ads Invoice #INV-8891" required />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Category</label>
          <select id="exp-form-cat" class="form-select">
            <option value="Marketing">Marketing & Advertising</option>
            <option value="Shipping">Shipping Logistics</option>
            <option value="Salary">Payroll & Salaries</option>
            <option value="Hosting">Cloud Infrastructure & CDN</option>
            <option value="Packaging">Boxes & Packaging</option>
            <option value="Operational">Operational Testing</option>
          </select>
        </div>
        <div>
          <label class="form-label">Amount (${symbol}) *</label>
          <input id="exp-form-amt" type="number" class="form-input font-mono" placeholder="e.g. 5000000" required />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Expense Date</label>
          <input id="exp-form-date" type="date" class="form-input" value="2026-10-02" />
        </div>
        <div>
          <label class="form-label">Approval Status</label>
          <select id="exp-form-status" class="form-select">
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Reimbursed">Reimbursed</option>
          </select>
        </div>
      </div>

      <div>
        <label class="form-label">Notes & Purpose</label>
        <textarea id="exp-form-notes" class="form-textarea h-16" placeholder="Reason for expenditure..."></textarea>
      </div>
    </div>
  `;

  openModal({
    title: 'Log Operational Expense',
    size: 'sm',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button id="btn-save-exp" class="btn btn-primary">Save Expense</button>
    `,
    onMount: (modalEl) => {
      modalEl.querySelector('#btn-save-exp')?.addEventListener('click', () => {
        const name = (modalEl.querySelector('#exp-form-name') as HTMLInputElement).value.trim();
        const amt = parseFloat((modalEl.querySelector('#exp-form-amt') as HTMLInputElement).value || '0');
        if (!name || isNaN(amt) || amt <= 0) {
          showToast({ title: 'Validation Error', message: 'Name and valid positive amount are required.', type: 'danger' });
          return;
        }

        const newExp: Expense = {
          id: `exp-${Date.now()}`,
          name,
          category: (modalEl.querySelector('#exp-form-cat') as HTMLSelectElement).value as any,
          amount: amt,
          date: (modalEl.querySelector('#exp-form-date') as HTMLInputElement).value || '2026-10-02',
          notes: (modalEl.querySelector('#exp-form-notes') as HTMLTextAreaElement).value,
          status: (modalEl.querySelector('#exp-form-status') as HTMLSelectElement).value as any
        };

        store.setState({ expenses: [newExp, ...store.getState().expenses] });
        showToast({ title: 'Expense Logged', message: `${name} has been recorded.`, type: 'success' });
        closeModal();
        store.navigate('expenses');
      });
    }
  });
}

export function initExpensesEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-add-expense')?.addEventListener('click', openAddExpenseModal);

  container.querySelectorAll('.btn-delete-expense').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      confirmAction({
        title: 'Delete Expense',
        message: 'Are you sure you want to remove this expense record?',
        confirmText: 'Delete',
        isDanger: true,
        onConfirm: () => {
          store.setState({ expenses: store.getState().expenses.filter((e) => e.id !== id) });
          showToast({ title: 'Expense Deleted', message: 'Record removed.', type: 'success' });
          store.navigate('expenses');
        }
      });
    });
  });
}
