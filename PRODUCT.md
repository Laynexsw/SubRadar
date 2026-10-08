# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

* **Bireysel Kullanıcılar & Uzaktan Çalışanlar:** Onlarca dijital eğlence ve yazılım servisine (Netflix, Spotify, Canva, YouTube, Prime) abone olan, ücretsiz deneme sürelerini unutup para kaybeden kullanıcılar.
* **Yazılımcılar & Tasarımcılar:** Adobe Creative Cloud, GitHub Copilot, ChatGPT Plus, Figma, Claude, AWS gibi yüksek maliyetli araçları kullanan ve aylarca açmadığı araçlara bütçe ayıran profesyoneller.
* **Gizlilik Odaklı Güç Kullanıcıları (Power Users):** Banka hesaplarını veya kredi kartı şifrelerini üçüncü parti SaaS bulut araçlarına (Plaid vb.) teslim etmek istemeyen kullanıcılar.

## Product Purpose

SubRadar, kullanıcıların abonelik israfını, unutulan deneme tuzaklarını ve gizli fiyat artışlarını tespit eden; hiçbir banka şifresi veya bulut sunucusu gerektirmeden **%100 yerel ve çevrimdışı** çalışan masaüstü ve web abonelik analiz ve tek tıkla iptal platformudur.

## Positioning

Geleneksel abonelik takip uygulamaları kullanıcıdan banka giriş bilgisi talep edip finansal verileri bulut sunucularına satarken; **SubRadar %100 yereldir, tüm verileri kullanıcının kendi bilgisayarında AES-256 ile şifreler, sıfır telemetri kullanır ve tek tıkla yasal fesih dilekçesi üretir.**

## Operating Context

* **Web Tanıtım Vitrini (`web/`):** GitHub Pages üzerinde yayında olan, interaktif macOS pencere simülasyonu ve israf hesaplayıcısı sunan ikna ve dönüşüm yüzü.
* **Masaüstü Uygulaması (`app/`):** Kullanıcının bilgisayarında çalışan, çerçevesiz pencere, sistem tepsisi ve yerel AES-256 kasası barındıran yerel istemci (Electron / Native).

## Capabilities and Constraints

* **Yetkinlikler:**
  - AES-256-CBC yerel şifreli kasa motoru.
  - İnteraktif İsraf Hesaplayıcı (kullanıcı profilleri: Bireysel, Freelancer, Ekip).
  - "Tek Tıkla İptal" sihirbazı: Doğrudan hesap iptal portalı bağlantıları + Tüketici Hakları mevzuatına uygun resmi fesih mektubu üreticisi.
  - Canlı döviz kurları ile para birimi dönüşümü (TRY, USD, EUR, GBP).
  - Apple Glass, Dark Mode, çalışan macOS trafik ışıkları ve kısayollar (Ctrl+K).
* **Kısıtlar:**
  - Banka şifresi veya API entegrasyonu istenmez (gizlilik gereği tüm veriler yerel girilir).
  - Bulut sunucusu ve telemetri bulunmaz.

## Brand Commitments

* **İsim:** SubRadar
* **Slogan:** "Masaüstü Abonelik Zekâsı ve Tek Tıkla İptal"
* **Marka Sesi:** Keskin, güven veren, korumacı, gizlilik takıntılı ve premium ("Aboneliklerinizi siz yönetin, onlar sizi değil.").
* **Görsel Dil:** Apple Glass (Glassmorphism), derin koyu mod (`#07090E`), macOS pencere ergonomisi, neon indigo (`#6366F1`), zümrüt yeşili (`#10B981`) ve gül pembesi (`#F43F5E`) aksanlar.

## Evidence on Hand

* **Çalışan Web Vitrini:** [`web/code.html`](web/code.html) (Canlı simülasyon, trafik ışıkları, hesaplayıcı).
* **Modüler Bileşenler:** [`web/components/`](web/components/) (14 adet modüler HTML parçası).
* **Ekran Görüntüleri:** [`screenshots/`](screenshots/) (5 adet yüksek çözünürlüklü arayüz karesi).

## Product Principles

1. **Mutlak Gizlilik (Zero Knowledge, 100% Local):** Kullanıcının finansal veya abonelik verisi asla cihazından dışarı çıkamaz.
2. **Dürüst Kullanılabilirlik (Honest Craft):** Sahte canlılık (fake pingler) veya manipülatif karanlık tasarımlar (dark patterns) yasaktır.
3. **Anında Eylem (Frictionless Cancellation):** Kullanıcıyı engellemek yerine tek butonla resmi iptale ve yasal fesih metnine ulaştırmak.
4. **Zirve Tasarım Standartları (Out-of-Distribution Craft):** Apple Keynote ve Raycast kalitesinde tipografi, akıcı animasyon ve ferah hiyerarşi.

## Accessibility & Inclusion

* WCAG AA/AAA kontrast oranları (metinlerde en az 4.5:1).
* Klavye erişilebilirliği (`:focus-visible`, `Ctrl+K` arama, `Esc` kapatma).
* Dokunmatik hedefler için minimum 44px ergonomik buton boyutları.
