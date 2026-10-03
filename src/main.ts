/**
 * AuraMaster - Master Reusable Admin Dashboard Template
 * High-performance Vanilla TypeScript Core Orchestrator
 */
import './styles/admin.css';
import './index.css';
import { store, ViewType } from './utils/store';
import { renderSidebar, renderTopbar } from './components/navigation';
import { openSpotlightSearch } from './components/searchModal';
import { showToast } from './utils/toast';

// View Renderers
import { renderDashboardView, initDashboardCharts } from './views/dashboard';
import { renderProductsView, initProductsEventListeners } from './views/products';
import { renderOrdersView, initOrdersEventListeners, openOrderDetailModal } from './views/orders';
import { renderCustomersView, initCustomersEventListeners, openCustomerProfileModal } from './views/customers';
import { renderArticlesView, initArticlesEventListeners, openArticleEditorModal } from './views/articles';
import { renderPromotionsView, initPromotionsEventListeners } from './views/promotions';
import { renderReportsView, initReportsEventListeners } from './views/reports';
import { renderProfitLossView } from './views/profitLoss';
import { renderExpensesView, initExpensesEventListeners } from './views/expenses';
import { renderSettingsView, initSettingsEventListeners } from './views/settings';
import { renderCMSPagesView, initCMSPagesEventListeners } from './views/cmsPages';
import { renderAboutCMSView, initAboutCMSEventListeners } from './views/aboutCms';
import { renderFAQView, initFAQEventListeners } from './views/faq';
import { renderMediaView, initMediaEventListeners } from './views/media';
import { renderBackupView, initBackupEventListeners } from './views/backup';
import { renderContactInboxView, initContactInboxEventListeners } from './views/contactInbox';
import { renderActivityLogsView } from './views/activityLogs';
import { renderUsersRolesView, initUsersRolesEventListeners } from './views/usersRoles';
import { renderUtilitiesView, initUtilitiesEventListeners } from './views/utilities';
import { renderAuthView, initAuthEventListeners } from './views/authViews';

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const state = store.getState();
  const currentView = state.currentView;

  // If viewing an auth / error standalone screen
  if (
    currentView.startsWith('auth-') ||
    currentView.startsWith('error-') ||
    currentView === 'maintenance'
  ) {
    appContainer.innerHTML = renderAuthView(currentView);
    initAuthEventListeners();
    attachGlobalNavLinks();
    return;
  }

  // Standard Admin Workspace Layout: Sidebar + Topbar + Content + Footer
  appContainer.innerHTML = `
    <div class="min-h-screen flex bg-background text-text transition-colors">
      <!-- Off-canvas mobile backdrop -->
      <div id="mobile-sidebar-backdrop" class="sidebar-backdrop fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 hidden lg:hidden"></div>

      <!-- Left Sidebar -->
      ${renderSidebar()}

      <!-- Right Main Column -->
      <div class="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <!-- Top Navigation Header -->
        ${renderTopbar()}

        <!-- Main Viewport Content -->
        <main id="app-main-content" class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade">
          ${renderCurrentViewContent(currentView)}
        </main>

        <!-- Master Footer -->
        <footer class="h-14 px-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 bg-surface transition-colors">
          <div class="flex items-center gap-2">
            <span>&copy; 2026 <strong>${state.currentClient.name}</strong></span>
            <span>·</span>
            <span>AuraMaster v2.4 Reusable Engine</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> MySQLi DB Ready
            </span>
            <button class="nav-link-btn hover:text-slate-600 dark:hover:text-slate-200 font-medium" data-view="utilities">UI Kit</button>
            <button class="nav-link-btn hover:text-slate-600 dark:hover:text-slate-200 font-medium" data-view="settings">Settings</button>
          </div>
        </footer>
      </div>
    </div>
  `;

  // Attach all interactive event listeners
  attachGlobalNavLinks();
  attachNavigationControls();
  initCurrentViewEvents(currentView);
}

function renderCurrentViewContent(view: ViewType): string {
  switch (view) {
    case 'dashboard':
      return renderDashboardView();
    case 'products':
    case 'product-form':
      return renderProductsView();
    case 'orders':
    case 'order-detail':
      return renderOrdersView();
    case 'customers':
    case 'customer-detail':
      return renderCustomersView();
    case 'articles':
    case 'article-form':
      return renderArticlesView();
    case 'promotions':
      return renderPromotionsView();
    case 'reports':
      return renderReportsView();
    case 'profit-loss':
      return renderProfitLossView();
    case 'expenses':
      return renderExpensesView();
    case 'settings':
      return renderSettingsView();
    case 'cms-pages':
      return renderCMSPagesView();
    case 'about-cms':
      return renderAboutCMSView();
    case 'faq':
      return renderFAQView();
    case 'media':
      return renderMediaView();
    case 'backup':
      return renderBackupView();
    case 'contact':
      return renderContactInboxView();
    case 'activity-logs':
      return renderActivityLogsView();
    case 'users-roles':
      return renderUsersRolesView();
    case 'utilities':
      return renderUtilitiesView();
    default:
      return renderDashboardView();
  }
}

