/**
 * SubRadar Desktop — SaaS Presets with Direct Cancellation Portals
 */

const SAAS_PRESETS = [
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    defaultPrice: 2966.52,
    defaultCurrency: 'TRY',
    defaultPlan: 'Tüm Uygulamalar',
    billingCycle: 'monthly',
    directCancelUrl: 'https://account.adobe.com/plans',
    brandColor: '#ff0000',
    iconLetter: 'Ps',
    notes: 'Tasarım ve fotoğraf düzenleme uygulamaları paketi.'
  },
  {
    id: 'figma-pro',
    name: 'Figma Professional',
    category: 'Design',
    defaultPrice: 741.75,
    defaultCurrency: 'TRY',
    defaultPlan: 'Professional Paket',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.figma.com/settings',
    brandColor: '#0acf83',
    iconLetter: 'Fg',
    notes: 'Arayüz tasarım ve ekip çalışma aboneliği.'
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'Design',
    defaultPrice: 349.99,
    defaultCurrency: 'TRY',
    defaultPlan: 'Pro Plan',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.canva.com/settings/billing-and-teams',
    brandColor: '#00c4cc',
    iconLetter: 'Cv',
    notes: 'Görsel tasarım ve hazır şablon üyeliği.'
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'AI & Productivity',
    defaultPrice: 967.00,
    defaultCurrency: 'TRY',
    defaultPlan: 'Plus Üyelik',
    billingCycle: 'monthly',
    directCancelUrl: 'https://chat.openai.com/#settings',
    brandColor: '#10a37f',
    iconLetter: 'AI',
    notes: 'Yapay zekâ asistanı aylık üyeliği.'
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    category: 'AI & Productivity',
    defaultPrice: 967.00,
    defaultCurrency: 'TRY',
    defaultPlan: 'Pro Üyelik',
    billingCycle: 'monthly',
    directCancelUrl: 'https://claude.ai/settings/billing',
    brandColor: '#d97706',
    iconLetter: 'Cl',
    notes: 'Gelişmiş yapay zekâ yazım ve analiz üyeliği.'
  },
  {
    id: 'cursor-pro',
    name: 'Cursor AI',
    category: 'Development',
    defaultPrice: 967.00,
    defaultCurrency: 'TRY',
    defaultPlan: 'Pro Paket',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.cursor.com/settings',
    brandColor: '#6366f1',
    iconLetter: 'Cr',
    notes: 'Yapay zekâ destekli yazılım geliştirme aracı.'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'Development',
    defaultPrice: 483.50,
    defaultCurrency: 'TRY',
    defaultPlan: 'Bireysel Paket',
    billingCycle: 'monthly',
    directCancelUrl: 'https://github.com/settings/billing',
    brandColor: '#24292e',
    iconLetter: 'Gh',
    notes: 'Kodlama asistanı aylık aboneliği.'
  },
  {
    id: 'jetbrains-pack',
    name: 'JetBrains Toolbox',
    category: 'Development',
    defaultPrice: 1429.11,
    defaultCurrency: 'TRY',
    defaultPlan: 'Tüm Ürünler Paketi',
    billingCycle: 'monthly',
    directCancelUrl: 'https://account.jetbrains.com/licenses',
    brandColor: '#000000',
    iconLetter: 'Jb',
    notes: 'Profesyonel yazılım geliştirme araçları paketi.'
  },
  {
    id: 'midjourney-standard',
    name: 'Midjourney',
    category: 'AI & Productivity',
    defaultPrice: 1450.50,
    defaultCurrency: 'TRY',
    defaultPlan: 'Standart Üyelik',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.midjourney.com/account',
    brandColor: '#3b82f6',
    iconLetter: 'Mj',
    notes: 'Yapay zekâ ile görsel oluşturma aboneliği.'
  },
  {
    id: 'netflix-standard',
    name: 'Netflix',
    category: 'Streaming',
    defaultPrice: 299.99,
    defaultCurrency: 'TRY',
    defaultPlan: 'Standart Plan',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.netflix.com/cancelplan',
    brandColor: '#e50914',
    iconLetter: 'Nf',
    notes: 'HD 2 Ekran yayın aboneliği.'
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    category: 'Streaming',
    defaultPrice: 99.99,
    defaultCurrency: 'TRY',
    defaultPlan: 'Bireysel Premium',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.spotify.com/account/subscription/change/',
    brandColor: '#1db954',
    iconLetter: 'Sp',
    notes: 'Reklamsız müzik dinleme.'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'Streaming',
    defaultPrice: 115.99,
    defaultCurrency: 'TRY',
    defaultPlan: 'Bireysel Üyelik',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.youtube.com/paid_memberships',
    brandColor: '#ff0000',
    iconLetter: 'Yt',
    notes: 'YouTube Music & Reklamsız video.'
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    category: 'Streaming',
    defaultPrice: 49.90,
    defaultCurrency: 'TRY',
    defaultPlan: 'Prime Video & Kargo',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.amazon.com.tr/mc/manage',
    brandColor: '#00a8e1',
    iconLetter: 'Am',
    notes: 'Yıllık veya aylık Prime paketi.'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'Streaming',
    defaultPrice: 164.99,
    defaultCurrency: 'TRY',
    defaultPlan: 'Standart Üyelik',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.disneyplus.com/account',
    brandColor: '#113ccf',
    iconLetter: 'D+',
    notes: 'Dizi ve film akış servisi.'
  },
  {
    id: 'notion-plus',
    name: 'Notion Plus',
    category: 'AI & Productivity',
    defaultPrice: 483.50,
    defaultCurrency: 'TRY',
    defaultPlan: 'Plus Plan',
    billingCycle: 'monthly',
    directCancelUrl: 'https://www.notion.so/settings',
    brandColor: '#000000',
    iconLetter: 'Nt',
    notes: 'Sınırsız blok ve ekip çalışma alanı.'
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud',
    category: 'Cloud & Hosting',
    defaultPrice: 2417.50,
    defaultCurrency: 'TRY',
    defaultPlan: 'EC2 & S3 Alt Yapı',
    billingCycle: 'monthly',
    directCancelUrl: 'https://console.aws.amazon.com/billing/',
    brandColor: '#ff9900',
    iconLetter: 'Aws',
    notes: 'Boşta çalışan unutulmuş sanal sunucu ve diskler.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SAAS_PRESETS;
}
