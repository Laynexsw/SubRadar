//! SubRadar v1.0 — %100 Saf Rust Çevrimdışı Banka Ekstresi ve Gizli Zam Algılayıcısı (`parser.rs`)

use std::collections::HashSet;

use crate::models::{BillingCycle, Currency, SubStatus, Subscription};
use crate::presets::SERVICE_PRESETS;

pub const SAMPLE_STATEMENT: &str = "\
14.10.2026 14:22 ADOBE SYSTEMS INC CREATIVE CLD 2966.52 TRY
11.10.2026 09:15 NETFLIX.COM INTERNET ISTANBUL 299.99 TL
08.10.2026 18:40 SPOTIFY TURKIYE 99.99 TRY
05.10.2026 11:02 OPENAI *CHATGPT PLUS 967.00 TL
03.10.2026 16:30 MARKET ALISVERISI 845.00 TL
02.10.2026 21:10 YOUTUBE PREMIUM GOOGLE 115.99 TL
01.10.2026 10:05 GITHUB COPILOT SUBSCRIPTION 483.50 TRY";

pub fn detect_currency(line_lower: &str, default_currency: Currency) -> Currency {
    if line_lower.contains("usd") || line_lower.contains('$') {
        Currency::USD
    } else if line_lower.contains("eur") || line_lower.contains('€') {
        Currency::EUR
    } else if line_lower.contains("try") || line_lower.contains("tl") || line_lower.contains('₺') {
        Currency::TRY
    } else {
        default_currency
    }
}

pub fn clean_and_parse_amount(token: &str) -> Option<f64> {
    let mut cleaned = token
        .trim_matches(|c: char| {
            c == '₺'
                || c == '$'
                || c == '€'
                || c == '+'
                || c == '-'
                || c == '('
                || c == ')'
                || c == '"'
                || c == '\''
                || c == '|'
                || c == ';'
                || c == ' '
        })
        .to_string();

    if cleaned.is_empty() {
        return None;
    }

    // Skip dates (e.g. 15.10.2026, 2026-10-15, 15/10/2026) and times (14:22:10)
    if cleaned.contains(':') || cleaned.contains('/') || cleaned.contains('-') {
        return None;
    }
    // Multiple dots like 14.10.2026 without comma:
    if cleaned.matches('.').count() > 1 && !cleaned.contains(',') {
        return None;
    }

    // Turkish thousands formatting: e.g. "2.966,52" -> "2966.52"
    if cleaned.contains('.') && cleaned.contains(',') {
        cleaned = cleaned.replace('.', "").replace(',', ".");
    } else if cleaned.contains(',') {
        // Turkish simple comma decimal: "299,99" -> "299.99"
        cleaned = cleaned.replace(',', ".");
    }

    if !cleaned.chars().all(|c| c.is_ascii_digit() || c == '.') {
        return None;
    }
    if cleaned.matches('.').count() > 1 {
        return None;
    }

    // Skip standalone 4-digit years (e.g. 2024..=2040)
    if !cleaned.contains('.') {
        if let Ok(int_val) = cleaned.parse::<u32>() {
            if (2000..=2050).contains(&int_val) {
                return None;
            }
        }
    }

    if let Ok(val) = cleaned.parse::<f64>() {
        if val > 0.0 && val < 500_000.0 {
            return Some(val);
        }
    }
    None
}

pub fn extract_price_from_line(line: &str) -> Option<f64> {
    let mut last_valid_price: Option<f64> = None;

    for raw_token in line.split(|c: char| c.is_whitespace() || c == ';' || c == '|' || c == '\t') {
        let sub_tokens: Vec<&str> = if raw_token.matches(',').count() >= 1
            && raw_token.chars().any(|c| c.is_alphabetic())
        {
            raw_token.split(',').collect()
        } else {
            vec![raw_token]
        };

        for tok in sub_tokens {
            if let Some(price) = clean_and_parse_amount(tok) {
                last_valid_price = Some(price);
            }
        }
    }

    last_valid_price
}

