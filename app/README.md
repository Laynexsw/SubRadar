# ⚡ SubRadar Desktop App (v1.0)

> **%100 Çevrimdışı, İnternetsiz ve Yerel Masaüstü Abonelik Yönetimi & Tek Tıkla İptal Merkezi**

SubRadar Masaüstü Uygulaması (**v1.0**), abonelik ve harcama verilerinizi hiçbir bulut sunucusuna göndermeyen, tamamen bilgisayarınızda çevrimdışı çalışan ve verilerinizi **AES-256** standardıyla şifreleyerek koruyan modern bir masaüstü uygulamasıdır.

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

# 3. Güvenlik ve Ekstre Tarayıcı Testlerini Çalıştırın
npm test

# 4. Masaüstü Uygulamasını Başlatın
npm start
```

---

## 🏗️ Uygulama Yapısı

```text
app/
├── package.json                   # Sürüm (1.0.0), Ticari Lisans (UNLICENSED) ve çalışma komutları
├── main.js                        # Electron Ana Süreci (Çerçevesiz Pencere ve Yerel İşlemler)
├── preload.js                     # Güvenli Arayüz Köprüsü
├── README.md                      # Bu kılavuz
│
├── src/
│   ├── main/                      # Çekirdek Güvenlik ve Yerel Veri Modülleri
│   │   ├── vault.js               # AES-256 Şifreleme ve Anahtar Koruma Motoru
│   │   ├── vault.test.js          # Kasa Güvenlik Birim Testleri
│   │   ├── store.js               # Yerel Şifreli Kasa Deposu (.subradar)
│   │   ├── legal-notice.js        # 6502 Sayılı Kanun & KVKK/GDPR Resmi İptal Dilekçesi Üreticisi
│   │   ├── statement-parser.js    # %100 Çevrimdışı Banka Ekstresi ve Harcama Tarayıcısı
│   │   └── parser.test.js         # Ekstre Tarayıcı ve İptal Dilekçesi Birim Testleri
│   │
│   └── renderer/                  # Kullanıcı Arayüzü (HTML / CSS / JS)
│       ├── index.html             # Ana Ekran, 6 Yönetim Modülü ve Şifreli Kasa Girişi
│       ├── styles/
│       │   ├── app.css            # Pencere düzeni, tema ve renk değişkenleri
│       │   └── components.css     # Kartlar, tablolar, butonlar ve pencereler
│       └── scripts/
│           ├── app.js             # Arayüz Yönetimi ve Otomatik Bütçe Hesaplamaları
│           ├── presets.js         # 16+ Popüler Servis Şablonu (Doğrudan İptal Bağlantılı)
│           └── crypto-fallback.js # Tarayıcı Önizleme Uyumluluk Katmanı
```

---

## 🛡️ Gizlilik ve Güvenlik Özellikleri

* **Güçlü Yerel Şifreleme (AES-256):** Tüm abonelik bilgileriniz bilgisayarınızda şifreli olarak saklanır. Ana şifreniz olmadan verileriniz okunamaz.
* **Şifre ve Veri Koruması:** Ana şifreniz `scrypt` ve `HMAC-SHA256` güvenlik standartlarıyla korunur; yanlış şifre girildiğinde verileriniz zarar görmez.
* **%100 Çevrimdışı Çalışma (Veri Paylaşımı Yok):** Uygulama içinde reklam takipçisi, analitik aracı veya dış sunuculara veri gönderen hiçbir bileşen bulunmaz.

---

## ⚡ Temel Özellikler

1. **Şifreli Kasa Kilit Ekranı:** Uygulama açılışında yalnızca sizin bildiğiniz ana şifre ile kasanız açılır.
2. **Modern ve Sade Arayüz:** Göz yormayan koyu tema, anlaşılır özet kartları ve akıcı masaüstü pencere tasarımı.
3. **16+ Hazır Popüler Servis Şablonu:** Netflix, Spotify, Adobe, ChatGPT, YouTube Premium, Figma ve benzeri servisleri tek tıkla hızlıca ekleyebilme.
4. **Risk ve Deneme Süresi Uyarıları:** Uzun süredir kullanmadığınız veya ücretsiz deneme süresi bitmek üzere olan abonelikleri tespit ederek yıllık tasarruf tutarınızı hesaplar.
5. **Tek Tıkla İptal Merkezi ve Resmi İptal Dilekçesi:** Servislerin doğrudan abonelik iptal sayfalarını açar ve Tüketicinin Korunması Hakkında Kanun'a uygun resmi iptal metnini tek tıkla hazırlar.
6. **Çevrimdışı Banka Ekstresi Tarayıcısı:** Banka ekstresi veya kredi kartı hareketlerinizi internet bağlantısı gerekmeden bilgisayarınızda tarar, aboneliklerinizi otomatik bulup listeye ekler.
7. **⌘K / Ctrl+K Hızlı Arama ve Komut Menüsü:** Klavyeden tüm ekranlara ve aboneliklere anında ulaşım.
8. **Şifreli Yedekleme (`.subradar`):** Verilerinizi tek bir şifreli dosya olarak yedekleyebilir ve istediğiniz zaman geri yükleyebilirsiniz.

---

## 📄 Lisans

Bu yazılım **Ticari Lisans (`UNLICENSED`)** kapsamındadır. Tüm hakları saklıdır.
