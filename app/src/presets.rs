//! SubRadar v1.0 — 36+ Popüler Abonelik Şablonu ve Doğrudan İptal Bağlantıları (`presets.rs`)

use crate::models::{BillingCycle, Currency, SubStatus, Subscription};

#[derive(Debug, Clone)]
pub struct ServicePreset {
    pub id: &'static str,
    pub name: &'static str,
    pub plan: &'static str,
    pub category: &'static str,
    pub default_price: f64,     // TRY
    pub default_price_usd: f64, // USD
    pub currency: Currency,
    pub cancel_url: &'static str,
    pub keywords: &'static [&'static str],
}

impl ServicePreset {
    pub fn to_subscription(&self, index_seed: usize) -> Subscription {
        Subscription {
            id: format!("sub-{}-{}", self.id, index_seed),
            name: self.name.to_string(),
            plan: self.plan.to_string(),
            category: self.category.to_string(),
            price: self.default_price,
            previous_price: None,
            price_hike_detected: false,
            price_hike_percentage: None,
            currency: self.currency,
            billing_cycle: BillingCycle::Monthly,
            next_renewal: "2026-11-28".to_string(),
            status: SubStatus::Active,
            cancel_url: self.cancel_url.to_string(),
            notes: "Hazır şablondan hızlıca eklendi.".to_string(),
            is_shared: false,
            shared_member_count: 1,
            shared_members: String::new(),
            my_share_percentage: 100.0,
        }
    }
}

