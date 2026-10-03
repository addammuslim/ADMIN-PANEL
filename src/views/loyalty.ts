/**
 * AuraMaster Tiered Loyalty & Rewards Management Program
 * Enterprise multi-tier membership system with points engine,
 * tier criteria, multipliers, redeemable vouchers, and member ranking.
 */
import { store } from '../utils/store';
import { Customer, LoyaltyTier, LoyaltyReward } from '../data/mockData';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { showToast } from '../utils/toast';

let selectedTierFilter: string = 'All';
let memberSearchQuery: string = '';

export function renderLoyaltyView(): string {
  const state = store.getState();
  const client = state.currentClient;
  const symbol = client.currencySymbol;
  const tiers = state.loyaltyTiers;
  const rewards = state.loyaltyRewards;
  const customers = state.customers;

  // Filter customers by tier & search
  const filteredMembers = customers.filter((c) => {
    const matchTier = selectedTierFilter === 'All' || c.tier === selectedTierFilter;
    const matchSearch =
      !memberSearchQuery ||
      c.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(memberSearchQuery.toLowerCase());
    return matchTier && matchSearch;
  });

  // Calculate totals
  const totalPointsInCirculation = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const totalPointsValueRp = totalPointsInCirculation * (state.loyaltyRules.pointValueInRupiah || 100);
  const totalRewardsClaimed = rewards.reduce((sum, r) => sum + r.claimedCount, 0);

  // Render 4 Tier Cards
  const tierCardsHtml = tiers
    .map((tier) => {
      const tierIcons: Record<string, string> = {
        Bronze: '🥉',
        Silver: '🥈',
        Gold: '🥇',
        Platinum: '💎'
      };

      const membersInTier = customers.filter((c) => c.tier === tier.name).length;
      const pctMembers = Math.round((membersInTier / customers.length) * 100);

      return `
      <div class="card p-5 flex flex-col justify-between border-2 ${tier.borderClass} relative overflow-hidden transition-all hover:shadow-lg">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${tierIcons[tier.name] || '⭐'}</span>
            <div>
              <div class="flex items-center gap-1.5">
                <h4 class="font-extrabold text-sm text-text">${tier.name}</h4>
                <span class="px-2 py-0.2 rounded-full text-[10px] font-bold ${tier.badgeBg} ${tier.badgeColor}">
                  ${tier.multiplier}x Poin
                </span>
              </div>
              <span class="text-[11px] text-muted font-medium">Min Belanja: ${tier.minSpend === 0 ? 'Gratis (Baru)' : formatCurrency(tier.minSpend, symbol)}</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-muted leading-relaxed mb-4">${tier.description}</p>

        <!-- Perks list -->
        <div class="space-y-1.5 text-xs py-3 border-t border-border flex-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Keuntungan Tier:</span>
          ${tier.perks
            .map(
              (p) => `
            <div class="flex items-start gap-1.5 text-[11px] text-text">
              <span class="text-emerald-500 font-bold shrink-0">✓</span>
              <span class="leading-tight">${p}</span>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Member count progress -->
        <div class="pt-3 border-t border-border mt-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-muted font-medium">Populasi Member</span>
            <span class="font-bold text-text tabular-nums">${membersInTier} Member (${pctMembers}%)</span>
          </div>
          <div class="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border">
            <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: ${pctMembers}%;"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  // Render Rewards Catalog
  const rewardsHtml = rewards
    .map(
      (r) => `
    <div class="p-4 bg-surface border border-border rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors shadow-2xs">
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
            r.category === 'voucher'
              ? 'bg-emerald-500/10 text-emerald-600'
              : r.category === 'product'
              ? 'bg-blue-500/10 text-blue-600'
              : 'bg-violet-500/10 text-violet-600'
          }">
            ${r.category.toUpperCase()}
          </span>
          <span class="font-mono font-bold text-primary text-xs">
            ${r.pointsCost} Pts
          </span>
        </div>
        <h5 class="font-bold text-xs text-text mb-1">${r.title}</h5>
        <p class="text-[11px] text-muted line-clamp-2 leading-relaxed">${r.description}</p>
      </div>

      <div class="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px]">
        <span class="text-muted">Klaim: <strong class="text-text font-mono">${r.claimedCount}x</strong></span>
        <span class="text-muted">Stok: <strong class="text-text font-mono">${r.stock}</strong></span>
      </div>
    </div>
  `
    )
    .join('');

  // Render Members Table Rows
  const membersRowsHtml =
    filteredMembers.length === 0
      ? `
      <tr>
        <td colspan="6" class="text-center py-10 text-muted">
          Tidak ada member ditemukan dengan filter ini.
        </td>
      </tr>
    `
      : filteredMembers
          .map((m) => {
            const tierObj = tiers.find((t) => t.name === m.tier);

            // Calculate progress to next tier
            let nextTierText = 'Maksimum (VIP Platinum)';
            let nextTierTarget = 15000000;
            let progressPct = 100;

            if (m.tier === 'Bronze') {
              nextTierTarget = 1000000;
              nextTierText = 'Silver (Rp 1.000.000)';
              progressPct = Math.min(100, Math.round((m.totalSpending / nextTierTarget) * 100));
            } else if (m.tier === 'Silver') {
              nextTierTarget = 5000000;
              nextTierText = 'Gold (Rp 5.000.000)';
              progressPct = Math.min(100, Math.round((m.totalSpending / nextTierTarget) * 100));
            } else if (m.tier === 'Gold') {
              nextTierTarget = 15000000;
              nextTierText = 'Platinum (Rp 15.000.000)';
              progressPct = Math.min(100, Math.round((m.totalSpending / nextTierTarget) * 100));
            }

            return `
        <tr class="hover:bg-surface-hover transition-colors">
          <td>
            <div class="flex items-center gap-2.5">
              <img
                src="${m.avatar}"
                alt="${m.name}"
                class="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop';"
              />
              <div class="truncate max-w-[180px]">
                <div class="font-bold text-xs text-text truncate">${m.name}</div>
                <div class="text-[11px] text-muted truncate">${m.phone} · ${m.email}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${tierObj?.badgeBg} ${tierObj?.badgeColor}">
              ${m.tier}
            </span>
          </td>
          <td>
            <div class="font-black text-xs text-primary tabular-nums font-mono">${formatNumber(m.loyaltyPoints)} Pts</div>
            <div class="text-[10px] text-muted">≈ ${formatCurrency(m.loyaltyPoints * 100, symbol)}</div>
          </td>
          <td class="tabular-nums font-bold text-xs text-text">
            ${formatCurrency(m.totalSpending, symbol)}
            <div class="text-[10px] text-muted font-normal">${m.ordersCount}x order</div>
          </td>
          <td>
            <div class="w-36 space-y-1">
              <div class="flex justify-between text-[10px] text-muted">
                <span>Ke ${nextTierText.split(' ')[0]}</span>
                <span>${progressPct}%</span>
              </div>
              <div class="w-full bg-surface-subtle border border-border h-1.5 rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width: ${progressPct}%;"></div>
              </div>
            </div>
          </td>
          <td class="text-right">
            <button
              class="loyalty-adjust-btn btn btn-sm btn-secondary text-xs px-2.5 py-1 text-primary hover:text-primary-hover"
              data-id="${m.id}"
              data-name="${m.name}"
              data-points="${m.loyaltyPoints}"
            >
              ± Poin
            </button>
          </td>
        </tr>
      `;
          })
          .join('');

  return `
    <div class="space-y-6">
      <!-- Loyalty Header Banner -->
      <div class="bg-gradient-to-r from-violet-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-violet-900/40 relative overflow-hidden">
        <div class="relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium mb-3 backdrop-blur-xs border border-violet-500/30">
            <span>💎 Enterprise Tiered Loyalty Program</span>
            <span>·</span>
            <span>Integrated with Moka POS</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">Program Loyalty & Reward Bertingkat</h1>
          <p class="text-slate-300 text-xs sm:text-sm mt-1">Tingkatkan retensi pelanggan dengan sistem multi-tier otomatis. Poin dapat dikumpulkan di kasir POS maupun web dan ditukarkan langsung.</p>
        </div>

        <div class="relative z-10 flex flex-wrap items-center gap-3">
          <button class="nav-link-btn btn btn-sm btn-primary shadow-md flex items-center gap-1.5" data-view="pos">
            <span>Buka Moka POS Kasir</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- 4 Core Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">Total Member Terdaftar</span>
          <div class="text-xl font-bold text-text tabular-nums">${customers.length} Member</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1">100% Akun Aktif Berpoin</div>
        </div>

        <div class="card p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">Poin Beredar (Circulation)</span>
          <div class="text-xl font-bold text-primary tabular-nums font-mono">${formatNumber(totalPointsInCirculation)} Pts</div>
          <div class="text-[11px] text-muted mt-1">Nilai Rupiah: ${formatCurrency(totalPointsValueRp, symbol)}</div>
        </div>

        <div class="card p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">Total Reward Diklaim</span>
          <div class="text-xl font-bold text-text tabular-nums font-mono">${totalRewardsClaimed}x Voucher</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1">Tingkat Penukaran Tinggi</div>
        </div>

        <div class="card p-5">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">Aturan Default Kasir</span>
          <div class="text-sm font-bold text-text">Rp 10.000 = 1 Pts</div>
          <div class="text-[11px] text-muted mt-1">1 Pts = Rp 100 potongan struk</div>
        </div>
      </div>

      <!-- 4 Tier Level Cards Grid -->
      <div>
        <div class="mb-3">
          <h3 class="font-bold text-sm text-text">Struktur 4 Level Tier Membership</h3>
          <p class="text-xs text-muted">Syarat kenaikan tingkat akumulatif dan benefit multiplier poin untuk masing-masing tier</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          ${tierCardsHtml}
        </div>
      </div>

      <!-- Redeemable Rewards Catalog -->
      <div class="card">
        <div class="card-header flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm text-text">Katalog Reward & Voucher Penukaran Poin</h3>
            <p class="text-xs text-muted">Voucher yang dapat ditukarkan pelanggan secara mandiri atau via kasir POS</p>
          </div>
          <button id="btn-add-loyalty-reward" class="btn btn-sm btn-secondary text-xs">
            + Tambah Reward
          </button>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            ${rewardsHtml}
          </div>
        </div>
      </div>

      <!-- Member Directory Table -->
      <div class="card">
        <div class="card-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-sm text-text">Daftar Anggota Loyalty & Progress Tier</h3>
            <p class="text-xs text-muted">Kelola poin pelanggan, sesuaikan saldo poin manual, dan pantau kemajuan tier</p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex items-center gap-2">
            <input
              type="text"
              id="loyalty-search-member"
              value="${memberSearchQuery}"
              placeholder="Cari nama atau telepon..."
              class="form-input text-xs w-48 sm:w-56"
            />
            <select id="loyalty-tier-filter" class="form-select text-xs w-32">
              <option value="All" ${selectedTierFilter === 'All' ? 'selected' : ''}>Semua Tier</option>
              <option value="Platinum" ${selectedTierFilter === 'Platinum' ? 'selected' : ''}>Platinum</option>
              <option value="Gold" ${selectedTierFilter === 'Gold' ? 'selected' : ''}>Gold</option>
              <option value="Silver" ${selectedTierFilter === 'Silver' ? 'selected' : ''}>Silver</option>
              <option value="Bronze" ${selectedTierFilter === 'Bronze' ? 'selected' : ''}>Bronze</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Tier</th>
                <th>Saldo Poin</th>
                <th>Total Belanja</th>
                <th>Progress Tier Berikutnya</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${membersRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Adjust Points Modal Container -->
      <div id="loyalty-modal-container"></div>
    </div>
  `;
}

export function initLoyaltyEventListeners() {
  // Search input
  const searchInp = document.getElementById('loyalty-search-member') as HTMLInputElement;
  searchInp?.addEventListener('input', () => {
    memberSearchQuery = searchInp.value;
    refreshLoyaltyView();
  });

  // Tier filter
  const tierFilter = document.getElementById('loyalty-tier-filter') as HTMLSelectElement;
  tierFilter?.addEventListener('change', () => {
    selectedTierFilter = tierFilter.value;
    refreshLoyaltyView();
  });

  // Adjust points button
  document.querySelectorAll('.loyalty-adjust-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const name = (btn as HTMLElement).dataset.name!;
      const points = (btn as HTMLElement).dataset.points!;
      openAdjustPointsModal(id, name, Number(points));
    });
  });

  // Add reward modal simulation
  document.getElementById('btn-add-loyalty-reward')?.addEventListener('click', () => {
    const title = prompt('Masukkan Nama Voucher / Reward Baru:');
    if (title) {
      const cost = Number(prompt('Biaya Poin Penukaran (contoh: 300):')) || 250;
      const discount = Number(prompt('Nominal Potongan Rupiah (contoh: 25000):')) || 25000;
      const newReward: LoyaltyReward = {
        id: 'rew-' + Date.now(),
        title,
        pointsCost: cost,
        category: 'voucher',
        discountAmount: discount,
        description: `Voucher diskon senilai Rp ${discount.toLocaleString('id-ID')} untuk penukaran ${cost} poin.`,
        claimedCount: 0,
        stock: 100,
        active: true
      };
      store.setState({ loyaltyRewards: [newReward, ...store.getState().loyaltyRewards] });
      showToast({ title: 'Reward Ditambahkan', message: `Reward "${title}" siap ditukarkan member.`, type: 'success' });
      refreshLoyaltyView();
    }
  });
}

