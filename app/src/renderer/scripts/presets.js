/**
 * SubRadar Desktop — Known Subscription Presets & Direct Kill Switch Registry
 * 
 * Hard-coded direct bypass cancellation links avoiding guilt-trip survey funnels.
 */

const SUB_PRESETS = [
  {
    name: 'Adobe Creative Cloud',
    category: 'Design',
    defaultPlan: 'All Apps',
    defaultPrice: 54.99,
    currency: 'USD',
    color: '#FF0000',
    iconLetter: 'Ad',
    directCancelUrl: 'https://account.adobe.com/plans',
    cancelSteps: 'Adobe Hesap > Planları Yönet > Planı İptal Et (Teklifi Reddet)'
  },
  {
    name: 'JetBrains Toolbox',
    category: 'Development',
    defaultPlan: 'All Products Pack',
    defaultPrice: 28.90,
    currency: 'USD',
    color: '#000000',
    iconLetter: 'JB',
    directCancelUrl: 'https://account.jetbrains.com/licenses',
    cancelSteps: 'JetBrains Account > Licenses > Cancel Auto-Renewal'
  },
  {
    name: 'Figma',
    category: 'Design',
    defaultPlan: 'Professional',
    defaultPrice: 15.00,
    currency: 'USD',
    color: '#A259FF',
    iconLetter: 'Fg',
    directCancelUrl: 'https://www.figma.com/settings',
    cancelSteps: 'Settings > Plan > Cancel Subscription'
  },
  {
    name: 'ChatGPT Plus',
    category: 'AI & Productivity',
    defaultPlan: 'Plus (GPT-4o)',
    defaultPrice: 20.00,
    currency: 'USD',
    color: '#10A37F',
    iconLetter: 'GPT',
    directCancelUrl: 'https://chatgpt.com/#settings/Subscription',
    cancelSteps: 'Settings > Subscription > Manage Subscription > Cancel Plan'
  },
  {
    name: 'Claude Pro',
    category: 'AI & Productivity',
    defaultPlan: 'Pro Team / Individual',
    defaultPrice: 20.00,
    currency: 'USD',
    color: '#D97706',
    iconLetter: 'Cl',
    directCancelUrl: 'https://claude.ai/settings/billing',
    cancelSteps: 'Settings > Billing > Cancel Subscription'
  },
  {
    name: 'GitHub Copilot',
    category: 'Development',
    defaultPlan: 'Copilot Individual',
    defaultPrice: 10.00,
    currency: 'USD',
    color: '#24292F',
    iconLetter: 'GH',
    directCancelUrl: 'https://github.com/settings/billing',
    cancelSteps: 'GitHub Settings > Billing and plans > Cancel Copilot'
  },
  {
    name: 'Netflix',
    category: 'Entertainment',
    defaultPlan: 'Özel (4K UHD)',
    defaultPrice: 22.99,
    currency: 'USD',
    color: '#E50914',
    iconLetter: 'Nf',
    directCancelUrl: 'https://www.netflix.com/youraccount',
    cancelSteps: 'Hesap > Üyeliği İptal Et > İptali Tamamla'
  },
  {
    name: 'Spotify Premium',
    category: 'Entertainment',
    defaultPlan: 'Bireysel',
    defaultPrice: 11.99,
    currency: 'USD',
    color: '#1DB954',
    iconLetter: 'Sp',
    directCancelUrl: 'https://www.spotify.com/account/subscription/',
    cancelSteps: 'Hesap Özeti > Abonelik > Değiştir veya İptal Et'
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment',
    defaultPlan: 'Bireysel / Aile',
    defaultPrice: 13.99,
    currency: 'USD',
    color: '#FF0000',
    iconLetter: 'YT',
    directCancelUrl: 'https://www.youtube.com/paid_memberships',
    cancelSteps: 'Ücretli Üyelikler > Üyeliği Yönet > İptal Et'
  },
  {
    name: 'Amazon Prime',
    category: 'Entertainment',
    defaultPlan: 'Aylık Prime',
    defaultPrice: 14.99,
    currency: 'USD',
    color: '#00A8E1',
    iconLetter: 'Amz',
    directCancelUrl: 'https://www.amazon.com/mc/manage',
    cancelSteps: 'Prime Üyeliğini Yönet > Üyeliği Sonlandır'
  },
  {
    name: 'Canva Pro',
    category: 'Design',
    defaultPlan: 'Pro',
    defaultPrice: 12.99,
    currency: 'USD',
    color: '#00C4CC',
    iconLetter: 'Cv',
    directCancelUrl: 'https://www.canva.com/settings/billing-and-teams',
    cancelSteps: 'Ayarlar > Faturalandırma > Aboneliği İptal Et'
  },
  {
    name: 'Google One',
    category: 'Cloud Storage',
    defaultPlan: '2 TB Depolama',
    defaultPrice: 9.99,
    currency: 'USD',
    color: '#4285F4',
    iconLetter: 'G1',
    directCancelUrl: 'https://one.google.com/settings',
    cancelSteps: 'Ayarlar > Aboneliği İptal Et'
  },
  {
    name: 'Notion',
    category: 'AI & Productivity',
    defaultPlan: 'Plus Plan',
    defaultPrice: 10.00,
    currency: 'USD',
    color: '#000000',
    iconLetter: 'Nt',
    directCancelUrl: 'https://www.notion.so/my-account',
    cancelSteps: 'Settings & Members > Billing > Cancel plan'
  },
  {
    name: 'Midjourney',
    category: 'AI & Productivity',
    defaultPlan: 'Standard Plan',
    defaultPrice: 30.00,
    currency: 'USD',
    color: '#2B2D42',
    iconLetter: 'Mj',
    directCancelUrl: 'https://www.midjourney.com/account',
    cancelSteps: 'Manage Sub > Cancel Plan'
  },
  {
    name: 'AWS Cloud Services',
    category: 'Cloud Storage',
    defaultPlan: 'EC2 / S3 Pay-As-You-Go',
    defaultPrice: 45.00,
    currency: 'USD',
    color: '#FF9900',
    iconLetter: 'AWS',
    directCancelUrl: 'https://console.aws.amazon.com/billing/home',
    cancelSteps: 'AWS Billing Console > Account Settings > Close Account'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUB_PRESETS };
}
