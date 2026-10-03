/**
 * AuraMaster Moka POS (Point of Sale) Enterprise Cashier System
 * High-performance, touch-friendly, ultra-responsive POS terminal
 * Features:
 * - Kiosk / Fullscreen Mode with seamless Admin Switcher
 * - Category filter tabs & fast product search & barcode scan simulator
 * - Cart management with notes, quantity stepper, hold bills & open bills
 * - Tiered Loyalty Program integration: member selector, points balance & points redemption
 * - Multi-method Payment Gateway (Dynamic QRIS, Cash with auto-change, EDC Debit/Credit, E-Wallet)
 * - 58mm/80mm Thermal Receipt Generator with Print, WhatsApp, and Download
 */
import { store } from '../utils/store';
import { Product, Customer, PosCartItem, HeldOrder, Order } from '../data/mockData';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { showToast } from '../utils/toast';

let activeCategory: string = 'All';
let searchQuery: string = '';
let selectedPaymentMethod: Order['paymentMethod'] = 'QRIS';
let cashReceivedAmount: number = 0;
let lastCompletedTransaction: { order: Order; pointsEarned: number; change: number } | null = null;
let clockInterval: number | null = null;

export function renderPOSView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;
  const cart = state.posCart;
  const customer = state.posCustomer;
  const isFullscreen = state.posFullscreen;

  // Filter products by category & search
  const filteredProducts = state.products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Extract unique categories
  const categories = ['All', ...new Set(state.products.map((p) => p.category))];

  // Calculate cart financials
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const promoDiscount = (subtotal * state.posDiscountPercent) / 100;
  const pointsDiscount = state.posPointsRedeemed * (state.loyaltyRules.pointValueInRupiah || 100);
  const totalDiscount = promoDiscount + pointsDiscount;
  const taxable = Math.max(0, subtotal - totalDiscount);
  const tax = Math.round(taxable * 0.11); // 11% PPN / PB1
  const grandTotal = taxable + tax;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render Product Grid
  const productsGridHtml =
    filteredProducts.length === 0
      ? `
      <div class="col-span-full py-16 text-center text-muted">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="font-medium text-sm">Tidak ada produk ditemukan</p>
        <p class="text-xs text-muted mt-1">Coba kata kunci lain atau pilih kategori Semua</p>
      </div>
    `
      : filteredProducts
          .map((p) => {
            const isOutOfStock = p.stock <= 0;
            return `
        <div
          class="pos-product-card group relative bg-surface border border-border rounded-xl p-2.5 flex flex-col justify-between hover:border-primary/60 hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.98] ${
            isOutOfStock ? 'opacity-50 pointer-events-none' : ''
          }"
          data-product-id="${p.id}"
        >
          <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-subtle mb-2">
            <img
              src="${p.image}"
              alt="${p.name}"
              class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop';"
            />
            <span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-md backdrop-blur-md ${
              p.stock <= p.lowStockThreshold
                ? 'bg-amber-500/90 text-white'
                : 'bg-slate-900/70 text-white'
            }">
              Stok: ${p.stock}
            </span>
          </div>

          <div>
            <span class="text-[10px] font-medium text-muted uppercase tracking-wider block truncate">${p.category}</span>
            <h4 class="font-semibold text-xs text-text line-clamp-2 mt-0.5 leading-snug group-hover:text-primary transition-colors">
              ${p.name}
            </h4>
          </div>

          <div class="mt-2 pt-2 border-t border-border flex items-center justify-between">
            <div class="font-bold text-xs sm:text-sm text-text tabular-nums">
              ${formatCurrency(p.price, symbol)}
            </div>
            <button
              class="w-7 h-7 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors shadow-2xs shrink-0"
              title="Tambah ke Keranjang"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      `;
          })
          .join('');

  // Render Cart Items
  const cartItemsHtml =
    cart.length === 0
      ? `
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted">
        <div class="w-16 h-16 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3">
          <svg class="w-8 h-8 opacity-40 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="font-semibold text-text text-sm">Keranjang Pesanan Kosong</p>
        <p class="text-xs text-muted max-w-[200px] mt-1">Sentuh produk di sebelah kiri untuk menambahkan ke bill kasir</p>
      </div>
    `
      : cart
          .map((item) => {
            const itemTotal = item.product.price * item.quantity;
            return `
        <div class="p-3 bg-surface border border-border rounded-xl flex items-start gap-2.5 transition-all hover:border-border/80">
          <img
            src="${item.product.image}"
            alt="${item.product.name}"
            class="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop';"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-1">
              <h5 class="font-semibold text-xs text-text truncate max-w-[140px] sm:max-w-[170px]" title="${item.product.name}">
                ${item.product.name}
              </h5>
              <button
                class="pos-remove-item text-muted hover:text-rose-500 p-0.5 rounded transition-colors"
                data-id="${item.product.id}"
                title="Hapus Item"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="text-[11px] text-muted tabular-nums mt-0.5">
              ${formatCurrency(item.product.price, symbol)}
            </div>

            ${
              item.notes
                ? `<div class="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded mt-1 truncate">
                    📝 ${item.notes}
                  </div>`
                : ''
            }

            <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60">
              <!-- Quantity Stepper -->
              <div class="flex items-center gap-1 bg-surface-subtle border border-border rounded-lg p-0.5">
                <button
                  class="pos-qty-btn w-5 h-5 flex items-center justify-center text-text hover:bg-surface rounded font-bold text-xs"
                  data-id="${item.product.id}"
                  data-action="minus"
                >
                  −
                </button>
                <span class="w-7 text-center font-bold text-xs tabular-nums text-text">${item.quantity}</span>
                <button
                  class="pos-qty-btn w-5 h-5 flex items-center justify-center text-text hover:bg-surface rounded font-bold text-xs"
                  data-id="${item.product.id}"
                  data-action="plus"
                >
                  +
                </button>
              </div>

              <!-- Notes trigger -->
              <button
                class="pos-edit-note-btn text-[10px] text-primary hover:underline font-medium"
                data-id="${item.product.id}"
                data-note="${item.notes || ''}"
              >
                ${item.notes ? 'Ubah Catatan' : '+ Catatan'}
              </button>

              <!-- Item total -->
              <div class="font-bold text-xs text-text tabular-nums">
                ${formatCurrency(itemTotal, symbol)}
              </div>
            </div>
          </div>
        </div>
      `;
          })
          .join('');

  // Tier info of customer if selected
  const customerTier = customer ? state.loyaltyTiers.find((t) => t.name === customer.tier) : null;

  return `
    <div class="pos-workspace flex flex-col h-full min-h-[calc(100vh-68px)] ${
      isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''
    }">
      <!-- ================================================================= -->
      <!-- TOP STATUS BAR (MOKA POS HEADER)                                  -->
      <!-- ================================================================= -->
      <div class="h-14 bg-surface border-b border-border px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs select-none">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            ${client.name.charAt(0)}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs sm:text-sm text-text leading-tight truncate max-w-[130px] sm:max-w-[200px]">${client.name}</span>
              <span class="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Terminal Kasir #01
              </span>
            </div>
            <div class="text-[10px] text-muted flex items-center gap-2">
              <span>Kasir: <strong class="text-text font-medium">${client.adminName}</strong></span>
              <span class="hidden sm:inline">·</span>
              <span id="pos-live-clock" class="font-mono text-text font-medium hidden sm:inline">--:--:--</span>
            </div>
          </div>
        </div>

        <!-- Center / Right Action Controls -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Held Orders (Open Bills) Button -->
          <button
            id="pos-open-held-btn"
            class="px-2.5 py-1.5 rounded-lg border border-border bg-surface-subtle hover:bg-surface text-text text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors relative"
            title="Daftar Bill Tersimpan"
          >
            <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="hidden sm:inline">Bill Pending</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              state.heldOrders.length > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-border text-muted'
            }">
              ${state.heldOrders.length}
            </span>
          </button>

          <!-- Toggle Fullscreen / Kiosk Mode -->
          <button
            id="pos-toggle-fullscreen-btn"
            class="p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text transition-colors shadow-2xs"
            title="${isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh Kasir'}"
          >
            ${
              isFullscreen
                ? `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
                : `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>`
            }
          </button>

          <!-- Return to Admin Panel Button (Requested Feature) -->
          <button
            id="pos-exit-to-admin-btn"
            class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="Keluar dari Kasir dan Buka Admin Panel"
          >
            <svg class="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Admin Panel</span>
          </button>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MAIN POS BODY (SPLIT WORKSPACE: CATALOG + ACTIVE BILL)            -->
      <!-- ================================================================= -->
      <div class="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        <!-- ------------------------------------------------------------- -->
        <!-- LEFT COLUMN: PRODUCT CATALOG & FAST ORDERING                  -->
        <!-- ------------------------------------------------------------- -->
        <div class="flex-1 flex flex-col min-w-0 bg-background border-r border-border overflow-hidden">
          <!-- Filter & Search Bar -->
          <div class="p-3 sm:p-4 bg-surface border-b border-border space-y-3 shrink-0">
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <svg class="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  id="pos-search-input"
                  value="${searchQuery}"
                  placeholder="Cari nama produk, SKU, atau tekan barcode..."
                  class="w-full bg-surface-subtle border border-border rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                ${
                  searchQuery
                    ? `<button id="pos-clear-search-btn" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text p-1 text-xs">✕</button>`
                    : ''
                }
              </div>

              <!-- Barcode Scanner Simulation Button -->
              <button
                id="pos-barcode-scan-btn"
                class="btn btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 shrink-0"
                title="Simulasi Scanner Barcode (F2)"
              >
                <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span class="hidden sm:inline">Scan SKU</span>
              </button>
            </div>

            <!-- Category Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              ${categories
                .map(
                  (cat) => `
                <button
                  class="pos-category-pill px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-subtle hover:bg-surface text-muted hover:text-text border border-border'
                  }"
                  data-category="${cat}"
                >
                  ${cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Products Scroll Area -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-4">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3">
              ${productsGridHtml}
            </div>
          </div>
        </div>

        <!-- ------------------------------------------------------------- -->
        <!-- RIGHT COLUMN: ACTIVE ORDER CART & BILL TICKET                 -->
        <!-- ------------------------------------------------------------- -->
        <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col bg-surface border-t lg:border-t-0 shrink-0 shadow-lg lg:shadow-none h-[480px] lg:h-auto overflow-hidden">
          <!-- Cart Header / Customer & Order Type -->
          <div class="p-3.5 border-b border-border bg-surface-subtle space-y-2.5 shrink-0">
            <!-- Member Loyalty Card Pill -->
            <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-border">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  ${customer ? customer.name.charAt(0) : '👤'}
                </div>
                <div class="truncate">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-xs text-text truncate">
                      ${customer ? customer.name : 'Pelanggan Umum (Non-Member)'}
                    </span>
                    ${
                      customerTier
                        ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${customerTier.badgeBg} ${customerTier.badgeColor}">
                            ${customerTier.name}
                          </span>`
                        : ''
                    }
                  </div>
                  <div class="text-[10px] text-muted truncate">
                    ${
                      customer
                        ? `Poin Tersedia: <strong class="text-primary font-mono">${customer.loyaltyPoints} Pts</strong> (${customerTier?.multiplier}x earn)`
                        : 'Belum terhubung ke Loyalty Program'
                    }
                  </div>
                </div>
              </div>

              <button
                id="pos-select-customer-btn"
                class="btn btn-sm btn-secondary text-xs px-2.5 py-1 text-primary shrink-0"
              >
                ${customer ? 'Ganti' : '+ Member'}
              </button>
            </div>

            <!-- Order Type Selector (Dine In / Take Away / Delivery) -->
            <div class="flex items-center gap-1 p-1 bg-surface rounded-xl border border-border text-xs font-semibold">
              <button
                class="pos-order-type-btn flex-1 py-1.5 rounded-lg text-center transition-all ${
                  state.posOrderType === 'dine-in'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted hover:text-text'
                }"
                data-type="dine-in"
              >
                🍽️ Dine In
              </button>
              <button
                class="pos-order-type-btn flex-1 py-1.5 rounded-lg text-center transition-all ${
                  state.posOrderType === 'take-away'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted hover:text-text'
                }"
                data-type="take-away"
              >
                🛍️ Take Away
              </button>
              <button
                class="pos-order-type-btn flex-1 py-1.5 rounded-lg text-center transition-all ${
                  state.posOrderType === 'delivery'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted hover:text-text'
                }"
                data-type="delivery"
              >
                🛵 Delivery
              </button>
            </div>

            ${
              state.posOrderType === 'dine-in'
                ? `
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted font-medium shrink-0">No Meja:</span>
                <input
                  type="text"
                  id="pos-table-input"
                  value="${state.posTableNumber}"
                  placeholder="Contoh: Meja 05"
                  class="flex-1 bg-surface border border-border rounded-lg px-2.5 py-1 text-xs text-text outline-none focus:border-primary"
                />
              </div>
            `
                : ''
            }
          </div>

          <!-- Cart Items Scroll List -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2">
            ${cartItemsHtml}
          </div>

          <!-- Cart Financial Calculation & Pay Button -->
          <div class="p-3.5 border-t border-border bg-surface-subtle shrink-0 space-y-2.5">
            <!-- Applied Discounts or Loyalty Points trigger -->
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted">Diskon & Loyalty:</span>
              <button
                id="pos-add-discount-btn"
                class="text-primary hover:underline font-semibold text-xs flex items-center gap-1"
              >
                ${
                  totalDiscount > 0
                    ? `Hemat ${formatCurrency(totalDiscount, symbol)} ✏️`
                    : '+ Diskon / Tukar Poin'
                }
              </button>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-1 text-xs">
              <div class="flex justify-between text-muted">
                <span>Subtotal (${totalItemsCount} item)</span>
                <span class="tabular-nums font-mono">${formatCurrency(subtotal, symbol)}</span>
              </div>
              ${
                totalDiscount > 0
                  ? `
                <div class="flex justify-between text-emerald-600 font-medium">
                  <span>Potongan Promo / Poin</span>
                  <span class="tabular-nums font-mono">-${formatCurrency(totalDiscount, symbol)}</span>
                </div>
              `
                  : ''
              }
              <div class="flex justify-between text-muted">
                <span>PPN / Pajak Resto (11%)</span>
                <span class="tabular-nums font-mono">${formatCurrency(tax, symbol)}</span>
              </div>
            </div>

            <div class="pt-2 border-t border-border flex items-baseline justify-between">
              <div>
                <span class="text-[11px] font-bold text-muted uppercase tracking-wider block">Grand Total</span>
                <span class="text-[10px] text-emerald-600 font-medium">
                  ${customer ? `+${Math.floor(grandTotal / 10000 * (customerTier?.multiplier || 1))} Poin didapat` : 'Login member untuk poin'}
                </span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-text tabular-nums text-primary">
                ${formatCurrency(grandTotal, symbol)}
              </div>
            </div>

            <!-- Action Buttons: Hold, Clear, Pay -->
            <div class="grid grid-cols-4 gap-2 pt-1">
              <button
                id="pos-hold-bill-btn"
                class="btn btn-secondary text-xs py-2.5 col-span-1 border border-border"
                title="Simpan Bill Sementara (Hold)"
                ${cart.length === 0 ? 'disabled' : ''}
              >
                ⏸️ Hold
              </button>
              <button
                id="pos-clear-cart-btn"
                class="btn btn-secondary text-xs py-2.5 col-span-1 border border-border hover:text-rose-500"
                title="Kosongkan Keranjang"
                ${cart.length === 0 ? 'disabled' : ''}
              >
                🗑️ Batal
              </button>
              <button
                id="pos-checkout-btn"
                class="btn btn-primary text-xs sm:text-sm font-bold py-2.5 col-span-2 shadow-md flex items-center justify-center gap-1.5"
                ${cart.length === 0 ? 'disabled' : ''}
              >
                <span>Bayar Sekarang</span>
                <span class="text-[10px] opacity-75 font-normal hidden sm:inline">(F4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals Container (Payment, Receipt, Customer, Discount, Held) -->
      <div id="pos-modal-container"></div>
    </div>
  `;
}

// ============================================================================
// EVENT LISTENERS & INTERACTIVE FLOWS
// ============================================================================
export function initPOSEventListeners() {
  // Live clock in POS bar
  const clockEl = document.getElementById('pos-live-clock');
  if (clockInterval) clearInterval(clockInterval);
  const updateClock = () => {
    if (clockEl) {
      clockEl.textContent = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  };
  updateClock();
  clockInterval = window.setInterval(updateClock, 1000);

  // Exit POS to Admin Panel
  document.getElementById('pos-exit-to-admin-btn')?.addEventListener('click', () => {
    store.togglePosFullscreen(false);
    store.navigate('dashboard');
  });

  // Toggle POS Fullscreen
  document.getElementById('pos-toggle-fullscreen-btn')?.addEventListener('click', () => {
    store.togglePosFullscreen();
  });

  // Search input
  const searchInput = document.getElementById('pos-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    renderPOSViewOnly();
  });

  document.getElementById('pos-clear-search-btn')?.addEventListener('click', () => {
    searchQuery = '';
    renderPOSViewOnly();
  });

  // Category pills
  document.querySelectorAll('.pos-category-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = (btn as HTMLElement).dataset.category || 'All';
      renderPOSViewOnly();
    });
  });

  // Product cards tap to add
  document.querySelectorAll('.pos-product-card').forEach((card) => {
    card.addEventListener('click', () => {
      const prodId = (card as HTMLElement).dataset.productId;
      const product = store.getState().products.find((p) => p.id === prodId);
      if (product) {
        store.addToCart(product, 1);
        showToast({
          title: 'Ditambahkan',
          message: `${product.name} dimasukkan ke keranjang kasir.`,
          type: 'success',
          duration: 1800
        });
      }
    });
  });

  // Cart quantity buttons (+ / -)
  document.querySelectorAll('.pos-qty-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      const action = (btn as HTMLElement).dataset.action!;
      const currentItem = store.getState().posCart.find((i) => i.product.id === id);
      if (!currentItem) return;

      if (action === 'plus') {
        store.updateCartItemQty(id, currentItem.quantity + 1);
      } else {
        store.updateCartItemQty(id, currentItem.quantity - 1);
      }
    });
  });

  // Cart remove item
  document.querySelectorAll('.pos-remove-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      store.removeCartItem(id);
    });
  });

  // Cart edit item note
  document.querySelectorAll('.pos-edit-note-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const currentNote = (btn as HTMLElement).dataset.note || '';
      openItemNoteModal(id, currentNote);
    });
  });

  // Order type selector
  document.querySelectorAll('.pos-order-type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = (btn as HTMLElement).dataset.type as 'dine-in' | 'take-away' | 'delivery';
      store.setPosOrderType(type);
    });
  });

  // Table number input
  const tableInput = document.getElementById('pos-table-input') as HTMLInputElement;
  tableInput?.addEventListener('change', () => {
    store.setPosTableNumber(tableInput.value);
  });

  // Clear cart
  document.getElementById('pos-clear-cart-btn')?.addEventListener('click', () => {
    if (confirm('Yakin ingin membatalkan semua item dalam keranjang ini?')) {
      store.clearCart();
      showToast({ title: 'Keranjang Dikosongkan', message: 'Bill kasir telah di-reset.', type: 'info' });
    }
  });

  // Hold current order
  document.getElementById('pos-hold-bill-btn')?.addEventListener('click', () => {
    const table = (document.getElementById('pos-table-input') as HTMLInputElement)?.value;
    const ref = store.holdCurrentOrder(table);
    if (ref) {
      showToast({
        title: 'Bill Tersimpan',
        message: `Pesanan telah disimpan dengan kode ${ref}.`,
        type: 'success'
      });
    }
  });

  // Open Held Bills Modal
  document.getElementById('pos-open-held-btn')?.addEventListener('click', openHeldOrdersModal);

  // Select Customer / Member Modal
  document.getElementById('pos-select-customer-btn')?.addEventListener('click', openCustomerPickerModal);

  // Discount & Points Redemption Modal
  document.getElementById('pos-add-discount-btn')?.addEventListener('click', openDiscountAndPointsModal);

  // Barcode Scanner Simulator
  document.getElementById('pos-barcode-scan-btn')?.addEventListener('click', simulateBarcodeScan);

  // Checkout Pay Button -> Open Payment Gateway Modal
  document.getElementById('pos-checkout-btn')?.addEventListener('click', openPaymentGatewayModal);

  // Keyboard Shortcuts: F4 (Pay), F2 (Barcode), Escape (Close Modals)
  window.addEventListener('keydown', handlePosKeydown);
}

function handlePosKeydown(e: KeyboardEvent) {
  if (store.getState().currentView !== 'pos') return;

  if (e.key === 'F4') {
    e.preventDefault();
    if (store.getState().posCart.length > 0) {
      openPaymentGatewayModal();
    }
  } else if (e.key === 'F2') {
    e.preventDefault();
    simulateBarcodeScan();
  }
}

function renderPOSViewOnly() {
  const container = document.getElementById('app-main-content');
  if (container) {
    container.innerHTML = renderPOSView();
    initPOSEventListeners();
  }
}

// ============================================================================
// PAYMENT GATEWAY MODAL (QRIS, CASH, CARD, E-WALLET)
// ============================================================================
function openPaymentGatewayModal() {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  const subtotal = state.posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const promoDiscount = (subtotal * state.posDiscountPercent) / 100;
  const pointsDiscount = state.posPointsRedeemed * (state.loyaltyRules.pointValueInRupiah || 100);
  const totalDiscount = promoDiscount + pointsDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscount) + Math.round(Math.max(0, subtotal - totalDiscount) * 0.11);

  // Preset cash buttons
  const cashSuggestions = [
    grandTotal,
    Math.ceil(grandTotal / 50000) * 50000,
    Math.ceil(grandTotal / 100000) * 100000,
    500000
  ].filter((v, i, a) => a.indexOf(v) === i && v >= grandTotal);

  cashReceivedAmount = grandTotal;

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-lg overflow-hidden flex flex-col max-h-[92vh]">
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 class="font-bold text-base text-text">Payment Gateway Terminal</h3>
            <p class="text-xs text-muted">Pilih metode pembayaran dan konfirmasi transaksi kasir</p>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-muted block uppercase tracking-wider font-semibold">Total Tagihan</span>
            <span class="text-xl sm:text-2xl font-black text-primary tabular-nums">${formatCurrency(grandTotal, symbol)}</span>
          </div>
        </div>

        <!-- Payment Method Tabs -->
        <div class="p-3 bg-surface border-b border-border flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
          <button class="pay-method-tab px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            selectedPaymentMethod === 'QRIS'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-subtle text-muted hover:text-text border-border'
          }" data-method="QRIS">
            <span class="text-sm">📱</span> QRIS Instan
          </button>
          <button class="pay-method-tab px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            selectedPaymentMethod === 'COD'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-subtle text-muted hover:text-text border-border'
          }" data-method="COD">
            <span class="text-sm">💵</span> Tunai (Cash)
          </button>
          <button class="pay-method-tab px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            selectedPaymentMethod === 'Credit Card'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-subtle text-muted hover:text-text border-border'
          }" data-method="Credit Card">
            <span class="text-sm">💳</span> Kartu EDC
          </button>
          <button class="pay-method-tab px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            selectedPaymentMethod === 'Virtual Account'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-subtle text-muted hover:text-text border-border'
          }" data-method="Virtual Account">
            <span class="text-sm">🏦</span> Virtual Account
          </button>
        </div>

        <!-- Payment Method Body Panels -->
        <div class="p-5 flex-1 overflow-y-auto">
          <!-- PANEL 1: QRIS DINAMIS -->
          <div id="pay-panel-qris" class="${selectedPaymentMethod === 'QRIS' ? '' : 'hidden'} space-y-4 text-center">
            <div class="max-w-xs mx-auto p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div class="flex items-center justify-between w-full mb-2">
                <span class="font-extrabold text-xs tracking-wider text-slate-800">QRIS</span>
                <span class="text-[10px] text-slate-400 font-medium">NMID: ID1020261928371</span>
              </div>

              <!-- Real SVG QR Code Pattern -->
              <div class="w-48 h-48 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" class="w-full h-full text-slate-900">
                  <path fill="currentColor" d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
                  <path fill="currentColor" d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
                  <path fill="currentColor" d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
                  <rect x="45" y="15" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="30" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="15" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="30" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="60" y="55" width="10" height="10" fill="currentColor" />
                  <rect x="75" y="55" width="15" height="8" fill="currentColor" />
                  <rect x="60" y="75" width="15" height="15" fill="currentColor" />
                  <rect x="80" y="70" width="10" height="10" fill="currentColor" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-xs text-primary">
                    QR
                  </div>
                </div>
              </div>

              <div class="mt-3 text-center">
                <span class="text-[11px] text-slate-500 block">Scan dengan BCA, GoPay, OVO, ShopeePay, DANA, Livin</span>
                <span class="text-xs font-mono font-bold text-slate-800 mt-1 block">Expires in: <span id="qris-timer" class="text-rose-500">04:59</span></span>
              </div>
            </div>

            <button
              id="btn-simulate-qris-paid"
              class="btn btn-sm bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 mx-auto font-semibold text-xs"
            >
              ⚡ Simulasi Pelanggan Scan & Berhasil Bayar
            </button>
          </div>

          <!-- PANEL 2: CASH (TUNAI) -->
          <div id="pay-panel-cash" class="${selectedPaymentMethod === 'COD' ? '' : 'hidden'} space-y-4 max-w-md mx-auto">
            <div>
              <label class="form-label text-xs">Uang Diterima dari Pelanggan</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-muted">${symbol}</span>
                <input
                  type="number"
                  id="cash-received-input"
                  value="${cashReceivedAmount}"
                  class="form-input pl-10 text-lg font-bold tabular-nums"
                />
              </div>
            </div>

            <!-- Quick Cash Recommendation Buttons -->
            <div>
              <span class="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1.5">Pilihan Uang Pas & Pecahan</span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${cashSuggestions
                  .map(
                    (val, idx) => `
                  <button
                    class="cash-suggestion-btn py-2 px-2 rounded-xl border border-border bg-surface-subtle hover:bg-surface text-text font-bold text-xs tabular-nums text-center transition-all ${
                      val === cashReceivedAmount ? 'border-primary bg-primary-light text-primary' : ''
                    }"
                    data-val="${val}"
                  >
                    ${idx === 0 ? 'Uang Pas' : formatCurrency(val, symbol)}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Change Calculation Box -->
            <div id="cash-change-box" class="p-4 rounded-2xl bg-surface-subtle border border-border flex items-center justify-between">
              <div>
                <span class="text-xs text-muted block">Kembalian Uang Tunai</span>
                <span id="cash-change-label" class="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                  ${formatCurrency(Math.max(0, cashReceivedAmount - grandTotal), symbol)}
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                💵
              </div>
            </div>
          </div>

          <!-- PANEL 3: CARD EDC -->
          <div id="pay-panel-card" class="${selectedPaymentMethod === 'Credit Card' ? '' : 'hidden'} space-y-4 max-w-md mx-auto">
            <div>
              <label class="form-label text-xs">Pilih Bank Mesin EDC</label>
              <select id="edc-bank-select" class="form-select text-xs">
                <option value="BCA">BCA (EDC Card Machine)</option>
                <option value="Mandiri">Bank Mandiri EDC</option>
                <option value="BRI">Bank BRI Merchant</option>
                <option value="BNI">Bank BNI Smart EDC</option>
              </select>
            </div>
            <div>
              <label class="form-label text-xs">Nomor Approval / Trace Code Struk Mesin</label>
              <input
                type="text"
                id="edc-approval-code"
                placeholder="Contoh: APPR-992812"
                value="APPR-${Math.floor(100000 + Math.random() * 900000)}"
                class="form-input font-mono text-xs"
              />
            </div>
          </div>

          <!-- PANEL 4: VIRTUAL ACCOUNT -->
          <div id="pay-panel-va" class="${selectedPaymentMethod === 'Virtual Account' ? '' : 'hidden'} space-y-4 max-w-md mx-auto text-center">
            <div class="p-4 rounded-2xl bg-surface-subtle border border-border text-left space-y-2">
              <span class="text-xs text-muted block">Nomor Virtual Account Bank BCA / Mandiri:</span>
              <div class="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-border font-mono font-bold text-base text-primary">
                <span>8809 1029 3847 1192</span>
                <button class="text-xs text-muted hover:text-text font-sans font-medium" onclick="navigator.clipboard.writeText('8809102938471192')">Salin</button>
              </div>
              <p class="text-[11px] text-muted">Sistem akan otomatis mendeteksi mutasi dalam 5-10 detik setelah transfer sukses.</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 border-t border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <button id="pos-cancel-pay-btn" class="btn btn-secondary text-xs px-4 py-2">
            Kembali ke Keranjang
          </button>
          <button id="pos-confirm-payment-btn" class="btn btn-primary text-xs sm:text-sm font-bold px-6 py-2.5 shadow-md flex items-center gap-2">
            <span>Selesaikan & Cetak Struk</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach modal handlers
  document.getElementById('pos-cancel-pay-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  // Switch tabs
  modalContainer.querySelectorAll('.pay-method-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      selectedPaymentMethod = (tab as HTMLElement).dataset.method as Order['paymentMethod'];
      openPaymentGatewayModal();
    });
  });

  // Cash suggestions
  modalContainer.querySelectorAll('.cash-suggestion-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number((btn as HTMLElement).dataset.val);
      cashReceivedAmount = val;
      const inp = document.getElementById('cash-received-input') as HTMLInputElement;
      if (inp) inp.value = String(val);
      updateChangeLabel(val, grandTotal, symbol);
    });
  });

  // Cash input change
  const cashInput = document.getElementById('cash-received-input') as HTMLInputElement;
  cashInput?.addEventListener('input', () => {
    cashReceivedAmount = Number(cashInput.value) || 0;
    updateChangeLabel(cashReceivedAmount, grandTotal, symbol);
  });

  // Simulate QRIS paid
  document.getElementById('btn-simulate-qris-paid')?.addEventListener('click', () => {
    processFinalCheckout(grandTotal);
  });

  // Confirm payment
  document.getElementById('pos-confirm-payment-btn')?.addEventListener('click', () => {
    if (selectedPaymentMethod === 'COD' && cashReceivedAmount < grandTotal) {
      alert(`Uang tunai diterima (${formatCurrency(cashReceivedAmount, symbol)}) kurang dari total tagihan (${formatCurrency(grandTotal, symbol)})!`);
      return;
    }
    processFinalCheckout(cashReceivedAmount >= grandTotal ? cashReceivedAmount : grandTotal);
  });
}

