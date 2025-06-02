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