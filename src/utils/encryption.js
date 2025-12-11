import CryptoJS from 'crypto-js';

// Use a combination of user ID and a secret for encryption
// In production, this should be an environment variable
const ENCRYPTION_KEY = 'tracker-hub-secure-key-2024';

export const encryptData = (data, userId) => {
  try {
    const key = `${ENCRYPTION_KEY}-${userId}`;
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData, userId) => {
  try {
    const key = `${ENCRYPTION_KEY}-${userId}`;
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