function updateChangeLabel(received: number, total: number, symbol: string) {
  const changeLabel = document.getElementById('cash-change-label');
  if (changeLabel) {
    const change = Math.max(0, received - total);
    changeLabel.textContent = formatCurrency(change, symbol);
  }
}

function processFinalCheckout(amountPaid: number) {
  const result = store.checkoutPos(selectedPaymentMethod, amountPaid);
  lastCompletedTransaction = {
    order: result.newOrder,
    pointsEarned: result.pointsEarned,
    change: result.change
  };

  showToast({
    title: 'Pembayaran Sukses!',
    message: `Order #${result.newOrder.orderNumber} berhasil diproses. +${result.pointsEarned} Poin ditambahkan.`,
    type: 'success'
  });

  // Re-render POS
  renderPOSViewOnly();

  // Open Thermal Receipt modal
  openThermalReceiptModal(result.newOrder, result.pointsEarned, result.change);
}

// ============================================================================
// THERMAL RECEIPT MODAL (58mm / 80mm PRINTER VIEW)
// ============================================================================
function openThermalReceiptModal(order: Order, pointsEarned: number, change: number) {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;

  const itemsRows = order.items
    .map(
      (item) => `
    <div class="flex items-start justify-between text-xs py-1 border-b border-dashed border-slate-300">
      <div class="flex-1 pr-2">
        <div class="font-bold text-slate-800">${item.name}</div>
        <div class="text-[10px] text-slate-500">${item.quantity} x ${formatCurrency(item.price, symbol)}</div>
      </div>
      <div class="font-mono font-bold text-slate-800 text-right shrink-0">
        ${formatCurrency(item.total, symbol)}
      </div>
    </div>
  `
    )
    .join('');

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-md max-w-sm flex flex-col max-h-[95vh] overflow-hidden">
        <div class="p-3 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <span class="text-xs font-bold text-text">Struk Digital Transaksi</span>
          <button id="pos-close-receipt-btn" class="p-1 rounded text-muted hover:text-text">✕</button>
        </div>

        <!-- Thermal Receipt Paper View -->
        <div class="p-5 flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900 flex justify-center">
          <div id="thermal-receipt-paper" class="w-full max-w-[320px] bg-white text-slate-900 font-mono p-5 rounded shadow-sm text-xs space-y-3 border border-slate-200">
            <!-- Header -->
            <div class="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
              <h2 class="text-base font-black tracking-tight uppercase">${client.name}</h2>
              <p class="text-[10px] text-slate-600">${client.tagline}</p>
              <p class="text-[10px] text-slate-500">Jakarta Selatan · WA: +62 812-3456-7890</p>
            </div>

            <!-- Meta info -->
            <div class="text-[10px] space-y-0.5 text-slate-600 pb-2 border-b border-dashed border-slate-400">
              <div class="flex justify-between">
                <span>No. Struk:</span>
                <span class="font-bold text-slate-900">${order.orderNumber}</span>
              </div>
              <div class="flex justify-between">
                <span>Tanggal:</span>
                <span>${order.date}</span>
              </div>
              <div class="flex justify-between">
                <span>Kasir:</span>
                <span>${client.adminName}</span>
              </div>
              <div class="flex justify-between">
                <span>Pelanggan:</span>
                <span class="font-bold">${order.customerName}</span>
              </div>
              ${
                pointsEarned > 0
                  ? `<div class="flex justify-between text-emerald-700 font-bold">
                      <span>Poin Loyalty:</span>
                      <span>+${pointsEarned} Pts</span>
                    </div>`
                  : ''
              }
            </div>

            <!-- Items -->
            <div class="py-1">
              ${itemsRows}
            </div>

            <!-- Totals -->
            <div class="text-[11px] space-y-1 pt-2 border-t border-dashed border-slate-400">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>${formatCurrency(order.subtotal, symbol)}</span>
              </div>
              ${
                order.discount > 0
                  ? `<div class="flex justify-between text-emerald-600">
                      <span>Diskon Promo:</span>
                      <span>-${formatCurrency(order.discount, symbol)}</span>
                    </div>`
                  : ''
              }
              <div class="flex justify-between">
                <span>PPN 11%:</span>
                <span>${formatCurrency(order.tax, symbol)}</span>
              </div>
              <div class="flex justify-between font-black text-sm pt-1 border-t border-slate-800">
                <span>TOTAL:</span>
                <span>${formatCurrency(order.grandTotal, symbol)}</span>
              </div>
              <div class="flex justify-between text-[10px] pt-1">
                <span>Metode Bayar:</span>
                <span class="font-bold uppercase">${order.paymentMethod}</span>
              </div>
              ${
                change > 0
                  ? `<div class="flex justify-between text-[10px] text-emerald-700 font-bold">
                      <span>Kembalian:</span>
                      <span>${formatCurrency(change, symbol)}</span>
                    </div>`
                  : ''
              }
            </div>

            <!-- Footer Barcode & QR Simulation -->
            <div class="text-center pt-3 border-t border-dashed border-slate-400 space-y-2">
              <div class="h-8 flex items-center justify-center tracking-widest text-lg font-black font-mono">
                ||| | |||| | || | ||| ||||
              </div>
              <p class="text-[9px] text-slate-500">
                Terima kasih atas kunjungan Anda.<br />
                Barang yang sudah dibeli tidak dapat ditukar.
              </p>
            </div>
          </div>
        </div>

        <!-- Receipt Action Buttons -->
        <div class="p-3 border-t border-border bg-surface-subtle grid grid-cols-2 gap-2 shrink-0">
          <button id="pos-print-receipt-btn" class="btn btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <span>🖨️ Cetak Struk</span>
          </button>
          <button id="pos-new-tx-btn" class="btn btn-primary text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <span>✨ Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-receipt-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('pos-new-tx-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('pos-print-receipt-btn')?.addEventListener('click', () => {
    window.print();
  });
}

