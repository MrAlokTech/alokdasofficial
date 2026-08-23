/**
 * auth-crypto.test.js — Verification tests for session auth and encryption modules
 */

import assert from 'node:assert';
import { createSessionCookie, verifySessionCookie } from '../src/auth.js';
import { encryptPayload, decryptPayload } from '../src/crypto.js';

async function runTests() {
  console.log("▶ Testing HMAC Session Cookie Module...");
  
  const tokenA = "36b80f21355b5e5788465b2047b4bb5192822c86";
  const tokenB = "99a80f21355b5e5788465b2047b4bb5192822c99";
  const secret = "test_session_secret_key_123456789";

  // 1. Create session cookie for tokenA
  const cookieHeaderStr = await createSessionCookie(tokenA, secret);
  assert(cookieHeaderStr.includes("ice_sess_36b80f21355b"), "Cookie name should be token-specific");
  assert(cookieHeaderStr.includes("Max-Age=300"), "Max-Age must be 300");
  assert(cookieHeaderStr.includes("HttpOnly"), "Must include HttpOnly");
  assert(cookieHeaderStr.includes("SameSite=Strict"), "Must include SameSite=Strict");

  // Reconstruct mock Request object
  const cookieVal = cookieHeaderStr.split(";")[0];
  const mockReq = {
    headers: {
      get: (h) => h.toLowerCase() === "cookie" ? cookieVal : null
    }
  };

  // 2. Valid token check
  const isValidA = await verifySessionCookie(mockReq, tokenA, secret);
  assert.strictEqual(isValidA, true, "Session cookie for tokenA must verify as true");

  // 3. Cross-token replay check (Cookie for tokenA presented for tokenB)
  const isValidB = await verifySessionCookie(mockReq, tokenB, secret);
  assert.strictEqual(isValidB, false, "Session cookie for tokenA presented to tokenB must fail verification");

  console.log("✅ HMAC Session Cookie tests passed!");

  console.log("\n▶ Testing AES-256-GCM Crypto Module...");
  const dataKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const samplePerson = {
    person: { fullName: "Alok Das", bloodType: "O+" },
    medical: { allergies: ["Penicillin"] }
  };

  const encrypted = await encryptPayload(samplePerson, dataKey);
  assert(encrypted.iv, "Encrypted payload must contain IV");
  assert(encrypted.ciphertext, "Encrypted payload must contain ciphertext");

  const decrypted = await decryptPayload(encrypted, dataKey);
  assert.strictEqual(decrypted.person.fullName, "Alok Das");
  assert.strictEqual(decrypted.person.bloodType, "O+");
  assert.strictEqual(decrypted.medical.allergies[0], "Penicillin");

  console.log("✅ AES-256-GCM Encryption/Decryption tests passed!");
}

runTests().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
