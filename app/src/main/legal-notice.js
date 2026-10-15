/**
 * SubRadar Desktop — Legal Cancellation Notice Generator
 * 
 * Generates legally enforceable subscription termination notices
 * under Turkish Consumer Protection Law (TKHK 6502 m. 52/4)
 * and GDPR Article 17 / EU Directive 2011/83/EU.
 */

function generateLegalNotice(subscription, userInfo = {}, language = 'tr') {
  const now = new Date();
  const dateStrTR = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateStrEN = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const serviceName = subscription.name || 'Hizmet Sağlayıcı';
  const planName = subscription.plan || 'Standart Plan';
  const userName = userInfo.name || subscription.accountName || 'Abonelik Sahibi';
  const userEmail = userInfo.email || subscription.accountEmail || 'kayitli-eposta@ornek.com';
  const subId = subscription.subId || subscription.id || 'N/A';

  if (language === 'en') {
    const text = `DATE: ${dateStrEN}
TO: ${serviceName} / Customer Billing & Legal Department
SUBJECT: Formal Notice of Immediate Subscription Cancellation and Revocation of Payment Authorization
ACCOUNT / SUBSCRIPTION REF: ${subId}
REGISTERED HOLDER: ${userName} (${userEmail})

To Whom It May Concern,

I hereby exercise my statutory right to immediately terminate my subscription for "${planName}" provided by ${serviceName}.

Pursuant to applicable consumer protection legislation and Article 17 of the General Data Protection Regulation (GDPR - Right to Erasure):

1. IMMEDIATE TERMINATION: This notice serves as unequivocal demand to terminate my subscription plan immediately and cease all recurring renewal mechanisms.
2. REVOCATION OF BILLING MANDATE: All stored payment authorizations, recurring card charge mandates, or tokenized banking agreements registered under my name and email (${userEmail}) are REVOKED with immediate effect. No further debits are authorized.
3. DATA RECTIFICATION: Any biometric, telemetry, or unnecessary payment records must be purged in compliance with statutory retention limits.
4. CONFIRMATION REQUIREMENT: Please provide written confirmation via reply to this email (${userEmail}) acknowledging receipt of this notice, immediate termination of the service, and confirmation that no future renewal charges will occur.

Please consider this notice effective as of ${dateStrEN}.

Respectfully submitted,
${userName}
${userEmail}`;

    const mailto = `mailto:support@${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com?subject=${encodeURIComponent(`Immediate Subscription Cancellation — ${userName} (${subId})`)}&body=${encodeURIComponent(text)}`;

    return { text, mailto, subject: `Immediate Subscription Cancellation — ${userName}` };
  }

  // Default: Türkçe (6502 SK m. 52/4 & KVKK m. 11)
  const text = `TARİH: ${dateStrTR}
KİME: ${serviceName} Müşteri Hizmetleri ve Hukuk/Abonelik Birimi
KONU: Abonelik Sözleşmesinin Derhal Feshi, Otomatik Yenilemenin Durdurulması ve Kayıtlı Kart Yetkilerinin İptali İhtarı
ABONELİK / HESAP NO: ${subId}
HESAP SAHİBİ: ${userName} (${userEmail})

Sayın Yetkili,

Tarafınızca sunulmakta olan "${serviceName} - ${planName}" hizmetine ilişkin aboneliğimi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 52. maddesinin 4. fıkrası ve ilgili mevzuat uyarınca tek taraflı olarak DERHAL VE KOŞULSUZ FESHEDİYORUM.

İşbu yasal bildirim ile:

1. FESİH TALEBİ: Sözleşmemin işbu bildirimin tarafınıza ulaştığı tarih itibarıyla derhal sonlandırılmasını,
2. OTOMATİK ÇEKİM İPTALİ: Hesabıma tanımlı tüm kredi kartı, banka kartı ve sanal kart otomatik yenileme / periyodik tahsilat yetkilerinin derhal iptal edilmesini ve ilerleyen dönemlere ait hiçbir ücret yansıtılmamasını,
3. KİŞİSEL VERİ TALEBİ: 6698 sayılı KVKK kapsamında saklanması zorunlu olmayan finansal verilerimin ve ödeme araçlarımın sistemlerinizden imha edilmesini,
4. YAZILI ONAY ZORUNLULUĞU: Fesih işleminin tamamlandığına, herhangi bir borç bakiyesi kalmadığına ve kartımdan çekim yapılmayacağına dair yazılı onay metninin kayıtlı e-posta adresime (${userEmail}) ivedilikle iletilmesini talep ederim.

Kanunun amir hükmü gereğince, fesih bildiriminin yapılmasından sonra gerçekleşecek herhangi bir haksız kart çekiminde Tüketici Hakem Heyeti ve ilgili denetleyici kurumlara başvurulacağını ihtar ederim.

Bilgilerinize arz ve ihtar olunur.

${userName}
E-Posta: ${userEmail}`;

  const mailto = `mailto:destek@${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com?subject=${encodeURIComponent(`Resmi Abonelik Fesih Bildirimi — ${userName} (${subId})`)}&body=${encodeURIComponent(text)}`;

  return { text, mailto, subject: `Resmi Abonelik Fesih Bildirimi — ${userName}` };
}

module.exports = {
  generateLegalNotice
};
