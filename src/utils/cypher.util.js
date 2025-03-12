import CryptoJS from 'crypto-js';

export const getEncryptionKey = () => {
  let key = sessionStorage.getItem('ukc');
  if (!key) {
    key = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('cryptoKey', key);
  }
  return key;
};

export const encrypt = (arg) => {
  const key = getEncryptionKey();
  const cipherText = CryptoJS.AES.encrypt(arg, key).toString();
  return cipherText;
};

export const decrypt = (arg) => {
  const key = sessionStorage.getItem('ukc');
  if (!key) {
    console.error('No existe una key en sessionStorage');
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(arg, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
