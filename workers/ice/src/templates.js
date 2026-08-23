/**
 * templates.js — UI Templates for Challenge & Emergency Data Pages
 * High contrast, responsive HTML adhering to site design tokens.
 */

/**
 * Render Bot Challenge Page (Turnstile)
 */
export function renderChallengePage(token, siteKey, errorMsg = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Emergency Info — Verification Required</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    :root {
      --bg: #f5f4f0;
      --surface: #ffffff;
      --border: rgba(0, 0, 0, 0.08);
      --text: #1a1917;
      --text2: #6b6860;
      --accent: #1a1917;
      --danger: #c0392b;
      --radius: 16px;
      --font-sans: 'DM Sans', -apple-system, sans-serif;
      --font-mono: 'DM Mono', monospace;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111110;
        --surface: #1c1c1a;
        --border: rgba(255, 255, 255, 0.07);
        --text: #f0eeea;
        --text2: #8a8880;
        --accent: #f0eeea;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px 24px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
      text-align: center;
    }
    .badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      background: rgba(192, 57, 43, 0.1);
      color: var(--danger);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }
    p {
      font-size: 14px;
      color: var(--text2);
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .error-box {
      background: rgba(192, 57, 43, 0.08);
      color: var(--danger);
      font-size: 13px;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .turnstile-container {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .btn {
      width: 100%;
      background: var(--accent);
      color: var(--bg);
      border: none;
      padding: 14px;
      border-radius: 10px;
      font-family: var(--font-sans);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .btn:hover { opacity: 0.9; }
    .footer-note {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text2);
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">In Case of Emergency</div>
    <h1>Security Verification</h1>
    <p>Please complete human verification to access private emergency contact and medical details.</p>

    ${errorMsg ? `<div class="error-box">${escapeHtml(errorMsg)}</div>` : ""}

    <form action="/ice/${escapeHtml(token)}/verify" method="POST">
      <div class="turnstile-container">
        <div class="cf-turnstile" data-sitekey="${escapeHtml(siteKey)}" data-theme="auto"></div>
      </div>
      <button type="submit" class="btn">View Emergency Info</button>
    </form>

    <div class="footer-note">Session length: 5 minutes • Zero tracking data retained</div>
  </div>
</body>
</html>`;
}

/**
 * Render Encrypted Emergency Data Page
 */
export function renderEmergencyDataPage(data) {
  const person = data.person || {};
  const medical = data.medical || {};
  const contacts = data.emergencyContacts || [];
  const address = data.homeAddress || {};
  const physician = data.physicianDetails || {};
  const insurance = data.insuranceDetails || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>ICE Profile — ${escapeHtml(person.fullName || "Emergency Record")}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f5f4f0;
      --surface: #ffffff;
      --surface2: #f0eeea;
      --border: rgba(0, 0, 0, 0.08);
      --text: #1a1917;
      --text2: #6b6860;
      --text3: #a09d98;
      --accent: #1a1917;
      --danger: #d32f2f;
      --danger-bg: #ffebee;
      --success: #2e7d32;
      --success-bg: #e8f5e9;
      --radius: 16px;
      --font-sans: 'DM Sans', -apple-system, sans-serif;
      --font-mono: 'DM Mono', monospace;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111110;
        --surface: #1c1c1a;
        --surface2: #242422;
        --border: rgba(255, 255, 255, 0.07);
        --text: #f0eeea;
        --text2: #8a8880;
        --text3: #555350;
        --accent: #f0eeea;
        --danger-bg: rgba(211, 47, 47, 0.15);
        --success-bg: rgba(46, 125, 50, 0.15);
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--text);
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
      min-height: 100vh;
    }

    /* Timer Banner */
    .timer-banner {
      background: var(--surface2);
      border: 1px solid var(--border);
      padding: 10px 16px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text2);
      margin-bottom: 16px;
    }
    .timer-count {
      font-weight: 700;
      color: var(--danger);
    }

    /* Person Header */
    .header-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--surface2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      color: var(--text2);
      flex-shrink: 0;
      overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .person-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .person-meta { font-family: var(--font-mono); font-size: 13px; color: var(--text2); }

    /* Critical Red Badges */
    .critical-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    .crit-box {
      background: var(--danger-bg);
      border: 1px solid rgba(211, 47, 47, 0.3);
      padding: 14px;
      border-radius: var(--radius);
    }
    .crit-label {
      font-family: var(--font-mono);
      font-size: 11px;
      text-transform: uppercase;
      color: var(--danger);
      margin-bottom: 4px;
      font-weight: 700;
    }
    .crit-val {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    /* Section Cards */
    .section-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 16px;
    }
    .section-title {
      font-family: var(--font-mono);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text2);
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Contact Cards */
    .contact-item {
      background: var(--surface2);
      border: 1px solid var(--border);
      padding: 14px;
      border-radius: 12px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .contact-item:last-child { margin-bottom: 0; }
    .contact-name { font-size: 16px; font-weight: 700; }
    .contact-rel { font-size: 13px; color: var(--text2); }
    .call-btn {
      background: var(--success);
      color: #ffffff;
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    /* List items */
    .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag {
      background: var(--surface2);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .tag.alert {
      background: var(--danger-bg);
      color: var(--danger);
      border-color: rgba(211, 47, 47, 0.3);
    }
    .info-row { margin-bottom: 10px; font-size: 14px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-label { font-family: var(--font-mono); color: var(--text2); font-size: 12px; }

    footer {
      text-align: center;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text3);
      padding: 16px 0;
    }
  </style>
</head>
<body>

  <!-- Timer Banner -->
  <div class="timer-banner">
    <span>🔒 Secure ICE Session Active</span>
    <span>Expires in: <span id="timer" class="timer-count">05:00</span></span>
  </div>

  <!-- Person Header -->
  <div class="header-card">
    <div class="avatar">
      ${person.photoUrl 
        ? `<img src="${escapeHtml(person.photoUrl)}" alt="${escapeHtml(person.fullName)}">` 
        : escapeHtml((person.fullName || "P")[0])}
    </div>
    <div>
      <div class="person-name">${escapeHtml(person.fullName || "Emergency Medical Profile")}</div>
      <div class="person-meta">
        ${person.dateOfBirth ? `DOB: ${escapeHtml(person.dateOfBirth)}` : ""}
        ${person.primaryLanguage ? ` • Lang: ${escapeHtml(person.primaryLanguage)}` : ""}
      </div>
    </div>
  </div>

  <!-- Critical Red Highlights -->
  <div class="critical-grid">
    <div class="crit-box">
      <div class="crit-label">Blood Type</div>
      <div class="crit-val">${escapeHtml(person.bloodType || "Unknown")}</div>
    </div>
    <div class="crit-box">
      <div class="crit-label">Primary Allergies</div>
      <div class="crit-val">${escapeHtml(medical.allergies && medical.allergies.length ? medical.allergies.join(", ") : "None Listed")}</div>
    </div>
  </div>

  <!-- Emergency Contacts -->
  <div class="section-card">
    <div class="section-title">📞 Emergency Contacts</div>
    ${contacts.length === 0 ? `<p style="font-size:14px; color:var(--text2);">No emergency contacts listed.</p>` : ""}
    ${contacts.map(c => `
      <div class="contact-item">
        <div>
          <div class="contact-name">${escapeHtml(c.name)}</div>
          <div class="contact-rel">${escapeHtml(c.relationship || "Contact")}</div>
        </div>
        <a href="tel:${escapeHtml(c.phone)}" class="call-btn">
          📞 Call
        </a>
      </div>
    `).join("")}
  </div>

  <!-- Medical Overview -->
  <div class="section-card">
    <div class="section-title">🏥 Medical Profile</div>
    
    ${medical.medicalConditions && medical.medicalConditions.length ? `
      <div class="info-row">
        <div class="info-label">CONDITIONS & DIAGNOSES</div>
        <div class="tag-list" style="margin-top:4px;">
          ${medical.medicalConditions.map(cond => `<span class="tag alert">${escapeHtml(cond)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    ${medical.medications && medical.medications.length ? `
      <div class="info-row" style="margin-top:12px;">
        <div class="info-label">CURRENT MEDICATIONS</div>
        <div class="tag-list" style="margin-top:4px;">
          ${medical.medications.map(m => `<span class="tag">${escapeHtml(m)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    ${medical.medicalNotes ? `
      <div class="info-row" style="margin-top:12px;">
        <div class="info-label">CRITICAL MEDICAL NOTES</div>
        <div style="font-size:14px; margin-top:4px; line-height:1.4;">${escapeHtml(medical.medicalNotes)}</div>
      </div>
    ` : ""}
  </div>

  <!-- Address & Physician -->
  ${(address.street || physician.name || insurance.provider) ? `
  <div class="section-card">
    <div class="section-title">📍 Address & Details</div>

    ${address.street ? `
      <div class="info-row">
        <div class="info-label">HOME ADDRESS</div>
        <div style="margin-top:2px;">
          ${escapeHtml(address.street)}, ${escapeHtml(address.city || "")} ${escapeHtml(address.state || "")} ${escapeHtml(address.postalCode || "")}
        </div>
      </div>
    ` : ""}

    ${physician.name ? `
      <div class="info-row" style="margin-top:12px;">
        <div class="info-label">PRIMARY PHYSICIAN</div>
        <div style="margin-top:2px;">
          <strong>${escapeHtml(physician.name)}</strong> (${escapeHtml(physician.clinic || "Clinic")}) — 
          <a href="tel:${escapeHtml(physician.phone)}" style="color:var(--text); font-weight:700;">${escapeHtml(physician.phone)}</a>
        </div>
      </div>
    ` : ""}

    ${insurance.provider ? `
      <div class="info-row" style="margin-top:12px;">
        <div class="info-label">INSURANCE DETAILS</div>
        <div style="margin-top:2px;">
          ${escapeHtml(insurance.provider)} (Policy: ${escapeHtml(insurance.policyNumber || "N/A")})
        </div>
      </div>
    ` : ""}
  </div>
  ` : ""}

  <footer>
    Zero-Trust ICE System • Session automatically purges data in 5 minutes
  </footer>

  <script>
    // 5-minute client visual countdown timer
    let timeLeft = 300;
    const timerEl = document.getElementById("timer");
    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(interval);
        window.location.reload();
      } else {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        timerEl.textContent = \`\${m}:\${s}\`;
      }
    }, 1000);
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
