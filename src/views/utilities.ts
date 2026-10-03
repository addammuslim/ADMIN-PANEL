/**
 * AuraMaster UI Component Library & Copy-Paste Developer Documentation
 * Contains live interactive previews, clean HTML/CSS snippets, and 1-click "Copy Code" buttons.
 */
import { showToast } from '../utils/toast';
import { openModal, confirmAction } from '../utils/modal';

interface ComponentDoc {
  id: string;
  category: string;
  title: string;
  description: string;
  previewHtml: string;
  codeSnippet: string;
}

const COMPONENTS: ComponentDoc[] = [
  {
    id: 'btn-primary',
    category: 'Buttons',
    title: 'Primary Action Button',
    description: 'Use for dominant page actions such as saving data, submitting forms, or checking out.',
    previewHtml: `<button class="btn btn-primary">Save Changes</button>`,
    codeSnippet: `<button class="btn btn-primary">\n  Save Changes\n</button>`
  },
  {
    id: 'btn-secondary',
    category: 'Buttons',
    title: 'Secondary & Ghost Buttons',
    description: 'Use for secondary choices, modal cancellations, and filter dismissals.',
    previewHtml: `
      <div class="flex items-center gap-2">
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-ghost">Dismiss</button>
        <button class="btn btn-outline-primary">Outline Button</button>
      </div>
    `,
    codeSnippet: `<button class="btn btn-secondary">Cancel</button>\n<button class="btn btn-ghost">Dismiss</button>\n<button class="btn btn-outline-primary">Outline Button</button>`
  },
  {
    id: 'btn-status',
    category: 'Buttons',
    title: 'State & Semantic Buttons',
    description: 'Color-coded semantic buttons for dangerous operations, approvals, or warnings.',
    previewHtml: `
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn btn-success btn-sm">Approve Order</button>
        <button class="btn btn-danger btn-sm">Delete Product</button>
        <button class="btn btn-warning btn-sm">Suspend User</button>
        <button class="btn btn-primary btn-sm" disabled>Disabled</button>
      </div>
    `,
    codeSnippet: `<button class="btn btn-success btn-sm">Approve Order</button>\n<button class="btn btn-danger btn-sm">Delete Product</button>\n<button class="btn btn-warning btn-sm">Suspend User</button>`
  },
  {
    id: 'badges-status',
    category: 'Badges & Indicators',
    title: 'Semantic Status Badges',
    description: 'Use to represent operational lifecycles like payment received, completed delivery, or draft states.',
    previewHtml: `
      <div class="flex flex-wrap items-center gap-2">
        <span class="badge badge-success"><span class="badge-dot"></span>Completed</span>
        <span class="badge badge-info"><span class="badge-dot"></span>Shipped</span>
        <span class="badge badge-warning"><span class="badge-dot"></span>Processing</span>
        <span class="badge badge-danger"><span class="badge-dot"></span>Cancelled</span>
        <span class="badge badge-neutral"><span class="badge-dot"></span>Draft</span>
      </div>
    `,
    codeSnippet: `<span class="badge badge-success">\n  <span class="badge-dot"></span>\n  Completed\n</span>\n<span class="badge badge-warning">\n  <span class="badge-dot"></span>\n  Processing\n</span>`
  },
  {
    id: 'alerts-banner',
    category: 'Alerts',
    title: 'Alert Notification Banners',
    description: 'Inline callout banners informing users of system updates, warnings, or policy notes.',
    previewHtml: `
      <div class="space-y-2 w-full text-xs">
        <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Your automated database backup ran successfully at 02:00 WIB.</span>
          </div>
        </div>
        <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span>You have 3 products reaching the low stock replenishment threshold.</span>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `<div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-2">\n  <span>Your changes were saved successfully.</span>\n</div>`
  },
  {
    id: 'forms-input',
    category: 'Forms & Controls',
    title: 'Text Inputs & Selects',
    description: 'Clean focus-ring form controls with labels, hints, and icon prefixes.',
    previewHtml: `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div>
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input text-xs" placeholder="e.g. Jessica Tanuwijaya" />
          <p class="form-hint">Official customer name as on ID card.</p>
        </div>
        <div>
          <label class="form-label">Customer Tier</label>
          <select class="form-select text-xs">
            <option>Platinum VIP</option>
            <option>Gold Member</option>
            <option>Silver Member</option>
          </select>
        </div>
      </div>
    `,
    codeSnippet: `<label class="form-label">Full Name</label>\n<input type="text" class="form-input" placeholder="e.g. Jessica Tanuwijaya" />\n<p class="form-hint">Official customer name.</p>`
  },
  {
    id: 'modals-demo',
    category: 'Modals & Overlays',
    title: 'Modal Dialog Triggers',
    description: 'Accessible modal dialogs with smooth pop animations, focus trap, and ESC dismissal.',
    previewHtml: `
      <div class="flex items-center gap-2">
        <button id="demo-btn-open-modal" class="btn btn-secondary btn-sm">Launch Standard Modal</button>
        <button id="demo-btn-confirm-dialog" class="btn btn-danger btn-sm">Launch Delete Dialog</button>
      </div>
    `,
    codeSnippet: `// Vanilla JavaScript Modal Call\nopenModal({\n  title: 'Confirm Action',\n  size: 'md',\n  bodyHtml: '<p>Are you sure you want to proceed?</p>',\n  footerHtml: '<button class=\"btn btn-primary\">Confirm</button>'\n});`
  },
  {
    id: 'toast-demo',
    category: 'Notifications',
    title: 'Toast Notification Dispatcher',
    description: 'Lightweight slide-in toast notifications with auto-dismissal.',
    previewHtml: `
      <div class="flex flex-wrap items-center gap-2">
        <button id="demo-toast-success" class="btn btn-success btn-sm">Success Toast</button>
        <button id="demo-toast-warning" class="btn btn-warning btn-sm">Warning Toast</button>
        <button id="demo-toast-danger" class="btn btn-danger btn-sm">Danger Toast</button>
        <button id="demo-toast-info" class="btn btn-secondary btn-sm">Info Toast</button>
      </div>
    `,
    codeSnippet: `// Dispatch a toast anywhere in application\nshowToast({\n  title: 'Saved Successfully',\n  message: 'Your product modifications are now live.',\n  type: 'success',\n  duration: 3500\n});`
  },
  {
    id: 'skeleton-demo',
    category: 'Loaders',
    title: 'Skeleton Loading Placeholder',
    description: 'Smooth shimmer skeletons to maintain layout stability during asynchronous data fetching.',
    previewHtml: `
      <div class="space-y-2 w-full animate-pulse">
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    `,
    codeSnippet: `<div class="animate-pulse space-y-2">\n  <div class="h-4 bg-slate-200 rounded w-3/4"></div>\n  <div class="h-3 bg-slate-200 rounded w-1/2"></div>\n</div>`
  }
];

