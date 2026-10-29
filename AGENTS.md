# ⚡ SubRadar — AI Agent & Developer Fast-Context Guide (AGENTS.md)

> **Amaç:** Bu dosya, her yeni sohbette veya AI oturumunda depodaki tüm dosyaları baştan tarama ihtiyacını ortadan kaldırmak için hazırlanmış **tam ve kapsamlı kod tabanı referansıdır**. Bu dosyayı okuyan yapay zekâ asistanı, tüm mimariyi, 4 Geliştirme Dalgasını (Waves 1-4), dosya rollerini, DOM kimliklerini, otonom alt ajan yapılanmasını ve veri akışlarını anında anlar.

---

## 📌 1. Proje Özeti & Temel Felsefe

* **Proje Adı:** SubRadar v1.0 ("Akıllı Masaüstü Abonelik Takibi, Tek Tıkla Yasal İptal ve %100 Yerel AES-256 Kasa")
* **Canlı Dağıtım (Production):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Kaynak Depo:** `Laynexsw/SubRadar`
* **Lisans Modeli:** Resmi Ticari Yazılım Lisansı (`LICENSE` — Commercial License v1.0)
* **Test & Binary Durumu:**
  * **15/15 Saf Rust Birim Testi:** %100 başarı, 0 hata, 0 uyarı (`cargo test`).
  * **Tekil Yerel Binary:** `app/subradar.exe` (~3.2 MB, Ponytail YAGNI uyumlu, sıfır webview/node bloat).
* **Temel Prensipler:**
  1. **%100 Yerel ve Çevrimdışı (Zero Knowledge, Offline First):** Hiçbir banka şifresi veya API anahtarı istenmez. Finansal veriler asla bulut sunucularına çıkmaz.
  2. **Yerel Kriptografik Kasa (Saf Rust):** `AES-256-CBC` + `PBKDF2-HMAC-SHA256` (60.000 iterasyon) + `HMAC-SHA256` bütünlük doğrulaması ile veriler yerel diskte şifreli `.subradar` dosyasında saklanır (`app/src/vault.rs`). Çift yönlü AES-256 şifreli JSON yedekleme ve akıllı birleştirme desteği.
  3. **Tek Tıkla İptal, Hukuki Fesih & Chargeback:** Kullanıcıyı karmaşık iptal adımlarından kurtarır; 37 popüler servis için doğrudan iptal portalları ve Dark Pattern kılavuzları sunar; 6502 SK THH/TÜBİS, Visa/Mastercard Chargeback ve GDPR Madde 17 resmi dilekçeleri üretir.
  4. **Apple Glassmorphism UI & Originkit WebGL 2.0:** Koyu taban (`#000000`, `#09090b`), cam efektleri (`backdrop-filter: blur(24px)`), SF Pro tipografisi, 3 katmanlı token mimarisi, Raycast/Linear klavye kısayolları ve Bento Grid analitiği.

---

## 🌊 2. 4 Geliştirme Dalgası (Completed Waves 1–4)

SubRadar v1.0 mimarisi 4 stratejik geliştirme dalgası ile tamamlanmıştır:

