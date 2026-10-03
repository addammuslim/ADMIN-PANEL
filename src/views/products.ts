/**
 * AuraMaster Product Management Views (List & Multi-Tab Form)
 * Fully-featured inventory manager with live filtering, bulk actions,
 * sorting, pagination, and multi-tab product editor.
 */
import { store } from '../utils/store';
import { Product } from '../data/mockData';
import { formatCurrency, slugify } from '../utils/formatters';
import { showToast } from '../utils/toast';
import { confirmAction, openModal, closeModal } from '../utils/modal';

interface ProductFilterState {
  search: string;
  category: string;
  status: string;
  page: number;
  pageSize: number;
  sortBy: 'name' | 'price' | 'stock' | 'soldCount';
  sortOrder: 'asc' | 'desc';
  selectedIds: string[];
}

const filterState: ProductFilterState = {
  search: '',
  category: 'all',
  status: 'all',
  page: 1,
  pageSize: 8,
  sortBy: 'name',
  sortOrder: 'asc',
  selectedIds: []
};

export function renderProductsView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  // Filter & Search
  let filtered = state.products.filter((p) => {
    const matchesSearch =
      !filterState.search ||
      p.name.toLowerCase().includes(filterState.search.toLowerCase()) ||
      p.sku.toLowerCase().includes(filterState.search.toLowerCase()) ||
      p.category.toLowerCase().includes(filterState.search.toLowerCase());

    const matchesCat = filterState.category === 'all' || p.category === filterState.category;
    const matchesStatus = filterState.status === 'all' || p.status === filterState.status;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    if (filterState.sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (filterState.sortBy === 'price') cmp = a.price - b.price;
    else if (filterState.sortBy === 'stock') cmp = a.stock - b.stock;
    else if (filterState.sortBy === 'soldCount') cmp = a.soldCount - b.soldCount;
    return filterState.sortOrder === 'desc' ? -cmp : cmp;
  });

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / filterState.pageSize) || 1;
  const startIdx = (filterState.page - 1) * filterState.pageSize;
  const paginated = filtered.slice(startIdx, startIdx + filterState.pageSize);

  // Categories list for dropdown
  const categories = Array.from(new Set(state.products.map((p) => p.category)));

  // Table rows
  const rowsHtml = paginated
    .map((p) => {
      const isSelected = filterState.selectedIds.includes(p.id);
      const statusBadge =
        p.status === 'In Stock'
          ? 'badge-success'
          : p.status === 'Low Stock'
          ? 'badge-warning'
          : p.status === 'Out of Stock'
          ? 'badge-danger'
          : 'badge-neutral';

      return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-primary-light/50' : ''}">
        <td class="w-10">
          <input
            type="checkbox"
            class="product-row-check rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            data-id="${p.id}"
            ${isSelected ? 'checked' : ''}
          />
        </td>
        <td class="w-14">
          <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
        </td>
        <td>
          <div class="font-semibold text-slate-900 dark:text-white text-xs max-w-xs truncate">${p.name}</div>
          <div class="text-[11px] text-slate-400 font-mono">${p.sku}</div>
        </td>
        <td class="text-xs text-slate-600 dark:text-slate-300">${p.category}</td>
        <td>
          <div class="text-xs font-semibold text-slate-900 dark:text-white tabular-nums">${formatCurrency(p.price, symbol)}</div>
          ${p.salePrice ? `<div class="text-[10px] text-rose-500 line-through tabular-nums">${formatCurrency(p.salePrice, symbol)}</div>` : ''}
        </td>
        <td>
          <div class="text-xs font-mono font-medium tabular-nums ${p.stock <= p.lowStockThreshold ? 'text-amber-600 font-bold' : 'text-slate-700 dark:text-slate-300'}">
            ${p.stock} units
          </div>
          ${p.stock <= p.lowStockThreshold && p.stock > 0 ? `<div class="text-[10px] text-amber-500">Low threshold (${p.lowStockThreshold})</div>` : ''}
        </td>
        <td>
          <span class="badge ${statusBadge}">
            <span class="badge-dot"></span>
            ${p.status}
          </span>
        </td>
        <td class="tabular-nums text-xs text-slate-500">${p.soldCount}</td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button class="btn-edit-product p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" data-id="${p.id}" title="Edit product">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="btn-delete-product p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" data-id="${p.id}" title="Delete product">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Product Catalog</h1>
          <p class="text-xs text-slate-500">Manage store inventory, retail pricing, variants, and stock thresholds</p>
        </div>
        <div class="flex items-center gap-2.5">
          <button id="btn-export-products" class="btn btn-secondary btn-sm">
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Export CSV</span>
          </button>
          <button id="btn-add-product" class="btn btn-primary btn-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="card p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2.5 flex-1">
          <!-- Search input -->
          <div class="relative min-w-[200px] flex-1 max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              id="filter-product-search"
              type="text"
              placeholder="Search by name, SKU, or category..."
              value="${filterState.search}"
              class="form-input text-xs pl-9 py-1.5"
            />
          </div>

          <!-- Category filter select -->
          <select id="filter-product-category" class="form-select text-xs py-1.5 w-auto">
            <option value="all">All Categories</option>
            ${categories.map((c) => `<option value="${c}" ${filterState.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>

          <!-- Status filter select -->
          <select id="filter-product-status" class="form-select text-xs py-1.5 w-auto">
            <option value="all">All Status</option>
            <option value="In Stock" ${filterState.status === 'In Stock' ? 'selected' : ''}>In Stock</option>
            <option value="Low Stock" ${filterState.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
            <option value="Out of Stock" ${filterState.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
          </select>
        </div>

        <!-- Bulk Actions Indicator (appears when rows checked) -->
        ${
          filterState.selectedIds.length > 0
            ? `<div class="flex items-center gap-2 bg-primary-light px-3 py-1.5 rounded-lg border border-primary/20">
                <span class="text-xs font-semibold text-primary">${filterState.selectedIds.length} selected</span>
                <button id="btn-bulk-delete" class="btn btn-danger btn-sm py-1 px-2 text-xs">Delete Selected</button>
              </div>`
            : ''
        }
      </div>

      <!-- Products Data Table Card -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="w-10">
                  <input
                    type="checkbox"
                    id="check-all-products"
                    class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    ${paginated.length > 0 && paginated.every((p) => filterState.selectedIds.includes(p.id)) ? 'checked' : ''}
                  />
                </th>
                <th>Image</th>
                <th class="cursor-pointer hover:text-slate-900" id="sort-name">Product Name</th>
                <th>Category</th>
                <th class="cursor-pointer hover:text-slate-900" id="sort-price">Price</th>
                <th class="cursor-pointer hover:text-slate-900" id="sort-stock">Stock</th>
                <th>Status</th>
                <th class="cursor-pointer hover:text-slate-900" id="sort-sold">Sold</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="9" class="p-8 text-center text-slate-400">No products matching the selected criteria.</td></tr>`}
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="card-footer flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span class="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${Math.min(startIdx + 1, totalItems)}</span> to <span class="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${Math.min(startIdx + filterState.pageSize, totalItems)}</span> of <span class="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${totalItems}</span> products
          </div>
          <div class="flex items-center gap-1.5">
            <button id="btn-prev-page" class="btn btn-secondary btn-sm py-1 px-2.5 ${filterState.page <= 1 ? 'opacity-50 pointer-events-none' : ''}">Previous</button>
            <span class="px-2 py-1 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${filterState.page} / ${totalPages}</span>
            <button id="btn-next-page" class="btn btn-secondary btn-sm py-1 px-2.5 ${filterState.page >= totalPages ? 'opacity-50 pointer-events-none' : ''}">Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openProductEditorModal(productId?: string) {
  const state = store.getState();
  const isEditing = Boolean(productId);
  const product: Product = productId
    ? state.products.find((p) => p.id === productId)!
    : {
        id: `prod-${Date.now().toString().slice(-4)}`,
        name: '',
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        category: 'Face Treatment',
        price: 199000,
        costPrice: 60000,
        stock: 50,
        lowStockThreshold: 15,
        status: 'In Stock',
        image: '/src/assets/images/skincare_serum_1791012233742.jpg',
        soldCount: 0,
        featured: false,
        bestseller: false,
        createdDate: new Date().toISOString().split('T')[0]
      };

  const bodyHtml = `
    <div>
      <!-- Editor Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 text-xs font-semibold">
        <button class="product-tab-btn px-3 py-1.5 rounded-lg bg-primary-light text-primary" data-tab="tab-general">General Info</button>
        <button class="product-tab-btn px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100" data-tab="tab-desc">Descriptions & Specs</button>
        <button class="product-tab-btn px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100" data-tab="tab-seo">SEO Metadata</button>
        <button class="product-tab-btn px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100" data-tab="tab-media">Gallery & Media</button>
      </div>

      <!-- Tab 1: General -->
      <div id="tab-general" class="product-tab-content space-y-4">
        <div>
          <label class="form-label">Product Title *</label>
          <input id="prod-form-name" type="text" class="form-input" value="${product.name}" placeholder="e.g. Ceramide Barrier Relief Serum 30ml" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">SKU Code</label>
            <input id="prod-form-sku" type="text" class="form-input font-mono" value="${product.sku}" />
          </div>
          <div>
            <label class="form-label">Category</label>
            <select id="prod-form-category" class="form-select">
              <option value="Face Treatment" ${product.category === 'Face Treatment' ? 'selected' : ''}>Face Treatment</option>
              <option value="Moisturizer" ${product.category === 'Moisturizer' ? 'selected' : ''}>Moisturizer</option>
              <option value="Cleanser" ${product.category === 'Cleanser' ? 'selected' : ''}>Cleanser</option>
              <option value="Sun Protection" ${product.category === 'Sun Protection' ? 'selected' : ''}>Sun Protection</option>
              <option value="Toner" ${product.category === 'Toner' ? 'selected' : ''}>Toner</option>
              <option value="Apparel" ${product.category === 'Apparel' ? 'selected' : ''}>Apparel / Fashion</option>
              <option value="Single Origin" ${product.category === 'Single Origin' ? 'selected' : ''}>Single Origin Coffee</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">Retail Price (Rp) *</label>
            <input id="prod-form-price" type="number" class="form-input font-mono" value="${product.price}" />
          </div>
          <div>
            <label class="form-label">Sale Price (Optional)</label>
            <input id="prod-form-saleprice" type="number" class="form-input font-mono" value="${product.salePrice || ''}" placeholder="Discounted price" />
          </div>
          <div>
            <label class="form-label">COGS Cost Price</label>
            <input id="prod-form-costprice" type="number" class="form-input font-mono" value="${product.costPrice}" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">Current Stock</label>
            <input id="prod-form-stock" type="number" class="form-input font-mono" value="${product.stock}" />
          </div>
          <div>
            <label class="form-label">Low Stock Threshold</label>
            <input id="prod-form-threshold" type="number" class="form-input font-mono" value="${product.lowStockThreshold}" />
          </div>
          <div>
            <label class="form-label">Stock Status</label>
            <select id="prod-form-status" class="form-select">
              <option value="In Stock" ${product.status === 'In Stock' ? 'selected' : ''}>In Stock</option>
              <option value="Low Stock" ${product.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
              <option value="Out of Stock" ${product.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
              <option value="Draft" ${product.status === 'Draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-6 pt-2">
          <label class="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input id="prod-form-featured" type="checkbox" class="rounded text-primary focus:ring-primary w-4 h-4" ${product.featured ? 'checked' : ''} />
            <span>Mark as Featured Product</span>
          </label>
          <label class="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input id="prod-form-bestseller" type="checkbox" class="rounded text-primary focus:ring-primary w-4 h-4" ${product.bestseller ? 'checked' : ''} />
            <span>Mark as Bestseller</span>
          </label>
        </div>
      </div>

      <!-- Tab 2: Descriptions -->
      <div id="tab-desc" class="product-tab-content space-y-4 hidden">
        <div>
          <label class="form-label">Short Summary (Shown in card listings)</label>
          <textarea id="prod-form-shortdesc" class="form-textarea h-20" placeholder="Brief 1-2 sentence compelling summary...">Formulated with pure phyto-ceramides and multi-weight hyaluronic acid to replenish damaged lipid bilayers.</textarea>
        </div>
        <div>
          <label class="form-label">Full Clinical Description</label>
          <textarea id="prod-form-fulldesc" class="form-textarea h-28" placeholder="Detailed product story, texture, and dermatological efficacy...">This medical-grade restorative formulation repairs trans-epidermal moisture loss by delivering physiologically balanced ceramide fractions identical to native human skin lipids.</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Key Active Ingredients</label>
            <textarea class="form-textarea h-20" placeholder="e.g. Ceramide NP, EOP, AP, Phytosphingosine, 2% Niacinamide"></textarea>
          </div>
          <div>
            <label class="form-label">How to Use</label>
            <textarea class="form-textarea h-20" placeholder="e.g. Dispense 3-4 drops onto cleansed damp skin morning and evening."></textarea>
          </div>
        </div>
      </div>

      <!-- Tab 3: SEO -->
      <div id="tab-seo" class="product-tab-content space-y-4 hidden">
        <div>
          <label class="form-label">SEO Meta Title</label>
          <input type="text" class="form-input" value="${product.name} | Official Store" placeholder="50-60 characters recommended" />
        </div>
        <div>
          <label class="form-label">Meta Description</label>
          <textarea class="form-textarea h-20" placeholder="150-160 characters search engine snippet...">Shop clinical-grade barrier renewal serum. Fast 24h delivery, dermatologist approved, hypoallergenic.</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Focus Keyword</label>
            <input type="text" class="form-input" value="ceramide barrier serum" />
          </div>
          <div>
            <label class="form-label">Canonical URL Slug</label>
            <input type="text" class="form-input font-mono" value="/products/${slugify(product.name || 'new-product')}" />
          </div>
        </div>
      </div>

      <!-- Tab 4: Media Gallery -->
      <div id="tab-media" class="product-tab-content space-y-4 hidden">
        <div class="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50/50 dark:bg-slate-900/30">
          <svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">Drag & drop product images here, or <span class="text-primary hover:underline cursor-pointer">browse</span></div>
          <div class="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 5MB</div>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <div class="relative group rounded-lg overflow-hidden border-2 border-primary">
            <img src="${product.image}" class="w-full h-24 object-cover" />
            <span class="absolute top-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Featured</span>
          </div>
          <div class="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src="/src/assets/images/skincare_serum_1791012233742.jpg" class="w-full h-24 object-cover" />
            <button class="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  openModal({
    title: isEditing ? `Edit Product: ${product.name}` : 'Add New Product to Catalog',
    size: 'lg',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button id="btn-save-product-form" class="btn btn-primary">${isEditing ? 'Save Changes' : 'Create Product'}</button>
    `,
    onMount: (modalEl) => {
      // Tab switcher
      const tabBtns = modalEl.querySelectorAll('.product-tab-btn');
      const tabContents = modalEl.querySelectorAll('.product-tab-content');

      tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const tabId = (btn as HTMLElement).dataset.tab;
          tabBtns.forEach((b) => {
            b.classList.remove('bg-primary-light', 'text-primary');
            b.classList.add('text-slate-500');
          });
          btn.classList.add('bg-primary-light', 'text-primary');
          btn.classList.remove('text-slate-500');

          tabContents.forEach((c) => {
            if (c.id === tabId) c.classList.remove('hidden');
            else c.classList.add('hidden');
          });
        });
      });

      // Cancel button
      modalEl.querySelector('.modal-cancel-btn')?.addEventListener('click', closeModal);

      // Save button
      modalEl.querySelector('#btn-save-product-form')?.addEventListener('click', () => {
        const nameInput = modalEl.querySelector('#prod-form-name') as HTMLInputElement;
        const nameVal = nameInput?.value.trim();
        if (!nameVal) {
          showToast({ title: 'Validation Error', message: 'Product title is required.', type: 'danger' });
          return;
        }

        const skuVal = (modalEl.querySelector('#prod-form-sku') as HTMLInputElement)?.value || product.sku;
        const catVal = (modalEl.querySelector('#prod-form-category') as HTMLSelectElement)?.value || product.category;
        const priceVal = parseFloat((modalEl.querySelector('#prod-form-price') as HTMLInputElement)?.value || '0');
        const salePriceVal = parseFloat((modalEl.querySelector('#prod-form-saleprice') as HTMLInputElement)?.value || '0') || undefined;
        const costPriceVal = parseFloat((modalEl.querySelector('#prod-form-costprice') as HTMLInputElement)?.value || '0');
        const stockVal = parseInt((modalEl.querySelector('#prod-form-stock') as HTMLInputElement)?.value || '0', 10);
        const thresholdVal = parseInt((modalEl.querySelector('#prod-form-threshold') as HTMLInputElement)?.value || '10', 10);
        const statusVal = (modalEl.querySelector('#prod-form-status') as HTMLSelectElement)?.value as any;
        const featuredVal = (modalEl.querySelector('#prod-form-featured') as HTMLInputElement)?.checked || false;
        const bestsellerVal = (modalEl.querySelector('#prod-form-bestseller') as HTMLInputElement)?.checked || false;

        const updatedProduct: Product = {
          ...product,
          name: nameVal,
          sku: skuVal,
          category: catVal,
          price: priceVal,
          salePrice: salePriceVal,
          costPrice: costPriceVal,
          stock: stockVal,
          lowStockThreshold: thresholdVal,
          status: statusVal,
          featured: featuredVal,
          bestseller: bestsellerVal
        };

        if (isEditing) {
          store.updateProduct(updatedProduct);
          showToast({ title: 'Product Updated', message: `Saved changes to ${nameVal}.`, type: 'success' });
        } else {
          store.addProduct(updatedProduct);
          showToast({ title: 'Product Created', message: `${nameVal} added to catalog.`, type: 'success' });
        }

        closeModal();
      });
    }
  });
}

