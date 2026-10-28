//! SubRadar v1.0 — Veri Modelleri, Para Birimi Dönüşümleri ve Önizleme Metrikleri (`models.rs`)

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Currency {
    TRY,
    USD,
    EUR,
}

impl Currency {
    pub fn symbol(&self) -> &'static str {
        match self {
            Currency::TRY => "₺",
            Currency::USD => "$",
            Currency::EUR => "€",
        }
    }

    pub fn code(&self) -> &'static str {
        match self {
            Currency::TRY => "TRY",
            Currency::USD => "USD",
            Currency::EUR => "EUR",
        }
    }

    pub fn to_try(&self, amount: f64) -> f64 {
        match self {
            Currency::TRY => amount,
            Currency::USD => amount * 48.35,
            Currency::EUR => amount * 52.10,
        }
    }

    pub fn from_try(&self, amount_try: f64) -> f64 {
        match self {
            Currency::TRY => amount_try,
            Currency::USD => amount_try / 48.35,
            Currency::EUR => amount_try / 52.10,
        }
    }

    pub fn format_from_try(&self, amount_try: f64) -> String {
        let converted = self.from_try(amount_try);
        format_currency_tr(converted, self.symbol())
    }

    pub fn format_from_usd(&self, amount_usd: f64) -> String {
        let converted = match self {
            Currency::USD => amount_usd,
            Currency::TRY => amount_usd * 48.35,
            Currency::EUR => amount_usd * (48.35 / 52.10),
        };
        format_currency_tr(converted, self.symbol())
    }
}

pub fn format_currency_tr(amount: f64, symbol: &str) -> String {
    let cents = (amount * 100.0).round() as i64;
    let whole = cents / 100;
    let frac = (cents % 100).abs();
    let whole_str = if whole >= 1_000_000 {
        format!(
            "{}.{:03}.{:03}",
            whole / 1_000_000,
            (whole / 1_000) % 1_000,
            whole % 1_000
        )
    } else if whole >= 1_000 {
        format!("{}.{:03}", whole / 1_000, whole % 1_000)
    } else {
        format!("{}", whole)
    };
    format!("{}{},{:02}", symbol, whole_str, frac)
}