* **Dalga 1: UI & Analitik:** Bento Grid Kategori & Harcama Analitiği, 3 Katmanlı Tasarım Sistemi Token Mimarisi (`theme.rs`), Raycast Klavye Kısayolları (`Ctrl+K`, `Ctrl+N`, `Ctrl+E`, `Ctrl+T`, `Ctrl+D`, `Space`, `Esc`), Linear Undo Toast bildirim bandı.
* **Dalga 2: Şablon & Bankalar:** 37 Popüler Servis Şablonu (6 kategori - `presets.rs`), Yerel Çoklu Banka Ekstre Formatları (Garanti BBVA, İş Bankası, Enpara, Papara, Wise, Revolut - `parser.rs`), Gizli Fiyat Artışı ve Sinsi Yenileme Algılayıcı (`detect_price_hikes`).
* **Dalga 3: Yasal Kalkan:** Resmi THH / TÜBİS (6502 SK) Tüketici Hakem Heyeti Başvuru Dilekçesi, Visa/Mastercard Ters İbraz (Chargeback) Harcama İtirazı Formu, Hizmet Bazlı Karanlık Desen (Dark Pattern) İptal Kılavuzları, Yaklaşan Yenileme & Deneme Radar Kalkanı (`legal.rs`, `presets.rs`).
* **Dalga 4: Ekip, Takvim & Yedek:** Aile & Ekip Ortak Lisans Maliyet Bölüştürücü (kişi başı pay ve tasarruf hesaplama - `models.rs`), Apple/Google/Outlook Takvim RFC 5545 iCalendar (`.ics`) ihracı (`models.rs`), Çift Yönlü AES-256 Şifreli JSON Yedekleme ve Akıllı Veri Birleştirme (`vault.rs`).

---

## 📁 3. Eksiksiz Dosya Haritası & Sorumluluklar

