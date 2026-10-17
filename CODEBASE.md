# 📚 SubRadar — Kapsamlı Kod Tabanı & Mimari Hafıza Belgesi (CODEBASE.md)

> **Bu belgenin varlık sebebi:** Gelecekteki tüm sohbetlerde ve geliştirme oturumlarında, projedeki kaynak dosyaların tekrar taranmasına gerek kalmaksızın tüm mimariyi, durum yönetimini (state), fonksiyon imzalarını ve DOM yapısını tek bakışta sunmaktır.

---

## 📑 İçindekiler
1. [Genel Bakış ve Katmanlar](#1-genel-bakış-ve-katmanlar)
2. [Dosya Kataloğu ve Sorumluluk Matrisi](#2-dosya-kataloğu-ve-sorumluluk-matrisi)
3. [Durum Yönetimi (State) ve Veri Akışı](#3-durum-yönetimi-state-ve-veri-akışı)
4. [Bileşen ve DOM ID Dizini](#4-bileşen-ve-dom-id-dizini)
5. [Tasarım ve Stil Sistemi](#5-tasarım-ve-stil-sistemi)
6. [Masaüstü Uygulaması (Roadmap)](#6-masaüstü-uygulaması-roadmap)
7. [Geliştirici İpuçları & Sık Yapılan İşlemler](#7-geliştirici-ipuçları--sık-yapılan-işlemler)

---

## 1. Genel Bakış ve Katmanlar

SubRadar, kullanıcıların abonelik israfını engelleyen, tek tıkla iptal bağlantıları sunan, %100 yerel ve çevrimdışı çalışan bir sistemdir.

Depo şu anda **üç ana katmandan** oluşur:
1. **Kök Katmanı (`/`):** Dağıtım yapılandırması (`index.html`, `.nojekyll`, `.gitignore`), lisanslar ve dokümantasyon (`README.md`, `PRODUCT.md`, `AGENTS.md`, `CODEBASE.md`).
2. **Web Vitrini Katmanı (`web/`):**
   * **Modüler Kaynak:** `components/` (22 HTML parçası), `css/` (3 dosya), `js/` (21 modül), `manifest.json`, `sw.js`, `scripts/build.py`.
   * **Üretim / Canlı Yayın:** `code.html` (~340 KB, tüm stil, betik ve HTML'in birleştiği, GitHub Pages'ta yayınlanan monolitik dosya).
3. **Masaüstü Katmanı (`app/`):** Electron, Node.js yerel AES-256 kasası, çerçevesiz Apple Glass UI ve güvenli IPC köprüsüne sahip tam fonksiyonel masaüstü istemcisi.

---

## 2. Dosya Kataloğu ve Sorumluluk Matrisi

### 2.1 Kök Dizin Dosyaları
* [`index.html`](file:///c:/Users/arday/Desktop/SubRadar/index.html): Kök yönlendirici. Hem `<meta http-equiv="refresh">` hem de JS `window.location.replace` ile gelen tüm trafiği `web/code.html`'e iletir.
* [`404.html`](file:///c:/Users/arday/Desktop/SubRadar/404.html): Özel Apple Glass 404 hata sayfası (animasyonlu radar taraması, hızlı ana sayfa ve komut paleti aksiyonları).
* [`privacy.html`](file:///c:/Users/arday/Desktop/SubRadar/privacy.html): %100 Sıfır Bilgi & Çevrimdışı Gizlilik Politikası (Sıfır bulut, sıfır çerez, GDPR Madde 17 ve 6502 SK).
* [`terms.html`](file:///c:/Users/arday/Desktop/SubRadar/terms.html): Kullanım Koşulları ve yerel sorumluluk sınırları.
* [`thanks.html`](file:///c:/Users/arday/Desktop/SubRadar/thanks.html): Başvuru onay ve teşekkür sayfası (benzersiz takip kodu `#SR-2026-X91`).
* [`robots.txt`](file:///c:/Users/arday/Desktop/SubRadar/robots.txt): Arama motoru robot direktifleri (`User-agent: *`, `Allow: /`) ve sitemap referansı.
* [`sitemap.xml`](file:///c:/Users/arday/Desktop/SubRadar/sitemap.xml): Çok dilli (TR/EN/DE) SEO site haritası.
* [`favicon.svg`](file:///c:/Users/arday/Desktop/SubRadar/favicon.svg): Yüksek kontrastlı neon zümrüt radar favicon vektörü.
* [`og-image.svg`](file:///c:/Users/arday/Desktop/SubRadar/og-image.svg): 1200x630 Sosyal medya önizleme (Open Graph & Twitter) kartı.
* [`.nojekyll`](file:///c:/Users/arday/Desktop/SubRadar/.nojekyll): GitHub Pages'ın Jekyll motorunu devre dışı bırakarak dosya yollarının eksiksiz sunulmasını sağlar.
* [`.gitignore`](file:///c:/Users/arday/Desktop/SubRadar/.gitignore): IDE araçları (`.agent/`, `.gemini/`, `.codex/`, `.opencode/`), `node_modules/`, `dist/`, `.env` ve sistem dosyalarını hariç tutar.
* [`LICENSE`](file:///c:/Users/arday/Desktop/SubRadar/LICENSE): Ana depo MIT açık kaynak lisansı.
* [`PRODUCT.md`](file:///c:/Users/arday/Desktop/SubRadar/PRODUCT.md): Ürün vizyonu, hedef kitle (freelancer, yazılımcı, gizlilik odaklı kullanıcılar), WCAG standartları, marka sesi ve ilkeleri.
* [`README.md`](file:///c:/Users/arday/Desktop/SubRadar/README.md): GitHub deposu karşılama sayfası, mimari harita, canlı bağlantılar ve lisans karşılaştırma tablosu.
* [`AGENTS.md`](file:///c:/Users/arday/Desktop/SubRadar/AGENTS.md): AI asistanları için kompakt hızlı başlangıç ve bağlam koruma rehberi.

### 2.2 Lisans Kütüphanesi (`licenses/`)
* [`licenses/README.md`](file:///c:/Users/arday/Desktop/SubRadar/licenses/README.md): Lisans seçim kılavuzu ve 9 popüler lisansın karşılaştırma tablosu.
* [`licenses/*.txt`](file:///c:/Users/arday/Desktop/SubRadar/licenses/): MIT, Apache-2.0, BSD-3, BSD-2, GPL-3.0, AGPL-3.0, MPL-2.0, Unlicense ve Proprietary tam metinleri.

### 2.3 Web Modüler Bileşenleri (`web/components/`)
* **`layout/`**:
  * `header.html`: Atmospheric glow efekti, marka logosu, masaüstü/mobil menü, ⌘K butonu, Web Audio ses açma/kapama (`#sound-toggle-btn`), Power-User kısayol rehberi (`#shortcuts-help-btn`), tema butonu, dil (EN/DE/TR) ve kur ($/€/₺) butonları, "Bilgisayara İndir" ana aksiyonu.
  * `footer.html`: Canlı motor gecikme göstergesi (`#footer-engine-ping`), telif hakları, iletişim bilgileri (`iletisim@subradar.dev`), hızlı bağlantılar ve yerel güvenlik taahhütleri.
  * `cookie-banner.html`: Sıfır çerez güvencesi ve yerel bellek onay banner'ı (`#sr-privacy-banner`).
  * `mobile-sticky-cta.html`: Mobilde altta sabit kalan hızlı indirme çubuğu (`#sr-mobile-sticky-cta`).
* **`sections/`**:
  * `hero.html`: Ana manşet, işletim sistemi indirme butonları (macOS / Windows), interaktif macOS simülasyon penceresi (`#hero-mock-window`).
  * `problem.html`: Gizli abonelik kayıpları, 4.2 dakikalık iptal atlama süresi ve sektör istatistikleri.
  * `statement-lab.html`: Canlı hava boşluğu (Air-Gap) banka ekstresi ve sızıntı tarayıcısı laboratuvarı (`FileReader API`, sıfır bulut).
  * `calculator.html`: İsraf hesaplama kaydırıcıları, hızlı kullanıcı profilleri, 1/5 yıllık tasarruf projeksiyonu, PNG "Abonelik Röntgeni" kart ihracı (`#calc-export-png-btn`) ve X paylaşımı.
  * `comparison.html`: Şeffaflık & güven rakip karşılaştırma matrisi (SubRadar vs Rocket Money / Truebill vs Bobby vs Excel).
  * `features.html`: 4 çekirdek motor (Denetim, Otomatik Yakalama, Atlama Motoru, Yerel Kasa).
  * `architecture.html`: Yerel AES-256 SQLite kilitli kasa mimarisi ve sıfır-bulut ilkeleri.
  * `os-downloads.html`: macOS (Apple Silicon / Intel), Windows (x64 / ARM64) ve Linux kartları + v1.5.0 sürümü.
  * `hash-verifier.html`: İstemci tarafı donanım ivmeli SHA-256 kurulum doğrulama aracı (`WebCrypto API`).
  * `pricing.html`: Free, Pro ($9/ay veya $79 ömür boyu), Max ($19/ay veya $149 ömür boyu), Enterprise modelleri.
  * `faq.html`: Sıkça sorulan sorular akordeonu.
* **`modals/`**:
  * `command-palette.html`: ⌘K / Ctrl+K arama paleti, klavye ok tuşları ile gezinim.
  * `download-modal.html`: Mimari seçimi (Apple Silicon vs Intel, Windows x64 vs ARM64), simüle edilen hız ve ilerleme çubuğu, SHA256 göstergesi.
  * `enterprise-modal.html`: Kurumsal teklif formu (Ad, Şirket E-postası, Şirket Adı, inline hata doğrulaması ve loading spinner).
  * `reclaim-modal.html`: CLI indirme komutu kopyalama (`curl -sSL subradar.dev/cli | sh`) ve 3 adımlı kurtarma rehberi.
  * `shortcuts-modal.html`: Raycast/Linear stili Power-User klavye kısayolları modalı (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`).
  * `legal-generator-modal.html`: Canlı 6502 SK & GDPR Madde 17 resmi cayma ve fesih ihtarnamesi sihirbazı (canlı önizleme, pano kopyalama ve `.txt` dosya indirme).
  * `auth-modal.html`: İkili kayan panelli (Double-Slider Sliding Overlay) Apple Glass Monokrom modalı: Saf siyah-beyaz ve uzay grafiti/obsidyen marka katmanı (`.auth-overlay`), buzlu geometrik cam şekiller, parlak beyaz ve ghost outline hap butonlar ("GİRİŞ YAP" / "KAYIT OL"), dairesel monokrom sosyal butonlar (Google, GitHub, Apple), tek tıkla VIP demo, monokrom şifre güvenlik göstergesi ve aktif profil yönetim paneli.

### 2.4 Web Stilleri (`web/css/`)
* [`base.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/base.css): SF Pro font ailesi, `html.light` ve `html.dark` değişkenleri, skip-link, scroll-behavior, metin seçimi renkleri.
* [`components.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/components.css): `.apple-glass` arka plan bluru, `.apple-card` kalkış ve imleç takipçi dinamik ışıma efekti (`--mouse-x`, `--mouse-y`), `.custom-scroll` cam kaydırma çubuğu, ses göstergesi animasyonları (`@keyframes soundPulse`), form hata animasyonları (`.shake-anim`), mobil sabit CTA ve çerez banner'ı stilleri.
* [`main.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/main.css): `base.css` ve `components.css` modüllerini içe aktarır.

### 2.5 Web Betikleri (`web/js/`) & PWA
* [`manifest.json`](file:///c:/Users/arday/Desktop/SubRadar/web/manifest.json): PWA web uygulama manifesti (çevrimdışı ve tam ekran desteği).
* [`sw.js`](file:///c:/Users/arday/Desktop/SubRadar/web/sw.js): Çevrimdışı Service Worker önbellekleme motoru.
* [`config.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/config.js): Kurlar (`USD: 1`, `EUR: 0.86`, `TRY: 48.35`), `srCurrency`, `setCurrency(cur)`, `srConvert(usd)`.
* [`theme.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/theme.js): Açık/koyu mod mantığı (`#theme-toggle`, `localStorage: sr-theme`).
* [`fx.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/fx.js): Canlı döviz kurlarını `open.er-api.com` veya `api.frankfurter.app` üzerinden çeker (12 saat TTL önbellek).
* [`toast.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/toast.js): Apple Glass bildirim balonu (`srShowToast(message)`).
* [`audio-fx.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/audio-fx.js): Web Audio API sıfır-dosya matematiksel osilatörlü dokunsal ses motoru (`playClick`, `playToggle`, `playSuccess`, `toggle`).
* [`cursor-glow.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/cursor-glow.js): Dinamik imleç takipçi cam aydınlatma motoru (`--mouse-x`, `--mouse-y`).
* [`statement-lab.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/statement-lab.js): İstemci taraflı Air-Gap ekstre ve kaçak sızıntı analizörü (`FileReader API`).
* [`hash-verifier.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/hash-verifier.js): WebCrypto donanım ivmeli SHA-256 kurulum paketi bütünlük doğrulayıcısı.
* [`social-export.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/social-export.js): HTML5 Canvas 1200x630 Retina "Abonelik Röntgeni" kart üretici, PNG indirici ve X/LinkedIn paylaşım köprüsü.
* [`calculator.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/calculator.js): Kaydırıcı dinleyicileri, profil butonları (`.calc-preset-btn`), formül hesaplama: `(subs * 32 + trials * 78) * 12`.
* [`hero-window.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/hero-window.js): Hero macOS penceresi mantığı; pencere kontrolleri, iptal butonları, bellek sayacı, sekmeler ve canlı gecikme.
* [`scroll-motion.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/scroll-motion.js): Tepe ilerleme çizgisi (`#sr-progress`), `[data-rv]` animasyon tetikleyicileri, hero paralaks kayması.
* [`i18n.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/i18n.js): TR/EN/DE sözlükleri, DOM TreeWalker ile metin düğümlerini dinamik olarak çeviren `t()` fonksiyonu.
* [`analytics.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/analytics.js): Sıfır-çerez, DNT uyumlu yerel oturum telemetrisi (`srAnalytics`).
* [`cookie-banner.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/cookie-banner.js): Gizlilik bildirimi ve yerel bellek rıza kontrolü.
* [`mobile-cta.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/mobile-cta.js): Mobilde kaydırmaya bağlı beliren sabit indirme barı.
* [`main.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/main.js): Tüm modülleri ve Service Worker'ı başlatan ana orkestrasyon dosyası.
* [`modals/command-palette.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/command-palette.js): ⌘K / Ctrl+K arama, ok tuşlarıyla gezinme ve eylem tetikleme.
* [`modals/download-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/download-modal.js): İndirme simülasyonu, OS ve mimari seçimi, SHA-256 doğrulama.
* [`modals/enterprise-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/enterprise-modal.js): Kurumsal form kontrolü, gerçek zamanlı hata denetimi ve loading spinner.
* [`modals/reclaim-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/reclaim-modal.js): CLI kopyalama ve modal görünürlüğü.
* [`modals/shortcuts-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/shortcuts-modal.js): Power-User kısayol dinleyici (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`).
* [`modals/legal-gen.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/legal-gen.js): Canlı resmi ihtarname derleyici, pano kopyalama ve `.txt` indirme.
* [`modals/auth-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/auth-modal.js): Çift yönlü kayan panel animasyonu (`.auth-right-panel-active`), dairesel sosyal butonlar, tek tıkla demo, şifre doğrulama ve profil paneli kontrolcüsü (`initAuthModal`).
* [`scripts/build.py`](file:///c:/Users/arday/Desktop/SubRadar/web/scripts/build.py): 22 bileşenin bütünlüğünü doğrulayan test betiği.

### 2.6 Masaüstü Uygulaması Dosya Kataloğu (`app/`)
* [`package.json`](file:///c:/Users/arday/Desktop/SubRadar/app/package.json): Electron v33 bağımlılığı ve `start`, `dev`, `test`, `test:vault`, `test:parser` komutları.
* [`main.js`](file:///c:/Users/arday/Desktop/SubRadar/app/main.js): Electron ana süreci (`frame: false`, `titleBarStyle: 'hidden'`, pencere kontrolleri, güvenli IPC kanalları, dosya iletişim kutuları, pano köprüsü, harici URL açma).
* [`preload.js`](file:///c:/Users/arday/Desktop/SubRadar/app/preload.js): `contextIsolation: true` güvenlikli köprü; renderer sürecine `window.subradarAPI` (`vault`, `subscriptions`, `preferences`, `legalNotice`, `statement`, `system`) nesnesini sunar.
* [`src/main/vault.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/vault.js): Node.js yerel `crypto` motoru (`aes-256-cbc`, `scryptSync`, timing-safe `HMAC-SHA256`).
* [`src/main/vault.test.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/vault.test.js): Sıfır-bağımlılık kriptografik kasa testleri (şifreleme, çözme, yanlış parola reddi, zararlı zarf tahrifat kontrolü).
* [`src/main/store.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/store.js): Yerel diskte `encrypted_sqlite_aes256.subradar` dosyasını saklayan, bellek önbelleği ve şifreli yedek dışa/içe aktarma yöneticisi.
* [`src/main/legal-notice.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/legal-notice.js): 6502 sayılı Tüketicinin Korunması Kanunu ve GDPR Madde 17 resmi fesih metni oluşturucu motor.
* [`src/main/statement-parser.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/statement-parser.js): %100 çevrimdışı, bellek içi banka ekstresi ve CSV tarayıcısı (18+ SaaS regex kalıbı ve para birimi tanıma).
* [`src/main/parser.test.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main/parser.test.js): Ekstre tarayıcı ve yasal fesih mektubu üretim birim testleri.
* [`src/renderer/index.html`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/index.html): Çerçevesiz Apple Glass ana pencere, ana şifre kilit ekranı (Gate Screen), KPI kartları, 6 modül görünümü (Genel Bakış, Abonelikler, Risk Radarı, Kill Switch, Ekstre Tarayıcı, Kasa Ayarları), ⌘K Komut Paleti ve modallar.
* [`src/renderer/styles/app.css`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/styles/app.css): Frameless pencere sürükleme kuralları, sidebar gezinimi, radar animasyonları, renk tokenları.
* [`src/renderer/styles/components.css`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/styles/components.css): Apple Glass kartlar, kilit ekranı modalı, KPI ızgarası, veri tablosu, ekstre yükleme sürükle-bırak alanı ve form kontrolleri.
* [`src/renderer/scripts/app.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/scripts/app.js): Renderer reaktif kontrolcüsü (sekme geçişleri, kasa kilidi açma, CRUD, anlık arama, risk radarı hesaplama, ekstre ayrıştırma ve ⌘K komut paleti orkestrasyonu).
* [`src/renderer/scripts/presets.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/scripts/presets.js): 16+ popüler SaaS servisi için tek tıkla doğrudan iptal URL'leri, kategoriler ve varsayılan fiyatlar.
* [`src/renderer/scripts/crypto-fallback.js`](file:///c:/Users/arday/Desktop/SubRadar/app/src/renderer/scripts/crypto-fallback.js): Tarayıcı geliştirme ortamları için WebCrypto (`SubtleCrypto`) tabanlı yerel kasa ve ekstre tarayıcı taklidi.

---

## 3. Durum Yönetimi (State) ve Veri Akışı

### 3.1 Dil (i18n) Durumu
* Anahtar: `localStorage.getItem('sr-lang')`
* Değerler: `'tr'` (varsayılan), `'en'`, `'de'`
* Çalışma Mantığı:
  1. `srSwapLang(lang)` çağrılır.
  2. `document.createTreeWalker` ile sayfadaki tüm `NodeFilter.SHOW_TEXT` düğümleri taranır.
  3. İlk okumada orijinal Türkçe metin `node._trRaw` içine saklanır; böylece diller arasında kayıpsız geçiş yapılır.
  4. `t(text)` fonksiyonu, o anki aktif sözlükten karşılığı döndürür.

### 3.2 Para Birimi & Kur Durumu
* Anahtar: `localStorage.getItem('sr-currency')`
* Değerler: `'USD'` (varsayılan), `'EUR'`, `'TRY'`
* Fiyatlandırma: Arayüzdeki para değerleri `[data-usd="..."]` niteliği taşır. Para birimi değiştiğinde `srConvert(usd)` ile dinamik hesaplanır.
* Canlı Kur: `localStorage.getItem('sr-fx')` içinde `{ ts, EUR, TRY }` olarak saklanır. 12 saat boyunca geçerlidir.

### 3.3 Tema Durumu
* Anahtar: `localStorage.getItem('sr-theme')`
* Değerler: `'dark'` (varsayılan) veya `'light'`
* Sınıf: `document.documentElement` (`<html class="light">` veya `<html class="dark">`).

### 3.4 Hero Penceresi Simülasyon Durumu
* `currentMonthlyBurn`: Başlangıç `$384.20`. Her iptalde azaltılır.
* `detectedLeaksCount`: Başlangıç `3`. Her iptalde azaltılır.
* `annualWasteRecoverable`: Başlangıç `$1890.00`.
* İptal edilen satırlar (`.direct-kill-btn`), yeşil rozet alır ve harcama sıfırlanır.
* `#hero-demo-reset` tıklandığında tüm veriler orijinal haline geri döner.

---

## 4. Bileşen ve DOM ID Dizini

| DOM ID / Seçici | Ait Olduğu Bileşen | Görevi |
| :--- | :--- | :--- |
| `#theme-toggle` | `layout/header.html` | Açık/koyu tema değiştirme düğmesi |
| `#theme-toggle-icon` | `layout/header.html` | Tema ikon etiketi (`light_mode` / `dark_mode`) |
| `.lang-btn` | `layout/header.html` | Dil seçim butonları (`data-lang="EN|DE|TR"`) |
| `.currency-btn` | `layout/header.html` | Para birimi butonları (`data-currency="USD|EUR|TRY"`) |
| `#nav-cmd-trigger` | `layout/header.html` | ⌘K paletini açan üst çubuk butonu |
| `#hero-mock-window` | `sections/hero.html` | Simüle edilen masaüstü penceresi |
| `#hero-win-close` | `sections/hero.html` | Kırmızı macOS trafik ışığı (pencereyi gizler) |
| `#hero-win-min` | `sections/hero.html` | Sarı macOS trafik ışığı (içeriği daraltır) |
| `#hero-win-zoom` | `sections/hero.html` | Yeşil macOS trafik ışığı (genişletir: `max-w-7xl`) |
| `#hero-win-restore-bar`| `sections/hero.html` | Kapatılan pencereyi geri getirme çubuğu |
| `#hero-sub-search` | `sections/hero.html` | Hero içi abonelik filtreleme inputu |
| `#hero-monthly-burn`| `sections/hero.html` | Aylık toplam harcama göstergesi |
| `#hero-detected-leaks`| `sections/hero.html` | Kaçak lisans adedi göstergesi |
| `#hero-annual-waste`| `sections/hero.html` | Kurtarılabilir yıllık israf göstergesi |
| `#hero-demo-reset` | `sections/hero.html` | Simülasyonu başlangıç durumuna sıfırlayan buton |
| `#calc-subs` | `sections/calculator.html` | Aktif abonelik kaydırıcısı (Range 2-35) |
| `#calc-trials` | `sections/calculator.html` | Deneme süresi kaydırıcısı (Range 0-15) |
| `.calc-preset-btn` | `sections/calculator.html` | Hazır profil butonları (`data-subs`, `data-trials`) |
| `#out-1yr` | `sections/calculator.html` | 1 yıllık tasarruf çıktısı |
| `#out-5yr` | `sections/calculator.html` | 5 yıllık birikmiş kayıp çıktısı |
| `#reclaim-target-amount`| `sections/calculator.html` | Geri kazanım modalına aktarılan hedef tutar |
| `#cmd-palette-backdrop`| `modals/command-palette.html`| Komut paleti modal arka planı |
| `#cmd-palette-input` | `modals/command-palette.html`| Komut paleti arama kutusu |
| `#download-modal-backdrop`| `modals/download-modal.html`| İndirme modalı arka planı |
| `#dl-progress-bar` | `modals/download-modal.html`| İndirme ilerleme çubuğu |
| `#ent-modal-backdrop`| `modals/enterprise-modal.html`| Kurumsal form modalı |
| `#reclaim-modal-backdrop`| `modals/reclaim-modal.html`| Sermaye geri kazanım & CLI modalı |
| `#cli-copy-btn` | `modals/reclaim-modal.html`| `curl` komutunu kopyalayan buton |
| `#auth-modal-btn` | `layout/header.html` | Üst ada sağında yer alan Giriş Yap / Kayıt Ol butonu |
| `#auth-modal-backdrop`| `modals/auth-modal.html` | İkili kayan panelli (Double-Slider Sliding Overlay) giriş/kayıt modalı |
| `#sr-progress` | `scroll-motion.js` | Sayfa üstündeki akıcı okuma ilerleme çizgisi |
| `#sr-scrollspy` | `scroll-motion.js` | Alt merkezde sabit yüzen minimalist bölüm gezinti adası |
| `#site-header` | `layout/header.html` | Kaydırmayla adaya dönüşen (`is-scrolled-island`) Apple Glass üst çubuğu |
| `#sr-toast` | `toast.js` | Dinamik olarak üretilen Apple Glass bildirim balonu |

---

## 5. Tasarım ve Stil Sistemi

* **Renkler:**
  * Koyu Taban: `#000000` (Siyah), `#08080a` (Derin cam), `#09090b` (Kart arka planı), `#0d0d11` (Pencere başlığı).
  * Açık Taban: `#f5f5f7` (macOS açık gri), `#ffffff` (Kartlar), `#1d1d1f` (Koyu gri metin).
  * Aksanlar: `#10b981` (Zümrüt yeşili - Tasarruf ve onay), `#6366f1` (İndigo mor - Vurgu), `#ef4444` (Kırmızı - İptal/Uyarı).
* **Tipografi:** SF Pro Display, SF Pro Text, Apple System Fontları, `tabular-nums` rakam hizalaması.
* **Cam Efekti:**
  ```css
  background: rgba(8, 8, 10, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```

---

## 6. Masaüstü Uygulaması Mimarisi & Çalışma Mantığı (`app/`)

`app/` dizini aktif ve çalışan Electron masaüstü istemcisidir:
* **Güvenlik Çekirdeği (`src/main/vault.js`):** Node.js `crypto` ile `AES-256-CBC` algoritması, `scryptSync` KDF (N=16384, r=8, p=1, 64 bayt türetilmiş anahtar) ve timing-safe `HMAC-SHA256` bütünlük doğrulaması.
* **Yerel Şifreli Depo (`src/main/store.js`):** `encrypted_sqlite_aes256.subradar` dosyasını yerel diskte tutar. Parola doğrulanmadan veri asla çözülmez. `.subradar` yedeğini dışa/içe aktarma fonksiyonlarına sahiptir.
* **İzole IPC Köprüsü (`preload.js`):** `contextIsolation: true` ve `sandbox: false` ile `window.subradarAPI` nesnesini sunar.
* **Doğrudan İptal & Fesih Sihirbazı (`src/main/legal-notice.js`):** 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve GDPR Madde 17 standartlarına uygun resmi fesih mektuplarını anında oluşturur.
* **Apple Glass Arayüzü (`src/renderer/`):** Çerçevesiz macOS penceresi, Master Parola Kilit Ekranı (Gate Screen), Dashboard, Tüm Abonelikler, Risk Radarı, Tek Tıkla İptal ve Kasa Ayarları sekmeleri.
* **Test Motoru (`src/main/vault.test.js`):** `npm run test:vault` ile sıfır dış bağımlılıkla çalışan kripto doğrulama testleri.

---

## 7. Geliştirici İpuçları & Sık Yapılan İşlemler

### 7.1 Yerel Test Sunucusu
```bash
python -m http.server 8765
```
Tarayıcıdan `http://localhost:8765/web/code.html` veya `http://localhost:8765/` adresine gidin.

### 7.2 Bileşen Senkronizasyon Kuralı
Canlı yayınlanan sayfa doğrudan `web/code.html`'dir.
Modüler `web/components/` veya `web/js/` içinde bir değişiklik yaptığınızda:
1. `python web/scripts/build.py` çalıştırarak 14 modüler bileşenin bütünlüğünü doğrulayın.
2. `web/code.html` dosyasındaki ilgili bloğu da güncelleyin veya oraya entegre edin.

### 7.3 Git, GitHub ve Canlı Dağıtım (Production) Detayları
* **Depo Sahibi & Hesabı:** `Laynexsw`
* **Depo Adı & URL:** [https://github.com/Laynexsw/SubRadar](https://github.com/Laynexsw/SubRadar)
* **Git Remote:** `origin` -> `https://github.com/Laynexsw/SubRadar.git`
* **Ana Dal:** `main`
* **GitHub Pages (Canlı Ortam):**
  * URL: [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
  * Kaynak: `main` dalı kök dizini (`/`).
  * Yönlendirme Zinciri: `index.html` (kök) -> `web/code.html` (canlı sayfa).
  * `.nojekyll` dosyası Jekyll motorunu kapatarak statik varlıkların filtrelenmesini engeller.
* **GitHub CLI (`gh`):**
  * Yetkili kullanıcı oturumu açık (`Laynexsw`).
  * Güncel Açıklama: `"⚡ Masaüstü abonelik zekâsı, tek tıkla iptal ve %100 yerel AES-256 kasa. Unutulan deneme tuzaklarını ve gizli yenilemeleri durdurun. Sıfır bulut, sıfır telemetri."`
  * Güncel Konular (Topics): `apple-design`, `desktop-app`, `electron`, `offline-first`, `privacy-first`, `subscription-tracker`, `license-templates`, `open-source`, `aes-256`, `dark-patterns`, `glassmorphism`, `security`, `zero-knowledge`.
  * Canlı Bilgileri Güncelleme Komutu:
    ```powershell
    gh repo edit Laynexsw/SubRadar -d "<açıklama>" -h "https://laynexsw.github.io/SubRadar/" --add-topic "<etiket1,etiket2>"
    ```
* **PowerShell Gönderim Kuralı:**
  * Windows PowerShell üzerinde `&&` yerine `;` kullanılmalıdır:
    ```powershell
    git add . ; git commit -m "docs: ..." ; git push origin main
    ```

---
*Bu doküman, Antigravity ve tüm AI modelleri için tek kaynak (single source of truth) olacak şekilde eksiksiz tutulmuştur.*