pub const SERVICE_PRESETS: &[ServicePreset] = &[
    // --- 1. YAPAY ZEKÂ (5) ---
    ServicePreset {
        id: "chatgpt-plus",
        name: "ChatGPT Plus",
        plan: "Plus Üyelik",
        category: "Yapay Zekâ",
        default_price: 967.00,
        default_price_usd: 20.00,
        currency: Currency::TRY,
        cancel_url: "https://chat.openai.com/#settings",
        keywords: &["openai", "chatgpt"],
    },
    ServicePreset {
        id: "claude-pro",
        name: "Claude Pro",
        plan: "Pro Üyelik",
        category: "Yapay Zekâ",
        default_price: 967.00,
        default_price_usd: 20.00,
        currency: Currency::TRY,
        cancel_url: "https://claude.ai/settings/billing",
        keywords: &["claude", "anthropic"],
    },
    ServicePreset {
        id: "cursor-pro",
        name: "Cursor Pro",
        plan: "Pro Geliştirici",
        category: "Yapay Zekâ",
        default_price: 967.00,
        default_price_usd: 20.00,
        currency: Currency::TRY,
        cancel_url: "https://www.cursor.com/settings",
        keywords: &["cursor", "cursor.com", "cursor ai", "anysphere"],
    },
    ServicePreset {
        id: "midjourney",
        name: "Midjourney",
        plan: "Temel Plan",
        category: "Yapay Zekâ",
        default_price: 483.50,
        default_price_usd: 10.00,
        currency: Currency::TRY,
        cancel_url: "https://www.midjourney.com/account",
        keywords: &["midjourney"],
    },
    ServicePreset {
        id: "perplexity-pro",
        name: "Perplexity Pro",
        plan: "Pro Arama",
        category: "Yapay Zekâ",
        default_price: 967.00,
        default_price_usd: 20.00,
        currency: Currency::TRY,
        cancel_url: "https://www.perplexity.ai/settings",
        keywords: &["perplexity"],
    },

    // --- 2. MEDYA & MÜZİK (11) ---
    ServicePreset {
        id: "spotify",
        name: "Spotify Premium",
        plan: "Bireysel Paket",
        category: "Medya & Müzik",
        default_price: 99.99,
        default_price_usd: 4.99,
        currency: Currency::TRY,
        cancel_url: "https://www.spotify.com/account/subscription/change/",
        keywords: &["spotify"],
    },
    ServicePreset {
        id: "netflix",
        name: "Netflix",
        plan: "Standart Paket",
        category: "Medya & Müzik",
        default_price: 299.99,
        default_price_usd: 7.99,
        currency: Currency::TRY,
        cancel_url: "https://www.netflix.com/cancelplan",
        keywords: &["netflix"],
    },
    ServicePreset {
        id: "youtube-premium",
        name: "YouTube Premium",
        plan: "Bireysel Üyelik",
        category: "Medya & Müzik",
        default_price: 115.99,
        default_price_usd: 4.99,
        currency: Currency::TRY,
        cancel_url: "https://www.youtube.com/paid_memberships",
        keywords: &["youtube", "google *youtube"],
    },
    ServicePreset {
        id: "apple-music",
        name: "Apple Music",
        plan: "Bireysel Üyelik",
        category: "Medya & Müzik",
        default_price: 79.99,
        default_price_usd: 3.99,
        currency: Currency::TRY,
        cancel_url: "https://reportaproblem.apple.com/",
        keywords: &["apple music", "itunes"],
    },
    ServicePreset {
        id: "disney-plus",
        name: "Disney+",
        plan: "Standart Üyelik",
        category: "Medya & Müzik",
        default_price: 164.99,
        default_price_usd: 6.99,
        currency: Currency::TRY,
        cancel_url: "https://www.disneyplus.com/account",
        keywords: &["disney+", "disney plus"],
    },
    ServicePreset {
        id: "amazon-prime",
        name: "Amazon Prime",
        plan: "Aylık Prime",
        category: "Medya & Müzik",
        default_price: 49.90,
        default_price_usd: 2.99,
        currency: Currency::TRY,
        cancel_url: "https://www.amazon.com.tr/mc/manage",
        keywords: &["amazon prime", "prime video"],
    },
    ServicePreset {
        id: "deezer",
        name: "Deezer Premium",
        plan: "Premium Müzik",
        category: "Medya & Müzik",
        default_price: 89.99,
        default_price_usd: 4.99,
        currency: Currency::TRY,
        cancel_url: "https://www.deezer.com/account",
        keywords: &["deezer"],
    },
    ServicePreset {
        id: "tidal",
        name: "Tidal HiFi",
        plan: "HiFi Ses Paketi",
        category: "Medya & Müzik",
        default_price: 129.99,
        default_price_usd: 5.99,
        currency: Currency::TRY,
        cancel_url: "https://my.tidal.com/",
        keywords: &["tidal"],
    },
    ServicePreset {
        id: "blutv-max",
        name: "BluTV / Max",
        plan: "Aylık Paket",
        category: "Medya & Müzik",
        default_price: 199.90,
        default_price_usd: 5.99,
        currency: Currency::TRY,
        cancel_url: "https://www.blutv.com/hesabim",
        keywords: &["blutv", "max.com"],
    },
    ServicePreset {
        id: "exxen",
        name: "Exxen",
        plan: "Reklamsız Paket",
        category: "Medya & Müzik",
        default_price: 219.00,
        default_price_usd: 6.99,
        currency: Currency::TRY,
        cancel_url: "https://www.exxen.com/tr/settings",
        keywords: &["exxen"],
    },
    ServicePreset {
        id: "tod-tv",
        name: "TOD (beIN)",
        plan: "Süper Lig & Eğlence",
        category: "Medya & Müzik",
        default_price: 349.00,
        default_price_usd: 9.99,
        currency: Currency::TRY,
        cancel_url: "https://www.todtv.com.tr/profilim",
        keywords: &["todtv", "tod ", "bein"],
    },

    // --- 3. BULUT & DEPOLAMA (5) ---
    ServicePreset {
        id: "icloud-plus",
        name: "Apple iCloud+",
        plan: "200 GB Depolama",
        category: "Bulut & Depolama",
        default_price: 129.99,
        default_price_usd: 3.99,
        currency: Currency::TRY,
        cancel_url: "https://reportaproblem.apple.com/",
        keywords: &["apple.com/bill", "icloud"],
    },
    ServicePreset {
        id: "google-one",
        name: "Google One",
        plan: "100 GB Depolama",
        category: "Bulut & Depolama",
        default_price: 79.99,
        default_price_usd: 2.99,
        currency: Currency::TRY,
        cancel_url: "https://one.google.com/settings",
        keywords: &["google one", "google *storage"],
    },
    ServicePreset {
        id: "dropbox",
        name: "Dropbox Plus",
        plan: "2 TB Bulut Alanı",
        category: "Bulut & Depolama",
        default_price: 483.50,
        default_price_usd: 9.99,
        currency: Currency::TRY,
        cancel_url: "https://www.dropbox.com/account/plan",
        keywords: &["dropbox"],
    },
    ServicePreset {
        id: "microsoft-365",
        name: "Microsoft 365",
        plan: "Bireysel / Aile",
        category: "Bulut & Depolama",
        default_price: 259.99,
        default_price_usd: 6.99,
        currency: Currency::TRY,
        cancel_url: "https://account.microsoft.com/services",
        keywords: &["microsoft 365", "office 365", "msft *"],
    },
    ServicePreset {
        id: "proton-mail",
        name: "ProtonMail",
        plan: "Mail Plus & VPN",
        category: "Bulut & Depolama",
        default_price: 240.00,
        default_price_usd: 4.99,
        currency: Currency::TRY,
        cancel_url: "https://account.proton.me/u/0/mail",
        keywords: &["protonmail", "proton ag"],
    },

    // --- 4. GELİŞTİRİCİ & ÜRETKENLİK (7) ---
    ServicePreset {
        id: "adobe-cc",
        name: "Adobe Creative Cloud",
        plan: "Tüm Uygulamalar",
        category: "Yazılım & Araçlar",
        default_price: 2966.52,
        default_price_usd: 59.99,
        currency: Currency::TRY,
        cancel_url: "https://account.adobe.com/plans",
        keywords: &["adobe", "creative cld", "photoshop"],
    },
    ServicePreset {
        id: "jetbrains",
        name: "JetBrains Toolbox",
        plan: "Geliştirici Paketi",
        category: "Yazılım & Araçlar",
        default_price: 1397.00,
        default_price_usd: 28.90,
        currency: Currency::TRY,
        cancel_url: "https://account.jetbrains.com/licenses",
        keywords: &["jetbrains"],
    },
    ServicePreset {
        id: "github-copilot",
        name: "GitHub Copilot",
        plan: "Bireysel Paket",
        category: "Yazılım & Araçlar",
        default_price: 483.50,
        default_price_usd: 10.00,
        currency: Currency::TRY,
        cancel_url: "https://github.com/settings/billing",
        keywords: &["github", "copilot"],
    },
    ServicePreset {
        id: "figma-pro",
        name: "Figma Professional",
        plan: "Profesyonel Ekip",
        category: "Yazılım & Araçlar",
        default_price: 725.00,
        default_price_usd: 15.00,
        currency: Currency::TRY,
        cancel_url: "https://www.figma.com/settings",
        keywords: &["figma"],
    },
    ServicePreset {
        id: "canva-pro",
        name: "Canva Pro",
        plan: "Pro Tasarım Paketi",
        category: "Yazılım & Araçlar",
        default_price: 349.99,
        default_price_usd: 12.99,
        currency: Currency::TRY,
        cancel_url: "https://www.canva.com/settings/billing-and-teams",
        keywords: &["canva"],
    },
    ServicePreset {
        id: "notion-plus",
        name: "Notion Plus",
        plan: "Plus Paket",
        category: "Yazılım & Araçlar",
        default_price: 483.50,
        default_price_usd: 10.00,
        currency: Currency::TRY,
        cancel_url: "https://www.notion.so/settings",
        keywords: &["notion"],
    },
    ServicePreset {
        id: "zoom-pro",
        name: "Zoom Pro",
        plan: "Pro Toplantı Paketi",
        category: "Yazılım & Araçlar",
        default_price: 749.00,
        default_price_usd: 15.99,
        currency: Currency::TRY,
        cancel_url: "https://zoom.us/billing",
        keywords: &["zoom.us", "zoom video"],
    },

    // --- 5. GÜVENLİK & ARAÇLAR (4) ---
    ServicePreset {
        id: "1password",
        name: "1Password",
        plan: "Bireysel Kasa",
        category: "Yazılım & Araçlar",
        default_price: 145.00,
        default_price_usd: 2.99,
        currency: Currency::TRY,
        cancel_url: "https://my.1password.com/",
        keywords: &["1password", "agilebits"],
    },
    ServicePreset {
        id: "bitwarden",
        name: "Bitwarden",
        plan: "Premium Şifre Yöneticisi",
        category: "Yazılım & Araçlar",
        default_price: 40.00,
        default_price_usd: 0.83,
        currency: Currency::TRY,
        cancel_url: "https://vault.bitwarden.com/#/settings",
        keywords: &["bitwarden"],
    },
    ServicePreset {
        id: "nordvpn",
        name: "NordVPN",
        plan: "Standart Güvenlik",
        category: "Yazılım & Araçlar",
        default_price: 195.00,
        default_price_usd: 3.99,
        currency: Currency::TRY,
        cancel_url: "https://my.nordaccount.com/",
        keywords: &["nordvpn", "nordsecurity"],
    },
    ServicePreset {
        id: "surfshark",
        name: "Surfshark",
        plan: "Sınırsız Cihaz VPN",
        category: "Yazılım & Araçlar",
        default_price: 145.00,
        default_price_usd: 2.99,
        currency: Currency::TRY,
        cancel_url: "https://my.surfshark.com/",
        keywords: &["surfshark"],
    },

    // --- 6. OYUN & YAŞAM (5) ---
    ServicePreset {
        id: "xbox-game-pass",
        name: "Xbox Game Pass",
        plan: "PC / Ultimate",
        category: "Yaşam & Oyun",
        default_price: 309.00,
        default_price_usd: 9.99,
        currency: Currency::TRY,
        cancel_url: "https://account.microsoft.com/services",
        keywords: &["xbox", "game pass"],
    },
    ServicePreset {
        id: "playstation-plus",
        name: "PlayStation Plus",
        plan: "Extra / Deluxe",
        category: "Yaşam & Oyun",
        default_price: 405.00,
        default_price_usd: 12.99,
        currency: Currency::TRY,
        cancel_url: "https://store.playstation.com/",
        keywords: &["playstation", "sony ent"],
    },
    ServicePreset {
        id: "duolingo-super",
        name: "Duolingo Super",
        plan: "Super Dil Eğitimi",
        category: "Yaşam & Oyun",
        default_price: 330.00,
        default_price_usd: 6.99,
        currency: Currency::TRY,
        cancel_url: "https://www.duolingo.com/settings/super",
        keywords: &["duolingo"],
    },
    ServicePreset {
        id: "strava",
        name: "Strava Summit",
        plan: "Spor & Koşu Takibi",
        category: "Yaşam & Oyun",
        default_price: 380.00,
        default_price_usd: 7.99,
        currency: Currency::TRY,
        cancel_url: "https://www.strava.com/settings/subscription",
        keywords: &["strava"],
    },
    ServicePreset {
        id: "headspace",
        name: "Headspace",
        plan: "Meditasyon & Uyku",
        category: "Yaşam & Oyun",
        default_price: 620.00,
        default_price_usd: 12.99,
        currency: Currency::TRY,
        cancel_url: "https://www.headspace.com/settings",
        keywords: &["headspace"],
    },
];

