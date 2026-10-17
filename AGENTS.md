# ⚡ SubRadar — AI Agent & Developer Fast-Context Guide (AGENTS.md)

> **Amaç:** Bu dosya, her yeni sohbette veya AI oturumunda depodaki tüm dosyaları baştan tarama ihtiyacını ortadan kaldırmak için hazırlanmış **tam ve kapsamlı kod tabanı referansıdır**. Bu dosyayı okuyan yapay zekâ asistanı, tüm mimariyi, dosya rollerini, DOM kimliklerini ve veri akışlarını anında anlar.

---

## 📌 1. Proje Özeti & Temel Felsefe

* **Proje Adı:** SubRadar ("Masaüstü Abonelik Zekâsı ve Tek Tıkla İptal")
* **Canlı Dağıtım (Production):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Kaynak Depo:** `Laynexsw/SubRadar`
* **Temel Prensipler:**
  1. **%100 Yerel ve Çevrimdışı (Zero Knowledge, Offline-First):** Hiçbir banka şifresi veya API anahtarı istenmez. Veriler buluta çıkmaz.
  2. **Yerel AES-256 Şifreleme:** Veriler yerel diskte şifreli SQLite dosyasında (`encrypted_sqlite_aes256.db`) saklanır.
  3. **Karanlık Desensiz Tek Tıkla İptal:** Kullanıcıyı labirent gibi iptal süreçlerinden kurtarıp doğrudan servis iptal portallarına ve yasal fesih metinlerine ulaştırır.
  4. **Apple Glassmorphism UI:** Koyu taban (`#000000`, `#09090b`), cam efektleri (`backdrop-filter: blur(24px)`), SF Pro tipografisi, kusursuz açık/koyu mod geçişi.

---

## 🏗️ 2. Kritik Mimari İkiliği (Modular vs. Standalone)

Bu depoda **iki paralel katman** bulunur. Kod geliştirirken veya düzenlerken bu ayrım mutlaka bilinmelidir:

1. **Modüler Kaynak Katmanı (`web/components/`, `web/css/`, `web/js/`):**
   * Bakımı kolaylaştırmak için ayrıştırılmış 14 adet HTML bileşeni, modüler CSS dosyaları ve ES6 JavaScript modülleri.
   * `web/scripts/build.py` bu 14 bileşenin bütünlüğünü doğrular.
2. **Tekil Üretim Paketi (`web/code.html`):**
   * GitHub Pages ve yerel sunucuların doğrudan sunduğu, tüm CSS, JS, SVG ve HTML parçalarını tek çatı altında birleştiren ~297 KB'lık dosya.
   * Kök dizindeki `index.html` ve `web/index.html`, ziyaretçiyi doğrudan `web/code.html`'e yönlendirir (`meta refresh` + `window.location.replace`).
   * **Önemli Not:** Web vitrininde yapılacak arayüz güncellemeleri hem ilgili modüler dosyada hem de canlı dağıtım dosyası olan `web/code.html` içinde güncellenmelidir!

---

## 📁 3. Eksiksiz Dosya Haritası & Sorumluluklar

