/**
 * JAG Contact Form Worker
 * ───────────────────────────────────────────────────────────────────
 * Receives POSTs from the JAG website contact form at
 * https://www.jag-cybersecurity.io/#contact, validates input,
 * applies a honeypot anti-spam check, and forwards the message via
 * the Resend API to jag@jag-cybersecurity.io.
 *
 * Deploy target: Cloudflare Workers, bound to a custom domain
 * api.jag-cybersecurity.io (any path; the front-end POSTs to /contact
 * but this Worker accepts any path under the custom domain).
 *
 * Required Worker secrets (set in Cloudflare dashboard → Settings → Variables):
 *   RESEND_API_KEY — Resend API key starting with `re_…`
 *
 * Resend domain must be verified and the FROM_EMAIL below must be on
 * the verified sending domain (jag-cybersecurity.io). Verification is
 * done in the Resend dashboard by adding SPF + DKIM + DMARC TXT records
 * to your Cloudflare DNS (Resend provides the exact records to copy).
 *
 * Setup walkthrough lives in:
 *   /workers/contact/README.md
 */

const ALLOWED_ORIGINS = [
  'https://www.jag-cybersecurity.io',
  'https://jag-cybersecurity.io',
];

const TO_EMAIL = 'jag@jag-cybersecurity.io';
const FROM_EMAIL = 'JAG Contact <noreply@jag-cybersecurity.io>';

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    // Parse JSON
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid_json' }, 400, cors);
    }

    const { name, email, organization, interest, message, website } = body || {};

    // Honeypot — bots fill the hidden `website` field; real users never see it.
    // Return success silently so the bot thinks it worked.
    if (website && String(website).length > 0) {
      return json({ ok: true }, 200, cors);
    }

    // Required field validation
    if (!name || !email || !message) {
      return json({ ok: false, error: 'missing_fields' }, 400, cors);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: 'invalid_email' }, 400, cors);
    }

    // Length bounds — defends against abuse + accidental giant pastes
    if (
      String(name).length > 200 ||
      String(email).length > 200 ||
      String(organization || '').length > 200 ||
      String(message).length > 5000
    ) {
      return json({ ok: false, error: 'field_too_long' }, 400, cors);
    }

    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set on this Worker');
      return json({ ok: false, error: 'misconfigured' }, 500, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const country = request.headers.get('CF-IPCountry') || 'unknown';
    const subject = `[JAG ${interest || 'Inquiry'}] ${name}`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : null,
      `Interest: ${interest || 'Unspecified'}`,
      `IP: ${ip}`,
      `Country: ${country}`,
      '',
      'Message:',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <h2 style="margin:0 0 16px;font-family:system-ui,sans-serif;">New contact from JAG website</h2>
      <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;"><strong>Name</strong></td><td>${esc(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${organization ? `<tr><td style="padding:4px 12px 4px 0;"><strong>Organization</strong></td><td>${esc(organization)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;"><strong>Interest</strong></td><td>${esc(interest || 'Unspecified')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><strong>IP</strong></td><td>${esc(ip)} (${esc(country)})</td></tr>
      </table>
      <hr style="margin:16px 0;border:none;border-top:1px solid #ddd;">
      <pre style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin:0;">${esc(message)}</pre>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error('Resend error', resendRes.status, errorText);
      return json({ ok: false, error: 'send_failed' }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