function initCurrentViewEvents(view: ViewType) {
  switch (view) {
    case 'dashboard':
      initDashboardCharts();
      document.getElementById('dash-switch-preset-btn')?.addEventListener('click', () => {
        const dd = document.getElementById('topbar-client-dropdown');
        dd?.classList.toggle('hidden');
      });
      break;
    case 'products':
      initProductsEventListeners();
      break;
    case 'orders':
      initOrdersEventListeners();
      break;
    case 'customers':
      initCustomersEventListeners();
      break;
    case 'articles':
      initArticlesEventListeners();
      break;
    case 'promotions':
      initPromotionsEventListeners();
      break;
    case 'reports':
      initReportsEventListeners();
      break;
    case 'expenses':
      initExpensesEventListeners();
      break;
    case 'settings':
      initSettingsEventListeners();
      break;
    case 'cms-pages':
      initCMSPagesEventListeners();
      break;
    case 'about-cms':
      initAboutCMSEventListeners();
      break;
    case 'faq':
      initFAQEventListeners();
      break;
    case 'media':
      initMediaEventListeners();
      break;
    case 'backup':
      initBackupEventListeners();
      break;
    case 'contact':
      initContactInboxEventListeners();
      break;
    case 'users-roles':
      initUsersRolesEventListeners();
      break;
    case 'utilities':
      initUtilitiesEventListeners();
      break;
  }
}

function attachGlobalNavLinks() {
  document.querySelectorAll('.nav-link-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetView = (btn as HTMLElement).dataset.view as ViewType;
      const entityId = (btn as HTMLElement).dataset.id;
      if (targetView) {
        store.navigate(targetView, entityId);
      }
    });
  });
}

function attachNavigationControls() {
  // Mobile sidebar open/close
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const mobileClose = document.getElementById('mobile-sidebar-close');
  const mobileBackdrop = document.getElementById('mobile-sidebar-backdrop');
  const sidebar = document.getElementById('app-sidebar');

  const openMobile = () => {
    sidebar?.classList.add('sidebar-open');
    mobileBackdrop?.classList.remove('hidden');
    mobileBackdrop?.classList.add('active');
  };
  const closeMobile = () => {
    sidebar?.classList.remove('sidebar-open');
    mobileBackdrop?.classList.add('hidden');
    mobileBackdrop?.classList.remove('active');
  };

  mobileToggle?.addEventListener('click', openMobile);
  mobileClose?.addEventListener('click', closeMobile);
  mobileBackdrop?.addEventListener('click', closeMobile);

  // Desktop sidebar collapse toggle
  document.getElementById('btn-toggle-sidebar-collapse')?.addEventListener('click', () => {
    const isCollapsed = store.getState().sidebarCollapsed;
    store.setState({ sidebarCollapsed: !isCollapsed });
  });

  // Client Presets switcher dropdown toggle
  const clientBtn = document.getElementById('topbar-client-btn');
  const clientDropdown = document.getElementById('topbar-client-dropdown');
  clientBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    clientDropdown?.classList.toggle('hidden');
  });

  document.getElementById('btn-quick-client-switch')?.addEventListener('click', (e) => {
    e.stopPropagation();
    clientDropdown?.classList.toggle('hidden');
  });

  // Client switch click
  document.querySelectorAll('.client-switch-item').forEach((item) => {
    item.addEventListener('click', () => {
      const presetId = (item as HTMLElement).dataset.presetId!;
      store.setClientPreset(presetId);
      showToast({
        title: 'Theme Preset Applied',
        message: `Switched active store identity to ${store.getState().currentClient.name}.`,
        type: 'success'
      });
    });
  });

  // Theme toggle
  document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  // Spotlight search (Ctrl + K)
  document.getElementById('topbar-search-btn')?.addEventListener('click', openSpotlightSearch);

  // Notifications dropdown
  const notifBtn = document.getElementById('topbar-notif-btn');
  const notifDropdown = document.getElementById('topbar-notif-dropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
  });

  document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
    store.setState({ unreadNotificationCount: 0 });
    showToast({ title: 'Notifications Cleared', message: 'All alerts marked as read.', type: 'info' });
  });

  // Quick add dropdown
  const quickAddBtn = document.getElementById('topbar-quick-add-btn');
  const quickAddDropdown = document.getElementById('topbar-quick-add-dropdown');
  quickAddBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    quickAddDropdown?.classList.toggle('hidden');
  });

  // User menu dropdown
  const userBtn = document.getElementById('topbar-user-btn');
  const userDropdown = document.getElementById('topbar-user-dropdown');
  userBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown?.classList.toggle('hidden');
  });

  // Lock screen button
  document.getElementById('btn-lock-screen')?.addEventListener('click', () => {
    store.navigate('auth-lock');
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    clientDropdown?.classList.add('hidden');
    notifDropdown?.classList.add('hidden');
    quickAddDropdown?.classList.add('hidden');
    userDropdown?.classList.add('hidden');
  });
}

// Global Keyboard Shortcut: Ctrl + K (or Cmd + K) for Spotlight Search
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSpotlightSearch();
  }
});

// Subscribe store to trigger seamless re-renders
store.subscribe(() => {
  renderApp();
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  store.applyThemeVariables(store.getState().currentClient, store.getState().theme);
  renderApp();
});

// In case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  store.applyThemeVariables(store.getState().currentClient, store.getState().theme);
  renderApp();
}
