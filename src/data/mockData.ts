/**
 * AuraMaster - Master Reusable Admin Dashboard Mock Data
 * High-fidelity, domain-authentic data for multi-client demonstration
 */

export interface ClientPreset {
  id: string;
  name: string;
  category: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  currencySymbol: string;
  logoIcon: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
}

export const CLIENT_PRESETS: ClientPreset[] = [
  {
    id: 'skincare',
    name: 'AuraGlow Skincare & Clinic',
    category: 'Skincare & Cosmetics',
    tagline: 'Premium Botanical Dermatology & Esthetics',
    primaryColor: '#e11d48', // Luxury Rose
    secondaryColor: '#fda4af',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'sparkles',
    adminName: 'dr. Amalia Putri, Sp.KK',
    adminEmail: 'amalia.putri@auraglow.id',
    adminRole: 'Super Admin'
  },
  {
    id: 'fashion',
    name: 'Maison Minimaliste Atelier',
    category: 'Fashion & Apparel',
    tagline: 'Architectural Ready-to-Wear Fashion House',
    primaryColor: '#18181b', // Luxe Slate Black
    secondaryColor: '#71717a',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'shirt',
    adminName: 'Reza Hendrawan',
    adminEmail: 'reza@maisonatelier.com',
    adminRole: 'Creative Director'
  },
  {
    id: 'restaurant',
    name: "L'Artisan Bistro & Grill",
    category: 'Food & Beverage',
    tagline: 'Modern French & Mediterranean Dining',
    primaryColor: '#b45309', // Warm Truffle Amber
    secondaryColor: '#d97706',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'utensils',
    adminName: 'Chef Marco Valentino',
    adminEmail: 'marco@artisanbistro.id',
    adminRole: 'General Manager'
  },
  {
    id: 'coffeeshop',
    name: 'Origin & Roast Coffee Lab',
    category: 'Artisan Coffee Roastery',
    tagline: 'Single Origin Specialty Beans & Brew Bar',
    primaryColor: '#78350f', // Espresso Warm
    secondaryColor: '#92400e',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'coffee',
    adminName: 'Fajar Nugraha',
    adminEmail: 'fajar@originroast.co',
    adminRole: 'Head Roaster'
  },
  {
    id: 'electronics',
    name: 'Voltix Gear Digital Tech',
    category: 'Consumer Electronics',
    tagline: 'Next-Gen Audio, Computing & Smart Gadgets',
    primaryColor: '#2563eb', // Tech Electric Blue
    secondaryColor: '#38bdf8',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'cpu',
    adminName: 'David S. Wibowo',
    adminEmail: 'david@voltixgear.io',
    adminRole: 'Tech Operations'
  },
  {
    id: 'personal',
    name: 'Adrian Pratama Growth Studio',
    category: 'Personal Brand & Advisory',
    tagline: 'Strategic Marketing & Tech Advisory',
    primaryColor: '#7c3aed', // Strategic Violet
    secondaryColor: '#a855f7',
    currency: 'IDR',
    currencySymbol: 'Rp',
    logoIcon: 'briefcase',
    adminName: 'Adrian Pratama, M.Sc.',
    adminEmail: 'contact@adrianpratama.me',
    adminRole: 'Principal Consultant'
  }
];

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft';
  image: string;
  soldCount: number;
  featured: boolean;
  bestseller: boolean;
  createdDate: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Retinol Peptide Renewal Serum 30ml',
    sku: 'AUR-SER-001',
    category: 'Face Treatment',
    price: 349000,
    salePrice: 299000,
    costPrice: 110000,
    stock: 142,
    lowStockThreshold: 20,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 1240,
    featured: true,
    bestseller: true,
    createdDate: '2026-08-12'
  },
  {
    id: 'prod-002',
    name: 'Ceramide Barrier Relief Cream 50g',
    sku: 'AUR-CRM-002',
    category: 'Moisturizer',
    price: 269000,
    salePrice: 249000,
    costPrice: 85000,
    stock: 88,
    lowStockThreshold: 15,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 960,
    featured: true,
    bestseller: true,
    createdDate: '2026-08-14'
  },
  {
    id: 'prod-003',
    name: 'Niacinamide 10% Zinc Clarifying Drops',
    sku: 'AUR-SER-003',
    category: 'Face Treatment',
    price: 219000,
    costPrice: 65000,
    stock: 8,
    lowStockThreshold: 15,
    status: 'Low Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 820,
    featured: false,
    bestseller: false,
    createdDate: '2026-08-20'
  },
  {
    id: 'prod-004',
    name: 'Centella Gentle Foaming Cleanser 150ml',
    sku: 'AUR-CLN-004',
    category: 'Cleanser',
    price: 189000,
    salePrice: 169000,
    costPrice: 50000,
    stock: 210,
    lowStockThreshold: 25,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 1510,
    featured: true,
    bestseller: true,
    createdDate: '2026-07-28'
  },
  {
    id: 'prod-005',
    name: 'Invisible Physical Sunscreen SPF50+ PA++++',
    sku: 'AUR-SUN-005',
    category: 'Sun Protection',
    price: 259000,
    costPrice: 78000,
    stock: 0,
    lowStockThreshold: 20,
    status: 'Out of Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 2100,
    featured: true,
    bestseller: true,
    createdDate: '2026-06-15'
  },
  {
    id: 'prod-006',
    name: 'Architectural Minimalist Wool Overshirt',
    sku: 'MSN-JKT-001',
    category: 'Apparel',
    price: 1250000,
    salePrice: 1099000,
    costPrice: 420000,
    stock: 34,
    lowStockThreshold: 10,
    status: 'In Stock',
    image: '/src/assets/images/fashion_jacket_1791012246013.jpg',
    soldCount: 230,
    featured: true,
    bestseller: false,
    createdDate: '2026-09-02'
  },
  {
    id: 'prod-007',
    name: 'Tailored Wide-Leg Pleated Trousers',
    sku: 'MSN-PNT-002',
    category: 'Apparel',
    price: 890000,
    costPrice: 310000,
    stock: 45,
    lowStockThreshold: 8,
    status: 'In Stock',
    image: '/src/assets/images/fashion_jacket_1791012246013.jpg',
    soldCount: 310,
    featured: false,
    bestseller: true,
    createdDate: '2026-09-05'
  },
  {
    id: 'prod-008',
    name: 'Ethical Heavyweight Raw Silk Tee',
    sku: 'MSN-TEE-003',
    category: 'Apparel',
    price: 490000,
    costPrice: 145000,
    stock: 5,
    lowStockThreshold: 12,
    status: 'Low Stock',
    image: '/src/assets/images/fashion_jacket_1791012246013.jpg',
    soldCount: 540,
    featured: false,
    bestseller: false,
    createdDate: '2026-09-10'
  },
  {
    id: 'prod-009',
    name: 'Ethiopia Yirgacheffe G1 Natural (250g)',
    sku: 'ORG-COF-001',
    category: 'Single Origin',
    price: 165000,
    costPrice: 62000,
    stock: 95,
    lowStockThreshold: 15,
    status: 'In Stock',
    image: '/src/assets/images/artisan_coffee_1791012327837.jpg',
    soldCount: 890,
    featured: true,
    bestseller: true,
    createdDate: '2026-09-18'
  },
  {
    id: 'prod-010',
    name: 'Colombia Geisha Finca El Paraiso (200g)',
    sku: 'ORG-COF-002',
    category: 'Single Origin Special',
    price: 380000,
    salePrice: 345000,
    costPrice: 180000,
    stock: 14,
    lowStockThreshold: 5,
    status: 'In Stock',
    image: '/src/assets/images/artisan_coffee_1791012327837.jpg',
    soldCount: 160,
    featured: true,
    bestseller: false,
    createdDate: '2026-09-22'
  },
  {
    id: 'prod-011',
    name: 'Hydrating Rosewater Essence Toner 200ml',
    sku: 'AUR-TON-006',
    category: 'Toner',
    price: 210000,
    costPrice: 60000,
    stock: 75,
    lowStockThreshold: 20,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 680,
    featured: false,
    bestseller: false,
    createdDate: '2026-09-01'
  },
  {
    id: 'prod-012',
    name: 'Bakuchiol 2% Botanical Oil Elixir 30ml',
    sku: 'AUR-OIL-007',
    category: 'Face Treatment',
    price: 320000,
    costPrice: 105000,
    stock: 40,
    lowStockThreshold: 10,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 410,
    featured: false,
    bestseller: false,
    createdDate: '2026-08-30'
  },
  {
    id: 'prod-013',
    name: 'Salicylic Acid 2% Exfoliating BHA Solution',
    sku: 'AUR-EXF-008',
    category: 'Exfoliant',
    price: 245000,
    costPrice: 72000,
    stock: 6,
    lowStockThreshold: 15,
    status: 'Low Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 790,
    featured: false,
    bestseller: true,
    createdDate: '2026-08-10'
  },
  {
    id: 'prod-014',
    name: 'Triple Hyaluronic Acid Plumping Serum',
    sku: 'AUR-SER-009',
    category: 'Face Treatment',
    price: 289000,
    costPrice: 90000,
    stock: 110,
    lowStockThreshold: 20,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 1120,
    featured: true,
    bestseller: true,
    createdDate: '2026-07-20'
  },
  {
    id: 'prod-015',
    name: 'Squalane Nourishing Lip Treatment 15ml',
    sku: 'AUR-LIP-010',
    category: 'Lip Care',
    price: 135000,
    costPrice: 38000,
    stock: 180,
    lowStockThreshold: 30,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 940,
    featured: false,
    bestseller: false,
    createdDate: '2026-08-05'
  },
  {
    id: 'prod-016',
    name: 'Hydrogel Caffeine Eye Revive Patches (60pcs)',
    sku: 'AUR-EYE-011',
    category: 'Eye Care',
    price: 275000,
    costPrice: 85000,
    stock: 62,
    lowStockThreshold: 15,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 530,
    featured: false,
    bestseller: false,
    createdDate: '2026-08-18'
  },
  {
    id: 'prod-017',
    name: 'Overnight Intensive Probiotic Sleeping Mask',
    sku: 'AUR-MSK-012',
    category: 'Moisturizer',
    price: 310000,
    costPrice: 95000,
    stock: 0,
    lowStockThreshold: 12,
    status: 'Out of Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 460,
    featured: false,
    bestseller: false,
    createdDate: '2026-07-15'
  },
  {
    id: 'prod-018',
    name: 'Clarifying Clay Detox Pore Mask 100g',
    sku: 'AUR-MSK-013',
    category: 'Mask',
    price: 195000,
    costPrice: 58000,
    stock: 92,
    lowStockThreshold: 20,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 620,
    featured: false,
    bestseller: false,
    createdDate: '2026-08-25'
  },
  {
    id: 'prod-019',
    name: 'Soothing Centella Mist Toner Refill 300ml',
    sku: 'AUR-TON-014',
    category: 'Toner',
    price: 250000,
    costPrice: 75000,
    stock: 125,
    lowStockThreshold: 25,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 380,
    featured: false,
    bestseller: false,
    createdDate: '2026-09-08'
  },
  {
    id: 'prod-020',
    name: 'Glow Botanical Cleansing Balm 100g',
    sku: 'AUR-CLN-015',
    category: 'Cleanser',
    price: 285000,
    costPrice: 88000,
    stock: 74,
    lowStockThreshold: 15,
    status: 'In Stock',
    image: '/src/assets/images/skincare_serum_1791012233742.jpg',
    soldCount: 810,
    featured: true,
    bestseller: true,
    createdDate: '2026-08-01'
  }
];

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Completed' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  paymentMethod: 'Bank Transfer' | 'QRIS' | 'Virtual Account' | 'COD' | 'Credit Card';
  itemsCount: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  shippingAddress: string;
  trackingNumber?: string;
  courier: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-20261002-001',
    customerName: 'Siti Rahmawati',
    customerEmail: 'siti.rahmawati@gmail.com',
    customerPhone: '+62 812-3456-7890',
    date: '2026-10-02 21:14',
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'QRIS',
    itemsCount: 2,
    items: [
      { productId: 'prod-001', name: 'Retinol Peptide Renewal Serum 30ml', price: 299000, quantity: 1, total: 299000 },
      { productId: 'prod-002', name: 'Ceramide Barrier Relief Cream 50g', price: 249000, quantity: 1, total: 249000 }
    ],
    subtotal: 548000,
    discount: 25000,
    shippingFee: 18000,
    tax: 0,
    grandTotal: 541000,
    shippingAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190',
    courier: 'JNE YES',
    trackingNumber: 'JNE991823719'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-20261002-002',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@yahoo.com',
    customerPhone: '+62 813-8822-1920',
    date: '2026-10-02 19:45',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Virtual Account',
    itemsCount: 1,
    items: [
      { productId: 'prod-004', name: 'Centella Gentle Foaming Cleanser 150ml', price: 169000, quantity: 2, total: 338000 }
    ],
    subtotal: 338000,
    discount: 0,
    shippingFee: 12000,
    tax: 0,
    grandTotal: 350000,
    shippingAddress: 'Apartemen Pakubuwono Terrace Tower S Lt. 12, Cipulir, Jakarta Selatan',
    courier: 'SiCepat BEST',
    trackingNumber: '002819382101'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-20261002-003',
    customerName: 'Dewi Lestari',
    customerEmail: 'dewi.lestari@outlook.com',
    customerPhone: '+62 818-4729-1100',
    date: '2026-10-02 18:20',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    itemsCount: 3,
    items: [
      { productId: 'prod-001', name: 'Retinol Peptide Renewal Serum 30ml', price: 299000, quantity: 1, total: 299000 },
      { productId: 'prod-014', name: 'Triple Hyaluronic Acid Plumping Serum', price: 289000, quantity: 1, total: 289000 },
      { productId: 'prod-020', name: 'Glow Botanical Cleansing Balm 100g', price: 285000, quantity: 1, total: 285000 }
    ],
    subtotal: 873000,
    discount: 50000,
    shippingFee: 0,
    tax: 0,
    grandTotal: 823000,
    shippingAddress: 'Jl. Riau No. 12, Citarum, Bandung 40115',
    courier: 'J&T Express',
    trackingNumber: 'JT992819283'
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-20261002-004',
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad.fauzi@korpora.co.id',
    customerPhone: '+62 856-7788-9901',
    date: '2026-10-02 16:05',
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Virtual Account',
    itemsCount: 1,
    items: [
      { productId: 'prod-002', name: 'Ceramide Barrier Relief Cream 50g', price: 249000, quantity: 1, total: 249000 }
    ],
    subtotal: 249000,
    discount: 0,
    shippingFee: 15000,
    tax: 0,
    grandTotal: 264000,
    shippingAddress: 'Gedung Cyber 2 Lt. 18, Jl. HR Rasuna Said Blok X-5, Kuningan, Jakarta Selatan',
    courier: 'GoSend Instant'
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-20261002-005',
    customerName: 'Jessica Tanuwijaya',
    customerEmail: 'jess.tanu@gmail.com',
    customerPhone: '+62 811-9283-0011',
    date: '2026-10-02 14:10',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    itemsCount: 4,
    items: [
      { productId: 'prod-001', name: 'Retinol Peptide Renewal Serum 30ml', price: 299000, quantity: 2, total: 598000 },
      { productId: 'prod-011', name: 'Hydrating Rosewater Essence Toner 200ml', price: 210000, quantity: 1, total: 210000 },
      { productId: 'prod-015', name: 'Squalane Nourishing Lip Treatment 15ml', price: 135000, quantity: 1, total: 135000 }
    ],
    subtotal: 943000,
    discount: 40000,
    shippingFee: 0,
    tax: 0,
    grandTotal: 903000,
    shippingAddress: 'Graha Family Blok D-14, Babatan, Wiyung, Surabaya 60227',
    courier: 'Anteraja Reguler',
    trackingNumber: 'ANT109283710'
  },
  {
    id: 'ord-106',
    orderNumber: 'ORD-20261001-006',
    customerName: 'Hendra Kusuma',
    customerEmail: 'hendra.k@gmail.com',
    customerPhone: '+62 812-9900-1122',
    date: '2026-10-01 22:30',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'QRIS',
    itemsCount: 1,
    items: [
      { productId: 'prod-004', name: 'Centella Gentle Foaming Cleanser 150ml', price: 169000, quantity: 1, total: 169000 }
    ],
    subtotal: 169000,
    discount: 0,
    shippingFee: 14000,
    tax: 0,
    grandTotal: 183000,
    shippingAddress: 'Jl. Malioboro No. 88, Gedongtengen, Yogyakarta',
    courier: 'JNE Reguler',
    trackingNumber: 'JNE887192837'
  },
  {
    id: 'ord-107',
    orderNumber: 'ORD-20261001-007',
    customerName: 'Nadia Salsabila',
    customerEmail: 'nadia.salsa@gmail.com',
    customerPhone: '+62 878-1122-3344',
    date: '2026-10-01 19:15',
    status: 'Cancelled',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Bank Transfer',
    itemsCount: 2,
    items: [
      { productId: 'prod-012', name: 'Bakuchiol 2% Botanical Oil Elixir 30ml', price: 320000, quantity: 1, total: 320000 },
      { productId: 'prod-018', name: 'Clarifying Clay Detox Pore Mask 100g', price: 195000, quantity: 1, total: 195000 }
    ],
    subtotal: 515000,
    discount: 0,
    shippingFee: 20000,
    tax: 0,
    grandTotal: 535000,
    shippingAddress: 'Jl. Pandanaran No. 102, Semarang 50241',
    courier: 'JNE Reguler'
  },
  {
    id: 'ord-108',
    orderNumber: 'ORD-20261001-008',
    customerName: 'Rian Pratama',
    customerEmail: 'rian.pratama@gmail.com',
    customerPhone: '+62 821-4455-6677',
    date: '2026-10-01 15:40',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'COD',
    itemsCount: 1,
    items: [
      { productId: 'prod-020', name: 'Glow Botanical Cleansing Balm 100g', price: 285000, quantity: 1, total: 285000 }
    ],
    subtotal: 285000,
    discount: 10000,
    shippingFee: 15000,
    tax: 0,
    grandTotal: 290000,
    shippingAddress: 'Jl. Pemuda No. 71, Rawamangun, Jakarta Timur',
    courier: 'SiCepat COD',
    trackingNumber: '002938172615'
  }
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ordersCount: number;
  totalSpending: number;
  lastOrderDate: string;
  status: 'Active' | 'Inactive';
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  loyaltyPoints: number;
  joinDate: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    name: 'Jessica Tanuwijaya',
    email: 'jess.tanu@gmail.com',
    phone: '+62 811-9283-0011',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 16,
    totalSpending: 8450000,
    lastOrderDate: '2026-10-02',
    status: 'Active',
    tier: 'Platinum',
    loyaltyPoints: 1690,
    joinDate: '2025-11-10'
  },
  {
    id: 'cust-02',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@outlook.com',
    phone: '+62 818-4729-1100',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 12,
    totalSpending: 6120000,
    lastOrderDate: '2026-10-02',
    status: 'Active',
    tier: 'Platinum',
    loyaltyPoints: 1224,
    joinDate: '2025-12-05'
  },
  {
    id: 'cust-03',
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@gmail.com',
    phone: '+62 812-3456-7890',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 8,
    totalSpending: 3890000,
    lastOrderDate: '2026-10-02',
    status: 'Active',
    tier: 'Gold',
    loyaltyPoints: 778,
    joinDate: '2026-02-14'
  },
  {
    id: 'cust-04',
    name: 'Budi Santoso',
    email: 'budi.santoso@yahoo.com',
    phone: '+62 813-8822-1920',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 5,
    totalSpending: 1850000,
    lastOrderDate: '2026-10-02',
    status: 'Active',
    tier: 'Silver',
    loyaltyPoints: 370,
    joinDate: '2026-04-20'
  },
  {
    id: 'cust-05',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@korpora.co.id',
    phone: '+62 856-7788-9901',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 4,
    totalSpending: 1290000,
    lastOrderDate: '2026-10-02',
    status: 'Active',
    tier: 'Silver',
    loyaltyPoints: 258,
    joinDate: '2026-05-18'
  },
  {
    id: 'cust-06',
    name: 'Hendra Kusuma',
    email: 'hendra.k@gmail.com',
    phone: '+62 812-9900-1122',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 6,
    totalSpending: 2150000,
    lastOrderDate: '2026-10-01',
    status: 'Active',
    tier: 'Silver',
    loyaltyPoints: 430,
    joinDate: '2026-03-01'
  },
  {
    id: 'cust-07',
    name: 'Nadia Salsabila',
    email: 'nadia.salsa@gmail.com',
    phone: '+62 878-1122-3344',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 2,
    totalSpending: 740000,
    lastOrderDate: '2026-10-01',
    status: 'Active',
    tier: 'Bronze',
    loyaltyPoints: 148,
    joinDate: '2026-07-12'
  },
  {
    id: 'cust-08',
    name: 'Rian Pratama',
    email: 'rian.pratama@gmail.com',
    phone: '+62 821-4455-6677',
    avatar: '/src/assets/images/admin_avatar_1791012221345.jpg',
    ordersCount: 3,
    totalSpending: 920000,
    lastOrderDate: '2026-10-01',
    status: 'Active',
    tier: 'Bronze',
    loyaltyPoints: 184,
    joinDate: '2026-06-25'
  }
];

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  views: number;
  status: 'Published' | 'Draft' | 'Scheduled';
  publishedDate: string;
  excerpt: string;
  content: string;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-01',
    title: 'The Dermatological Guide to Layering Retinoids with Peptides',
    slug: 'guide-layering-retinoids-peptides',
    category: 'Skincare Science',
    author: 'dr. Amalia Putri',
    views: 4820,
    status: 'Published',
    publishedDate: '2026-09-28',
    excerpt: 'Explore how peptide signaling molecules work synergistically with vitamin A derivatives to boost collagen turnover without skin barrier distress.',
    content: '<p>Retinoids represent the gold standard in topical dermatology for accelerating cellular turnover and regulating epidermal keratinization. However, barrier compromise remains a frequent side effect.</p><p>By combining encapsulated retinol with copper tripeptide-1 and palmitoyl tetrapeptide-7, we observe a 42% reduction in trans-epidermal water loss compared to standard retinoid therapy alone.</p>'
  },
  {
    id: 'art-02',
    title: 'Why Skin Barrier Integrity Dictates Long-Term Cellular Longevity',
    slug: 'skin-barrier-integrity-cellular-longevity',
    category: 'Dermatology',
    author: 'dr. Amalia Putri',
    views: 3190,
    status: 'Published',
    publishedDate: '2026-09-20',
    excerpt: 'The stratum corneum is more than dead cells: it is a complex biosensor regulating inflammation, immunity, and moisture retention.',
    content: '<p>The stratum corneum operates as an active biological membrane composed of corneocytes embedded in a lipid bilayer matrix containing ceramides, cholesterol, and free fatty acids in an equimolar ratio.</p>'
  },
  {
    id: 'art-03',
    title: 'Autumn Seasonal Skin Transition: What Your Routine Needs',
    slug: 'autumn-seasonal-skin-transition-routine',
    category: 'Routine & Lifestyle',
    author: 'Editorial Team',
    views: 1950,
    status: 'Published',
    publishedDate: '2026-09-12',
    excerpt: 'As humidity levels decline, shifting from light humectant gels to lipid-dense barrier balms prevents dehydration lines and irritation.',
    content: '<p>Transitioning into drier seasons requires adjusting both surfactant strength and lipid replacement frequency.</p>'
  },
  {
    id: 'art-04',
    title: 'Demystifying SPF and PA Ratings: Protection Against UVA vs UVB',
    slug: 'demystifying-spf-pa-ratings-uva-uvb',
    category: 'Sun Care',
    author: 'dr. Amalia Putri',
    views: 5210,
    status: 'Published',
    publishedDate: '2026-08-30',
    excerpt: 'Learn the exact photobiological distinction between erythema-inducing UVB rays and deep-penetrating collagen-degrading UVA rays.',
    content: '<p>While SPF measures sunburn protection factor primarily triggered by UVB (290-320nm), persistent pigment darkening (PPD) reflected in PA ratings measures UVA (320-400nm) defense.</p>'
  },
  {
    id: 'art-05',
    title: 'Clinical Case Study: Calming Acneiform Breakouts with Centella Asiatica',
    slug: 'clinical-study-calming-acne-centella',
    category: 'Case Studies',
    author: 'Research Lab',
    views: 840,
    status: 'Draft',
    publishedDate: '2026-10-01',
    excerpt: 'A 12-week clinical observation evaluating asiaticoside and madecassic acid extract formulations on moderate inflammatory papules.',
    content: '<p>A randomized single-blind trial evaluating 30 participants revealed an 82% reduction in erythema index following 14 days of twice-daily topical application.</p>'
  }
];

