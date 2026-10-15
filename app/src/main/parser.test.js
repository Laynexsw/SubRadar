/**
 * SubRadar Desktop — Statement Parser & Legal Notice Unit Tests
 */

const assert = require('assert');
const { parseStatement } = require('./statement-parser');
const { generateLegalNotice } = require('./legal-notice');

console.log('--- Testing SubRadar Parser & Legal Notice Modules ---');

// 1. Statement Parser Tests
const mockCsv = `
Tarih,Açıklama,Tutar,Para Birimi
2026-09-01,NETFLIX.COM PAYMENT,-199.99,TRY
2026-09-03,SPOTIFY ISTANBUL TR,-59.99,TRY
2026-09-05,OPENAI CHATGPT PLUS,-20.00,USD
2026-09-10,MARKET HARCAMASI,-450.00,TRY
2026-09-12,GITHUB COPILOT SUBSCRIPTION,-10.00,USD
`;

const detected = parseStatement(mockCsv, 'TRY');
assert(Array.isArray(detected), 'Should return an array');
assert.strictEqual(detected.length, 4, 'Should detect 4 subscriptions, ignoring non-subscription rows');

const netflix = detected.find(s => s.name === 'Netflix');
assert(netflix, 'Should detect Netflix');
assert.strictEqual(netflix.price, 199.99, 'Should extract 199.99 price');
assert.strictEqual(netflix.currency, 'TRY', 'Should extract TRY currency');

const chatgpt = detected.find(s => s.name === 'ChatGPT Plus');
assert(chatgpt, 'Should detect ChatGPT Plus');
assert.strictEqual(chatgpt.currency, 'USD', 'Should detect USD');

console.log('✓ Statement Parser accurately detected subscriptions from CSV sample: PASSED');

// 2. Legal Notice Tests
const noticeTR = generateLegalNotice(
  { name: 'Adobe Creative Cloud', plan: 'Tüm Uygulamalar', subId: 'SUB-123' },
  { name: 'Arda Y.', email: 'user@example.com' },
  'tr'
);

assert(noticeTR.text.includes('6502 sayılı Tüketicinin Korunması'), 'TR notice should cite Law 6502');
assert(noticeTR.text.includes('Adobe Creative Cloud'), 'TR notice should include service name');
assert(noticeTR.text.includes('user@example.com'), 'TR notice should include user email');
assert(noticeTR.mailto.startsWith('mailto:'), 'Should generate valid mailto URI');
console.log('✓ TKHK 6502 Legal Notice Generation: PASSED');

const noticeEN = generateLegalNotice(
  { name: 'Spotify', plan: 'Premium', subId: 'SUB-456' },
  { name: 'John Doe', email: 'john@example.com' },
  'en'
);

assert(noticeEN.text.includes('Article 17 of the General Data Protection Regulation'), 'EN notice should cite GDPR Article 17');
assert(noticeEN.text.includes('Right to Erasure'), 'EN notice should cite Right to Erasure');
assert(noticeEN.text.includes('REVOCATION OF BILLING MANDATE'), 'EN notice should revoke billing mandate');
console.log('✓ GDPR Article 17 Notice Generation: PASSED');

console.log('--- All Parser & Legal Notice Tests Passed Successfully! ---');
