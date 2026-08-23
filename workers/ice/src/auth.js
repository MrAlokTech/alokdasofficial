/**
 * auth.js — HMAC Signed Session Cookie Management
 * Binds session cookies strictly to a single secret token with a 5-minute lifespan.
 */

const SESSION_TTL_SECONDS = 300; // 5 minutes

/**
 * Import raw string secret into WebCrypto HMAC-SHA256 key
 */
async function getHmacKey(secretStr) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secretStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Convert ArrayBuffer to URL-safe base64
 */
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Convert URL-safe base64 to Uint8Array
 */
function base64UrlToBuffer(base64url) {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Create a signed session cookie string bound to specific token
 */
export async function createSessionCookie(token, secretStr) {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = bufferToBase64Url(crypto.getRandomValues(new Uint8Array(12)));
  const payload = `${token}:${timestamp}:${nonce}`;

  const key = await getHmacKey(secretStr);
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const signature = bufferToBase64Url(signatureBuffer);

  const cookieValue = `${timestamp}.${nonce}.${signature}`;
  const cookieName = `ice_sess_${token.slice(0, 12)}`; // Token-specific cookie name

  // HttpOnly, Secure, SameSite=Strict, Path=/ice/, Max-Age=300
  return `${cookieName}=${cookieValue}; Path=/ice/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

/**
 * Verify incoming session cookie for specific token
 */
export async function verifySessionCookie(request, token, secretStr) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;

  const cookieName = `ice_sess_${token.slice(0, 12)}`;
  const cookies = parseCookies(cookieHeader);
  const cookieValue = cookies[cookieName];
  if (!cookieValue) return false;

  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // 1. Strict 5-minute expiry check
  const now = Math.floor(Date.now() / 1000);
  if (now > timestamp + SESSION_TTL_SECONDS || now < timestamp - 30) {
    return false; // Expired or future clock drift
  }

  // 2. Cryptographic signature check bound to token
  try {
    const payload = `${token}:${timestampStr}:${nonce}`;
    const key = await getHmacKey(secretStr);
    const encoder = new TextEncoder();
    const signatureBuffer = base64UrlToBuffer(signature);
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      encoder.encode(payload)
    );
    return isValid;
  } catch (err) {
    return false;
  }
}

/**
 * Helper to parse Cookie header string into key-value map
 */
function parseCookies(header) {
  const list = {};
  header.split(";").forEach((cookie) => {
    let [name, ...rest] = cookie.split("=");
    name = name?.trim();
    if (!name) return;
    const value = rest.join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}