```text
SubRadar/
│
├── 🏛️ 1. KÖK YÖNETİM, GÜVENLİK VE METADATA KATMANI (ROOT GOVERNANCE & POLICIES)
│   ├── index.html                        # Kök yönlendirici -> web/code.html
│   ├── 404.html                          # Özel Apple Glass 404 hata sayfası (animasyonlu radar tarayıcı & hızlı aksiyonlar)
│   ├── privacy.html                      # %100 Sıfır Bilgi & Çevrimdışı Gizlilik Politikası (GDPR Madde 17 / KVKK uyumlu)
│   ├── terms.html                        # Kullanım Koşulları ve yerel sorumluluk sınırları dokümantasyonu
│   ├── thanks.html                       # Kurumsal başvuru onay ve teşekkür sayfası (takip kodlu #SR-2026-X91)
│   ├── robots.txt                        # Arama motoru indeksleme politikaları ve sitemap direktifi
│   ├── sitemap.xml                       # Çok dilli (TR/EN/DE) küresel SEO site haritası
│   ├── favicon.svg                       # Yüksek kontrastlı neon zümrüt radar favicon vektörü
│   ├── og-image.svg                      # 1200x630 Kurumsal sosyal medya (Open Graph & Twitter Card) önizleme görseli
│   ├── .nojekyll                         # GitHub Pages Jekyll statik derleyici devre dışı bırakma bayrağı
│   ├── .gitignore                        # Versiyon kontrolünden hariç tutulan sistem ve geçici dosyalar
│   ├── LICENSE                           # SubRadar Resmi Ticari Yazılım Lisansı (Commercial License v1.0)
│   ├── PRODUCT.md                        # Ürün vizyonu, hedef kitle, erişilebilirlik (WCAG) ve marka ilkeleri
│   ├── tsconfig.json                     # TypeScript / React (Originkit TSX) derleyici ve tip kontrol yapılandırması
│   ├── README.md                         # Kurumsal karşılama, mimari harita ve yönetim dokümantasyonu
│   ├── AGENTS.md                         # [BU DOSYA] AI oturumları için hızlı hafıza ve mimari özeti
│   ├── CODEBASE.md                       # Eksiksiz kod tabanı, fonksiyon imzaları ve DOM ID kataloğu
│   └── .agents/                          # Otonom AI Mühendislik Organizasyonu, Kurallar ve Yetenekler
│       ├── rules/codebase-context.md     # Geliştirme kuralları, Baş Orkestratör yetkilendirme ve hafıza politikaları
│       ├── agents/                       # 5 Departman / 21 Kalıcı Uzman Alt Ajan (Subagent) tanım dosyaları (*/agent.md)
│       └── skills/                       # 14 Yerel Skill Paketi (impeccable, ui-ux-pro-max, design-system, ui-styling, brand, banner-design, design, slides, ponytail, ponytail-review, ponytail-audit, ponytail-debt, ponytail-gain, ponytail-help)
│
├── 💻 2. MASAÜSTÜ İŞLETİM SİSTEMİ ÇEKİRDEĞİ (NATIVE RUST DESKTOP CORE - app/ v1.0)
│   ├── Cargo.toml                        # Saf Rust paket, kriptografi ve eframe/egui Native GUI bağımlılıkları (v1.0.0)
│   ├── Cargo.lock                        # Deterministik Rust bağımlılık kilit dosyası
│   ├── README.md                         # Saf Rust masaüstü uygulaması mimari, derleme ve test kılavuzu
│   ├── subradar.exe                      # Tekil yerel masaüstü binary'si (~3.2 MB, sıfır bloat, 15/15 test başarılı)
│   ├── encrypted_sqlite_aes256.subradar  # Yerel parola korumalı AES-256 şifreli veri kasası dosyası
│   └── src/                              # %100 Saf Rust Kaynak Kodları (15/15 Birim Testi Geçerli)
│       ├── main.rs                       # Konsolsuz yerel Windows GUI pencere başlatıcısı (eframe::run_native)
│       ├── theme.rs                      # 3 Katmanlı Tasarım Sistemi Token Mimarisi (Primitive/Semantic/Component)
│       ├── models.rs                     # Veri modelleri, Aile/Ekip Maliyet Bölüştürücü, iCalendar (.ics) ihracı
│       ├── presets.rs                    # 37 Popüler Servis Şablonu (6 Kategori), doğrudan iptal URL'leri ve Dark Pattern rehberleri
│       ├── parser.rs                     # Çoklu banka ekstre tarayıcısı (Garanti, İş Bankası, Enpara, Papara, Wise, Revolut) & detect_price_hikes
│       ├── legal.rs                      # Resmi THH / TÜBİS (6502 SK) dilekçesi, Visa/Mastercard Chargeback formu ve GDPR bildirimleri
│       ├── vault.rs                      # AES-256-CBC + PBKDF2 + HMAC-SHA256 şifreli kasa, çift yönlü JSON yedekleme/geri yükleme
│       └── ui.rs                         # Bento Grid analitik paneli, Raycast klavye kısayolları, Linear Undo Toast ve arayüz motoru
│
├── 🧩 3. ORIGINKIT & HARİCİ UI BİLEŞENLERİ (DESIGN SYSTEM RIG - components/)
│   └── originkit/
│       └── ui/
│           ├── tiles-loader.tsx          # Originkit CLI resmi React/TypeScript Tiles Loader bileşeni
│           └── vector-wordmark.tsx       # Originkit CLI resmi React/TypeScript Vector Wordmark bileşeni (WebGL 2.0)
│
└── 🌐 4. WEB TANITIM VİTRİNİ, SİMÜLATÖR & PWA PLATFORMU (WEB PLATFORM - web/)
    ├── code.html                         # GitHub Pages'ın sunduğu tekil monolitik üretim paketi (Tüm bileşenler, CSS ve JS dahil)
    ├── index.html                        # web/ içi hızlı kök yönlendirici -> code.html
    ├── 404.html                          # Web alt dizin 404 hata sayfası
    ├── privacy.html                      # Web alt dizin gizlilik politikası sayfası
    ├── terms.html                        # Web alt dizin kullanım koşulları sayfası
    ├── thanks.html                       # Web alt dizin başvuru teşekkür ve takip kodu sayfası
    ├── test-tiles.html                   # Originkit Tiles Loader bağımsız görsel test ve demo laboratuvarı
    ├── favicon.svg                       # Web vitrini favicon vektörü
    ├── og-image.svg                      # Web vitrini 1200x630 Open Graph sosyal medya kartı
    ├── manifest.json                     # Progressive Web App (PWA) manifesti (çevrimdışı ve tam ekran desteği)
    ├── sw.js                             # Çevrimdışı Service Worker önbellekleme motoru (v1.0 Network-First HTML)
    │
    ├── assets/                           # Web Varlık ve Medya Klasörü
    │   └── cursors/                      # Windows 11 Tailless Cursors (Jepri Creations) 32x32 RGBA imleç varlıkları (Dark / Light)
    │
    ├── vendor/                           # Yerel Üçüncü Parti Çevrimdışı Kütüphaneler
    │   └── three/                        # Donanım ivmeli 3D WebGL motoru (three.min.js, three.module.js)
    │
    ├── components/                       # 23 Parçalı Modüler HTML UI Bileşenleri
    │   ├── layout/                       # Çerçeve & Genel Düzen Bileşenleri (header, footer, cookie-banner, mobile-sticky-cta, tiles-loader)
    │   ├── sections/                     # Sayfa Bölümleri & İşlevsel Modüller
    │   │   ├── hero.html                 # macOS pencere simülasyonu, canlı iptal ve trafik ışıkları
    │   │   ├── problem.html              # Abonelik israfı, sektör verileri ve gizli taahhüt tuzakları
    │   │   ├── statement-lab.html        # Çoklu banka butonları (Garanti, Enpara, Papara, Wise, Revolut), Sinsi Zam rozetleri & çevrimdışı tarayıcı
    │   │   ├── calculator.html           # İsraf hesaplama, Aile/Ekip Ortak Lisans Bölüştürücü (2-6 kişi) ve PNG Röntgen ihracı
    │   │   ├── comparison.html           # Şeffaflık & güven karşılaştırma matrisi (SubRadar vs Bulut Uygulamaları)
    │   │   ├── features.html             # 4 Geliştirme Dalgası Bento Grid ızgarası (#waves-grid) ve Donanım İvmeli Canlı Bellek Radarı
    │   │   ├── architecture.html         # Yerel AES-256 SQLite kilitli kasa mimarisi ve sıfır-bulut ilkeleri
    │   │   ├── os-downloads.html         # macOS, Windows ve Linux platform indirme kartları ve v1.0 sürümü
    │   │   ├── hash-verifier.html        # İstemci tarafı WebCrypto SHA-256 kurulum doğrulama aracı
    │   │   ├── pricing.html              # Bireysel, Pro ($79) ve Kurumsal tek seferlik ömür boyu paket tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular akordeon bilgi paneli
    │   ├── modals/                       # Etkileşimli Modallar (command-palette, download-modal, enterprise-modal, reclaim-modal, shortcuts-modal, legal-generator-modal, auth-modal)
    │   └── originkit/                    # Modüler Originkit Tip ve React Uyumluluk Parçaları (react-shim.d.ts, tiles-loader.tsx)
    │
    ├── css/                              # Web Stil Sistemi (Apple Glassmorphism - base.css, components.css, cursors.css, main.css)
    ├── js/                               # Web İstemci Zekâsı (statement-lab.js [BANK_DATASETS & sinsi zam], calculator.js [family split], modals/...)
    └── scripts/                          # CI/CD & Derleme Otomasyon Betikleri (build.py, embed_tiles_loader.py)
```

