//! SubRadar v1.0 — %100 Saf Rust Çevrimdışı Banka Ekstresi ve Harcama Tarayıcısı (`parser.rs`)

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

fn detect_currency(line_lower: &str, default_currency: Currency) -> Currency {
    if line_lower.contains("usd") || line_lower.contains('$') {
        Currency::USD
    } else if line_lower.contains("eur") || line_lower.contains('€') {
        Currency::EUR
    } else if line_lower.contains("try") || line_lower.contains("tl") || line_lower.contains('₺')
    {
        Currency::TRY
    } else {
        default_currency
    }
}

fn extract_price_from_line(line: &str) -> Option<f64> {
    let mut last_valid_price: Option<f64> = None;

    for raw_token in line.split(|c: char| c.is_whitespace() || c == ';' || c == '|') {
        // Also split CSV commas if token contains multiple CSV fields (e.g. "-199.99,TRY")
        let sub_tokens: Vec<&str> = if raw_token.matches(',').count() >= 1
            && raw_token.chars().any(|c| c.is_alphabetic())
        {
            raw_token.split(',').collect()
        } else {
            vec![raw_token]
        };

        for tok in sub_tokens {
            let trimmed = tok.trim_matches(|c: char| {
                c == '₺' || c == '$' || c == '€' || c == '+' || c == '-' || c == '(' || c == ')'
            });

            // Skip dates like 14.10.2026 or 2026-09-01 or times like 14:22
            if trimmed.contains(':') || trimmed.contains('-') {
                continue;
            }
            if trimmed.matches('.').count() > 1 {
                continue;
            }

            let normalized = trimmed.replace(',', ".");
            if normalized.is_empty() || !normalized.chars().all(|c| c.is_ascii_digit() || c == '.')
            {
                continue;
            }

            if let Ok(val) = normalized.parse::<f64>() {
                if val > 0.0 && val < 50_000.0 && normalized.contains('.') {
                    last_valid_price = Some(val);
                }
            }
        }
    }

    last_valid_price
}

pub fn parse_statement(raw_content: &str, default_currency: Currency) -> Vec<Subscription> {
    let mut detected = Vec::new();
    let mut seen_ids = HashSet::new();

    for (idx, line) in raw_content.lines().enumerate() {
        let trimmed = line.trim();
        if trimmed.len() < 5 {
            continue;
        }
        let lower = trimmed.to_lowercase();

        for preset in SERVICE_PRESETS {
            if seen_ids.contains(preset.id) {
                continue;
            }

            let matched = preset.keywords.iter().any(|kw| lower.contains(kw));
            if matched {
                seen_ids.insert(preset.id);
                let currency = detect_currency(&lower, default_currency);
                let price = extract_price_from_line(trimmed).unwrap_or(preset.default_price);

                detected.push(Subscription {
                    id: format!("ext-{}-{}", preset.id, idx + 1),
                    name: preset.name.to_string(),
                    plan: preset.plan.to_string(),
                    category: preset.category.to_string(),
                    price,
                    currency,
                    billing_cycle: BillingCycle::Monthly,
                    next_renewal: "2026-11-15".to_string(),
                    status: SubStatus::UnusedTrial,
                    cancel_url: preset.cancel_url.to_string(),
                    notes: format!("Ekstre satırından yakalandı: {}", trimmed),
                });
                break;
            }
        }
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
}
