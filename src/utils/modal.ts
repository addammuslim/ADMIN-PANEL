/**
 * AuraMaster Modal & Dialog Utility
 * Accessible, keyboard-navigable dialogs with smooth animation
 */

export interface ModalOptions {
  title: string;
  bodyHtml: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  footerHtml?: string;
  onMount?: (modalEl: HTMLElement) => void;
}

let activeModalEl: HTMLElement | null = null;

export function openModal(options: ModalOptions): HTMLElement {
  closeModal();

  const { title, bodyHtml, size = 'md', showClose = true, footerHtml, onMount } = options;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'app-active-modal';

  backdrop.innerHTML = `
    <div class="modal-dialog modal-${size}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 id="modal-title" class="text-base font-semibold text-slate-900 dark:text-slate-100">${title}</h3>
        ${
          showClose
            ? `<button class="modal-close-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Close dialog">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>`
            : ''
        }
      </div>
      <div class="p-6 overflow-y-auto max-h-[calc(85vh-130px)]">
        ${bodyHtml}
      </div>
      ${
        footerHtml
          ? `<div class="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              ${footerHtml}
            </div>`
          : ''
      }
    </div>
  `;

  // Close handlers
  const closeBtn = backdrop.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';
  activeModalEl = backdrop;

  if (onMount) {
    onMount(backdrop);
  }

  return backdrop;
}

export function closeModal() {
  if (activeModalEl && activeModalEl.parentNode) {
    activeModalEl.parentNode.removeChild(activeModalEl);
    activeModalEl = null;
    document.body.style.overflow = '';
  }
}

export function confirmAction(options: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}) {
  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    onConfirm
  } = options;

  openModal({
    title,
    size: 'sm',
    bodyHtml: `
      <div class="flex items-start gap-4">
        <div class="p-3 rounded-full ${isDanger ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40'} shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
              isDanger
                ? 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            }" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-slate-600 dark:text-slate-300">${message}</p>
        </div>
      </div>
    `,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">${cancelText}</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} modal-confirm-btn">${confirmText}</button>
    `,
    onMount: (modalEl) => {
      modalEl.querySelector('.modal-cancel-btn')?.addEventListener('click', closeModal);
      modalEl.querySelector('.modal-confirm-btn')?.addEventListener('click', () => {
        closeModal();
        onConfirm();
      });
    }
  });
}