---

## ⚙️ 4. Global Değişkenler & State Yönetimi

| Değişken / Veri | Kaynak Dosya | Açıklama |
| :--- | :--- | :--- |
| `SR_RATES` | `web/js/config.js` | USD (1), EUR (0.86), TRY (48.35) kurları ve sembolleri. |
| `srCurrency` | `web/js/config.js` | Aktif para birimi (`'USD'`, `'EUR'`, `'TRY'`). `localStorage: sr-currency`. |
| `srLang` | `web/js/i18n.js` | Aktif dil (`'tr'`, `'en'`, `'de'`). `localStorage: sr-lang`. |
| `sr-theme` | `web/js/theme.js` | `'dark'` veya `'light'`. `html` etiketine `.light` veya `.dark` ekler. |
| `sr-fx` | `web/js/fx.js` | Canlı kur API önbelleği (`{ ts, EUR, TRY }`, 12 saat geçerli). |
| `currentMonthlyBurn` | `web/js/hero-window.js` | Hero simülasyonundaki başlangıç aylık gideri ($384.20). |
| `detectedLeaksCount` | `web/js/hero-window.js` | Hero simülasyonundaki kaçak lisans adedi (3 adet). |
| `annualWasteRecoverable` | `web/js/hero-window.js` | Hero simülasyonundaki kurtarılabilir yıllık israf ($1890.00). |

