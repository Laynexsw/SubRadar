---
description: SubRadar Codebase Architecture, File Map, 4 Waves and Development Rules
globs: **/*
alwaysApply: true
---

# 🛡️ SubRadar Codebase Knowledge & Fast-Context Rule

Bu kural, SubRadar deposunda çalışırken **bütün dosyaları tekrar tekrar inceleme zorunluluğunu ortadan kaldırmak** amacıyla projenin tüm yapısını, 4 Geliştirme Dalgasını (Waves 1-4) ve kurallarını hafızada tutar.

## 1. MİMARİ VE KATMANLAR

- **Kök (`/`):**
  - `index.html`: `web/code.html` dosyasına anında yönlendirir.
  - `LICENSE`: SubRadar Resmi Ticari Yazılım Lisansı (Commercial License v1.0).
  - `PRODUCT.md`: Ürün vizyonu, kitleler, Apple Glass tasarım standartları.
  - `tsconfig.json`: TypeScript / React (Originkit TSX) derleyici yapılandırması.
  - `README.md`: Mimari tablo, 4 Geliştirme Dalgası, vitrin bağlantıları, ticari paketler ve kurulum rehberi.
  - `AGENTS.md`: AI ajanları için hızlı proje haritası, 4 dalga özeti ve referans kılavuzu.
  - `CODEBASE.md`: Derinlemesine fonksiyon imzaları, durum modelleri, DOM ID ve mimari hafıza rehberi.
  - `.agents/`: `rules/codebase-context.md` (kurallar), `agents/` (21 kalıcı uzman alt ajan `*/agent.md`) ve `skills/` (14 yerel skill paketi).

- **Masaüstü Uygulaması (`app/` - v1.0 %100 Saf Rust Native GUI):**
  - **İkili & Test Durumu:** `app/subradar.exe` (~3.2 MB tekil yerel binary, sıfır webview/node bloat), **15/15 Saf Rust Birim Testi (%100 başarı, 0 hata, 0 uyarı)**.
  - **4 Geliştirme Dalgası (Completed Waves 1–4):**
    - *Dalga 1:* Bento Grid Kategori & Harcama Analitiği, 3 Katmanlı Tasarım Sistemi Token Mimarisi (`theme.rs`), Raycast Klavye Kısayolları (`Ctrl+K`, `Ctrl+N`, `Ctrl+E`, `Ctrl+T`, `Ctrl+D`, `Space`, `Esc`), Linear Undo Toast bildirim bandı.
    - *Dalga 2:* 37 Popüler Servis Şablonu (6 kategori - `presets.rs`), Yerel Çoklu Banka Ekstre Formatları (Garanti BBVA, İş Bankası, Enpara, Papara, Wise, Revolut - `parser.rs`), Gizli Fiyat Artışı ve Sinsi Yenileme Algılayıcı (`detect_price_hikes`).
    - *Dalga 3:* Resmi THH / TÜBİS (6502 SK) Tüketici Hakem Heyeti Başvuru Dilekçesi, Visa/Mastercard Ters İbraz (Chargeback) Harcama İtirazı Formu, Hizmet Bazlı Karanlık Desen (Dark Pattern) İptal Kılavuzları, Yaklaşan Yenileme & Deneme Radar Kalkanı (`legal.rs`, `presets.rs`).
    - *Dalga 4:* Aile & Ekip Ortak Lisans Maliyet Bölüştürücü (kişi başı pay ve tasarruf hesaplama - `models.rs`), Apple/Google/Outlook Takvim RFC 5545 iCalendar (`.ics`) ihracı (`models.rs`), Çift Yönlü AES-256 Şifreli JSON Yedekleme ve Akıllı Veri Birleştirme (`vault.rs`).
  - **Dosyalar:** `app/Cargo.toml`, `app/Cargo.lock`, `app/README.md`, `app/subradar.exe`, `app/encrypted_sqlite_aes256.subradar` ve `app/src/` (`main.rs`, `theme.rs`, `models.rs`, `presets.rs`, `parser.rs`, `legal.rs`, `vault.rs`, `ui.rs`).

- **Web Vitrini (`web/`):**
  - `code.html`: Canlı üretim sürümü (monolitik, tüm modüller birleştirilmiş, GitHub Pages'ta çalışan ana dosya).
  - `index.html`: `code.html`'e yönlendirir.
  - `assets/cursors/`: Windows 11 Tailless Cursors 32x32 RGBA imleç varlıkları.
  - `vendor/three/`: Yerel Three.js WebGL 3D motoru (`three.min.js`, `three.module.js`).
  - `components/`: 23 adet modüler HTML bileşeni (`layout/`, `sections/` [statement-lab: çoklu banka butonları & sinsi zam rozetleri; features: 4 dalga bento grid #waves-grid & canlı radar], `modals/`, `originkit/`).
  - `css/`: `base.css` (renkler, temalar, tipografi), `components.css` (cam efektleri, kartlar, slider, animasyonlar), `cursors.css` (Windows 11 Tailless imleçleri), `main.css` (birleştirici).
  - `js/`: `config.js`, `supabase.js`, `i18n.js`, `theme.js`, `fx.js`, `toast.js`, `audio-fx.js`, `cursor-glow.js`, `statement-lab.js` (BANK_DATASETS çoklu banka & sinsi fiyat artışı algılayıcı), `hash-verifier.js`, `social-export.js`, `calculator.js` (Aile/Ekip bölüştürücü), `hero-window.js`, `tiles-loader.js`, `vector-wordmark.js`, `scroll-motion.js`, `analytics.js`, `cookie-banner.js`, `mobile-cta.js`, `main.js` ve `modals/` (`download-modal.js`, `command-palette.js`, `enterprise-modal.js`, `reclaim-modal.js`, `shortcuts-modal.js`, `legal-gen.js`, `auth-modal.js`).
  - `scripts/build.py`: 23 bileşenin dosya bütünlüğünü test eden otomasyon betiği.

## 2. GELİŞTİRME PRENSİPLERİ VE ZORUNLU KURALLAR

1. **Çift Yönlü Senkronizasyon:** `web/components/` veya `web/js/` içinde yapılan düzenlemeler, canlıda çalışan `web/code.html` dosyasına da yansıtılmalıdır.
2. **Yerellik ve Gizlilik:** Kodlara kullanıcı takip kütüphanesi, telemetri veya harici veri gönderimi eklenemez.
3. **Erişilebilirlik:** Minimum 44px dokunmatik hedefler, klavye gezintisi (`:focus-visible`, `Esc`, `Enter`, ok tuşları).
4. **Tasarım:** SF Pro font ailesi, Apple Glass (`backdrop-filter: blur(24px)`), zümrüt yeşili (`#10b981`), neon mor/indigo (`#6366f1`) ve koyu arka planlar (`#000000`, `#09090b`).
5. **KOD YAPISI & DOKÜMANTASYON SENKRONİZASYONU (ZORUNLU KURAL):** Kod tabanında yapılan her ekleme, silme veya mimari değişiklikte; git commit ve push işlemlerinden önce MUTLAKA `README.md`, `CODEBASE.md`, `AGENTS.md` ve `.agents/rules/codebase-context.md` dosyalarındaki **Kod Yapısı (Dosya Haritası / Ağacı)**, katman durumları, 4 dalga özellikleri ve açıklamaları anında ve eksiksiz güncellenecektir. Kod ile dokümantasyonun uyuşmaması kabul edilemez.
6. **BAŞ ORKESTRATÖR VE ALT AJAN (SUBAGENT) YÖNETİM KURALI (ZORUNLU — 5 DEPARTMAN / 21 UZMAN ALT AJAN):** Ana yapay zekâ asistanı yalnızca **Baş Orkestratör (Yönetici / Manager)** rolündedir. Kod geliştirme, dosya düzenleme, araştırma, test ve dokümantasyon işlerini doğrudan yapmak yerine aşağıdaki **5 Departman ve 21 Uzman Alt Ajanlık Otonom Mühendislik Organizasyonunu** oluşturup görevlendirerek (`define_subagent` / `invoke_subagent`) yürütür; sonuçları denetler ve kullanıcıya raporlar:
   - **A. Araştırma, Kod Yıkımı (Debloat) & Mimari Denetim Departmanı:**
     1. `deep-code-researcher`
     2. `ponytail-debloater`
     3. `architecture-sync-guardian`
     4. `performance-a11y-auditor`
   - **B. Tasarım, Marka & Görsel Sanatlar Departmanı:**
     5. `ui-ux-glass-designer`
     6. `brand-visual-artist`
     7. `originkit-webgl-specialist`
     8. `audio-haptics-engineer`
   - **C. Web Platformu & FinOps Mühendislik Departmanı:**
     9. `web-ui-engineer`
     10. `hero-simulator-engineer`
     11. `interactive-modals-engineer`
     12. `i18n-finops-specialist`
     13. `supabase-auth-specialist`
   - **D. Masaüstü Çekirdeği, Kriptografi & Hukuk Departmanı:**
     14. `desktop-core-engineer`
     15. `security-crypto-auditor`
     16. `legal-compliance-counsel`
   - **E. DevOps, Git/GitHub, Kalite Kontrol & Dokümantasyon Departmanı:**
     17. `git-ops-specialist`
     18. `github-platform-manager`
     19. `seo-pwa-release-engineer`
     20. `test-automation-runner`
     21. `qa-docs-specialist`
7. **DİNAMİK ALT AJAN BÖLÜNMESİ VE ÇOĞALMA (SUBAGENT SPLITTING) YETKİSİ:**
   Kullanıcının doğrudan onayı ve talimatıyla; kod geliştirme, derin hata ayıklama ve mimari refactoring işlerinde ana geliştirici alt ajanlar ikili veya üçlü uzman hücrelere dinamik olarak bölünebilir (`subagent-driven-development`, `dispatching-parallel-agents`). Bu yetki paylaşımsız görevleri hızlandırırken tekil sorumluluk ilkesini korur.

## 3. GİT & GİTHUB YAPILANDIRMASI

- **Depo Sahibi:** `Laynexsw` | **Depo:** `SubRadar`
- **Uzak Sunucu (Remote):** `origin` -> `https://github.com/Laynexsw/SubRadar.git`
- **Ana Dal:** `main`
- **Canlı Yayın (Pages):** `https://laynexsw.github.io/SubRadar/` (`main` kök `/` -> `index.html` -> `web/code.html`)
- **GitHub CLI:** `gh` yetkili kullanıcı `Laynexsw`.
- **PowerShell Notu:** Komut zincirlerken `&&` yerine `;` kullanın (`git add . ; git commit -m "..." ; git push origin main`).
