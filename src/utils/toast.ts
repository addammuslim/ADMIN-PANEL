/**
 * AuraMaster Toast Notification System
 * Ultra-lightweight Vanilla JS toast dispatcher with auto-dismiss and animations
 */

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export function showToast(options: ToastOptions) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const { title, message = '', type = 'info', duration = 3500 } = options;

  const iconColors: Record<ToastType, string> = {
    success: 'text-emerald-500 bg-emerald-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    danger: 'text-rose-500 bg-rose-500/10',
    info: 'text-blue-500 bg-blue-500/10'
  };

  const icons: Record<ToastType, string> = {
    success: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
    warning: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
    danger: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
    info: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };

  const toastItem = document.createElement('div');
  toastItem.className = 'toast-item';
  toastItem.setAttribute('role', 'alert');
  toastItem.innerHTML = `
    <div class="p-2 rounded-lg ${iconColors[type]} shrink-0">
      ${icons[type]}
    </div>
    <div class="flex-1 pr-2">
      <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">${title}</div>
      ${message ? `<div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${message}</div>` : ''}
    </div>
    <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1" aria-label="Close">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

  const closeBtn = toastItem.querySelector('button');
  const dismiss = () => {
    toastItem.style.opacity = '0';
    toastItem.style.transform = 'translateX(20px)';
    setTimeout(() => {
      if (toastItem.parentNode) {
        toastItem.parentNode.removeChild(toastItem);
      }
    }, 200);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss);
  }

  container.appendChild(toastItem);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}
