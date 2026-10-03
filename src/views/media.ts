/**
 * AuraMaster Media Asset Library View
 * Media management supporting JPG, PNG, WEBP, and SVG with drag-and-drop upload simulator,
 * copy public URL, and full-resolution modal preview.
 */
import { store } from '../utils/store';
import { showToast } from '../utils/toast';
import { openModal, closeModal, confirmAction } from '../utils/modal';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'JPG' | 'PNG' | 'WEBP' | 'SVG';
  size: string;
  dimensions: string;
  uploadDate: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-01',
    name: 'skincare_serum_hero.jpg',
    url: '/src/assets/images/skincare_serum_1791012233742.jpg',
    type: 'JPG',
    size: '420 KB',
    dimensions: '1024x1024',
    uploadDate: '2026-10-02'
  },
  {
    id: 'med-02',
    name: 'fashion_jacket_studio.jpg',
    url: '/src/assets/images/fashion_jacket_1791012246013.jpg',
    type: 'JPG',
    size: '390 KB',
    dimensions: '1024x1024',
    uploadDate: '2026-10-02'
  },
  {
    id: 'med-03',
    name: 'artisan_coffee_beans.jpg',
    url: '/src/assets/images/artisan_coffee_1791012327837.jpg',
    type: 'JPG',
    size: '510 KB',
    dimensions: '1024x1024',
    uploadDate: '2026-10-02'
  },
  {
    id: 'med-04',
    name: 'executive_admin_portrait.jpg',
    url: '/src/assets/images/admin_avatar_1791012221345.jpg',
    type: 'JPG',
    size: '280 KB',
    dimensions: '1024x1024',
    uploadDate: '2026-10-02'
  }
];

let mediaList = [...INITIAL_MEDIA];

export function renderMediaView(): string {
  const cardsHtml = mediaList
    .map(
      (m) => `
    <div class="card overflow-hidden group hover:border-primary transition-all flex flex-col justify-between">
      <div class="relative h-36 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        <img src="${m.url}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">${m.type}</span>
      </div>
      <div class="p-3 text-xs space-y-1">
        <div class="font-semibold text-slate-900 dark:text-white truncate" title="${m.name}">${m.name}</div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>${m.dimensions}</span>
          <span>${m.size}</span>
        </div>
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
          <button class="btn-copy-media-url text-[11px] text-primary hover:underline font-medium" data-url="${m.url}">
            Copy URL
          </button>
          <button class="btn-preview-media text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white" data-id="${m.id}">
            Preview
          </button>
          <button class="btn-delete-media text-[11px] text-rose-500 hover:text-rose-700" data-id="${m.id}">
            Delete
          </button>
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
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Media Asset Library</h1>
          <p class="text-xs text-slate-500">Cloud CDN digital asset storage for high-resolution photography, badges, and icons</p>
        </div>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div id="media-dropzone" class="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-surface hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
        <div class="max-w-md mx-auto space-y-2">
          <div class="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">Click to upload files or drag & drop</div>
          <p class="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP, SVG (Max file size: 10 MB)</p>
          <input type="file" id="media-file-input" class="hidden" accept="image/*" />
        </div>
      </div>

      <!-- Media Assets Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function initMediaEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  // File dropzone trigger
  const dropzone = container.querySelector('#media-dropzone');
  const fileInput = container.querySelector('#media-file-input') as HTMLInputElement;

  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const newMedia: MediaItem = {
        id: `med-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: (file.name.split('.').pop()?.toUpperCase() as any) || 'JPG',
        size: `${Math.round(file.size / 1024)} KB`,
        dimensions: 'Original Size',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      mediaList = [newMedia, ...mediaList];
      showToast({ title: 'Image Uploaded', message: `${file.name} added to library.`, type: 'success' });
      store.navigate('media');
    }
  });

  // Copy URL
  container.querySelectorAll('.btn-copy-media-url').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = (btn as HTMLElement).dataset.url!;
      const fullUrl = window.location.origin + url;
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast({ title: 'Asset URL Copied', message: 'Ready to paste into website content.', type: 'info' });
      });
    });
  });

  // Preview full size
  container.querySelectorAll('.btn-preview-media').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const item = mediaList.find((m) => m.id === id);
      if (!item) return;

      openModal({
        title: item.name,
        size: 'lg',
        bodyHtml: `
          <div class="flex flex-col items-center justify-center p-2">
            <img src="${item.url}" class="max-h-[60vh] rounded-lg object-contain border border-slate-200 dark:border-slate-800" />
            <div class="mt-3 text-xs text-slate-500">${item.dimensions} · ${item.size} · Uploaded ${item.uploadDate}</div>
          </div>
        `,
        footerHtml: `<button class="btn btn-secondary modal-cancel-btn">Close</button>`
      });
    });
  });

  // Delete media
  container.querySelectorAll('.btn-delete-media').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      confirmAction({
        title: 'Delete Asset',
        message: 'Are you sure you want to delete this media file from CDN?',
        confirmText: 'Delete',
        isDanger: true,
        onConfirm: () => {
          mediaList = mediaList.filter((m) => m.id !== id);
          showToast({ title: 'Asset Removed', message: 'File was deleted.', type: 'success' });
          store.navigate('media');
        }
      });
    });
  });
}
