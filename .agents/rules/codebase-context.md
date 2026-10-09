---
description: SubRadar Codebase Architecture, File Map and Development Rules
globs: **/*
alwaysApply: true
---

# 🛡️ SubRadar Codebase Knowledge & Fast-Context Rule

Bu kural, SubRadar deposunda çalışırken **bütün dosyaları tekrar tekrar inceleme zorunluluğunu ortadan kaldırmak** amacıyla projenin tüm yapısını hafızada tutar.

## 1. MİMARİ VE KATMANLAR

- **Kök (`/`):**
  - `index.html`: `web/code.html` dosyasına anında yönlendirir.
  - `PRODUCT.md`: Ürün vizyonu, kitleler, Apple Glass tasarım standartları.
  - `README.md`: Mimari tablo, vitrin bağlantıları, lisans rehberi.
  - `AGENTS.md`: AI ajanları için hızlı proje haritası ve referans kılavuzu.
  - `CODEBASE.md`: Derinlemesine fonksiyon, DOM ID ve durum modelleri rehberi.
  - `licenses/`: MIT, Apache 2.0, BSD-3, BSD-2, GPL v3, AGPL v3, MPL 2.0, Unlicense, Proprietary tam metinleri ve karşılaştırma matrisi (`licenses/README.md`).

- **Masaüstü Uygulaması (`app/`):**
  - Durum: *Çok Yakında (Roadmap)*.
  - Planlanan mimari: Electron / Native, AES-256-CBC yerel şifreleme, SQLite yerel veri tabanı, context-isolated IPC (`preload.js`).
  - Dizin: `app/src/renderer/scripts/` ve `styles/`.

- **Web Vitrini (`web/`):**
  - `code.html`: Canlı üretim sürümü (monolitik, tüm modüller birleştirilmiş, GitHub Pages'ta çalışan ana dosya).
  - `index.html`: `code.html`'e yönlendirir.
  - `components/`: 14 adet modüler HTML bileşeni:
    - `layout/`: `header.html`, `footer.html`.
    - `sections/`: `hero.html`, `problem.html`, `calculator.html`, `features.html`, `architecture.html`, `os-downloads.html`, `pricing.html`, `faq.html`.
    - `modals/`: `command-palette.html`, `download-modal.html`, `enterprise-modal.html`, `reclaim-modal.html`.
  - `css/`: `base.css` (renkler, temalar, tipografi), `components.css` (cam efektleri, kartlar, slider, animasyonlar), `main.css` (birleştirici).
  - `js/`:
    - `config.js`: Kurlar (`SR_RATES`: USD, EUR, TRY), para birimi dönüştürücü (`srConvert`).
    - `theme.js`: Açık/koyu mod (`html.light` / `html.dark`).
    - `fx.js`: Canlı döviz kurları önbellekleme (12 saat TTL).
    - `toast.js`: Kayan Apple Glass bildirimleri (`srShowToast`).
    - `calculator.js`: İsraf hesaplama formülü ($32/araç + $78/deneme) ve profil butonları.
    - `hero-window.js`: macOS simülasyonu, pencere kontrolleri, arama, sekmeler, tek tıkla iptal simülatörü.
    - `scroll-motion.js`: İlerleme çubuğu (`#sr-progress`), scrollspy, hero paralaksı.
    - `i18n.js`: Türkçe, İngilizce, Almanca sözlüğü ve dinamik arayüz çevirisi (`t()`).
    - `main.js`: Ana modül orkestratörü.
    - `modals/`: `command-palette.js` (Cmd+K), `download-modal.js`, `enterprise-modal.js`, `reclaim-modal.js`.
  - `scripts/build.py`: 14 bileşenin dosya bütünlüğünü test eden otomasyon betiği.

## 2. GELİŞTİRME PRENSİPLERİ

1. **Çift Yönlü Senkronizasyon:** `web/components/` veya `web/js/` içinde yapılan düzenlemeler, canlıda çalışan `web/code.html` dosyasına da yansıtılmalıdır.
2. **Yerellik ve Gizlilik:** Kodlara kullanıcı takip kütüphanesi, telemetri veya harici veri gönderimi eklenemez.
3. **Erişilebilirlik:** Minimum 44px dokunmatik hedefler, klavye gezintisi (`:focus-visible`, `Esc`, `Enter`, ok tuşları).
4. **Tasarım:** SF Pro font ailesi, Apple Glass (`backdrop-filter: blur(24px)`), zümrüt yeşili (`#10b981`), neon mor/indigo (`#6366f1`) ve koyu arka planlar (`#000000`, `#09090b`).

## 3. GİT & GİTHUB YAPILANDIRMASI

- **Depo Sahibi:** `Laynexsw` | **Depo:** `SubRadar`
- **Uzak Sunucu (Remote):** `origin` -> `https://github.com/Laynexsw/SubRadar.git`
- **Ana Dal:** `main`
- **Canlı Yayın (Pages):** `https://laynexsw.github.io/SubRadar/` (`main` kök `/` -> `index.html` -> `web/code.html`)
- **GitHub CLI:** `gh` yetkili kullanıcı `Laynexsw`.
  - Meta güncelleme: `gh repo edit Laynexsw/SubRadar -d "<açıklama>" -h "https://laynexsw.github.io/SubRadar/" --add-topic "<etiketler>"`
- **PowerShell Notu:** Komut zincirlerken `&&` yerine `;` kullanın (`git add . ; git commit -m "..." ; git push origin main`).

