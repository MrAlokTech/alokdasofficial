/**
 * index.js — Primary Worker Router for Family Emergency (ICE) Info System
 * Route prefix: /ice/*
 */

import { verifySessionCookie, createSessionCookie } from "./auth.js";
import { decryptPayload } from "./crypto.js";
import { verifyTurnstileToken } from "./turnstile.js";
import { renderChallengePage, renderEmergencyDataPage } from "./templates.js";
import { logAccessAttempt } from "./stats.js";

const DEFAULT_SECURITY_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer"
};

const NO_CACHE_HEADERS = {
  ...DEFAULT_SECURITY_HEADERS,
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache"
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Validate path prefix /ice/*
      if (!pathname.startsWith("/ice/")) {
        return new Response("Not Found", { status: 404, headers: DEFAULT_SECURITY_HEADERS });
      }

      // Extract token and action from /ice/<token> or /ice/<token>/verify
      const pathParts = pathname.slice(5).split("/").filter(Boolean);
      const token = pathParts[0];
      const isVerifyAction = pathParts[1] === "verify";

      // Enforce 20+ character unguessable token constraint
      if (!token || !/^[a-zA-Z0-9_-]{20,}$/.test(token)) {
        return new Response("Not Found", { status: 404, headers: DEFAULT_SECURITY_HEADERS });
      }

      const clientIp = request.headers.get("CF-Connecting-IP") || "";

      // -------------------------------------------------------------
      // POST /ice/<token>/verify — Process Turnstile Challenge
      // -------------------------------------------------------------
      if (request.method === "POST" && isVerifyAction) {
        let formData;
        try {
          formData = await request.formData();
        } catch (err) {
          return new Response("Bad Request", { status: 400, headers: DEFAULT_SECURITY_HEADERS });
        }

        const turnstileToken = formData.get("cf-turnstile-response");
        const secretKey = env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

        const isValidTurnstile = await verifyTurnstileToken(turnstileToken, clientIp, secretKey);

        if (!isValidTurnstile) {
          if (env.ICE_KV) {
            ctx.waitUntil(logAccessAttempt(env.ICE_KV, token, "turnstile_fail"));
          }
          const siteKey = env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
          const html = renderChallengePage(token, siteKey, "Verification failed or expired. Please solve the challenge again.");
          return new Response(html, {
            status: 403,
            headers: { ...NO_CACHE_HEADERS, "Content-Type": "text/html; charset=utf-8" }
          });
        }

        // Check if token exists in KV (opaque 404 check)
        let rawKvData = null;
        if (env.ICE_KV) {
          rawKvData = await env.ICE_KV.get(`ice:person:${token}`);
        }

        if (!rawKvData && env.ICE_KV) {
          // If token does not exist, fail gracefully without revealing existence
          return new Response("Invalid Token - Record not found in KV", { status: 404, headers: DEFAULT_SECURITY_HEADERS });
        }

        // Turnstile Passed! Issue 5-minute signed session cookie bound to token
        const sessionCookie = await createSessionCookie(token, env.SESSION_SECRET || "default_dev_session_secret");

        // Redirect to /ice/<token> with Set-Cookie
        return new Response(null, {
          status: 302,
          headers: {
            ...NO_CACHE_HEADERS,
            "Location": `/ice/${token}`,
            "Set-Cookie": sessionCookie
          }
        });
      }

      // -------------------------------------------------------------
      // GET /ice/<token> — Serve Emergency Data or Challenge Page
      // -------------------------------------------------------------
      if (request.method === "GET" && pathParts.length === 1) {
        // 1. Verify Session Cookie
        const hasValidSession = await verifySessionCookie(request, token, env.SESSION_SECRET || "default_dev_session_secret");

        if (!hasValidSession) {
          if (env.ICE_KV) {
            ctx.waitUntil(logAccessAttempt(env.ICE_KV, token, "session_challenge_required"));
          }
          // Render Turnstile Challenge Page
          const siteKey = env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
          const html = renderChallengePage(token, siteKey);
          return new Response(html, {
            status: 200,
            headers: { ...NO_CACHE_HEADERS, "Content-Type": "text/html; charset=utf-8" }
          });
        }

        // 2. Session is Valid! Fetch and Decrypt KV Payload
        if (!env.ICE_KV) {
          return new Response("KV Binding 'ICE_KV' is not configured on Cloudflare Worker.", { status: 500, headers: DEFAULT_SECURITY_HEADERS });
        }

        const rawCipher = await env.ICE_KV.get(`ice:person:${token}`);
        if (!rawCipher) {
          return new Response("Record Not Found in KV store for this token.", { status: 404, headers: DEFAULT_SECURITY_HEADERS });
        }

        let personData;
        try {
          personData = await decryptPayload(rawCipher, env.DATA_ENCRYPTION_KEY || "default_dev_data_encryption_key_32bytes!");
        } catch (err) {
          console.error("Decryption error for token:", token, err);
          return new Response(`Error decrypting record: ${err.message}. Please verify DATA_ENCRYPTION_KEY matches the key used during encryption.`, { status: 500, headers: DEFAULT_SECURITY_HEADERS });
        }

        ctx.waitUntil(logAccessAttempt(env.ICE_KV, token, "authorized_access"));

        // Render Emergency Data Page with No-Store Headers
        const html = renderEmergencyDataPage(personData);
        return new Response(html, {
          status: 200,
          headers: { ...NO_CACHE_HEADERS, "Content-Type": "text/html; charset=utf-8" }
        });
      }

      // Default fallback
      return new Response("Not Found", { status: 404, headers: DEFAULT_SECURITY_HEADERS });
    } catch (globalErr) {
      console.error("Worker unhandled exception:", globalErr);
      return new Response(`Internal Worker Error: ${globalErr.message}`, {
        status: 500,
        headers: DEFAULT_SECURITY_HEADERS
      });
    }
  }
};
