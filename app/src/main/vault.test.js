/**
 * SubRadar Desktop — Zero-Dependency Vault Cryptography Tests
 */

const assert = require('assert');
const { encryptVault, decryptVault, verifyPassword } = require('./vault');

console.log('--- Testing SubRadar AES-256 Vault Core ---');

const masterPass = 'SuperSecretKey2026!#';
const sampleData = {
  subscriptions: [
    { id: 'sub-1', name: 'Adobe Creative Cloud', price: 54.99, status: 'idle' },
    { id: 'sub-2', name: 'GitHub Copilot', price: 10.00, status: 'active' }
  ],
  preferences: { currency: 'TRY', theme: 'dark' }
};

// 1. Encrypt
const envelope = encryptVault(sampleData, masterPass);
assert.strictEqual(envelope.algorithm, 'aes-256-cbc');
assert.strictEqual(envelope.kdf, 'scrypt');
assert(typeof envelope.ciphertext === 'string' && envelope.ciphertext.length > 0);
assert(typeof envelope.salt === 'string' && envelope.salt.length > 0);
assert(typeof envelope.tag === 'string' && envelope.tag.length > 0);
console.log('✓ Encrypted Envelope created successfully');

// 2. Correct Password Verification
assert.strictEqual(verifyPassword(envelope, masterPass), true);
console.log('✓ Correct password verification: PASSED');

// 3. Wrong Password Rejection
assert.strictEqual(verifyPassword(envelope, 'WrongPassword123!'), false);
assert.throws(() => {
  decryptVault(envelope, 'WrongPassword123!');
}, /Vault verification failed/);
console.log('✓ Wrong password verification rejected: PASSED');

// 4. Exact Payload Match
const decrypted = decryptVault(envelope, masterPass);
assert.deepStrictEqual(decrypted, sampleData);
console.log('✓ Decrypted payload exact match: PASSED');

// 5. Corrupted Tag Rejection
const tamperedEnvelope = { ...envelope, tag: Buffer.from('TamperedTagBuffer1234567890123456').toString('base64') };
assert.strictEqual(verifyPassword(tamperedEnvelope, masterPass), false);
console.log('✓ Tampered HMAC verification rejected: PASSED');

console.log('--- All Crypto Tests Passed Successfully! ---');
