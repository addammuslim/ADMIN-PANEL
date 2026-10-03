# AuraMaster - Master Reusable Admin Dashboard Template (ThemeForest-Grade)

Selamat datang di **AuraMaster Master Admin Panel**, sebuah template dashboard administratif premium, modular, ringan, dan reusable yang dirancang khusus untuk agensi digital, pengembang web, dan software house dalam menjual berbagai jenis website kepada client (Skincare, Fashion, Restaurant, Coffee Shop, Electronics, Personal Brand, dll.).

---

## Daftar Isi
1. [Struktur Project](#1-struktur-project)
2. [Cara Menjalankan](#2-cara-menjalankan)
3. [Cara Mengganti Logo](#3-cara-mengganti-logo)
4. [Cara Mengganti Warna Theme](#4-cara-mengganti-warna-theme)
5. [Cara Menambah Menu Navigasi](#5-cara-menambah-menu-navigasi)
6. [Cara Membuat Halaman Baru](#6-cara-membuat-halaman-baru)
7. [Cara Menggunakan UI Components](#7-cara-menggunakan-ui-components)
8. [Cara Menggunakan Modal & Dialog](#8-cara-menggunakan-modal--dialog)
9. [Cara Menggunakan Data Table](#9-cara-menggunakan-data-table)
10. [Cara Menggunakan Pagination](#10-cara-menggunakan-pagination)
11. [Cara Menggunakan Image Uploader & Drag-and-Drop](#11-cara-menggunakan-image-uploader)
12. [Cara Mengintegrasikan API](#12-cara-mengintegrasikan-api)
13. [Cara Mengintegrasikan PHP Native](#13-cara-mengintegrasikan-php-native)
14. [Cara Mengintegrasikan MySQLi & Prepared Statements](#14-cara-mengintegrasikan-mysqli)
15. [Cara Deployment (Apache, Nginx, cPanel, VPS)](#15-cara-deployment)

---

## 1. Struktur Project

```text
auramaster-admin/
├── index.html                  # Entry point HTML aplikasi
├── metadata.json               # Konfigurasi app metadata
├── package.json                # Dependencies & script runner
├── README.md                   # Dokumentasi master lengkap
│
├── src/                        # Core Frontend Dashboard (Vanilla TS/JS)
│   ├── main.ts                 # Master orchestrator & event bus
│   ├── index.css               # Import Tailwind & CSS Variables
│   ├── styles/
│   │   └── admin.css           # Design system, CSS variables, typography, shadows
│   ├── components/
│   │   ├── navigation.ts       # Sidebar (collapsible & mobile drawer) & Topbar
│   │   └── searchModal.ts      # Spotlight search bar (Ctrl + K)
│   ├── data/
│   │   └── mockData.ts         # Realistic multi-client dummy data & presets
│   ├── utils/
│   │   ├── store.ts            # Reactive lightweight state manager
│   │   ├── formatters.ts       # Format mata uang (Rp), tanggal & angka tabular
│   │   ├── toast.ts            # Dispatcher notifikasi toast
│   │   ├── modal.ts            # Accessible modal & confirmAction dialog
│   │   └── charts.ts           # Pure SVG spline & donut chart engine (< 4KB)
│   └── views/
│       ├── dashboard.ts        # Welcome banner, 6 KPI cards, SVG charts, recent orders
│       ├── products.ts         # Catalog table, multi-tab modal editor, bulk actions
│       ├── orders.ts           # Orders manager, status timeline, print invoice
│       ├── customers.ts        # Customer LTV, VIP loyalty tier, profile modal
│       ├── articles.ts         # Blog CMS dengan Rich Text Editor toolbar
│       ├── promotions.ts       # Voucher coupons generator & discount logic
│       ├── reports.ts          # Laporan harian Oktober 2026 (31 hari) & settlement
│       ├── profitLoss.ts       # Laporan Laba Rugi resmi GAAP (P&L)
│       ├── expenses.ts         # Log pengeluaran operasional & approval status
│       ├── settings.ts         # 12 tab pengaturan website & branding lengkap
│       ├── cmsPages.ts         # CMS halaman statis & kebijakan privasi
│       ├── aboutCms.ts         # Editor konten profil About Us & visi misi
│       ├── faq.ts              # FAQ accordion interaktif
│       ├── media.ts            # Media CDN library dengan drag & drop upload
│       ├── backup.ts           # Manajemen snapshot MySQLi dump & restore dialog
│       ├── contactInbox.ts     # Kotak masuk pesan pelanggan & balas email
│       ├── activityLogs.ts     # Audit log aktivitas keamanan operator
│       ├── usersRoles.ts       # Manajemen staf & matriks RBAC permissions
│       ├── utilities.ts        # UI component library dengan tombol Copy Code
│       └── authViews.ts        # Login, Register, Forgot, Lock Screen, 404, Maint.
│
└── php-backend/                # Backend Kit PHP Native + MySQLi
    ├── config/
    │   ├── database.php        # Koneksi aman MySQLi utf8mb4
    │   └── security.php        # Proteksi CSRF Token & sanitasi XSS
    ├── database/
    │   └── schema.sql          # Skema database MySQLi siap import
    └── api/
        ├── products/
        │   ├── get.php         # Prepared statement SELECT dengan pagination
        │   ├── create.php      # Prepared statement INSERT dengan validasi
        │   └── delete.php      # Prepared statement DELETE
        ├── orders/
        │   └── get.php         # Prepared statement SELECT orders + items join
        └── backup/
            └── create.php      # Engine native backup dump tanpa dependency
```

---

## 2. Cara Menjalankan

### Mode Modern (Vite Development Server):
```bash
npm install
npm run dev
```
Aplikasi akan langsung berjalan di browser pada `http://localhost:3000`.

### Mode PHP Native / Apache (XAMPP / Laragon):
1. Salin seluruh folder project ke dalam folder `htdocs/` atau `www/`.
2. Buka phpMyAdmin, buat database bernama `auramaster_db`.
3. Import file `php-backend/database/schema.sql`.
4. Sesuaikan kredensial di `php-backend/config/database.php`.
5. Akses melalui browser: `http://localhost/auramaster-admin/`.

---

## 3. Cara Mengganti Logo

Anda tidak perlu mengubah puluhan file HTML. Cukup sesuaikan badge logo pada `src/components/navigation.ts` atau melalui menu **Website Settings -> Branding**:

```html
<!-- Ganti elemen icon di sidebar header -->
<div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg">
  <!-- Ganti huruf inisial atau letakkan tag <img> logo client Anda di sini -->
  <img src="/assets/images/client_logo.svg" alt="Logo" class="w-7 h-7 object-contain" />
</div>
```

---

## 4. Cara Mengganti Warna Theme (CSS Variables)

Setiap client dapat memiliki identitas warna yang sepenuhnya unik tanpa menyentuh CSS komponen satu per satu. Cukup ubah CSS Variables di `:root` pada `src/styles/admin.css`:

```css
:root {
  /* Skincare: Rose Luxury */
  --primary: #e11d48;
  --secondary: #fda4af;

  /* ATAU Fashion: Monochrome Minimalist */
  /* --primary: #18181b; */
  /* --secondary: #71717a; */

  /* ATAU Restaurant / Bistro: Warm Truffle */
  /* --primary: #b45309; */
  /* --secondary: #d97706; */

  /* ATAU Tech Store: Electric Blue */
  /* --primary: #2563eb; */
  /* --secondary: #38bdf8; */
}
```

Aplikasi juga dilengkapi **Client Preset Switcher** di Topbar yang mengubah variabel ini secara live saat demo kepada client!

---

## 5. Cara Menambah Menu Navigasi

Buka file `src/components/navigation.ts`, lalu tambahkan objek menu baru pada array `NAV_GROUPS`:

```typescript
{
  title: 'Manajemen Khusus',
  items: [
    {
      id: 'custom-view',
      label: 'Menu Baru Client',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">...</svg>`,
      badge: 'Baru',
      badgeClass: 'bg-emerald-500/10 text-emerald-600'
    }
  ]
}
```

---

## 6. Cara Membuat Halaman Baru

1. Buat file view baru di `src/views/myNewPage.ts`:
```typescript
import { store } from '../utils/store';

export function renderMyNewPageView(): string {
  return `
    <div class="space-y-4">
      <h1 class="text-xl font-bold">Judul Halaman Baru</h1>
      <div class="card p-6">Konten halaman Anda di sini...</div>
    </div>
  `;
}

export function initMyNewPageEvents() {
  // Tambahkan event listener di sini
}
```
2. Daftarkan view name pada `ViewType` di `src/utils/store.ts`.
3. Tambahkan case rendering di `src/main.ts`.

---

## 7. Cara Menggunakan UI Components

Buka menu **UI Components Library** di admin dashboard untuk melihat live preview, deskripsi penggunaan, dan tombol **[Copy Code]** untuk seluruh komponen:

### Button Utama:
```html
<button class="btn btn-primary">
  Save Changes
</button>
```

### Status Badge:
```html
<span class="badge badge-success">
  <span class="badge-dot"></span>
  Completed
</span>
```

### Alert Box:
```html
<div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-2">
  <span>Operasi berhasil disimpan.</span>
</div>
```

---

## 8. Cara Menggunakan Modal & Dialog

AuraMaster memiliki helper modal Vanilla JS bawaan yang ramah aksesibilitas:

```javascript
import { openModal, closeModal, confirmAction } from '../utils/modal';

// 1. Modal Standar
openModal({
  title: 'Judul Dialog Modal',
  size: 'md', // 'sm' | 'md' | 'lg' | 'xl'
  bodyHtml: '<p>Isi konten modal...</p>',
  footerHtml: '<button class="btn btn-secondary modal-cancel-btn">Tutup</button>'
});

// 2. Dialog Konfirmasi Hapus
confirmAction({
  title: 'Hapus Data?',
  message: 'Apakah Anda yakin ingin menghapus data ini?',
  confirmText: 'Hapus Sekarang',
  isDanger: true,
  onConfirm: () => {
    // Jalankan query hapus database
  }
});
```

---

## 9. Cara Menggunakan Data Table

Data table dirancang rapi dengan class `.data-table` dan `.table-container` untuk responsive horizontal scroll:

```html
<div class="card overflow-hidden">
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>Kode SKU</th>
          <th>Nama Produk</th>
          <th>Harga</th>
          <th>Status</th>
          <th class="text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-mono">SKU-001</td>
          <td class="font-semibold">Serum Wajah</td>
          <td class="tabular-nums">Rp 199.000</td>
          <td><span class="badge badge-success">In Stock</span></td>
          <td class="text-right"><button class="btn btn-secondary btn-sm">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## 10. Cara Menggunakan Pagination

Gunakan tabular numeric counters dan event delegation:

```html
<div class="card-footer flex items-center justify-between text-xs text-slate-500">
  <div>Menampilkan <span class="font-bold tabular-nums">1 - 10</span> dari <span class="font-bold tabular-nums">120</span> data</div>
  <div class="flex items-center gap-1.5">
    <button class="btn btn-secondary btn-sm py-1 px-2.5">Sebelumnya</button>
    <span class="px-2 font-bold tabular-nums">1 / 12</span>
    <button class="btn btn-secondary btn-sm py-1 px-2.5">Selanjutnya</button>
  </div>
</div>
```

---

## 11. Cara Menggunakan Image Uploader

Dropzone bawaan dapat memicu file dialog native:

```html
<div id="media-dropzone" class="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer">
  <input type="file" id="media-file-input" class="hidden" accept="image/*" />
  <p>Tarik & letakkan foto di sini, atau klik untuk memilih file</p>
</div>
```

---

## 12. Cara Mengintegrasikan API

Contoh memanggil endpoint PHP Native dari Vanilla JS:

```javascript
async function loadProducts(page = 1, search = '') {
  try {
    const res = await fetch(`/api/products/get.php?page=${page}&search=${encodeURIComponent(search)}`);
    const result = await res.json();
    if (result.status === 'success') {
      renderProductsTable(result.data);
    }
  } catch (err) {
    showToast({ title: 'Gagal Memuat Data', message: err.message, type: 'danger' });
  }
}
```

---

## 13. Cara Mengintegrasikan PHP Native

Struktur backend telah disiapkan di folder `php-backend/`. Setiap endpoint API memproses data secara mandiri tanpa framework berat:

```php
<?php
// Endpoint contoh: api/products/get.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

// Logika query database dijalankan di sini
echo json_encode(['status' => 'success', 'data' => $data]);
```

---

## 14. Cara Mengintegrasikan MySQLi & Prepared Statements

**PERINGATAN KEAMANAN**: Hindari SQL Injection dengan **HANYA** menggunakan Prepared Statements. Jangan pernah menggabungkan string variabel langsung ke dalam query SQL.

### Contoh INSERT Produk Baru:
```php
<?php
require_once __DIR__ . '/config/database.php';

$stmt = $conn->prepare("INSERT INTO products (sku, name, price, stock) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssdi", $sku, $name, $price, $stock);

$sku = 'AUR-SER-099';
$name = 'Barrier Cream 50g';
$price = 249000.00;
$stock = 80;

$stmt->execute();
$insertId = $conn->insert_id;
$stmt->close();
```

### Contoh SELECT Terproteksi:
```php
<?php
$stmt = $conn->prepare("SELECT id, name, price FROM products WHERE category_id = ? AND price >= ?");
$stmt->bind_param("id", $categoryId, $minPrice);

$categoryId = 3;
$minPrice = 100000;

$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['name'] . " - " . $row['price'] . "<br>";
}
$stmt->close();
```

---

## 15. Cara Deployment

### Deployment ke Apache / cPanel / Shared Hosting:
1. Jalankan `npm run build` untuk memproduksi asset bundle teroptimasi (atau gunakan file HTML/JS statis langsung).
2. Upload seluruh isi folder ke folder `public_html/admin` di cPanel via File Manager atau FTP.
3. Buat database MySQL di cPanel via menu **MySQL Databases**.
4. Buka **phpMyAdmin**, pilih database tersebut, lalu import file `php-backend/database/schema.sql`.
5. Buka file `php-backend/config/database.php` dan isi nama database, user, serta password yang dibuat di cPanel.
6. Admin Panel Anda sudah online dan siap digunakan!

### Deployment ke Nginx VPS (Ubuntu / Debian):
Konfigurasi Nginx server block:
```nginx
server {
    listen 80;
    server_name admin.clientanda.com;
    root /var/www/auramaster-admin;
    index index.html index.php;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

---

© 2026 AuraMaster Engine. Dilisensikan untuk penggunaan agensi dan penjualan website multi-klien komersial.
