/**
 * SubRadar Desktop — Secure Local Storage Manager
 * 
 * Persists the AES-256 encrypted envelope to local disk.
 * Keeps memory isolated and clears secrets when locked.
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
   * Checks if a vault file already exists on disk.
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
        currency: 'USD',
        theme: 'dark',
        alertDaysAhead: 2,
        language: 'tr'
      },
      subscriptions: [
        {
          id: 'sub-adobe-cc',
          name: 'Adobe Creative Cloud',
          plan: 'Tüm Uygulamalar',
          price: 54.99,
          currency: 'USD',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
          category: 'Design',
          status: 'idle', // 'active' | 'trial' | 'idle' | 'cancelled'
          trialEndDate: null,
          directCancelUrl: 'https://account.adobe.com/plans',
          notes: 'Son 45 gündür hiç Illustrator/Photoshop açılmadı.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-jetbrains-pack',
          name: 'JetBrains Toolbox',
          plan: 'All Products Pack',
          price: 28.90,
          currency: 'USD',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          category: 'Development',
          status: 'idle',
          trialEndDate: null,
          directCancelUrl: 'https://account.jetbrains.com/licenses',
          notes: 'Ekip profilinde boşta duruyor.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-figma-pro',
          name: 'Figma Professional',
          plan: 'Editor Seat',
          price: 15.00,
          currency: 'USD',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          category: 'Design',
          status: 'trial', // Deneme bitmek üzere!
          trialEndDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          directCancelUrl: 'https://www.figma.com/settings',
          notes: '14 günlük deneme sürümü 2 gün içinde faturaya dönüşecek.',
          cancellationProtocolExecuted: false
        },
        {
          id: 'sub-chatgpt-plus',
          name: 'ChatGPT Plus',
          plan: 'GPT-4o & Canvas',
          price: 20.00,
          currency: 'USD',
          billingCycle: 'monthly',
          nextRenewalDate: new Date(Date.now() + 22 * 86400000).toISOString().split('T')[0],
          category: 'AI & Productivity',
          status: 'active',
          trialEndDate: null,
          directCancelUrl: 'https://chatgpt.com/#settings/Subscription',
          notes: 'Vazgeçilmez günlük akış.',
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
   * Unlocks the vault with master password.
   * @param {string} masterPassword 
   * @returns {object} Decrypted vault payload
   */
  unlock(masterPassword) {
    const envelope = this.readEnvelope();
    if (!envelope) {
      throw new Error('No vault file exists. Setup is required first.');
    }

    const decrypted = decryptVault(envelope, masterPassword);
    this.cachedData = decrypted;
    this.currentPassword = masterPassword;
    this.isUnlocked = true;
    return decrypted;
  }

  /**
   * Locks the vault and completely wipes memory cache.
   */
  lock() {
    this.cachedData = null;
    this.currentPassword = null;
    this.isUnlocked = false;
  }

  /**
   * Saves updated data back to disk in encrypted envelope.
   * @param {object} updatedData 
   */
  save(updatedData) {
    if (!this.isUnlocked || !this.currentPassword) {
      throw new Error('Cannot save to vault: Vault is locked.');
    }

    updatedData.updatedAt = new Date().toISOString();
    const envelope = encryptVault(updatedData, this.currentPassword);
    fs.writeFileSync(this.vaultFilePath, JSON.stringify(envelope, null, 2), 'utf8');
    this.cachedData = updatedData;
    return updatedData;
  }

  /**
   * Returns in-memory cached vault payload.
   * @returns {object|null}
   */
  getData() {
    if (!this.isUnlocked) {
      throw new Error('Vault is currently locked.');
    }
    return this.cachedData;
  }

  /**
   * Exports an encrypted backup (.subradar) to a target path.
   * @param {string} destinationFilePath 
   */
  exportBackup(destinationFilePath) {
    const envelope = this.readEnvelope();
    if (!envelope) throw new Error('No vault to export.');
    fs.copyFileSync(this.vaultFilePath, destinationFilePath);
  }

  /**
   * Restores an encrypted backup from a file path.
   * @param {string} sourceFilePath 
   * @param {string} masterPassword 
   */
  importBackup(sourceFilePath, masterPassword) {
    const raw = fs.readFileSync(sourceFilePath, 'utf8');
    const envelope = JSON.parse(raw);
    // Verify password unlocks the imported file
    const decrypted = decryptVault(envelope, masterPassword);

    // Save as active vault
    fs.writeFileSync(this.vaultFilePath, JSON.stringify(envelope, null, 2), 'utf8');
    this.cachedData = decrypted;
    this.currentPassword = masterPassword;
    this.isUnlocked = true;
    return decrypted;
  }
}

module.exports = SecureVaultStore;
