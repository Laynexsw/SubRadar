# ⚡ SubRadar — AI Agent & Developer Fast-Context Guide (AGENTS.md)

> **Amaç:** Bu dosya, her yeni sohbette veya AI oturumunda depodaki tüm dosyaları baştan tarama ihtiyacını ortadan kaldırmak için hazırlanmış **tam ve kapsamlı kod tabanı referansıdır**. Bu dosyayı okuyan yapay zekâ asistanı, tüm mimariyi, dosya rollerini, DOM kimliklerini ve veri akışlarını anında anlar.

---

## 📌 1. Proje Özeti & Temel Felsefe

* **Proje Adı:** SubRadar Enterprise & Personal FinOps ("Masaüstü Abonelik Zekâsı, Tek Tıkla Yasal İptal ve %100 Yerel AES-256 Kasa")
* **Canlı Dağıtım (Production):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Kaynak Depo:** `Laynexsw/SubRadar`
* **Temel Prensipler:**
  1. **%100 Yerel ve Çevrimdışı (Zero Knowledge, Air-Gap First):** Hiçbir banka şifresi veya API anahtarı istenmez. Finansal veriler asla bulut sunucularına çıkmaz.
  2. **Yerel Kriptografik Kasa:** AES-256-CBC + scrypt (CPU/Memory-hard KDF) + HMAC-SHA256 bütünlük doğrulaması ile veriler yerel diskte şifreli SQLite dosyasında (`encrypted_sqlite_aes256.subradar`) saklanır.
  3. **Karanlık Desensiz Tek Tıkla İptal & Hukuki Fesih:** Kullanıcıyı manipülatif iptal labirentlerinden kurtarır; doğrudan servis iptal portallarına ulaştırır ve 6502 SK & GDPR Madde 17 resmi fesih ihtarname metinleri üretir.
  4. **Apple Glassmorphism UI & Originkit WebGL 2.0:** Koyu taban (`#000000`, `#09090b`), cam efektleri (`backdrop-filter: blur(24px)`), SF Pro tipografisi, Raycast/Linear ergonomisi ve donanım ivmeli görsel zekâ.

---

## 🏗️ 2. Kritik Mimari İkiliği (Modular vs. Standalone)

Bu depoda **iki paralel katman** bulunur. Kod geliştirirken veya düzenlerken bu ayrım mutlaka bilinmelidir:

1. **Modüler Kaynak Katmanı (`web/components/`, `web/css/`, `web/js/`):**
   * Bakımı ve denetimi kolaylaştırmak için ayrıştırılmış 23 adet HTML bileşeni, modüler CSS dosyaları ve ES6 JavaScript modülleri.
   * `web/scripts/build.py` bu 23 bileşenin bütünlüğünü doğrular.