/// Ekstredeki geçmiş çekimlerle mevcut abonelik fiyatlarını karşılaştıran akıllı zam dedektörü.
/// Döndürür: (zam_tespit_edildi_mi, önceki_fiyat, zam_yüzdesi)
pub fn detect_price_hike(
    service_name: &str,
    current_price: f64,
    statement_history: &str,
) -> (bool, Option<f64>, Option<f64>) {
    let lower_service = service_name.to_lowercase();
    let keywords: Vec<String> = if let Some(p) = SERVICE_PRESETS.iter().find(|p| {
        p.name.to_lowercase() == lower_service || p.id == lower_service
    }) {
        p.keywords.iter().map(|k| k.to_string()).collect()
    } else {
        vec![lower_service.clone()]
    };

    let mut matching_prices = Vec::new();

    for line in statement_history.lines() {
        let line_lower = line.to_lowercase();
        if keywords.iter().any(|kw| line_lower.contains(kw)) {
            if let Some(price) = extract_price_from_line(line) {
                matching_prices.push(price);
            }
        }
    }

    if matching_prices.len() >= 2 {
        let first = matching_prices[0];
        let last = *matching_prices.last().unwrap();
        if last > first * 1.01 {
            let pct = ((last - first) / first) * 100.0;
            return (true, Some(first), Some((pct * 10.0).round() / 10.0));
        }
    } else if matching_prices.len() == 1 {
        let stmt_price = matching_prices[0];
        if current_price > stmt_price * 1.01 {
            let pct = ((current_price - stmt_price) / stmt_price) * 100.0;
            return (true, Some(stmt_price), Some((pct * 10.0).round() / 10.0));
        }
    }

    (false, None, None)
}

