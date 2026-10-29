# 📚 SubRadar — Kapsamlı Kod Tabanı & Mimari Hafıza Belgesi (CODEBASE.md)

> **Bu belgenin varlık sebebi:** Gelecekteki tüm sohbetlerde ve geliştirme oturumlarında, projedeki kaynak dosyaların tekrar taranmasına gerek kalmaksızın tüm mimariyi, durum yönetimini (state), fonksiyon imzalarını, 4 Geliştirme Dalgasını (Waves 1-4) ve DOM yapısını tek bakışta sunmaktır.

---

## 📑 İçindekiler
1. [Genel Bakış ve Katmanlar](#1-genel-bakış-ve-katmanlar)
2. [4 Geliştirme Dalgası (Completed Waves 1–4)](#2-4-geliştirme-dalgası-completed-waves-14)
3. [Dosya Kataloğu ve Sorumluluk Matrisi](#3-dosya-kataloğu-ve-sorumluluk-matrisi)
4. [Durum Yönetimi (State) ve Veri Akışı](#4-durum-yönetimi-state-ve-veri-akışı)
5. [Bileşen ve DOM ID Dizini](#5-bileşen-ve-dom-id-dizini)
6. [Tasarım ve Stil Sistemi](#6-tasarım-ve-stil-sistemi)
7. [Masaüstü Uygulaması Mimarisi & Çalışma Mantığı (`app/ v1.0`)](#7-masaüstü-uygulaması-mimarisi--çalışma-mantığı-app-v10)
8. [Otonom Mühendislik Organizasyonu & Dinamik Alt Ajan Bölünmesi](#8-otonom-mühendislik-organizasyonu--dinamik-alt-ajan-bölünmesi)
9. [Geliştirici İpuçları, Testler & Sık Yapılan İşlemler](#9-geliştirici-ipuçları-testler--sık-yapılan-işlemler)

---

## 1. Genel Bakış ve Katmanlar

SubRadar v1.0, bireysel kullanıcıların ve şirketlerin unutulan aboneliklerini, deneme sürelerini, sinsi fiyat artışlarını ve zorlaştırılmış iptal süreçlerini engelleyen; tek tıkla doğrudan iptal ve resmi fesih dilekçesi araçları sunan, %100 yerel ve çevrimdışı çalışan masaüstü abonelik yönetim platformudur.

Depo şu anda **dört ana katmandan** oluşur:
1. **Kök Yönetim Katmanı (`/`):** Dağıtım yapılandırması (`index.html`, `.nojekyll`, `.gitignore`, `tsconfig.json`), güvenlik ve ticari lisans politikaları (`LICENSE` v1.0, `privacy.html`, `terms.html`, `thanks.html`), SEO varlıkları (`robots.txt`, `sitemap.xml`) ve mimari dokümantasyon (`README.md`, `PRODUCT.md`, `AGENTS.md`, `CODEBASE.md`, `.agents/rules/`, `.agents/agents/`, `.agents/skills/`).
2. **Masaüstü İşletim Çekirdeği (`app/ v1.0`):** %100 Saf Rust (`eframe` / `egui`) ile geliştirilmiş, ~3.2 MB boyutunda tekil native `.exe` masaüstü istemcisi (`app/subradar.exe`); yerel `AES-256-CBC` + `PBKDF2-HMAC-SHA256` + `HMAC-SHA256` kasası (`vault.rs`), çoklu banka ekstre analizörü ve fiyat artışı tespit motoru (`parser.rs`), 6502 SK THH/TÜBİS, Visa/Mastercard Chargeback ve GDPR dilekçe motoru (`legal.rs`), 37 servis şablonu ve Dark Pattern iptal kılavuzları (`presets.rs`), 3 katmanlı token arayüzü (`theme.rs`, `ui.rs`) ve Aile/Ekip paylaştırıcı + iCalendar ihracı (`models.rs`). **15/15 birim testi %100 başarıyla geçmektedir.**
3. **Harici UI Bileşenleri (`components/`):** Originkit CLI (`components/originkit/ui/tiles-loader.tsx`, `components/originkit/ui/vector-wordmark.tsx`) resmi React/TypeScript tasarım sistemi bileşenleri.
4. **Web Vitrini & Simülasyon Platformu (`web/`):**
   * **Modüler Kaynak:** `components/` (23 HTML parçası + Originkit tip köprüsü), `css/` (4 dosya), `js/` (27 modül), `assets/cursors/`, `vendor/three/`, `manifest.json`, `sw.js`, `scripts/build.py`, `scripts/embed_tiles_loader.py`.
   * **Üretim / Canlı Yayın:** `code.html` (~340 KB, tüm stil, betik ve HTML'in birleştiği, GitHub Pages'ta yayınlanan monolitik tekil paket).

---

## 2. 4 Geliştirme Dalgası (Completed Waves 1–4)

SubRadar v1.0 mimarisi 4 stratejik geliştirme dalgası ile tamamlanmıştır:

### 🌊 Dalga 1: Bento Grid Analitiği, 3 Katmanlı Tasarım Sistemi & Raycast Kısayolları
- **Bento Grid Kategori & Harcama Analitiği:** Harcamaları kategorilerine göre (Eğlence, Üretkenlik, Bulut, AI, vb.) renk kodlu yüzdelerle ve bütçe sağlık skoruyla görselleştiren modern bento grid düzeni.
- **3 Katmanlı Tasarım Sistemi Token Mimarisi (`theme.rs`):** İlkel palet (Primitive) -> Semantik rol (Semantic) -> Bileşen bazlı (Component) katmanlı token mimarisi. Apple Glass ve Raycast/Linear derin siyah kontrastı.
- **Raycast / Linear Klavye Kısayolları:** Tam klavye odaklı ergonomi: `Ctrl+K` (Komut Paleti), `Ctrl+N` (Yeni Ekle), `Ctrl+E` (Ekstre Tara), `Ctrl+T` (Tema Değiştir), `Ctrl+D` (Dilekçe Sihirbazı), `Space` (Doğrudan İptale Git), `Esc` (Temizle/Kapat).
- **Linear Stili "Geri Al" (Undo Toast) Bildirim Bandı:** Bir abonelik silindiğinde veya iptal edildiğinde ekranın altından akıcı şekilde yükselen, 5 saniyelik geri alma butonuna sahip güvenli bildirim motoru.

### 🌊 Dalga 2: 37 Popüler Servis Şablonu, Çoklu Banka Ekstreleri & Sinsi Fiyat Artışı Algılayıcı
- **37 Popüler Servis Şablonu (6 Kategori - `presets.rs`):** Streaming, AI/Üretkenlik, Yazılım/Tasarım, Bulut, İletişim ve Oyun kategorilerinde 37 servis için doğrudan resmi iptal URL'leri ve adım adım Dark Pattern iptal kılavuzları.
- **Yerel Çoklu Banka Ekstre Formatları (`parser.rs`):** Garanti BBVA, İş Bankası, Enpara.com, Papara, Wise (CSV) ve Revolut (CSV/Text) ekstre formatlarını internete ihtiyaç duymadan yerel bellekte deterministik olarak ayrıştırır.
- **Gizli Fiyat Artışı ve Sinsi Yenileme Algılayıcı (`detect_price_hikes`):** Ekstredeki ardışık aylar arasındaki tutar farklarını hesaplayarak enflasyon/fiyat artışlarını yüzde ve tutar olarak raporlayan algoritmik koruma.

### 🌊 Dalga 3: Yasal Hakem Heyeti (6502 SK), Ters İbraz (Chargeback) & Karanlık Desen İptal Kılavuzları
- **Resmi THH / TÜBİS (6502 SK) Tüketici Hakem Heyeti Başvuru Dilekçesi (`legal.rs`):** Ayıplı hizmet, izinsiz yenileme veya para iadesi yapılmayan durumlar için e-Devlet TÜBİS sistemine doğrudan yüklenebilir resmi hukuki şikayet metni.
- **Visa / Mastercard Ters İbraz (Chargeback) Harcama İtirazı Formu (`legal.rs`):** Bankaya sunulmak üzere uluslararası kart kurallarına (Reason Code 13.1 / 4853 - İptal Edilen İşlem) uygun harcama itirazı belgesi.
- **Hizmet Bazlı Karanlık Desen (Dark Pattern) İptal Kılavuzları:** Karmaşık iptal butonlarını, canlı desteğe yönlendiren tuzakları ve anket bariyerlerini aşmak için 37 popüler servise özel adım adım doğrudan fesih rehberi.
- **Yaklaşan Yenileme & Deneme Radar Kalkanı:** Deneme süresi bitmeden 3 gün ve 1 gün önce renkli uyarı rozetleriyle bütçeyi koruyan erken ikaz motoru.

### 🌊 Dalga 4: Aile/Ekip Maliyet Bölüştürücü, RFC 5545 iCalendar Takvim İhracı & Çift Yönlü Şifreli Yedekleme
- **Aile & Ekip Ortak Lisans Maliyet Bölüştürücü (`models.rs`):** Ortak kullanılan aile ve ekip lisanslarının toplam maliyetini kişi sayısına bölerek kişi başı net payı ve aylık/yıllık tasarrufu hesaplar.
- **Apple / Google / Outlook Takvim RFC 5545 iCalendar (`.ics`) İhracı (`models.rs`):** Yaklaşan tüm fatura ve deneme yenileme tarihlerini tek tıkla Apple Calendar, Google Calendar ve Microsoft Outlook'a standart `.ics` dosyası olarak aktarır.
- **Çift Yönlü AES-256 Şifreli JSON Yedekleme ve Akıllı Veri Birleştirme (`vault.rs`):** Kullanıcı verilerini güvenli parola ile dışa aktarır ve başka bir cihaza kopyalandığında mevcut verilerle çakışmadan akıllı birleştirme (merge) yapar.

---

## 3. Dosya Kataloğu ve Sorumluluk Matrisi

### 3.1 Kök Dizin Dosyaları
* [`index.html`](file:///c:/Users/arday/Desktop/SubRadar/index.html): Kök yönlendirici. Gelen trafiği anında `web/code.html`'e iletir.
* [`404.html`](file:///c:/Users/arday/Desktop/SubRadar/404.html): Özel Apple Glass 404 hata sayfası (animasyonlu radar tarayıcı & hızlı aksiyonlar).
* [`privacy.html`](file:///c:/Users/arday/Desktop/SubRadar/privacy.html): %100 Sıfır Bilgi & Çevrimdışı Gizlilik Politikası (GDPR Madde 17 / KVKK uyumlu).
* [`terms.html`](file:///c:/Users/arday/Desktop/SubRadar/terms.html): Kullanım Koşulları ve yerel sorumluluk sınırları.
* [`thanks.html`](file:///c:/Users/arday/Desktop/SubRadar/thanks.html): Başvuru onay ve teşekkür sayfası (takip kodlu `#SR-2026-X91`).
* [`robots.txt`](file:///c:/Users/arday/Desktop/SubRadar/robots.txt): Arama motoru robot direktifleri (`User-agent: *`, `Allow: /`) ve sitemap referansı.
* [`sitemap.xml`](file:///c:/Users/arday/Desktop/SubRadar/sitemap.xml): Çok dilli (TR/EN/DE) SEO site haritası.
* [`favicon.svg`](file:///c:/Users/arday/Desktop/SubRadar/favicon.svg): Yüksek kontrastlı neon zümrüt radar favicon vektörü.
* [`og-image.svg`](file:///c:/Users/arday/Desktop/SubRadar/og-image.svg): 1200x630 Sosyal medya önizleme (Open Graph & Twitter) kartı.
* [`.nojekyll`](file:///c:/Users/arday/Desktop/SubRadar/.nojekyll): GitHub Pages Jekyll motorunu devre dışı bırakır.
* [`.gitignore`](file:///c:/Users/arday/Desktop/SubRadar/.gitignore): IDE araçları, `node_modules/`, `target/`, `.env` ve sistem dosyalarını hariç tutar.
* [`LICENSE`](file:///c:/Users/arday/Desktop/SubRadar/LICENSE): SubRadar Resmi Ticari Yazılım Lisansı (Commercial License v1.0).
* [`PRODUCT.md`](file:///c:/Users/arday/Desktop/SubRadar/PRODUCT.md): Ürün vizyonu, hedef kitle, WCAG standartları, marka ilkeleri.
* [`tsconfig.json`](file:///c:/Users/arday/Desktop/SubRadar/tsconfig.json): TypeScript / React (Originkit TSX) derleyici yapılandırması.
* [`README.md`](file:///c:/Users/arday/Desktop/SubRadar/README.md): GitHub deposu karşılama sayfası, mimari harita, canlı bağlantılar ve ticari paket tablosu.
* [`AGENTS.md`](file:///c:/Users/arday/Desktop/SubRadar/AGENTS.md): AI asistanları için kompakt hızlı başlangıç ve bağlam koruma rehberi.
* [`CODEBASE.md`](file:///c:/Users/arday/Desktop/SubRadar/CODEBASE.md): [BU DOSYA] Eksiksiz kod tabanı, durum modelleri ve mimari hafıza belgesi.
* [`.agents/rules/codebase-context.md`](file:///c:/Users/arday/Desktop/SubRadar/.agents/rules/codebase-context.md): AI geliştirme kuralları, Baş Orkestratör & 21 Uzman Alt Ajan yönetim politikaları.
* [`.agents/agents/`](file:///c:/Users/arday/Desktop/SubRadar/.agents/agents/): 5 Departman ve 21 Kalıcı Uzman Alt Ajan (`*/agent.md`) tanım dosyaları.
* [`.agents/skills/`](file:///c:/Users/arday/Desktop/SubRadar/.agents/skills/): 14 yerel skill paketi (`impeccable`, `ui-ux-pro-max`, `design-system`, `ui-styling`, `brand`, `banner-design`, `design`, `slides`, `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`).

### 3.2 Harici UI Bileşenleri (`components/originkit/`)
* [`components/originkit/ui/tiles-loader.tsx`](file:///c:/Users/arday/Desktop/SubRadar/components/originkit/ui/tiles-loader.tsx): Originkit CLI resmi React/TypeScript Tiles Loader bileşeni.
* [`components/originkit/ui/vector-wordmark.tsx`](file:///c:/Users/arday/Desktop/SubRadar/components/originkit/ui/vector-wordmark.tsx): Originkit CLI resmi React/TypeScript Vector Wordmark bileşeni (2 kanallı WebGL atlası, kübik smoothstep imleç dönüşümü ve 3 düğümlü kafes takibi).

### 3.3 Masaüstü Uygulaması Dosya Kataloğu (`app/ v1.0` — %100 Saf Rust Native GUI)
* [`Cargo.toml`](file:///c:/Users/arday/Desktop/SubRadar/app/Cargo.toml): Saf Rust paket yapılandırması, kriptografi (`aes`, `cbc`, `pbkdf2`, `hmac`, `sha2`, `rand`), `serde`, `chrono` ve `eframe`/`egui` Native GUI bağımlılıkları (`v1.0.0`).
* [`Cargo.lock`](file:///c:/Users/arday/Desktop/SubRadar/app/Cargo.lock): Deterministik Rust bağımlılık kilit dosyası.
* [`README.md`](file:///c:/Users/arday/Desktop/SubRadar/app/README.md): Saf Rust masaüstü uygulaması mimari, derleme ve test kılavuzu.
* [`subradar.exe`](file:///c:/Users/arday/Desktop/SubRadar/app/subradar.exe): Tekil yerel masaüstü binary'si (~3.2 MB, sıfır webview/node bloat, bağımsız çalışır).
* [`encrypted_sqlite_aes256.subradar`](file:///c:/Users/arday/Desktop/SubRadar/app/encrypted_sqlite_aes256.subradar): Parola korumalı yerel şifreli kasa veri tabanı.
* **`src/`:**
  * [`src/main.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/main.rs): Konsolsuz yerel Windows GUI pencere başlatıcısı (`#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]`, `eframe::run_native`).
  * [`src/theme.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/theme.rs): 3 Katmanlı Tasarım Sistemi Token Mimarisi (İlkel -> Semantik -> Bileşen), Apple Glass ve Raycast/Linear derin siyah koyu/açık tema motoru.
  * [`src/models.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/models.rs): Abonelik veri modelleri (`Subscription`), para birimleri (`TRY`, `USD`, `EUR`), bütçe sağlık skoru, **Aile & Ekip Ortak Lisans Maliyet Bölüştürücü** (kişi başı pay, tasarruf) ve **Apple/Google/Outlook RFC 5545 iCalendar (`.ics`) takvim ihracı**.
  * [`src/presets.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/presets.rs): 6 kategoride **37 popüler dijital servis şablonu**, doğrudan resmi iptal URL'leri ve adım adım **Karanlık Desen (Dark Pattern) İptal Kılavuzları**.
  * [`src/parser.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/parser.rs): Çoklu banka ekstre tarayıcısı (Garanti BBVA, İş Bankası, Enpara, Papara, Wise, Revolut) ve **Gizli Fiyat Artışı / Sinsi Yenileme Algılayıcı (`detect_price_hikes`)**.
  * [`src/legal.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/legal.rs): **Resmi THH / TÜBİS (6502 SK) Tüketici Hakem Heyeti Başvuru Dilekçesi**, **Visa/Mastercard Ters İbraz (Chargeback) Harcama İtirazı Formu** ve KVKK / GDPR Madde 17 resmi fesih ihtarnamesi derleyicisi.
  * [`src/vault.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/vault.rs): Saf Rust `AES-256-CBC` + `PBKDF2-HMAC-SHA256` (60.000 iterasyon) + `HMAC-SHA256` kasa motoru, **Çift Yönlü AES-256 Şifreli JSON Yedekleme ve Akıllı Veri Birleştirme (Backup & Restore)**.
  * [`src/ui.rs`](file:///c:/Users/arday/Desktop/SubRadar/app/src/ui.rs): Bento Grid Kategori & Harcama Analitiği paneli, **Raycast Klavye Kısayolları** (`Ctrl+K`, `Ctrl+N`, `Ctrl+E`, `Ctrl+T`, `Ctrl+D`, `Space`, `Esc`), **Linear Stili "Geri Al" (Undo Toast)** bildirim bandı, **Yaklaşan Yenileme & Deneme Radar Kalkanı** ve modallar.

### 3.4 Web Modüler Bileşenleri (`web/components/`)
* **`layout/`**:
  * `header.html`: Atmospheric glow efekti, marka logosu, masaüstü/mobil menü, ⌘K butonu, Web Audio ses açma/kapama (`#sound-toggle-btn`), Power-User kısayol rehberi (`#shortcuts-help-btn`), tema butonu, dil (EN/DE/TR) ve kur ($/€/₺) butonları, "Bilgisayara İndir" ana aksiyonu.
  * `footer.html`: Canlı motor gecikme göstergesi (`#footer-engine-ping`), Originkit Vector Wordmark etkileşimli WebGL 2.0 noktasal vektör dönüşüm alanı (`#sr-vector-wordmark`), telif hakları, iletişim bilgileri (`iletisim@subradar.dev`), hızlı bağlantılar ve yerel güvenlik taahhütleri.
  * `cookie-banner.html`: Minimal Apple Glass çerez ve canlı kullanıcı etkileşimi bildirim kartı (`#sr-privacy-banner`), canlı saniye sayacı rozeti (`#sr-active-seconds-badge`).
  * `mobile-sticky-cta.html`: Mobilde altta sabit kalan hızlı indirme çubuğu (`#sr-mobile-sticky-cta`).
  * `tiles-loader.html`: Originkit Tiles Loader editoryal karo yükleme ve yüzde sayacı taşıyıcı iskeleti (`#sr-tiles-loader`).
* **`sections/`**:
  * `hero.html`: Ana manşet, işletim sistemi indirme butonları (macOS / Windows), interaktif macOS simülasyon penceresi (`#hero-mock-window`).
  * `problem.html`: Gizli abonelik kayıpları, 4.2 dakikalık iptal atlama süresi ve sektör istatistikleri.
  * `statement-lab.html`: Canlı çevrimdışı banka ekstresi ve kaçak tarayıcı laboratuvarı (`FileReader API`, 0 bayt bulut çıkışı). Çoklu banka ekstre butonları (`.lab-bank-btn`: Garanti BBVA, Enpara.com, Papara, Wise Multi-Cur., Revolut Global), sürükle-bırak alanı (`#lab-dropzone`), cihaz içi tarama çubuğu (`#lab-progress-wrap`), sinsi fiyat artışı (sneak price hike) tespit rozetleri ve doğrudan iptal/THH butonları (`#lab-leaks-list`, `.lab-legal-btn`).
  * `calculator.html`: İsraf hesaplama kaydırıcıları, hızlı kullanıcı profilleri, Aile & Ekip Ortak Lisans Bölüştürücü (Family Splitter) anahtarı (`#calc-split-toggle`) ve kişi sayısı kaydırıcısı (`#calc-split-members`, 2-6 kişi), 1/5 yıllık tasarruf projeksiyonu, PNG "Abonelik Röntgeni" kart ihracı (`#calc-export-png-btn`) ve X paylaşımı.
  * `comparison.html`: Şeffaflık & güven rakip karşılaştırma matrisi (SubRadar vs Rocket Money / Truebill vs Bobby vs Excel).
  * `features.html`: 4 Geliştirme Dalgası Bento Grid mimarisi (`#waves-grid`: Dalga 1 Bento Analitik & Raycast Kısayolları, Dalga 2 37+ Şablon & Sinsi Zam Radarı, Dalga 3 6502 SK THH & Chargeback Kalkanı, Dalga 4 Aile/Ekip Maliyet Bölüştürücü & iCalendar .ics İhracı) ve donanım ivmeli Canlı Bellek Radarı (`#radar-scanner-section`, `#radar-screen`, `.radar-blip`).
  * `architecture.html`: Yerel AES-256 SQLite kilitli kasa mimarisi ve sıfır-bulut ilkeleri.
  * `os-downloads.html`: macOS (Apple Silicon / Intel), Windows (x64 / ARM64) ve Linux kartları + v1.0 sürümü.
  * `hash-verifier.html`: İstemci tarafı donanım ivmeli SHA-256 kurulum doğrulama aracı (`WebCrypto API`).
  * `pricing.html`: Free ($0), Pro ($79 tek seferlik ömür boyu lisans) ve Enterprise (özel kurumsal lisans) modelleri; aboneliksiz tek seferlik ödeme mimarisi.
  * `faq.html`: Sıkça sorulan sorular akordeonu.
* **`modals/`**:
  * `command-palette.html`: ⌘K / Ctrl+K arama paleti, klavye ok tuşları ile gezinim.
  * `download-modal.html`: Mimari seçimi (Apple Silicon vs Intel, Windows x64 vs ARM64), simüle edilen hız ve ilerleme çubuğu, SHA256 göstergesi.
  * `enterprise-modal.html`: Kurumsal teklif formu (Ad, Şirket E-postası, Şirket Adı, inline hata doğrulaması ve loading spinner).
  * `reclaim-modal.html`: CLI indirme komutu kopyalama (`curl -sSL subradar.dev/cli | sh`) ve 3 adımlı kurtarma rehberi.
  * `shortcuts-modal.html`: Raycast/Linear stili Power-User klavye kısayolları modalı (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`).
  * `legal-generator-modal.html`: Canlı 6502 SK & GDPR Madde 17 resmi cayma ve fesih ihtarnamesi sihirbazı (canlı önizleme, pano kopyalama ve `.txt` dosya indirme).
  * `auth-modal.html`: İkili kayan panelli (Double-Slider Sliding Overlay) Apple Glass Monokrom modalı: Saf siyah-beyaz ve uzay grafiti/obsidyen marka katmanı (`.auth-overlay`), buzlu geometrik cam şekiller, parlak beyaz ve ghost outline hap butonlar ("GİRİŞ YAP" / "KAYIT OL"), dairesel monokrom sosyal butonlar (Google, GitHub, Apple), tek tıkla VIP demo, monokrom şifre güvenlik göstergesi ve aktif profil yönetim paneli.
* **`originkit/`**:
  * `react-shim.d.ts`: Saf JS ortamı için React TypeScript tip deklarasyon köprüsü.
  * `tiles-loader.tsx`: Modüler paket içi Originkit Tiles Loader kaynak bileşeni.

### 3.5 Web Stilleri (`web/css/`)
* `base.css`: SF Pro font ailesi, `html.light` ve `html.dark` değişkenleri, skip-link, scroll-behavior, metin seçimi renkleri.
* `components.css`: `.apple-glass` arka plan bluru, `.apple-card` kalkış ve imleç takipçi dinamik ışıma efekti, mobil sabit CTA ve çerez banner'ı stilleri.
* `cursors.css`: Windows 11 Tailless Cursors imleç motoru (Base64 ve `assets/cursors/`).
* `main.css`: Stil birleştirici dosya.

### 3.6 Web Betikleri (`web/js/`), Varlıklar & PWA
* `config.js`: Para birimleri ve kurlar (`USD: 1`, `EUR: 0.86`, `TRY: 48.35`).
* `supabase.js`: Supabase v2 JS SDK istemcisi, Auth ve Bulut Veritabanı entegrasyon köprüsü.
* `theme.js`: Koyu / Açık tema geçiş yöneticisi (`html.light`, `html.dark`).
* `fx.js`: Canlı döviz kurları çekici (open.er-api / frankfurter, 12 saat TTL).
* `toast.js`: Apple Glass kayan bildirim balonu sistemi (`srShowToast`).
* `audio-fx.js`: Web Audio API sıfır-dosya dokunsal ses motoru (`srAudio`).
* `cursor-glow.js`: Dinamik imleç takipçi cam aydınlatma ve ışıma motoru.
* `statement-lab.js`: İstemci taraflı çevrimdışı ekstre ve kaçak abonelik analizörü (`FileReader API`, 0 bayt ağ çıkışı). Banka numuneleri veri tabanı (`BANK_DATASETS`: Garanti BBVA, Enpara, Papara, Wise CSV, Revolut), çoklu para birimi normalizasyonu, aylar arası sinsi fiyat artışı algılayıcı (`hike` rozetleri: `+X% Zam`), dinamik sonuç kartı enjektörü (`#lab-leaks-list`) ve 6502 SK THH / Chargeback dilekçe modalı bağlayıcı (`.lab-legal-btn` -> `srOpenLegalModal`).
* `hash-verifier.js`: WebCrypto API SHA-256 kurulum doğrulama motoru.
* `social-export.js`: HTML5 Canvas 1200x630 "Abonelik Röntgeni" PNG kart ihracı ve X paylaşımı.
* `calculator.js`: Abonelik tasarruf ve Aile/Ekip Ortak Lisans Bölüştürücü (Family Splitter) algoritması ($32/araç + $78/deneme + 2-6 kişi paylaştırıcı).
* `hero-window.js`: macOS pencere simülasyonu: trafik ışıkları, canlı iptal, arama, sayaçlar.
* `tiles-loader.js`: Originkit "Tiles Loader" saf JS motoru (hücre ızgarası, edRand, % sayacı).
* `vector-wordmark.js`: Originkit "Vector Wordmark" WebGL 2.0 motoru (2 kanallı atlas, 3 düğümlü kafes).
* `scroll-motion.js`: İlerleme çizgisi (`#sr-progress`), alt gezinme adası (`#sr-scrollspy`), reveal animasyonları.
* `analytics.js`: Canlı saniye sayacı ve sayfa içi etkileşim sayacı (`srAnalytics`).
* `cookie-banner.js`: Minimal Apple Glass çerez kartı, otomatik açılış ve onay kontrolcüsü.
* `mobile-cta.js`: Mobilde kaydırmaya bağlı beliren dinamik hızlı aksiyon çubuğu.
* `main.js`: Tüm web modüllerini ve Service Worker'ı başlatan ana giriş dosyası.
* `modals/`: `download-modal.js`, `command-palette.js`, `enterprise-modal.js`, `reclaim-modal.js`, `shortcuts-modal.js`, `legal-gen.js`, `auth-modal.js`.
* `scripts/`: `build.py` (23 bileşenin bütünlük testi), `embed_tiles_loader.py` (Tiles Loader derleyici).

---

## 4. Durum Yönetimi (State) ve Veri Akışı

### 4.1 Masaüstü Durum Yönetimi (`app/src/models.rs` & `app/src/ui.rs`)
* **`SubRadarApp` State:**
  * `vault_state`: `Locked` veya `Unlocked(Vec<Subscription>)`
  * `filter_query`: String (Arama ve filtreleme)
  * `selected_category`: Option<Category> (Bento analitik filtreleme)
  * `undo_stack`: Option<(Subscription, Instant)> (5 saniyelik Linear Undo Toast durumu)
  * `toast_message`: Option<(String, Instant)> (Görsel durum bildirimi)
  * `dark_mode`: bool (Tema durumu)
  * `family_split_modal`: Option<FamilySplitState> (Aile/Ekip maliyet bölüştürme penceresi)
  * `legal_doc_modal`: Option<LegalDocState> (THH, Chargeback veya Fesih belgesi önizleme penceresi)
  * `statement_modal`: Option<StatementState> (Ekstre tarama ve fiyat artışı analiz penceresi)

### 4.2 Web Vitrini Durum Yönetimi (`web/js/`)
* **Para Birimi:** `srCurrency` (`'USD'`, `'EUR'`, `'TRY'`) -> `localStorage.getItem('sr_currency')`.
* **Tema Durumu:** `localStorage.getItem('sr-theme')` (`'dark'` / `'light'`) -> `document.documentElement.classList`.
* **Ses Efektleri:** `srAudio.enabled` -> `localStorage.getItem('sr-sound')`.

---

## 5. Bileşen ve DOM ID Dizini

| DOM ID | Konum | Tanım |
| :--- | :--- | :--- |
| `#site-header` | `layout/header.html` | Kaydırmayla adaya dönüşen (`is-scrolled-island`) Apple Glass üst çubuğu |
| `#sound-toggle-btn` | `layout/header.html` | Web Audio osilatör ses motorunu açıp kapatan buton |
| `#shortcuts-help-btn` | `layout/header.html` | Raycast/Linear kısayollar rehber modalını açan buton |
| `#theme-toggle` | `layout/header.html` | Açık/Koyu tema geçiş butonu |
| `#currency-toggle-btn` | `layout/header.html` | USD ($), EUR (€), TRY (₺) döviz kuru döngü butonu |
| `#lang-toggle-btn` | `layout/header.html` | TR, EN, DE dil döngü butonu |
| `#auth-modal-btn` | `layout/header.html` | Üst ada sağında yer alan Giriş Yap / Kayıt Ol butonu |
| `#hero-mock-window` | `sections/hero.html` | İnteraktif macOS masaüstü simülasyon penceresi |
| `#ekstre-laboratuvari` | `sections/statement-lab.html`| Canlı çevrimdışı ekstre laboratuvarı ana bölüm kapsayıcısı |
| `#lab-dropzone` | `sections/statement-lab.html`| Çevrimdışı ekstre sürükle-bırak alanı |
| `#lab-file-input` | `sections/statement-lab.html`| Gizli dosya yükleme girdisi (`.csv,.txt,.pdf`) |
| `#lab-sample-btn` | `sections/statement-lab.html`| "Örnek Ekstreyle Canlı Dene" aksiyon butonu |
| `#lab-reset-btn` | `sections/statement-lab.html`| Ekstre analizini sıfırlama ve temizleme butonu |
| `#lab-bank-selector-wrap` | `sections/statement-lab.html`| Dalga 2 hazır banka ekstre numuneleri çubuğu kapsayıcısı |
| `#lab-bank-selector` | `sections/statement-lab.html`| Banka ekstre numuneleri buton grubu |
| `.lab-bank-btn` | `sections/statement-lab.html`| Çoklu banka ekstre butonları (`data-bank="garanti\|enpara\|papara\|wise\|revolut"`) |
| `#lab-progress-wrap` | `sections/statement-lab.html`| Cihaz içi tarama simülasyonu ilerleme alanı (`#lab-progress-bar`, `#lab-progress-pct`, `#lab-status-text`) |
| `#lab-results` | `sections/statement-lab.html`| Analiz sonuçları ve metrik özet kartları paneli |
| `#lab-stat-count` | `sections/statement-lab.html`| Tespit edilen kaçak ve sinsi fiyat artışı (sneak price hike) adedi rozeti |
| `#lab-stat-monthly` | `sections/statement-lab.html`| Aylık kurtarılabilir israf tutarı göstergesi |
| `#lab-stat-yearly` | `sections/statement-lab.html`| Yıllık kurtarılabilir tasarruf projeksiyonu |
| `#lab-leaks-list` | `sections/statement-lab.html`| Kaçak abonelik kartlarının ve sinsi zam rozetlerinin listelendiği konteyner |
| `.lab-legal-btn` | `statement-lab.js` | Kart üzerindeki "6502 SK / THH" resmi dilekçe modalı tetikleyicisi |
| `#ozellikler` | `sections/features.html` | Özellikler ve motor mimarisi ana bölümü |
| `#radar-scanner-section` | `sections/features.html` | Donanım ivmeli Canlı Bellek & Ekstre Radarı hareketli grafik alanı |
| `#radar-screen` | `sections/features.html` | Dönen radar ışını, koordinat metinleri ve hedef çemberleri SVG ekranı |
| `#radar-live-status` | `sections/features.html` | Canlı radar tarama durum rozeti (Yakalanan sızıntı sayısı) |
| `#radar-burn-val` | `sections/features.html` | Radarda tespit edilen anlık aylık israf tutarı |
| `.radar-blip` | `sections/features.html` | Radar ekranındaki hedef servis noktaları (Adobe CC, AWS, JetBrains, Figma) |
| `#waves-grid` | `sections/features.html` | 4 Geliştirme Dalgası Bento Grid ızgarası (Dalga 1-4 kartları) |
| `#statement-dropzone` | `sections/statement-lab.html`| Çevrimdışı ekstre sürükle-bırak alanı (yedek referans) |
| `#calc-savings-val` | `sections/calculator.html` | Dinamik tasarruf tutarı göstergesi |
| `#calc-split-toggle`| `sections/calculator.html` | Aile & Ekip ortak kullanım modu açma/kapama anahtarı |
| `#calc-split-members`| `sections/calculator.html` | Ortak kişi sayısı kaydırıcısı (2 - 6 kişi) |
| `#out-split-per-person`| `sections/calculator.html`| Kişi başı aylık maliyet göstergesi |
| `#out-split-annual-saved`| `sections/calculator.html`| Ortak kullanım yıllık tasarrufu göstergesi |
| `#calc-export-png-btn`| `sections/calculator.html` | Retina "Abonelik Röntgeni" PNG kart ihracı butonu |
| `#cmd-palette-backdrop`| `modals/command-palette.html`| Komut paleti modal arka planı |
| `#cmd-palette-input` | `modals/command-palette.html`| Komut paleti arama kutusu |
| `#download-modal-backdrop`| `modals/download-modal.html`| İndirme modalı arka planı |
| `#dl-progress-bar` | `modals/download-modal.html`| İndirme ilerleme çubuğu |
| `#ent-modal-backdrop`| `modals/enterprise-modal.html`| Kurumsal form modalı |
| `#reclaim-modal-backdrop`| `modals/reclaim-modal.html`| Sermaye geri kazanım & CLI modalı |
| `#auth-modal-backdrop`| `modals/auth-modal.html` | İkili kayan panelli (Double-Slider) giriş/kayıt modalı |
| `#sr-tiles-loader` | `layout/tiles-loader.html` | Originkit edRand karo yükleyici taşıyıcısı |
| `#sr-vector-wordmark` | `layout/footer.html` | Originkit Vector Wordmark etkileşimli WebGL 2.0 alanı |
| `#sr-progress` | `scroll-motion.js` | Sayfa üstündeki akıcı okuma ilerleme çizgisi |
| `#sr-scrollspy` | `scroll-motion.js` | Alt merkezde sabit yüzen minimalist bölüm gezinti adası |
| `#sr-toast` | `toast.js` | Dinamik olarak üretilen Apple Glass bildirim balonu |

---

## 6. Tasarım ve Stil Sistemi

* **Renkler:**
  * Koyu Taban: `#000000` (Siyah), `#08080a` (Derin cam), `#09090b` (Kart arka planı), `#0d0d11` (Pencere başlığı).
  * Açık Taban: `#f5f5f7` (macOS açık gri), `#ffffff` (Kartlar), `#1d1d1f` (Koyu gri metin).
  * Aksanlar: `#10b981` (Zümrüt yeşili - Tasarruf ve onay), `#6366f1` (İndigo mor - Vurgu), `#ef4444` (Kırmızı - İptal/Uyarı).
* **3 Katmanlı Token Sistemi (`theme.rs`):**
  * `Primitive`: Temel HEX ve RGB değerleri (`COLOR_EMERALD_500`, `COLOR_SLATE_950` vb.).
  * `Semantic`: Anlamsal roller (`surface_primary`, `text_contrast`, `accent_active` vb.).
  * `Component`: Doğrudan bileşen alanları (`bento_card_bg`, `undo_toast_border` vb.).

---

## 7. Masaüstü Uygulaması Mimarisi & Çalışma Mantığı (`app/ v1.0`)

`app/` dizini hantal bir web sarmalayıcısı (Electron/Node.js) kullanmayan, **%100 Saf Rust (`eframe` / `egui`)** ile yazılmış ~3.2 MB boyutunda ultra hafif native masaüstü istemcisidir (`app/subradar.exe`):
* **Güvenlik Çekirdeği (`src/vault.rs`):** Saf Rust kriptografi küfeleriyle `AES-256-CBC` şifreleme, `PBKDF2-HMAC-SHA256` (60.000 iterasyon) anahtar türetme ve sabit zamanlı `HMAC-SHA256` bütünlük doğrulaması. Çift yönlü AES-256 şifreli JSON yedekleme ve akıllı birleştirme (`backup_to_json`, `restore_from_json`).
* **Çoklu Banka Ekstre Tarayıcı (`src/parser.rs`):** Garanti BBVA, İş Bankası, Enpara, Papara, Wise ve Revolut ekstrelerini internet bağlantısı olmadan yerel bellekte tarayan deterministik ayrıştırıcı. Ardışık ay fiyat artışlarını yakalayan `detect_price_hikes` fonksiyonu.
* **Hukuki Fesih & İtiraz Sihirbazı (`src/legal.rs`):** 6502 SK THH / TÜBİS Başvuru Dilekçesi, Visa/Mastercard Chargeback Harcama İtirazı Formu, KVKK / GDPR Madde 17 resmi fesih ihtarnamesi üreticisi.
* **Şablonlar & Karanlık Desen İptal Kılavuzları (`src/presets.rs`):** 6 kategoride 37 popüler dijital servis şablonu, doğrudan resmi iptal bağlantıları ve adım adım Dark Pattern atlatma yönergeleri.
* **Veri Modelleri, Aile Bölüştürücü & Takvim (`src/models.rs`):** Aile/Ekip ortak lisans maliyet paylaştırıcı algoritması, Apple/Google/Outlook RFC 5545 iCalendar (`.ics`) formatında takvim dışa aktarma fonksiyonu (`export_to_ics`).
* **Native GUI Arayüzü (`src/ui.rs`, `src/theme.rs`):** Bento Grid Kategori & Harcama Analitiği, Raycast klavye kısayolları (`Ctrl+K`, `Ctrl+N`, `Ctrl+E`, `Ctrl+T`, `Ctrl+D`, `Space`, `Esc`), Linear Undo Toast ve Yaklaşan Yenileme & Deneme Radar Kalkanı.

---

## 8. Otonom Mühendislik Organizasyonu & Dinamik Alt Ajan Bölünmesi

SubRadar projesi, Baş Orkestratör yönetimindeki **5 Departman ve 21 Kalıcı Uzman Alt Ajan** tarafından yönetilmektedir:

### 5 Departman ve 21 Uzman Alt Ajan Listesi:
1. **Araştırma, Kod Yıkımı (Debloat) & Mimari Denetim Departmanı:**
   - `deep-code-researcher`
   - `ponytail-debloater`
   - `architecture-sync-guardian`
   - `performance-a11y-auditor`
2. **Tasarım, Marka & Görsel Sanatlar Departmanı:**
   - `ui-ux-glass-designer`
   - `brand-visual-artist`
   - `originkit-webgl-specialist`
   - `audio-haptics-engineer`
3. **Web Platformu & FinOps Mühendislik Departmanı:**
   - `web-ui-engineer`
   - `hero-simulator-engineer`
   - `interactive-modals-engineer`
   - `i18n-finops-specialist`
   - `supabase-auth-specialist`
4. **Masaüstü Çekirdeği, Kriptografi & Hukuk Departmanı:**
   - `desktop-core-engineer`
   - `security-crypto-auditor`
   - `legal-compliance-counsel`
5. **DevOps, Git/GitHub, Kalite Kontrol & Dokümantasyon Departmanı:**
   - `git-ops-specialist`
   - `github-platform-manager`
   - `seo-pwa-release-engineer`
   - `test-automation-runner`
   - `qa-docs-specialist`

> ⚡ **Dinamik Alt Ajan Bölünmesi (Subagent Splitting & Multiplication):**  
> Kullanıcının doğrudan onayı ve talimatıyla; kodlama, optimizasyon veya derin mimari refactoring işlerinde ana geliştirici alt ajanlar ikili veya üçlü uzman hücrelere dinamik olarak bölünebilir (Örnek: `desktop-core-engineer` -> `desktop-ui-worker` + `desktop-state-worker`). Bu işlem alt görevleri paralel yürütürken kalite kontrolünü en üst seviyede tutar.

---

## 9. Geliştirici İpuçları, Testler & Sık Yapılan İşlemler

### 9.1 Rust Birim Testlerini Çalıştırma (15/15 Geçerli)
```powershell
cd app
cargo test
```
*Tüm 15 birim testi (`legal`, `models`, `parser`, `vault`) 0 hata ve 0 uyarı ile tamamlanır.*

### 9.2 Yerel Masaüstü Binary'sini Başlatma
```powershell
cd app
cargo run --release
# veya doğrudan üretilen tekil binary:
.\subradar.exe
```

### 9.3 Yerel Web Sunucusu
```bash
python -m http.server 8765
```
Tarayıcıdan `http://localhost:8765/web/code.html` veya `http://localhost:8765/` adresine gidin.

### 9.4 Bileşen ve Dokümantasyon Senkronizasyon Kuralı (ZORUNLU)
Canlı yayınlanan sayfa doğrudan `web/code.html`'dir.
Modüler `web/components/` veya `web/js/` içinde bir değişiklik yaptığınızda:
1. `python web/scripts/build.py` çalıştırarak 23 modüler bileşenin bütünlüğünü doğrulayın.
2. `web/code.html` dosyasındaki ilgili bloğu da güncelleyin veya oraya entegre edin.
3. **KOD YAPISI & DOKÜMANTASYON SENKRONİZASYONU:** Kod tabanında yapılan her ekleme, silme veya mimari değişiklikte; git commit ve push işlemlerinden önce MUTLAKA `README.md`, `CODEBASE.md` ve `AGENTS.md` dosyalarındaki **Kod Yapısı (Dosya Haritası / Ağacı)**, katman durumları ve açıklamaları anında ve eksiksiz güncellenecektir.

---
*Bu doküman, Antigravity ve tüm AI modelleri için tek kaynak (single source of truth) olacak şekilde eksiksiz tutulmuştur.*