2. **Tekil Üretim Paketi (`web/code.html`):**
   * GitHub Pages ve yerel sunucuların doğrudan sunduğu, tüm CSS, JS, SVG ve HTML parçalarını tek çatı altında birleştiren monolitik dosya.
   * Kök dizindeki `index.html` ve `web/index.html`, ziyaretçiyi doğrudan `web/code.html`'e yönlendirir (`meta refresh` + `window.location.replace`).
   * **Önemli Not:** Web vitrininde yapılacak arayüz güncellemeleri hem ilgili modüler dosyada hem de canlı dağıtım dosyası olan `web/code.html` içinde güncellenmelidir!

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
│   ├── LICENSE                           # Proje ana MIT Açık Kaynak Lisansı
│   ├── README.md                         # Kurumsal karşılama, mimari harita ve yönetim dokümantasyonu
│   ├── AGENTS.md                         # [BU DOSYA] AI oturumları için hızlı hafıza ve mimari özeti
│   ├── CODEBASE.md                       # Eksiksiz kod tabanı, fonksiyon imzaları ve DOM ID kataloğu
│   └── .agents/rules/                    # Geliştirme kuralları, agent yetkilendirme ve hafıza politikaları
│
├── 📜 2. KURUMSAL LİSANS ŞABLON KOLEKSİYONU & MATRİSİ (LICENSES FRAMEWORK - licenses/)
│   ├── README.md                         # Lisans karşılaştırma matrisi, ticari haklar ve kurumsal seçim rehberi
│   ├── MIT.txt                           # Varsayılan izin verici (Permissive) açık kaynak lisansı
│   ├── APACHE-2.0.txt                    # Patent koruması içeren kurumsal izin verici lisans
│   ├── BSD-3-CLAUSE.txt                  # Reklam ve isim kullanım kısıtlamalı izin verici lisans
│   ├── BSD-2-CLAUSE.txt                  # Sadeleştirilmiş 2 maddeli FreeBSD açık kaynak lisansı
│   ├── GPL-3.0.txt                       # Güçlü copyleft genel kamu lisansı
│   ├── AGPL-3.0.txt                      # Bulut ve SaaS dağıtımları için ağ düzeyinde güçlü copyleft lisansı
│   ├── MPL-2.0.txt                       # Dosya tabanlı zayıf copyleft kurumsal hibrit lisansı
│   ├── UNLICENSE.txt                     # Kamu malı (Public Domain) sıfır-kısıtlama feragatnamesi
│   └── PROPRIETARY.txt                   # Kapalı kaynak ticari lisans sözleşmesi metni
│
├── 💻 3. MASAÜSTÜ İŞLETİM SİSTEMİ ÇEKİRDEĞİ (DESKTOP RUNTIME CORE - app/ v1.5.0)
│   ├── package.json                      # Desktop bağımlılıkları ve çalıştırma scriptleri (start, dev, test, test:vault, test:parser)
│   ├── main.js                           # Electron ana süreci (çerçevesiz Apple Glass pencere, güvenli IPC denetleyicisi)
│   ├── preload.js                        # contextIsolation güvenli IPC köprüsü (Renderer -> Node.js subradarAPI)
│   ├── README.md                         # Masaüstü uygulaması teknik mimari, test ve çalıştırma el kitabı
│   │
│   ├── src/main/                         # Node.js Çekirdek & Kriptografik Güvenlik Katmanı
│   │   ├── vault.js                      # AES-256-CBC + scrypt + HMAC-SHA256 yerel kasa kripto motoru
│   │   ├── vault.test.js                 # Sıfır-bağımlılık kriptografik doğrulama ve bozulma birim testleri
│   │   ├── store.js                      # Şifreli yerel disk deposu yöneticisi (encrypted_sqlite_aes256.subradar)
│   │   ├── legal-notice.js               # 6502 SK & GDPR Madde 17 resmi cayma/fesih bildirim derleyicisi
│   │   ├── statement-parser.js           # 100% Çevrimdışı banka ekstresi & CSV tarayıcısı (18+ kurumsal SaaS kalıbı)
│   │   └── parser.test.js                # Ekstre ayrıştırıcı ve yasal bildirim derleyici birim testleri
│   │
│   └── src/renderer/                     # Apple Glassmorphism Masaüstü Arayüzü (SF Pro & Inter)
│       ├── .gitkeep                      # Dizin bütünlük koruyucusu
│       ├── index.html                    # Çerçevesiz ana masaüstü penceresi, 6 modül görünümü, ⌘K paleti & kasa kilit kapısı
│       ├── styles/                       # Masaüstü Stil Katmanı
│       │   ├── .gitkeep                  # Dizin koruyucu
│       │   ├── app.css                   # Çerçevesiz pencere gövdesi, trafik ışıkları, drag-region ve ızgara düzeni
│       │   └── components.css            # Cam kartlar, durum rozetleri, modallar ve kaydırıcı bileşenleri
│       └── scripts/                      # Masaüstü Arayüz Mantığı & Kütüphaneleri
│           ├── .gitkeep                  # Dizin koruyucu
│           ├── app.js                    # Masaüstü durum yönetimi, modül geçişleri, arama ve IPC dinleyicileri
│           ├── presets.js                # 16+ kurumsal SaaS ve tüketici abonelik ön ayar veritabanı
│           ├── crypto-fallback.js        # WebCrypto ve Node.js crypto arasındaki güvenli yedek köprü
│           └── three.min.js              # Masaüstü donanım ivmeli 3D arka plan efekt motoru
│
├── 🧩 4. ORIGINKIT & HARİCİ UI BİLEŞENLERİ (DESIGN SYSTEM RIG - components/)
│   └── originkit/
│       └── ui/
│           ├── tiles-loader.tsx          # Originkit CLI resmi React/TypeScript Tiles Loader bileşeni
│           └── vector-wordmark.tsx       # Originkit CLI resmi React/TypeScript Vector Wordmark bileşeni (WebGL 2.0)
│
└── 🌐 5. WEB TANITIM VİTRİNİ, SİMÜLATÖR & PWA PLATFORMU (WEB PLATFORM - web/)
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
    ├── sw.js                             # Çevrimdışı Service Worker önbellekleme motoru (v1.6.1 Network-First HTML)
    │
    ├── components/                       # 23 Parçalı Modüler HTML UI Bileşenleri
    │   ├── layout/                       # Çerçeve & Genel Düzen Bileşenleri
    │   │   ├── header.html               # Üst cam çubuk, logo, ⌘K, ses, kısayol, dil, kur ve tema kontrolleri
    │   │   ├── footer.html               # Alt bilgi, Originkit Vector Wordmark, canlı yerel gecikme ve telif bildirimleri
    │   │   ├── cookie-banner.html        # Minimal Apple Glass çerez kartı ve canlı kullanıcı telemetri onayı
    │   │   ├── mobile-sticky-cta.html    # Mobilde altta sabit kalan hızlı indirme ve aksiyon çubuğu
    │   │   └── tiles-loader.html         # Originkit Tiles Loader editoryal karo yükleme ve yüzde sayacı iskeleti
    │   │
    │   ├── sections/                     # Sayfa Bölümleri & İşlevsel Modüller
    │   │   ├── hero.html                 # Hero vitrin alanı, çift kurumsal CTA ve interaktif macOS pencere simülasyonu
    │   │   ├── problem.html              # Kurumsal abonelik israfı, sektör metrikleri ve karanlık desen teşhiri
    │   │   ├── statement-lab.html        # Canlı hava boşluğu (Air-Gap) banka ekstresi ve kaçak lisans tarayıcısı
    │   │   ├── calculator.html           # FinOps israf hesaplayıcı, kaydırıcılar, PNG röntgen ihracı ve X paylaşımı
    │   │   ├── comparison.html           # Şeffaflık & güven rakip karşılaştırma matrisi (SubRadar vs Bulut Takipçileri)
    │   │   ├── features.html             # Çekirdek 4 motor özelliği: Audit, Auto-Intercept, Bypass, Vault
    │   │   ├── architecture.html         # Yerel AES-256 SQLite şifreleme ve zero-trust mimari diyagramı
    │   │   ├── os-downloads.html         # macOS, Windows ve Linux platform indirme kartları ve sürüm bilgileri
    │   │   ├── hash-verifier.html        # İstemci tarafı WebCrypto donanım ivmeli SHA-256 kurulum doğrulayıcı
    │   │   ├── pricing.html              # Free, Pro ($79) ve Enterprise tek seferlik ömür boyu fiyatlandırma tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular (SSS) akordeon bilgi paneli
    │   │
    │   ├── modals/                       # Etkileşimli Modallar & Kullanıcı Akışları
    │   │   ├── download-modal.html       # Mimari seçimi (ARM/x86), indirme ilerleme çubuğu ve rehber modalı
    │   │   ├── command-palette.html      # ⌘K / Ctrl+K Linear stili hızlı komut paleti arama penceresi
    │   │   ├── enterprise-modal.html     # Kurumsal çoklu koltuk teklif formu (inline doğrulama & spinner)
    │   │   ├── reclaim-modal.html        # Finansal geri kazanım adımları ve CLI kurulum panosu (`curl -sSL...`)
    │   │   ├── shortcuts-modal.html      # Raycast stili Power-User klavye kısayolları modalı (`?`, `T`, `S`, `C`, `L`, `D`)
    │   │   ├── legal-generator-modal.html# Canlı 6502 SK & GDPR Madde 17 resmi cayma ve fesih ihtarnamesi sihirbazı
    │   │   └── auth-modal.html           # İkili kayan panelli (Double-Slider Sliding Overlay) Apple Glass Monokrom modalı
    │   │
    │   └── originkit/                    # Modüler Originkit Tip ve React Uyumluluk Parçaları
    │       ├── react-shim.d.ts           # Saf JS ortamı için React TypeScript tip deklarasyon köprüsü
    │       └── tiles-loader.tsx          # Modüler paket içi Originkit Tiles Loader kaynak bileşeni
    │
    ├── css/                              # Web Stil Sistemi (Apple Glassmorphism)
    │   ├── base.css                      # Renk token'ları, SF Pro/Inter tipografi hiyerarşisi, açık/koyu tema sınıfları
    │   ├── components.css                # Cam efektleri, range slider, imleç ışığı, ses dalgası ve modal animasyonları
    │   └── main.css                      # Tüm CSS modüllerini derleyen ana stil orkestrasyonu
    │
    ├── js/                               # Web İstemci Zekâsı & Modüler Betikler
    │   ├── config.js                     # Sabitler, kurlar (USD, EUR, TRY) ve para birimi yöneticisi
    │   ├── supabase.js                   # Supabase v2 JS SDK istemcisi, Auth ve Bulut Veritabanı entegrasyon köprüsü
    │   ├── i18n.js                       # Kapsamlı TR/EN/DE çok dilli sözlüğü ve DOM metin düğümü çeviricisi
    │   ├── theme.js                      # Koyu / Açık tema geçiş yöneticisi (`html.light`, `html.dark`)
    │   ├── fx.js                         # Canlı döviz kurları çekici (open.er-api / frankfurter, 12 saat TTL)
    │   ├── toast.js                      # Apple Glass kayan bildirim balonu sistemi (`srShowToast`)
    │   ├── audio-fx.js                   # Web Audio API sıfır-dosya matematiksel osilatör dokunsal ses motoru (`srAudio`)
    │   ├── cursor-glow.js                # Dinamik imleç takipçi cam aydınlatma ve ışıma motoru
    │   ├── statement-lab.js              # İstemci taraflı hava boşluklu ekstre analizörü ve kaçak abonelik dedektörü
    │   ├── hash-verifier.js              # WebCrypto API donanım ivmeli SHA-256 kurulum doğrulama motoru
    │   ├── social-export.js              # HTML5 Canvas 1200x630 "Abonelik Röntgeni" PNG kart ihracı ve X paylaşımı
    │   ├── calculator.js                 # FinOps israf hesaplama algoritması ($32/araç + $78/deneme) ve profil geçişleri
    │   ├── hero-window.js                # macOS pencere simülasyonu: trafik ışıkları, canlı iptal, arama, sayaçlar
    │   ├── tiles-loader.js               # Originkit "Tiles Loader" saf JS motoru (hücre ızgarası, edRand, % sayacı)
    │   ├── vector-wordmark.js            # Originkit "Vector Wordmark" WebGL 2.0 motoru (2 kanallı atlas, 3 düğümlü kafes)
    │   ├── scroll-motion.js              # İlerleme çizgisi (`#sr-progress`), alt gezinme adası (`#sr-scrollspy`), reveal animasyonları
    │   ├── analytics.js                  # Canlı saniye sayacı, etkileşim telemetrisi ve kullanıcı izleme motoru (`srAnalytics`)
    │   ├── cookie-banner.js              # Minimal Apple Glass çerez kartı, otomatik açılış ve onay kontrolcüsü
    │   ├── mobile-cta.js                 # Mobilde kaydırmaya bağlı beliren dinamik hızlı aksiyon çubuğu
    │   ├── main.js                       # Tüm web modüllerini ve Service Worker'ı başlatan ana giriş dosyası
    │   │
    │   └── modals/                       # Etkileşimli Modal Kontrolcüleri
    │       ├── download-modal.js         # İndirme simülasyonu, hız/boyut sayacı, SHA doğrulaması ve dosya indirici
    │       ├── command-palette.js        # ⌘K klavye kısayolu, gerçek zamanlı filtreleme ve aksiyon tetikleyicisi
    │       ├── enterprise-modal.js       # Kurumsal form alanları doğrulayıcısı (inline hata denetimi & spinner)
    │       ├── reclaim-modal.js          # CLI komut kopyalama panosu (`curl -sSL...`) ve geri kazanım adımları
    │       ├── shortcuts-modal.js        # Power-User klavye kısayol dinleyicisi (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`)
    │       ├── legal-gen.js              # Canlı yasal fesih metni derleyici, pano kopyalama ve `.txt` indirme yöneticisi
    │       └── auth-modal.js             # İkili kayan panel animasyonu (sliding overlay), sosyal giriş ve profil yöneticisi
    │
    └── scripts/                          # CI/CD & Derleme Otomasyon Betikleri
        ├── build.py                      # 23 modüler HTML bileşenini test eden ve doğrulayan Python betiği
        └── embed_tiles_loader.py         # Originkit Tiles Loader bileşenini code.html içine derleyip enjekte eden betik
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

