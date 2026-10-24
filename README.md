<div align="center">

# ⚡ SubRadar
### Masaüstü Abonelik Zekâsı, Tek Tıkla İptal ve %100 Yerel AES-256 Kasa

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://laynexsw.github.io/SubRadar/)
[![Desktop App](https://img.shields.io/badge/Desktop-v1.5.0%20Aktif-10b981?style=for-the-badge&logo=electron)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Security](https://img.shields.io/badge/Security-AES--256%20CBC-10b981?style=for-the-badge&logo=shield)](https://github.com/Laynexsw/SubRadar)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

**SubRadar**, unutulan deneme üyeliklerini, gizli fiyat artışlarını ve aylarca açılmayan yazılım aboneliklerini tespit eden;  
verilerinizi asla buluta göndermeden **%100 yerel ve çevrimdışı** çalışan masaüstü abonelik asistanıdır.

[🌐 Canlı Web Sitesi](https://laynexsw.github.io/SubRadar/) &bull; [💻 Masaüstü Uygulaması (v1.5.0)](https://github.com/Laynexsw/SubRadar/tree/main/app) &bull; [📑 Modüler Bileşenler](https://github.com/Laynexsw/SubRadar/tree/main/web) &bull; [🧠 Mimari & Kod Kataloğu](CODEBASE.md)

---

</div>

## 📁 Detaylı Proje Dizin Yapısı ve Dosya Rehberi

Proje mimarisi **kök seviyesi**, **masaüstü uygulaması (`app/`)** ve **web vitrini (`web/`)** olmak üzere bağımsız, modüler ve temiz katmanlara ayrılmıştır:

```text
SubRadar/
├── 🧭 index.html                         # Kök yönlendirici -> web/code.html
├── 🔍 404.html                           # Özel Apple Glass 404 hata sayfası (animasyonlu radar)
├── 🔒 privacy.html                       # %100 Sıfır Bilgi & Çevrimdışı Gizlilik Politikası (GDPR/KVKK)
├── ⚖️ terms.html                         # Kullanım Koşulları ve yerel sorumluluk sınırları
├── 🤝 thanks.html                        # Başvuru onay ve teşekkür sayfası (takip kodlu)
├── 🤖 robots.txt                         # Arama motoru direktifleri ve sitemap bağlantısı
├── 🗺️ sitemap.xml                        # Çok dilli (TR/EN/DE) SEO site haritası
├── 🎨 favicon.svg                        # Yüksek kontrastlı neon zümrüt radar favicon vektörü
├── 🖼️ og-image.svg                       # 1200x630 Sosyal medya önizleme (Open Graph & Twitter) kartı
├── ⚙️ .nojekyll                          # GitHub Pages statik yayın yapılandırması (Jekyll motorunu devre dışı bırakır)
├── 🛡️ .gitignore                         # Sürüm kontrolünden hariç tutulan dosyalar
├── 📜 LICENSE                            # MIT Açık Kaynak Lisansı
├── 📖 README.md                          # Kapsamlı proje mimarisi ve kullanım rehberi
├── 🤖 AGENTS.md                          # AI oturumları ve ajanlar için hızlı bağlam rehberi
├── 📑 CODEBASE.md                        # Eksiksiz kod tabanı, fonksiyon ve DOM ID kataloğu
├── 🛡️ .agents/rules/                     # IDE ajan kuralları ve otomatik bağlam hafızası
│
├── 📜 licenses/                          # Yazılım Lisansları Şablon Koleksiyonu & Rehberi
│   ├── README.md                         # Lisanslar karşılaştırma matrisi ve seçim kılavuzu
│   ├── MIT.txt, APACHE-2.0.txt           # İzin verici açık kaynak lisans şablonları
│   ├── GPL-3.0.txt, AGPL-3.0.txt         # Güçlü copyleft açık kaynak lisans şablonları
│   ├── BSD-3-CLAUSE.txt, MPL-2.0.txt     # BSD ve Mozilla kamu lisans şablonları
│   └── PROPRIETARY.txt, UNLICENSE.txt    # Ticari ve kamu malı lisans şablonları
│
├── 💻 app/                               # MASAÜSTÜ UYGULAMASI (🟢 Canlı & Aktif - Electron v1.5.0 + AES-256)
│   ├── package.json                      # Bağımlılıklar ve çalıştırma scriptleri (start, dev, test, test:vault, test:parser)
│   ├── main.js                           # Electron ana süreci (çerçevesiz Apple Glass pencere, güvenli IPC)
│   ├── preload.js                        # contextIsolation IPC güvenli köprüsü (subradarAPI)
│   ├── README.md                         # Masaüstü uygulaması detaylı mimari ve çalıştırma rehberi
│   │
│   ├── src/main/                         # Node.js Çekirdek & Kriptografik Arka Plan
│   │   ├── vault.js                      # AES-256-CBC + scrypt + HMAC-SHA256 şifreleme motoru
│   │   ├── vault.test.js                 # Sıfır-bağımlılık kripto doğrulama birim testleri
│   │   ├── store.js                      # Şifreli yerel disk deposu (encrypted_sqlite_aes256.subradar)
│   │   ├── legal-notice.js               # 6502 SK & GDPR Madde 17 yasal fesih metni oluşturucu
│   │   ├── statement-parser.js           # %100 Çevrimdışı banka ekstresi & CSV tarayıcısı (18+ SaaS kalıbı)
│   │   └── parser.test.js                # Ekstre tarayıcı ve yasal fesih birim testleri
│   │
│   └── src/renderer/                     # Apple Glassmorphism Arayüzü (SF Pro & Inter)
│       ├── index.html                    # Çerçevesiz ana pencere, 6 modül görünümü, ⌘K paleti & kilit kapısı
│       ├── styles/                       # app.css (pencere & düzen), components.css (kartlar & modallar)
│       └── scripts/                      # app.js (arayüz), presets.js (16+ SaaS şablonu), crypto-fallback.js
│
└── 🌐 web/                               # WEB TANITIM VİTRİNİ & MODÜLER BİLEŞENLER
    ├── code.html                         # Entegre canlı vitrin uygulaması ve interaktif masaüstü simülatörü
    ├── index.html                        # web/ içi hızlı yönlendirici
    ├── 404.html                          # Alt dizin 404 hata sayfası
    ├── privacy.html                      # Alt dizin gizlilik politikası sayfası
    ├── terms.html                        # Alt dizin kullanım koşulları sayfası
    ├── thanks.html                       # Alt dizin teşekkür ve takip kodu sayfası
    ├── favicon.svg                       # Web vitrini favicon vektörü
    ├── og-image.svg                      # Web vitrini 1200x630 Open Graph görseli
    ├── manifest.json                     # PWA web uygulama manifesti (çevrimdışı ve tam ekran desteği)
    ├── sw.js                             # Çevrimdışı Service Worker önbellekleme motoru
    │
    ├── components/                       # 22 Parçalı Modüler HTML Bileşenleri
    │   ├── layout/
    │   │   ├── header.html               # Üst gezinme çubuğu, ses, kısayol, dil, kur ve tema kontrolleri
    │   │   ├── footer.html               # Alt bilgi çubuğu, iletişim bilgileri, bağlantılar ve yerel gecikme
    │   │   ├── cookie-banner.html        # Minimal Apple Glass çerez ve canlı kullanıcı etkileşim izleme kartı
    │   │   └── mobile-sticky-cta.html    # Mobilde altta sabit kalan hızlı indirme çubuğu
    │   │
    │   ├── sections/
    │   │   ├── hero.html                 # Hero vitrin alanı, çift CTA ve interaktif pencere simülasyonu
    │   │   ├── problem.html              # Abonelik israfı sorun tanımı ve sektör istatistikleri
    │   │   ├── statement-lab.html        # Canlı hava boşluğu (Air-Gap) banka ekstresi ve sızıntı tarayıcısı laboratuvarı
    │   │   ├── calculator.html           # İsraf hesaplayıcı, kaydırıcılar, PNG "Abonelik Röntgeni" ihracı ve X paylaşımı
    │   │   ├── comparison.html           # Şeffaflık & güven rakip karşılaştırma matrisi (SubRadar vs Bulut)
    │   │   ├── features.html             # Çekirdek motor özellikleri 4'lü kart ızgarası
    │   │   ├── architecture.html         # Yerel AES-256 SQLite mimari ve güvenlik kartları
    │   │   ├── os-downloads.html         # macOS, Windows, Linux indirme kartları ve sağlama toplamları
    │   │   ├── hash-verifier.html        # İstemci tarafı WebCrypto donanım ivmeli SHA-256 kurulum doğrulayıcı
    │   │   ├── pricing.html              # Free, Pro ($79) ve Enterprise tek seferlik ömür boyu fiyatlandırma tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular (SSS) akordeon paneli
    │   │
    │   └── modals/
    │       ├── download-modal.html       # İndirme modalı (İlerleme çubuğu, işletim sistemi ve mimari seçimi)
    │       ├── command-palette.html      # Cmd+K / Ctrl+K komut paleti arama penceresi
    │       ├── enterprise-modal.html     # Kurumsal talep formu (inline hata denetimi & spinner)
    │       ├── reclaim-modal.html        # Geri kazanım ve CLI kurulum adımları
    │       ├── shortcuts-modal.html      # Raycast/Linear stili Power-User klavye kısayolları modalı
    │       ├── legal-generator-modal.html# Canlı 6502 SK & GDPR Madde 17 resmi cayma ve fesih ihtarnamesi sihirbazı
    │       └── auth-modal.html           # İkili kayan panelli (Double-Slider Sliding Overlay) Apple Glass Monokrom modalı
    │
    ├── css/                              # Web Stil Dosyaları
    │   ├── base.css                      # Temel renk paleti, tipografi kuralları, açık/koyu tema değişkenleri
    │   ├── components.css                # Apple Glass kartlar, imleç ışığı, ses animasyonları, mobil çubuk
    │   └── main.css                      # Tüm CSS modüllerini birleştiren ana stil orkestrasyonu
    │
    ├── js/                               # Web JavaScript Modülleri
    │   ├── config.js                     # Sabitler, kurlar ve global yapılandırma ayarları
    │   ├── supabase.js                   # Supabase v2 JS SDK istemcisi, Auth ve Bulut Veritabanı entegrasyonu
    │   ├── i18n.js                       # Çoklu dil sözlüğü (Türkçe, İngilizce, Almanca) ve çevirici
    │   ├── theme.js                      # Açık / Koyu tema geçiş yöneticisi
    │   ├── fx.js                         # Canlı döviz kuru çekici ve önbellekleme
    │   ├── toast.js                      # Kayan Apple Glass bildirim balonu sistemi
    │   ├── audio-fx.js                   # Web Audio API sıfır-dosya osilatörlü dokunsal ses motoru
    │   ├── cursor-glow.js                # Dinamik imleç takipçi cam aydınlatma ve ışıma motoru
    │   ├── statement-lab.js              # İstemci taraflı Air-Gap ekstre ve kaçak sızıntı analizörü
    │   ├── hash-verifier.js              # WebCrypto API donanım ivmeli SHA-256 doğrulayıcı
    │   ├── social-export.js              # HTML5 Canvas 1200x630 "Abonelik Röntgeni" PNG kart ihracı ve X paylaşımı
    │   ├── calculator.js                 # İsraf hesaplama algoritmaları ve profil geçişleri
    │   ├── hero-window.js                # Hero masaüstü simülasyonu, trafik ışıkları ve iptal senaryoları
    │   ├── scroll-motion.js              # Sayfa okuma ilerleme çizgisi ve akıcı kaydırma efektleri
    │   ├── analytics.js                  # Canlı saniye sayacı, tıklama, kaydırma ve kullanıcı telemetri motoru (`srAnalytics`)
    │   ├── cookie-banner.js              # Minimal Apple Glass çerez kartı, otomatik açılış ve onay kontrolcüsü
    │   ├── mobile-cta.js                 # Mobilde kaydırmaya bağlı beliren sabit indirme barı
    │   ├── main.js                       # Modüler web scriptlerinin ve Service Worker'ın ana giriş dosyası
    │   │
    │   └── modals/                       # Web Modal Kontrolcüleri
    │       ├── download-modal.js         # İndirme simülasyonu ve dosya indirme tetikleyicisi
    │       ├── command-palette.js        # Komut paleti klavye gezinimi ve hızlı arama
    │       ├── enterprise-modal.js       # Kurumsal form doğrulama, spinner ve onay ekranı
    │       ├── reclaim-modal.js          # CLI komut kopyalama ve geri kazanım adımları
    │       ├── shortcuts-modal.js        # Power-User kısayol dinleyici (`?`, `T`, `S`, `C`, `L`, `D`, `ESC`)
    │       ├── legal-gen.js              # Canlı resmi ihtarname derleyici, pano kopyalama ve `.txt` indirme
    │       └── auth-modal.js             # İkili kayan panel animasyonu (sliding overlay), sosyal/demo giriş ve profil kontrolcüsü
    └── scripts/
        └── build.py                      # 22 modüler bileşeni doğrulayan ve test eden Python otomasyon betiği
```

---

## 🌟 Katmanların Görev Dağılımı

| Katman | Konum | Teknoloji | Görevi ve Durumu |
| :--- | :--- | :--- | :--- |
| **Kök (Root)** | `/` | Git, Markdown, HTML | Canlı GitHub Pages dağıtımını yönlendirir, lisans ve depo belgelerini barındırır. |
| **Lisanslar (Licenses)** | `/licenses` | Markdown & Text | 📜 **Rehber & Şablonlar** — MIT, Apache, GPL, BSD vb. lisans karşılaştırma matrisi ve şablonları. |
| **Masaüstü (App)** | `/app` | Electron v33, Node.js, AES-256 | 🟢 **Aktif / v1.5.0 Tam Sürüm** — Yerel şifreli kasa, 16+ SaaS şablonu, risk radarı, ekstre tarayıcı, ⌘K paleti ve çerçevesiz Apple Glass UI. |
| **Web Vitrini** | `/web` | Vanilla JS, Modern CSS, HTML5 | 🟢 **Yayında** — GitHub Pages üzerinde canlı olan interaktif simülasyon ve vitrin. |

---

## 🚀 Hızlı Başlangıç

### 🌐 Canlı Web Vitrinini Ziyaret Edin
* **Resmi Sayfa:** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Yerel Sunucuda Çalıştırma:**
  ```bash
  python -m http.server 8765
  ```
  Tarayıcınızda `http://localhost:8765/` veya `http://localhost:8765/web/code.html` adresini ziyaret edin.

### 💻 Masaüstü Uygulaması (`app/`)
Masaüstü istemcisini yerel bilgisayarınızda çalıştırmak ve test etmek için:
```powershell
cd app
npm install
npm run test:vault   # Sıfır-bağımlılık AES-256 kripto testleri
npm start            # Çerçevesiz masaüstü penceresini başlatır
```

---

## 🔒 Güvenlik Mimarisi

* **Yerel Şifreleme:** `app/src/main/vault.js`, Node.js'in yerel `crypto` modülü ile `AES-256-CBC` + `scrypt` + `HMAC-SHA256` kullanarak aboneliklerinizi cihazınızda şifreler.
* **İzole IPC:** `app/preload.js` sayesinde Renderer süreci doğrudan işletim sistemi çekirdeğine erişemez; yalnızca izin verilen güvenli API çağrılarını yapabilir (`contextIsolation: true`).
* **Sıfır Bulut Bağımlılığı:** Uygulama tamamen çevrimdışı (offline-first) prensibiyle tasarlanmıştır. Hiçbir dış telemetri bulunmaz.

---

## 📄 Lisans & Lisans Seçenekleri

Bu proje varsayılan olarak [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.

Geliştiriciler ve kurumlar için farklı kullanım senaryolarına uygun tüm alternatif lisans şablonları [`licenses/`](licenses/) dizininde eksiksiz olarak sunulmaktadır:

| Lisans | Şablon Dosyası | Lisans Türü | Temel Kural & Kullanım Amacı |
| :--- | :--- | :--- | :--- |
| **MIT (Varsayılan)** | [`LICENSE`](LICENSE) &bull; [`MIT.txt`](licenses/MIT.txt) | İzin Verici (Permissive) | En popüler açık kaynak lisansı. Ticari kullanım serbesttir, kod kapatılabilir. |
| **Apache 2.0** | [`APACHE-2.0.txt`](licenses/APACHE-2.0.txt) | İzin Verici + Patent | MIT serbestliği sağlar; ek olarak patent davalarına karşı kurumsal koruma sunar. |
| **GNU GPL v3** | [`GPL-3.0.txt`](licenses/GPL-3.0.txt) | Güçlü Copyleft | Kodu kullanan veya değiştiren projelerin de açık kaynak kalmasını şart koşar. |
| **GNU AGPL v3** | [`AGPL-3.0.txt`](licenses/AGPL-3.0.txt) | Ağ / SaaS Copyleft | Yazılım bulutta web servisi (SaaS) olarak sunulsa bile kaynak kodun açılmasını zorunlu kılar. |
| **BSD 3-Clause** | [`BSD-3-CLAUSE.txt`](licenses/BSD-3-CLAUSE.txt) | İzin Verici | Yazarın ve projenin adının izinsiz ticari reklam ve tanıtımlarda kullanımını yasaklar. |
| **BSD 2-Clause** | [`BSD-2-CLAUSE.txt`](licenses/BSD-2-CLAUSE.txt) | İzin Verici | FreeBSD lisansı olarak da bilinir; MIT ile benzer esneklikte sade lisans. |
| **Mozilla (MPL 2.0)** | [`MPL-2.0.txt`](licenses/MPL-2.0.txt) | Zayıf Copyleft | Yalnızca değiştirilen dosyaların açık kalmasını ister; ana projeyi kapatmaya izin verir. |
| **The Unlicense** | [`UNLICENSE.txt`](licenses/UNLICENSE.txt) | Kamu Malı (Public Domain) | Tüm telif haklarından feragat edilir. Sıfır kısıtlama ile serbestçe kullanılabilir. |
| **Tescilli (Proprietary)** | [`PROPRIETARY.txt`](licenses/PROPRIETARY.txt) | Ticari / Kapalı Kod | Tüm hakları saklıdır. İzinsiz kopyalama, dağıtım ve ticari kullanım kesinlikle yasaktır. |

> 💡 Detaylı lisans karşılaştırma matrisi, yasal yükümlülükler ve seçim kılavuzu için [**`licenses/README.md`**](licenses/README.md) dosyasını inceleyebilirsiniz.