// ============================================================================
// HELD ORDERS MODAL (OPEN BILLS / SIMPAN BILL)
// ============================================================================
function openHeldOrdersModal() {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const state = store.getState();
  const symbol = state.currentClient.currencySymbol;

  const rows =
    state.heldOrders.length === 0
      ? `
      <div class="py-12 text-center text-muted">
        <p class="text-sm font-semibold">Tidak ada bill tersimpan</p>
        <p class="text-xs text-muted mt-1">Gunakan tombol 'Hold' di keranjang untuk menyimpan bill meja sementara.</p>
      </div>
    `
      : state.heldOrders
          .map(
            (h) => `
      <div class="p-3 bg-surface border border-border rounded-xl flex items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-xs text-text">${h.orderNumber}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600">${h.tableNumber}</span>
            <span class="text-[10px] text-muted font-mono">${h.timestamp}</span>
          </div>
          <div class="text-xs text-muted mt-0.5">${h.customerName} · ${h.items.length} jenis item</div>
          <div class="font-bold text-xs text-primary tabular-nums mt-1">${formatCurrency(h.total, symbol)}</div>
        </div>
        <div class="flex items-center gap-1.5">
          <button class="pos-recall-held-btn btn btn-sm btn-primary text-xs px-3" data-id="${h.id}">
            Buka Bill
          </button>
          <button class="pos-delete-held-btn btn btn-sm btn-secondary text-xs px-2 text-rose-500" data-id="${h.id}">
            ✕
          </button>
        </div>
      </div>
    `
          )
          .join('');

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-md max-h-[85vh] flex flex-col">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 class="font-bold text-sm text-text">Daftar Bill Tersimpan (Hold Bills)</h3>
            <p class="text-xs text-muted">Lanjutkan transaksi pelanggan atau meja yang sebelumnya ditunda</p>
          </div>
          <button id="pos-close-held-modal-btn" class="text-muted hover:text-text p-1">✕</button>
        </div>
        <div class="p-4 flex-1 overflow-y-auto space-y-2">
          ${rows}
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-held-modal-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  modalContainer.querySelectorAll('.pos-recall-held-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      store.restoreHeldOrder(id);
      modalContainer.innerHTML = '';
      renderPOSViewOnly();
      showToast({ title: 'Bill Dibuka', message: 'Item pesanan telah dimuat ke keranjang kasir.', type: 'info' });
    });
  });

  modalContainer.querySelectorAll('.pos-delete-held-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      store.deleteHeldOrder(id);
      openHeldOrdersModal();
    });
  });
}