export interface Promotion {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: number;
  minSpend: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired';
}

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-01',
    code: 'GLOWFIRST15',
    type: 'Percentage',
    value: 15,
    minSpend: 250000,
    maxDiscount: 50000,
    usageCount: 428,
    usageLimit: 1000,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    status: 'Active'
  },
  {
    id: 'promo-02',
    code: 'FREESHIP10',
    type: 'Free Shipping',
    value: 20000,
    minSpend: 300000,
    usageCount: 890,
    usageLimit: 2000,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    status: 'Active'
  },
  {
    id: 'promo-03',
    code: 'BARRIERHERO',
    type: 'Fixed Amount',
    value: 50000,
    minSpend: 500000,
    usageCount: 154,
    usageLimit: 500,
    startDate: '2026-09-15',
    endDate: '2026-10-20',
    status: 'Active'
  },
  {
    id: 'promo-04',
    code: 'FLASH1010',
    type: 'Percentage',
    value: 25,
    minSpend: 400000,
    maxDiscount: 100000,
    usageCount: 0,
    usageLimit: 300,
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    status: 'Scheduled'
  },
  {
    id: 'promo-05',
    code: 'VIPPLATINUM',
    type: 'Percentage',
    value: 20,
    minSpend: 600000,
    maxDiscount: 150000,
    usageCount: 312,
    usageLimit: 350,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    status: 'Expired'
  }
];