Aşağıdaki ID'ler JavaScript tarafından dinlenir ve yönetilir:

* **Tema & Dil & Kur:**
  * `#theme-toggle`, `#theme-toggle-icon`, `#theme-toggle-label`
  * `.lang-btn` (`data-lang="EN|DE|TR"`), `.currency-btn` (`data-currency="USD|EUR|TRY"`)
* **Hero macOS Simülasyonu:**
  * `#hero-mock-window`: Simüle edilen pencere konteyneri
  * `#hero-win-close`, `#hero-win-min`, `#hero-win-zoom`: Trafik ışıkları
  * `#hero-win-restore-bar`, `#hero-win-restore`: Kapatılan pencereyi geri getirme çubuğu
  * `#hero-sub-search`: Abonelik filtreleme arama kutusu
  * `#hero-monthly-burn`, `#hero-detected-leaks`, `#hero-annual-waste`: Gösterge sayaçları
  * `.direct-kill-btn`: İlgili aboneliği anında iptal eden simülasyon butonu
  * `#hero-demo-reset`: Simülasyonu sıfırlayıp tüm servisleri geri getiren buton
* **Hesaplayıcı:**
  * `#calc-subs`: Aktif araç kaydırıcısı (2 - 35)
  * `#calc-trials`: Deneme süresi kaydırıcısı (0 - 15)
  * `.calc-preset-btn`: Bireysel (5/1), Freelancer (12/3), Ekip (28/8) profil butonları
  * `#out-1yr`, `#out-5yr`: 1 ve 5 yıllık hesaplanan kayıp göstergeleri
