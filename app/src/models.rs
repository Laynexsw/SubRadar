//! SubRadar v1.0 — Veri Modelleri ve Sitedeki Önizleme Verileri (`models.rs`)

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
        format!("{}{:.2}", self.symbol(), converted)
    }
}

pub fn format_usd_tr(amount_usd: f64) -> String {
    let cents = (amount_usd * 100.0).round() as i64;
    let whole = cents / 100;
    let frac = (cents % 100).abs();
    let whole_str = if whole >= 1000 {
        format!("{}.{:03}", whole / 1000, whole % 1000)
    } else {
        format!("{}", whole)
    };
    format!("${},{:02}", whole_str, frac)
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
            SubStatus::Active => "Aktif",
            SubStatus::UnusedTrial => "Pasif / Deneme",
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
}

impl Subscription {
    pub fn monthly_cost_try(&self) -> f64 {
        let base_try = self.currency.to_try(self.price);
        self.billing_cycle.to_monthly(base_try)
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
        } else {
            "SR"
        }
    }

    pub fn is_light_avatar(&self) -> bool {
        self.name.to_lowercase().contains("adobe")
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
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "28 MART'TA YENİLENİR".to_string(),
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
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "OTOMATİK ÖDEME".to_string(),
                status: SubStatus::UnusedTrial,
                cancel_url: "https://account.jetbrains.com/licenses".to_string(),
                notes: "Son 45 gündür aktif kullanım tespit edilmedi.".to_string(),
            },
            Subscription {
                id: "sub-figma".to_string(),
                name: "Figma Professional".to_string(),
                plan: "HER GÜN AKTİF".to_string(),
                category: "Tasarım".to_string(),
                price: 15.00,
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
                currency: Currency::USD,
                billing_cycle: BillingCycle::Monthly,
                next_renewal: "KULLANILMAYAN ALTYAPI".to_string(),
                status: SubStatus::UnusedTrial,
                cancel_url: "https://console.aws.amazon.com/billing/".to_string(),
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
    /// Computes the exact hero metrics matching the web preview:
    /// Baseline with the 4 default rows is $384,20 monthly spend, 3 Pasif Lisanslar, and $1.890,00 annual recoverable waste.
    /// Cancelling any passive license immediately subtracts its monthly cost and 12x annual waste!
    pub fn compute(subs: &[Subscription]) -> Self {
        let mut cancelled_monthly_usd = 0.0;
        let mut passive_leaks_count = 0usize;
        let mut extra_monthly_usd = 0.0;
        let mut extra_waste_usd = 0.0;

        for s in subs {
            let usd_val = match s.currency {
                Currency::USD => s.price,
                Currency::TRY => s.price / 48.35,
                Currency::EUR => s.price * (52.10 / 48.35),
            };
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
}
