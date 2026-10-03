/**
 * AuraMaster About Us CMS Content Editor
 * Complete content management for brand story, vision, mission, and team profiles.
 */
import { store } from '../utils/store';
import { showToast } from '../utils/toast';

export function renderAboutCMSView(): string {
  const state = store.getState();
  const client = state.currentClient;

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">About Us Content Editor</h1>
          <p class="text-xs text-slate-500">Edit company background, medical advisory board, and corporate mission statements</p>
        </div>
        <button id="btn-save-about-cms" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Publish Changes</span>
        </button>
      </div>

      <div class="card p-6 space-y-5">
        <div>
          <label class="form-label">Hero Banner Headline</label>
          <input type="text" class="form-input text-base font-semibold" value="Pioneering Skin Health with Rigorous Dermatological Science" />
        </div>

        <div>
          <label class="form-label">Brand Founding Story</label>
          <textarea class="form-textarea h-28 leading-relaxed">Founded in 2021 by leading dermatology researchers, ${client.name} was established with a singular objective: to eradicate barrier dysfunction using biocompatible, evidence-grounded topical formulations free from unnecessary fillers or sensitizing aromas.</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Corporate Mission</label>
            <textarea class="form-textarea h-24">Deliver clinically validated, hypoallergenic skincare solutions that restore healthy trans-epidermal moisture balance.</textarea>
          </div>
          <div>
            <label class="form-label">Corporate Vision</label>
            <textarea class="form-textarea h-24">To become the gold standard in Southeast Asian dermato-cosmetics, trusted by doctors and conscious consumers alike.</textarea>
          </div>
        </div>

        <!-- Core Values Strip -->
        <div>
          <label class="form-label mb-2">Core Pillar Values</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
              <strong class="text-slate-900 dark:text-white block">1. Clinical Transparency</strong>
              <span class="text-slate-500">Full disclosure of active percentages and clinical peer-reviewed data.</span>
            </div>
            <div class="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
              <strong class="text-slate-900 dark:text-white block">2. Hypoallergenic Efficacy</strong>
              <span class="text-slate-500">Every formula tested on reactive and acne-prone skin types.</span>
            </div>
            <div class="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
              <strong class="text-slate-900 dark:text-white block">3. Sustainable Ethics</strong>
              <span class="text-slate-500">Cruelty-free, recyclable packaging, and ethically sourced botanicals.</span>
            </div>
          </div>
        </div>

        <!-- Leadership Team -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <label class="form-label">Executive Leadership & Founders</label>
            <button class="btn btn-secondary btn-sm py-1 px-2 text-xs">+ Add Member</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <img src="/src/assets/images/admin_avatar_1791012221345.jpg" class="w-12 h-12 rounded-full object-cover" />
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white">${client.adminName}</div>
                <div class="text-[11px] text-primary font-medium">Founder & Chief Dermatologist</div>
                <div class="text-[10px] text-slate-400">Specialist in cutaneous barrier repair</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAboutCMSEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-save-about-cms')?.addEventListener('click', () => {
    showToast({ title: 'About Us Content Updated', message: 'Storefront page has been synchronized.', type: 'success' });
  });
}
