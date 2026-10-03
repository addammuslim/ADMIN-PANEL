/**
 * AuraMaster Navigation Components (Sidebar & Topbar)
 * Provides ThemeForest-grade navigation with collapse states, off-canvas mobile drawer,
 * client preset switcher, theme toggle, notifications dropdown, and quick actions.
 */
import { store, ViewType } from '../utils/store';
import { CLIENT_PRESETS } from '../data/mockData';
import { showToast } from '../utils/toast';

interface NavItem {
  id: ViewType;
  label: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Core',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
      }
    ]
  },
  {
    title: 'Commerce Management',
    items: [
      {
        id: 'products',
        label: 'Products',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
        badge: '20'
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`,
        badge: '8',
        badgeClass: 'bg-primary-light text-primary'
      },
      {
        id: 'customers',
        label: 'Customers',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
      },
      {
        id: 'promotions',
        label: 'Promotions & Coupons',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>`
      }
    ]
  },
  {
    title: 'Finance & Analytics',
    items: [
      {
        id: 'reports',
        label: 'Sales & Daily Reports',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
      },
      {
        id: 'profit-loss',
        label: 'Profit & Loss (P&L)',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      },
      {
        id: 'expenses',
        label: 'Expense Manager',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
      }
    ]
  },
  {
    title: 'Content & CMS',
    items: [
      {
        id: 'articles',
        label: 'Blog & Articles',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>`
      },
      {
        id: 'cms-pages',
        label: 'Pages & Policy CMS',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
      },
      {
        id: 'about-cms',
        label: 'About Us Editor',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      },
      {
        id: 'faq',
        label: 'FAQ Accordion',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      },
      {
        id: 'media',
        label: 'Media Library',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
      }
    ]
  },
  {
    title: 'Operations & Comms',
    items: [
      {
        id: 'contact',
        label: 'Contact Inbox',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
        badge: '1 New',
        badgeClass: 'bg-emerald-500/10 text-emerald-600'
      },
      {
        id: 'settings',
        label: 'Website Settings',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
      },
      {
        id: 'backup',
        label: 'Database Backup',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>`
      },
      {
        id: 'activity-logs',
        label: 'Activity Logs',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      },
      {
        id: 'users-roles',
        label: 'Admin Users & RBAC',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
      }
    ]
  },
  {
    title: 'Developer & ThemeForest Kit',
    items: [
      {
        id: 'utilities',
        label: 'UI Components Library',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>`,
        badge: 'PRO',
        badgeClass: 'bg-indigo-500/10 text-indigo-600 font-mono text-[10px]'
      },
      {
        id: 'auth-login',
        label: 'Auth & Error Pages',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`
      }
    ]
  }
];

