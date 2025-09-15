import createCryptModule from './crypt_bin.js';

async function hmacSha256(keyStr, messageStr) {
  const encoder = new TextEncoder();

  const keyData = encoder.encode(keyStr);
  const msgData = encoder.encode(messageStr);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', 
    keyData, 
    { name: 'HMAC', hash: 'SHA-256' }, 
    false, 
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);

  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


let cachedModule = null;

export async function getCryptModule() {
  if (cachedModule) {
    return Promise.resolve(cachedModule);
  }
  const Module = await createCryptModule({
        locateFile: (path_1) => path_1.endsWith('.wasm') ? 'js/crypt/crypt_bin.wasm' : path_1,
    });
    cachedModule = {
        encrypt: Module.encrypt,
        decrypt: Module.decrypt,
    };
    cachedModule.hmacSha256 = hmacSha256;
    return cachedModule;
}

export async function passwordToKey(password, saltStr = "CTDPMZOODz") {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const salt = encoder.encode(saltStr);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const rawBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    256
  );

  const bytes = new Uint8Array(rawBits);
  const base64Key = btoa(String.fromCharCode(...bytes));

  return base64Key;
}

const storedKey = await importKeyFromBase64(localStorage.getItem("encryptionKey"));

export async function importKeyFromBase64(base64) {
  if (base64 != "" && base64 != null) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return crypto.subtle.importKey(
      "raw",
      bytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }
}