//! SubRadar v1.0 — 6502 Sayılı Kanun, KVKK ve GDPR Uyumlu Resmi İptal Dilekçesi Üreticisi (`legal.rs`)

use crate::models::{Subscription, UserPreferences};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NoticeLanguage {
    Turkish,
    English,
}

pub fn generate_legal_notice(
    sub: &Subscription,
    prefs: &UserPreferences,
    lang: NoticeLanguage,
) -> String {
    let user_name = if prefs.user_name.trim().is_empty() {
        "Abonelik Sahibi"
    } else {
        prefs.user_name.trim()
    };

    let user_email = if prefs.user_email.trim().is_empty() {
        "kullanici@subradar.local"
    } else {
        prefs.user_email.trim()
    };

    match lang {
        NoticeLanguage::Turkish => format!(
            "TARİH: 28 Ekim 2026\n\
KİME: {service} Müşteri Hizmetleri ve Abonelik / Hukuk Birimi\n\
KONU: Abonelik Sözleşmesinin Derhal İptali, Otomatik Yenilemenin Durdurulması ve Kart Yetkisinin Kaldırılması Bildirimi\n\
ABONELİK / PAKET: {service} — {plan} ({id})\n\
HESAP SAHİBİ: {user_name} ({user_email})\n\
\n\
Sayın Yetkili,\n\
\n\
Tarafınızca sunulmakta olan \"{service} - {plan}\" hizmetine ilişkin aboneliğimi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 52. maddesinin 4. fıkrası ve ilgili mesafeli sözleşmeler mevzuatı uyarınca tek taraflı olarak DERHAL VE KOŞULSUZ İPTAL EDİYORUM.\n\
\n\
İşbu resmi bildirim ile:\n\
1. DERHAL FESİH: Abonelik sözleşmemin işbu bildirimin tarafınıza ulaştığı tarih itibarıyla derhal sonlandırılmasını,\n\
2. OTOMATİK ÖDEME İPTALİ: Hesabıma tanımlı tüm kredi kartı, banka kartı ve sanal kart otomatik çekim talimatlarının derhal iptal edilmesini ve ilerleyen dönemler için hiçbir ücret yansıtılmamasını,\n\
3. KİŞİSEL VERİLERİN SİLİNMESİ: 6698 sayılı KVKK'nın 11. maddesi uyarınca saklanması yasal olarak zorunlu olmayan ödeme ve kullanım verilerimin sistemlerinizden silinmesini,\n\
4. YAZILI ONAY: İptal işleminin tamamlandığına ve kartımdan yeni bir çekim yapılmayacağına dair yazılı teyidin {user_email} adresime iletilmesini talep ederim.\n\
\n\
Bildirim tarihinden sonra gerçekleşebilecek her türlü izinsiz kart çekimine karşı Tüketici Hakem Heyeti ve banka harcama itirazı (chargeback) haklarımı kullanacağımı bilgilerinize sunarım.\n\
\n\
Saygılarımla,\n\
{user_name}\n\
E-Posta: {user_email}",
            service = sub.name,
            plan = sub.plan,
            id = sub.id,
            user_name = user_name,
            user_email = user_email
        ),
        NoticeLanguage::English => format!(
            "DATE: October 28, 2026\n\
TO: {service} Customer Billing & Legal Department\n\
SUBJECT: Formal Notice of Immediate Subscription Cancellation and Revocation of Billing Mandate\n\
SUBSCRIPTION / PLAN: {service} — {plan} ({id})\n\
ACCOUNT HOLDER: {user_name} ({user_email})\n\
\n\
To Whom It May Concern,\n\
\n\
I hereby exercise my statutory consumer right to immediately cancel my subscription for \"{service} - {plan}\".\n\
\n\
Pursuant to applicable consumer protection laws and Article 17 of the General Data Protection Regulation (GDPR - Right to Erasure):\n\
1. IMMEDIATE TERMINATION: Please terminate my subscription immediately and disable all automatic renewal mechanisms.\n\
2. REVOCATION OF PAYMENT MANDATE: All stored payment authorizations and recurring billing mandates associated with {user_email} are hereby revoked with immediate effect.\n\
3. DATA ERASURE: Please purge all non-essential personal and payment data in accordance with GDPR Article 17.\n\
4. WRITTEN CONFIRMATION: Please send written confirmation of this cancellation to {user_email}.\n\
\n\
Sincerely,\n\
{user_name}\n\
Email: {user_email}",
            service = sub.name,
            plan = sub.plan,
            id = sub.id,
            user_name = user_name,
            user_email = user_email
        ),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{BillingCycle, Currency, SubStatus};

    fn sample_sub() -> Subscription {
        Subscription {
            id: "sub-test-1".to_string(),
            name: "Adobe Creative Cloud".to_string(),
            plan: "Tüm Uygulamalar".to_string(),
            category: "Tasarım".to_string(),
            price: 2966.52,
            previous_price: None,
            price_hike_detected: false,
            price_hike_percentage: None,
            currency: Currency::TRY,
            billing_cycle: BillingCycle::Monthly,
            next_renewal: "2026-11-12".to_string(),
            status: SubStatus::UnusedTrial,
            cancel_url: "https://account.adobe.com/plans".to_string(),
            notes: String::new(),
        }
    }

    #[test]
    fn test_turkish_notice_contains_law_6502() {
        let sub = sample_sub();
        let prefs = UserPreferences {
            user_name: "Arda Y.".to_string(),
            user_email: "arda@ornek.com".to_string(),
            ..Default::default()
        };
        let text = generate_legal_notice(&sub, &prefs, NoticeLanguage::Turkish);
        assert!(text.contains("6502 sayılı Tüketicinin Korunması Hakkında Kanun"));
        assert!(text.contains("Adobe Creative Cloud"));
        assert!(text.contains("arda@ornek.com"));
    }

    #[test]
    fn test_english_notice_contains_gdpr_article_17() {
        let sub = sample_sub();
        let prefs = UserPreferences::default();
        let text = generate_legal_notice(&sub, &prefs, NoticeLanguage::English);
        assert!(text.contains("Article 17 of the General Data Protection Regulation"));
        assert!(text.contains("Right to Erasure"));
    }
}
