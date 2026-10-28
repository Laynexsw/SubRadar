<div align="center">

<img src="favicon.svg" width="76" height="76" alt="SubRadar Amblem" />

# SubRadar v1.0
### Akıllı Abonelik Takibi, Tek Tıkla İptal ve %100 Yerel Şifreli Kasa

[![Sürüm](https://img.shields.io/badge/S%C3%BCr%C3%BCm-v1.0%20Native%20Rust-6366f1?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Güvenlik](https://img.shields.io/badge/G%C3%BCvenlik-AES--256%20Yerel%20%C5%9Eifreleme-10b981?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Laynexsw/SubRadar/tree/main/app/src)
[![Çevrimdışı Mimari](https://img.shields.io/badge/%C3%87al%C4%B1%C5%9Fma%20Modu-100%25%20%C3%87evrimd%C4%B1%C5%9F%C4%B1%20%26%20Yerel-0ea5e9?style=for-the-badge&logo=lock&logoColor=white)](privacy.html)
[![Yasal Haklar](https://img.shields.io/badge/Yasal%20Koruma-6502%20SK%20%7C%20KVKK%20%7C%20GDPR-f59e0b?style=for-the-badge&logo=scales&logoColor=white)](terms.html)
[![Platform Desteği](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-18181b?style=for-the-badge&logo=apple&logoColor=white)](https://laynexsw.github.io/SubRadar/#os-downloads)
[![Ticari Lisans](https://img.shields.io/badge/Lisans-Ticari%20Lisans%20(Commercial%20v1.0)-2563eb?style=for-the-badge)](LICENSE)

<br/>

**SubRadar v1.0**; hem günlük bireysel kullanıcılar hem de profesyonel ekipler için geliştirilmiş **resmi, hızlı ve %100 yerel çalışan masaüstü abonelik yönetim yazılımıdır**.  
Netflix, Spotify, YouTube Premium, iCloud, Adobe, ChatGPT gibi kişisel aboneliklerinizden kurumsal iş yazılımlarınıza kadar tüm düzenli ödemelerinizi tek bir ekranda toplar. Unutulan deneme sürelerini, gizli fiyat artışlarını ve iptal edilmesi zorlaştırılan abonelikleri; banka şifrenizi istemeden ve verilerinizi hiçbir bulut sunucusuna göndermeden **tamamen kendi bilgisayarınızda** tespit eder ve tek tıkla sonlandırmanızı sağlar.

<br/>

[**🌐 Resmi Web Sitesi ve Canlı Simülatör**](https://laynexsw.github.io/SubRadar/) &nbsp;&bull;&nbsp; [**💻 Masaüstü Uygulaması (v1.0)**](app/README.md) &nbsp;&bull;&nbsp; [**📜 Ticari Lisans Sözleşmesi**](LICENSE) &nbsp;&bull;&nbsp; [**🔒 Gizlilik Politikası**](privacy.html) &nbsp;&bull;&nbsp; [**⚖️ Kullanım Koşulları**](terms.html)

</div>

---

## 📊 Neden SubRadar? (Sorun ve Çözüm)

Günümüzde hem bireysel kullanıcılar hem de işletmeler, farkında olmadan her ay kullanmadıkları abonelikler için ciddi bütçeler kaybetmektedir:

1. **Unutulan Deneme Süreleri ve Otomatik Yenilemeler:** "İlk ay ücretsiz" olarak başlatılan deneme üyelikleri ve yılda bir kez otomatik çekilen abonelikler, zamanında iptal edilmediği için bütçenizi sessizce eritir.
2. **Zorlaştırılmış İptal Ekranları:** Pek çok dijital servis, abonelik iptal butonlarını karmaşık menülerin, bitmeyen anketlerin ve canlı destek adımlarının arkasına gizleyerek iptal sürecini zorlaştırır.
3. **Bulut Uygulamalarının Gizlilik Riski:** Piyasadaki sıradan harcama takip uygulamaları, banka hesap şifrelerinizi ister ve harcama geçmişinizi kendi bulut sunucularına kaydeder. Üstelik aboneliklerinizi yönetmek için sizden her ay yeni bir abonelik ücreti talep eder.

### SubRadar v1.0 Çözümü
SubRadar, **%100 Çevrimdışı (İnternetsiz) Çalışma** yapısı ve **Tek Seferlik Ömür Boyu Ticari Lisans** modeliyle verilerinizi yalnızca kendi bilgisayarınızda tutar. Tek bir unutulmuş aboneliği iptal ettiğinizde dahi yazılım maliyetini anında geri kazanırsınız.

---

## 🏛️ Temel Özellikler ve Avantajlar

| Özellik | Nasıl Çalışır? | Size Sağladığı Fayda |
| :--- | :--- | :--- |
| 🛡️ **%100 Yerel Şifreli Kasa** | `AES-256` şifreleme standardı ile verileri sadece bilgisayarınızda (`encrypted_sqlite_aes256.subradar`) saklar. | Banka şifresi veya hesap erişimi istenmez. Verileriniz yalnızca sizin belirlediğiniz parola ile açılır; hiçbir sunucuya gönderilmez. |
| 📄 **Çevrimdışı Ekstre Tarayıcı** | İndirdiğiniz banka/kredi kartı ekstresini (CSV / metin) internet bağlantısı olmadan doğrudan cihazınızda tarar. | Ekstreniz bilgisayarınızdan dışarı çıkmadan içerisindeki tüm düzenli abonelikler, unutulan üyelikler ve fiyat artışları saniyeler içinde listelenir. |
| ⚡ **Tek Tıkla İptal & Yasal Dilekçe** | Doğrudan İptal Bağlantıları + **6502 Sayılı Tüketici Kanunu** ve **KVKK / GDPR** resmi iptal dilekçesi oluşturucu. | Karmaşık iptal menüleriyle uğraşmadan doğrudan iptal sayfasına ulaşırsınız veya tek tıkla resmi fesih/cayma bildirim metni oluşturup indirebilirsiniz. |
| 🖥️ **Modern Apple Glass Arayüzü** | Akıcı masaüstü uygulaması, `⌘K` / `Ctrl+K` hızlı arama paleti ve canlı döviz kuru (`TRY`, `USD`, `EUR`) desteği. | Yabancı para birimiyle ödediğiniz aboneliklerin güncel TL/Dolar/Euro karşılığını, aylık toplam giderinizi ve yaklaşan ödeme günlerini anında görürsünüz. |

---

## 📁 Kurumsal Proje Mimarisi ve Eksiksiz Dosya Kataloğu

Proje yapısı; yönetim politikaları, masaüstü uygulaması, görsel bileşenler ve modüler web platformu katmanlarına ayrılmıştır. **Tüm dosyalar tam ve eksiksiz olarak listelenmiştir:**

```text
SubRadar/
│
├── 🏛️ 1. KÖK YÖNETİM, GÜVENLİK VE METADATA KATMANI (ROOT GOVERNANCE & POLICIES)
│   ├── index.html                        # Kök yönlendirici (Canlı GitHub Pages trafiğini anında web/code.html'e aktarır)
│   ├── 404.html                          # Özel Apple Glass 404 hata sayfası (animasyonlu radar tarayıcı & hızlı aksiyonlar)
│   ├── privacy.html                      # %100 Yerel & Çevrimdışı Gizlilik Politikası (GDPR Madde 17 / KVKK uyumlu)
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
│   ├── README.md                         # [BU DOSYA] Kurumsal karşılama, mimari harita ve yönetim dokümantasyonu
│   ├── AGENTS.md                         # AI ajanları ve LLM oturumları için hızlı kurumsal bellek ve bağlam kılavuzu
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
│   └── src/                              # %100 Saf Rust Kaynak Kodları (~2.94 MB Tekil Native .exe)
│       ├── main.rs                       # Konsolsuz yerel Windows GUI pencere başlatıcısı (eframe::run_native)
│       ├── theme.rs                      # Minimalist Apple / Raycast / Linear koyu ve açık tema motoru
│       ├── models.rs                     # Abonelik, durum, para birimi (TRY/USD/EUR) ve bütçe sağlık puanı veri modelleri
│       ├── presets.rs                    # 18+ popüler dijital servis şablonu ve doğrudan resmi iptal bağlantıları
│       ├── vault.rs                      # Saf Rust AES-256-CBC + PBKDF2-HMAC-SHA256 + HMAC-SHA256 yerel şifreli kasa motoru ve birim testleri
│       ├── parser.rs                     # %100 çevrimdışı banka ekstresi ve harcama metni tarayıcısı ve birim testleri
│       ├── legal.rs                      # 6502 SK & GDPR Madde 17 resmi iptal dilekçesi üreticisi ve birim testleri
│       └── ui.rs                         # Tek ekranda net özet, Ctrl+K hızlı arama, tek tıkla iptal ve hızlı ekleme arayüzü
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
    │   ├── layout/                       # Çerçeve & Genel Düzen Bileşenleri
    │   │   ├── header.html               # Üst cam çubuk, logo, ⌘K, ses, kısayol, dil, kur ve tema kontrolleri
    │   │   ├── footer.html               # Alt bilgi, Originkit Vector Wordmark, canlı yerel gecikme ve telif bildirimleri
    │   │   ├── cookie-banner.html        # Minimal Apple Glass çerez kartı ve canlı kullanıcı etkileşim onayı
    │   │   ├── mobile-sticky-cta.html    # Mobilde altta sabit kalan hızlı indirme ve aksiyon çubuğu
    │   │   └── tiles-loader.html         # Originkit Tiles Loader editoryal karo yükleme ve yüzde sayacı iskeleti
    │   │
    │   ├── sections/                     # Sayfa Bölümleri & İşlevsel Modüller
    │   │   ├── hero.html                 # Hero vitrin alanı, çift CTA ve interaktif macOS pencere simülasyonu
    │   │   ├── problem.html              # Abonelik israfı, sektör verileri ve zorlaştırılmış iptal süreçleri
    │   │   ├── statement-lab.html        # Canlı çevrimdışı banka ekstresi ve unutulan abonelik tarayıcısı
    │   │   ├── calculator.html           # Abonelik tasarruf hesaplayıcı, kaydırıcılar, PNG kart ihracı ve X paylaşımı
    │   │   ├── comparison.html           # Şeffaflık & güven karşılaştırma tablosu (SubRadar vs Bulut Uygulamaları)
    │   │   ├── features.html             # Çekirdek 4 motor özelliği: Denetim, Otomatik Yakalama, Hızlı İptal, Yerel Kasa
    │   │   ├── architecture.html         # Yerel AES-256 SQLite şifreleme ve çevrimdışı çalışma şeması
    │   │   ├── os-downloads.html         # macOS, Windows ve Linux platform indirme kartları ve v1.0 sürüm bilgileri
    │   │   ├── hash-verifier.html        # İstemci tarafı SHA-256 kurulum dosyası doğrulayıcı
    │   │   ├── pricing.html              # Bireysel, Pro ($79) ve Kurumsal tek seferlik ömür boyu paket tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular (SSS) akordeon bilgi paneli
    │   │
    │   ├── modals/                       # Etkileşimli Modallar & Kullanıcı Akışları
    │   │   ├── download-modal.html       # Mimari seçimi (ARM/x86), indirme ilerleme çubuğu ve rehber modalı
    │   │   ├── command-palette.html      # ⌘K / Ctrl+K hızlı komut paleti arama penceresi
    │   │   ├── enterprise-modal.html     # Kurumsal çoklu kullanıcı teklif formu (doğrulama & bildirim)
    │   │   ├── reclaim-modal.html        # Tasarruf adımları ve hızlı kurulum panosu (`curl -sSL...`)
    │   │   ├── shortcuts-modal.html      # Klavye kısayolları rehber modalı (`?`, `T`, `S`, `C`, `L`, `D`)
    │   │   ├── legal-generator-modal.html# Canlı 6502 SK & GDPR Madde 17 resmi cayma ve fesih dilekçesi sihirbazı
    │   │   └── auth-modal.html           # İkili kayan panelli (Double-Slider) Apple Glass giriş ve kayıt modalı
    │   │
    │   └── originkit/                    # Modüler Originkit Tip ve React Uyumluluk Parçaları
    │       ├── react-shim.d.ts           # Saf JS ortamı için React TypeScript tip deklarasyon köprüsü
    │       └── tiles-loader.tsx          # Modüler paket içi Originkit Tiles Loader kaynak bileşeni
    │
    ├── css/                              # Web Stil Sistemi (Apple Glassmorphism)
    │   ├── base.css                      # Renk token'ları, SF Pro/Inter tipografi hiyerarşisi, açık/koyu tema sınıfları
    │   ├── components.css                # Cam efektleri, range slider, imleç ışığı, ses dalgası ve modal animasyonları
    │   ├── cursors.css                   # Windows 11 Tailless imleç CSS motoru ve Base64 veri URI kuralları
    │   └── main.css                      # Tüm CSS modüllerini derleyen ana stil orkestrasyonu
    │
    ├── js/                               # Web İstemci Zekâsı & Modüler Betikler
    │   ├── config.js                     # Sabitler, kurlar (USD, EUR, TRY) ve para birimi yöneticisi
    │   ├── supabase.js                   # Supabase v2 JS SDK istemcisi, Auth ve Bulut Veritabanı entegrasyon köprüsü
    │   ├── i18n.js                       # Kapsamlı TR/EN/DE çok dilli sözlüğü ve DOM metin düğümü çeviricisi
    │   ├── theme.js                      # Koyu / Açık tema geçiş yöneticisi (`html.light`, `html.dark`)
    │   ├── fx.js                         # Canlı döviz kurları çekici (open.er-api / frankfurter, 12 saat TTL)
    │   ├── toast.js                      # Apple Glass kayan bildirim balonu sistemi (`srShowToast`)
    │   ├── audio-fx.js                   # Web Audio API sıfır-dosya dokunsal ses motoru (`srAudio`)
    │   ├── cursor-glow.js                # Dinamik imleç takipçi cam aydınlatma ve ışıma motoru
    │   ├── statement-lab.js              # İstemci taraflı çevrimdışı ekstre analizörü ve abonelik dedektörü
    │   ├── hash-verifier.js              # WebCrypto API SHA-256 kurulum doğrulama motoru
    │   ├── social-export.js              # HTML5 Canvas 1200x630 "Abonelik Röntgeni" PNG kart ihracı ve X paylaşımı
    │   ├── calculator.js                 # Abonelik tasarruf hesaplama algoritması ($32/araç + $78/deneme) ve profil geçişleri
    │   ├── hero-window.js                # macOS pencere simülasyonu: trafik ışıkları, canlı iptal, arama, sayaçlar
    │   ├── tiles-loader.js               # Originkit "Tiles Loader" saf JS motoru (hücre ızgarası, edRand, % sayacı)
    │   ├── vector-wordmark.js            # Originkit "Vector Wordmark" WebGL 2.0 motoru (2 kanallı atlas, 3 düğümlü kafes)
    │   ├── scroll-motion.js              # İlerleme çizgisi (`#sr-progress`), alt gezinme adası (`#sr-scrollspy`), reveal animasyonları
    │   ├── analytics.js                  # Canlı saniye sayacı ve sayfa içi etkileşim sayacı (`srAnalytics`)
    │   ├── cookie-banner.js              # Minimal Apple Glass çerez kartı, otomatik açılış ve onay kontrolcüsü
    │   ├── mobile-cta.js                 # Mobilde kaydırmaya bağlı beliren dinamik hızlı aksiyon çubuğu
    │   ├── main.js                       # Tüm web modüllerini ve Service Worker'ı başlatan ana giriş dosyası
    │   │
    │   └── modals/                       # Etkileşimli Modal Kontrolcüleri
    │       ├── download-modal.js         # İndirme simülasyonu, hız/boyut sayacı, SHA doğrulaması ve dosya indirici
    │       ├── command-palette.js        # ⌘K klavye kısayolu, gerçek zamanlı filtreleme ve aksiyon tetikleyicisi
    │       ├── enterprise-modal.js       # Kurumsal form alanları doğrulayıcısı (hata denetimi & spinner)
    │       ├── reclaim-modal.js          # CLI komut kopyalama panosu (`curl -sSL...`) ve geri kazanım adımları
    │       ├── shortcuts-modal.js        # Klavye kısayol dinleyicisi (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`)
    │       ├── legal-gen.js              # Canlı yasal fesih metni derleyici, pano kopyalama ve `.txt` indirme yöneticisi
    │       └── auth-modal.js             # İkili kayan panel animasyonu (sliding overlay), sosyal giriş ve profil yöneticisi
    │
    └── scripts/                          # CI/CD & Derleme Otomasyon Betikleri
        ├── build.py                      # 23 modüler HTML bileşenini test eden ve doğrulayan Python betiği
        └── embed_tiles_loader.py         # Originkit Tiles Loader bileşenini code.html içine derleyip enjekte eden betik
```

---

## ⚖️ Karşılaştırma Tablosu: SubRadar vs. Diğer Yöntemler

| Özellik / Kriter | SubRadar v1.0 (Yerel & Çevrimdışı) | Bulut Tabanlı Uygulamalar | Manuel Takip (Excel / Notlar) |
| :--- | :--- | :--- | :--- |
| **Banka Şifresi İsteği** | ❌ **Asla İstenmez** (%100 Güvenli) | ⚠️ **Zorunlu** (Banka erişimi ister) | ❌ İstenmez |
| **Verilerin Saklandığı Yer** | 🔒 **Sadece Sizin Bilgisayarınız** | ☁️ **Yabancı Bulut Sunucuları** | ☁️ Bulut / Yerel karışık |
| **Veri Güvenliği** | 🛡️ **AES-256 Şifreli Kasa** | 🔑 Şirket sunucularında açık veri | ❌ Şifresiz dosya |
| **Otomatik Ekstre Tarama** | ⚡ **İnternetsiz Anında Tarama** | ☁️ Sunucuya yükleyerek tarama | ❌ Tek tek elle yazma |
| **İptal ve Yasal Dilekçe** | ⚖️ **Tek Tıkla İptal Sayfası + Resmi Dilekçe** | ❌ Sadece bildirim gönderir | ❌ Yok |
| **İnternetsiz Çalışma** | 🟢 **%100 Çevrimdışı Çalışır** | 🔴 İnternet olmadan açılmaz | 🟡 Kısmi |
| **Ücretlendirme Modeli** | ♾️ **Tek Seferlik Ödeme (Ömür Boyu)** | 💸 **Her Ay Düzenli Abonelik Ücreti** | 💸 Office abonelik ücreti |

---

## 🔒 Güvenlik ve Gizlilik Standartları

SubRadar v1.0, hem bireysel kullanıcıların kişisel bütçe mahremiyetini hem de şirketlerin ticari veri güvenliğini korumak için şu ilkelerle çalışır:

1. **Verileriniz Bilgisayarınızdan Çıkmaz:** SubRadar'a eklediğiniz hiçbir abonelik, tutar veya ekstre bilgisi internete gönderilmez.
2. **Parola Korumalı AES-256 Kasa (`app/src/vault.rs`):** Verileriniz bilgisayarınızda `AES-256-CBC` + `PBKDF2-HMAC-SHA256` (60.000 iterasyon) + `HMAC-SHA256` bütünlük imzası ile şifrelenir. Uygulama açılışında belirlediğiniz ana parola olmadan hiç kimse verilerinizi okuyamaz.
3. **%100 Saf Rust Native Masaüstü Mimarisi (~2.94 MB):** Uygulama hantal bir tarayıcı sarmalayıcısı (Electron/Chromium) kullanmaz; doğrudan işletim sistemi üzerinde çalışan ultra hafif, bellek güvenli **Saf Rust (`eframe` / `egui`)** yerli masaüstü uygulamasıdır. Arka planda izinsiz veri toplama veya takip (telemetri) yapmaz.
4. **Dosya Doğrulama (SHA-256):** İndirdiğiniz kurulum dosyasının orijinal ve güvenli olduğunu web sitesindeki doğrulama aracıyla tek tıkla kontrol edebilirsiniz.

---

## 💼 Paketler ve Ticari Lisanslama (SubRadar v1.0)

SubRadar, **Ticari Yazılım Lisansı ([`LICENSE`](LICENSE))** kapsamında sunulmaktadır ve abonelik tuzağına karşı **tek seferlik ödeme** prensibini benimser:

| Paket | Kimler İçin Uygun? | Kurulum & Platform | Destek ve Güncellemeler | Fiyat / Lisans |
| :--- | :--- | :--- | :--- | :--- |
| **Başlangıç (Demo / Deneme)** | Uygulama arayüzünü, canlı simülatörü ve temel abonelik takibini deneyimlemek isteyen bireysel kullanıcılar. | Web Simülatörü & Masaüstü Önizleme | Standart Dokümantasyon | **Ücretsiz Deneme** |
| **SubRadar Pro (v1.0)** | Tüm kişisel ve profesyonel aboneliklerini sınırsız takip etmek, çevrimdışı ekstre taramak ve tek tıkla iptal/dilekçe oluşturmak isteyen kullanıcılar. | macOS, Windows ve Linux Tam Sürüm | **Ömür Boyu Güncelleme** & Öncelikli E-posta Desteği | **$79** *(Tek Seferlik Ödeme — Abonelik Yok)* |
| **SubRadar Kurumsal (Enterprise)** | Birden fazla çalışanı ve departmanı olan şirketler, ekip içi ortak yazılım denetimi ve merkezi kurulum arayan kurumlar. | Çoklu Bilgisayar Kurulumu (MSI / PKG) | **7/24 Kurumsal Destek (SLA)**, Fatura & Özel Kurulum | **Kurumsal Teklif** ([İletişim Formu](https://laynexsw.github.io/SubRadar/)) |

> 📜 **Ticari Lisans Bilgisi:** Bu yazılımın tüm telif ve ticari kullanım hakları [**SubRadar Ticari Yazılım Lisansı (`LICENSE`)**](LICENSE) ile korunmaktadır.

---

## 🚀 Kurulum ve Çalıştırma Rehberi

### 1. Saf Rust Masaüstü Uygulamasını Çalıştırma ve Test Etme (`app/ v1.0`)
%100 Saf Rust ile yazılmış masaüstü uygulamasını derlemek, birim testlerini yürütmek ve başlatmak için:

```powershell
cd app

# Şifreli kasa (vault), çevrimdışı ekstre tarayıcı (parser) ve yasal dilekçe (legal) birim testlerini çalıştırın
cargo test

# SubRadar v1.0 Saf Rust Native GUI masaüstü uygulamasını başlatın (~2.94 MB tekil .exe)
cargo run --release
```

### 2. Web Vitrinini ve Canlı Simülatörü Çalıştırma (`web/`)
Web tanıtım sitesini ve canlı simülatörü yerel bilgisayarınızda görüntülemek için:

```bash
# Yerel web sunucusunu başlatın (Port: 8765)
python -m http.server 8765

# 23 modüler web bileşenini doğrulayın
python web/scripts/build.py
```
* **Yerel Adres:** `http://localhost:8765/web/code.html` veya `http://localhost:8765/`
* **Canlı Web Sitesi:** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)

---

## 📞 İletişim ve Yasal Bağlantılar

* **Resmi Web Sitesi & Canlı Simülatör:** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Ticari Lisans & Kurumsal İletişim:** `iletisim@subradar.dev`
* **Teknik Dokümantasyon:** [`CODEBASE.md`](CODEBASE.md) & [`app/README.md`](app/README.md)
* **Yasal Belgeler:** [Ticari Lisans (`LICENSE`)](LICENSE) &bull; [Gizlilik Politikası (`privacy.html`)](privacy.html) &bull; [Kullanım Koşulları (`terms.html`)](terms.html)

<div align="center">
<br/>
<sub><b>SubRadar v1.0 © 2026 Laynexsw. Tüm Ticari Hakları Saklıdır.</b><br/>Kullanıcı dostu tasarım, yerel veri güvenliği ve %100 çevrimdışı çalışma prensibiyle geliştirilmiştir.</sub>
</div>