function refreshLoyaltyView() {
  const container = document.getElementById('app-main-content');
  if (container) {
    container.innerHTML = renderLoyaltyView();
    initLoyaltyEventListeners();
  }
}

function openAdjustPointsModal(customerId: string, customerName: string, currentPoints: number) {
  const modalContainer = document.getElementById('loyalty-modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-dialog modal-sm">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between">
          <h3 class="font-bold text-xs text-text">Penyesuaian Manual Poin Loyalty</h3>
          <button id="pos-close-adjust-btn" class="text-muted hover:text-text p-1">✕</button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <span class="text-xs text-muted block">Pelanggan:</span>
            <span class="font-bold text-xs text-text">${customerName}</span>
            <span class="text-xs text-muted font-mono block">Saldo Saat Ini: <strong>${currentPoints} Pts</strong></span>
          </div>

          <div>
            <label class="form-label text-xs">Jumlah Perubahan Poin</label>
            <input
              type="number"
              id="adjust-points-delta"
              placeholder="Contoh: 100 untuk tambah, -50 untuk kurangi"
              class="form-input text-xs font-bold"
            />
          </div>

          <div>
            <label class="form-label text-xs">Alasan Penyesuaian</label>
            <input
              type="text"
              id="adjust-points-reason"
              placeholder="Contoh: Bonus Event Khusus / Koreksi Transaksi Kasir"
              class="form-input text-xs"
              value="Penyesuaian Admin"
            />
          </div>
        </div>
        <div class="p-3 border-t border-border bg-surface-subtle flex justify-end gap-2">
          <button id="btn-submit-adjust-points" class="btn btn-primary text-xs px-4 py-1.5">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pos-close-adjust-btn')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('btn-submit-adjust-points')?.addEventListener('click', () => {
    const delta = Number((document.getElementById('adjust-points-delta') as HTMLInputElement)?.value);
    const reason = (document.getElementById('adjust-points-reason') as HTMLInputElement)?.value || 'Admin Adjustment';

    if (isNaN(delta) || delta === 0) {
      alert('Masukkan jumlah poin yang valid (tidak boleh 0).');
      return;
    }

    store.adjustCustomerPoints(customerId, delta, reason);
    modalContainer.innerHTML = '';
    showToast({
      title: 'Poin Diperbarui',
      message: `${delta > 0 ? '+' : ''}${delta} poin berhasil disesuaikan untuk ${customerName}.`,
      type: 'success'
    });
    refreshLoyaltyView();
  });
}
