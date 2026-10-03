/**
 * AuraMaster Website Settings View
 * Comprehensive settings with all 12 requested tabs:
 * General, Branding, SEO, Social Media, Contact, Business, Commerce,
 * Shipping, Payment, Analytics, Email SMTP, Security & Maintenance.
 */
import { store } from '../utils/store';
import { showToast } from '../utils/toast';

let activeTab = 'tab-general';

export function renderSettingsView(): string {
  const state = store.getState();
  const client = state.currentClient;

  const tabs = [
    { id: 'tab-general', label: 'General' },
    { id: 'tab-branding', label: 'Branding & Theme' },
    { id: 'tab-seo', label: 'SEO & Metadata' },
    { id: 'tab-social', label: 'Social Media' },
    { id: 'tab-contact', label: 'Contact Info' },
    { id: 'tab-business', label: 'Business Profile' },
    { id: 'tab-commerce', label: 'Commerce & Tax' },
    { id: 'tab-shipping', label: 'Shipping Rules' },
    { id: 'tab-payment', label: 'Payment Gateways' },
    { id: 'tab-analytics', label: 'Analytics & Pixels' },
    { id: 'tab-email', label: 'Email SMTP' },
    { id: 'tab-security', label: 'Security & Maintenance' }
  ];

  const tabButtonsHtml = tabs
    .map(
      (t) => `
    <button
      class="settings-nav-btn text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
        activeTab === t.id
          ? 'bg-primary text-white shadow-sm'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
      }"
      data-tab="${t.id}"
    >
      ${t.label}
    </button>
  `
    )
    .join('');

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Master Website Settings</h1>
          <p class="text-xs text-slate-500">Configure global business variables, branding palette, SEO defaults, and payment APIs</p>
        </div>
        <button id="btn-save-all-settings" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Save Changes</span>
        </button>
      </div>

      <!-- Layout: Vertical Tabs Left (Desktop) + Content Right -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <!-- Sidebar Navigation Tabs -->
        <div class="card p-2 flex flex-col space-y-1 lg:col-span-1">
          ${tabButtonsHtml}
        </div>

        <!-- Form Panels Container (3 cols) -->
        <div class="card p-6 lg:col-span-3 space-y-6">
          <!-- 1. GENERAL -->
          <div id="tab-general" class="settings-panel space-y-4 ${activeTab === 'tab-general' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">General Settings</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Website Name</label>
                <input id="set-general-name" type="text" class="form-input" value="${client.name}" />
              </div>
              <div>
                <label class="form-label">Website URL</label>
                <input type="url" class="form-input font-mono text-xs" value="https://${client.id}.store.id" />
              </div>
            </div>
            <div>
              <label class="form-label">Website Tagline & Description</label>
              <textarea class="form-textarea h-20">${client.tagline}</textarea>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="form-label">Default Language</label>
                <select class="form-select">
                  <option selected>Indonesian (id_ID)</option>
                  <option>English (en_US)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Default Currency</label>
                <select class="form-select font-mono">
                  <option selected>IDR (Rp)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Timezone</label>
                <select class="form-select">
                  <option selected>Asia/Jakarta (WIB GMT+7)</option>
                  <option>Asia/Makassar (WITA GMT+8)</option>
                  <option>Asia/Jayapura (WIT GMT+9)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2. BRANDING & THEME -->
          <div id="tab-branding" class="settings-panel space-y-4 ${activeTab === 'tab-branding' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Branding & Color Theme Engine</h2>
            <p class="text-xs text-slate-500">Changes here adapt the CSS variables (--primary, --secondary) dynamically across the dashboard.</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Primary Brand Color</label>
                <div class="flex items-center gap-3">
                  <input id="set-brand-primary" type="color" class="w-10 h-10 rounded cursor-pointer border-0" value="${client.primaryColor}" />
                  <input id="set-brand-primary-hex" type="text" class="form-input font-mono text-xs" value="${client.primaryColor}" />
                </div>
              </div>
              <div>
                <label class="form-label">Secondary Color</label>
                <div class="flex items-center gap-3">
                  <input id="set-brand-secondary" type="color" class="w-10 h-10 rounded cursor-pointer border-0" value="${client.secondaryColor}" />
                  <input id="set-brand-secondary-hex" type="text" class="form-input font-mono text-xs" value="${client.secondaryColor}" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label class="form-label">Primary Logo (Light Canvas)</label>
                <div class="p-3 border border-dashed rounded-lg text-center bg-slate-50 dark:bg-slate-900">
                  <span class="text-xs text-slate-500">Current: Vector SVG Logo</span>
                </div>
              </div>
              <div>
                <label class="form-label">Dark Mode Logo</label>
                <div class="p-3 border border-dashed rounded-lg text-center bg-slate-900">
                  <span class="text-xs text-slate-400">Current: Inverted Logo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. SEO -->
          <div id="tab-seo" class="settings-panel space-y-4 ${activeTab === 'tab-seo' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Search Engine Optimization (SEO)</h2>
            <div>
              <label class="form-label">Default Meta Title</label>
              <input type="text" class="form-input" value="${client.name} | Official Website & Online Store" />
            </div>
            <div>
              <label class="form-label">Default Meta Description</label>
              <textarea class="form-textarea h-20">Discover authentic clinical-grade skincare and dermatologist approved treatments. Free shipping across Indonesia.</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Focus Keywords</label>
                <input type="text" class="form-input" value="skincare, clinic, serum, dermatologist, anti-aging" />
              </div>
              <div>
                <label class="form-label">Robots.txt Directive</label>
                <select class="form-select">
                  <option selected>index, follow (Recommended)</option>
                  <option>noindex, nofollow (Private)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 4. SOCIAL MEDIA -->
          <div id="tab-social" class="settings-panel space-y-4 ${activeTab === 'tab-social' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Social Channels</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Instagram Profile</label>
                <input type="text" class="form-input text-xs" value="https://instagram.com/auraglow.official" />
              </div>
              <div>
                <label class="form-label">TikTok Store</label>
                <input type="text" class="form-input text-xs" value="https://tiktok.com/@auraglow" />
              </div>
              <div>
                <label class="form-label">WhatsApp Business</label>
                <input type="text" class="form-input text-xs font-mono" value="+628123456789" />
              </div>
              <div>
                <label class="form-label">YouTube Channel</label>
                <input type="text" class="form-input text-xs" value="https://youtube.com/@auraglow" />
              </div>
            </div>
          </div>

          <!-- 5. CONTACT INFO -->
          <div id="tab-contact" class="settings-panel space-y-4 ${activeTab === 'tab-contact' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Contact & Office Address</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Support Email</label>
                <input type="email" class="form-input text-xs" value="hello@${client.id}.id" />
              </div>
              <div>
                <label class="form-label">Customer Service Phone</label>
                <input type="text" class="form-input text-xs font-mono" value="+62 21 5599 8811" />
              </div>
            </div>
            <div>
              <label class="form-label">Physical HQ Address</label>
              <textarea class="form-textarea h-16">Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190</textarea>
            </div>
          </div>

          <!-- 6. BUSINESS PROFILE -->
          <div id="tab-business" class="settings-panel space-y-4 ${activeTab === 'tab-business' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Business & Legal Registration</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Legal Corporate Entity</label>
                <input type="text" class="form-input" value="PT Aura Medika Estetika Indonesia" />
              </div>
              <div>
                <label class="form-label">Tax ID (NPWP)</label>
                <input type="text" class="form-input font-mono" value="01.234.567.8-012.000" />
              </div>
            </div>
          </div>

          <!-- 7. COMMERCE & TAX -->
          <div id="tab-commerce" class="settings-panel space-y-4 ${activeTab === 'tab-commerce' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Commerce & Order Configurations</h2>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="form-label">Order Prefix</label>
                <input type="text" class="form-input font-mono uppercase" value="ORD" />
              </div>
              <div>
                <label class="form-label">VAT / Tax Rate (%)</label>
                <input type="number" class="form-input font-mono" value="0" />
              </div>
              <div>
                <label class="form-label">Minimum Order (Rp)</label>
                <input type="number" class="form-input font-mono" value="50000" />
              </div>
            </div>
          </div>

          <!-- 8. SHIPPING RULES -->
          <div id="tab-shipping" class="settings-panel space-y-4 ${activeTab === 'tab-shipping' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Shipping Logistics & Couriers</h2>
            <div class="space-y-2 text-xs">
              <label class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4" />
                <span><strong>JNE Express</strong> (Reguler, YES, OKE)</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4" />
                <span><strong>SiCepat Ekspres</strong> (REG, BEST, Cargo)</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4" />
                <span><strong>GoSend / GrabExpress</strong> (Instant & Same Day)</span>
              </label>
            </div>
          </div>

          <!-- 9. PAYMENT GATEWAYS -->
          <div id="tab-payment" class="settings-panel space-y-4 ${activeTab === 'tab-payment' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Payment Gateway Integration</h2>
            <div class="space-y-3 text-xs">
              <div class="p-3 border rounded-lg space-y-2">
                <div class="flex items-center justify-between font-bold">
                  <span>Midtrans / Xendit Payment Gateway</span>
                  <span class="text-emerald-600 font-semibold">Active · Live Mode</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" class="form-input text-xs font-mono" placeholder="Server Key" value="Mid-server-xxxxxxxxxxxxxx" />
                  <input type="text" class="form-input text-xs font-mono" placeholder="Client Key" value="Mid-client-xxxxxxxxxxxxxx" />
                </div>
              </div>
              <div class="p-3 border rounded-lg space-y-2">
                <div class="flex items-center justify-between font-bold">
                  <span>Direct Bank Transfer (Manual Reconcile)</span>
                  <span class="text-emerald-600 font-semibold">Active</span>
                </div>
                <input type="text" class="form-input text-xs" value="BCA: 8820-192-881 a/n PT Aura Medika Estetika" />
              </div>
            </div>
          </div>

          <!-- 10. ANALYTICS & PIXELS -->
          <div id="tab-analytics" class="settings-panel space-y-4 ${activeTab === 'tab-analytics' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Tracking Pixels & Analytics</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Google Analytics 4 Measurement ID</label>
                <input type="text" class="form-input font-mono text-xs" value="G-AURAGLOW99" />
              </div>
              <div>
                <label class="form-label">Meta Pixel ID (Facebook Ads)</label>
                <input type="text" class="form-input font-mono text-xs" value="88291029381920" />
              </div>
              <div>
                <label class="form-label">Google Tag Manager Container ID</label>
                <input type="text" class="form-input font-mono text-xs" value="GTM-N982X10" />
              </div>
              <div>
                <label class="form-label">TikTok Pixel ID</label>
                <input type="text" class="form-input font-mono text-xs" value="C891238910238" />
              </div>
            </div>
          </div>

          <!-- 11. EMAIL SMTP -->
          <div id="tab-email" class="settings-panel space-y-4 ${activeTab === 'tab-email' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Transactional Email (SMTP)</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">SMTP Host</label>
                <input type="text" class="form-input font-mono text-xs" value="smtp.postmarkapp.com" />
              </div>
              <div>
                <label class="form-label">SMTP Port</label>
                <input type="text" class="form-input font-mono text-xs" value="587" />
              </div>
              <div>
                <label class="form-label">From Name</label>
                <input type="text" class="form-input text-xs" value="${client.name}" />
              </div>
              <div>
                <label class="form-label">From Sender Address</label>
                <input type="email" class="form-input text-xs" value="no-reply@${client.id}.id" />
              </div>
            </div>
          </div>

          <!-- 12. SECURITY & MAINTENANCE -->
          <div id="tab-security" class="settings-panel space-y-4 ${activeTab === 'tab-security' ? '' : 'hidden'}">
            <h2 class="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Security Hardening & Maintenance</h2>
            <div class="space-y-4 text-xs">
              <label class="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div class="font-bold text-slate-800 dark:text-slate-200">Maintenance Mode</div>
                  <div class="text-slate-500 text-[11px]">Display 503 maintenance page to public visitors while allowing admin access</div>
                </div>
                <input type="checkbox" class="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
              </label>

              <label class="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div class="font-bold text-slate-800 dark:text-slate-200">Force Two-Factor Authentication (2FA)</div>
                  <div class="text-slate-500 text-[11px]">Require OTP authentication for all Super Admin logins</div>
                </div>
                <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
              </label>

              <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label class="form-label">Admin Session Timeout (Minutes)</label>
                  <input type="number" class="form-input font-mono" value="60" />
                </div>
                <div>
                  <label class="form-label">Max Failed Attempts Before IP Lockout</label>
                  <input type="number" class="form-input font-mono" value="5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSettingsEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  // Tabs switcher
  container.querySelectorAll('.settings-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = (btn as HTMLElement).dataset.tab!;
      activeTab = tabId;
      container.querySelectorAll('.settings-nav-btn').forEach((b) => {
        b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
        b.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.add('bg-primary', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');

      container.querySelectorAll('.settings-panel').forEach((p) => {
        if (p.id === tabId) p.classList.remove('hidden');
        else p.classList.add('hidden');
      });
    });
  });

  // Color picker sync
  const primaryPicker = container.querySelector('#set-brand-primary') as HTMLInputElement;
  const primaryHex = container.querySelector('#set-brand-primary-hex') as HTMLInputElement;
  if (primaryPicker && primaryHex) {
    primaryPicker.addEventListener('input', () => {
      primaryHex.value = primaryPicker.value;
      document.documentElement.style.setProperty('--primary', primaryPicker.value);
    });
    primaryHex.addEventListener('input', () => {
      primaryPicker.value = primaryHex.value;
      document.documentElement.style.setProperty('--primary', primaryHex.value);
    });
  }

  // Save all settings button
  container.querySelector('#btn-save-all-settings')?.addEventListener('click', () => {
    const nameInp = container.querySelector('#set-general-name') as HTMLInputElement;
    if (nameInp && nameInp.value) {
      const client = store.getState().currentClient;
      store.setState({ currentClient: { ...client, name: nameInp.value } });
    }
    showToast({ title: 'Settings Saved', message: 'All website settings synchronized successfully.', type: 'success' });
  });
}
