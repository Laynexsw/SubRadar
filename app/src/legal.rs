//! SubRadar v1.0 — 6502 Sayılı Kanun, KVKK, GDPR, THH ve Banka Chargeback İtiraz Dosyası Üreticisi (`legal.rs`)

use crate::models::{Subscription, UserPreferences};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NoticeLanguage {
    Turkish,
    English,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LegalDocumentType {
    CancellationNotice,  // Standart İptal İhtarnamesi
    ConsumerArbitration, // Tüketici Hakem Heyeti (THH) Resmi Başvuru Metni
    BankChargeback,      // Banka Ters İbraz / Harcama İtirazı (Chargeback) Dosyası
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

/// Tüketici Hakem Heyeti (THH / E-Devlet TÜBİS) Resmi Başvuru Formu Metni
pub fn generate_thh_application(sub: &Subscription, prefs: &UserPreferences) -> String {
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
    let formatted_price = sub.currency.format_from_try(sub.currency.to_try(sub.price));

    format!(
        "T.C. TİCARET BAKANLIĞI\n\
TÜKETİCİ HAKEM HEYETİ BAŞKANLIĞI'NA\n\
(TÜBİS / E-Devlet Başvuru Metni)\n\
\n\
BAŞVURU TARİHİ: 28 Ekim 2026\n\
ŞİKÂYET EDEN (TÜKETİCİ): {user_name}\n\
İLETİŞİM / E-POSTA: {user_email}\n\
ŞİKÂYET EDİLEN (SATICI/SAĞLAYICI): {service}\n\
UYUŞMAZLIK KONUSU / BEDELİ: {price_str} (Aylık Abonelik Bedeli İadesi ve Sözleşme Feshi)\n\
\n\
AÇIKLAMALAR:\n\
1. Şahsım adına kayıtlı hesap üzerinden {service} bünyesindeki \"{plan}\" ({id}) hizmetine ilişkin abonelik başlatılmıştır.\n\
2. 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 52. maddesinin 4. fıkrası (\"Tüketici, belirsiz süreli veya süresi bir yıldan daha uzun olan belirli süreli abonelik sözleşmesini herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin istediği zaman feshetme hakkına sahiptir\") uyarınca yasal fesih hakkımı kullanmak istememe rağmen sağlayıcı tarafından haksız engeller çıkarılmış / iptal sonrası kartımdan yetkisiz tahsilat yapılmıştır.\n\
3. Aynı Kanun'un 48. maddesi (Mesafeli Sözleşmeler) ve Abonelik Sözleşmeleri Yönetmeliği hükümleri uyarınca, tüketicinin fesih bildirimini yöneltmesinden itibaren en geç yedi gün içinde sağlayıcı sözleşmeyi feshetmek ve haksız kesilen bedelleri iade etmekle yükümlüdür.\n\
\n\
HUKUKİ SEBEPLER: 6502 sayılı Kanun m. 48, m. 52/4, Abonelik Sözleşmeleri Yönetmeliği, Tüketici Hakem Heyetleri Yönetmeliği ve ilgili mevzuat.\n\
\n\
TALEP VE SONUÇ:\n\
Yukarıda arz ve izah olunan gerekçelerle;\n\
a) {service} nezdindeki \"{plan}\" aboneliğimin cezai şartsız ve geriye etkili olarak FESHEDİLDİĞİNİN TESPİTİNE,\n\
b) İptal iradesine aykırı olarak tahsil edilen {price_str} tutarındaki bedelin yasal faiziyle birlikte şahsıma İADESİNE,\n\
c) Firma sistemlerindeki otomatik ödeme ve kart çekim yetkilerinin HÜKÜMSÜZ KILINMASINA,\n\
karar verilmesini saygılarımla arz ve talep ederim.\n\
\n\
Tüketici: {user_name}\n\
İmza / E-İmza: [E-Devlet Üzerinden Onaylandı]",
        service = sub.name,
        plan = sub.plan,
        id = sub.id,
        price_str = formatted_price,
        user_name = user_name,
        user_email = user_email
    )
}

/// Banka Ters İbraz / Harcama İtirazı (Chargeback) Dosyası (Visa / Mastercard Uyumlu)
pub fn generate_chargeback_document(
    sub: &Subscription,
    prefs: &UserPreferences,
    card_last4: &str,
    tx_date: &str,
) -> String {
    let user_name = if prefs.user_name.trim().is_empty() {
        "Abonelik Sahibi"
    } else {
        prefs.user_name.trim()
    };
    let card_info = if card_last4.trim().is_empty() {
        "**** **** **** [Son 4 Hane]"
    } else {
        card_last4.trim()
    };
    let date_str = if tx_date.trim().is_empty() {
        "28.10.2026"
    } else {
        tx_date.trim()
    };
    let formatted_price = sub.currency.format_from_try(sub.currency.to_try(sub.price));

    format!(
        "T.C. BANKALARI GENEL MÜDÜRLÜĞÜ / KART OPERASYONLARI MERKEZİ'NE\n\
HARCAMA İTİRAZI (CHARGEBACK) VE TERS İBRAZ TALEP FORMU\n\
\n\
BAŞVURU TARİHİ: 28 Ekim 2026\n\
KART HAMİLİ: {user_name}\n\
KART NUMARASI: {card_info}\n\
İTİRAZ EDİLEN ÜYE İŞYERİ: {service}\n\
İŞLEM TARİHİ: {date_str}\n\
İTİRAZ EDİLEN TUTAR: {price_str}\n\
\n\
ULUSLARARASI KURAL KODU:\n\
• Visa Dispute Condition 13.5: Misrepresentation / Cancelled Recurring Transaction\n\
• Mastercard Reason Code 4841: Cancelled Recurring Transaction\n\
\n\
İTİRAZ GEREKÇESİ VE AÇIKLAMA:\n\
Bankanızın yukarıda son haneleri belirtilen kartımdan {service} (\"{plan}\") adına bilgim, onayım ve yasal abonelik iptal bildirimime rağmen mükerrer/yetkisiz çekim yapılmıştır.\n\
\n\
1. İlgili satıcıya aboneliğin sonlandırıldığına dair fesih bildirimi iletilmiş olmasına rağmen periyodik çekim iptal edilmemiştir.\n\
2. Uluslararası Visa ve Mastercard kurallarına göre, kart hamili tarafından iptal edilen periyodik üyeliklerden sonra yapılan çekimler açıkça ters ibraz (chargeback) kapsamındadır.\n\
3. 5464 sayılı Banka Kartları ve Kredi Kartları Kanunu m. 11 ve Visa/Mastercard kuralları uyarınca ilgili harcama itirazı sürecinin ivedilikle başlatılmasını ve provizyonun iptal edilerek {price_str} bedelin kartıma iadesini talep ederim.\n\
\n\
Kart Hamili:\n\
{user_name}\n\
İletişim: {user_email}",
        service = sub.name,
        plan = sub.plan,
        card_info = card_info,
        date_str = date_str,
        price_str = formatted_price,
        user_name = user_name,
        user_email = prefs.user_email
    )
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
            is_shared: false,
            shared_member_count: 1,
            shared_members: String::new(),
            my_share_percentage: 100.0,
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

    #[test]
    fn test_thh_application_contains_law_6502_and_articles() {
        let sub = sample_sub();
        let prefs = UserPreferences {
            user_name: "Can K.".to_string(),
            user_email: "can@example.com".to_string(),
            ..Default::default()
        };
        let doc = generate_thh_application(&sub, &prefs);
        assert!(doc.contains("TÜKETİCİ HAKEM HEYETİ BAŞKANLIĞI"));
        assert!(doc.contains("6502 sayılı Tüketicinin Korunması Hakkında Kanun"));
        assert!(doc.contains("52. maddesinin 4. fıkrası"));
        assert!(doc.contains("48. maddesi"));
        assert!(doc.contains("Adobe Creative Cloud"));
    }

    #[test]
    fn test_chargeback_document_contains_visa_mastercard_rules() {
        let sub = sample_sub();
        let prefs = UserPreferences {
            user_name: "Can K.".to_string(),
            user_email: "can@example.com".to_string(),
            ..Default::default()
        };
        let doc = generate_chargeback_document(&sub, &prefs, "4123", "2026-10-14");
        assert!(doc.contains("HARCAMA İTİRAZI (CHARGEBACK)"));
        assert!(doc.contains("Visa Dispute Condition 13.5"));
        assert!(doc.contains("Mastercard Reason Code 4841"));
        assert!(doc.contains("4123"));
        assert!(doc.contains("5464 sayılı Banka Kartları ve Kredi Kartları Kanunu"));
    }
}