export function renderSidebar(): string {
  const state = store.getState();
  const currentView = state.currentView;
  const client = state.currentClient;
  const isCollapsed = state.sidebarCollapsed;

  const groupsHtml = NAV_GROUPS.map((group) => {
    const itemsHtml = group.items
      .map((item) => {
        const isActive =
          currentView === item.id ||
          (item.id === 'products' && currentView === 'product-form') ||
          (item.id === 'orders' && currentView === 'order-detail') ||
          (item.id === 'customers' && currentView === 'customer-detail') ||
          (item.id === 'articles' && currentView === 'article-form');

        return `
        <button
          class="nav-link-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
            isActive
              ? 'bg-surface-hover text-text font-bold shadow-xs'
              : 'text-text-secondary hover:text-text hover:bg-surface-hover'
          }"
          data-view="${item.id}"
          data-tooltip="${isCollapsed ? item.label : ''}"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted'}">
              ${item.icon}
            </span>
            ${!isCollapsed ? `<span class="truncate text-left">${item.label}</span>` : ''}
          </div>
          ${
            !isCollapsed && item.badge
              ? `<span class="px-2 py-0.5 text-[11px] font-semibold rounded-full ${item.badgeClass || 'bg-surface-subtle text-muted border border-border'}">${item.badge}</span>`
              : ''
          }
        </button>
      `;
      })
      .join('');

    return `
      <div class="mb-5">
        ${!isCollapsed ? `<div class="px-3.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">${group.title}</div>` : ''}
        <div class="space-y-0.5">
          ${itemsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <aside
      id="app-sidebar"
      class="app-sidebar bg-surface border-r border-border flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[76px]' : 'w-[268px]'
      } ${state.mobileSidebarOpen ? 'sidebar-open' : ''}"
    >
      <!-- Sidebar Brand Header -->
      <div class="h-[68px] px-4 border-b border-border flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
            A
          </div>
          ${
            !isCollapsed
              ? `<div class="flex flex-col truncate">
                  <span class="font-bold text-sm tracking-tight text-text truncate">${client.name}</span>
                  <span class="text-[11px] text-muted truncate">${client.category}</span>
                </div>`
              : ''
          }
        </div>
        <!-- Close button on mobile -->
        <button id="mobile-sidebar-close" class="lg:hidden p-1.5 text-muted hover:text-text rounded-lg">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Live Client Switcher Pill -->
      ${
        !isCollapsed
          ? `<div class="px-3.5 py-2.5 mx-3 mt-3 bg-surface-subtle rounded-lg border border-border">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="text-[10px] uppercase font-semibold text-muted">Master Template</span>
                <span class="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready
                </span>
              </div>
              <button id="btn-quick-client-switch" class="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-text bg-surface rounded border border-border shadow-xs hover:border-primary transition-colors">
                <span class="truncate">${client.name}</span>
                <svg class="w-3.5 h-3.5 text-muted shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>`
          : ''
      }

      <!-- Nav Items Scrollable Body -->
      <div class="flex-1 overflow-y-auto px-3.5 py-4 scroll-smooth">
        ${groupsHtml}
      </div>

      <!-- Sidebar Footer / Collapse Toggle -->
      <div class="p-3 border-t border-border shrink-0">
        <button
          id="btn-toggle-sidebar-collapse"
          class="w-full hidden lg:flex items-center justify-center p-2 rounded-lg text-muted hover:text-text hover:bg-surface-hover transition-colors"
          data-tooltip="${isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}"
        >
          <svg class="w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          ${!isCollapsed ? `<span class="ml-2 text-xs font-medium text-muted">Collapse Menu</span>` : ''}
        </button>
      </div>
    </aside>
  `;
}

export function renderTopbar(): string {
  const state = store.getState();
  const client = state.currentClient;

  // Breadcrumbs title resolution
  const viewTitles: Record<ViewType, string> = {
    dashboard: 'Main Dashboard',
    products: 'Product Management',
    'product-form': 'Product Editor',
    orders: 'Orders Management',
    'order-detail': 'Order Breakdown',
    customers: 'Customers & Members',
    'customer-detail': 'Customer Profile',
    articles: 'Blog & Articles CMS',
    'article-form': 'Article Editor',
    promotions: 'Promotions & Discounts',
    reports: 'Sales & Daily Analytics',
    'profit-loss': 'Profit & Loss Statement',
    expenses: 'Operational Expenses',
    settings: 'Master Website Settings',
    'cms-pages': 'CMS & Legal Pages',
    'about-cms': 'About Us Content CMS',
    faq: 'FAQ Management',
    media: 'Media Asset Library',
    backup: 'Database Backup & Restore',
    contact: 'Contact Messages Inbox',
    'activity-logs': 'Security Audit Trail',
    'users-roles': 'Admin Users & RBAC',
    utilities: 'UI Components Library',
    'auth-login': 'Login Preview',
    'auth-register': 'Register Preview',
    'auth-forgot': 'Forgot Password Preview',
    'auth-lock': 'Screen Lock Preview',
    'error-404': '404 Not Found',
    'error-403': '403 Forbidden',
    'error-500': '500 Server Error',
    maintenance: 'Maintenance Mode'
  };

  const currentTitle = viewTitles[state.currentView] || 'Overview';

  // Client switch options
  const clientOptionsHtml = CLIENT_PRESETS.map((p) => `
    <button
      class="client-switch-item w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors hover:bg-surface-hover ${
        p.id === client.id ? 'bg-primary-light text-primary font-semibold' : 'text-text'
      }"
      data-preset-id="${p.id}"
    >
      <div class="flex items-center gap-2.5">
        <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${p.primaryColor};"></span>
        <div>
          <div class="font-medium text-text">${p.name}</div>
          <div class="text-[10px] text-muted">${p.category}</div>
        </div>
      </div>
      ${p.id === client.id ? `<svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>` : ''}
    </button>
  `).join('');

  return `
    <header class="h-[68px] bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <!-- Zone 1: Mobile Hamburger & Context Breadcrumbs -->
      <div class="flex items-center gap-3 shrink-0">
        <button id="mobile-sidebar-toggle" class="lg:hidden p-2 -ml-2 rounded-lg text-text hover:bg-surface-hover" aria-label="Toggle navigation">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-2 text-xs sm:text-sm">
          <button class="nav-link-btn text-muted hover:text-text font-medium" data-view="dashboard">
            Admin
          </button>
          <span class="text-muted opacity-50">/</span>
          <span class="font-bold text-text truncate max-w-[130px] sm:max-w-[200px]">${currentTitle}</span>
        </div>
      </div>

      <!-- Zone 2: Global Search Quick-Key -->
      <div class="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4">
        <button id="topbar-search-btn" class="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-muted bg-surface-subtle rounded-lg border border-border hover:border-muted transition-colors">
          <div class="flex items-center gap-2 truncate">
            <svg class="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="truncate">Search catalog, orders...</span>
          </div>
          <kbd class="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border text-muted rounded shadow-2xs shrink-0">Ctrl K</kbd>
        </button>
      </div>

      <!-- Zone 3: Actions, Preset Switcher, Theme & Profile -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- Client Preset Switcher Button -->
        <div class="relative">
          <button
            id="topbar-client-btn"
            class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-text bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors shadow-2xs shrink-0"
            title="Switch Client Preset"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: var(--primary);"></span>
            <span class="hidden sm:inline">Client Preset</span>
            <svg class="w-3.5 h-3.5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Client Dropdown Menu -->
          <div id="topbar-client-dropdown" class="hidden absolute right-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-xl p-2 z-50 animate-pop">
            <div class="px-3 py-2 border-b border-border mb-1">
              <div class="text-xs font-bold text-text uppercase tracking-wider">Master Client Presets</div>
              <p class="text-[11px] text-muted mt-0.5">Switch brand identity, primary colors, and context in 1 click.</p>
            </div>
            <div class="space-y-1">
              ${clientOptionsHtml}
            </div>
          </div>
        </div>

        <!-- Quick Action "+ Add" -->
        <div class="relative hidden md:block">
          <button id="topbar-quick-add-btn" class="btn btn-sm btn-primary shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Quick Create</span>
          </button>
          
          <div id="topbar-quick-add-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl p-1.5 z-50">
            <button class="nav-link-btn w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-surface-hover text-text flex items-center gap-2" data-view="product-form">
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span>+ Add New Product</span>
            </button>
            <button class="nav-link-btn w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-surface-hover text-text flex items-center gap-2" data-view="article-form">
              <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              <span>+ Write Article</span>
            </button>
            <button class="nav-link-btn w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-surface-hover text-text flex items-center gap-2" data-view="promotions">
              <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              <span>+ Create Coupon</span>
            </button>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button
          id="btn-toggle-theme"
          class="p-2 rounded-lg text-text hover:bg-surface-hover transition-colors shrink-0"
          title="Toggle Light / Dark Mode"
        >
          ${
            state.theme === 'dark'
              ? `<svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
              : `<svg class="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
          }
        </button>

        <!-- Notifications Bell -->
        <div class="relative shrink-0">
          <button
            id="topbar-notif-btn"
            class="p-2 rounded-lg text-text hover:bg-surface-hover transition-colors relative"
            title="Notifications"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            ${
              state.unreadNotificationCount > 0
                ? `<span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>`
                : ''
            }
          </button>

          <!-- Notification Dropdown -->
          <div id="topbar-notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl p-3 z-50">
            <div class="flex items-center justify-between pb-2 mb-2 border-b border-border">
              <span class="text-xs font-bold uppercase tracking-wider text-text">Recent Alerts</span>
              <button id="btn-mark-all-read" class="text-[11px] text-primary hover:underline font-medium">Mark all read</button>
            </div>
            <div class="space-y-2 text-xs">
              <div class="p-2 rounded-lg bg-surface-subtle border border-border flex items-start gap-2.5">
                <span class="p-1 rounded bg-emerald-500/10 text-emerald-600 mt-0.5 shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-text truncate">New Order #ORD-20261002-001</div>
                  <div class="text-[11px] text-muted">Siti Rahmawati paid Rp 541.000</div>
                  <div class="text-[10px] text-muted mt-0.5">15 mins ago</div>
                </div>
              </div>

              <div class="p-2 rounded-lg bg-surface-subtle border border-border flex items-start gap-2.5">
                <span class="p-1 rounded bg-amber-500/10 text-amber-600 mt-0.5 shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-text truncate">Low Stock Alert (8 left)</div>
                  <div class="text-[11px] text-muted truncate">Niacinamide 10% Zinc Drops</div>
                  <div class="text-[10px] text-muted mt-0.5">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lock Screen Button -->
        <button
          id="btn-lock-screen"
          class="p-2 rounded-lg text-text hover:bg-surface-hover transition-colors shrink-0"
          title="Lock Screen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>

        <!-- Divider -->
        <div class="h-6 w-px bg-border my-auto shrink-0"></div>

        <!-- User Profile Pill -->
        <div class="relative shrink-0">
          <button id="topbar-user-btn" class="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-hover transition-colors">
            <img
              src="/src/assets/images/admin_avatar_1791012221345.jpg"
              alt="${client.adminName}"
              class="w-8 h-8 rounded-full object-cover border border-border shrink-0"
            />
            <div class="hidden xl:flex flex-col text-left">
              <span class="text-xs font-semibold text-text truncate max-w-[120px]">${client.adminName}</span>
              <span class="text-[10px] text-muted">${client.adminRole}</span>
            </div>
            <svg class="w-3.5 h-3.5 text-muted hidden xl:block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          <div id="topbar-user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl p-1.5 z-50">
            <div class="px-3 py-2 border-b border-border mb-1">
              <div class="text-xs font-bold text-text truncate">${client.adminName}</div>
              <div class="text-[11px] text-muted truncate">${client.adminEmail}</div>
            </div>
            <button class="nav-link-btn w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-surface-hover text-text" data-view="settings">
              Settings & Account
            </button>
            <button class="nav-link-btn w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-surface-hover text-text" data-view="activity-logs">
              Audit Trail
            </button>
            <div class="my-1 border-t border-border"></div>
            <button class="nav-link-btn w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-rose-50 hover:text-rose-600 text-rose-500" data-view="auth-login">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

