/**
 * SubRadar Desktop — AES-256-CBC Cryptographic Vault Engine
 * 
 * Zero-Knowledge, Offline-First Security Core.
 * Uses Node.js crypto module with Scrypt key derivation and HMAC-SHA256 integrity verification.
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits
const SALT_LENGTH = 16;
const IV_LENGTH = 16;

/**
 * Derives a 32-byte cryptographic key and 32-byte HMAC key using Scrypt.
 * @param {string} masterPassword 
 * @param {Buffer} salt 
 * @returns {{ cipherKey: Buffer, hmacKey: Buffer }}
 */
function deriveKeys(masterPassword, salt) {
  // Derive 64 bytes: first 32 for AES-256, last 32 for HMAC-SHA256
  const derived = crypto.scryptSync(masterPassword, salt, 64, {
    N: 16384,
    r: 8,
    p: 1
  });
  return {
    cipherKey: derived.subarray(0, 32),
    hmacKey: derived.subarray(32, 64)
  };
}

/**
 * Encrypts an arbitrary JavaScript object or string into a sealed vault envelope.
 * @param {any} dataObject 
 * @param {string} masterPassword 
 * @returns {object} Encrypted envelope containing base64 fields and verification token
 */
function encryptVault(dataObject, masterPassword) {
  if (!masterPassword || typeof masterPassword !== 'string') {
    throw new Error('Master password must be a non-empty string.');
  }

  const plaintext = Buffer.from(JSON.stringify(dataObject), 'utf8');
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  const { cipherKey, hmacKey } = deriveKeys(masterPassword, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, cipherKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  // Compute HMAC over salt + iv + ciphertext to ensure integrity
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(salt);
  hmac.update(iv);
  hmac.update(ciphertext);
  const tag = hmac.digest();

  return {
    version: '1.0',
    algorithm: ALGORITHM,
    kdf: 'scrypt',
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    tag: tag.toString('base64'),
    createdAt: new Date().toISOString()
  };
}

/**
 * Decrypts and verifies an encrypted vault envelope.
 * @param {object} envelope 
 * @param {string} masterPassword 
 * @returns {any} Parsed decrypted payload
 */
function decryptVault(envelope, masterPassword) {
  if (!envelope || !envelope.ciphertext || !envelope.salt || !envelope.iv || !envelope.tag) {
    throw new Error('Invalid vault package format.');
  }

  const salt = Buffer.from(envelope.salt, 'base64');
  const iv = Buffer.from(envelope.iv, 'base64');
  const ciphertext = Buffer.from(envelope.ciphertext, 'base64');
  const tag = Buffer.from(envelope.tag, 'base64');

  const { cipherKey, hmacKey } = deriveKeys(masterPassword, salt);

  // 1. Verify HMAC integrity before decryption (avoids padding oracle issues)
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(salt);
  hmac.update(iv);
  hmac.update(ciphertext);
  const computedTag = hmac.digest();

  if (!crypto.timingSafeEqual(tag, computedTag)) {
    throw new Error('Vault verification failed: Incorrect master password or corrupted data.');
  }

  // 2. Decrypt ciphertext
  const decipher = crypto.createDecipheriv(ALGORITHM, cipherKey, iv);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return JSON.parse(decrypted.toString('utf8'));
}

/**
 * Validates whether a provided master password correctly unlocks an envelope.
 * @param {object} envelope 
 * @param {string} masterPassword 
 * @returns {boolean}
 */
function verifyPassword(envelope, masterPassword) {
  try {
    decryptVault(envelope, masterPassword);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  encryptVault,
  decryptVault,
  verifyPassword
};
