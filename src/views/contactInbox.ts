/**
 * AuraMaster Contact Messages Inbox View
 * Read customer support tickets, business inquiries, and reply directly.
 */
import { store } from '../utils/store';
import { ContactMessage } from '../data/mockData';
import { showToast } from '../utils/toast';
import { openModal, closeModal } from '../utils/modal';

export function renderContactInboxView(): string {
  const state = store.getState();

  const rowsHtml = state.messages.map((msg) => {
    const statusBadges: Record<string, string> = {
      Unread: 'badge-danger',
      Read: 'badge-neutral',
      Replied: 'badge-success',
      Archived: 'badge-neutral'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <div class="font-bold text-xs text-slate-900 dark:text-white">${msg.sender}</div>
          <div class="text-[11px] text-slate-400">${msg.email}</div>
        </td>
        <td class="text-xs">
          <div class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">${msg.subject}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-xs">${msg.message}</div>
        </td>
        <td class="tabular-nums text-xs text-slate-500">${msg.date}</td>
        <td>
          <span class="badge ${statusBadges[msg.status]}">
            <span class="badge-dot"></span>
            ${msg.status}
          </span>
        </td>
        <td class="text-right">
          <button class="btn-read-msg btn btn-secondary btn-sm py-1 px-2 text-xs" data-id="${msg.id}">
            Read & Reply
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Customer Support Inbox</h1>
          <p class="text-xs text-slate-500">Inbound inquiries submitted from the website Contact Us page</p>
        </div>
      </div>

      <!-- Messages Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sender & Contact</th>
                <th>Subject & Preview</th>
                <th>Received At</th>
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

export function openMessageModal(messageId: string) {
  const state = store.getState();
  const msg = state.messages.find((m) => m.id === messageId);
  if (!msg) return;

  // Mark as read
  if (msg.status === 'Unread') {
    msg.status = 'Read';
    store.setState({ messages: [...state.messages] });
  }

  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
        <div class="flex justify-between items-center">
          <span class="font-bold text-sm text-slate-900 dark:text-white">${msg.sender}</span>
          <span class="text-slate-400 font-mono text-[10px]">${msg.date}</span>
        </div>
        <div class="text-slate-500">${msg.email} · ${msg.phone}</div>
        <div class="font-semibold text-slate-800 dark:text-slate-200 pt-1">${msg.subject}</div>
      </div>

      <div class="p-4 bg-surface rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
        ${msg.message}
      </div>

      <div class="space-y-2">
        <label class="form-label">Draft Email Response to ${msg.sender}</label>
        <textarea id="reply-textarea" class="form-textarea h-24" placeholder="Type your response..."></textarea>
      </div>
    </div>
  `;

  openModal({
    title: `Inquiry from ${msg.sender}`,
    size: 'md',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Close</button>
      <button id="btn-send-reply" class="btn btn-primary">Send Email Response</button>
    `,
    onMount: (modalEl) => {
      modalEl.querySelector('#btn-send-reply')?.addEventListener('click', () => {
        msg.status = 'Replied';
        store.setState({ messages: [...state.messages] });
        showToast({ title: 'Reply Sent', message: `Email dispatched to ${msg.email}.`, type: 'success' });
        closeModal();
        store.navigate('contact');
      });
    }
  });
}

export function initContactInboxEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelectorAll('.btn-read-msg').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      openMessageModal(id);
    });
  });
}
