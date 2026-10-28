# ⚡ SubRadar v1.0 — Saf Rust Masaüstü Uygulaması

> **%100 Saf Rust (`eframe` / `egui`), Çevrimdışı ve Şifreli Yerel Masaüstü Abonelik Yöneticisi**

SubRadar Masaüstü Uygulaması (**v1.0**), ağır tarayıcı veya Electron altyapısı kullanmadan doğrudan **%100 Saf Rust** ve GPU hızlandırmalı yerel arayüz (`eframe` / `egui`) ile geliştirilmiştir. Tüm verileriniz çevrimdışı olarak yalnızca kendi bilgisayarınızda **AES-256-CBC + HMAC-SHA256** standardıyla şifrelenerek saklanır.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
* Rust (`rustc` & `cargo` 1.80+)

### Test ve Derleme Komutları

```powershell
# 1. Masaüstü dizinine geçin
cd app

# 2. Birim testlerini çalıştırın (Kasa, Ekstre Tarayıcı ve Resmi Dilekçe)
cargo test

# 3. Uygulamayı doğrudan başlatın
cargo run --release

# 4. Tekil taşınabilir .exe dosyasını üretin
cargo build --release
# Üretilen dosya: target\release\subradar.exe
```

---

## 🏗️ Modüler Rust Mimarisi (`app/`)

```text
app/
├── Cargo.toml           # Sürüm 1.0.0, Ticari Lisans ve Saf Rust bağımlılıkları
├── README.md            # Mimari ve kullanım kılavuzu
└── src/
    ├── main.rs          # Native pencere başlatıcısı (1180x760, konsolsuz Windows modu)
    ├── theme.rs         # Minimalist Apple / Raycast / Linear koyu ve açık tema sistemi
    ├── models.rs        # Abonelik, Para Birimi (TRY/USD/EUR) ve Bütçe Sağlık Puanı modelleri
    ├── presets.rs       # 18+ popüler abonelik şablonu ve doğrudan resmi iptal bağlantıları
    ├── vault.rs         # AES-256-CBC + PBKDF2 + HMAC-SHA256 yerel şifreli kasa motoru (+ birim testleri)
    ├── parser.rs        # %100 çevrimdışı banka ekstresi ve harcama tarayıcısı (+ birim testleri)
    ├── legal.rs         # 6502 Sayılı Kanun, KVKK ve GDPR Madde 17 resmi iptal dilekçesi üreticisi (+ birim testleri)
    └── ui.rs            # Tek ekranda 3 özet kartı, hızlı arama (Ctrl+K) ve 4 sekmeli sade arayüz
```

---

## ✨ Temel Özellikler

1. **Minimalist Apple / Raycast / Linear Tasarımı:** Göz yormayan koyu yüzeyler (`#09090b`, `#121215`), zümrüt yeşili (`#10b981`) vurgu, açık/koyu tema geçişi ve `Ctrl+K` hızlı arama.
2. **3 Net Özet Kartı:** Aylık Toplam Gider, Boşa Ödenen / Deneme Süresi Abonelikleri ve Yıllık Tasarruf Fırsatı & Bütçe Sağlık Puanı (`A+`, `B+`, `C-`).
3. **18+ Hazır Popüler Servis:** Netflix, Spotify, YouTube Premium, Apple iCloud+, ChatGPT Plus, Adobe Creative Cloud, Amazon Prime, Disney+, Xbox Game Pass, BluTV / Max, Exxen, TOD, GitHub Copilot, Canva Pro, Microsoft 365, Notion, Zoom ve PlayStation Plus için tek tıkla ekleme ve doğrudan iptal sayfası açma.
4. **Çevrimdışı Ekstre Tarayıcı:** Kredi kartı ekstresi veya hesap hareketlerini internet bağlantısı olmadan tarar ve abonelikleri otomatik ayıklar.
5. **Resmi İptal Dilekçesi & AES-256 Kasa:** 6502 Sayılı Kanun ve GDPR Madde 17 uyumlu resmi iptal dilekçesi oluşturur; tüm verileri `encrypted_sqlite_aes256.subradar` dosyasında şifreli olarak saklar.

---

## 📄 Lisans

Bu yazılım **Ticari Lisans (`LicenseRef-SubRadar-Commercial-1.0`)** kapsamındadır. Tüm hakları saklıdır.
