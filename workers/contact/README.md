# JAG Contact Form Worker

Cloudflare Worker that receives POSTs from the JAG website contact form
and forwards them via Resend to `jag@jag-cybersecurity.io`.

- **Source:** `worker.js`
- **Custom domain:** `api.jag-cybersecurity.io` (any path; front-end POSTs to `/contact`)
- **Backend:** [Resend](https://resend.com) — 100 emails/day free tier
- **Secrets:** `RESEND_API_KEY` (set in Cloudflare dashboard → Worker → Settings → Variables)

## One-time setup (≈30 min)

### 1 · Resend signup + domain verification

1. Go to <https://resend.com/signup> and create an account.
2. Dashboard → **Domains** → **Add Domain** → enter `jag-cybersecurity.io` → pick the region closest to you.
3. Resend shows 4 DNS records (SPF, DKIM × 2, DMARC). Open another tab to
   <https://dash.cloudflare.com> → your `jag-cybersecurity.io` zone → **DNS** → **Records**.
4. Add each record verbatim from Resend (Type, Name, Content, TTL Auto, Proxy OFF).
5. Back on Resend's domains page, click **Verify DNS Records**. Status flips to "Verified" within 5–10 min.
6. Resend → **API Keys** → **Create API Key**. Name: `jag-website-worker`. Permission: **Sending access**. Domain: jag-cybersecurity.io. Copy the `re_…` key — you only see it once.

### 2 · Create the Cloudflare Worker

1. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Create Worker**.
2. Name: `jag-contact-form`. Click **Deploy** to seed the default Hello-World code.
3. In the Worker's detail page, click **Edit code** (top right) → delete all the placeholder code → paste the entire contents of `worker.js` → **Save and Deploy**.

### 3 · Set the Resend API key as a Worker secret

1. Worker detail page → **Settings** → **Variables** → **Secret Variables** section → **Add variable**.
2. Variable name: `RESEND_API_KEY` · Value: paste your `re_…` key · Click **Save and Deploy**.

### 4 · Attach the custom domain

1. Worker detail page → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
2. Enter `api.jag-cybersecurity.io` → **Add domain**.
3. Cloudflare auto-creates the DNS record and SSL certificate. Status goes from `Pending` to `Active` within 1–2 min.

### 5 · Smoke test

In the JAG site (incognito tab), fill in the contact form and submit. You should see "Message Sent ✓" in the button, and the email arrives at `jag@jag-cybersecurity.io` within a few seconds.

If you see the "Could not send" error: check the Worker's **Logs** tab in the Cloudflare dashboard for the underlying error (most likely `RESEND_API_KEY` not set, or Resend domain not yet verified).

## Updating the Worker code later

Two options:

- **Dashboard paste:** edit `worker.js` in this repo, copy-paste into Cloudflare dashboard, save.
- **Wrangler CLI:** `npm i -g wrangler && wrangler login && wrangler deploy --name jag-contact-form worker.js` (requires adding a minimal `wrangler.toml`; not set up yet — file an issue if you want it).

## Anti-spam

- **Honeypot:** the form includes a hidden `website` field. Bots fill it; real users don't. Worker returns success silently when this field has a value so bots never know they were caught.
- **Length caps:** name/email/org ≤200 chars, message ≤5000 chars.
- **Email regex:** basic format check (`x@y.z`).
- **Resend rate limits:** 100 emails/day on free tier acts as a natural rate ceiling.
- **No KV-based per-IP rate limit yet.** If spam volume becomes a problem, add a Cloudflare KV namespace `RATE_LIMIT` and the Worker will use it automatically (the code already checks for `env.RATE_LIMIT` — currently absent, so rate limiting is skipped).
