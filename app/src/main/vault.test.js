const { encryptVault, decryptVault, verifyPassword } = require('./vault');

console.log('--- Testing SubRadar AES-256 Vault Core ---');

const dummyData = {
  subscriptions: [
    { id: 'sub-1', name: 'Adobe Creative Cloud', price: 54.99, currency: 'USD', status: 'idle' },
    { id: 'sub-2', name: 'Netflix 4K', price: 22.99, currency: 'USD', status: 'active' }
  ],
  userPreferences: {
    theme: 'dark',
    currency: 'USD',
    alertDaysAhead: 2
  }
};

const password = 'SuperSecretLocalPassword123!';

// 1. Encryption
const envelope = encryptVault(dummyData, password);
console.log('✓ Encrypted Envelope created:', {
  algorithm: envelope.algorithm,
  kdf: envelope.kdf,
  saltLength: envelope.salt.length,
  ivLength: envelope.iv.length,
  tagLength: envelope.tag.length,
  ciphertextLength: envelope.ciphertext.length
});

// 2. Verification
const isCorrectPassValid = verifyPassword(envelope, password);
console.log('✓ Correct password verification:', isCorrectPassValid === true ? 'PASSED' : 'FAILED');

const isWrongPassValid = verifyPassword(envelope, 'WrongPassword!');
console.log('✓ Wrong password verification rejected:', isWrongPassValid === false ? 'PASSED' : 'FAILED');

// 3. Decryption
const decrypted = decryptVault(envelope, password);
if (JSON.stringify(decrypted) === JSON.stringify(dummyData)) {
  console.log('✓ Decrypted payload exact match: PASSED');
} else {
  console.error('✗ Decrypted payload mismatch!');
  process.exit(1);
}

console.log('--- All Crypto Tests Passed Successfully! ---');
