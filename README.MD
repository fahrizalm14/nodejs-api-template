# Solid Node.js API - Arsitektur Modular & Fleksibel

Ini adalah template proyek API Node.js yang dibangun dengan arsitektur **Modular Monolith** yang solid, modern, dan siap untuk dikembangkan menjadi microservice. Proyek ini menggunakan TypeScript dan berfokus pada *Developer Experience* (DX) yang tinggi dengan otomasi dan praktik terbaik.

-----

## ✨ Fitur Utama

* **Modular Monolith**: Setiap fitur aplikasi (modul) terisolasi dalam direktorinya sendiri, siap untuk diangkat menjadi microservice.
* **Dependency Injection**: Menggunakan **Tsyringe** untuk *Inversion of Control* (IoC), membuat kode sangat *testable* dan terstruktur.
* **Configuration-Driven**: Arsitektur yang dikendalikan oleh file `deployment.config.ts` untuk fleksibilitas maksimal saat development dan production.
* **Skrip Otomatis**: Dilengkapi dengan skrip untuk membuat dan menghapus modul secara otomatis, mempercepat alur kerja.
* **Build Produksi Otomatis**: Skrip untuk menghasilkan `Dockerfile` secara otomatis untuk setiap target deploy (microservice atau mini-monolith).
* **Praktik Terbaik**: Menggunakan TypeScript, ESLint, Prettier, dan logging terstruktur dengan Pino.
* **Siap Pakai**: Termasuk unit test dasar dengan Jest yang dibuat secara otomatis.

-----

## 🛠️ Prasyarat

* **Node.js**: `v20.x` atau lebih tinggi.
* **pnpm**: Manajer paket yang efisien. Instal dengan `npm install -g pnpm`.

-----

## 🚀 Instalasi & Penggunaan

1. **Clone repository ini (jika sudah ada di repo):**

    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd [NAMA_FOLDER]
    ```

2. **Instal semua dependensi:**

    ```bash
    pnpm install
    ```

3. **Siapkan Environment Variables:**
    Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya jika perlu.

    ```bash
    cp .env.example .env
    ```

-----

## 📂 Struktur Proyek

```
/
|-- /dist                   # Output hasil kompilasi (JavaScript)
|-- /scripts                # Skrip otomatisasi (create/delete module, etc.)
|-- /src
|   |-- /config             # Konfigurasi aplikasi, termasuk deployment.config.ts
|   |-- /core               # Fondasi server (App, Middleware)
|   |-- /modules            # Semua modul/fitur aplikasi (users, products, etc.)
|   |-- /shared             # Kode yang bisa dipakai bersama (Logger, utils)
|   |-- main.ts             # Titik masuk utama aplikasi untuk mode development
|-- .env                    # Environment variables (tidak di-commit)
|-- package.json
|-- tsconfig.json
```

-----

## ▶️ Perintah Utama

Semua perintah dijalankan dari direktori root proyek.

* **Menjalankan Server Development:**
    Server akan berjalan di port yang ditentukan di `.env` (default: 3000) dan akan otomatis restart saat ada perubahan file.

    ```bash
    pnpm dev
    ```

* **Membuat Build Produksi:**
    Mengkompilasi semua kode TypeScript ke JavaScript di dalam folder `dist`.

    ```bash
    pnpm build
    ```

* **Menjalankan Server Produksi:**
    Menjalankan aplikasi dari file hasil kompilasi.

    ```bash
    pnpm start
    ```

* **Menjalankan Unit Tests:**
    Menjalankan semua file tes (`.spec.ts`) dengan Jest.

    ```bash
    pnpm test
    ```

-----

## 🤖 Skrip Otomatisasi

Proyek ini dilengkapi skrip untuk mempercepat pengembangan.

* **Membuat Modul Baru:**
    Perintah ini akan memandu Anda secara interaktif untuk membuat struktur file lengkap (controller, service, repository, dll.) untuk modul baru dan mendaftarkannya secara otomatis.

    ```bash
    pnpm create:module
    ```

* **Menghapus Modul:**
    Menghapus direktori modul dan membersihkan referensinya dari `deployment.config.ts` secara aman.

    ```bash
    pnpm delete:module
    ```

* **Membuat Artefak Deploy (Dockerfile):**
    Perintah ini akan membaca `deployment.config.ts` dan menghasilkan `Dockerfile` serta file *entrypoint* untuk setiap target deploy yang telah Anda definisikan.

    ```bash
    pnpm build:deploys
    ```

    Hasilnya adalah file seperti `Dockerfile.main-api`, `Dockerfile.users-ms`, dll. di root proyek.

-----

## ⚙️ Konfigurasi Arsitektur (`deployment.config.ts`)

File `src/config/deployment.config.ts` adalah "panel kontrol" dari aplikasi Anda. File ini mengontrol modul mana yang aktif saat development dan bagaimana semua modul akan dikelompokkan dan di-deploy ke production.

File ini memiliki tiga bagian utama:

### 1\. `availableModules`

Bagian ini adalah **katalog** dari semua modul yang ada di dalam proyek Anda. Setiap modul yang Anda buat **harus** didaftarkan di sini. Skrip `pnpm create:module` akan melakukannya secara otomatis.

```typescript
export const availableModules: Record<string, ModuleDefinition> = {
  // Setiap modul terdaftar dengan nama dan path ke filenya
  users: { path: '@/modules/users/user.routes' },
  products: { path: '@/modules/products/product.routes' },
};
```

### 2\. `deploymentTargets`

Bagian ini mendefinisikan **unit-unit yang akan Anda deploy** di production. Setiap "target" akan menghasilkan satu `Dockerfile` dan berjalan di port-nya sendiri. Di sinilah Anda menentukan mana yang menjadi microservice dan mana yang menjadi monolith.

```typescript
export const deploymentTargets: Record<string, DeploymentTarget> = {
  // CONTOH 1: Sebuah "mini-monolith"
  // Target 'main-api' akan menjalankan service products dan orders bersamaan.
  'main-api': {
    port: 3000,
    modules: ['products', 'orders'],
  },
  // CONTOH 2: Sebuah microservice
  // Target 'users-ms' hanya akan menjalankan service users.
  'users-ms': {
    port: 3001,
    modules: ['users'],
  },
};
```

* Nama kunci (`main-api`, `users-ms`) akan digunakan untuk menamai `Dockerfile` yang dihasilkan.

### 3\. `devModeModules`

Bagian ini adalah daftar modul yang ingin Anda **jalankan secara bersamaan** saat mode development (`pnpm dev`).

```typescript
export const devModeModules: string[] = [
  'users',
  'products',
  'orders'
];
```

* Anda bisa memberi komentar pada modul di daftar ini untuk menonaktifkannya sementara saat development.

-----

## 🐳 Docker

Setelah menjalankan `pnpm build:deploys`, Anda bisa membangun dan menjalankan image Docker untuk setiap target deploy.

**Contoh untuk target `users-ms`:**

1. **Build Image:**

    ```bash
    docker build -f Dockerfile.users-ms -t users-microservice .
    ```

2. **Jalankan Kontainer:**

    ```bash
    docker run -p 3001:3001 -d users-microservice
    ```

    Service `users` sekarang berjalan di `http://localhost:3001`.