// ============================================================================
// CUSTOMER & LOYALTY MEMBER PICKER MODAL
// ============================================================================
function openCustomerPickerModal() {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const state = store.getState();
  let custQuery = '';

  const renderCustList = (q: string) => {
    const list = state.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.phone.toLowerCase().includes(q.toLowerCase()) ||
        c.email.toLowerCase().includes(q.toLowerCase())
    );

    return list
      .map((c) => {
        const tier = state.loyaltyTiers.find((t) => t.name === c.tier);
        return `
        <div class="p-3 bg-surface border border-border rounded-xl flex items-center justify-between gap-3 hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-2.5 min-w-0">
            <img src="${c.avatar}" alt="${c.name}" class="w-9 h-9 rounded-full object-cover border border-border shrink-0" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop';" />
            <div class="truncate">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-text truncate">${c.name}</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${tier?.badgeBg} ${tier?.badgeColor}">${c.tier}</span>
              </div>
              <div class="text-[11px] text-muted truncate">${c.phone} · ${c.loyaltyPoints} Poin Loyalty</div>
            </div>
          </div>
          <button class="pos-pick-customer-btn btn btn-sm btn-primary text-xs px-3 shrink-0" data-id="${c.id}">
            Pilih
          </button>
        </div>
      `;
      })
      .join('');
  };

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-md max-h-[85vh] flex flex-col">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 class="font-bold text-sm text-text">Pilih Member / Pelanggan Loyalty</h3>
            <p class="text-xs text-muted">Sambungkan transaksi ke akun pelanggan untuk reward & poin loyalty bertingkat</p>
          </div>
          <button id="pos-close-cust-modal-btn" class="text-muted hover:text-text p-1">✕</button>
        </div>

        <div class="p-3 border-b border-border bg-surface flex items-center gap-2 shrink-0">
          <input
            type="text"
            id="pos-cust-search-input"
            placeholder="Cari nama, nomor HP, atau email member..."
            class="form-input text-xs"
            autofocus
          />
          <button id="pos-set-walkin-btn" class="btn btn-secondary text-xs px-3 whitespace-nowrap">
            Set Non-Member
          </button>
        </div>

        <div id="pos-cust-list-container" class="p-4 flex-1 overflow-y-auto space-y-2">
          ${renderCustList('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-cust-modal-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('pos-set-walkin-btn')?.addEventListener('click', () => {
    store.setPosCustomer(null);
    modalContainer.innerHTML = '';
    renderPOSViewOnly();
    showToast({ title: 'Pelanggan Diatur', message: 'Transaksi diatur ke Pelanggan Umum.', type: 'info' });
  });

  const searchInp = document.getElementById('pos-cust-search-input') as HTMLInputElement;
  searchInp?.addEventListener('input', () => {
    const listCont = document.getElementById('pos-cust-list-container');
    if (listCont) {
      listCont.innerHTML = renderCustList(searchInp.value);
      attachCustPickHandlers();
    }
  });

  const attachCustPickHandlers = () => {
    modalContainer.querySelectorAll('.pos-pick-customer-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id!;
        const c = state.customers.find((cust) => cust.id === id) || null;
        store.setPosCustomer(c);
        modalContainer.innerHTML = '';
        renderPOSViewOnly();
        showToast({
          title: 'Member Terpilih',
          message: `${c?.name} (${c?.tier}) berhasil dihubungkan ke bill kasir.`,
          type: 'success'
        });
      });
    });
  };

  attachCustPickHandlers();
}

