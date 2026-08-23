/**
 * stats.js — Privacy-Preserving Access Audit Logging
 * Tracks verification and access attempts per token without recording personal identity or IP addresses.
 */

export async function logAccessAttempt(kv, token, eventType) {
  if (!kv || !token) return;

  const statsKey = `ice:stats:${token}`;
  try {
    const raw = await kv.get(statsKey);
    let stats = raw ? JSON.parse(raw) : { totalAttempts: 0, events: [] };

    stats.totalAttempts = (stats.totalAttempts || 0) + 1;
    
    // Maintain recent 20 events (timestamp & type only)
    stats.events.unshift({
      ts: new Date().toISOString(),
      type: eventType // e.g. "turnstile_fail", "session_expired", "success"
    });

    if (stats.events.length > 20) {
      stats.events = stats.events.slice(0, 20);
    }

    await kv.put(statsKey, JSON.stringify(stats), {
      // Retain stats for 90 days
      expirationTtl: 60 * 60 * 24 * 90
    });
  } catch (err) {
    console.error("Failed to log access attempt:", err);
  }
}