* **Modallar:**
  * `#cmd-palette-backdrop`: ⌘K komut paleti modalı
  * `#download-modal-backdrop`: İndirme modalı
  * `#ent-modal-backdrop`: Kurumsal form modalı
  * `#reclaim-modal-backdrop`: Geri kazanım & CLI modalı
  * `#auth-modal-backdrop`: İkili kayan panelli (Double-Slider Sliding Overlay) giriş/kayıt modalı, uzay grafiti/obsidyen marka katmanı (`.auth-overlay`), ghost outline butonlar ve profil paneli (`#auth-modal-btn`)
  * `#sr-toast`: Apple Glass bildirim balonu
* **Originkit Tiles Loader & Açılış:**
  * `#sr-tiles-loader`: Sayfa açılışında tüm ekranı kaplayan, %0 -> %100 edRand karo mürekkepleşme taşıyıcı alanı
  * `#tiles-loader-btn`: Üst bardaki grid ikonu (Animasyonu anında baştan oynatma tetikleyicisi, kısayol: `R` / `replay-tiles`)
* **Originkit Vector Wordmark:**
  * `#sr-vector-wordmark`: Alt bilgi (footer) alanında yer alan, imleç hareketine duyarlı WebGL 2.0 noktasal vektör dönüşüm alanı ve 3-düğümlü telemetri çipleri (`.sr-vector-chip`)
