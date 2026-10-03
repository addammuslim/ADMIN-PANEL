/**
 * AuraMaster Database Backup & Restore View
 * UI manager for MySQLi dump generation, automated schedules, and restore confirmation.
 */
import { store } from '../utils/store';
import { BackupHistory } from '../data/mockData';
import { showToast } from '../utils/toast';
import { openModal, closeModal, confirmAction } from '../utils/modal';

export function renderBackupView(): string {
  const state = store.getState();

  const rowsHtml = state.backups.map((bk) => `
    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      <td>
        <div class="font-mono font-bold text-xs text-slate-900 dark:text-white">${bk.filename}</div>
        <div class="text-[11px] text-slate-400">${bk.tablesCount} relational tables · ${bk.type}</div>
      </td>
      <td class="tabular-nums text-xs text-slate-500 font-mono">${bk.date}</td>
      <td class="tabular-nums text-xs font-semibold text-slate-800 dark:text-slate-200">${bk.size}</td>
      <td>
        <span class="badge ${bk.status === 'Completed' ? 'badge-success' : 'badge-warning'}">
          <span class="badge-dot"></span>
          ${bk.status}
        </span>
      </td>
      <td class="text-right">
        <div class="flex items-center justify-end gap-2">
          <button class="btn-download-bk btn btn-secondary btn-sm py-1 px-2 text-xs" data-file="${bk.filename}" title="Download SQL Dump">
            Download
          </button>
          <button class="btn-restore-bk btn btn-secondary btn-sm py-1 px-2 text-xs text-amber-600 hover:text-amber-700" data-id="${bk.id}" title="Restore Database">
            Restore
          </button>
          <button class="btn-delete-bk text-slate-400 hover:text-rose-600 p-1" data-id="${bk.id}" title="Delete archive">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Database Backup & Disaster Recovery</h1>
          <p class="text-xs text-slate-500">Scheduled MySQLi snapshot generation, retention rules, and point-in-time restoration</p>
        </div>
        <button id="btn-create-backup-now" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>Create Backup Now</span>
        </button>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Last Snapshot</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1">2026-10-02 02:00</div>
          <div class="text-[10px] text-emerald-600 font-medium">Automatic cron success</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Database Size</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1">18.4 MB (GZipped)</div>
          <div class="text-[10px] text-slate-400">28 tables indexed</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Backup Cadence</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white mt-1">Daily at 02:00 WIB</div>
          <div class="text-[10px] text-slate-400">Cron automated</div>
        </div>
        <div class="card p-4">
          <div class="text-[11px] font-semibold text-slate-400 uppercase">Retention Policy</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white mt-1">30 Days Rolling</div>
          <div class="text-[10px] text-slate-400">Auto-prune expired archives</div>
        </div>
      </div>

      <!-- Backups Table -->
      <div class="card overflow-hidden">
        <div class="card-header">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Archive History & Restore Points</h2>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Backup Archive Name</th>
                <th>Created Timestamp</th>
                <th>File Size</th>
                <th>Integrity Status</th>
                <th class="text-right">Actions</th>
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

export function initBackupEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  // Create backup now button
  container.querySelector('#btn-create-backup-now')?.addEventListener('click', () => {
    showToast({ title: 'Backup Initiated', message: 'Triggering mysqldump process on server...', type: 'info' });

    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const newBackup: BackupHistory = {
        id: `bk-${Date.now()}`,
        filename: `auramaster_backup_${timestamp}.sql.gz`,
        date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
        size: '18.6 MB',
        tablesCount: 28,
        status: 'Completed',
        type: 'Manual'
      };
      store.setState({ backups: [newBackup, ...store.getState().backups] });
      showToast({ title: 'Database Backup Ready', message: `Archive ${newBackup.filename} completed.`, type: 'success' });
      store.navigate('backup');
    }, 1200);
  });

  // Download SQL
  container.querySelectorAll('.btn-download-bk').forEach((btn) => {
    btn.addEventListener('click', () => {
      const file = (btn as HTMLElement).dataset.file!;
      showToast({ title: 'Downloading Dump', message: `Preparing ${file}...`, type: 'info' });
    });
  });

  // Restore confirmation modal
  container.querySelectorAll('.btn-restore-bk').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const bk = store.getState().backups.find((b) => b.id === id);
      confirmAction({
        title: 'Confirm Database Restoration',
        message: `WARNING: Restoring "${bk?.filename}" will overwrite all current database tables with data from ${bk?.date}. Are you absolutely sure?`,
        confirmText: 'Restore Database',
        isDanger: true,
        onConfirm: () => {
          showToast({ title: 'Restoration Completed', message: 'Database schema and records restored successfully.', type: 'success' });
        }
      });
    });
  });

  // Delete backup
  container.querySelectorAll('.btn-delete-bk').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      confirmAction({
        title: 'Delete Backup File',
        message: 'Are you sure you want to permanently delete this backup archive?',
        confirmText: 'Delete',
        isDanger: true,
        onConfirm: () => {
          store.setState({ backups: store.getState().backups.filter((b) => b.id !== id) });
          showToast({ title: 'Backup Archive Deleted', message: 'File removed from storage.', type: 'success' });
          store.navigate('backup');
        }
      });
    });
  });
}
