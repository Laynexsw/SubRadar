<div align="center">

# ⚡ SubRadar
### Masaüstü Abonelik Zekâsı, Tek Tıkla İptal ve %100 Yerel AES-256 Kasa

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://laynexsw.github.io/SubRadar/)
[![Electron](https://img.shields.io/badge/Desktop-Electron%2041-47a248?style=for-the-badge&logo=electron)](https://github.com/Laynexsw/SubRadar/tree/main/app)
[![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-AES--256%20CBC-10b981?style=for-the-badge&logo=shield)](https://github.com/Laynexsw/SubRadar)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

**SubRadar**, unutulan deneme üyeliklerini, gizli fiyat artışlarını ve aylarca açılmayan yazılım aboneliklerini tespit eden;  
verilerinizi asla buluta göndermeden **%100 yerel ve çevrimdışı** çalışan masaüstü abonelik asistanıdır.

[🌐 Canlı Web Sitesi](https://laynexsw.github.io/SubRadar/) &bull; [💻 Masaüstü Uygulaması](https://github.com/Laynexsw/SubRadar/tree/main/app) &bull; [📑 Modüler Bileşenler](https://github.com/Laynexsw/SubRadar/tree/main/web)

---

</div>

## 🌟 Öne Çıkan Özellikler

### 1. 🛡️ %100 Çevrimdışı & AES-256 Şifrelenmiş Yerel Kasa
* Banka veya kimlik bilgisi istemez; tüm abonelik verileriniz cihazınızda **AES-256-CBC** algoritmasıyla şifrelenir.
* Telemetri veya bulut senkronizasyonu yoktur. İnternet bağlantısı olmasa dahi tam işlevseldir.

### 2. ⚡ Tek Tıkla İptal Sihirbazı
* **Resmi İptal Portalları:** Netflix, Adobe, Spotify, ChatGPT gibi servislerin doğrudan hesap kapatma sayfalarına tek tıkla yönlendirir.
* **Otomatik Başvuru Dilekçesi:** Tüketici haklarına ve yasal fesih prosedürlerine uygun resmi iptal metnini kişiselleştirerek panonuza kopyalar.
* **Tasarruf Takibi:** İptal edilen servisleri anında tasarruf hanenize ekler.

### 3. 🔍 Akıllı İsraf & Deneme Süresi Tespiti
* **Uyku Modundaki Servisler:** 30 günden uzun süredir kullanılmayan abonelikleri kırmızı bayrakla işaretler.
* **Deneme Tuzağı Uyarısı:** Süresi dolmak üzere olan ücretsiz denemeleri (3 gün veya 1 gün kala) sesli/görsel olarak hatırlatır.

### 4. 🪟 Apple Glass & macOS Frameless Tasarım
* Çerçevesiz (frameless) pencere düzeni ve çalışan interaktif trafik ışıkları (<kbd>Kapat</kbd>, <kbd>Küçült</kbd>, <kbd>Büyüt</kbd>).
* Canlı döviz kurları ile TL, USD, EUR ve GBP harcama analitiği.
* <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘K</kbd> ile hızlı arama.

---

## 📁 Proje Dizin Yapısı

Proje, bağımsız ve modüler iki ana katmandan oluşur:

```text
SubRadar/
│
├── index.html                            # Kök yönlendirici (Canlı GitHub Pages girişi)
├── .nojekyll                             # GitHub Pages statik yayın yapılandırması
├── README.md                             # Proje ana dökümantasyonu
│
├── app/                                  # 💻 MASAÜSTÜ UYGULAMASI (Electron + Node.js)
│   ├── package.json                      # Uygulama bağımlılıkları ve başlatma scriptleri
│   ├── README.md                         # Masaüstü mimari rehberi
│   └── src/
│       ├── main.js                       # Electron Main Process (Pencere, IPC, bildirimler)
│       ├── preload.js                    # Güvenli contextBridge API köprüsü
│       ├── vault.js                      # AES-256 şifreli yerel kasa motoru (%100 çevrimdışı)
│       └── renderer/                     # Kullanıcı Arayüzü (Renderer)
│           ├── index.html                # Çerçevesiz masaüstü ana penceresi
│           ├── styles/app.css            # Apple Glass & macOS tasarım sistemi
│           └── scripts/                  # Store, UI, Tek Tıkla İptal ve Ekleme modülleri
│
└── web/                                  # 🌐 WEB TANITIM VİTRİNİ & BİLEŞENLER
    ├── code.html                         # Entegre vitrin sayfası ve interaktif simülatör
    ├── index.html                        # web/ içi yönlendirici
    ├── components/                       # Modüler HTML Bileşenleri (Modals, Sections, Layout)
    ├── css/                              # Stil Dosyaları (base.css, components.css, main.css)
    ├── js/                               # JavaScript Modülleri (fx, i18n, calculator, toast)
    └── scripts/build.py                  # Bileşen doğrulama ve derleme betiği
```

---

## 🚀 Hızlı Başlangıç

### 1. Masaüstü Uygulamasını Çalıştırma (`app/`)
Bilgisayarınızda Node.js yüklüyse:
```bash
# app klasörüne gidin
cd app

# Gerekli paketleri yükleyin
npm install

# Masaüstü uygulamasını başlatın
npm start
```

### 2. Web Sayfasını Yerel Olarak Çalıştırma (`web/`)
```bash
# Kök dizinde yerel HTTP sunucusu açın
python -m http.server 8765
```
Tarayıcınızda `http://localhost:8765/` veya `http://localhost:8765/web/code.html` adresini ziyaret edin.

---

## 🔒 Gizlilik ve Güvenlik Taahhüdü

* **Sıfır İzleyici (Zero Trackers):** Google Analytics, Facebook Pixel veya üçüncü parti izleyiciler bulunmaz.
* **Sıfır Bulut Bağımlılığı:** Kasadaki tüm şifreleme anahtarları makinenizde oluşturulur ve saklanır.
* **Açık Kaynak Şeffaflığı:** Kasa şifreleme ve dosya erişim kodları [vault.js](app/src/vault.js) altında şeffaf şekilde incelenebilir.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