export interface DailyReportRow {
  date: string;
  dayNumber: number;
  orders: number;
  itemsSold: number;
  revenue: number;
  discount: number;
  shipping: number;
  cogs: number;
  expenses: number;
  netProfit: number;
}

// Generate full October 2026 report rows (31 days)
export const MOCK_OCTOBER_REPORT: DailyReportRow[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const isWeekend = day % 7 === 3 || day % 7 === 4;
  const baseOrders = isWeekend ? 38 + (day * 2) % 15 : 24 + (day * 3) % 12;
  const items = Math.round(baseOrders * 1.8);
  const revenue = baseOrders * 320000 + (day * 47000) % 200000;
  const discount = Math.round(revenue * 0.05);
  const shipping = baseOrders * 14000;
  const cogs = Math.round(revenue * 0.35);
  const expenses = Math.round(revenue * 0.18);
  const netProfit = revenue - discount - cogs - expenses;

  return {
    date: `${day} October 2026`,
    dayNumber: day,
    orders: baseOrders,
    itemsSold: items,
    revenue,
    discount,
    shipping,
    cogs,
    expenses,
    netProfit
  };
});

export interface Expense {
  id: string;
  name: string;
  category: 'Marketing' | 'Shipping' | 'Salary' | 'Hosting' | 'Operational' | 'Tax' | 'Packaging';
  amount: number;
  date: string;
  notes: string;
  status: 'Approved' | 'Pending' | 'Reimbursed';
}

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    name: 'Meta Ads & Instagram Promotion Campaign Oct',
    category: 'Marketing',
    amount: 14500000,
    date: '2026-10-01',
    notes: 'Paid via corporate credit card for Q4 conversion funnel.',
    status: 'Approved'
  },
  {
    id: 'exp-02',
    name: 'Cloud Infrastructure & High-Performance CDN',
    category: 'Hosting',
    amount: 2850000,
    date: '2026-10-01',
    notes: 'Monthly Google Cloud & Varnish cache billing.',
    status: 'Approved'
  },
  {
    id: 'exp-03',
    name: 'Eco-Friendly Custom Embossed Packaging Boxes',
    category: 'Packaging',
    amount: 6200000,
    date: '2026-09-28',
    notes: '3,000 units FSC certified mailer boxes.',
    status: 'Approved'
  },
  {
    id: 'exp-04',
    name: 'Warehouse Logistics & Courier Surcharge Buffer',
    category: 'Shipping',
    amount: 3400000,
    date: '2026-09-25',
    notes: 'Pre-paid corporate shipping account top-up.',
    status: 'Approved'
  },
  {
    id: 'exp-05',
    name: 'Laboratory Stability & Microbiological Testing',
    category: 'Operational',
    amount: 4900000,
    date: '2026-09-20',
    notes: 'Batch verification at accredited dermatology testing facility.',
    status: 'Approved'
  }
];

