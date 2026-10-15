/**
 * SubRadar Desktop — Secure Local Storage Manager
 * 
 * Persists AES-256 encrypted vault to local disk.
 * Keeps memory isolated and securely wipes plain secrets when locked.
 */

const fs = require('fs');
const path = require('path');
const { encryptVault, decryptVault, verifyPassword } = require('./vault');

class SecureVaultStore {
  /**
   * @param {string} storageDir Directory where the encrypted vault file is stored
   */
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.vaultFilePath = path.join(this.storageDir, 'encrypted_sqlite_aes256.subradar');
    this.cachedData = null;
    this.currentPassword = null;
    this.isUnlocked = false;

    // Ensure storage directory exists
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * Checks if an encrypted vault file already exists on disk.
   * @returns {boolean}
   */
  hasVaultFile() {
    return fs.existsSync(this.vaultFilePath);
  }

  /**
   * Reads raw encrypted envelope from disk.
   * @returns {object|null}
   */
  readEnvelope() {
    if (!this.hasVaultFile()) return null;
    try {
      const raw = fs.readFileSync(this.vaultFilePath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read vault envelope:', err);
      return null;
    }
  }

  /**
   * Initializes a brand new vault with master password.
   * @param {string} masterPassword 
   * @param {object} initialData 
   */
  setupNewVault(masterPassword, initialData = null) {
    const defaultData = initialData || {
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userPreferences: {
        currency: 'TRY',
        theme: 'dark',
        alertDaysAhead: 2,
        language: 'tr',
        userName: 'Abonelik Yöneticisi',
        userEmail: 'kullanici@subradar.local'
      },
      subscriptions: [
        {
          id: 'sub-adobe-cc',
          name: 'Adobe Creative Cloud',
          plan: 'Tüm Uygulamalar',
          price: 2966.52,
          currency: 'TRY',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          category: 'Design',
          status: 'idle', // 'active' | 'trial' | 'idle' | 'cancelled'
          trialEndDate: null,
          directCancelUrl: 'https://account.adobe.com/plans',
          notes: 'Son 51 gündür arka plan işlemi başlatılmadı.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-jetbrains-pack',
          name: 'JetBrains Toolbox',
          plan: 'All Products Pack',
          price: 1429.11,
          currency: 'TRY',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
          category: 'Development',
          status: 'idle',
          trialEndDate: null,
          directCancelUrl: 'https://account.jetbrains.com/licenses',
          notes: '2 yerel geliştirici profilinde koltuklar atanmamış.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-figma-pro',
          name: 'Figma Professional',
          plan: 'Ekip Lisansı',
          price: 741.75,
          currency: 'TRY',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
          category: 'Design',
          status: 'active',
          trialEndDate: null,
          directCancelUrl: 'https://www.figma.com/settings',
          notes: 'Bu hafta 34 saat açık, vazgeçilmez iş akışı.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-chatgpt-plus',
          name: 'ChatGPT Plus',
          plan: 'Pro AI Asistanı',
          price: 967.00,
          currency: 'TRY',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          category: 'AI & Productivity',
          status: 'trial',
          trialEndDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          directCancelUrl: 'https://chat.openai.com/#settings',
          notes: '48 saat içinde deneme süresi bitiyor! Kart çekimi tetiklenecek.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-spotify-prem',
          name: 'Spotify Premium',
          plan: 'Bireysel Plan',
          price: 99.99,
          currency: 'TRY',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          category: 'Streaming',
          status: 'active',
          trialEndDate: null,
          directCancelUrl: 'https://www.spotify.com/account/subscription/change/',
          notes: 'Düzenli dinleniyor.',
          cancellationProtocolExecuted: false
        }
      ]
    };

    const envelope = encryptVault(defaultData, masterPassword);
    fs.writeFileSync(this.vaultFilePath, JSON.stringify(envelope, null, 2), 'utf8');

    this.cachedData = defaultData;
    this.currentPassword = masterPassword;
    this.isUnlocked = true;
    return defaultData;
  }

  /**
   * Attempts to unlock the encrypted vault file using master password.
   * @param {string} masterPassword 
   * @returns {object} Decrypted data
   */
  unlockVault(masterPassword) {
    const envelope = this.readEnvelope();
    if (!envelope) {
      throw new Error('No vault file found. Setup required.');
    }

    const decrypted = decryptVault(envelope, masterPassword);
    this.cachedData = decrypted;
    this.currentPassword = masterPassword;
    this.isUnlocked = true;
    return decrypted;
  }

  /**
   * Locks the vault immediately, wiping plaintext from memory.
   */
  lockVault() {
    this.cachedData = null;
    this.currentPassword = null;
    this.isUnlocked = false;
  }

  /**
   * Persists current in-memory data to encrypted disk file.
   */
  saveVault() {
    if (!this.isUnlocked || !this.currentPassword || !this.cachedData) {
      throw new Error('Cannot save: Vault is locked.');
    }
    this.cachedData.updatedAt = new Date().toISOString();
    const envelope = encryptVault(this.cachedData, this.currentPassword);
    fs.writeFileSync(this.vaultFilePath, JSON.stringify(envelope, null, 2), 'utf8');
    return true;
  }

  /**
   * Changes the master password by re-encrypting with the new key.
   * @param {string} oldPassword 
   * @param {string} newPassword 
   */
  changePassword(oldPassword, newPassword) {
    if (!this.isUnlocked) {
      this.unlockVault(oldPassword);
    }
    this.currentPassword = newPassword;
    this.saveVault();
    return true;
  }

  /**
   * Exports an encrypted backup envelope to a custom destination file path.
   * @param {string} exportPath 
   */
  exportBackup(exportPath) {
    const envelope = this.readEnvelope();
    if (!envelope) throw new Error('No vault data to export.');
    fs.writeFileSync(exportPath, JSON.stringify(envelope, null, 2), 'utf8');
    return true;
  }

  /**
   * Imports an external encrypted backup and replaces the active vault file.
   * @param {string} importPath 
   * @param {string} masterPassword 
   */
  importBackup(importPath, masterPassword) {
    const raw = fs.readFileSync(importPath, 'utf8');
    const envelope = JSON.parse(raw);
    // Verify password unlocks the imported file
    const decrypted = decryptVault(envelope, masterPassword);

    // Save as current vault
    fs.writeFileSync(this.vaultFilePath, JSON.stringify(envelope, null, 2), 'utf8');
    this.cachedData = decrypted;
    this.currentPassword = masterPassword;
    this.isUnlocked = true;
    return decrypted;
  }

  /**
   * Completely resets the vault and removes the encrypted file.
   */
  factoryReset() {
    this.lockVault();
    if (this.hasVaultFile()) {
      fs.unlinkSync(this.vaultFilePath);
    }
    return true;
  }
}

module.exports = SecureVaultStore;
