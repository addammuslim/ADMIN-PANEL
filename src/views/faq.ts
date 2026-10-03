/**
 * AuraMaster FAQ Management & Accordion Preview
 * Manage customer support FAQs with real interactive accordion preview.
 */
import { store } from '../utils/store';
import { FAQItem } from '../data/mockData';
import { showToast } from '../utils/toast';
import { openModal, closeModal, confirmAction } from '../utils/modal';

export function renderFAQView(): string {
  const state = store.getState();

  const accordionItemsHtml = state.faqs
    .map(
      (f, idx) => `
    <div class="faq-accordion-item border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-surface transition-colors" data-id="${f.id}">
      <button class="faq-header-btn w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
        <div class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">${idx + 1}</span>
          <span class="text-xs font-bold text-slate-900 dark:text-white">${f.question}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline">${f.category}</span>
          <svg class="faq-chevron w-4 h-4 text-slate-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div class="faq-body p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 hidden">
        <div class="pt-3">${f.answer}</div>
        <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button class="btn-delete-faq text-[11px] text-rose-500 hover:underline" data-id="${f.id}">Delete</button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">FAQ & Help Center</h1>
          <p class="text-xs text-slate-500">Curate client customer support questions and test the interactive accordion component</p>
        </div>
        <button id="btn-add-faq" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>+ Add Question</span>
        </button>
      </div>

      <!-- Live Accordion Preview Container -->
      <div class="card p-6 space-y-3">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Storefront Accordion Component</div>
        <div class="space-y-2">
          ${accordionItemsHtml}
        </div>
      </div>
    </div>
  `;
}

export function openAddFAQModal() {
  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div>
        <label class="form-label">Question Text *</label>
        <input id="faq-form-q" type="text" class="form-input" placeholder="e.g. Can I use this serum during pregnancy?" required />
      </div>

      <div>
        <label class="form-label">Category Group</label>
        <select id="faq-form-cat" class="form-select">
          <option value="Product Safety">Product Safety</option>
          <option value="Shipping & Delivery">Shipping & Delivery</option>
          <option value="Returns & Guarantee">Returns & Guarantee</option>
          <option value="Orders & Payment">Orders & Payment</option>
        </select>
      </div>

      <div>
        <label class="form-label">Comprehensive Answer *</label>
        <textarea id="faq-form-a" class="form-textarea h-24" placeholder="Detailed clinical or operational response..." required></textarea>
      </div>
    </div>
  `;

  openModal({
    title: 'Add New FAQ Accordion Item',
    size: 'sm',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button id="btn-save-faq" class="btn btn-primary">Add Question</button>
    `,
    onMount: (modalEl) => {
      modalEl.querySelector('#btn-save-faq')?.addEventListener('click', () => {
        const q = (modalEl.querySelector('#faq-form-q') as HTMLInputElement).value.trim();
        const a = (modalEl.querySelector('#faq-form-a') as HTMLTextAreaElement).value.trim();
        if (!q || !a) {
          showToast({ title: 'Validation Error', message: 'Question and answer are both required.', type: 'danger' });
          return;
        }

        const newFaq: FAQItem = {
          id: `faq-${Date.now()}`,
          question: q,
          answer: a,
          category: (modalEl.querySelector('#faq-form-cat') as HTMLSelectElement).value,
          status: 'Published',
          order: store.getState().faqs.length + 1
        };

        store.setState({ faqs: [...store.getState().faqs, newFaq] });
        showToast({ title: 'FAQ Added', message: 'Question is now live in accordion.', type: 'success' });
        closeModal();
        store.navigate('faq');
      });
    }
  });
}

export function initFAQEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-add-faq')?.addEventListener('click', openAddFAQModal);

  // Accordion toggle logic
  container.querySelectorAll('.faq-header-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-accordion-item') as HTMLElement;
      const body = item.querySelector('.faq-body') as HTMLElement;
      const chevron = item.querySelector('.faq-chevron') as HTMLElement;

      const isHidden = body.classList.contains('hidden');
      if (isHidden) {
        body.classList.remove('hidden');
        chevron.classList.add('rotate-180');
      } else {
        body.classList.add('hidden');
        chevron.classList.remove('rotate-180');
      }
    });
  });

  // Delete FAQ
  container.querySelectorAll('.btn-delete-faq').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      confirmAction({
        title: 'Delete FAQ',
        message: 'Are you sure you want to remove this FAQ item?',
        confirmText: 'Delete',
        isDanger: true,
        onConfirm: () => {
          store.setState({ faqs: store.getState().faqs.filter((f) => f.id !== id) });
          showToast({ title: 'FAQ Deleted', message: 'Item removed.', type: 'success' });
          store.navigate('faq');
        }
      });
    });
  });
}