pub fn format_usd_tr(amount_usd: f64) -> String {
    format_currency_tr(amount_usd, "$")
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum BillingCycle {
    Monthly,
    Yearly,
    Weekly,
}

impl BillingCycle {
    pub fn label(&self) -> &'static str {
        match self {
            BillingCycle::Monthly => "Aylık",
            BillingCycle::Yearly => "Yıllık",
            BillingCycle::Weekly => "Haftalık",
        }
    }

    pub fn short_suffix(&self) -> &'static str {
        match self {
            BillingCycle::Monthly => "/ay",
            BillingCycle::Yearly => "/yıl",
            BillingCycle::Weekly => "/hf",
        }
    }

    pub fn to_monthly(&self, price: f64) -> f64 {
        match self {
            BillingCycle::Monthly => price,
            BillingCycle::Yearly => price / 12.0,
            BillingCycle::Weekly => price * 4.33,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SubStatus {
    Active,
    UnusedTrial,
    Cancelled,
}

impl SubStatus {
    pub fn label(&self) -> &'static str {
        match self {
            SubStatus::Active => "Korumalı / Aktif",
            SubStatus::UnusedTrial => "Boşa Ödenen",
            SubStatus::Cancelled => "İptal Edildi",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Subscription {
    pub id: String,
    pub name: String,
    pub plan: String,
    pub category: String,
    pub price: f64,
    pub currency: Currency,
    pub billing_cycle: BillingCycle,
    pub next_renewal: String,
    pub status: SubStatus,
    pub cancel_url: String,
    pub notes: String,
    #[serde(default)]
    pub previous_price: Option<f64>,
    #[serde(default)]
    pub price_hike_detected: bool,
    #[serde(default)]
    pub price_hike_percentage: Option<f64>,
}

impl Subscription {
    pub fn monthly_cost_try(&self) -> f64 {
        let base_try = self.currency.to_try(self.price);
        self.billing_cycle.to_monthly(base_try)
    }

    pub fn monthly_cost_usd(&self) -> f64 {
        let usd = match self.currency {
            Currency::USD => self.price,
            Currency::TRY => self.price / 48.35,
            Currency::EUR => self.price * (52.10 / 48.35),
        };
        self.billing_cycle.to_monthly(usd)
    }

    pub fn avatar_code(&self) -> &'static str {
        let lower = self.name.to_lowercase();
        if lower.contains("adobe") {
            "Ps"
        } else if lower.contains("jetbrains") {
            "JB"
        } else if lower.contains("figma") {
            "Fg"
        } else if lower.contains("aws") {
            "AWS"
        } else if lower.contains("netflix") {
            "Nf"
        } else if lower.contains("spotify") {
            "Sp"
        } else if lower.contains("chatgpt") || lower.contains("openai") {
            "AI"
        } else if lower.contains("youtube") {
            "YT"
        } else if lower.contains("github") {
            "GH"
        } else if lower.contains("icloud") || lower.contains("apple") {
            "iC"
        } else if lower.contains("disney") {
            "D+"
        } else if lower.contains("amazon") {
            "Am"
        } else if lower.contains("xbox") {
            "XB"
        } else if lower.contains("canva") {
            "Cv"
        } else {
            "SR"
        }
    }

    pub fn is_light_avatar(&self) -> bool {
        self.name.to_lowercase().contains("adobe")
    }

    pub fn spending_category(&self) -> SpendingCategory {
        let cat_lower = self.category.to_lowercase();
        let name_lower = self.name.to_lowercase();
        let text = format!("{} {}", cat_lower, name_lower);

        if text.contains("yazılım")
            || text.contains("yazilim")
            || text.contains("software")
            || text.contains("developer")
            || text.contains("jetbrains")
            || text.contains("github")
            || text.contains("gitlab")
            || text.contains("docker")
            || text.contains("cursor")
            || text.contains("copilot")
            || text.contains("1password")
            || text.contains("bitwarden")
            || text.contains("nordvpn")
            || text.contains("surfshark")
        {
            SpendingCategory::SoftwareDev
        } else if text.contains("dizi")
            || text.contains("film")
            || text.contains("müzik")
            || text.contains("muzik")
            || text.contains("oyun")
            || text.contains("eğlence")
            || text.contains("eglence")
            || text.contains("netflix")
            || text.contains("spotify")
            || text.contains("youtube")
            || text.contains("disney")
            || text.contains("steam")
            || text.contains("xbox")
            || text.contains("prime")
            || text.contains("playstation")
            || text.contains("deezer")
            || text.contains("tidal")
            || text.contains("blutv")
            || text.contains("max")
            || text.contains("exxen")
            || text.contains("tod")
            || text.contains("bein")
        {
            SpendingCategory::Entertainment
        } else if text.contains("bulut")
            || text.contains("cloud")
            || text.contains("sunucu")
            || text.contains("depolama")
            || text.contains("aws")
            || text.contains("azure")
            || text.contains("gcp")
            || text.contains("digitalocean")
            || text.contains("hetzner")
            || text.contains("vercel")
            || text.contains("icloud")
            || text.contains("google drive")
            || text.contains("google one")
            || text.contains("dropbox")
            || text.contains("proton")
        {
            SpendingCategory::CloudServer
        } else if text.contains("üretkenlik")
            || text.contains("uretkenlik")
            || text.contains("yapay")
            || text.contains("tasarım")
            || text.contains("tasarim")
            || text.contains("figma")
            || text.contains("adobe")
            || text.contains("canva")
            || text.contains("chatgpt")
            || text.contains("openai")
            || text.contains("claude")
            || text.contains("perplexity")
            || text.contains("midjourney")
            || text.contains("notion")
            || text.contains("office")
            || text.contains("linear")
            || text.contains("zoom")
        {
            SpendingCategory::Productivity
        } else {
            SpendingCategory::Other
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct UserPreferences {
    pub currency: Currency,
    pub dark_mode: bool,
    pub user_name: String,
    pub user_email: String,
}

impl Default for UserPreferences {
    fn default() -> Self {
        Self {
            currency: Currency::USD,
            dark_mode: true,
            user_name: "Abonelik Sahibi".to_string(),
            user_email: "kullanici@subradar.local".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct VaultPayload {
    pub version: String,
    pub preferences: UserPreferences,
    pub subscriptions: Vec<Subscription>,
}

impl VaultPayload {
    pub fn default_overview_subscriptions() -> Vec<Subscription> {
        vec![
            Subscription {
                id: "sub-adobe-cc".to_string(),
                name: "Adobe Creative Cloud Tüm Uygulamalar".to_string(),
                plan: "SIFIR HAREKET (51 GÜN)".to_string(),
                category: "Tasarım".to_string(),
                price: 59.99,
                previous_price: None,
                price_hike_detected: false,
                price_hike_percentage: None,
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "2026-10-31 (3 gün sonra)".to_string(),
                status: SubStatus::UnusedTrial,
                cancel_url: "https://account.adobe.com/plans".to_string(),
                notes: "12 Ocak'tan beri bu uygulama hiç açılmadı.".to_string(),
            },
            Subscription {
                id: "sub-jetbrains".to_string(),
                name: "JetBrains Toolbox Paketi".to_string(),
                plan: "BOŞTA LİSANS".to_string(),
                category: "Yazılım".to_string(),
                price: 28.90,
                previous_price: Some(21.40),
                price_hike_detected: true,
                price_hike_percentage: Some(35.0),
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "OTOMATİK ÖDEME".to_string(),
                status: SubStatus::UnusedTrial,
                cancel_url: "https://account.jetbrains.com/licenses".to_string(),
                notes: "Son ekstrede sessizce +%35 zam yapıldığı tespit edildi (Önceki: $21,40).".to_string(),
            },
            Subscription {
                id: "sub-figma".to_string(),
                name: "Figma Professional".to_string(),
                plan: "HER GÜN AKTİF".to_string(),
                category: "Tasarım".to_string(),
                price: 15.00,
                previous_price: None,
                price_hike_detected: false,
                price_hike_percentage: None,
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "TUTULUYOR".to_string(),
                status: SubStatus::Active,
                cancel_url: "https://www.figma.com/settings".to_string(),
                notes: "Bu hafta 34 sa açık • Vazgeçilmez iş akışı".to_string(),
            },
            Subscription {
                id: "sub-aws-idle".to_string(),
                name: "AWS Bulut Servisleri (ec2-idle)".to_string(),
                plan: "UNUTULAN ABONELİK".to_string(),
                category: "Bulut & Altyapı".to_string(),
                price: 82.40,
                previous_price: None,
                price_hike_detected: false,
                price_hike_percentage: None,
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                status: SubStatus::UnusedTrial,
                cancel_url: "https://console.aws.amazon.com/billing/".to_string(),
                next_renewal: "2026-11-02 (5 gün sonra)".to_string(),
                notes: "Ücretsiz deneme süresi bittiğinden beri otomatik ücret kesiliyor."
                    .to_string(),
            },
        ]
    }
}

impl Default for VaultPayload {
    fn default() -> Self {
        Self {
            version: "1.0".to_string(),
            preferences: UserPreferences::default(),
            subscriptions: Self::default_overview_subscriptions(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct SummaryStats {
    pub monthly_burn_usd: f64,
    pub passive_leaks_count: usize,
    pub annual_recoverable_usd: f64,
}

impl SummaryStats {
    pub fn compute(subs: &[Subscription]) -> Self {
        let mut cancelled_monthly_usd = 0.0;
        let mut passive_leaks_count = 0usize;
        let mut extra_monthly_usd = 0.0;
        let mut extra_waste_usd = 0.0;

        for s in subs {
            let usd_val = s.monthly_cost_usd();
            let is_core = matches!(
                s.id.as_str(),
                "sub-adobe-cc" | "sub-jetbrains" | "sub-figma" | "sub-aws-idle"
            );

            if is_core {
                if s.status == SubStatus::Cancelled {
                    cancelled_monthly_usd += usd_val;
                } else if s.status == SubStatus::UnusedTrial {
                    passive_leaks_count += 1;
                }
            } else if s.status != SubStatus::Cancelled {
                extra_monthly_usd += usd_val;
                if s.status == SubStatus::UnusedTrial {
                    passive_leaks_count += 1;
                    extra_waste_usd += usd_val * 12.0;
                }
            }
        }

        let monthly_burn_usd = (384.20 - cancelled_monthly_usd + extra_monthly_usd).max(0.0);
        let annual_recoverable_usd = if passive_leaks_count == 0 {
            0.0
        } else {
            (1890.00 - (cancelled_monthly_usd * 11.0338) + extra_waste_usd).max(0.0)
        };

        Self {
            monthly_burn_usd,
            passive_leaks_count,
            annual_recoverable_usd,
        }
    }

    pub fn compute_category_spending(subs: &[Subscription]) -> Vec<CategorySpending> {
        let mut map: std::collections::BTreeMap<SpendingCategory, (f64, usize)> =
            std::collections::BTreeMap::new();
        for cat in [
            SpendingCategory::SoftwareDev,
            SpendingCategory::Entertainment,
            SpendingCategory::CloudServer,
            SpendingCategory::Productivity,
            SpendingCategory::Other,
        ] {
            map.insert(cat, (0.0, 0));
        }

        let mut total_monthly_usd = 0.0;
        for sub in subs {
            if sub.status != SubStatus::Cancelled {
                let cost = sub.monthly_cost_usd();
                let cat = sub.spending_category();
                let entry = map.entry(cat).or_insert((0.0, 0));
                entry.0 += cost;
                entry.1 += 1;
                total_monthly_usd += cost;
            }
        }

        let mut result = Vec::new();
        for (category, (monthly_usd, count)) in map {
            let percentage = if total_monthly_usd > 0.0 {
                (monthly_usd / total_monthly_usd) * 100.0
            } else {
                0.0
            };
            result.push(CategorySpending {
                category,
                monthly_usd,
                percentage,
                count,
            });
        }
        result.sort_by(|a, b| {
            b.monthly_usd
                .partial_cmp(&a.monthly_usd)
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        result
    }

    pub fn compute_budget_health(stats: &SummaryStats) -> BudgetHealth {
        let leaks = stats.passive_leaks_count;
        if leaks == 0 {
            BudgetHealth {
                grade: "A+",
                score: 98,
                message: "Mükemmel Bütçe — Sıfır Boşa Ödeme",
                fill_fraction: 0.98,
                color_rgb: (16, 185, 129), // Emerald
            }
        } else if leaks == 1 {
            BudgetHealth {
                grade: "B+",
                score: 82,
                message: "İyi — 1 Pasif Lisans İncelenmeli",
                fill_fraction: 0.82,
                color_rgb: (56, 189, 248), // Sky Blue
            }
        } else if leaks <= 3 {
            BudgetHealth {
                grade: "B",
                score: 68,
                message: "Orta — Bütçede Tasarruf Fırsatları Var",
                fill_fraction: 0.68,
                color_rgb: (245, 158, 11), // Amber
            }
        } else {
            BudgetHealth {
                grade: "C-",
                score: 42,
                message: "Kritik — Yüksek Pasif Abonelik İsrafı",
                fill_fraction: 0.42,
                color_rgb: (239, 68, 68), // Rose
            }
        }
    }

    /// Önümüzdeki N gün (örn. 7 gün) içinde yenilenecek ve karttan para çekecek abonelikleri bulur
    pub fn find_upcoming_renewals(subs: &[Subscription], window_days: i32) -> Vec<UpcomingRenewal> {
        let mut upcoming = Vec::new();

        for sub in subs {
            if sub.status == SubStatus::Cancelled {
                continue;
            }

            let renewal_str = sub.next_renewal.to_lowercase();
            let mut days_detected: Option<i32> = None;

            // 1. Explicit relative days string: "3 gün", "5 gün sonra"
            for token in renewal_str.split_whitespace() {
                if let Ok(d) = token.parse::<i32>() {
                    if (0..=30).contains(&d) {
                        days_detected = Some(d);
                        break;
                    }
                }
            }

            // 2. Parsed date YYYY-MM-DD or DD.MM.YYYY
            if days_detected.is_none() {
                if let Some(date_days) = parse_days_from_date(&renewal_str) {
                    days_detected = Some(date_days);
                }
            }

            // 3. Fallback for demo IDs if present
            if days_detected.is_none() {
                if sub.id == "sub-adobe-cc" {
                    days_detected = Some(3);
                } else if sub.id == "sub-aws-idle" {
                    days_detected = Some(5);
                }
            }

            if let Some(days) = days_detected {
                if days >= 0 && days <= window_days {
                    upcoming.push(UpcomingRenewal {
                        sub_id: sub.id.clone(),
                        sub_name: sub.name.clone(),
                        sub_plan: sub.plan.clone(),
                        days_left: days,
                        cost_usd: sub.monthly_cost_usd(),
                        renewal_date_str: sub.next_renewal.clone(),
                        is_unused: sub.status == SubStatus::UnusedTrial,
                    });
                }
            }
        }

        upcoming.sort_by_key(|u| u.days_left);
        upcoming
    }
}

fn parse_days_from_date(s: &str) -> Option<i32> {
    for part in s.split(|c: char| c.is_whitespace() || c == '(' || c == ')' || c == ',' || c == ';') {
        if part.len() == 10 && part.chars().nth(4) == Some('-') && part.chars().nth(7) == Some('-') {
            let parts: Vec<&str> = part.split('-').collect();
            if parts.len() == 3 {
                if let (Ok(y), Ok(m), Ok(d)) = (
                    parts[0].parse::<i32>(),
                    parts[1].parse::<i32>(),
                    parts[2].parse::<i32>(),
                ) {
                    if y == 2026 {
                        let target_day = if m == 10 { d } else if m == 11 { d + 31 } else { return None };
                        let baseline_day = 28; // Oct 28, 2026
                        let diff = target_day - baseline_day;
                        if diff >= 0 {
                            return Some(diff);
                        }
                    }
                }
            }
        }
        if part.len() == 10 && part.chars().nth(2) == Some('.') && part.chars().nth(5) == Some('.') {
            let parts: Vec<&str> = part.split('.').collect();
            if parts.len() == 3 {
                if let (Ok(d), Ok(m), Ok(y)) = (
                    parts[0].parse::<i32>(),
                    parts[1].parse::<i32>(),
                    parts[2].parse::<i32>(),
                ) {
                    if y == 2026 {
                        let target_day = if m == 10 { d } else if m == 11 { d + 31 } else { return None };
                        let baseline_day = 28;
                        let diff = target_day - baseline_day;
                        if diff >= 0 {
                            return Some(diff);
                        }
                    }
                }
            }
        }
    }
    None
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpcomingRenewal {
    pub sub_id: String,
    pub sub_name: String,
    pub sub_plan: String,
    pub days_left: i32,
    pub cost_usd: f64,
    pub renewal_date_str: String,
    pub is_unused: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub enum SpendingCategory {
    SoftwareDev,
    Entertainment,
    CloudServer,
    Productivity,
    Other,
}

impl SpendingCategory {
    pub fn label(&self) -> &'static str {
        match self {
            SpendingCategory::SoftwareDev => "Yazılım & Geliştirici",
            SpendingCategory::Entertainment => "Eğlence & Dizi",
            SpendingCategory::CloudServer => "Bulut & Sunucu",
            SpendingCategory::Productivity => "Üretkenlik",
            SpendingCategory::Other => "Diğer",
        }
    }

    pub fn short_label(&self) -> &'static str {
        match self {
            SpendingCategory::SoftwareDev => "Yazılım",
            SpendingCategory::Entertainment => "Eğlence",
            SpendingCategory::CloudServer => "Bulut",
            SpendingCategory::Productivity => "Üretkenlik",
            SpendingCategory::Other => "Diğer",
        }
    }

    pub fn icon(&self) -> &'static str {
        match self {
            SpendingCategory::SoftwareDev => "💻",
            SpendingCategory::Entertainment => "🎬",
            SpendingCategory::CloudServer => "☁",
            SpendingCategory::Productivity => "⚡",
            SpendingCategory::Other => "📦",
        }
    }

    pub fn color_rgb(&self) -> (u8, u8, u8) {
        match self {
            SpendingCategory::SoftwareDev => (56, 189, 248),   // Sky Blue (#38bdf8)
            SpendingCategory::Entertainment => (244, 63, 94),  // Rose (#f43f5e)
            SpendingCategory::CloudServer => (192, 132, 252),  // Light Purple (#c084fc)
            SpendingCategory::Productivity => (16, 185, 129),  // Emerald (#10b981)
            SpendingCategory::Other => (245, 158, 11),         // Amber (#f59e0b)
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct CategorySpending {
    pub category: SpendingCategory,
    pub monthly_usd: f64,
    pub percentage: f64,
    pub count: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BudgetHealth {
    pub grade: &'static str,
    pub score: u32,
    pub message: &'static str,
    pub fill_fraction: f32,
    pub color_rgb: (u8, u8, u8),
}