export interface BackupHistory {
  id: string;
  filename: string;
  date: string;
  size: string;
  tablesCount: number;
  status: 'Completed' | 'In Progress' | 'Failed';
  type: 'Automatic' | 'Manual';
}

export const MOCK_BACKUPS: BackupHistory[] = [
  {
    id: 'bk-01',
    filename: 'auramaster_backup_2026-10-02_020000.sql.gz',
    date: '2026-10-02 02:00:14',
    size: '18.4 MB',
    tablesCount: 28,
    status: 'Completed',
    type: 'Automatic'
  },
  {
    id: 'bk-02',
    filename: 'auramaster_backup_2026-10-01_020000.sql.gz',
    date: '2026-10-01 02:00:10',
    size: '18.1 MB',
    tablesCount: 28,
    status: 'Completed',
    type: 'Automatic'
  },
  {
    id: 'bk-03',
    filename: 'auramaster_manual_pre_release_v2.sql.gz',
    date: '2026-09-28 15:22:45',
    size: '17.8 MB',
    tablesCount: 28,
    status: 'Completed',
    type: 'Manual'
  },
  {
    id: 'bk-04',
    filename: 'auramaster_backup_2026-09-25_020000.sql.gz',
    date: '2026-09-25 02:00:08',
    size: '17.2 MB',
    tablesCount: 28,
    status: 'Completed',
    type: 'Automatic'
  }
];

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  date: string;
  status: 'Success' | 'Warning' | 'Failed';
}