pub fn parse_statement(raw_content: &str, default_currency: Currency) -> Vec<Subscription> {
    let mut detected = Vec::new();
    let mut seen_ids = HashSet::new();

    // Collect all price occurrences per preset to detect recurring price hikes
    struct CollectedPreset {
        preset_idx: usize,
        prices: Vec<f64>,
        currency: Currency,
        last_line_idx: usize,
        last_line_str: String,
    }

    let mut preset_collections: Vec<CollectedPreset> = Vec::new();

    for (line_idx, line) in raw_content.lines().enumerate() {
        let trimmed = line.trim();
        if trimmed.len() < 5 {
            continue;
        }
        let lower = trimmed.to_lowercase();

        for (p_idx, preset) in SERVICE_PRESETS.iter().enumerate() {
            let matched = preset.keywords.iter().any(|kw| lower.contains(kw));
            if matched {
                let currency = detect_currency(&lower, default_currency);
                let price = extract_price_from_line(trimmed).unwrap_or(preset.default_price);

                if let Some(existing) = preset_collections.iter_mut().find(|c| c.preset_idx == p_idx) {
                    existing.prices.push(price);
                    existing.last_line_idx = line_idx;
                    existing.last_line_str = trimmed.to_string();
                } else {
                    preset_collections.push(CollectedPreset {
                        preset_idx: p_idx,
                        prices: vec![price],
                        currency,
                        last_line_idx: line_idx,
                        last_line_str: trimmed.to_string(),
                    });
                }
                break;
            }
        }
    }

    for item in preset_collections {
        let preset = &SERVICE_PRESETS[item.preset_idx];
        if seen_ids.contains(preset.id) {
            continue;
        }
        seen_ids.insert(preset.id);

        let latest_price = *item.prices.last().unwrap_or(&preset.default_price);
        let mut previous_price: Option<f64> = None;
        let mut price_hike_detected = false;
        let mut price_hike_percentage: Option<f64> = None;

        if item.prices.len() >= 2 {
            let older_price = item.prices[0];
            if latest_price > older_price * 1.01 {
                price_hike_detected = true;
                let pct = ((latest_price - older_price) / older_price) * 100.0;
                previous_price = Some(older_price);
                price_hike_percentage = Some((pct * 10.0).round() / 10.0);
            }
        }

        let notes = if price_hike_detected {
            format!(
                "⚠ Gizli zam yakalandı: {:.2} -> {:.2} (+%{:.0})",
                previous_price.unwrap_or(0.0),
                latest_price,
                price_hike_percentage.unwrap_or(0.0)
            )
        } else {
            format!("Ekstre satırından yakalandı: {}", item.last_line_str)
        };

        detected.push(Subscription {
            id: format!("ext-{}-{}", preset.id, item.last_line_idx + 1),
            name: preset.name.to_string(),
            plan: preset.plan.to_string(),
            category: preset.category.to_string(),
            price: latest_price,
            previous_price,
            price_hike_detected,
            price_hike_percentage,
            currency: item.currency,
            billing_cycle: BillingCycle::Monthly,
            next_renewal: "2026-11-15".to_string(),
            status: SubStatus::UnusedTrial,
            cancel_url: preset.cancel_url.to_string(),
            notes,
            is_shared: false,
            shared_member_count: 1,
            shared_members: String::new(),
            my_share_percentage: 100.0,
        });
    }

    detected
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_csv_and_text_statement() {
        let csv = "\
Tarih,Açıklama,Tutar,Para Birimi
2026-09-01,NETFLIX.COM PAYMENT,-199.99,TRY
2026-09-03,SPOTIFY ISTANBUL TR,-59.99,TRY
2026-09-05,OPENAI CHATGPT PLUS,-20.00,USD
2026-09-10,MARKET HARCAMASI,-450.00,TRY
2026-09-12,GITHUB COPILOT SUBSCRIPTION,-10.00,USD";

        let found = parse_statement(csv, Currency::TRY);
        assert_eq!(found.len(), 4);

        let netflix = found.iter().find(|s| s.name == "Netflix").unwrap();
        assert!((netflix.price - 199.99).abs() < 0.01);
        assert_eq!(netflix.currency, Currency::TRY);

        let chatgpt = found.iter().find(|s| s.name == "ChatGPT Plus").unwrap();
        assert!((chatgpt.price - 20.00).abs() < 0.01);
        assert_eq!(chatgpt.currency, Currency::USD);
    }

    #[test]
    fn test_sample_statement_detection() {
        let found = parse_statement(SAMPLE_STATEMENT, Currency::TRY);
        assert_eq!(found.len(), 6);
    }

    #[test]
    fn test_detect_price_hike_multiple_months() {
        let history = "\
15.08.2026 NETFLIX.COM ISTANBUL 199.99 TL
15.09.2026 NETFLIX.COM ISTANBUL 199.99 TL
15.10.2026 NETFLIX.COM ISTANBUL 299.99 TL";

        let (hike, prev, pct) = detect_price_hike("Netflix", 299.99, history);
        assert!(hike);
        assert_eq!(prev, Some(199.99));
        assert!((pct.unwrap() - 50.0).abs() < 0.1);
    }

    #[test]
    fn test_turkish_bank_formats_garanti_enpara_papara() {
        let stmt = "\
15/10/2026 GARANTI BBVA - NETFLIX.COM TR 299,99 TL
12.10.2026 ENPARA.COM YOUTUBE PREMIUM 115,99 TL
01.10.2026 14:15 Papara Card Adobe Systems Inc 2.966,52 TL";

        let found = parse_statement(stmt, Currency::TRY);
        assert_eq!(found.len(), 3);

        let adobe = found.iter().find(|s| s.name.contains("Adobe")).unwrap();
        assert!((adobe.price - 2966.52).abs() < 0.01);

        let yt = found.iter().find(|s| s.name.contains("YouTube")).unwrap();
        assert!((yt.price - 115.99).abs() < 0.01);
    }

    #[test]
    fn test_global_bank_formats_wise_revolut() {
        let stmt = "\
2026-10-14 Wise Card Cursor Pro AI Monthly -20.00 USD
14 Oct 2026 | Midjourney Inc | -10.00 USD | Revolut Card";

        let found = parse_statement(stmt, Currency::USD);
        assert_eq!(found.len(), 2);

        let cursor = found.iter().find(|s| s.name.contains("Cursor")).unwrap();
        assert!((cursor.price - 20.00).abs() < 0.01);
        assert_eq!(cursor.currency, Currency::USD);
    }
}
