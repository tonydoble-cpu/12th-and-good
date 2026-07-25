# Persona Walkthroughs — 12thandgood.com
**July 25, 2026 · Five simulated first-time visitors + one hands-on booking test**

**Method.** Five personas — different ages, money experience, tech comfort, and one B2B buyer — each walked the live site independently, in character, with instructions to be harsh and to quit wherever a real person would quit. Every finding below was then re-verified against today's production site and codebase before making this report (two personas' page fetches partially hit a stale cached copy of an old deploy; anything not reproducible on today's site was discarded). Separately, I walked the coach booking path by hand in a real browser, because that's the one thing a simulated visitor can't truly click.

---

## The verdicts

| Persona | Who they are | Where the journey ended | Converted? |
|---|---|---|---|
| **Jasmine, 24** | First real job, phone, arrived via IG ad | Finished quiz with a **burner email**; bounced at the waitlist; wrote the brand off at the one-coach shelf | Dead email only |
| **Marcus, 38** | Family breadwinner, dad was burned by a commission salesman | Quiz read him cold ("I sat back in my chair") — then he went hunting for proof and found none. No booking, no waitlist | No |
| **Denise, 57** | Laid off after 23 years, careful reader, scam-wary | **Left at the email gate** — no phone, no address, no privacy policy matched the scam pattern she's been warned about | No |
| **Andre, 29** | Side-hustler, money in hand at 11pm, arrived via friend's share | Joined the waitlist because it was the only door; "We'll be in touch" killed his momentum; back on YouTube | Lukewarm waitlist |
| **Priya, 45** | HR Director, 400 employees, benefits budget | "Early-stage but credible — not ready for procurement." Filed under *Revisit Q1 next year* | Curiosity meeting at best |

Five motivated visitors. Zero real conversions.

---

## Finding 0 — verified by hand, blocks everything else

**Nobody can book anything on this site. At all.**

Live test on production, today: Tony's profile booking card defaults to the **$150 single session** ("Total today $150" is the first number a visitor sees — the free intro is one radio button up, unselected). The button reads **"Sign in to book"** — an account wall that appeared as a side effect of turning on Supabase auth this week. And most important: **there are no availability slots in the database**, so there are no times to pick, and clicking the button does nothing. No error, no message. Silent dead end.

Right below that dead button, live on the page: *"Pricing is a placeholder while we finalize rates with our founding coaches. It may come down from here."* — which tells anyone considering paying that today's price is the sucker's price.

Net: the quiz funnel ends in a passive waitlist, and the booking funnel ends in a dead button. **There is currently no functioning path from visitor to conversation.**

---

## Consensus findings (independent hits by multiple personas)

**1. (5/5) The funnel ends at a waitlist while a free intro call sits one page away, unlinked.**
Every single persona flagged this without being asked the same way. The Blueprint page's only CTA is "Join the coach-match waitlist" → "We'll be in touch as soon as your match is ready."
- Jasmine: *"'We'll be in touch' is what jobs say when you didn't get it."*
- Marcus: *"The funnel's only exit is a velvet rope in front of an open door. Match me — from a pool of one? Either the waitlist is theater, or the bookable coach is."*
- Andre (11pm, card in hand): *"The site diagnosed me perfectly and then prescribed waiting."*

**2. (4/5) The Blueprint page promises an email that never sends.**
"A full copy of your Blueprint is on its way to [email]. Check spam if it doesn't land in the next few minutes." — **no email system exists yet.** Every completion is a broken promise delivered to your hottest lead at their warmest moment. Marcus: *"If it never arrives, the whole evening reclassifies: took my email, my income bracket, and my family situation, gave me a horoscope, and went dark. That's the version I tell my brother about as a warning."*

**3. (4/5) "Take the quiz — 60 seconds" is a promise the quiz breaks at the worst moment.**
It's 8 questions with an email wall in the middle (~3–4 minutes). Jasmine did the math exactly at the email gate: *"You said 60 seconds. I did three questions, you showed me half a result, and now you want my email and five more questions."* The gate is where Denise left and where Jasmine and Andre both nearly left.

**4. (3/5) The representation promise isn't backed by the shelf.**
The quiz asks "They share my culture or background." The trust bar promises "Coaches who reflect the people they serve." The shelf: one coach + "Joining soon" placeholders. Jasmine, the exact target customer: *"That checkbox wasn't matching — it was market research you did ON me… walking into a 'marketplace' and realizing it's one guy's website wearing a marketplace costume."*

**5. (3/5 + verified) No proof layer on the coach profile.**
The live profile renders **no credentials at all** — the data exists in the database (10+ years advising, fee-only, fiduciary standard) but the page never displays it. No LinkedIn link (Marcus googled and found the real profile himself — genuinely reassuring, except the trail leads to "MoneyVerse Financial," a name the site never mentions). "✓ Vetted & conflict-free" is self-issued. "Video intro coming soon" is an empty placeholder. Marcus: *"Being SEEN is not the same as being SAFE. My dad was seen too. That's how they got him."*

**6. (2/5 + verified) Trust infrastructure is absent.**
No phone number, no address, no privacy policy anywhere — while collecting emails and household income. Footer links "Become a coach," "Our model," and "About" are dead (`#`). For Denise this combination alone = exit: *"I left the way I leave a store where nobody's behind the counter but the register's asking for my PIN."* (Also legal hygiene: email + income collection with no posted privacy policy.)