```text
SubRadar/
│
├── index.html                   # Kök yönlendirici -> web/code.html
├── 404.html                     # Özel Apple Glass 404 hata sayfası (animasyonlu radar)
├── privacy.html                 # %100 Sıfır Bilgi & Çevrimdışı Gizlilik Politikası (GDPR/KVKK)
├── terms.html                   # Kullanım Koşulları ve yerel sorumluluk sınırları
├── thanks.html                  # Başvuru onay ve teşekkür sayfası (takip kodlu)
├── robots.txt                   # Arama motoru robot direktifleri ve sitemap referansı
├── sitemap.xml                  # Çok dilli (TR/EN/DE) SEO site haritası
├── favicon.svg                  # Yüksek kontrastlı neon zümrüt radar favicon vektörü
├── og-image.svg                 # 1200x630 Sosyal medya önizleme (Open Graph) kartı
├── .nojekyll                    # GitHub Pages için Jekyll devre dışı bırakıcı
├── .gitignore                   # IDE agent (.agent, .gemini, .codex) ve geçici dosyaları hariç tutar
├── LICENSE                      # Proje ana lisansı (MIT)
├── PRODUCT.md                   # Ürün hedefleri, kullanıcı kitleleri ve tasarım kuralları
├── README.md                    # Vitrin deposu ana tanıtım belgesi
├── AGENTS.md                    # [BU DOSYA] AI oturumları için hızlı hafıza ve mimari özeti
├── CODEBASE.md                  # Teknik detay, DOM ID ve fonksiyon kütüphanesi referansı
│
├── licenses/                    # Lisans Şablon Koleksiyonu (Geliştirici & Şirket Referansı)
│   ├── README.md                # Lisans karşılaştırma matrisi ve seçim rehberi
│   ├── MIT.txt, APACHE-2.0.txt  # İzin verici açık kaynak lisanslar
│   ├── BSD-3-CLAUSE.txt         # Reklam kısıtlamalı izin verici lisans
│   ├── BSD-2-CLAUSE.txt         # Sade 2 maddeli BSD lisansı
│   ├── GPL-3.0.txt, AGPL-3.0.txt# Güçlü copyleft & SaaS odaklı lisanslar
│   ├── MPL-2.0.txt              # Dosya bazlı zayıf copyleft lisansı
│   ├── UNLICENSE.txt            # Kamu malı (Public Domain) lisansı
│   └── PROPRIETARY.txt          # Kapalı ticari lisans metni
│
├── app/                         # MASAÜSTÜ UYGULAMASI (Electron + Yerel AES-256 Kasa v1.5.0)
│   ├── package.json             # Bağımlılıklar, scriptler (start, dev, test, test:vault, test:parser)
│   ├── main.js                  # Electron ana süreci (çerçevesiz Apple Glass pencere, güvenli IPC)
│   ├── preload.js               # contextIsolation IPC köprüsü
│   ├── README.md                # Masaüstü mimari ve çalıştırma kılavuzu
│   └── src/
│       ├── main/                # Node.js çekirdek & kriptografi
│       │   ├── vault.js         # AES-256-CBC + scrypt + HMAC-SHA256 şifreleme motoru
│       │   ├── vault.test.js    # Sıfır-bağımlılık kripto testleri
│       │   ├── store.js         # Şifreli yerel disk deposu (encrypted_sqlite_aes256.subradar)
│       │   ├── legal-notice.js  # 6502 SK & GDPR Madde 17 yasal fesih metni oluşturucu
│       │   ├── statement-parser.js # 100% Çevrimdışı banka ekstresi & CSV tarayıcısı
│       │   └── parser.test.js   # Ekstre ve yasal bildirim birim testleri
│       └── renderer/            # Apple Glass arayüzü
│           ├── index.html       # Çerçevesiz ana pencere, 6 modül görünümü & kasa şifre kapısı
│           ├── styles/          # app.css, components.css
│           └── scripts/         # app.js, presets.js, crypto-fallback.js
│
└── web/                         # WEB VİTRİNİ VE İNTERAKTİF SİMÜLATÖR
    ├── code.html                # Canlı çalışan tekil vitrin (GitHub Pages'ın sunduğu ana dosya)
    ├── index.html               # web/ içi hızlı yönlendirici -> code.html
    ├── 404.html                 # Alt dizin 404 hata sayfası
    ├── privacy.html             # Alt dizin gizlilik politikası sayfası
    ├── terms.html               # Alt dizin kullanım koşulları sayfası
    ├── thanks.html              # Alt dizin teşekkür ve onay sayfası
    ├── favicon.svg              # Web vitrini favicon vektörü
    ├── og-image.svg             # Web vitrini 1200x630 Open Graph görseli
    │
    ├── manifest.json            # PWA web uygulama manifesti (çevrimdışı ve tam ekran desteği)
    ├── sw.js                    # Çevrimdışı Service Worker önbellekleme motoru
    │
    ├── components/              # 22 Parçalı Modüler HTML Parçaları
    │   ├── layout/
    │   │   ├── header.html      # Üst cam bar, logo, menü, Cmd+K, ses, kısayol, dil, kur ve tema butonları
    │   │   ├── footer.html      # Alt bilgi, canlı gecikme (ping), telif ve yasal bildirimler
    │   │   ├── cookie-banner.html # Sıfır çerez güvencesi ve yerel bellek onay banner'ı
    │   │   └── mobile-sticky-cta.html # Mobilde altta sabit kalan hızlı indirme çubuğu
    │   │
    │   ├── sections/
    │   │   ├── hero.html        # Ana başlık, OS butonları ve interaktif macOS simülasyon penceresi
    │   │   ├── problem.html     # Sektör istatistikleri, kayıp metrikleri ve karanlık desenler
    │   │   ├── statement-lab.html # Canlı hava boşluğu (air-gap) ekstre ve sızıntı tarama laboratuvarı
    │   │   ├── calculator.html  # İsraf hesaplayıcı kaydırıcıları, profil butonları ve PNG röntgen ihracı
    │   │   ├── comparison.html  # Şeffaflık & güven rakip karşılaştırma matrisi (SubRadar vs Bulut)
    │   │   ├── features.html    # 4 çekirdek motor: Audit, Auto-Intercept, Bypass, Vault
    │   │   ├── architecture.html# Yerel AES-256 SQLite mimari diyagramı
    │   │   ├── os-downloads.html# macOS, Windows, Linux indirme kartları ve SHA-256 özetleri
    │   │   ├── hash-verifier.html# İstemci tarafı WebCrypto donanım ivmeli SHA-256 kurulum doğrulayıcı
    │   │   ├── pricing.html     # Free, Pro, Max, Enterprise fiyatlandırma matrisi
    │   │   └── faq.html         # SSS akordeon soruları ve cevapları
    │   │
    │   └── modals/
    │       ├── command-palette.html # ⌘K / Ctrl+K arama ve hızlı eylem paleti
    │       ├── download-modal.html  # Mimari seçimi (ARM/x86) ve ilerleme çubuklu indirme modalı
    │       ├── enterprise-modal.html# Kurumsal teklif formu (inline hata ve loading durumu)
    │       ├── reclaim-modal.html   # CLI kurulumu (`curl`) ve geri kazanım adımları
    │       ├── shortcuts-modal.html # Raycast/Linear stili Power-User klavye kısayolları modalı
    │       ├── legal-generator-modal.html # Canlı 6502 SK & GDPR Madde 17 resmi fesih ihtarname sihirbazı
    │       └── auth-modal.html      # Kullanıcı dostu sosyal giriş, tek tıkla demo, şifre sıfırlama ve aktif profil paneli modalı
    │
    ├── css/
    │   ├── base.css             # Renk değişkenleri, tipografi hiyerarşisi, açık/koyu tema sınıfları
    │   ├── components.css       # Apple Glass, kart gölgeleri, range slider, imleç ışığı ve modal animasyonları
    │   └── main.css             # `@import "base.css"; @import "components.css";`
    │
    ├── js/
    │   ├── config.js            # Kurlar (USD, EUR, TRY), para birimi yöneticisi, localStorage cache
    │   ├── theme.js             # Koyu / Açık tema geçişi (`html.light`, `html.dark`)
    │   ├── fx.js                # Canlı döviz kurları çekici (open.er-api / frankfurter, 12h TTL)
    │   ├── toast.js             # Apple Glass kayan bildirim balonu (`srShowToast`)
    │   ├── audio-fx.js          # Web Audio API sıfır-dosya matematiksel dokunsal ses motoru (`srAudio`)
    │   ├── cursor-glow.js       # Dinamik imleç takipçi cam aydınlatma ve ışıma motoru
    │   ├── statement-lab.js     # İstemci taraflı ekstre ayrıştırıcı ve kaçak analizörü
    │   ├── hash-verifier.js     # WebCrypto API donanım ivmeli SHA-256 doğrulayıcı
    │   ├── social-export.js     # HTML5 Canvas 1200x630 "Abonelik Röntgeni" PNG kart ihracı ve X paylaşımı
    │   ├── calculator.js        # Kaydırıcı formülü ($32/araç + $78/deneme) ve hazır profiller
    │   ├── hero-window.js       # macOS pencere simülasyonu: trafik ışıkları, iptal, arama, sekmeler
    │   ├── scroll-motion.js     # İlerleme çizgisi (`#sr-progress`), scrollspy ve hero paralaksı
    │   ├── i18n.js              # TR/EN/DE sözlükleri, DOM metin düğümü çevirici (`t()`)
    │   ├── analytics.js         # Sıfır-çerez, DNT uyumlu yerel oturum telemetrisi (`srAnalytics`)
    │   ├── cookie-banner.js     # Gizlilik bildirimi ve yerel bellek rıza kontrolü
    │   ├── mobile-cta.js        # Mobilde kaydırmaya bağlı beliren sabit indirme barı
    │   ├── main.js              # Tüm modülleri başlatan ana orkestrasyon dosyası
    │   │
    │   └── modals/
    │       ├── command-palette.js # ⌘K klavye kısayolu, filtreleme ve çalıştırma
    │       ├── download-modal.js  # İndirme simülasyonu, hız/boyut sayacı, SHA doğrulaması
    │       ├── enterprise-modal.js# Kurumsal form alanları doğrulaması (inline hata & spinner)
    │       ├── reclaim-modal.js   # CLI komutunu panoya kopyalama (`curl -sSL...`)
    │       ├── shortcuts-modal.js # `?`, `T`, `S`, `C`, `L`, `D`, `ESC` kısayol dinleyici ve modal yöneticisi
    │       ├── legal-gen.js       # Canlı yasal fesih metni derleyici, pano kopyalama ve `.txt` indirme
    │       └── auth-modal.js      # Sosyal giriş simülasyonu, demo giriş, şifre sıfırlama, JSON dışa aktarma ve oturum kontrolcüsü
    │
    └── scripts/
        └── build.py             # 22 modüler bileşeni doğrulayan test betiği
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
  * `#auth-modal-backdrop`: Kullanıcı dostu giriş, kayıt ve profil paneli modalı (`#auth-modal-btn`)
  * `#sr-toast`: Apple Glass bildirim balonu
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
  * Canlı Açıklama (Description): `"⚡ Masaüstü abonelik zekâsı, tek tıkla yasal iptal ve %100 yerel AES-256 kasa. Unutulan deneme tuzaklarını ve gizli yenilemeleri durdurun. Sıfır bulut, sıfır telemetri."`
  * Canlı Ana Sayfa (Homepage): `https://laynexsw.github.io/SubRadar/`
  * Canlı Konular (Topics): `apple-design`, `desktop-app`, `electron`, `offline-first`, `privacy-first`, `subscription-tracker`, `license-templates`, `open-source`, `aes-256`, `dark-patterns`, `glassmorphism`, `security`, `zero-knowledge`, `zero-cookie`, `gdpr`
  * Hızlı Meta Veri Güncelleme Komutu:
    ```powershell
    gh repo edit Laynexsw/SubRadar -d "⚡ Masaüstü abonelik zekâsı, tek tıkla yasal iptal ve %100 yerel AES-256 kasa. Unutulan deneme tuzaklarını ve gizli yenilemeleri durdurun. Sıfır bulut, sıfır telemetri." -h "https://laynexsw.github.io/SubRadar/" --add-topic "apple-design,desktop-app,electron,offline-first,privacy-first,subscription-tracker,license-templates,open-source,aes-256,dark-patterns,glassmorphism,security,zero-knowledge,zero-cookie,gdpr"
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