export const MOCK_LOGS: ActivityLog[] = [
  {
    id: 'log-01',
    user: 'dr. Amalia Putri',
    action: 'Updated Product Price: Retinol Peptide Renewal Serum',
    module: 'Products',
    ip: '180.252.164.21',
    date: '2026-10-02 20:45:10',
    status: 'Success'
  },
  {
    id: 'log-02',
    user: 'dr. Amalia Putri',
    action: 'Changed Order Status to Shipped #ORD-20261002-002',
    module: 'Orders',
    ip: '180.252.164.21',
    date: '2026-10-02 19:50:33',
    status: 'Success'
  },
  {
    id: 'log-03',
    user: 'Security Sentinel Bot',
    action: 'Blocked 3 Failed Password Attempts from IP 45.132.88.9',
    module: 'Authentication',
    ip: '45.132.88.9',
    date: '2026-10-02 17:12:04',
    status: 'Warning'
  },
  {
    id: 'log-04',
    user: 'Fauzan Staff',
    action: 'Generated Monthly Sales Report: September 2026',
    module: 'Reports',
    ip: '182.1.200.54',
    date: '2026-10-01 10:15:20',
    status: 'Success'
  },
  {
    id: 'log-05',
    user: 'dr. Amalia Putri',
    action: 'Created New Promotion Code: FLASH1010',
    module: 'Promotions',
    ip: '180.252.164.21',
    date: '2026-09-30 14:02:18',
    status: 'Success'
  }
];