**7. The over-50 lane doesn't exist.**
Verified: the word **"retirement" appears zero times in the entire quiz funnel** — no goal, no life stage, no question. (A "Retirement" filter exists on /coaches — it filters to nobody.) Life stages offer nothing for "between jobs" or "near retirement"; Denise's forced pick was a greeting card ("Starting a new chapter"). "Save for a rainy day" to a laid-off woman: *"Sweetheart, I am STANDING in the rain."* The Reclaimer "what shaped this" text guesses "a bankruptcy, a divorce" — crises she never had: *"You guessed at my shame off three clicks and guessed wrong."* The full-screen deep-red reveal flash read as DECLINED/ALERT to her.

**8. The employer door: right instincts, not procurable.**
Priya's list — no price ("flexible and negotiable"... while the ROI calculator's example quietly leaks ~$10/employee/month; *"your buyers will all do that math in the elevator"*); the default **20.6:1 ROI claim actively corrodes trust** (*"Financial Finesse has two decades of data and claims about 3:1"*); no security page, no DPA, no coaching-vs-regulated-advice disclosure ("fiduciary" is a regulated word — her compliance review dies there); contact is a form only (*"A real person will reply (it's probably Tony)" — the most charming line on the site and also an accidental confession about headcount*); zero social proof. Verdict: would take a curiosity meeting, would not start procurement.

---

## What landed — do not break these

- **The quiz reads people.** Marcus: *"Nobody — not my bank, not HR, not anyone at church — has ever said it out loud."* Jasmine got called out twice and stayed. Andre screenshotted his result. This is the single best asset the company has.
- **"Talk to someone who has nothing to sell you"** was instantly understood by every persona, including the 24-year-old. Meanwhile "fee-only, fiduciary" was dead air to the two youngest. Your plain-English line beats your jargon everywhere they compete — use it everywhere, explain the jargon once.
- **The founder story** built trust with everyone who saw it. Marcus's note: specificity is the whole difference between a real story and manufactured vulnerability — keep the street, the year, the detail.
- **The three 90-day moves** were repeatedly called the most useful content in the funnel.
- **Employer page structure** (two funding models, aggregate-only privacy stance) — Priya: better than most early vendors.
- **The "It's probably Tony" honesty** charmed even the skeptics. Honesty about being small works; what fails is when the site *accidentally reveals* smallness it tried to hide (search bar over a one-coach shelf).

---

## Fix list, ranked

### Now (copy + config — I can do all of these on approval, ~1 hour)
1. **Make one working path to Tony exist.** Add real availability slots; default the booking card to the FREE intro; drop the sign-in wall for the free intro (name + email is enough) or at minimum make the button give feedback. *Decision needed from Tony: what actual weekly hours to publish.*
2. **Blueprint final page: replace the waitlist CTA with "Book your free 20-min intro call" → Tony's profile.** Waitlist becomes the secondary option ("Want a different coach? Join the match waitlist").
3. **Kill the email promise until email exists.** Rewrite the confirmation box: "This page is yours — screenshot the moves." Then wire a real send (Resend free tier) this week and restore the promise.
4. **"Take the quiz — 60 seconds" → "8 quick questions · about 2 minutes."** Stop paying the honesty tax at the email gate.
5. **Delete "Pricing is a placeholder… may come down from here"** from the live profile.
6. **Render Tony's credentials** (data already in DB) + link his LinkedIn on the profile.

### This week
7. Privacy policy page; fix or remove the three dead footer links; add a contact email; strongly consider a phone number (Google Voice) — it was Denise's #1 trust unlock and costs nothing.
8. Add quiz options: goal "Make it to and through retirement," life stage "Between jobs / starting over." (Label additions only — no scoring changes, safe.)
9. Soften the Reclaimer "shaped this" guesses ("a setback you didn't choose — a layoff, a loss, a hard year") and respect `prefers-reduced-motion` on the reveal flash.
10. Employer page: a priced **Founding Employer Pilot** box (own the ~$10 PEPM the calculator already leaks: "one department, up to 50 employees, 90 days, cancel anytime"), a calendar booking link next to the form, recalibrate the ROI calculator default, and a one-page trust/disclosure page (coaching ≠ regulated advice; what you never see about employees' data).

### Strategic (the real work)
11. **Close the representation gap** — recruit the next 2–3 coaches (the outreach kit is ready in `marketing/coach-recruitment-kit.md`). Until real faces exist, soften "coaches who reflect the people they serve" claims. This gap is where the target customer (Jasmine) wrote the brand off *permanently*.
12. **Build the share loop** — a shareable reveal-card image (archetype + one savage line, story-sized) and referral continuity ("Your friend is The Builder. What's your money style?").
13. **Test an ungated Blueprint** — show everything, make email an optional "send me a copy." Jasmine's burner-email behavior is the tell: the current gate harvests dead addresses at the cost of trust. Worth an A/B once traffic exists.

---

*Full persona transcripts available on request — each includes a beat-by-beat walkthrough, ranked stuck points, "the moment I almost left," and what would have converted them.*
