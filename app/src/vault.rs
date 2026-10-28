//! SubRadar v1.0 — %100 Saf Rust AES-256-CBC + HMAC-SHA256 Yerel Şifreli Kasa Motoru (`vault.rs`)

use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::models::VaultPayload;

type Aes256CbcEnc = cbc::Encryptor<aes::Aes256>;
type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;
type HmacSha256 = Hmac<Sha256>;

const PBKDF2_ITERATIONS: u32 = 12_000;
pub const VAULT_FILENAME: &str = "encrypted_sqlite_aes256.subradar";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EncryptedEnvelope {
    pub version: String,
    pub algorithm: String,
    pub kdf: String,
    pub salt: String,
    pub iv: String,
    pub ciphertext: String,
    pub tag: String,
}

fn generate_entropy_bytes(seed_label: &[u8]) -> [u8; 16] {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let pid = std::process::id();
    let mut hasher = Sha256::new();
    hasher.update(nanos.to_le_bytes());
    hasher.update(pid.to_le_bytes());
    hasher.update(seed_label);
    let digest = hasher.finalize();
    let mut out = [0u8; 16];
    out.copy_from_slice(&digest[..16]);
    out
}

fn derive_keys(master_password: &str, salt: &[u8]) -> ([u8; 32], [u8; 32]) {
    let mut derived = [0u8; 64];
    pbkdf2::pbkdf2_hmac::<Sha256>(
        master_password.as_bytes(),
        salt,
        PBKDF2_ITERATIONS,
        &mut derived,
    );
    let mut cipher_key = [0u8; 32];
    let mut hmac_key = [0u8; 32];
    cipher_key.copy_from_slice(&derived[..32]);
    hmac_key.copy_from_slice(&derived[32..64]);
    (cipher_key, hmac_key)
}

pub fn encrypt_vault(
    payload: &VaultPayload,
    master_password: &str,
) -> Result<EncryptedEnvelope, String> {
    if master_password.trim().is_empty() {
        return Err("Ana şifre boş olamaz.".to_string());
    }

    let plaintext = serde_json::to_vec(payload)
        .map_err(|e| format!("Veri serileştirme hatası: {}", e))?;
    let salt = generate_entropy_bytes(b"subradar-v1-salt");
    let iv = generate_entropy_bytes(b"subradar-v1-iv");

    let (cipher_key, hmac_key) = derive_keys(master_password, &salt);

    let ciphertext = Aes256CbcEnc::new_from_slices(&cipher_key, &iv)
        .map_err(|_| "Şifreleme başlatılamadı.".to_string())?
        .encrypt_padded_vec_mut::<Pkcs7>(&plaintext);

    let mut mac = <HmacSha256 as Mac>::new_from_slice(&hmac_key)
        .map_err(|_| "HMAC anahtarı oluşturulamadı.".to_string())?;
    mac.update(&salt);
    mac.update(&iv);
    mac.update(&ciphertext);
    let tag = mac.finalize().into_bytes();

    Ok(EncryptedEnvelope {
        version: "1.0".to_string(),
        algorithm: "aes-256-cbc".to_string(),
        kdf: "pbkdf2-hmac-sha256".to_string(),
        salt: B64.encode(salt),
        iv: B64.encode(iv),
        ciphertext: B64.encode(ciphertext),
        tag: B64.encode(tag),
    })
}

pub fn decrypt_vault(
    envelope: &EncryptedEnvelope,
    master_password: &str,
) -> Result<VaultPayload, String> {
    if master_password.is_empty() {
        return Err("Lütfen ana şifrenizi girin.".to_string());
    }

    let salt = B64
        .decode(&envelope.salt)
        .map_err(|_| "Geçersiz kasa tuzu (salt).".to_string())?;
    let iv = B64
        .decode(&envelope.iv)
        .map_err(|_| "Geçersiz kasa vektörü (IV).".to_string())?;
    let ciphertext = B64
        .decode(&envelope.ciphertext)
        .map_err(|_| "Geçersiz şifreli veri.".to_string())?;
    let tag = B64
        .decode(&envelope.tag)
        .map_err(|_| "Geçersiz doğrulama etiketi.".to_string())?;

    let (cipher_key, hmac_key) = derive_keys(master_password, &salt);

    let mut mac = <HmacSha256 as Mac>::new_from_slice(&hmac_key)
        .map_err(|_| "HMAC doğrulayıcı başlatılamadı.".to_string())?;
    mac.update(&salt);
    mac.update(&iv);
    mac.update(&ciphertext);

    mac.verify_slice(&tag)
        .map_err(|_| "Hatalı ana şifre veya değiştirilmiş kasa verisi.".to_string())?;

    let decrypted = Aes256CbcDec::new_from_slices(&cipher_key, &iv)
        .map_err(|_| "Şifre çözücü başlatılamadı.".to_string())?
        .decrypt_padded_vec_mut::<Pkcs7>(&ciphertext)
        .map_err(|_| "Şifre çözme başarısız oldu.".to_string())?;

    serde_json::from_slice::<VaultPayload>(&decrypted)
        .map_err(|e| format!("Kasa verisi okunamadı: {}", e))
}

pub fn verify_password(envelope: &EncryptedEnvelope, master_password: &str) -> bool {
    decrypt_vault(envelope, master_password).is_ok()
}

pub fn default_vault_path() -> PathBuf {
    std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join(VAULT_FILENAME)
}

pub fn save_vault_to_file(
    path: &Path,
    payload: &VaultPayload,
    master_password: &str,
) -> Result<(), String> {
    let envelope = encrypt_vault(payload, master_password)?;
    let json = serde_json::to_string_pretty(&envelope)
        .map_err(|e| format!("JSON oluşturulamadı: {}", e))?;
    fs::write(path, json).map_err(|e| format!("Kasa dosyası kaydedilemedi: {}", e))
}

pub fn load_vault_from_file(
    path: &Path,
    master_password: &str,
) -> Result<VaultPayload, String> {
    let raw = fs::read_to_string(path)
        .map_err(|e| format!("Kasa dosyası okunamadı: {}", e))?;
    let envelope: EncryptedEnvelope = serde_json::from_str(&raw)
        .map_err(|_| "Bozyuk veya uyumsuz kasa dosyası formatı.".to_string())?;
    decrypt_vault(&envelope, master_password)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_and_decrypt_roundtrip() {
        let payload = VaultPayload::default();
        let pass = "subradar2026";
        let env = encrypt_vault(&payload, pass).expect("encryption should succeed");
        assert_eq!(env.version, "1.0");
        assert_eq!(env.algorithm, "aes-256-cbc");

        assert!(verify_password(&env, pass));
        let unlocked = decrypt_vault(&env, pass).expect("decryption should succeed");
        assert_eq!(unlocked, payload);
    }

    #[test]
    fn test_wrong_password_rejected() {
        let payload = VaultPayload::default();
        let env = encrypt_vault(&payload, "DogruSifre123!").unwrap();
        assert!(!verify_password(&env, "YanlisSifre999!"));
        assert!(decrypt_vault(&env, "YanlisSifre999!").is_err());
    }

    #[test]
    fn test_tampered_hmac_rejected() {
        let payload = VaultPayload::default();
        let mut env = encrypt_vault(&payload, "subradar2026").unwrap();
        env.tag = B64.encode([0xAAu8; 32]);
        assert!(!verify_password(&env, "subradar2026"));
        assert!(decrypt_vault(&env, "subradar2026").is_err());
    }
}
