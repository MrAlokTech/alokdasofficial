/**
 * crypto.js — AES-256-GCM On-the-Fly Encryption & Decryption
 * Encrypts sensitive personal emergency details before storing in KV.
 */

/**
 * Import a 32-byte hex/base64 string key into WebCrypto AES-GCM Key object
 */
async function getAesKey(secretStr) {
  const encoder = new TextEncoder();
  let keyBytes;
  
  // If hex string (64 chars)
  if (/^[0-9a-fA-F]{64}$/.test(secretStr)) {
    keyBytes = new Uint8Array(secretStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  } else {
    // UTF-8 fallback (hashed to 32 bytes SHA-256)
    keyBytes = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(secretStr)));
  }

  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypt JavaScript Object into encrypted envelope { iv, ciphertext }
 */
export async function encryptPayload(dataObj, secretKeyStr) {
  const encoder = new TextEncoder();
  const jsonStr = JSON.stringify(dataObj);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const key = await getAesKey(secretKeyStr);
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(jsonStr)
  );

  return {
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(ciphertextBuffer)
  };
}

/**
 * Decrypt encrypted envelope { iv, ciphertext } back to JavaScript Object
 */
export async function decryptPayload(envelope, secretKeyStr) {
  let cipherObj = envelope;
  
  // Unwrap nested JSON strings if double-stringified
  while (typeof cipherObj === "string") {
    try {
      const parsed = JSON.parse(cipherObj);
      if (parsed && (typeof parsed === "object" || typeof parsed === "string")) {
        cipherObj = parsed;
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }

  if (!cipherObj || typeof cipherObj !== "object") {
    throw new Error(`Invalid cipher structure. KV content is not a valid JSON object.`);
  }

  // If user accidentally uploaded unencrypted raw person object directly to KV
  if (cipherObj.person || cipherObj.emergencyContacts) {
    throw new Error(`Unencrypted raw data detected in KV. Please encrypt your JSON file using 'node scripts/admin-ice.js encrypt' before uploading.`);
  }

  if (!cipherObj.iv || !cipherObj.ciphertext) {
    const keysFound = Object.keys(cipherObj).join(", ") || "none";
    throw new Error(`Missing 'iv' or 'ciphertext' in KV envelope (Found keys: [${keysFound}]). Please re-run 'node scripts/admin-ice.js encrypt'.`);
  }

  const iv = new Uint8Array(base64ToBuffer(cipherObj.iv));
  const ciphertext = base64ToBuffer(cipherObj.ciphertext);
  const key = await getAesKey(secretKeyStr);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedBuffer));
}