* **Gezinme & Yüzen Ada (Dock):**
  * `#sr-scrollspy`: Alt merkezde sabit yüzen minimalist bölüm gezinti adası (Ekstre Lab, İsraf Hesaplayıcı, Karşılaştırma, Özellikler, İşletim Sistemleri, Fiyatlandırma)
  * `#sr-progress`: Sayfa üstü minimalist kaydırma ilerleme çizgisi
  * `#site-header`: Kaydırmayla adaya dönüşen (`is-scrolled-island`) dinamik Apple Glass üst çubuğu

---

## 💡 6. Geliştirme ve Test Kuralları

1. **Yerel Sunucu:**
   ```bash
   python -m http.server 8765
   ```
   Erişim: `http://localhost:8765/web/code.html` veya `http://localhost:8765/`
2. **Bileşen Doğrulama:**
   ```bash
   python web/scripts/build.py
   ```
3. **Değişiklik Senkronizasyonu:**
   Eğer `web/components/` veya `web/js/` içinde bir geliştirme yapılıyorsa, canlı vitrin olan `web/code.html` dosyasının da senkronize kaldığından emin olunmalıdır.
4. **Sıfır Dış Bağımlılık & Güvenlik:**
   Kullanıcı verisi toplayacak hiçbir harici analytics/telemetri kütüphanesi eklenemez. Tasarım Tailwind CDN ve Google Material Symbols dışında tamamen saf CSS/JS üzerine kuruludur.