/// Popüler ve zor iptal edilen servisler için adım adım karanlık desenleri (Dark Pattern) aşma kılavuzu.
pub fn get_dark_pattern_guide(service_name: &str) -> Option<&'static str> {
    let lower = service_name.to_lowercase();
    if lower.contains("adobe") || lower.contains("photoshop") || lower.contains("creative cld") {
        Some(
            "🎯 ADOBE ERKEN FESİH CEZASINI (%50) ATLATMA HİLESİ:\n\
            1. Adobe Hesap Yönetimi panelinde 'Planı Yönet' -> 'Planı Değiştir' (Change Plan) seçeneğine tıklayın.\n\
            2. Mevcut pahalı paketinizi en ucuz tekil plana (örn. InCopy veya Fotoğraf Paketi) geçirin.\n\
            3. Yeni plana geçiş yaptığınız anda yasal 14 günlük cayma hakkınız sıfırdan başlar.\n\
            4. Plan değişikliğini onayladıktan hemen sonra aynı gün içinde 'Aboneliği İptal Et' butonuna basın.\n\
            5. Sistem 14 günlük yasal cayma süresi içinde olduğunuzu görecek ve sıfır fesih bedeli ile tam iade yapacaktır."
        )
    } else if lower.contains("amazon") || lower.contains("prime") || lower.contains("audible") {
        Some(
            "🎯 AMAZON & AUDIBLE ÇOK KATMANLI İPTAL TUZAĞI (ROACH MOTEL):\n\
            1. Amazon/Audible iptal işlemini tamamlamadan önce size 4 ayrı caydırma ve pazarlık ekranı çıkarır.\n\
            2. Her ekranda parlak renkli 'Üyeliğimi Koru' butonlarını atlayıp en alttaki sönük 'İptal İşlemine Devam Et' bağlantısına tıklayın.\n\
            3. Audible aboneliğiniz varsa: İptal etmeden önce birikmiş tüm dinleme kredilerinizi sesli kitap satın alarak bitirin; aksi takdirde birikmiş kredileriniz silinir!\n\
            4. Son ekranda 'Üyeliğimi Şimdi Sonlandır' butonuna basarak e-posta onayını alın."
        )
    } else if lower.contains("gym") || lower.contains("spor") || lower.contains("fitness") || lower.contains("macfit") {
        Some(
            "🎯 SPOR SALONU & KULÜP TAAHHÜT TUZAĞINI AŞMA (6502 SK m. 52/4):\n\
            1. 6502 sayılı Tüketicinin Korunması Kanunu m. 52/4 gereği 1 yıldan uzun veya belirsiz süreli spor salonu sözleşmelerini dilediğiniz an cezasız feshedebilirsiniz.\n\
            2. 'Sözleşmede cayma bedeli var' iddiaları Tüketici Kanunu'na açıkça aykırıdır ve geçersizdir.\n\
            3. SubRadar'ın 'Resmi İptal & Fesih Dilekçesi' veya 'THH Başvuru Metni'ni salon yönetimine yazılı/e-posta ile sunun.\n\
            4. Kartınızdan izinsiz çekim yapmaya devam ederlerse bankanıza SubRadar'ın Harcama İtirazı (Chargeback) dosyasını iletin."
        )
    } else if lower.contains("linkedin") {
        Some(
            "🎯 LINKEDIN PREMIUM OTOMATİK YENİLEME TUZAĞI:\n\
            1. Profil simgesi -> 'Ayarlar ve Gizlilik' -> 'Abonelik ve Ödemeler' menüsüne gidin.\n\
            2. 'Premium Aboneliği Yönet' -> 'Aboneliği İptal Et' seçeneğini tıklayın.\n\
            3. LinkedIn size 2 ay boyunca indirimli devam etme teklifi sunacaktır; tasarruf etmek istemiyorsanız 'İptale Devam Et'i seçin.\n\
            4. Onay ekranında 'Ücretsiz deneme sonunda otomatik yenilemeyi kapat' seçeneğinin teyidini alın."
        )
    } else if lower.contains("apple") || lower.contains("icloud") || lower.contains("itunes") {
        Some(
            "🎯 APPLE ICLOUD & UYGULAMA İPTALİ:\n\
            1. Doğrudan 'reportaproblem.apple.com' adresine gidin ve Apple ID ile giriş yapın.\n\
            2. İptal etmek veya para iadesi istemek istediğiniz aboneliğin yanındaki 'Bildir' (Report) butonuna tıklayın.\n\
            3. 'Para iadesi talep et' -> 'Aboneliğimi yenilemek istemiyordum' seçeneğini işaretleyin.\n\
            4. Apple genellikle 48 saat içinde bedeli kayıtlı kartınıza iade eder."
        )
    } else if lower.contains("jetbrains") || lower.contains("github") || lower.contains("cursor") {
        Some(
            "🎯 GELİŞTİRİCİ LİSANSLARI & GİZLİ YENİLEME KORUMASI:\n\
            1. JetBrains / GitHub fatura panelinde 'Cancel Subscription' veya 'Turn off auto-renewal' seçeneğini seçin.\n\
            2. Mevcut dönemin sonuna kadar lisansınız aktif kalır ve yedekleme (fallback) lisansı hakkınız korunur.\n\
            3. İptal sonrası hesapta kayıtlı sanal kart numarasını silerek gelecekteki olası çekimleri engelleyin."
        )
    } else {
        Some(
            "🎯 GENEL ABONELİK İPTAL & TUZAK AŞMA KILAVUZU:\n\
            1. Hizmetin hesap/fatura ayarlarından doğrudan resmi iptal bağlantısına gidin.\n\
            2. Size sunulacak 'İndirimli kal', 'Planı dondur' gibi oyalama ekranlarını geçerek 'Kesin İptal' seçeneğini işaretleyin.\n\
            3. İptal teyit e-postasını mutlaka saklayın.\n\
            4. Sağlayıcı iptal butonu sunmuyorsa veya zorlaştırıyorsa SubRadar'ın '6502 SK Resmi Fesih İhtarnamesi'ni iletin."
        )
    }
}
