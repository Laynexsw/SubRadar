<div align="center">

<img src="favicon.svg" width="76" height="76" alt="SubRadar Amblem" />

# SubRadar v1.0
### Akıllı Abonelik Takibi, Tek Tıkla İptal ve %100 Yerel Şifreli Kasa

[![Sürüm](https://img.shields.io/badge/S%C3%BCr%C3%BCm-v1.0%20Native%20Rust-6366f1?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Güvenlik](https://img.shields.io/badge/G%C3%BCvenlik-AES--256%20Yerel%20%C5%9Eifreleme-10b981?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Laynexsw/SubRadar/tree/main/app/src)
[![Çevrimdışı Mimari](https://img.shields.io/badge/%C3%87al%C4%B1%C5%9Fma%20Modu-100%25%20%C3%87evrimd%C4%B1%C5%9F%C4%B1%20%26%20Yerel-0ea5e9?style=for-the-badge&logo=lock&logoColor=white)](privacy.html)
[![Test Durumu](https://img.shields.io/badge/Birim%20Testleri-15%2F15%20%25100%20Ba%C5%9Far%C4%B1-10b981?style=for-the-badge&logo=checkmarx&logoColor=white)](app/README.md)
[![İkili Boyut](https://img.shields.io/badge/Native%20Binary-~3.2%20MB%20(S%C4%B1f%C4%B1r%20Bloat)-2563eb?style=for-the-badge&logo=speedtest&logoColor=white)](app/subradar.exe)
[![Yasal Haklar](https://img.shields.io/badge/Yasal%20Koruma-6502%20SK%20%7C%20THH%20%7C%20T%C3%9CB%C4%B0S%20%7C%20GDPR-f59e0b?style=for-the-badge&logo=scales&logoColor=white)](terms.html)
[![Platform Desteği](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-18181b?style=for-the-badge&logo=apple&logoColor=white)](https://laynexsw.github.io/SubRadar/#os-downloads)
[![Ticari Lisans](https://img.shields.io/badge/Lisans-Ticari%20Lisans%20(Commercial%20v1.0)-2563eb?style=for-the-badge)](LICENSE)

<br/>

**SubRadar v1.0**; hem günlük bireysel kullanıcılar hem de profesyonel ekipler için geliştirilmiş **resmi, ultra hızlı, sıfır webview/node bloat barındıran ve %100 yerel çalışan masaüstü abonelik yönetim yazılımıdır**.  
Netflix, Spotify, YouTube Premium, iCloud, Adobe, ChatGPT gibi kişisel aboneliklerinizden kurumsal iş yazılımlarınıza kadar tüm düzenli harcamalarınızı tek ekranda toplar. Unutulan deneme sürelerini, sinsi fiyat artışlarını ve iptali imkânsız kılınan karanlık desenleri (Dark Patterns); banka şifrenizi istemeden ve verilerinizi hiçbir bulut sunucusuna göndermeden **tamamen kendi bilgisayarınızda** tespit eder ve tek tıkla sonlandırmanızı sağlar.

<br/>

[**🌐 Resmi Web Sitesi ve Canlı Simülatör**](https://laynexsw.github.io/SubRadar/) &nbsp;&bull;&nbsp; [**💻 Masaüstü Uygulaması (v1.0)**](app/README.md) &nbsp;&bull;&nbsp; [**📜 Ticari Lisans Sözleşmesi**](LICENSE) &nbsp;&bull;&nbsp; [**🔒 Gizlilik Politikası**](privacy.html) &nbsp;&bull;&nbsp; [**⚖️ Kullanım Koşulları**](terms.html)

</div>

---

## 🌊 4 Geliştirme Dalgası (Completed Waves 1–4)

SubRadar v1.0, masaüstü (Native Rust) ve modern web platformunda 4 kapsamlı geliştirme dalgası ile inşa edilmiştir:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SUBRADAR DÖRT GELİŞTİRME DALGASI                       │
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│    DALGA 1         │    DALGA 2         │    DALGA 3         │      DALGA 4            │
│  UI & Analitik     │  Şablon & Bankalar │  Yasal Kalkan      │  Ekip, Takvim & Yedek   │
├────────────────────┼────────────────────┼────────────────────┼─────────────────────────┤
│• Bento Grid Hub    │• 37 Servis Şablonu │• Resmi THH / TÜBİS │• Aile/Ekip Maliyet      │
│• 3 Katmanlı Token  │• Çoklu Banka Parse │  6502 Başvuru Formu│  Bölüştürücü (Splitter) │
│• Raycast Kısayollar│• Fiyat Artış &     │• Visa/Mastercard   │• RFC 5545 iCalendar     │
│  (Ctrl+K/N/E/T/D)  │  Sinsi Yenileme    │  Chargeback Dilekçe│  (.ics) Takvim İhracı   │
│• Linear Geri Al    │  Algılayıcı        │• Karanlık Desen    │• Çift Yönlü AES-256     │
│  (Undo Toast)      │  (detect_price_hike) İptal Kılavuzları  │  JSON Yedekleme/Geri Yük│
└────────────────────┴────────────────────┴────────────────────┴─────────────────────────┘
```

### 🔹 Dalga 1: Bento Grid Analitiği, 3 Katmanlı Tasarım Sistemi & Raycast Kısayolları
* **Bento Grid Kategori & Harcama Analitiği:** Harcamaları kategori bazlı (Eğlence, Üretkenlik, Bulut, AI, vb.) renk kodlu yüzdelerle ve bütçe sağlık skoruyla görselleştiren modern bento grid düzeni.
* **3 Katmanlı Tasarım Sistemi Token Mimarisi (`theme.rs`):** İlkel palet (Primitive) -> Semantik rol (Semantic) -> Bileşen bazlı (Component) katmanlı token mimarisi. Apple Glass ve Raycast/Linear derin siyah kontrastı.
* **Raycast / Linear Klavye Kısayolları:** Tam klavye odaklı ergonomi:
  * `Ctrl+K`: Hızlı Komut Paleti ve servis filtreleme,
  * `Ctrl+N`: Yeni abonelik ekleme penceresi,
  * `Ctrl+E`: Çevrimdışı ekstre tarayıcısını açma,
  * `Ctrl+T`: Koyu / Açık tema geçişi,
  * `Ctrl+D`: Yasal cayma/fesih dilekçesi derleyicisi,
  * `Space`: Seçili aboneliğin doğrudan resmi iptal portalını açma,
  * `Esc`: Açık modalları ve aramayı anında temizleme.
* **Linear Stili "Geri Al" (Undo Toast) Bildirim Bandı:** Bir abonelik silindiğinde veya iptal edildiğinde ekranın altından akıcı şekilde yükselen, 5 saniyelik geri alma butonuna sahip güvenli bildirim motoru.

### 🔹 Dalga 2: 37 Popüler Servis Şablonu, Çoklu Banka Ekstreleri & Sinsi Fiyat Artışı Algılayıcı
* **37 Popüler Servis Şablonu (6 Kategori - `presets.rs`):**
  * *Streaming & Medya:* Netflix, Spotify, YouTube Premium, Disney+, Amazon Prime Video, Apple Music, BluTV, Gain, Exxen.
  * *Yapay Zekâ & Üretkenlik:* OpenAI ChatGPT Plus, Anthropic Claude Pro, Midjourney, Perplexity Pro, GitHub Copilot.
  * *Yazılım & Tasarım:* JetBrains All Products, Adobe Creative Cloud, Figma Professional, Canva Pro, Notion Plus.
  * *Bulut Depolama & Altyapı:* Google One / Drive, Apple iCloud+, Microsoft 365, Dropbox Plus, AWS, DigitalOcean.
  * *İş & İletişim:* Slack Pro, Zoom Workplace, LinkedIn Premium, Telegram Premium, X (Twitter) Premium.
  * *Oyun & Donanım:* Xbox Game Pass Ultimate, PlayStation Plus, GeForce NOW.
* **Yerel Çoklu Banka Ekstre Formatları (`parser.rs`):**
  * Türkiye Bankaları: Garanti BBVA, İş Bankası, Enpara.com, Papara.
  * Global Neobank & FinTech: Wise (CSV), Revolut (CSV / Text).
* **Gizli Fiyat Artışı ve Sinsi Yenileme Algılayıcı (`detect_price_hikes`):** Ekstredeki ardışık aylar arasındaki tutar farklarını hesaplayarak enflasyon/fiyat artışlarını yüzde ve tutar olarak raporlayan algoritmik koruma.

### 🔹 Dalga 3: Yasal Hakem Heyeti (6502 SK), Ters İbraz (Chargeback) & Karanlık Desen İptal Kılavuzları
* **Resmi THH / TÜBİS (6502 SK) Tüketici Hakem Heyeti Başvuru Dilekçesi (`legal.rs`):** Ayıplı hizmet, izinsiz yenileme veya para iadesi yapılmayan durumlar için e-Devlet TÜBİS sistemine doğrudan yüklenebilir resmi hukuki şikayet metni.
* **Visa / Mastercard Ters İbraz (Chargeback) Harcama İtirazı Formu:** Bankaya sunulmak üzere uluslararası kart kurallarına (Reason Code 13.1 / 4853 - İptal Edilen İşlem) uygun harcama itirazı belgesi.
* **Hizmet Bazlı Karanlık Desen (Dark Pattern) İptal Kılavuzları:** Karmaşık iptal butonlarını, canlı desteğe yönlendiren tuzakları ve anket bariyerlerini aşmak için 37 popüler servise özel adım adım doğrudan fesih rehberi.
* **Yaklaşan Yenileme & Deneme Radar Kalkanı:** Deneme süresi bitmeden 3 gün ve 1 gün önce renkli uyarı rozetleriyle bütçeyi koruyan erken ikaz motoru.

### 🔹 Dalga 4: Aile/Ekip Maliyet Bölüştürücü, RFC 5545 iCalendar Takvim İhracı & Çift Yönlü Şifreli Yedekleme
* **Aile & Ekip Ortak Lisans Maliyet Bölüştürücü (`models.rs`):** Netflix Aile, Spotify Aile, YouTube Family veya ekip araçlarının (Figma, GitHub) toplam maliyetini kişi sayısına bölerek kişi başı net payı ve aylık/yıllık tasarrufu hesaplar.
* **Apple / Google / Outlook Takvim RFC 5545 iCalendar (`.ics`) İhracı:** Yaklaşan tüm fatura ve deneme yenileme tarihlerini tek tıkla Apple Calendar, Google Calendar ve Microsoft Outlook'a standart `.ics` dosyası olarak aktarır.
* **Çift Yönlü AES-256 Şifreli JSON Yedekleme ve Akıllı Veri Birleştirme (`vault.rs`):** Kullanıcı verilerini güvenli parola ile dışa aktarır ve başka bir cihaza kopyalandığında mevcut verilerle çakışmadan akıllı birleştirme (merge) yapar.

---

## 🏛️ Temel Özellikler ve Avantajlar

| Özellik | Nasıl Çalışır? | Size Sağladığı Fayda |
| :--- | :--- | :--- |
| 🛡️ **%100 Yerel Şifreli Kasa** | `AES-256-CBC` + `PBKDF2` (60.000 iterasyon) + `HMAC-SHA256` ile verileri sadece bilgisayarınızda (`encrypted_sqlite_aes256.subradar`) saklar. | Banka şifresi veya hesap erişimi istenmez. Verileriniz yalnızca sizin belirlediğiniz parola ile açılır; hiçbir sunucuya gönderilmez. |
| 📄 **Çoklu Banka Ekstre Tarayıcı** | Garanti BBVA, İş Bankası, Enpara, Papara, Wise ve Revolut ekstrelerini internet olmadan yerel bellekte ayrıştırır. | Ekstreniz bilgisayarınızdan çıkmadan içerisindeki tüm düzenli abonelikler, unutulan üyelikler ve fiyat artışları saniyeler içinde listelenir. |
| ⚖️ **Hukuki Kalkan & İptal Belgeleri** | **6502 SK THH / TÜBİS Başvuru Dilekçesi**, **Visa/Mastercard Chargeback Formu** ve **KVKK / GDPR Madde 17** resmi fesih ihtarnamesi. | Haksız çekilen paraların iadesi için bankalara ve Hakem Heyetine sunulmaya hazır, resmi formatta dilekçeleri tek tıkla üretir. |
| 👥 **Aile / Ekip Maliyet Paylaştırıcı** | Ortak kullanılan lisanslarda kişi başı düşen payı, katılımcı isimlerini ve elde edilen tasarrufu bento kartlarında gösterir. | Arkadaşlarınızla veya çalışma ekibinizle ortak lisansların maliyetini adil ve şeffaf şekilde yönetmenizi sağlar. |
| 📅 **iCalendar (.ics) Entegrasyonu** | RFC 5545 standartlarında takvim dosyası üretir. | Google Calendar, Apple Calendar veya Outlook üzerinden yaklaşan ödeme günlerini telefonunuzda bildirim olarak görmenizi sağlar. |
| ⚡ **Raycast/Linear Hızlı Tuş Takımı** | `Ctrl+K`, `Ctrl+N`, `Ctrl+E`, `Ctrl+T`, `Ctrl+D`, `Space`, `Esc` tuş kombinasyonları ve Linear Undo Toast. | Fareye dokunmadan abonelik ekleme, arama, iptal ve tema geçişlerini saniyeler içinde gerçekleştirmenizi sağlar. |

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
│   ├── subradar.exe                      # Tekil yerel masaüstü binary'si (~3.2 MB, sıfır bloat, hazır çalıştırılabilir)
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
    │   ├── sections/                     # Sayfa Bölümleri & İşlevsel Modüller (hero, problem, statement-lab, calculator, comparison, features, architecture, os-downloads, hash-verifier, pricing, faq)
    │   ├── modals/                       # Etkileşimli Modallar (command-palette, download-modal, enterprise-modal, reclaim-modal, shortcuts-modal, legal-generator-modal, auth-modal)
    │   └── originkit/                    # Modüler Originkit Tip ve React Uyumluluk Parçaları (react-shim.d.ts, tiles-loader.tsx)
    │
    ├── css/                              # Web Stil Sistemi (Apple Glassmorphism - base.css, components.css, cursors.css, main.css)
    ├── js/                               # Web İstemci Zekâsı (config.js, supabase.js, i18n.js, theme.js, fx.js, toast.js, audio-fx.js, statement-lab.js, calculator.js, modals/...)
    └── scripts/                          # CI/CD & Derleme Otomasyon Betikleri (build.py, embed_tiles_loader.py)
```

---

## 🤖 Genişletilmiş Otonom Ajan Mimarisi (Autonomous Engineering Team)

SubRadar'ın geliştirilmesi, Baş Orkestratör liderliğinde **5 Departman ve 21 Kalıcı Uzman Alt Ajan** tarafından yürütülmektedir:

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

> ⚡ **Dinamik Ajan Bölünmesi ve Çoğalma (Subagent Splitting) Protokolü:**  
> Kullanıcının doğrudan onayı ve talimatı doğrultusunda; kodlama, optimizasyon veya derin hata ayıklama görevlerinde uzman geliştirici ajanlar ikili veya üçlü dinamik çalışma hücrelerine (örneğin: `desktop-core-engineer` -> `desktop-ui-worker` + `desktop-state-worker`) bölünerek paralel görev icra etme yetkisine sahiptir. Bu işlem paylaşımsız alt görevleri hızlandırırken mimari bütünlüğü korur.

---

## 🔒 Güvenlik, Kriptografi ve Sıfır-Bilgi Standartları

1. **Parola Korumalı AES-256 Kasa (`app/src/vault.rs`):** Verileriniz bilgisayarınızda `AES-256-CBC` + `PBKDF2-HMAC-SHA256` (60.000 iterasyon) + `HMAC-SHA256` bütünlük imzası ile şifrelenir. Uygulama açılışında belirlediğiniz ana parola olmadan hiçbir veri okunamaz.
2. **Çift Yönlü Şifreli Yedekleme & Geri Yükleme:** Parola korumalı `.json` yedeği dışa aktarılabilir ve istenen cihaza içe aktarılırken akıllı birleştirme (merge) yapılır.
3. **%100 Saf Rust Native Masaüstü İkili Dosyası (~3.2 MB):** Hantal Chromium / Electron veya Node.js katmanları barındırmaz. Doğrudan işletim sistemi API'lerine bağlanan ultra hafif, bellek güvenli **Saf Rust (`eframe` / `egui`)** masaüstü yazılımıdır (`app/subradar.exe`).
4. **Sıfır Telemetri ve Sıfır Ağ İsteği:** Masaüstü istemcisi arka planda hiçbir analitik, izleme veya sunucu çağrısı yapmaz.

---

## 🚀 Kurulum, Derleme ve Test Rehberi

### 1. Saf Rust Masaüstü Uygulaması (`app/ v1.0`)

Masaüstü uygulamasının 15 birim testini çalıştırmak ve yerel binary'yi başlatmak için:

```powershell
cd app

# 15/15 Saf Rust Birim Testini Çalıştırın (%100 Başarı)
cargo test

# Masaüstü GUI İstemcisini Başlatın (~3.2 MB Tekil .exe)
cargo run --release
```

*Test Çıktı Özeti:*
```text
running 15 tests
test legal::tests::test_chargeback_document_contains_visa_mastercard_rules ... ok
test legal::tests::test_english_notice_contains_gdpr_article_17 ... ok
test legal::tests::test_thh_application_contains_law_6502_and_articles ... ok
test legal::tests::test_turkish_notice_contains_law_6502 ... ok
test models::tests::test_export_subscriptions_to_ics_format ... ok
test models::tests::test_shared_subscription_cost_calculation ... ok
test parser::tests::test_global_bank_formats_wise_revolut ... ok
test parser::tests::test_detect_price_hike_multiple_months ... ok
test parser::tests::test_parse_csv_and_text_statement ... ok
test parser::tests::test_turkish_bank_formats_garanti_enpara_papara ... ok
test parser::tests::test_sample_statement_detection ... ok
test vault::tests::test_backup_json_export_and_import ... ok
test vault::tests::test_encrypt_and_decrypt_roundtrip ... ok
test vault::tests::test_wrong_password_rejected ... ok
test vault::tests::test_tampered_hmac_rejected ... ok

test result: ok. 15 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 6.56s
```

### 2. Web Vitrini ve Canlı Simülatör (`web/`)

```bash
# Yerel web sunucusunu başlatın (Port: 8765)
python -m http.server 8765

# 23 modüler bileşenin bütünlüğünü doğrulayın
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
<sub><b>SubRadar v1.0 © 2026 Laynexsw. Tüm Ticari Hakları Saklıdır.</b><br/>Ponytail YAGNI ilkeleri, yerel veri güvenliği ve %100 çevrimdışı çalışma disipliniyle geliştirilmiştir.</sub>
</div>
