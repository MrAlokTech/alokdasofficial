/**
 * Contact Obfuscation Utility
 * Prevents automated scrapers, web crawlers, and AI bots from harvesting contact details
 * by keeping secrets ciphered at rest and providing runtime decoding.
 */

const CIPHER_KEY = "alokdas.chemistry.shield";
const CIPHER_RAW = "SlVeUlVRQh5aWF1UWQ==";
const CIPHER_FORMATTED = "SlVeS11QQx9TSFxdUUpE";
const CIPHER_REVERSED = "UVVXW11BQx9TWVxNWEpf";

function decodeWithKey(b64: string, key: string): string {
  try {
    let raw: string;
    if (typeof atob === "function") {
      raw = atob(b64);
    } else {
      raw = Buffer.from(b64, "base64").toString("binary");
    }
    return raw
      .split("")
      .map((char, index) =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
      )
      .join("");
  } catch {
    return "";
  }
}

/** Returns dialable phone number e.g. "+919101090890" */
export function getPhoneRaw(): string {
  return decodeWithKey(CIPHER_RAW, CIPHER_KEY);
}

/** Returns formatted phone number for human eyes e.g. "+91 91010 90890" */
export function getPhoneFormatted(): string {
  return decodeWithKey(CIPHER_FORMATTED, CIPHER_KEY);
}

/** Returns reversed phone number for CSS bidi-override e.g. "09809 01019 19+" */
export function getPhoneReversed(): string {
  return decodeWithKey(CIPHER_REVERSED, CIPHER_KEY);
}