export interface ContactMessage {
  id: string;
  sender: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Archived';
  message: string;
}

export const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    sender: 'Karin Anindita',
    email: 'karin.anindita@gmail.com',
    phone: '+62 812-7788-9911',
    subject: 'Question on pairing Retinol serum with AHA exfoliating toner',
    date: '2026-10-02 18:30',
    status: 'Unread',
    message: 'Hello dr. Amalia team, I recently bought both your Retinol Peptide Serum and the BHA exfoliating solution. What is the recommended alternating schedule for sensitive combination skin?'
  },
  {
    id: 'msg-02',
    sender: 'B2B Procurement - Apotheke Aesthetics',
    email: 'procurement@apotheke.co.id',
    phone: '+62 21-5544-2200',
    subject: 'Partnership inquiry for clinic supply in Surabaya',
    date: '2026-10-01 14:15',
    status: 'Read',
    message: 'We operate 4 aesthetic clinics in East Java and would love to discuss wholesale retail distribution terms for your barrier repair product line.'
  },
  {
    id: 'msg-03',
    sender: 'Dimas Wicaksono',
    email: 'dimas.w@yahoo.com',
    phone: '+62 856-1122-8877',
    subject: 'Delivery confirmation update for Order #ORD-20260928-091',
    date: '2026-09-29 09:40',
    status: 'Replied',
    message: 'Package arrived in pristine packaging. Thank you for the quick customer service response!'
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'Published' | 'Draft';
  order: number;
}

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    question: 'Are all formulations dermatologist-tested and non-comedogenic?',
    answer: 'Yes, every product in our clinical lineup undergoes rigorous patch testing and independent dermatological safety evaluations to ensure zero pore-clogging and high biocompatibility.',
    category: 'Product Safety',
    status: 'Published',
    order: 1
  },
  {
    id: 'faq-02',
    question: 'What is the estimated delivery timeframe across Indonesia?',
    answer: 'Orders within Jabodetabek are fulfilled within 24 hours. Inter-island shipments across Java, Sumatra, Bali, and Sulawesi arrive in 2-3 business days via our premium integrated logistics partners.',
    category: 'Shipping & Delivery',
    status: 'Published',
    order: 2
  },
  {
    id: 'faq-03',
    question: 'What is the return and refund policy for unsealed products?',
    answer: 'We provide a 100% satisfaction guarantee. If an item causes unforeseen allergic irritation within 14 days of delivery, our medical support team arranges a seamless return and full store refund.',
    category: 'Returns & Guarantee',
    status: 'Published',
    order: 3
  }
];