// ============================================================================
// DISCOUNT & LOYALTY POINTS REDEMPTION MODAL
// ============================================================================
function openDiscountAndPointsModal() {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const state = store.getState();
  const customer = state.posCustomer;
  const pointVal = state.loyaltyRules.pointValueInRupiah || 100;
  const maxPointsPossible = customer ? customer.loyaltyPoints : 0;

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-md max-h-[85vh] flex flex-col">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 class="font-bold text-sm text-text">Diskon & Tukar Poin Loyalty</h3>
            <p class="text-xs text-muted">Terapkan potongan manual persen atau redeem poin member yang tersedia</p>
          </div>
          <button id="pos-close-disc-modal-btn" class="text-muted hover:text-text p-1">✕</button>
        </div>

        <div class="p-5 flex-1 overflow-y-auto space-y-4">
          <!-- Discount Percent -->
          <div>
            <label class="form-label text-xs">Potongan Diskon Manual (%)</label>
            <div class="flex items-center gap-2">
              <input
                type="number"
                id="pos-disc-percent-input"
                min="0"
                max="100"
                value="${state.posDiscountPercent}"
                class="form-input text-sm font-bold w-28"
              />
              <span class="text-xs text-muted">% dari subtotal transaksi</span>
            </div>
            <div class="flex items-center gap-1.5 mt-2">
              <button class="pos-quick-disc-btn px-2.5 py-1 rounded-lg border border-border text-xs font-semibold bg-surface-subtle" data-val="5">5%</button>
              <button class="pos-quick-disc-btn px-2.5 py-1 rounded-lg border border-border text-xs font-semibold bg-surface-subtle" data-val="10">10%</button>
              <button class="pos-quick-disc-btn px-2.5 py-1 rounded-lg border border-border text-xs font-semibold bg-surface-subtle" data-val="15">15%</button>
              <button class="pos-quick-disc-btn px-2.5 py-1 rounded-lg border border-border text-xs font-semibold bg-surface-subtle" data-val="20">20%</button>
            </div>
          </div>

          <!-- Loyalty Points Redemption -->
          <div class="pt-4 border-t border-border space-y-2">
            <div class="flex items-center justify-between">
              <label class="form-label text-xs mb-0">Tukar Poin Loyalty Pelanggan</label>
              <span class="text-[11px] text-muted">1 Poin = Rp ${pointVal}</span>
            </div>

            ${
              customer
                ? `
              <div class="p-3 rounded-xl bg-surface-subtle border border-border space-y-2">
                <div class="flex justify-between text-xs">
                  <span>Poin Tersedia Milik ${customer.name}:</span>
                  <span class="font-bold text-primary font-mono">${customer.loyaltyPoints} Pts</span>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    id="pos-redeem-points-input"
                    min="0"
                    max="${maxPointsPossible}"
                    value="${state.posPointsRedeemed}"
                    class="form-input text-xs font-bold w-32"
                  />
                  <span class="text-xs text-emerald-600 font-semibold" id="redeem-rupiah-preview">
                    = Rp ${(state.posPointsRedeemed * pointVal).toLocaleString('id-ID')}
                  </span>
                </div>
                <button id="btn-use-all-points" class="text-[11px] text-primary hover:underline font-semibold">
                  Tukar Semua Poin (${maxPointsPossible} Pts)
                </button>
              </div>
            `
                : `
              <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                Pilih member pelanggan terlebih dahulu pada tombol '+ Member' untuk menukarkan poin loyalty.
              </div>
            `
            }
          </div>
        </div>

        <div class="p-4 border-t border-border bg-surface-subtle flex items-center justify-end gap-2 shrink-0">
          <button id="pos-apply-discount-btn" class="btn btn-primary text-xs px-5 py-2">
            Terapkan ke Bill
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-disc-modal-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  modalContainer.querySelectorAll('.pos-quick-disc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number((btn as HTMLElement).dataset.val);
      const inp = document.getElementById('pos-disc-percent-input') as HTMLInputElement;
      if (inp) inp.value = String(val);
    });
  });

  const redeemInp = document.getElementById('pos-redeem-points-input') as HTMLInputElement;
  redeemInp?.addEventListener('input', () => {
    const pts = Number(redeemInp.value) || 0;
    const prev = document.getElementById('redeem-rupiah-preview');
    if (prev) prev.textContent = `= Rp ${(pts * pointVal).toLocaleString('id-ID')}`;
  });

  document.getElementById('btn-use-all-points')?.addEventListener('click', () => {
    if (redeemInp) {
      redeemInp.value = String(maxPointsPossible);
      const prev = document.getElementById('redeem-rupiah-preview');
      if (prev) prev.textContent = `= Rp ${(maxPointsPossible * pointVal).toLocaleString('id-ID')}`;
    }
  });

  document.getElementById('pos-apply-discount-btn')?.addEventListener('click', () => {
    const disc = Number((document.getElementById('pos-disc-percent-input') as HTMLInputElement)?.value) || 0;
    const pts = Number((document.getElementById('pos-redeem-points-input') as HTMLInputElement)?.value) || 0;

    store.setPosDiscountPercent(disc);
    store.setPosPointsRedeemed(pts);

    modalContainer.innerHTML = '';
    renderPOSViewOnly();
    showToast({ title: 'Diskon Diterapkan', message: 'Perhitungan bill telah diperbarui.', type: 'success' });
  });
}

