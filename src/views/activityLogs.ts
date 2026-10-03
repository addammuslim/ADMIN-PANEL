/**
 * AuraMaster Activity Logs & Audit Trail View
 * Tracks administrative actions: logins, product edits, setting updates, backups.
 */
import { store } from '../utils/store';

export function renderActivityLogsView(): string {
  const state = store.getState();

  const rowsHtml = state.logs.map((log) => {
    const statusBadges: Record<string, string> = {
      Success: 'badge-success',
      Warning: 'badge-warning',
      Failed: 'badge-danger'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td class="font-bold text-xs text-slate-900 dark:text-white">${log.user}</td>
        <td class="text-xs text-slate-700 dark:text-slate-300 font-medium">${log.action}</td>
        <td>
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ${log.module}
          </span>
        </td>
        <td class="font-mono text-xs text-slate-500">${log.ip}</td>
        <td class="font-mono text-xs text-slate-400 tabular-nums">${log.date}</td>
        <td class="text-right">
          <span class="badge ${statusBadges[log.status]}">
            <span class="badge-dot"></span>
            ${log.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Security & Activity Audit Logs</h1>
          <p class="text-xs text-slate-500">Immutable chronological record of administrative actions, user logins, and data modifications</p>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action Performed</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th class="text-right">Result</th>
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
