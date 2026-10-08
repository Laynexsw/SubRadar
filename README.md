# SubRadar — Masaüstü Abonelik Zekâsı ve Tek Tıkla İptal

SubRadar, masaüstünde çalışan %100 yerel ve çevrimdışı bir abonelik analiz ve iptal aracıdır.

---

## 📁 Proje Dizin Yapısı

Tüm web kaynakları ve modüler bileşenler **`web/`** klasörü altında toplanmıştır:

```text
SubRadar/
│
├── index.html                            # Kök yönlendirici (web/code.html adresine aktarır)
├── .nojekyll                             # GitHub Pages doğrudan statik yayın yapılandırması
├── README.md                             # Proje dökümantasyonu
│
└── web/                                  # Web Uygulaması ve Kaynak Kodları
    ├── code.html                         # Ana vitrin ve entegre sayfa
    ├── index.html                        # web/ içi yönlendirici (code.html)
    │
    ├── components/                       # HTML Bileşenleri (Modüler Parçalar)
    │   ├── layout/
    │   │   ├── header.html               # Üst gezinme çubuğu, marka, dil, kur ve tema kontrolleri
    │   │   └── footer.html               # Alt bilgi çubuğu, bağlantılar, canlı gecikme göstergesi
    │   │
    │   ├── sections/
    │   │   ├── hero.html                 # Hero alanı ve interaktif masaüstü pencere simülasyonu
    │   │   ├── problem.html              # Abonelik israfı sorun tanımı ve sektör istatistikleri
    │   │   ├── calculator.html           # İsraf hesaplayıcı, kaydırıcılar, hazır profiller
    │   │   ├── features.html             # Çekirdek motor özellikleri 4'lü ızgara
    │   │   ├── architecture.html         # Yerel AES-256 SQLite mimari ve güvenlik kartları
    │   │   ├── os-downloads.html         # macOS, Windows, Linux indirme kartları ve sağlama toplamları
    │   │   ├── pricing.html              # Free, Pro, Max, Enterprise fiyatlandırma tablosu
    │   │   └── faq.html                  # Sıkça sorulan sorular (SSS)
    │   │
    │   └── modals/
    │       ├── download-modal.html       # İndirme penceresi (İlerleme çubuğu, mimari ve OS seçimi)
    │       ├── command-palette.html      # Cmd+K / Ctrl+K komut paleti penceresi
    │       ├── enterprise-modal.html     # Kurumsal başvuru formu ve onay ekranı
    │       └── reclaim-modal.html        # Geri kazanım ve CLI kurulum komut penceresi
    │
    ├── css/                              # Stil Dosyaları
    │   ├── base.css                      # Temel renkler, tipografi, açık/koyu tema kuralları
    │   ├── components.css                # Apple Glass, kartlar, kaydırıcılar ve animasyonlar
    │   └── main.css                      # Ana stil toplayıcı (@import kuralları)
    │
    ├── js/                               # JavaScript Modülleri (ES Modülleri)
    │   ├── config.js                     # Sabitler, döviz kurları, global konfigürasyon
    │   ├── i18n.js                       # Çoklu dil sözlüğü (TR / EN / DE) ve metin çevirici
    │   ├── theme.js                      # Açık / Koyu tema yöneticisi
    │   ├── fx.js                         # Canlı döviz kuru çekici ve önbellek
    │   ├── toast.js                      # Apple Glass kayan bildirim balonu
    │   ├── calculator.js                 # İsraf hesaplama motoru ve hızlı profil düğmeleri
    │   ├── hero-window.js                # Hero masaüstü penceresi, trafik ışıkları ve iptal simülasyonu
    │   ├── scroll-motion.js              # Kaydırma animasyonları ve okuma ilerleme çizgisi
    │   │
    │   ├── modals/                       # Pencere Kontrolcüleri
    │   │   ├── download-modal.js         # İndirme simülasyonu ve dosya seçimi
    │   │   ├── command-palette.js        # Komut paleti arama ve klavye gezinimi
    │   │   ├── enterprise-modal.js       # Kurumsal form doğrulama ve gönderim
    │   │   └── reclaim-modal.js          # CLI kopyalama ve geri kazanım adımları
    │   │
    │   └── main.js                       # Tüm modülleri bir araya getiren ana orkestrasyon dosyası
    │
    └── scripts/
        └── build.py                      # Bileşen doğrulama ve derleme betiği
```

---

## 🚀 Canlı Yayın ve Çalıştırma

* **Canlı Web Sitesi (GitHub Pages):** [https://laynexsw.github.io/SubRadar/](https://laynexsw.github.io/SubRadar/)
* **Yerel Sunucu:**
  ```bash
  python -m http.server 8765
  ```
  Tarayıcıda `http://localhost:8765/web/code.html` veya `http://localhost:8765/` adresine gidiniz.
