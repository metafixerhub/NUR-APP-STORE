# 🌙 NUR APP STORE - Android APK Market

A high-performance, mobile-first and desktop-responsive **Android App Store** platform inspired by Google Play Store, custom-designed to match the **Nur App Store Twilight Mosque Glow** logo.

---

## 🎨 Color Combination & Visual Theme

The store's visual identity is directly inspired by your logo:
- **Twilight Night Sky & Minaret Silhouette**: `#050D18`, `#071526`, `#0C1E34` (Deep Indigo / Twilight Slate).
- **Glowing Crescent Moon & "Nur" 3D Typography**: `#FFFBEB`, `#FDE047`, `#F59E0B`, `#D97706` (Luminous Amber & Gold).
- **App Store Pill & Oasis Sprout**: `#043229`, `#052A24`, `#10B981`, `#34D399` (Deep Emerald & Fresh Mint Green).
- **Glassmorphism Surfaces**: Frosted cards with subtle gold and emerald glow highlights.

---

## ✨ Features

### 1. 📱 Complete Play Store User Experience
- **Mobile & Desktop Optimized**: Responsive layout with Google Play-style bottom navigation on mobile devices and top navbar on desktop.
- **Hero Spotlight Carousel**: Featured banner highlighting top trending apps with direct download actions.
- **Category Browsing**: Filter apps by `Islamic & Quran`, `Tools & Utilities`, `Social & Chat`, `Productivity`, `Education`, `Games`, `Media & Video`.
- **Top Charts & Trending**: Real-time ranking of most downloaded and highest-rated apps.
- **Search System**: Live search across apps, packages, descriptions, and tags.

### 2. 📲 App Details & Direct APK Download
- **App Header**: High-resolution squircle app icon, title, developer, category badge, and quick stats (rating, downloads, APK size, minimum Android version).
- **Direct APK Download**: One-tap download with animated progress bar, confetti celebration (`canvas-confetti`), and direct `.apk` file delivery.
- **Nur Protect™ Badge**: Verified security scan guarantee for virus-free APKs.
- **Interactive Screenshot Lightbox**: Fullscreen preview with zoom, next/previous navigation, and touch swipe.
- **Detailed Descriptions**: Short synopsis, expandable full description, and version changelog.

### 3. ⭐ Ratings & Community Comments
- **5-Star Rating Breakdown**: Visual distribution bar chart (5★ to 1★).
- **Community Comment Search**: Search reviews and comments by keywords or filter by star rating.
- **Review Submission**: Leave 1 to 5 star ratings and reviews.
- **User Account (Optional)**: Anyone can comment as a guest or sign in/create a profile.

### 4. 🛡️ Admin Portal (Upload & Manage Apps)
- **Login Credentials**:
  - **Username**: `admin`
  - **Password**: `admin`
- **Upload New App** (configured in your exact requested order):
  1. **Upload APK file** (Supports `.apk` file upload with automatic file size detection)
  2. **Upload App Icon** (Image upload with instant preview)
  3. **App Name**
  4. **App Description** (Short description for store cards)
  5. **App More Description** (Full detailed features and changelog)
  6. **How Many Stars** (Set initial star rating 1.0 - 5.0)
  7. **Screenshots & Category options**
- **Update Existing Apps**:
  - "Using admin portal we can update that app going to that app": Click **Update** on any existing app to modify its APK file, icon, descriptions, version, or rating with 1 click.
- **Delete & Moderate**: Remove apps or moderate community comments.

### 5. 🔗 Special Shareable Links & Instant QR Codes
- **Instant Share Modal**: Every published app automatically generates a unique direct link (e.g. `https://your-domain.com/app/nur-quran-pro`).
- **One-Click Copy**: Admin and visitors can copy the direct URL with one click.
- **Social Sharing**: Direct share buttons for **WhatsApp**, **Telegram**, and mobile share sheet.
- **Scan-to-Download QR Code**: Generates a scannable QR Code that anyone can point their smartphone camera at to open the app page and download the APK immediately!

---

## 🚀 Running Locally

1. Open terminal in the project directory:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
3. Access the Admin Portal:
   ```
   http://localhost:3000/admin
   ```
   - **Username**: `admin`
   - **Password**: `admin`

---

## ☁️ Deploying to Vercel (Recommended)

1. Push this repository to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your `NUR-APP-STORE` repository.
4. Next.js is automatically detected. Click **"Deploy"**.
5. Your live Nur App Store will be active with an SSL domain in under 2 minutes!

---

## 🌐 Deploying to Render

1. Push your repository to **GitHub**.
2. Go to [render.com](https://render.com) and select **"New Web Service"**.
3. Connect your repository.
4. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**.
