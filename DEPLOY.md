# Deploying to Vercel (ashishrajbhagat.dev)

The site is a standard Next.js app with no database or secrets, so deployment is mostly clicking through Vercel.

## 1. Put the code on GitHub
```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/ashishrajbhagat/<repo-name>.git
git push -u origin main
```
`.gitignore` already keeps `node_modules`, `.next` and local env files out. The GitHub Action in
`.github/workflows/ci.yml` then runs typecheck, tests and a production build on every push and pull request.

## 2. Import into Vercel
1. Vercel dashboard > **Add New > Project** > pick the repository.
2. Framework preset: **Next.js** (auto-detected). Build and install commands: leave the defaults.
3. Environment variable (Production): `NEXT_PUBLIC_SITE_URL` = `https://ashishrajbhagat.dev`
   (used for canonical links, the sitemap and share previews). Leave it unset for preview deployments.
4. **Deploy**. You get a `*.vercel.app` URL straight away.

## 3. Connect the domain
1. Project > **Settings > Domains** > add `ashishrajbhagat.dev` (and `www.ashishrajbhagat.dev`).
2. Vercel shows the exact DNS records for your project. At your domain registrar add the records it shows (usually an
   **A record** for the apex domain and a **CNAME** for `www`). Use the values from the Vercel page, not from memory,
   as they can change.
3. Wait for DNS to propagate (minutes to a few hours). HTTPS is issued automatically. `.dev` domains are
   HTTPS-only, which this site already supports.
4. In Domains, set one of the two (apex or `www`) as the redirect target so there is a single canonical address.

## 4. Check it before announcing it
- [ ] Open the site on a **real phone** (iPhone Safari and Android Chrome) and click through all three profiles.
- [ ] Try it with OS animations **on** and **off** (Windows: Settings > Accessibility > Visual effects > Animation effects).
- [ ] Share previews: paste the URL into the LinkedIn Post Inspector, the Facebook Sharing Debugger, and
      opengraph.xyz. You should see the gold card with your photo. (These tools cache, so re-scrape after changes.)
- [ ] `https://ashishrajbhagat.dev/resume.pdf` downloads and contains no phone number.
- [ ] `https://ashishrajbhagat.dev/sitemap.xml` and `/robots.txt` load.
- [ ] Run Lighthouse (Chrome DevTools) on the home page and on `/watch/recruiter`. Aim for 90+ on Accessibility and
      Best Practices. The Space profile loads three.js on demand, so judge performance on the other pages.
- [ ] Google Search Console: add the property, verify the domain (DNS TXT record) and submit `sitemap.xml`.
      Only `/` and `/watch/recruiter` are indexed on purpose; the other two profiles are `noindex` duplicates.

## Updating later
- Content lives in `content/`. Push to `main` and Vercel redeploys automatically; pull requests get preview URLs.
- Changed your experience? Edit `scripts/make_resume.py` and run `python scripts/make_resume.py` to rebuild
  `public/resume.pdf` (needs `pip install reportlab`).
- Replaced a photo? Keep the file name. Images are cached for a day.

## Live project previews need your project sites to allow framing
The project dialogs show each project's live website in an iframe. A site can only be embedded if it allows it:
- It must **not** send `X-Frame-Options: DENY` or `SAMEORIGIN`.
- If it sends `Content-Security-Policy: frame-ancestors ...`, that list must include
  `https://ashishrajbhagat.dev` and `https://www.ashishrajbhagat.dev`.

Vercel does not add these headers by default, so plain static sites usually just work. If a project does block
framing, allow this portfolio explicitly:
- Static site (`vercel.json`):
  ```json
  { "headers": [{ "source": "/(.*)", "headers": [
    { "key": "Content-Security-Policy", "value": "frame-ancestors 'self' https://ashishrajbhagat.dev https://www.ashishrajbhagat.dev" }
  ] }] }
  ```
- Next.js app (`next.config.js`): return the same header from `headers()`.

Each project's origin also has to be in this site's own allow-list: that happens automatically from the `links.live` URLs in
`content/projects.ts` (see `lib/embed.ts`). To see which of your sites currently block framing, open
`https://ashishrajbhagat.dev/api/embed-check` after deploying: every project reports `embeddable` and, if not, the exact header
(`X-Frame-Options` or `frame-ancestors`) that blocks it. Sites on other hosts (for example a custom-domain site on shared
hosting) need the equivalent header set in that host's own configuration, such as `.htaccess` on Apache.

## Optional: privacy-friendly analytics
Not included by default. To add Vercel Web Analytics: `npm i @vercel/analytics`, then render `<Analytics />` from
`@vercel/analytics/next` in `app/layout.tsx`. The Content-Security-Policy allows only the site's own origin, so
you would also need to allow whichever analytics host you choose in `config/security-headers.mjs` (a test there checks
that no third-party host is allowed unnoticed).

## Security headers
`config/security-headers.mjs` sets a strict Content-Security-Policy (everything locked to your own origin), plus
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS and more. If you embed a third-party script, font or
video later, add its host there and update the test in `lib/security-headers.test.ts`.
