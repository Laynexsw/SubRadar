/**
 * SubRadar Desktop — 100% Offline Bank Statement / Extrait Scanner
 * 
 * Parses CSV or plain-text bank statements entirely in local memory.
 * Zero data ever leaves the local device.
 */

const KNOWN_SERVICES = [
  { match: /netflix/i, name: 'Netflix', category: 'Streaming', defaultPlan: 'Standart Plan', cancelUrl: 'https://www.netflix.com/cancelplan' },
  { match: /spotify/i, name: 'Spotify', category: 'Streaming', defaultPlan: 'Premium Bireysel', cancelUrl: 'https://www.spotify.com/account/subscription/change/' },
  { match: /adobe|photoshop|creative cloud/i, name: 'Adobe Creative Cloud', category: 'Design', defaultPlan: 'Tüm Uygulamalar', cancelUrl: 'https://account.adobe.com/plans' },
  { match: /openai|chatgpt/i, name: 'ChatGPT Plus', category: 'AI & Productivity', defaultPlan: 'Plus Tier', cancelUrl: 'https://chat.openai.com/#settings' },
  { match: /github.*copilot|github/i, name: 'GitHub Copilot', category: 'Development', defaultPlan: 'Individual Plan', cancelUrl: 'https://github.com/settings/billing' },
  { match: /figma/i, name: 'Figma', category: 'Design', defaultPlan: 'Professional', cancelUrl: 'https://www.figma.com/settings' },
  { match: /jetbrains/i, name: 'JetBrains Toolbox', category: 'Development', defaultPlan: 'All Products Pack', cancelUrl: 'https://account.jetbrains.com/licenses' },
  { match: /youtube.*premium|google.*youtube/i, name: 'YouTube Premium', category: 'Streaming', defaultPlan: 'Bireysel Üyelik', cancelUrl: 'https://www.youtube.com/paid_memberships' },
  { match: /amazon.*prime|prime.*video/i, name: 'Amazon Prime', category: 'Streaming', defaultPlan: 'Aylık Prime', cancelUrl: 'https://www.amazon.com/mc/manage' },
  { match: /canva/i, name: 'Canva Pro', category: 'Design', defaultPlan: 'Pro Yıllık/Aylık', cancelUrl: 'https://www.canva.com/settings/billing-and-teams' },
  { match: /cursor/i, name: 'Cursor AI', category: 'Development', defaultPlan: 'Pro Plan', cancelUrl: 'https://www.cursor.com/settings' },
  { match: /midjourney/i, name: 'Midjourney', category: 'AI & Productivity', defaultPlan: 'Standard Plan', cancelUrl: 'https://www.midjourney.com/account' },
  { match: /anthropic|claude/i, name: 'Claude Pro', category: 'AI & Productivity', defaultPlan: 'Pro Subscription', cancelUrl: 'https://claude.ai/settings/billing' },
  { match: /notion/i, name: 'Notion Plus', category: 'AI & Productivity', defaultPlan: 'Plus Plan', cancelUrl: 'https://www.notion.so/settings' },
  { match: /disney.*plus|disney\+/i, name: 'Disney+', category: 'Streaming', defaultPlan: 'Standart Üyelik', cancelUrl: 'https://www.disneyplus.com/account' },
  { match: /apple\.com\/bill|itunes/i, name: 'Apple Aboneliği', category: 'Productivity', defaultPlan: 'iCloud / Services', cancelUrl: 'https://reportaproblem.apple.com/' },
  { match: /google.*storage|google.*one/i, name: 'Google One', category: 'Productivity', defaultPlan: '100 GB Depolama', cancelUrl: 'https://one.google.com/settings' },
  { match: /aws|amazon web services/i, name: 'AWS Cloud', category: 'Cloud & Hosting', defaultPlan: 'Usage Charges', cancelUrl: 'https://console.aws.amazon.com/billing/' }
];

/**
 * Parses raw statement text / CSV content and returns detected recurring subscriptions.
 * @param {string} rawContent 
 * @param {string} defaultCurrency 
 * @returns {Array<object>} Detected subscriptions
 */
function parseStatement(rawContent, defaultCurrency = 'TRY') {
  if (!rawContent || typeof rawContent !== 'string') return [];

  const lines = rawContent.split(/\r?\n/);
  const detected = [];
  const seenServices = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) continue;

    for (const service of KNOWN_SERVICES) {
      if (service.match.test(trimmed)) {
        if (seenServices.has(service.name)) continue;
        seenServices.add(service.name);

        // Try extracting price from numbers in the line (e.g. 54.99 or 349,00 or ₺120)
        let extractedPrice = 0;
        let detectedCurrency = defaultCurrency;

        if (/₺|tl|try/i.test(trimmed)) detectedCurrency = 'TRY';
        else if (/\$|usd/i.test(trimmed)) detectedCurrency = 'USD';
        else if (/€|eur/i.test(trimmed)) detectedCurrency = 'EUR';

        // Extract floating/decimal numbers
        const priceMatches = trimmed.match(/(\d+[.,]\d{2})|(\d{2,4})/g);
        if (priceMatches && priceMatches.length > 0) {
          const rawNum = priceMatches[priceMatches.length - 1].replace(',', '.');
          const parsed = parseFloat(rawNum);
          if (!isNaN(parsed) && parsed > 0 && parsed < 10000) {
            extractedPrice = parsed;
          }
        }

        detected.push({
          id: `detected-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: service.name,
          plan: service.defaultPlan,
          price: extractedPrice || 199.00,
          currency: detectedCurrency,
          billingCycle: 'monthly',
          category: service.category,
          status: 'idle', // Flags as potential idle/risk review by default
          directCancelUrl: service.cancelUrl,
          rawExtractedLine: trimmed.substring(0, 80),
          notes: 'Yerel ekstre taramasında otomatik tespit edildi.'
        });
        break;
      }
    }
  }

  return detected;
}

module.exports = {
  parseStatement,
  KNOWN_SERVICES
};