export function renderUtilitiesView(): string {
  const cardsHtml = COMPONENTS.map(
    (c) => `
    <div class="card overflow-hidden">
      <div class="card-header flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-primary">${c.category}</span>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">${c.title}</h2>
        </div>
        <button class="btn-copy-code-snippet btn btn-secondary btn-sm py-1 px-2.5 text-xs" data-id="${c.id}">
          <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          Copy Code
        </button>
      </div>
      <div class="card-body space-y-4">
        <p class="text-xs text-slate-500">${c.description}</p>
        
        <!-- Live Preview Box -->
        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center min-h-[72px]">
          ${c.previewHtml}
        </div>

        <!-- Code Block -->
        <div class="relative">
          <pre class="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-40"><code>${escapeHtml(c.codeSnippet)}</code></pre>
        </div>
      </div>
    </div>
  `
  ).join('');

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">UI Component Library & Developer Kit</h1>
          <p class="text-xs text-slate-500">ThemeForest-grade reusable HTML & Vanilla JS building blocks ready for 1-click copy & paste</p>
        </div>
      </div>

      <!-- Components Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function initUtilitiesEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  // Copy code buttons
  container.querySelectorAll('.btn-copy-code-snippet').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const comp = COMPONENTS.find((c) => c.id === id);
      if (comp) {
        navigator.clipboard.writeText(comp.codeSnippet).then(() => {
          showToast({ title: 'Code Snippet Copied!', message: 'Paste directly into your PHP/HTML templates.', type: 'info' });
        });
      }
    });
  });

  // Modal demo buttons
  container.querySelector('#demo-btn-open-modal')?.addEventListener('click', () => {
    openModal({
      title: 'Standard UI Modal Dialog',
      size: 'md',
      bodyHtml: `<p class="text-xs text-slate-600 dark:text-slate-300">This is a pure Vanilla JS modal with zero framework dependencies, backdrop blur, keyboard ESC dismissal, and automatic focus management.</p>`,
      footerHtml: `<button class="btn btn-secondary modal-cancel-btn">Close</button>`
    });
  });

  container.querySelector('#demo-btn-confirm-dialog')?.addEventListener('click', () => {
    confirmAction({
      title: 'Confirmation Required',
      message: 'This demonstrates the reusable confirmAction() modal pattern.',
      confirmText: 'Confirm Delete',
      isDanger: true,
      onConfirm: () => {
        showToast({ title: 'Action Confirmed', message: 'Delete callback triggered.', type: 'success' });
      }
    });
  });

  // Toast demo buttons
  container.querySelector('#demo-toast-success')?.addEventListener('click', () => {
    showToast({ title: 'Success Notice', message: 'Item updated successfully.', type: 'success' });
  });
  container.querySelector('#demo-toast-warning')?.addEventListener('click', () => {
    showToast({ title: 'Warning Notice', message: 'Session will expire in 10 minutes.', type: 'warning' });
  });
  container.querySelector('#demo-toast-danger')?.addEventListener('click', () => {
    showToast({ title: 'Error Encountered', message: 'Unable to connect to database host.', type: 'danger' });
  });
  container.querySelector('#demo-toast-info')?.addEventListener('click', () => {
    showToast({ title: 'Information Notice', message: 'A new software patch is available.', type: 'info' });
  });
}
