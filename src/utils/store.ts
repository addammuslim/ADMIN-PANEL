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
  FAQItem,
  PosCartItem,
  HeldOrder,
  LoyaltyTier,
  LoyaltyReward,
  LoyaltyRules,
  MOCK_LOYALTY_TIERS,
  MOCK_LOYALTY_REWARDS,
  MOCK_LOYALTY_RULES,
  MOCK_HELD_ORDERS
} from '../data/mockData';

export type ViewType = 
  | 'dashboard'
  | 'pos'
  | 'loyalty'
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
  
  // POS System State
  posFullscreen: boolean;
  posCart: PosCartItem[];
  posCustomer: Customer | null;
  posOrderType: 'dine-in' | 'take-away' | 'delivery';
  posTableNumber: string;
  posDiscountPercent: number;
  posPointsRedeemed: number;
  heldOrders: HeldOrder[];
  
  // Tiered Loyalty State
  loyaltyTiers: LoyaltyTier[];
  loyaltyRewards: LoyaltyReward[];
  loyaltyRules: LoyaltyRules;
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
  unreadNotificationCount: 4,
  
  // POS initial state
  posFullscreen: false,
  posCart: [
    {
      product: MOCK_PRODUCTS[0],
      quantity: 1
    },
    {
      product: MOCK_PRODUCTS[1],
      quantity: 2,
      notes: 'Minta bubble wrap tebal'
    }
  ],
  posCustomer: MOCK_CUSTOMERS[0], // Jessica Tanuwijaya (Platinum)
  posOrderType: 'dine-in',
  posTableNumber: 'Meja 02',
  posDiscountPercent: 0,
  posPointsRedeemed: 0,
  heldOrders: [...MOCK_HELD_ORDERS],
  
  // Loyalty initial state
  loyaltyTiers: [...MOCK_LOYALTY_TIERS],
  loyaltyRewards: [...MOCK_LOYALTY_REWARDS],
  loyaltyRules: { ...MOCK_LOYALTY_RULES }
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

  // ==========================================================================
  // POS (Point of Sale) State Methods
  // ==========================================================================
  togglePosFullscreen(force?: boolean) {
    const nextVal = typeof force === 'boolean' ? force : !this.state.posFullscreen;
    this.setState({ posFullscreen: nextVal });
  }

  addToCart(product: Product, quantity: number = 1, notes?: string) {
    const existingIndex = this.state.posCart.findIndex((item) => item.product.id === product.id);
    let newCart: PosCartItem[];

    if (existingIndex >= 0) {
      newCart = this.state.posCart.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            notes: notes !== undefined ? notes : item.notes
          };
        }
        return item;
      });
    } else {
      newCart = [...this.state.posCart, { product, quantity, notes }];
    }

    this.setState({ posCart: newCart });
  }

  updateCartItemQty(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeCartItem(productId);
      return;
    }
    const newCart = this.state.posCart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.setState({ posCart: newCart });
  }

  updateCartItemNotes(productId: string, notes: string) {
    const newCart = this.state.posCart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, notes };
      }
      return item;
    });
    this.setState({ posCart: newCart });
  }

  removeCartItem(productId: string) {
    const newCart = this.state.posCart.filter((item) => item.product.id !== productId);
    this.setState({ posCart: newCart });
  }

  clearCart() {
    this.setState({
      posCart: [],
      posDiscountPercent: 0,
      posPointsRedeemed: 0
    });
  }

  setPosCustomer(customer: Customer | null) {
    this.setState({ posCustomer: customer });
  }

  setPosOrderType(orderType: 'dine-in' | 'take-away' | 'delivery') {
    this.setState({ posOrderType: orderType });
  }

  setPosTableNumber(tableNumber: string) {
    this.setState({ posTableNumber: tableNumber });
  }

  setPosDiscountPercent(percent: number) {
    this.setState({ posDiscountPercent: Math.max(0, Math.min(100, percent)) });
  }

  setPosPointsRedeemed(points: number) {
    this.setState({ posPointsRedeemed: Math.max(0, points) });
  }

  holdCurrentOrder(tableNumber?: string): string {
    if (this.state.posCart.length === 0) return '';

    const id = 'hold-' + Date.now();
    const orderNumber = 'POS-HLD-' + Math.floor(100 + Math.random() * 900);
    const subtotal = this.state.posCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const discount = (subtotal * this.state.posDiscountPercent) / 100;
    const tax = Math.round((subtotal - discount) * 0.11);
    const total = subtotal - discount + tax;

    const newHeld: HeldOrder = {
      id,
      orderNumber,
      customerName: this.state.posCustomer ? this.state.posCustomer.name : 'Walk-in Guest',
      customerPhone: this.state.posCustomer?.phone,
      orderType: this.state.posOrderType,
      tableNumber: tableNumber || this.state.posTableNumber || 'Meja Umum',
      items: [...this.state.posCart],
      subtotal,
      discount,
      tax,
      total,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    this.setState({
      heldOrders: [newHeld, ...this.state.heldOrders],
      posCart: [],
      posCustomer: null,
      posDiscountPercent: 0,
      posPointsRedeemed: 0
    });

    return orderNumber;
  }

  restoreHeldOrder(orderId: string) {
    const found = this.state.heldOrders.find((h) => h.id === orderId);
    if (!found) return;

    // Find customer if matching
    const cust = found.customerPhone
      ? this.state.customers.find((c) => c.phone === found.customerPhone) || null
      : null;

    this.setState({
      posCart: [...found.items],
      posCustomer: cust,
      posOrderType: found.orderType,
      posTableNumber: found.tableNumber || '',
      heldOrders: this.state.heldOrders.filter((h) => h.id !== orderId)
    });
  }

  deleteHeldOrder(orderId: string) {
    this.setState({
      heldOrders: this.state.heldOrders.filter((h) => h.id !== orderId)
    });
  }

  checkoutPos(
    paymentMethod: Order['paymentMethod'],
    amountPaid: number
  ): { newOrder: Order; pointsEarned: number; change: number } {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
    const orderNumber = 'POS-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const subtotal = this.state.posCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const promoDiscount = (subtotal * this.state.posDiscountPercent) / 100;
    const pointsDiscount = this.state.posPointsRedeemed * (this.state.loyaltyRules.pointValueInRupiah || 100);
    const totalDiscount = promoDiscount + pointsDiscount;
    const taxable = Math.max(0, subtotal - totalDiscount);
    const tax = Math.round(taxable * 0.11);
    const grandTotal = taxable + tax;
    const change = Math.max(0, amountPaid - grandTotal);

    // Calculate loyalty points earned based on Tier Multiplier!
    let multiplier = 1.0;
    if (this.state.posCustomer) {
      const tierObj = this.state.loyaltyTiers.find((t) => t.name === this.state.posCustomer?.tier);
      if (tierObj) multiplier = tierObj.multiplier;
    }

    const pointsEarned = Math.floor(
      (grandTotal / (this.state.loyaltyRules.spendPerPoint || 10000)) * multiplier
    );

    const orderItems = this.state.posCart.map((c) => ({
      productId: c.product.id,
      name: c.product.name + (c.notes ? ` (${c.notes})` : ''),
      price: c.product.price,
      quantity: c.quantity,
      total: c.product.price * c.quantity
    }));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: this.state.posCustomer ? this.state.posCustomer.name : 'Walk-in Customer (POS)',
      customerEmail: this.state.posCustomer?.email || 'pos.cashier@store.id',
      customerPhone: this.state.posCustomer?.phone || '-',
      date: dateStr,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod,
      itemsCount: this.state.posCart.reduce((sum, item) => sum + item.quantity, 0),
      items: orderItems,
      subtotal,
      discount: totalDiscount,
      shippingFee: 0,
      tax,
      grandTotal,
      shippingAddress: `POS In-Store Checkout · Type: ${this.state.posOrderType.toUpperCase()} ${
        this.state.posTableNumber ? `(${this.state.posTableNumber})` : ''
      }`,
      courier: 'In-Store Pickup / Dine-In'
    };

    // Update Customer loyalty points and cumulative spending if customer selected
    let updatedCustomers = [...this.state.customers];
    if (this.state.posCustomer) {
      updatedCustomers = updatedCustomers.map((cust) => {
        if (cust.id === this.state.posCustomer?.id) {
          const newPoints = Math.max(0, cust.loyaltyPoints - this.state.posPointsRedeemed + pointsEarned);
          const newTotalSpend = cust.totalSpending + grandTotal;

          // Check if customer qualifies for a higher Tier!
          let newTier = cust.tier;
          if (newTotalSpend >= 15000000) newTier = 'Platinum';
          else if (newTotalSpend >= 5000000) newTier = 'Gold';
          else if (newTotalSpend >= 1000000) newTier = 'Silver';

          return {
            ...cust,
            loyaltyPoints: newPoints,
            totalSpending: newTotalSpend,
            ordersCount: cust.ordersCount + 1,
            lastOrderDate: dateStr.slice(0, 10),
            tier: newTier
          };
        }
        return cust;
      });
    }

    // Add activity log
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      user: 'Kasir POS (' + this.state.currentClient.adminName + ')',
      action: `POS Order ${orderNumber} (${paymentMethod} - Rp ${grandTotal.toLocaleString('id-ID')})`,
      module: 'POS Kasir',
      date: dateStr,
      ip: '192.168.1.120',
      status: 'Success'
    };

    this.setState({
      orders: [newOrder, ...this.state.orders],
      customers: updatedCustomers,
      logs: [newLog, ...this.state.logs],
      posCart: [],
      posCustomer: null,
      posDiscountPercent: 0,
      posPointsRedeemed: 0
    });

    return { newOrder, pointsEarned, change };
  }

  // ==========================================================================
  // Tiered Loyalty Methods
  // ==========================================================================
  adjustCustomerPoints(customerId: string, pointsDelta: number, reason: string) {
    const updated = this.state.customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          loyaltyPoints: Math.max(0, c.loyaltyPoints + pointsDelta)
        };
      }
      return c;
    });

    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      user: this.state.currentClient.adminName,
      action: `Adjusted Member Points (${pointsDelta > 0 ? '+' : ''}${pointsDelta} Pts) - ${reason}`,
      module: 'Loyalty Program',
      date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5),
      ip: '127.0.0.1',
      status: 'Success'
    };

    this.setState({ customers: updated, logs: [newLog, ...this.state.logs] });
  }

  redeemLoyaltyReward(customerId: string, rewardId: string): boolean {
    const reward = this.state.loyaltyRewards.find((r) => r.id === rewardId);
    const customer = this.state.customers.find((c) => c.id === customerId);

    if (!reward || !customer) return false;
    if (customer.loyaltyPoints < reward.pointsCost) return false;
    if (reward.stock <= 0) return false;

    // Deduct points
    const updatedCust = this.state.customers.map((c) => {
      if (c.id === customerId) {
        return { ...c, loyaltyPoints: c.loyaltyPoints - reward.pointsCost };
      }
      return c;
    });

    // Update reward count
    const updatedRew = this.state.loyaltyRewards.map((r) => {
      if (r.id === rewardId) {
        return { ...r, stock: r.stock - 1, claimedCount: r.claimedCount + 1 };
      }
      return r;
    });

    this.setState({
      customers: updatedCust,
      loyaltyRewards: updatedRew
    });

    return true;
  }
}

export const store = new StateStore();
