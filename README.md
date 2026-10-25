<div align="center">

# ⚡ SubRadar Enterprise & Personal FinOps
### Kurumsal & Bireysel Masaüstü Abonelik Zekâsı, Tek Tıkla Yasal İptal ve %100 Yerel AES-256 Kasa

[![FinOps Grade](https://img.shields.io/badge/FinOps-Enterprise%20%26%20Personal-6366f1?style=for-the-badge&logo=target)](https://laynexsw.github.io/SubRadar/)
[![Security Level](https://img.shields.io/badge/Security-AES--256%20CBC%20%7C%20scrypt-10b981?style=for-the-badge&logo=shield)](https://github.com/Laynexsw/SubRadar)
[![Air-Gap Engine](https://img.shields.io/badge/Air--Gap-100%25%20Client--Side-0ea5e9?style=for-the-badge&logo=safari)](https://laynexsw.github.io/SubRadar/)
[![Desktop Engine](https://img.shields.io/badge/Desktop-Electron%20v33%20%7C%20v1.5.0-8b5cf6?style=for-the-badge&logo=electron)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Legal Compliance](https://img.shields.io/badge/Compliance-GDPR%20Art.%2017%20%7C%206502%20SK-f59e0b?style=for-the-badge&logo=scales)](privacy.html)
[![License](https://img.shields.io/badge/License-MIT%20%26%20Commercial-blue?style=for-the-badge)](LICENSE)

<br/>

**SubRadar**, kurumsal ekiplerde ve bireysel iş akışlarında kontrolsüzce büyüyen yazılım harcamalarını (**SaaS Sprawl**),  
unutulan lisansları (**Gölge IT / Shadow IT**) ve kasıtlı olarak labirente dönüştürülen iptal süreçlerini (**Karanlık Desenler**)  
finansal verilerinizi hiçbir bulut sunucusuna göndermeksizin **%100 yerel, çevrimdışı ve sıfır-bilgi (Zero-Knowledge)** ile sonlandıran yeni nesil FinOps zekâsıdır.

[🌐 Canlı Web Vitrini](https://laynexsw.github.io/SubRadar/) &bull; [💻 Masaüstü Uygulaması (v1.5.0)](https://github.com/Laynexsw/SubRadar/tree/main/app) &bull; [📑 Modüler Web Bileşenleri](web/components/) &bull; [🧠 Mimari & Kod Kataloğu](CODEBASE.md) &bull; [🔒 Gizlilik ve Yasal Güvence](privacy.html)

---

</div>

## 🏢 Yönetici Özeti (Executive Summary & Problem Statement)

Modern şirketlerin ve bağımsız profesyonellerin karşı karşıya olduğu en büyük gizli maliyet kalemi **yazılım aboneliği israfıdır**:
* **Gölge IT & SaaS Sprawl:** Ekiplerden ayrılan çalışanların kapatılmayan koltukları (seats), departmanlar arası mükerrer araç kullanımları ve deneme sürümlerinin unutulması şirket bütçelerinin **%20 ila %30'unun** sessizce buharlaşmasına yol açar.
* **Karanlık Desenler (Dark Patterns):** SaaS servisleri iptal butonlarını çok adımlı anketlerin, zorunlu canlı destek görüşmelerinin veya karmaşık telefon hatlarının arkasına gizler.
* **Bulut Tabanlı Takipçilerin Güvenlik Riski:** Geleneksel finans takip araçları (Plaid/Yodlee entegrasyonlu bulut SaaS'ları), banka şifrelerinizi ve ekstrelerinizi kendi sunucularına depolayarak kabul edilemez bir **veri sızıntısı (Data Breach)** ve regülasyon (GDPR/KVKK) riski oluşturur.

**SubRadar Çözümü:** Finansal verilerinizi asla cihaz dışına çıkarmayan, internet bağlantısına ihtiyaç duymayan, tek seferlik ömür boyu lisans modeliyle abonelik tuzağına karşı duran kurumsal düzeyde çevrimdışı masaüstü yazılımı.

---

## 🏛️ Dört Kurumsal Çekirdek Sütun (Core Pillars)

| Sütun | Kurumsal Çözüm & Teknoloji | Sağladığı Avantaj |
| :--- | :--- | :--- |
| 🛡️ **Zero-Knowledge Kasa** | `AES-256-CBC` + `scrypt` (N=16384, r=8, p=1) + `HMAC-SHA256` integrity. | Anahtar sadece sizin parolanızdan türetilir; veri diske yalnızca şifrelenmiş baytlar olarak yazılır. Sıfır sunucu, sıfır telemetri. |
| ✈️ **Hava Boşluklu Ekstre Laboratuvarı** | %100 İstemci Taraflı WebCrypto API & Regex Parser (18+ kurumsal SaaS kalıbı). | Ekstreleriniz (PDF/CSV) sunucuya iletilmeden doğrudan tarayıcı veya yerel Electron belleğinde analiz edilir; kaçak abonelikler anında listelenir. |
| ⚖️ **Karanlık Desen Baypası & Hukuki Fesih** | Doğrudan İptal Portalları + 6502 SK & GDPR Madde 17 Cayma/Fesih Sihirbazı. | Manipülatif iptal adımlarını atlayıp tek tıkla doğrudan fesih paneline ulaştırır veya yasal bağlayıcılığı olan resmi fesih ihtarnamesi üretir. |
| 🍏 **Executive Glassmorphism & Originkit** | Apple Glass UI + WebGL 2.0 Originkit Vector Wordmark & Tiles Loader. | Raycast/Linear ergonomisinde ⌘K komut paleti, çift kayan panelli monokrom oturum kapısı ve donanım ivmeli görsel zekâ. |

---

## 📁 Kurumsal Proje Mimarisi ve Eksiksiz Dosya Kataloğu

Proje yapısı; güvenlik politikaları, kurumsal lisans çerçevesi, masaüstü işletim çekirdeği, Originkit görsel motorları ve modüler web platformu katmanlarına ayrılmıştır. **Tüm dosyalar tam ve eksiksiz olarak listelenmiştir:**

```text
SubRadar/
│
├── 🏛️ 1. KÖK YÖNETİM, GÜVENLİK VE METADATA KATMANI (ROOT GOVERNANCE & POLICIES)
│   ├── index.html                        # Kök yönlendirici (Canlı GitHub Pages trafiğini anında web/code.html'e aktarır)
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
│   ├── README.md                         # [BU DOSYA] Kurumsal karşılama, mimari harita ve yönetim dokümantasyonu
│   ├── AGENTS.md                         # AI ajanları ve LLM oturumları için hızlı kurumsal bellek ve bağlam kılavuzu
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

## ⚖️ Karşılaştırma Matrisi: SubRadar vs Geleneksel Bulut Finans Araçları

| Özellik / Kriter | SubRadar (Yerel & Hava Boşluklu) | Geleneksel Bulut Takipçileri (Plaid vb.) |
| :--- | :--- | :--- |
| **Banka Şifresi / Giriş İzni** | ❌ **Asla İstenmez** (%100 Güvenli) | ⚠️ **Zorunlu** (Üçüncü tarafa tam yetki) |
| **Veri Barındırma** | 🔒 **Sadece Yerel Disk** (Cihazınızda) | ☁️ **Bulut Sunucuları** (Sızıntı riski) |
| **Kriptografik Koruma** | 🛡️ **AES-256-CBC + scrypt + HMAC-SHA256** | 🔑 Servis sağlayıcının elindeki anahtarlar |
| **İptal Desteği** | ⚡ **Doğrudan İptal Portalları & Hukuki İhtarname** | ❌ Yalnızca bildirim gösterir, iptal etmez |
| **İnternetsiz Çalışma (Air-Gap)** | 🟢 **%100 Çevrimdışı Çalışır** | 🔴 İnternetsiz çalışmaz |
| **Ödeme Modeli** | ♾️ **Tek Seferlik Ömür Boyu Lisans** | 💸 **Sürekli Aylık/Yıllık Abonelik** (İronik) |
| **Regülasyon Uyumu** | 🇪🇺 **GDPR Madde 17 & 🇹🇷 6502 SK Entegre** | ⚖️ Sorumluluk kullanıcıya aittir |

---

## 🔒 Güvenlik, Uyumluluk ve Zero-Trust Mimarisi

1. **Sıfır Bilgi Güvencesi (Zero-Knowledge):** SubRadar sunucusu bulunmaz; uygulamanın geliştiricileri dahil hiç kimse kaydettiğiniz servisleri, harcama tutarlarınızı veya şifreli veritabanınızı göremez.
2. **Kriptografik Bütünlük:** `app/src/main/vault.js`, `scrypt` algoritması (CPU/Memory-hard) ile parolanızdan 32 baytlık AES şifreleme anahtarı ve 32 baytlık HMAC doğrulama anahtarı türetir. Veritabanı diske yazılmadan önce HMAC imzası oluşturulur; diskteki baytlara yapılacak harici müdahaleler anında tespit edilir.
3. **İzole Süreçler (Context Isolation IPC):** Electron ana süreci ile görsel arayüz (Renderer) arasında `contextIsolation: true` ve `nodeIntegration: false` uygulanmıştır. Renderer yalnızca `subradarAPI` beyaz listesindeki IPC çağrılarını yürütebilir.
4. **Donanım İvmeli Kurulum Doğrulama:** İndirilen kurulum paketleri, web vitrinindeki WebCrypto motoru (`hash-verifier.js`) üzerinden SHA-256 sağlama toplamı ile anında doğrulanabilir.

---

## 🚀 Hızlı Başlangıç & Kurulum Kılavuzu

### 🌐 1. Canlı Web Vitrinini ve Laboratuvarı Çalıştırma
Web vitrinini yerel ortamınızda test etmek için yerel bir HTTP sunucusu başlatın:
```bash
python -m http.server 8765
```
Tarayıcınızda açın:
* Canlı Tekil Paket: `http://localhost:8765/web/code.html` veya `http://localhost:8765/`
* Resmi Dağıtım: [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)

Bileşen bütünlüğünü doğrulamak için:
```bash
python web/scripts/build.py
```

### 💻 2. Masaüstü Uygulamasını (v1.5.0) Başlatma
Masaüstü istemcisini çalıştırmak ve yerel şifreleme testlerini yürütmek için:
```powershell
cd app
npm install

# Sıfır-bağımlılık yerel AES-256 kasa ve ekstre testlerini çalıştırın
npm run test:vault
npm run test:parser

# Çerçevesiz Apple Glass penceresini başlatın
npm start
```

---

## 💼 Kurumsal Lisanslama & Dağıtım Seçenekleri

Proje varsayılan olarak [MIT Açık Kaynak Lisansı](LICENSE) ile sunulmaktadır. Kurumsal dağıtımlar, kapalı kod modifikasyonları veya özel SLA garantileri için lisanslama yapısı:

| Model | Kapsam | Dağıtım | Destek & SLA |
| :--- | :--- | :--- | :--- |
| **Topluluk (Free)** | Bireysel kullanım, temel SaaS tespiti, açık kaynak kod erişimi. | Yerel Derleme / GitHub | Topluluk Desteği |
| **Pro ($79 - Tek Seferlik)** | Sınırsız abonelik, Air-Gap ekstre tarama, 6502 SK / GDPR fesih sihirbazı. | macOS / Windows / Linux | Ömür Boyu Güncellemeler |
| **Enterprise (Çoklu Koltuk)** | Kurumsal ekipler, FinOps harcama denetimi, özel SaaS kalıpları, şirket içi hava boşluklu dağıtım. | Merkezi Dağıtım / MDM / MSI | Öncelikli Kurumsal Destek & SLA |

> 📜 Tüm alternatif lisans metinleri ve karşılaştırmaları için [**`licenses/README.md`**](licenses/README.md) dosyasını inceleyebilirsiniz.

---

<div align="center">
<sub>SubRadar © 2026 Laynexsw. Gizlilik, güvenlik ve sıfır-bilgi felsefesiyle yerel olarak inşa edildi.</sub>
</div>
