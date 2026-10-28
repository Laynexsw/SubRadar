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
  - `LICENSE`: SubRadar Resmi Ticari Yazılım Lisansı (Commercial License v1.0).
  - `PRODUCT.md`: Ürün vizyonu, kitleler, Apple Glass tasarım standartları.
  - `tsconfig.json`: TypeScript / React (Originkit TSX) derleyici yapılandırması.
  - `README.md`: Mimari tablo, vitrin bağlantıları, ticari paketler ve kurulum rehberi.
  - `AGENTS.md`: AI ajanları için hızlı proje haritası ve referans kılavuzu.
  - `CODEBASE.md`: Derinlemesine fonksiyon, DOM ID ve durum modelleri rehberi.
  - `.agents/`: `rules/codebase-context.md` (kurallar), `agents/` (21 kalıcı uzman alt ajan `*/agent.md`) ve `skills/` (14 yerel skill paketi: `impeccable`, `ui-ux-pro-max`, `design-system`, `ui-styling`, `brand`, `banner-design`, `design`, `slides`, `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`).

- **Masaüstü Uygulaması (`app/` - v1.0 Aktif):**
  - Mimari: Electron çerçevesiz Apple Glass pencere (`main.js`), context-isolated IPC (`preload.js`), yerel kriptografik kasa (`vault.js` - AES-256-CBC + scrypt + HMAC-SHA256), şifreli yerel depo (`store.js`), çevrimdışı ekstre ayrıştırıcı (`statement-parser.js`) ve 6502 SK / GDPR Madde 17 yasal fesih derleyicisi (`legal-notice.js`).
  - Dizin: `app/src/main/` ve `app/src/renderer/` (`scripts/`, `styles/`, `index.html`).

