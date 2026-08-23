/**
 * turnstile.js — Cloudflare Turnstile Server-Side Siteverify
 * Validates human challenge completion using Cloudflare's official verification API.
 */

export async function verifyTurnstileToken(token, clientIp, secretKey) {
  if (!token || !secretKey) {
    return false;
  }

  const formData = new URLSearchParams();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (clientIp) {
    formData.append("remoteip", clientIp);
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    const outcome = await res.json();
    return outcome.success === true;
  } catch (err) {
    console.error("Turnstile siteverify fetch error:", err);
    return false;
  }
}