5. **KOD YAPISI & DOKÜMANTASYON SENKRONİZASYONU (ZORUNLU KURAL):**
   Kod tabanında yapılan her ekleme, silme veya mimari değişiklikte; git commit ve push işlemlerinden önce MUTLAKA `README.md`, `CODEBASE.md` ve `AGENTS.md` dosyalarındaki **Kod Yapısı (Dosya Haritası / Ağacı)**, katman durumları ve açıklamaları anında ve eksiksiz güncellenecektir. Kod ile dokümantasyonun uyuşmaması kabul edilemez.

---

## 🐙 7. Git & GitHub Yapılandırması ve Dağıtım Bilgileri

Bu bilgiler her yeni sohbette yapay zekânın doğrudan bilmesi için kaydedilmiştir:

* **GitHub Kullanıcısı / Sahibi:** `Laynexsw`
* **Depo Adı:** `SubRadar`
* **Depo URL:** [https://github.com/Laynexsw/SubRadar](https://github.com/Laynexsw/SubRadar)
* **Git Remote:** `origin` -> `https://github.com/Laynexsw/SubRadar.git`
* **Varsayılan / Ana Dal (Branch):** `main`
* **Canlı Dağıtım (GitHub Pages):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
  * Dağıtım Dalı: `main` (kök dizin `/` üzerinden sunulur)
  * Giriş Noktası: `index.html` -> anında `web/code.html`'e yönlendirir (`meta refresh` + JS `replace`)
  * `.nojekyll`: GitHub Pages'ın Jekyll motorunu devre dışı bırakarak tüm klasörleri eksiksiz sunmasını sağlar.
* **GitHub CLI (`gh`):**
  * Yetkili Hesap: `Laynexsw` (Aktif oturum açık, `repo`, `gist`, `read:org` izinleri tanımlı)
  * Canlı Açıklama (Description): `"⚡ Kurumsal & Bireysel Masaüstü Abonelik FinOps Zekâsı: Gölge IT, SaaS sprawl ve karanlık desenleri durdurun. AES-256 yerel şifreli kasa, hava boşluklu ekstre analizi, tek tıkla yasal fesih ve Apple Glass UI. Sıfır bulut, tek seferlik ömür boyu lisans."`
  * Canlı Ana Sayfa (Homepage): `https://laynexsw.github.io/SubRadar/`
  * Canlı Konular (Topics): `apple-design`, `desktop-app`, `electron`, `offline-first`, `privacy-first`, `subscription-tracker`, `license-templates`, `open-source`, `aes-256`, `dark-patterns`, `glassmorphism`, `security`, `zero-knowledge`, `gdpr`, `lifetime-deal`, `lifetime-license`, `originkit`, `webgl`, `vector-wordmark`
  * Hızlı Meta Veri Güncelleme Komutu:
    ```powershell
    gh repo edit Laynexsw/SubRadar -d "⚡ Kurumsal & Bireysel Masaüstü Abonelik FinOps Zekâsı: Gölge IT, SaaS sprawl ve karanlık desenleri durdurun. AES-256 yerel şifreli kasa, hava boşluklu ekstre analizi, tek tıkla yasal fesih ve Apple Glass UI. Sıfır bulut, tek seferlik ömür boyu lisans." -h "https://laynexsw.github.io/SubRadar/"
    ```
* **Git İş Akışı & Windows PowerShell Notu:**
  * Windows PowerShell'de komut birleştirirken `&&` yerine `;` kullanılmalıdır.
  * Standart Gönderim Rutini:
    ```powershell
    git status
    git add .
    git commit -m "docs/feat/fix: <açıklayıcı mesaj>"
    git push origin main
    ```

