# Best Home Warranty Near Me

A static-first Astro site for `besthomewarrantynearme.com`, a consumer-friendly home warranty comparison and education brand.

## Scripts

```bash
npm install
npm run dev
npm run build
```

The project is intentionally static-first for pages and content. Lead submissions use a Cloudflare Pages Function at `/api/leads` so the Zapier webhook URL stays server-side.

## Lead webhook configuration

Lead capture posts from the browser to `/api/leads`. The Cloudflare Pages Function forwards successful submissions to Zapier using the private `LEAD_WEBHOOK_URL` environment variable.

To send leads to Zapier from Cloudflare Pages:

1. Open the Cloudflare Pages project.
2. Go to **Settings** → **Environment Variables**.
3. Add `LEAD_WEBHOOK_URL`.
4. Paste the Zapier **Webhooks by Zapier → Catch Hook** URL.
5. Redeploy.

Example value:

```txt
https://hooks.zapier.com/hooks/catch/17253375/4b4od39/
```

Suggested Zapier flow: Webhooks by Zapier Catch Hook → Google Sheets Create Spreadsheet Row. Suggested sheet columns: Timestamp, Lead Type, Eligibility Status, Eligible State, First Name, Last Name, Email, Phone, Street Address, City, State, ZIP, Website, Page URL, Page Path, Page Title, Referrer, UTM Source, UTM Medium, UTM Campaign, UTM Term, UTM Content, User Agent.