- **Web Vitrini (`web/`):**
  - `code.html`: Canlı üretim sürümü (monolitik, tüm modüller birleştirilmiş, GitHub Pages'ta çalışan ana dosya).
  - `index.html`: `code.html`'e yönlendirir.
  - `assets/cursors/`: Windows 11 Tailless Cursors 32x32 RGBA imleç varlıkları.
  - `vendor/three/`: Yerel Three.js WebGL 3D motoru (`three.min.js`, `three.module.js`).
  - `components/`: 23 adet modüler HTML bileşeni (`layout/`, `sections/`, `modals/`, `originkit/`).
  - `css/`: `base.css` (renkler, temalar, tipografi), `components.css` (cam efektleri, kartlar, slider, animasyonlar), `cursors.css` (Windows 11 Tailless imleçleri), `main.css` (birleştirici).
  - `js/`: `config.js`, `supabase.js`, `i18n.js`, `theme.js`, `fx.js`, `toast.js`, `audio-fx.js`, `cursor-glow.js`, `statement-lab.js`, `hash-verifier.js`, `social-export.js`, `calculator.js`, `hero-window.js`, `tiles-loader.js`, `vector-wordmark.js`, `scroll-motion.js`, `analytics.js`, `cookie-banner.js`, `mobile-cta.js`, `main.js` ve `modals/` (`download-modal.js`, `command-palette.js`, `enterprise-modal.js`, `reclaim-modal.js`, `shortcuts-modal.js`, `legal-gen.js`, `auth-modal.js`).
  - `scripts/build.py`: 23 bileşenin dosya bütünlüğünü test eden otomasyon betiği.

## 2. GELİŞTİRME PRENSİPLERİ

1. **Çift Yönlü Senkronizasyon:** `web/components/` veya `web/js/` içinde yapılan düzenlemeler, canlıda çalışan `web/code.html` dosyasına da yansıtılmalıdır.
2. **Yerellik ve Gizlilik:** Kodlara kullanıcı takip kütüphanesi, telemetri veya harici veri gönderimi eklenemez.
3. **Erişilebilirlik:** Minimum 44px dokunmatik hedefler, klavye gezintisi (`:focus-visible`, `Esc`, `Enter`, ok tuşları).
4. **Tasarım:** SF Pro font ailesi, Apple Glass (`backdrop-filter: blur(24px)`), zümrüt yeşili (`#10b981`), neon mor/indigo (`#6366f1`) ve koyu arka planlar (`#000000`, `#09090b`).
5. **KOD YAPISI & DOKÜMANTASYON SENKRONİZASYONU (ZORUNLU KURAL):** Kod tabanında yapılan her ekleme, silme veya mimari değişiklikte; git commit ve push işlemlerinden önce MUTLAKA `README.md`, `CODEBASE.md` ve `AGENTS.md` dosyalarındaki **Kod Yapısı (Dosya Haritası / Ağacı)**, katman durumları ve açıklamaları anında ve eksiksiz güncellenecektir. Kod ile dokümantasyonun uyuşmaması kabul edilemez.
6. **BAŞ ORKESTRATÖR VE ALT AJAN (SUBAGENT) YÖNETİM KURALI (ZORUNLU — 5 DEPARTMAN / 21 UZMAN ALT AJAN):** Ana yapay zekâ asistanı yalnızca **Baş Orkestratör (Yönetici / Manager)** rolündedir. Kod geliştirme, dosya düzenleme, araştırma, test ve dokümantasyon işlerini doğrudan yapmak yerine aşağıdaki **5 Departman ve 21 Uzman Alt Ajanlık Otonom Mühendislik Organizasyonunu** oluşturup görevlendirerek (`define_subagent` / `invoke_subagent`) yürütür; sonuçları denetler ve kullanıcıya raporlar:
   - **A. Araştırma, Kod Yıkımı (Debloat) & Mimari Denetim Departmanı:**
     1. `deep-code-researcher`: Derin kod analizi, DOM ID ve veri akışı haritalama, bağımlılık ve fizibilite araştırmacısı.
     2. `ponytail-debloater`: Kod yıkıcı / sadeleştirici (`ponytail`, `ponytail-audit`, `ponytail-review`), ölü kod temizliği, YAGNI ve refactoring uzmanı.
     3. `architecture-sync-guardian`: 23 modüler web bileşeni (`web/components/`, `css/`, `js/`) ile monolitik `web/code.html` arasındaki 1:1 eşitliği koruyan senkronizasyon muhafızı.
     4. `performance-a11y-auditor`: 60FPS çalışma zamanı performansı, GPU/WebGL bellek optimizasyonu, ARIA erişilebilirlik ve mobil ergonomi denetçisi.
   - **B. Tasarım, Marka & Görsel Sanatlar Departmanı:**
     5. `ui-ux-glass-designer`: Baş Tasarımcı; `impeccable`, `ui-ux-pro-max`, `design-system` ve `ui-styling` yetenekleriyle Apple Glassmorphism, SF Pro tipografi ve tema kontrast mimarı.
     6. `brand-visual-artist`: Marka kimliği (`brand`, `design`, `banner-design`), özel SVG ikonlar (`favicon.svg`, `og-image.svg`), 1200x630 Canvas sosyal medya kartı ve Windows 11 Tailless imleç (`cursors.css`) tasarımcısı.
     7. `originkit-webgl-specialist`: Originkit `Tiles Loader` (`tiles-loader.js`), `Vector Wordmark` WebGL 2.0 (`vector-wordmark.js`), Three.js 3D sahneleri ve mikro-animasyon uzmanı.
     8. `audio-haptics-engineer`: Web Audio API sıfır-dosya matematiksel osilatör ses motoru (`audio-fx.js`) ve dokunsal arayüz geri bildirim mühendisi.
   - **C. Web Platformu & FinOps Mühendislik Departmanı:**
     9. `web-ui-engineer`: Modüler `web/components/`, `web/css/`, `web/js/` ve `web/code.html` ön yüz geliştirme uzmanı.
     10. `hero-simulator-engineer`: Hero macOS pencere simülatörü (`hero-window.js`), trafik ışıkları, canlı iptal simülasyonu ve gerçek zamanlı sayaçlar mühendisi.
     11. `interactive-modals-engineer`: Raycast/Linear stili `⌘K` Komut Paleti (`command-palette.js`), kısayollar modalı (`shortcuts-modal.js`), indirme/reclaim modalları ve Toast mühendisi.
     12. `i18n-finops-specialist`: TR/EN/DE lokalizasyon (`i18n.js`), canlı döviz kurları (`fx.js`, `config.js`), abonelik tasarruf hesaplayıcı (`calculator.js`) ve çevrimdışı ekstre analizörü (`statement-lab.js`) uzmanı.
     13. `supabase-auth-specialist`: Supabase v2 SDK (`supabase.js`), Double-Slider Apple Glass Auth modalı (`auth-modal.js`) ve kurumsal başvuru (`enterprise-modal.js`) uzmanı.
   - **D. Masaüstü Çekirdeği, Kriptografi & Hukuk Departmanı:**
     14. `desktop-core-engineer`: `app/` v1.0 Electron (`main.js`, `preload.js`) ve masaüstü arayüz (`app/src/renderer/`) çekirdek mühendisi.
     15. `security-crypto-auditor`: AES-256-CBC + scrypt + HMAC-SHA256 yerel kasa (`vault.js`, `store.js`), WebCrypto SHA-256 doğrulayıcı (`hash-verifier.js`) ve sıfır-telemetri güvenlik denetçisi.
     16. `legal-compliance-counsel`: 6502 SK & GDPR Madde 17 resmi fesih ihtarname derleyicisi (`legal-notice.js`, `legal-gen.js`), `privacy.html`, `terms.html` ve Ticari Yazılım Lisansı (`LICENSE` v1.0) hukuk uzmanı.
   - **E. DevOps, Git/GitHub, Kalite Kontrol & Dokümantasyon Departmanı:**
     17. `git-ops-specialist`: Yerel Git versiyon kontrol operasyonları (`git status`, `diff`, `branch`, kurumsal `commit`, `tag` ve `push`) uzmanı.
     18. `github-platform-manager`: GitHub platform ve vitrin yöneticisi (`gh repo edit`, depo adı, açıklama, homepage URL, topics/etiketler, Releases ve GitHub Pages ayarları).
     19. `seo-pwa-release-engineer`: PWA Service Worker (`sw.js`, `manifest.json`), SEO (`sitemap.xml`, `robots.txt`, `404.html`, `thanks.html`) ve sürüm hazırlık mühendisi.
     20. `test-automation-runner`: Birim testleri (`vault.test.js`, `parser.test.js`), bileşen doğrulama (`build.py`) ve uçtan uca test otomasyon koşucusu.
     21. `qa-docs-specialist`: Kalite kontrol ve zorunlu dokümantasyon (`README.md`, `CODEBASE.md`, `AGENTS.md`, `.agents/rules/`) senkronizasyon uzmanı.

## 3. GİT & GİTHUB YAPILANDIRMASI

- **Depo Sahibi:** `Laynexsw` | **Depo:** `SubRadar`
- **Uzak Sunucu (Remote):** `origin` -> `https://github.com/Laynexsw/SubRadar.git`
- **Ana Dal:** `main`
- **Canlı Yayın (Pages):** `https://laynexsw.github.io/SubRadar/` (`main` kök `/` -> `index.html` -> `web/code.html`)
- **GitHub CLI:** `gh` yetkili kullanıcı `Laynexsw`.
  - Meta güncelleme: `gh repo edit Laynexsw/SubRadar -d "<açıklama>" -h "https://laynexsw.github.io/SubRadar/" --add-topic "<etiketler>"`
- **PowerShell Notu:** Komut zincirlerken `&&` yerine `;` kullanın (`git add . ; git commit -m "..." ; git push origin main`).

