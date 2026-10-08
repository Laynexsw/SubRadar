# SubRadar Desktop — Masaüstü Abonelik Zekâsı ve Tek Tıkla İptal

SubRadar, web tanıtım sayfasında sunulan tüm vaatlerin yerel olarak çalışan, %100 çevrimdışı ve AES-256 şifreli masaüstü uygulamasıdır.

---

## 🏗️ Mimari Yapı

```text
app/
├── package.json               # Electron ve proje konfigürasyonu
├── README.md                  # Bu dökümantasyon
│
└── src/
    ├── main.js                # Electron Main Process (Pencere yönetimi, IPC, sistem entegrasyonu)
    ├── preload.js             # Güvenli contextBridge API köprüsü
    ├── vault.js               # AES-256 şifreli yerel kasa veri motoru (%100 yerel ve çevrimdışı)
    │
    └── renderer/              # Kullanıcı Arayüzü (Renderer Process)
        ├── index.html         # Apple Glass & macOS frameless masaüstü ana penceresi
        ├── styles/
        │   └── app.css        # Koyu tema, cam efektleri, trafik ışıkları, kartlar
        └── scripts/
            ├── store.js       # Reaktif veri ve hesaplama motoru (Aylık/Yıllık harcama, israf analizi)
            ├── ui.js          # DOM kartları ve KPI gösterge renderlayıcısı
            ├── cancel-modal.js# "Tek Tıkla İptal" sihirbazı ve resmi iptal mektubu oluşturucu
            ├── add-modal.js   # "Yeni Abonelik Ekle" sihirbazı ve hazır servis şablonları
            └── app.js         # Ana orkestrasyon ve klavye kısayolları (Ctrl+K, Esc)
```

---

## ✨ Masaüstü Yetenekleri

1. **Frameless macOS & Windows Tasarımı:**
   - Çalışan interaktif trafik ışıkları (Kapat, Küçült, Büyüt)
   - Apple Glass arka plan bulanıklığı ve modern koyu arayüz
2. **AES-256 Yerel Şifreli Kasa:**
   - Tüm abonelik verileri yalnızca kullanıcının bilgisayarında şifrelenerek saklanır.
   - Buluta hiçbir veri aktarılmaz, %100 çevrimdışı çalışır.
3. **Akıllı İsraf Tespit Algoritması:**
   - 30+ gündür kullanılmayan servisleri "İsraf Riski" olarak etiketler.
   - Deneme sürelerini izler (örn: 3 gün veya 1 gün kala sarı/kırmızı uyarı).
4. **Tek Tıkla İptal Sihirbazı:**
   - Resmi hesap iptal sayfasına tek tıkla yönlendirir.
   - Tüketici haklarına uygun resmi iptal başvuru dilekçesini otomatik üretip panoya kopyalar.
   - İptal edilen servisleri tasarruf hanesine ekler.
5. **Klavye Kısayolları:**
   - `Ctrl+K` / `⌘K`: Hızlı arama çubuğuna odaklanır.
   - `Esc`: Açık modalları kapatır.

---

## 🚀 Çalıştırma

Geliştirici modunda çalıştırmak için:
```bash
cd app
npm start
```
