<div align="center">

# ⚡ SubRadar
### Masaüstü Abonelik Zekâsı, Tek Tıkla İptal ve %100 Yerel AES-256 Kasa

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://laynexsw.github.io/SubRadar/)
[![Desktop App](https://img.shields.io/badge/Desktop-Çok%20Yakında-amber?style=for-the-badge&logo=electron)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Security](https://img.shields.io/badge/Security-AES--256%20CBC-10b981?style=for-the-badge&logo=shield)](https://github.com/Laynexsw/SubRadar)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

**SubRadar**, unutulan deneme üyeliklerini, gizli fiyat artışlarını ve aylarca açılmayan yazılım aboneliklerini tespit eden;  
verilerinizi asla buluta göndermeden **%100 yerel ve çevrimdışı** çalışan masaüstü abonelik asistanıdır.

[🌐 Canlı Web Sitesi](https://laynexsw.github.io/SubRadar/) &bull; [💻 Masaüstü Uygulaması (Çok Yakında)](https://github.com/Laynexsw/SubRadar/tree/main/app) &bull; [📑 Modüler Bileşenler](https://github.com/Laynexsw/SubRadar/tree/main/web) &bull; [🧠 Mimari & Kod Kataloğu](CODEBASE.md)

---

</div>

## 📁 Detaylı Proje Dizin Yapısı ve Dosya Rehberi

Proje mimarisi **kök seviyesi**, **masaüstü uygulaması (`app/`)** ve **web vitrini (`web/`)** olmak üzere bağımsız, modüler ve temiz katmanlara ayrılmıştır:

```text
SubRadar/
│
├── 📄 index.html                         # Kök Yönlendirici (Canlı GitHub Pages & yerel sunucuyu web/code.html'e aktarır)
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
├── 💻 app/                               # MASAÜSTÜ UYGULAMASI (🚀 Çok Yakında / Coming Soon)
│   ├── README.md                         # Masaüstü uygulaması yol haritası ve mimari rehberi
│   └── src/                              # Gelecek masaüstü kaynak kodları dizini
│       └── renderer/
│           ├── scripts/
│           └── styles/
│
└── 🌐 web/                               # WEB TANITIM VİTRİNİ & MODÜLER BİLEŞENLER
    ├── code.html                         # Entegre canlı vitrin uygulaması ve interaktif masaüstü simülatörü

    ├── index.html                        # web/ içi hızlı yönlendirici
    │
    ├── components/                       # Modüler HTML Bileşenleri
    │   ├── layout/
    │   │   ├── header.html               # Üst gezinme çubuğu, marka, dil, kur ve tema kontrolleri
    │   │   └── footer.html               # Alt bilgi çubuğu, bağlantılar ve yerel gecikme göstergesi
    │   │
    │   ├── sections/
    │   │   ├── hero.html                 # Hero vitrin alanı ve interaktif pencere simülasyonu
    │   │   ├── problem.html              # Abonelik israfı sorun tanımı ve sektör istatistikleri
    │   │   ├── calculator.html           # İsraf hesaplayıcı, kaydırıcılar ve hazır kullanıcı profilleri
    │   │   ├── features.html             # Çekirdek motor özellikleri 4'lü kart ızgarası
    │   │   ├── architecture.html         # Yerel AES-256 SQLite mimari ve güvenlik kartları
    │   │   ├── os-downloads.html         # macOS, Windows, Linux indirme kartları ve sağlama toplamları
    │   │   ├── pricing.html              # Free, Pro, Max, Enterprise fiyatlandırma tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular (SSS) akordeon paneli
    │   │
    │   └── modals/
    │       ├── download-modal.html       # İndirme modalı (İlerleme çubuğu, işletim sistemi ve mimari seçimi)
    │       ├── command-palette.html      # Cmd+K / Ctrl+K komut paleti arama penceresi
    │       ├── enterprise-modal.html     # Kurumsal talep ve iletişim formu
    │       └── reclaim-modal.html        # Geri kazanım ve CLI kurulum adımları
    │
    ├── css/                              # Web Stil Dosyaları
    │   ├── base.css                      # Temel renk paleti, tipografi kuralları, açık/koyu tema değişkenleri
    │   ├── components.css                # Apple Glass kartlar, kaydırıcılar, rozetler ve mikro animasyonlar
    │   └── main.css                      # Tüm CSS modüllerini birleştiren ana stil orkestrasyonu
    │
    ├── js/                               # Web JavaScript Modülleri
    │   ├── config.js                     # Sabitler, kurlar ve global yapılandırma ayarları
    │   ├── i18n.js                       # Çoklu dil sözlüğü (Türkçe, İngilizce, Almanca) ve çevirici
    │   ├── theme.js                      # Açık / Koyu tema geçiş yöneticisi
    │   ├── fx.js                         # Canlı döviz kuru çekici ve önbellekleme
    │   ├── toast.js                      # Kayan Apple Glass bildirim balonu sistemi
    │   ├── calculator.js                 # İsraf hesaplama algoritmaları ve profil geçişleri
    │   ├── hero-window.js                # Hero masaüstü simülasyonu, trafik ışıkları ve iptal senaryoları
    │   ├── scroll-motion.js              # Sayfa okuma ilerleme çizgisi ve akıcı kaydırma efektleri
    │   ├── main.js                       # Modüler web scriptlerinin ana giriş ve koordinasyon dosyası
    │   │
    │   └── modals/                       # Web Modal Kontrolcüleri
    │       ├── download-modal.js         # İndirme simülasyonu ve dosya indirme tetikleyicisi
    │       ├── command-palette.js        # Komut paleti klavye gezinimi ve hızlı arama
    │       ├── enterprise-modal.js       # Kurumsal form doğrulama ve gönderim yönetimi
    │       └── reclaim-modal.js          # CLI komut kopyalama ve geri kazanım adımları
    │
    └── scripts/
        └── build.py                      # 14 modüler bileşeni doğrulayan ve test eden Python otomasyon betiği
```

---

## 🌟 Katmanların Görev Dağılımı

| Katman | Konum | Teknoloji | Görevi ve Durumu |
| :--- | :--- | :--- | :--- |
| **Kök (Root)** | `/` | Git, Markdown, HTML | Canlı GitHub Pages dağıtımını yönlendirir, lisans ve depo belgelerini barındırır. |
| **Lisanslar (Licenses)** | `/licenses` | Markdown & Text | 📜 **Rehber & Şablonlar** — MIT, Apache, GPL, BSD vb. lisans karşılaştırma matrisi ve şablonları. |
| **Masaüstü (App)** | `/app` | Electron & Native *(Yol Haritası)* | 🚀 **Çok Yakında** — Verileri cihazda AES-256 ile şifreleyen yerel masaüstü istemcisi. |
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
Masaüstü uygulaması şu anda geliştirilme aşamasındadır (Çok Yakında). Gelişmeleri [`app/README.md`](app/README.md) dosyasından takip edebilirsiniz.


---

## 🔒 Güvenlik Mimarisi

* **Yerel Şifreleme:** `app/src/vault.js`, Node.js'in yerel `crypto` modülü ile `AES-256-CBC` algoritması kullanarak aboneliklerinizi cihazınızda şifreler.
* **İzole IPC:** `preload.js` sayesinde Renderer süreci doğrudan işletim sistemi çekirdeğine erişemez; yalnızca izin verilen güvenli API çağrılarını yapabilir (`contextIsolation: true`).
* **Sıfır Bulut Bağımlılığı:** Uygulama tamamen çevrimdışı (offline-first) prensibiyle tasarlanmıştır.

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

