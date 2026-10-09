# 📚 SubRadar — Kapsamlı Kod Tabanı & Mimari Hafıza Belgesi (CODEBASE.md)

> **Bu belgenin varlık sebebi:** Gelecekteki tüm sohbetlerde ve geliştirme oturumlarında, projedeki kaynak dosyaların tekrar taranmasına gerek kalmaksızın tüm mimariyi, durum yönetimini (state), fonksiyon imzalarını ve DOM yapısını tek bakışta sunmaktır.

---

## 📑 İçindekiler
1. [Genel Bakış ve Katmanlar](#1-genel-bakış-ve-katmanlar)
2. [Dosya Kataloğu ve Sorumluluk Matrisi](#2-dosya-kataloğu-ve-sorumluluk-matrisi)
3. [Durum Yönetimi (State) ve Veri Akışı](#3-durum-yönetimi-state-ve-veri-akışı)
4. [Bileşen ve DOM ID Dizini](#4-bileşen-ve-dom-id-dizini)
5. [Tasarım ve Stil Sistemi](#5-tasarım-ve-stil-sistemi)
6. [Masaüstü Uygulaması (Roadmap)](#6-masaüstü-uygulaması-roadmap)
7. [Geliştirici İpuçları & Sık Yapılan İşlemler](#7-geliştirici-ipuçları--sık-yapılan-işlemler)

---

## 1. Genel Bakış ve Katmanlar

SubRadar, kullanıcıların abonelik israfını engelleyen, tek tıkla iptal bağlantıları sunan, %100 yerel ve çevrimdışı çalışan bir sistemdir.

Depo şu anda **üç ana katmandan** oluşur:
1. **Kök Katmanı (`/`):** Dağıtım yapılandırması (`index.html`, `.nojekyll`, `.gitignore`), lisanslar ve dokümantasyon (`README.md`, `PRODUCT.md`, `AGENTS.md`, `CODEBASE.md`).
2. **Web Vitrini Katmanı (`web/`):**
   * **Modüler Kaynak:** `components/` (14 HTML parçası), `css/` (3 dosya), `js/` (13 modül), `scripts/build.py`.
   * **Üretim / Canlı Yayın:** `code.html` (~297 KB, tüm stil, betik ve HTML'in birleştiği, GitHub Pages'ta yayınlanan monolitik dosya).
3. **Masaüstü Katmanı (`app/`):** Gelecekte Electron/Native istemcisini barındıracak altyapı klasörü.

---

## 2. Dosya Kataloğu ve Sorumluluk Matrisi

### 2.1 Kök Dizin Dosyaları
* [`index.html`](file:///c:/Users/arday/Desktop/SubRadar/index.html): Kök yönlendirici. Hem `<meta http-equiv="refresh">` hem de JS `window.location.replace` ile gelen tüm trafiği `web/code.html`'e iletir.
* [`.nojekyll`](file:///c:/Users/arday/Desktop/SubRadar/.nojekyll): GitHub Pages'ın Jekyll motorunu devre dışı bırakarak dosya yollarının eksiksiz sunulmasını sağlar.
* [`.gitignore`](file:///c:/Users/arday/Desktop/SubRadar/.gitignore): IDE araçları (`.agent/`, `.gemini/`, `.codex/`, `.opencode/`), `node_modules/`, `dist/`, `.env` ve sistem dosyalarını hariç tutar.
* [`LICENSE`](file:///c:/Users/arday/Desktop/SubRadar/LICENSE): Ana depo MIT açık kaynak lisansı.
* [`PRODUCT.md`](file:///c:/Users/arday/Desktop/SubRadar/PRODUCT.md): Ürün vizyonu, hedef kitle (freelancer, yazılımcı, gizlilik odaklı kullanıcılar), WCAG standartları, marka sesi ve ilkeleri.
* [`README.md`](file:///c:/Users/arday/Desktop/SubRadar/README.md): GitHub deposu karşılama sayfası, mimari harita, canlı bağlantılar ve lisans karşılaştırma tablosu.
* [`AGENTS.md`](file:///c:/Users/arday/Desktop/SubRadar/AGENTS.md): AI asistanları için kompakt hızlı başlangıç ve bağlam koruma rehberi.

### 2.2 Lisans Kütüphanesi (`licenses/`)
* [`licenses/README.md`](file:///c:/Users/arday/Desktop/SubRadar/licenses/README.md): Lisans seçim kılavuzu ve 9 popüler lisansın karşılaştırma tablosu.
* [`licenses/*.txt`](file:///c:/Users/arday/Desktop/SubRadar/licenses/): MIT, Apache-2.0, BSD-3, BSD-2, GPL-3.0, AGPL-3.0, MPL-2.0, Unlicense ve Proprietary tam metinleri.

### 2.3 Web Modüler Bileşenleri (`web/components/`)
* **`layout/`**:
  * `header.html`: Atmospheric glow efekti, marka logosu, masaüstü/mobil menü, ⌘K butonu, tema butonu, dil (EN/DE/TR) ve kur ($/€/₺) butonları, "Bilgisayara İndir" ana aksiyonu.
  * `footer.html`: Canlı motor gecikme göstergesi (`#footer-engine-ping`), telif hakları, hızlı bağlantılar ve yerel güvenlik taahhütleri.
* **`sections/`**:
  * `hero.html`: Ana manşet, işletim sistemi indirme butonları (macOS / Windows), interaktif macOS simülasyon penceresi (`#hero-mock-window`).
  * `problem.html`: Gizli abonelik kayıpları, 4.2 dakikalık iptal atlama süresi ve sektör istatistikleri.
  * `calculator.html`: İsraf hesaplama kaydırıcıları, hızlı kullanıcı profilleri ve 1/5 yıllık tasarruf projeksiyonu.
  * `features.html`: 4 çekirdek motor (Denetim, Otomatik Yakalama, Atlama Motoru, Yerel Kasa).
  * `architecture.html`: Yerel AES-256 SQLite kilitli kasa mimarisi ve sıfır-bulut ilkeleri.
  * `os-downloads.html`: macOS (Apple Silicon / Intel), Windows (x64 / ARM64) ve Linux kartları + SHA-256 sağlama toplamları.
  * `pricing.html`: Free, Pro ($9/ay veya $79 ömür boyu), Max ($19/ay veya $149 ömür boyu), Enterprise modelleri.
  * `faq.html`: Sıkça sorulan sorular akordeonu.
* **`modals/`**:
  * `command-palette.html`: ⌘K / Ctrl+K arama paleti, klavye ok tuşları ile gezinim.
  * `download-modal.html`: Mimari seçimi (Apple Silicon vs Intel, Windows x64 vs ARM64), simüle edilen hız ve ilerleme çubuğu, SHA256 göstergesi.
  * `enterprise-modal.html`: Kurumsal teklif formu (Ad, Şirket E-postası, Şirket Adı, doğrulama).
  * `reclaim-modal.html`: CLI indirme komutu kopyalama (`curl -sSL subradar.dev/cli | sh`) ve 3 adımlı kurtarma rehberi.

### 2.4 Web Stilleri (`web/css/`)
* [`base.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/base.css): SF Pro font ailesi, `html.light` ve `html.dark` değişkenleri, skip-link, scroll-behavior, metin seçimi renkleri.
* [`components.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/components.css): `.apple-glass` arka plan bluru, `.apple-card` kalkış ve gölge efektleri, `.apple-range` kaydırıcı başlıkları, modal açılış animasyonları (`@keyframes modalIn`).
* [`main.css`](file:///c:/Users/arday/Desktop/SubRadar/web/css/main.css): `base.css` ve `components.css` modüllerini içe aktarır.

### 2.5 Web Betikleri (`web/js/`)
* [`config.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/config.js): Kurlar (`USD: 1`, `EUR: 0.86`, `TRY: 48.35`), `srCurrency`, `setCurrency(cur)`, `srConvert(usd)`.
* [`theme.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/theme.js): Açık/koyu mod mantığı (`#theme-toggle`, `localStorage: sr-theme`).
* [`fx.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/fx.js): Canlı döviz kurlarını `open.er-api.com` veya `api.frankfurter.app` üzerinden çeker (12 saat TTL önbellek).
* [`toast.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/toast.js): Apple Glass bildirim balonu (`srShowToast(message)`).
* [`calculator.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/calculator.js): Kaydırıcı dinleyicileri, profil butonları (`.calc-preset-btn`), formül hesaplama: `(subs * 32 + trials * 78) * 12`.
* [`hero-window.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/hero-window.js): Hero macOS penceresi mantığı; pencere kapatma/küçültme/büyütme, doğrudan iptal butonları (`.direct-kill-btn`), bellek tüketimi sayacı (`18,4 MB`), simülasyonu sıfırlama (`#hero-demo-reset`), sekmeler (Genel Bakış, Abonelikler, Engelleme Kuralları, Yerel Kasa), canlı gecikme sayacı (3,7 - 4,4 ms).
* [`scroll-motion.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/scroll-motion.js): Tepe ilerleme çizgisi (`#sr-progress`), `[data-rv]` animasyon tetikleyicileri, hero paralaks kayması.
* [`i18n.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/i18n.js): `SR_I18N` (TR -> EN) ve `SR_I18N_DE` (TR -> DE) sözlükleri, DOM TreeWalker ile metin düğümlerini ve `placeholder`/`aria-label` niteliklerini dinamik olarak çeviren `srApplyLang()` ve `t()` fonksiyonları.
* [`main.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/main.js): Tüm modülleri başlatan, para birimi butonlarını bağlayan ve platforma göre kısayol etiketlerini ayarlayan giriş dosyası.
* [`modals/command-palette.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/command-palette.js): Cmd+K / Ctrl+K arama, ok tuşlarıyla gezinme ve eylem tetikleme.
* [`modals/download-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/download-modal.js): İndirme simülasyonu, OS ve işlemci mimarisi seçimi, SHA256 gösterimi.
* [`modals/enterprise-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/enterprise-modal.js): Kurumsal form kontrolü ve başarı ekranı geçişi.
* [`modals/reclaim-modal.js`](file:///c:/Users/arday/Desktop/SubRadar/web/js/modals/reclaim-modal.js): CLI kopyalama ve modal görünürlüğü.
* [`scripts/build.py`](file:///c:/Users/arday/Desktop/SubRadar/web/scripts/build.py): 14 bileşenin varlığını ve dosya boyutlarını test eden Python otomasyonu.

---

## 3. Durum Yönetimi (State) ve Veri Akışı

### 3.1 Dil (i18n) Durumu
* Anahtar: `localStorage.getItem('sr-lang')`
* Değerler: `'tr'` (varsayılan), `'en'`, `'de'`
* Çalışma Mantığı:
  1. `srSwapLang(lang)` çağrılır.
  2. `document.createTreeWalker` ile sayfadaki tüm `NodeFilter.SHOW_TEXT` düğümleri taranır.
  3. İlk okumada orijinal Türkçe metin `node._trRaw` içine saklanır; böylece diller arasında kayıpsız geçiş yapılır.
  4. `t(text)` fonksiyonu, o anki aktif sözlükten karşılığı döndürür.

### 3.2 Para Birimi & Kur Durumu
* Anahtar: `localStorage.getItem('sr-currency')`
* Değerler: `'USD'` (varsayılan), `'EUR'`, `'TRY'`
* Fiyatlandırma: Arayüzdeki para değerleri `[data-usd="..."]` niteliği taşır. Para birimi değiştiğinde `srConvert(usd)` ile dinamik hesaplanır.
* Canlı Kur: `localStorage.getItem('sr-fx')` içinde `{ ts, EUR, TRY }` olarak saklanır. 12 saat boyunca geçerlidir.

### 3.3 Tema Durumu
* Anahtar: `localStorage.getItem('sr-theme')`
* Değerler: `'dark'` (varsayılan) veya `'light'`
* Sınıf: `document.documentElement` (`<html class="light">` veya `<html class="dark">`).

### 3.4 Hero Penceresi Simülasyon Durumu
* `currentMonthlyBurn`: Başlangıç `$384.20`. Her iptalde azaltılır.
* `detectedLeaksCount`: Başlangıç `3`. Her iptalde azaltılır.
* `annualWasteRecoverable`: Başlangıç `$1890.00`.
* İptal edilen satırlar (`.direct-kill-btn`), yeşil rozet alır ve harcama sıfırlanır.
* `#hero-demo-reset` tıklandığında tüm veriler orijinal haline geri döner.

---

## 4. Bileşen ve DOM ID Dizini

| DOM ID / Seçici | Ait Olduğu Bileşen | Görevi |
| :--- | :--- | :--- |
| `#theme-toggle` | `layout/header.html` | Açık/koyu tema değiştirme düğmesi |
| `#theme-toggle-icon` | `layout/header.html` | Tema ikon etiketi (`light_mode` / `dark_mode`) |
| `.lang-btn` | `layout/header.html` | Dil seçim butonları (`data-lang="EN|DE|TR"`) |
| `.currency-btn` | `layout/header.html` | Para birimi butonları (`data-currency="USD|EUR|TRY"`) |
| `#nav-cmd-trigger` | `layout/header.html` | ⌘K paletini açan üst çubuk butonu |
| `#hero-mock-window` | `sections/hero.html` | Simüle edilen masaüstü penceresi |
| `#hero-win-close` | `sections/hero.html` | Kırmızı macOS trafik ışığı (pencereyi gizler) |
| `#hero-win-min` | `sections/hero.html` | Sarı macOS trafik ışığı (içeriği daraltır) |
| `#hero-win-zoom` | `sections/hero.html` | Yeşil macOS trafik ışığı (genişletir: `max-w-7xl`) |
| `#hero-win-restore-bar`| `sections/hero.html` | Kapatılan pencereyi geri getirme çubuğu |
| `#hero-sub-search` | `sections/hero.html` | Hero içi abonelik filtreleme inputu |
| `#hero-monthly-burn`| `sections/hero.html` | Aylık toplam harcama göstergesi |
| `#hero-detected-leaks`| `sections/hero.html` | Kaçak lisans adedi göstergesi |
| `#hero-annual-waste`| `sections/hero.html` | Kurtarılabilir yıllık israf göstergesi |
| `#hero-demo-reset` | `sections/hero.html` | Simülasyonu başlangıç durumuna sıfırlayan buton |
| `#calc-subs` | `sections/calculator.html` | Aktif abonelik kaydırıcısı (Range 2-35) |
| `#calc-trials` | `sections/calculator.html` | Deneme süresi kaydırıcısı (Range 0-15) |
| `.calc-preset-btn` | `sections/calculator.html` | Hazır profil butonları (`data-subs`, `data-trials`) |
| `#out-1yr` | `sections/calculator.html` | 1 yıllık tasarruf çıktısı |
| `#out-5yr` | `sections/calculator.html` | 5 yıllık birikmiş kayıp çıktısı |
| `#reclaim-target-amount`| `sections/calculator.html` | Geri kazanım modalına aktarılan hedef tutar |
| `#cmd-palette-backdrop`| `modals/command-palette.html`| Komut paleti modal arka planı |
| `#cmd-palette-input` | `modals/command-palette.html`| Komut paleti arama kutusu |
| `#download-modal-backdrop`| `modals/download-modal.html`| İndirme modalı arka planı |
| `#dl-progress-bar` | `modals/download-modal.html`| İndirme ilerleme çubuğu |
| `#ent-modal-backdrop`| `modals/enterprise-modal.html`| Kurumsal form modalı |
| `#reclaim-modal-backdrop`| `modals/reclaim-modal.html`| Sermaye geri kazanım & CLI modalı |
| `#cli-copy-btn` | `modals/reclaim-modal.html`| `curl` komutunu kopyalayan buton |
| `#sr-progress` | `scroll-motion.js` | Sayfa üstündeki akıcı okuma ilerleme çizgisi |
| `#sr-toast` | `toast.js` | Dinamik olarak üretilen Apple Glass bildirim balonu |

---

## 5. Tasarım ve Stil Sistemi

* **Renkler:**
  * Koyu Taban: `#000000` (Siyah), `#08080a` (Derin cam), `#09090b` (Kart arka planı), `#0d0d11` (Pencere başlığı).
  * Açık Taban: `#f5f5f7` (macOS açık gri), `#ffffff` (Kartlar), `#1d1d1f` (Koyu gri metin).
  * Aksanlar: `#10b981` (Zümrüt yeşili - Tasarruf ve onay), `#6366f1` (İndigo mor - Vurgu), `#ef4444` (Kırmızı - İptal/Uyarı).
* **Tipografi:** SF Pro Display, SF Pro Text, Apple System Fontları, `tabular-nums` rakam hizalaması.
* **Cam Efekti:**
  ```css
  background: rgba(8, 8, 10, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```

---

## 6. Masaüstü Uygulaması (Roadmap)

`app/` dizini gelecekteki yerel masaüstü istemcisini hedefler:
* **Güvenlik Çekirdeği (`vault.js`):** Node.js `crypto` ile `AES-256-CBC` algoritması.
* **Veritabanı:** Yerel şifrelenmiş dosya (`encrypted_sqlite_aes256.db`).
* **IPC İzolasyonu:** `preload.js` üzerinden `contextIsolation: true` ile çalışan güvenli köprü.
* **Tepsisi (System Tray):** Arka planda sessiz çalışan, yenileme tarihlerinden 48 saat önce uyarı fırlatan hafif daemon.

---

## 7. Geliştirici İpuçları & Sık Yapılan İşlemler

### 7.1 Yerel Test Sunucusu
```bash
python -m http.server 8765
```
Tarayıcıdan `http://localhost:8765/web/code.html` veya `http://localhost:8765/` adresine gidin.

### 7.2 Bileşen Senkronizasyon Kuralı
Canlı yayınlanan sayfa doğrudan `web/code.html`'dir.
Modüler `web/components/` veya `web/js/` içinde bir değişiklik yaptığınızda:
1. `python web/scripts/build.py` çalıştırarak 14 modüler bileşenin bütünlüğünü doğrulayın.
2. `web/code.html` dosyasındaki ilgili bloğu da güncelleyin veya oraya entegre edin.

---
*Bu doküman, Antigravity ve tüm AI modelleri için tek kaynak (single source of truth) olacak şekilde eksiksiz tutulmuştur.*
