/**
 * AuraMaster Admin Users & RBAC Permissions Matrix
 * Manage staff accounts and configure granular permission access by role.
 */
import { store } from '../utils/store';
import { showToast } from '../utils/toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'Order Manager' | 'Content Manager';
  status: 'Active' | 'Suspended';
  twoFactor: boolean;
  lastLogin: string;
}

const ADMIN_USERS: AdminUser[] = [
  { id: 'usr-1', name: 'dr. Amalia Putri, Sp.KK', email: 'amalia.putri@auraglow.id', role: 'Super Admin', status: 'Active', twoFactor: true, lastLogin: '2026-10-02 21:05' },
  { id: 'usr-2', name: 'Fauzan Aditama', email: 'fauzan.logistics@auraglow.id', role: 'Order Manager', status: 'Active', twoFactor: true, lastLogin: '2026-10-02 18:22' },
  { id: 'usr-3', name: 'Nathania Editorial', email: 'nathania.copy@auraglow.id', role: 'Content Manager', status: 'Active', twoFactor: false, lastLogin: '2026-10-01 11:40' },
  { id: 'usr-4', name: 'Bambang Financial', email: 'finance@auraglow.id', role: 'Admin', status: 'Active', twoFactor: true, lastLogin: '2026-10-02 15:10' }
];

export function renderUsersRolesView(): string {
  const usersRowsHtml = ADMIN_USERS.map((u) => `
    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      <td>
        <div class="font-bold text-xs text-slate-900 dark:text-white">${u.name}</div>
        <div class="text-[11px] text-slate-400 font-mono">${u.email}</div>
      </td>
      <td>
        <span class="px-2 py-0.5 rounded text-[11px] font-bold ${
          u.role === 'Super Admin' ? 'bg-primary-light text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
        }">
          ${u.role}
        </span>
      </td>
      <td>
        <span class="badge badge-success">
          <span class="badge-dot"></span>
          ${u.status}
        </span>
      </td>
      <td>
        <span class="text-xs ${u.twoFactor ? 'text-emerald-600 font-semibold' : 'text-slate-400'}">
          ${u.twoFactor ? '✓ Enabled' : 'Disabled'}
        </span>
      </td>
      <td class="tabular-nums font-mono text-xs text-slate-500">${u.lastLogin}</td>
      <td class="text-right">
        <button class="btn btn-secondary btn-sm py-1 px-2 text-xs">Edit Access</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="space-y-8">
      <!-- Section 1: Users List -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">Admin Users & Access Control</h1>
            <p class="text-xs text-slate-500">Manage internal teammates, 2FA credentials, and system login privileges</p>
          </div>
          <button id="btn-invite-admin" class="btn btn-primary btn-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            <span>+ Invite Admin</span>
          </button>
        </div>

        <div class="card overflow-hidden">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>2FA Status</th>
                  <th>Last Active</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${usersRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 2: Role-Based Access Control (RBAC) Matrix -->
      <div class="space-y-4">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Matrix</h2>
          <p class="text-xs text-slate-500">Granular module permissions per user role</p>
        </div>

        <div class="card overflow-hidden">
          <div class="table-container">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Permission Scope</th>
                  <th class="text-center">Super Admin</th>
                  <th class="text-center">Admin</th>
                  <th class="text-center">Order Manager</th>
                  <th class="text-center">Content Manager</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td class="font-medium">Dashboard Analytics</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-400">View Only</td>
                  <td class="text-center text-slate-400">View Only</td>
                </tr>
                <tr>
                  <td class="font-medium">Products & Inventory</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Edit Stock</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
                <tr>
                  <td class="font-medium">Orders & Fulfillment</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
                <tr>
                  <td class="font-medium">Customers & Loyalty</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-400">View Only</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
                <tr>
                  <td class="font-medium">Blog & Articles CMS</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                </tr>
                <tr>
                  <td class="font-medium">Financial Reports & P&L</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-400">View Only</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
                <tr>
                  <td class="font-medium">Database Backup & Recovery</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
                <tr>
                  <td class="font-medium">Website Settings & API Keys</td>
                  <td class="text-center font-bold text-emerald-600">✓ Full</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                  <td class="text-center text-slate-300 dark:text-slate-600">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initUsersRolesEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-invite-admin')?.addEventListener('click', () => {
    showToast({ title: 'Invite Modal', message: 'Ready to send activation email invite.', type: 'info' });
  });
}