export function initProductsEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  // Search input
  const searchInput = container.querySelector('#filter-product-search') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterState.search = searchInput.value;
      filterState.page = 1;
      store.navigate('products');
    });
  }

  // Category select
  const catSelect = container.querySelector('#filter-product-category') as HTMLSelectElement;
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      filterState.category = catSelect.value;
      filterState.page = 1;
      store.navigate('products');
    });
  }

  // Status select
  const statusSelect = container.querySelector('#filter-product-status') as HTMLSelectElement;
  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      filterState.status = statusSelect.value;
      filterState.page = 1;
      store.navigate('products');
    });
  }

  // Pagination Next/Prev
  container.querySelector('#btn-prev-page')?.addEventListener('click', () => {
    if (filterState.page > 1) {
      filterState.page--;
      store.navigate('products');
    }
  });

  container.querySelector('#btn-next-page')?.addEventListener('click', () => {
    filterState.page++;
    store.navigate('products');
  });

  // Check all
  const checkAll = container.querySelector('#check-all-products') as HTMLInputElement;
  if (checkAll) {
    checkAll.addEventListener('change', () => {
      const state = store.getState();
      if (checkAll.checked) {
        filterState.selectedIds = state.products.map((p) => p.id);
      } else {
        filterState.selectedIds = [];
      }
      store.navigate('products');
    });
  }

  // Row checks
  container.querySelectorAll('.product-row-check').forEach((chk) => {
    chk.addEventListener('change', (e) => {
      const id = (chk as HTMLElement).dataset.id!;
      if ((chk as HTMLInputElement).checked) {
        if (!filterState.selectedIds.includes(id)) filterState.selectedIds.push(id);
      } else {
        filterState.selectedIds = filterState.selectedIds.filter((item) => item !== id);
      }
      store.navigate('products');
    });
  });

  // Bulk delete
  container.querySelector('#btn-bulk-delete')?.addEventListener('click', () => {
    confirmAction({
      title: 'Bulk Delete Products',
      message: `Are you sure you want to delete ${filterState.selectedIds.length} selected products? This action cannot be reversed.`,
      confirmText: 'Delete Selected',
      isDanger: true,
      onConfirm: () => {
        store.deleteProductsBulk(filterState.selectedIds);
        showToast({
          title: 'Products Deleted',
          message: `${filterState.selectedIds.length} products removed from database.`,
          type: 'success'
        });
        filterState.selectedIds = [];
        store.navigate('products');
      }
    });
  });

  // Single delete
  container.querySelectorAll('.btn-delete-product').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const prod = store.getState().products.find((p) => p.id === id);
      confirmAction({
        title: 'Delete Product',
        message: `Are you sure you want to delete "${prod?.name || 'this product'}"?`,
        confirmText: 'Delete Product',
        isDanger: true,
        onConfirm: () => {
          store.deleteProduct(id);
          showToast({ title: 'Product Deleted', message: 'The item was deleted.', type: 'success' });
          store.navigate('products');
        }
      });
    });
  });

  // Single edit
  container.querySelectorAll('.btn-edit-product').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      openProductEditorModal(id);
    });
  });

  // Add Product Button
  container.querySelector('#btn-add-product')?.addEventListener('click', () => {
    openProductEditorModal();
  });

  // Export CSV
  container.querySelector('#btn-export-products')?.addEventListener('click', () => {
    showToast({ title: 'Export Initiated', message: 'Downloading products_catalog.csv file...', type: 'info' });
  });
}
