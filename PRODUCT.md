# Product — SubRadar v1.0

<!-- impeccable:product-schema 1 -->

## Platform

web & desktop (v1.0)

## Users

* **Bireysel Kullanıcılar & Uzaktan Çalışanlar:** Dijital eğlence ve günlük yazılım servislerine (Netflix, Spotify, Canva, YouTube, Prime) abone olan, ücretsiz deneme sürelerini unutup gereksiz ödeme yapan herkes.
* **Yazılımcılar, Tasarımcılar & Serbest Çalışanlar:** Adobe Creative Cloud, GitHub Copilot, ChatGPT Plus, Figma, Claude gibi profesyonel araçları kullanan ve aylarca açmadığı aboneliklere bütçe ayıran kullanıcılar.
* **Gizliliğine Önem Veren Kullanıcılar:** Banka hesaplarını veya kredi kartı şifrelerini internet üzerindeki üçüncü taraf uygulamalara vermek istemeyen, verilerinin yalnızca kendi bilgisayarında kalmasını isteyen kullanıcılar.

## Product Purpose

SubRadar (v1.0), unutulan abonelikleri, deneme süresi tuzaklarını ve sessiz fiyat artışlarını kolayca fark etmenizi sağlayan; hiçbir banka şifresi veya internet sunucusu gerektirmeden **yalnızca bilgisayarınızda ve çevrimdışı (internetsiz)** çalışan masaüstü ve web abonelik yönetim platformudur.

## Positioning

Geleneksel abonelik takip uygulamaları kullanıcıdan banka giriş bilgisi isteyip finansal verileri bulut sunucularına taşırken; **SubRadar tüm verileri yalnızca kullanıcının kendi bilgisayarında güçlü şifreleme (AES-256) ile korur, hiçbir kullanıcı verisini dışarıya göndermez ve tek tıkla resmi abonelik iptal dilekçesi hazırlar.**

## Operating Context

* **Web Tanıtım Vitrini (`web/`):** İnteraktif uygulama önizlemesi ve abonelik israf hesaplayıcısı sunan web arayüzü.
* **Masaüstü Uygulaması (`app/`):** Doğrudan kullanıcının kendi bilgisayarında çevrimdışı çalışan, şifreli yerel kasaya sahip masaüstü uygulaması (SubRadar v1.0 - Ticari Lisans).

## Capabilities and Constraints

* **Yetkinlikler:**
  - Yalnızca bilgisayarınızda çalışan şifreli veri kasası (AES-256).
  - İnteraktif İsraf Hesaplayıcı (Bireysel, Serbest Çalışan ve Ekip profilleri).
  - "Tek Tıkla İptal" yardımcısı: Servislerin doğrudan abonelik iptal sayfalarına yönlendirme + Tüketici Hakları mevzuatına uygun resmi iptal dilekçesi oluşturucu.
  - Güncel döviz kurları ile para birimi dönüşümü (TRY, USD, EUR, GBP).
  - Modern koyu tema, akıcı pencere kullanımı ve klavye kısayolları (Ctrl+K).
* **Kısıtlar:**
  - Banka şifresi veya kart bilgisi kesinlikle istenmez; tüm veriler güvenliğiniz için yalnızca kendi bilgisayarınızda tutulur.
  - Bulut sunucusu veya kullanıcı takip sistemi bulunmaz.
  - Yazılım, **SubRadar Ticari Yazılım Lisansı v1.0** kapsamında lisanslanmıştır.

## Brand Commitments

* **İsim:** SubRadar (Sürüm v1.0)
* **Slogan:** "Aboneliklerinizi Kolayca Yönetin, Tek Tıkla İptal Edin"
* **Marka Sesi:** Samimi, anlaşılır, güven veren, kullanıcı dostu ve profesyonel ("Aboneliklerinizi siz yönetin, onlar sizi değil.").
* **Görsel Dil:** Modern cam efektli arayüz (Apple Glass), göz yormayan koyu tema (`#07090E`), indigo (`#6366F1`), zümrüt yeşili (`#10B981`) ve gül pembesi (`#F43F5E`) vurgular.

## Evidence on Hand

* **Çalışan Web Vitrini:** [`web/code.html`](web/code.html) (Canlı uygulama önizlemesi ve israf hesaplayıcı).
* **Modüler Bileşenler:** [`web/components/`](web/components/) (Modüler HTML arayüz parçaları).
* **Ekran Görüntüleri:** [`screenshots/`](screenshots/) (Yüksek çözünürlüklü uygulama ekran görüntüleri).

## Product Principles

1. **Tam Gizlilik (Yalnızca Bilgisayarınızda):** Harcama ve abonelik bilgileriniz asla cihazınızdan dışarı çıkmaz.
2. **Şeffaf ve Dürüst Deneyim:** Yanıltıcı bildirimler veya karmaşık ekranlar yerine herkesin rahatça kullanabileceği sade bir tasarım sunulur.
3. **Kolay ve Hızlı İptal:** Kullanıcıyı uğraştırmak yerine tek butonla resmi iptal sayfasına ve hazır iptal dilekçesine ulaştırır.
4. **Yüksek Tasarım Kalitesi:** Okunaklı yazılar, akıcı geçişler ve düzenli ekran yerleşimi ile keyifli bir kullanım sağlar.

## Accessibility & Inclusion

* Yüksek okunabilirlik ve renk kontrastı (WCAG AA/AAA standartlarına uygun).
* Tam klavye desteği (`:focus-visible`, `Ctrl+K` hızlı arama, `Esc` ile kapatma).
* Rahat tıklanabilir buton ve menü boyutları (minimum 44px).