---

## 🎯 5. Anahtar DOM Kimlikleri (IDs) & Tetikleyiciler

* **Tema & Dil & Kur:** `#theme-toggle`, `#theme-toggle-icon`, `#theme-toggle-label`, `.lang-btn` (`data-lang`), `.currency-btn` (`data-currency`).
* **Hero macOS Simülasyonu:** `#hero-mock-window`, `#hero-win-close`, `#hero-win-min`, `#hero-win-zoom`, `#hero-win-restore-bar`, `#hero-win-restore`, `#hero-sub-search`, `#hero-monthly-burn`, `#hero-detected-leaks`, `#hero-annual-waste`, `.direct-kill-btn`, `#hero-demo-reset`.
* **Ekstre Laboratuvarı & Sinsi Zam Dedektörü:** `#ekstre-laboratuvari`, `#lab-dropzone`, `#lab-file-input`, `#lab-sample-btn`, `#lab-reset-btn`, `#lab-bank-selector-wrap`, `#lab-bank-selector`, `.lab-bank-btn` (`data-bank="garanti|enpara|papara|wise|revolut"`), `#lab-progress-wrap`, `#lab-progress-bar`, `#lab-progress-pct`, `#lab-status-text`, `#lab-results`, `#lab-stat-count`, `#lab-stat-monthly`, `#lab-stat-yearly`, `#lab-leaks-list`, `.lab-legal-btn` (6502 SK THH & Chargeback dilekçe modal tetikleyicisi).
* **Özellikler & 4 Dalga Bento Grid:** `#ozellikler`, `#waves-grid` (Dalga 1-4 kartları: Dalga 1 Bento Analitik & Raycast Kısayolları, Dalga 2 37+ Şablon & Sinsi Zam, Dalga 3 6502 SK THH & Chargeback, Dalga 4 Aile/Ekip Payı & Takvim .ics), `#radar-scanner-section`, `#radar-screen`, `#radar-live-status`, `#radar-burn-val`, `.radar-blip`.
* **Hesaplayıcı & Aile Bölüştürücü:** `#calc-subs` (2-35), `#calc-trials` (0-15), `.calc-preset-btn`, `#calc-split-toggle`, `#calc-split-members` (2-6), `.calc-split-btn`, `#out-1yr`, `#out-5yr`, `#out-split-per-person`, `#out-split-annual-saved`, `#out-split-badge`, `#calc-export-png-btn`.
* **Modallar:** `#cmd-palette-backdrop`, `#download-modal-backdrop`, `#ent-modal-backdrop`, `#reclaim-modal-backdrop`, `#auth-modal-backdrop`, `#sr-toast`.
* **Originkit Bileşenleri:** `#sr-tiles-loader`, `#tiles-loader-btn`, `#sr-vector-wordmark`.
* **Gezinme:** `#sr-scrollspy`, `#sr-progress`, `#site-header`.

---

## 🤖 6. Otonom Mühendislik Organizasyonu & Dinamik Alt Ajan Bölünmesi

SubRadar projesi, Baş Orkestratör liderliğinde **5 Departman ve 21 Kalıcı Uzman Alt Ajan** tarafından yönetilmektedir:

