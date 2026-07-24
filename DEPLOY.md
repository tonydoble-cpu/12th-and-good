# Launching 12thandgood.com — step by step

Total time: ~30 minutes of clicking, plus DNS wait (minutes to a few hours).
The app runs fully on demo data with zero keys configured, so **deploy first,
add keys after** — the site can be live today even before Supabase/Stripe are
wired to production.

---

## 1. Put the code on GitHub (~10 min)

1. Unzip `12th-and-good-src.zip` somewhere permanent (e.g. `Documents/12th-and-good`).
2. Install **GitHub Desktop** (desktop.github.com) and sign in — create a free
   GitHub account first if you don't have one.
3. In GitHub Desktop: **File → Add local repository** → choose the unzipped
   folder. It will recognize the existing git history (3 commits).
4. Click **Publish repository**. Name: `12th-and-good`. Keep **private** checked.

That's it — the code now lives in your GitHub account, and this becomes the
permanent home for all future changes.

## 2. Deploy on Vercel (~10 min)

Vercel is the company behind Next.js; it's the zero-config host for this app.

1. Go to **vercel.com** → sign up **with GitHub** (one click, ties the two together).
2. **Add New → Project** → import `12th-and-good`. Vercel auto-detects Next.js.
   Don't change any build settings.
3. Click **Deploy**. First build takes ~2 minutes. You'll get a live URL like
   `12th-and-good.vercel.app` — click through it and confirm the site works.

The free Hobby plan is fine to start. Every future push to GitHub auto-deploys.

## 3. Connect your domains (~5 min + DNS wait)

In the Vercel project → **Settings → Domains**:

1. Add `12thandgood.com`. Vercel will show you the exact DNS records to create.
2. In GoDaddy → your domain → **DNS**, add the records exactly as Vercel shows
   them (typically one A record on `@` and one CNAME on `www`). Delete GoDaddy's
   default "parked" A record if there is one.
3. Add `www.12thandgood.com` in Vercel too; set it to **redirect** to the bare domain.
4. Add `12thandgoodstreet.com` and set it to **Redirect** → `12thandgood.com`
   (permanent/308). Add its DNS records at GoDaddy the same way. This is cleaner
   than GoDaddy's forwarding and gets proper HTTPS for free.

Vercel shows "Valid Configuration" with a checkmark when DNS has propagated.

## 4. Environment variables — add as each service goes live

Vercel project → **Settings → Environment Variables**. The full list with
explanations is in `.env.example`. Nothing is required for the site to render;
each group unlocks a feature:

| Variable(s) | Unlocks |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Set to `https://12thandgood.com` — do this one now |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Real accounts, bookings, Blueprint email capture |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Real payments |
| `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` | Auto-created Zoom meetings per booking |
| `ANTHROPIC_API_KEY` | Live AI Money Coach chat (demo mode without it) |

After adding variables, hit **Redeploy** (Deployments → ⋯ → Redeploy) so they
take effect.

### Production switches — do these before taking real money

- **Stripe**: swap test keys for **live mode** keys, and create a webhook
  endpoint pointing to `https://12thandgood.com/api/webhook/stripe`
  (Dashboard → Developers → Webhooks). Use that endpoint's signing secret as
  `STRIPE_WEBHOOK_SECRET`.
- **Supabase**: Authentication → URL Configuration → set Site URL to
  `https://12thandgood.com` and add it to the redirect allow-list.
- **Zoom**: in your Server-to-Server OAuth app, no redirect URL is needed, but
  confirm the app is **activated** (not in dev mode).

## 5. Email on your domain (~15 min, can be tomorrow)

The site references `tony@12thandgood.com`. Recommended: **Google Workspace
Business Starter** (workspace.google.com, ~$7/mo) on `12thandgood.com`.
Google's setup wizard gives you MX records — add them in GoDaddy DNS just like
step 3. (You skipped GoDaddy's Microsoft 365 upsell — correct call; pick email
deliberately here.)

Budget alternative for week one: Cloudflare Email Routing or GoDaddy's free
forwarding can bounce `tony@12thandgood.com` to your Gmail so nothing sent to
it is lost — but you'll want real Workspace before HubSpot sequences go out.

## 6. Smoke test (10 min, on the real domain)

- [ ] Homepage loads over `https://12thandgood.com`, favicon shows in the tab
- [ ] Phone check: hero, nav, coach cards on a real phone
- [ ] Blueprint quiz end-to-end: answer → archetype reveal → email gate → full Blueprint
- [ ] Booking flow up to payment (with Stripe test keys, use card `4242 4242 4242 4242`)
- [ ] `12thandgoodstreet.com` and `www` both land on `https://12thandgood.com`
- [ ] Old links check: nothing on the site says PaperJets anywhere

## What comes after launch

1. Google Search Console: add the domain, submit the sitemap — this is what
   makes you outrank the short film and the gym for your own name within weeks.
2. HubSpot free tier + wire the Blueprint email sequence (drafts are in
   `marketing/blueprint-email-sequence.md`).
3. Back to coach recruitment — the deck is `TwelfthAndGoodStreet_Employer_Deck.pptx`.
