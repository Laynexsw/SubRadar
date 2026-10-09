# ⚡ SubRadar Desktop App

> **%100 Yerel, Sıfır Bilgi (Zero-Knowledge) ve Çevrimdışı Masaüstü Abonelik Zekâsı & Doğrudan İptal Merkezi**

SubRadar Masaüstü İstemcisi, verilerinizi asla harici bir bulut sunucusuna göndermeyen, yerel diskte **AES-256-CBC + scrypt + HMAC-SHA256** ile şifrelenmiş kasa mimarisine sahip modern bir Electron uygulamasıdır.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
* Node.js v18+ (Node.js v24 önerilir)
* npm veya pnpm

### Kurulum ve Çalıştırma

```powershell
# 1. Masaüstü dizinine geçin
cd app

# 2. Bağımlılıkları yükleyin
npm install

# 3. Kriptografik Kasa Testlerini Çalıştırın
npm run test:vault

# 4. Masaüstü Uygulamasını Başlatın
npm start
```

---

## 🏗️ Mimari & Dosya Yapısı

```text
app/
├── package.json                   # Bağımlılıklar, scriptler (start, dev, test:vault)
├── main.js                        # Electron Ana Süreci (Çerçevesiz Pencere, Güvenli IPC)
├── preload.js                     # contextIsolation & sandbox IPC Köprüsü
├── README.md                      # Bu kılavuz
│
├── src/
│   ├── main/                      # Node.js Çekirdek & Güvenli Arka Plan
│   │   ├── vault.js               # AES-256-CBC + scrypt + HMAC-SHA256 Şifreleme Motoru
│   │   ├── vault.test.js          # Sıfır-bağımlılık Kripto Birim Testleri
│   │   ├── store.js               # Şifreli Kasa Deposu (encrypted_sqlite_aes256.subradar)
│   │   └── legal-notice.js        # 6502 SK & GDPR Madde 17 Yasal İptal Metni Üreticisi
│   │
│   └── renderer/                  # Apple Glass Arayüzü (HTML / CSS / ES6)
│       ├── index.html             # Çerçevesiz Ana Arayüz & Kasa Kilit Ekranı
│       ├── styles/
│       │   ├── app.css            # Pencere sürükleme, temel düzen ve renk değişkenleri
│       │   └── components.css     # Apple Glass, KPI kartları, veri tablosu ve modallar
│       └── scripts/
│           ├── app.js             # Reaktif Arayüz Orkestratörü & Canlı Hesaplamalar
│           ├── presets.js         # 15+ Hazır SaaS Şablonu (Doğrudan İptal Bağlantılı)
│           └── crypto-fallback.js # WebCrypto (Tarayıcı önizleme uyumluluğu)
```

---

## 🛡️ Güvenlik & Kriptografi Standartları

* **Kasa Algoritması:** AES-256-CBC
* **Anahtar Türetme (KDF):** `scryptSync` (N=16384, r=8, p=1, 32-byte key + 32-byte HMAC key)
* **Bütünlük Doğrulaması:** Timing-safe `HMAC-SHA256` doğrulaması. Yanlış parola girildiğinde şifreli veri asla bozulmaz veya çözülmez.
* **Sıfır Telemetri:** Uygulama içinde Google Analytics, Mixpanel, Sentry veya harici herhangi bir izleme kodu bulunmaz.

---

## ⚡ Temel Özellikler

1. **Master Password Kasa Kilit Kapısı:** Uygulama açılışında ana şifre belirlenir/doğrulanır.
2. **Apple Glassmorphism UI:** Koyu taban (`#07090e`), cam kart efektleri (`backdrop-filter: blur(24px)`), SF Pro / Inter tipografisi ve çerçevesiz macOS pencere tasarımı.
3. **15+ Popüler SaaS Şablonu:** Adobe CC, Figma, GitHub Copilot, ChatGPT Plus, Claude Pro, JetBrains, Netflix vb. tek tıkla form doldurma.
4. **Risk & Deneme Radarı:** 30+ gündür açılmayan veya süresi dolmak üzere olan deneme sürümlerini tespit edip yıllık maliyet kaybını hesaplar.
5. **Tek Tıkla İptal Sihirbazı & Resmi Fesih Mektubu:** Servislerin doğrudan iptal portallarına tek tıkla yönlendirir ve 6502 sayılı Kanun / GDPR Madde 17'ye uygun resmi fesih metnini panoya kopyalar.
6. **Yedek Dışa/İçe Aktar:** Kasanızı `.subradar` uzantılı yerel şifreli dosya olarak dışa aktarabilir ve dilediğiniz zaman geri yükleyebilirsiniz.