```
                               ┌─────────────────────────────────┐
                               │   👑 BAŞ ORKESTRATÖR (MANAGER)  │
                               └────────────────┬────────────────┘
         ┌───────────────────┬──────────────────┼───────────────────┬───────────────────┐
         │                   │                  │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌───────▼─────────┐ ┌───────▼─────────┐ ┌───────▼─────────┐
│  DEPARTMAN A    │ │  DEPARTMAN B    │ │  DEPARTMAN C    │ │  DEPARTMAN D    │ │  DEPARTMAN E    │
│  Araştırma &    │ │  Tasarım &      │ │  Web Platformu &│ │  Masaüstü &     │ │  DevOps, QA &   │
│  Mimari Denetim │ │  Görsel Sanatlar│ │  FinOps         │ │  Kripto / Hukuk │ │  Dokümantasyon  │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│• deep-code-res. │ │• ui-ux-designer │ │• web-ui-eng.    │ │• desktop-core   │ │• git-ops-spec.  │
│• ponytail-deb.  │ │• brand-artist   │ │• hero-sim-eng.  │ │• security-crypto│ │• github-platform│
│• arch-guardian  │ │• originkit-webgl│ │• modals-eng.    │ │• legal-counsel  │ │• seo-pwa-eng.   │
│• perf-a11y-audit│ │• audio-haptics  │ │• i18n-finops    │ └─────────────────┘ │• test-runner    │
└─────────────────┘ └─────────────────┘ │• supabase-auth  │                     │• qa-docs-spec.  │
                                        └─────────────────┘                     └─────────────────┘
```

> ⚡ **Dinamik Alt Ajan Bölünmesi (Subagent Splitting & Multiplication) Yetkisi:**  
> Kullanıcının doğrudan onayı ve talimatıyla; kod geliştirme, derin hata ayıklama ve performans optimizasyonlarında uzman geliştirici alt ajanlar dinamik olarak ikili veya üçlü uzman hücrelere ayrılabilir (`subagent-driven-development`, `dispatching-parallel-agents`). Bu yetki paylaşımsız görevleri hızlandırırken tekil sorumluluk ilkesini korur.

---

## 💡 7. Geliştirme ve Test Kuralları

1. **Rust Birim Testleri:**
   ```powershell
   cd app
   cargo test
   ```
   *15/15 birim testi %100 başarıyla sonuçlanır (0 hata, 0 uyarı).*
2. **Yerel Sunucu:**
   ```bash
   python -m http.server 8765
   ```
   Erişim: `http://localhost:8765/web/code.html` veya `http://localhost:8765/`
3. **Bileşen Doğrulama:**
   ```bash
   python web/scripts/build.py
   ```
4. **KOD YAPISI & DOKÜMANTASYON SENKRONİZASYONU (ZORUNLU KURAL):**
   Kod tabanında yapılan her ekleme, silme veya mimari değişiklikte; git commit ve push işlemlerinden önce MUTLAKA `README.md`, `CODEBASE.md` ve `AGENTS.md` dosyalarındaki **Kod Yapısı (Dosya Haritası / Ağacı)**, katman durumları ve açıklamaları anında ve eksiksiz güncellenecektir. Kod ile dokümantasyonun uyuşmaması kabul edilemez.
5. **BAŞ ORKESTRATÖR VE ALT AJAN YÖNETİM KURALI (ZORUNLU):**
   Ana yapay zekâ asistanı yalnızca **Baş Orkestratör (Yönetici / Manager)** rolündedir. Görevler alt ajanlara dağıtılır, sonuçlar denetlenir ve kullanıcıya raporlanır.

---

## 🐙 8. Git & GitHub Dağıtım Bilgileri

* **GitHub Hesabı:** `Laynexsw` | **Depo:** `SubRadar`
* **Depo URL:** [https://github.com/Laynexsw/SubRadar](https://github.com/Laynexsw/SubRadar)
* **Canlı Dağıtım (GitHub Pages):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Giriş Noktası:** `index.html` -> `web/code.html`
* **Windows PowerShell Komut Kuralı:** Komut zincirlerken `&&` yerine `;` kullanılmalıdır:
  ```powershell
  git status ; git add . ; git commit -m "docs: ..." ; git push origin main
  ```
