/**
 * AuraMaster Reactive State Store
 * High-performance lightweight Vanilla JS/TS reactive state manager
 */
import { 
  CLIENT_PRESETS, 
  ClientPreset, 
  MOCK_PRODUCTS, 
  Product, 
  MOCK_ORDERS, 
  Order, 
  MOCK_CUSTOMERS, 
  Customer,
  MOCK_ARTICLES,
  Article,
  MOCK_PROMOTIONS,
  Promotion,
  MOCK_EXPENSES,
  Expense,
  MOCK_BACKUPS,
  BackupHistory,
  MOCK_LOGS,
  ActivityLog,
  MOCK_MESSAGES,
  ContactMessage,
  MOCK_FAQS,
  FAQItem
} from '../data/mockData';

export type ViewType = 
  | 'dashboard'
  | 'products'
  | 'product-form'
  | 'orders'
  | 'order-detail'
  | 'customers'
  | 'customer-detail'
  | 'articles'
  | 'article-form'
  | 'promotions'
  | 'reports'
  | 'profit-loss'
  | 'expenses'
  | 'settings'
  | 'cms-pages'
  | 'about-cms'
  | 'faq'
  | 'media'
  | 'backup'
  | 'contact'
  | 'activity-logs'
  | 'users-roles'
  | 'utilities'
  | 'auth-login'
  | 'auth-register'
  | 'auth-forgot'
  | 'auth-lock'
  | 'error-404'
  | 'error-403'
  | 'error-500'
  | 'maintenance';

export interface AppState {
  currentClient: ClientPreset;
  theme: 'light' | 'dark';
  currentView: ViewType;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  selectedCustomerId: string | null;
  selectedArticleId: string | null;
  searchModalOpen: boolean;
  notificationDropdownOpen: boolean;
  clientDropdownOpen: boolean;
  userDropdownOpen: boolean;
  isLocked: boolean;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  articles: Article[];
  promotions: Promotion[];
  expenses: Expense[];
  backups: BackupHistory[];
  logs: ActivityLog[];
  messages: ContactMessage[];
  faqs: FAQItem[];
  unreadNotificationCount: number;
}

const initialState: AppState = {
  currentClient: CLIENT_PRESETS[0],
  theme: 'light',
  currentView: 'dashboard',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  selectedProductId: null,
  selectedOrderId: null,
  selectedCustomerId: null,
  selectedArticleId: null,
  searchModalOpen: false,
  notificationDropdownOpen: false,
  clientDropdownOpen: false,
  userDropdownOpen: false,
  isLocked: false,
  products: [...MOCK_PRODUCTS],
  orders: [...MOCK_ORDERS],
  customers: [...MOCK_CUSTOMERS],
  articles: [...MOCK_ARTICLES],
  promotions: [...MOCK_PROMOTIONS],
  expenses: [...MOCK_EXPENSES],
  backups: [...MOCK_BACKUPS],
  logs: [...MOCK_LOGS],
  messages: [...MOCK_MESSAGES],
  faqs: [...MOCK_FAQS],
  unreadNotificationCount: 4
};

type Listener = (state: AppState) => void;

class StateStore {
  private state: AppState = initialState;
  private listeners: Set<Listener> = new Set();

  getState(): AppState {
    return this.state;
  }

  setState(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Preset Switcher
  setClientPreset(presetId: string) {
    const found = CLIENT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      this.setState({ currentClient: found, clientDropdownOpen: false });
      this.applyThemeVariables(found, this.state.theme);
    }
  }

  // Toggle Theme
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({ theme: newTheme });
    this.applyThemeVariables(this.state.currentClient, newTheme);
  }

  // Apply CSS Variables directly to document
  applyThemeVariables(client: ClientPreset, theme: 'light' | 'dark') {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.setProperty('--primary', client.primaryColor);
    root.style.setProperty('--secondary', client.secondaryColor);
    
    // Parse hex to rgb
    const hex = client.primaryColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
      root.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, ${theme === 'dark' ? 0.22 : 0.08})`);
    }
  }

  // Navigation
  navigate(view: ViewType, entityId?: string) {
    const updates: Partial<AppState> = {
      currentView: view,
      mobileSidebarOpen: false,
      searchModalOpen: false,
      notificationDropdownOpen: false,
      clientDropdownOpen: false,
      userDropdownOpen: false
    };

    if (view === 'order-detail' && entityId) {
      updates.selectedOrderId = entityId;
    } else if (view === 'product-form') {
      updates.selectedProductId = entityId || null;
    } else if (view === 'customer-detail' && entityId) {
      updates.selectedCustomerId = entityId;
    } else if (view === 'article-form') {
      updates.selectedArticleId = entityId || null;
    }

    this.setState(updates);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Product mutations
  addProduct(product: Product) {
    this.setState({ products: [product, ...this.state.products] });
  }

  updateProduct(updated: Product) {
    this.setState({
      products: this.state.products.map((p) => (p.id === updated.id ? updated : p))
    });
  }

  deleteProduct(id: string) {
    this.setState({
      products: this.state.products.filter((p) => p.id !== id)
    });
  }

  deleteProductsBulk(ids: string[]) {
    this.setState({
      products: this.state.products.filter((p) => !ids.includes(p.id))
    });
  }

  // Order mutations
  updateOrderStatus(orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) {
    this.setState({
      orders: this.state.orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            ...(paymentStatus ? { paymentStatus } : {})
          };
        }
        return o;
      })
    });
  }
}

export const store = new StateStore();
