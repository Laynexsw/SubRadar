//! SubRadar v1.0 — Veri Modelleri, Para Birimi Dönüşümleri ve Bütçe Hesaplamaları (`models.rs`)

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
            SubStatus::UnusedTrial => "Deneme / Kullanılmıyor",
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
            currency: Currency::TRY,
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

impl Default for VaultPayload {
    fn default() -> Self {
        Self {
            version: "1.0".to_string(),
            preferences: UserPreferences::default(),
            subscriptions: vec![
                Subscription {
                    id: "sub-adobe-cc".to_string(),
                    name: "Adobe Creative Cloud".to_string(),
                    plan: "Tüm Uygulamalar".to_string(),
                    category: "Tasarım".to_string(),
                    price: 2966.52,
                    currency: Currency::TRY,
                    billing_cycle: BillingCycle::Monthly,
                    next_renewal: "2026-11-12".to_string(),
                    status: SubStatus::UnusedTrial,
                    cancel_url: "https://account.adobe.com/plans".to_string(),
                    notes: "Son 51 gündür hiç kullanılmadı.".to_string(),
                },
                Subscription {
                    id: "sub-chatgpt-plus".to_string(),
                    name: "ChatGPT Plus".to_string(),
                    plan: "Plus Üyelik".to_string(),
                    category: "Yapay Zekâ & Üretkenlik".to_string(),
                    price: 967.00,
                    currency: Currency::TRY,
                    billing_cycle: BillingCycle::Monthly,
                    next_renewal: "2026-10-30".to_string(),
                    status: SubStatus::UnusedTrial,
                    cancel_url: "https://chat.openai.com/#settings".to_string(),
                    notes: "48 saat içinde ücretsiz deneme süresi bitiyor!".to_string(),
                },
                Subscription {
                    id: "sub-netflix".to_string(),
                    name: "Netflix".to_string(),
                    plan: "Standart Paket".to_string(),
                    category: "Dizi, Film & Müzik".to_string(),
                    price: 299.99,
                    currency: Currency::TRY,
                    billing_cycle: BillingCycle::Monthly,
                    next_renewal: "2026-11-18".to_string(),
                    status: SubStatus::Active,
                    cancel_url: "https://www.netflix.com/cancelplan".to_string(),
                    notes: "Düzenli izleniyor.".to_string(),
                },
                Subscription {
                    id: "sub-spotify".to_string(),
                    name: "Spotify Premium".to_string(),
                    plan: "Bireysel Paket".to_string(),
                    category: "Dizi, Film & Müzik".to_string(),
                    price: 99.99,
                    currency: Currency::TRY,
                    billing_cycle: BillingCycle::Monthly,
                    next_renewal: "2026-11-24".to_string(),
                    status: SubStatus::Active,
                    cancel_url: "https://www.spotify.com/account/subscription/change/".to_string(),
                    notes: "Her gün aktif dinleniyor.".to_string(),
                },
            ],
        }
    }
}

#[derive(Debug, Clone)]
pub struct SummaryStats {
    pub monthly_total_try: f64,
    pub active_count: usize,
    pub unused_or_trial_count: usize,
    pub yearly_savings_try: f64,
    pub health_grade: &'static str,
    pub health_desc: &'static str,
}

impl SummaryStats {
    pub fn compute(subs: &[Subscription]) -> Self {
        let mut monthly_total_try = 0.0;
        let mut active_count = 0;
        let mut unused_or_trial_count = 0;
        let mut yearly_savings_try = 0.0;

        for s in subs {
            if s.status == SubStatus::Cancelled {
                continue;
            }
            let m = s.monthly_cost_try();
            monthly_total_try += m;

            match s.status {
                SubStatus::Active => active_count += 1,
                SubStatus::UnusedTrial => {
                    unused_or_trial_count += 1;
                    yearly_savings_try += m * 12.0;
                }
                SubStatus::Cancelled => {}
            }
        }

        let (health_grade, health_desc) = if unused_or_trial_count == 0 {
            ("A+", "Temiz bütçe • Gereksiz harcama yok")
        } else if unused_or_trial_count == 1 {
            ("B+", "İyi durumda • 1 aboneliği gözden geçirin")
        } else {
            ("C-", "Dikkat • Boşa ödenen abonelikleri iptal edin")
        };

        Self {
            monthly_total_try,
            active_count,
            unused_or_trial_count,
            yearly_savings_try,
            health_grade,
            health_desc,
        }
    }
}