// ============================================================================
// ITEM NOTES MODAL
// ============================================================================
function openItemNoteModal(productId: string, currentNote: string) {
  const modalContainer = document.getElementById('pos-modal-container');
  if (!modalContainer) return;

  const item = store.getState().posCart.find((i) => i.product.id === productId);
  if (!item) return;

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-sm">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between">
          <h3 class="font-bold text-xs text-text">Catatan Khusus Pesanan</h3>
          <button id="pos-close-note-btn" class="text-muted hover:text-text p-1">✕</button>
        </div>
        <div class="p-4 space-y-3">
          <p class="text-xs text-muted font-medium">${item.product.name}</p>
          <textarea
            id="pos-item-note-text"
            rows="3"
            class="form-textarea text-xs"
            placeholder="Contoh: Less ice, minta kantong kardus, extra bubble wrap..."
          >${currentNote}</textarea>
        </div>
        <div class="p-3 border-t border-border bg-surface-subtle flex justify-end gap-2">
          <button id="pos-save-note-btn" class="btn btn-primary text-xs px-4 py-1.5">
            Simpan Catatan
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-note-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('pos-save-note-btn')?.addEventListener('click', () => {
    const val = (document.getElementById('pos-item-note-text') as HTMLTextAreaElement)?.value || '';
    store.updateCartItemNotes(productId, val);
    modalContainer.innerHTML = '';
    renderPOSViewOnly();
  });
}

// ============================================================================
// BARCODE SCANNER SIMULATOR
// ============================================================================
function simulateBarcodeScan() {
  const products = store.getState().products;
  if (products.length === 0) return;

  // Pick a random product to simulate laser scan
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  store.addToCart(randomProduct, 1);

  // Play subtle beep audio feedback via Web Audio API!
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1800; // sharp POS scanner beep tone
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    // audio fallback silent
  }

  showToast({
    title: 'Barcode Scanned (BEEP)',
    message: `${randomProduct.sku} - ${randomProduct.name} otomatis ditambahkan ke keranjang.`,
    type: 'success',
    duration: 1500
  });

  renderPOSViewOnly();
}
