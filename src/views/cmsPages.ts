/**
 * AuraMaster CMS & Legal Pages Manager
 * Edit site pages: Home, About Us, Privacy Policy, Terms & Conditions, and Custom Pages.
 */
import { store } from '../utils/store';
import { showToast } from '../utils/toast';
import { openModal, closeModal } from '../utils/modal';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: 'Published' | 'Draft';
  lastModified: string;
}

const PAGES_DATA: CMSPage[] = [
  { id: 'page-1', title: 'Home Page', slug: '', template: 'Hero + Showcase + Features', status: 'Published', lastModified: '2026-10-01' },
  { id: 'page-2', title: 'About Our Clinic & Brand', slug: 'about-us', template: 'Brand Story & Team', status: 'Published', lastModified: '2026-09-28' },
  { id: 'page-3', title: 'Contact & Clinic Locator', slug: 'contact', template: 'Map + Form + Schedule', status: 'Published', lastModified: '2026-09-25' },
  { id: 'page-4', title: 'Frequently Asked Questions (FAQ)', slug: 'faq', template: 'Accordion FAQ Layout', status: 'Published', lastModified: '2026-09-20' },
  { id: 'page-5', title: 'Privacy Policy (GDPR / PDP Compliance)', slug: 'privacy-policy', template: 'Legal Text Content', status: 'Published', lastModified: '2026-08-15' },
  { id: 'page-6', title: 'Terms & Conditions of Sale', slug: 'terms', template: 'Legal Text Content', status: 'Published', lastModified: '2026-08-15' },
  { id: 'page-7', title: 'Return & Refund Policy', slug: 'refund-policy', template: 'Policy Text Content', status: 'Published', lastModified: '2026-09-02' }
];

export function renderCMSPagesView(): string {
  const rowsHtml = PAGES_DATA.map((p) => `
    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      <td>
        <div class="font-bold text-xs text-slate-900 dark:text-white">${p.title}</div>
        <div class="text-[11px] text-slate-400 font-mono">/${p.slug}</div>
      </td>
      <td class="text-xs text-slate-600 dark:text-slate-300">${p.template}</td>
      <td class="tabular-nums text-xs text-slate-500">${p.lastModified}</td>
      <td>
        <span class="badge ${p.status === 'Published' ? 'badge-success' : 'badge-neutral'}">
          <span class="badge-dot"></span>
          ${p.status}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-edit-cms-page btn btn-secondary btn-sm py-1 px-2.5 text-xs" data-id="${p.id}">
          Edit Page
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">CMS & Static Pages</h1>
          <p class="text-xs text-slate-500">Manage client storefront pages, navigation routing, and mandatory legal policies</p>
        </div>
        <button id="btn-create-cms-page" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>+ Create Custom Page</span>
        </button>
      </div>

      <!-- Pages Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Page Title & URL Slug</th>
                <th>Layout Template</th>
                <th>Last Modified</th>
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

export function initCMSPagesEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelectorAll('.btn-edit-cms-page').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const page = PAGES_DATA.find((p) => p.id === id);
      if (!page) return;

      openModal({
        title: `Edit Page: ${page.title}`,
        size: 'md',
        bodyHtml: `
          <div class="space-y-4 text-xs">
            <div>
              <label class="form-label">Page Title</label>
              <input type="text" class="form-input" value="${page.title}" />
            </div>
            <div>
              <label class="form-label">Slug</label>
              <input type="text" class="form-input font-mono" value="${page.slug}" />
            </div>
            <div>
              <label class="form-label">SEO Meta Description</label>
              <textarea class="form-textarea h-20">Discover ${page.title} at ${store.getState().currentClient.name}.</textarea>
            </div>
          </div>
        `,
        footerHtml: `
          <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary modal-save-btn">Save Changes</button>
        `,
        onMount: (modalEl) => {
          modalEl.querySelector('.modal-save-btn')?.addEventListener('click', () => {
            showToast({ title: 'Page Saved', message: `${page.title} updated.`, type: 'success' });
            closeModal();
          });
        }
      });
    });
  });

  container.querySelector('#btn-create-cms-page')?.addEventListener('click', () => {
    showToast({ title: 'Custom Page Builder', message: 'Ready to instantiate new static template.', type: 'info' });
  });
}
