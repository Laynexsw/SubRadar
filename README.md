<div align="center">

# ⚡ SubRadar
### Masaüstü Abonelik Zekâsı, Tek Tıkla İptal ve %100 Yerel AES-256 Kasa

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://laynexsw.github.io/SubRadar/)
[![Desktop App](https://img.shields.io/badge/Desktop-Electron%2041-47a248?style=for-the-badge&logo=electron)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-AES--256%20CBC-10b981?style=for-the-badge&logo=shield)](https://github.com/Laynexsw/SubRadar)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

**SubRadar**, unutulan deneme üyeliklerini, gizli fiyat artışlarını ve aylarca açılmayan yazılım aboneliklerini tespit eden;  
verilerinizi asla buluta göndermeden **%100 yerel ve çevrimdışı** çalışan masaüstü abonelik asistanıdır.

[🌐 Canlı Web Sitesi](https://laynexsw.github.io/SubRadar/) &bull; [💻 Masaüstü Uygulaması](https://github.com/Laynexsw/SubRadar/tree/main/app) &bull; [📑 Modüler Bileşenler](https://github.com/Laynexsw/SubRadar/tree/main/web)

---

</div>

## 📁 Detaylı Proje Dizin Yapısı ve Dosya Rehberi

Proje mimarisi **kök seviyesi**, **masaüstü uygulaması (`app/`)** ve **web vitrini (`web/`)** olmak üzere bağımsız, modüler ve temiz katmanlara ayrılmıştır:

```text
SubRadar/
│
├── 📄 index.html                         # Kök Yönlendirici (Canlı GitHub Pages & yerel sunucuyu web/code.html'e aktarır)
├── ⚙️ .nojekyll                          # GitHub Pages statik yayın yapılandırması (Jekyll motorunu devre dışı bırakır)
├── 🛡️ .gitignore                         # Sürüm kontrolünden hariç tutulan dosyalar (node_modules, app/data vb.)
├── 📜 LICENSE                            # MIT Açık Kaynak Lisansı
├── 📖 README.md                          # Kapsamlı proje mimarisi ve kullanım rehberi
│
├── 💻 app/                               # MASAÜSTÜ UYGULAMASI (Electron + Node.js)
│   ├── package.json                      # Bağımlılıklar, ürün meta verileri ve başlatma scriptleri (npm start)
│   ├── package-lock.json                 # Kilitli paket bağımlılık ağacı
│   ├── README.md                         # Masaüstü uygulaması geliştirici dokümantasyonu
│   │
│   └── src/                              # Masaüstü Uygulama Kaynak Kodları
│       ├── main.js                       # Electron Main Process (Çerçevesiz pencere, IPC olayları, bildirimler)
│       ├── preload.js                    # Güvenli contextBridge API köprüsü (Main ile Renderer arası izolasyon)
│       ├── vault.js                      # AES-256-CBC Şifrelenmiş Yerel Kasa Motoru (%100 çevrimdışı depolama)
│       │
│       └── renderer/                     # Kullanıcı Arayüzü (Renderer Process)
│           ├── index.html                # Çerçevesiz (frameless) Apple Glass masaüstü ana penceresi
│           │
│           ├── styles/
│           │   └── app.css               # macOS/Windows cam estetiği, trafik ışıkları, KPI kartları, modal stilleri
│           │
│           └── scripts/
│               ├── store.js              # Reaktif durum yöneticisi, harcama analizleri ve döviz dönüşümleri
│               ├── ui.js                 # DOM render motoru, dinamik kartlar, filtreler ve toast bildirimleri
│               ├── cancel-modal.js       # Tek Tıkla İptal sihirbazı ve resmi fesih dilekçesi oluşturucu
│               ├── add-modal.js          # Yeni abonelik ekleme penceresi ve hazır servis şablonları
│               └── app.js                # Uygulama başlatıcı, klavye kısayolları (Ctrl+K, Esc) ve pencere kontrolleri
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

| Katman | Konum | Teknoloji | Görevi ve Sorumluluğu |
| :--- | :--- | :--- | :--- |
| **Kök (Root)** | `/` | Git, Markdown, HTML | Canlı GitHub Pages dağıtımını yönlendirir, lisans ve depo belgelerini barındırır. |
| **Masaüstü (App)** | `/app` | Electron v41, Node.js, AES-256 | Kullanıcının bilgisayarında çalışan, verileri yerel olarak şifreleyen gerçek masaüstü uygulamasıdır. |
| **Web Vitrini** | `/web` | Vanilla JS, Modern CSS, HTML5 | Ürünü internette tanıtan, GitHub Pages üzerinde yayında olan interaktif simülasyon vitrinidir. |

---

## 🚀 Hızlı Başlangıç

### 💻 Masaüstü Uygulamasını Çalıştırma (`app/`)
```bash
# app klasörüne gidin
cd app

# Bağımlılıkları kontrol edin / yükleyin
npm install

# Masaüstü uygulamasını başlatın
npm start
```

### 🌐 Web Vitrinini Yerel Olarak Çalıştırma (`web/`)
```bash
# Kök dizinde yerel HTTP sunucusu açın
python -m http.server 8765
```
Tarayıcınızda `http://localhost:8765/` veya `http://localhost:8765/web/code.html` adresini ziyaret edin.

---

## 🔒 Güvenlik Mimarisi

* **Yerel Şifreleme:** `app/src/vault.js`, Node.js'in yerel `crypto` modülü ile `AES-256-CBC` algoritması kullanarak aboneliklerinizi cihazınızda şifreler.
* **İzole IPC:** `preload.js` sayesinde Renderer süreci doğrudan işletim sistemi çekirdeğine erişemez; yalnızca izin verilen güvenli API çağrılarını yapabilir (`contextIsolation: true`).
* **Sıfır Bulut Bağımlılığı:** Uygulama tamamen çevrimdışı (offline-first) prensibiyle tasarlanmıştır.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
