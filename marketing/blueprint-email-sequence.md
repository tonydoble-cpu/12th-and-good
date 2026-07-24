# Blueprint Email Sequence

**Trigger:** User completes the Blueprint quiz on `/blueprint` and submits their email at Gate 2.
**Delivery tool:** HubSpot free tier (workflows) or ConvertKit ($9/mo). Both support archetype-branched sequences via a single "archetype" custom field on the contact.
**Total messages:** 5 over 14 days.
**Structure:** Neil Patel's story → social proof → objection → offer → ask.

Each email uses the merge field `{{archetype}}` (Bridge, Builder, Guardian, Reclaimer, Steward, Pathfinder) so the copy adapts to the reader. A single sequence, six flavors, no duplication.

---

## Email 1 — The Blueprint (send immediately)

**From:** Tony from 12th & Good Street
**Subject:** Your Blueprint — {{archetype}}
**Preview:** The three moves for the next 90 days, personalized to you.

Hey {{first_name}},

Your Blueprint is inside.

I built this quiz because most financial advice is written for a person who doesn't exist — someone with no family responsibilities, no history with money, no cultural context. If you've ever sat across from a financial advisor and felt like you had to explain your whole life before you could ask a real question, this is for you.

You landed on **{{archetype}}**. That means, right now, {{archetype_tagline}}.

Your natural strength is real. Your blind spot is real too. But the whole point of naming an orientation is so you can work with it instead of being run by it.

Your three moves for the next 90 days are attached. Print them. Screenshot them. Do one this week.

I'll send a few more notes over the next couple of weeks — not to sell you anything. Just to help this actually land.

— Tony
Founder, 12th & Good Street

*P.S. You can retake the quiz any time — orientations shift as your life does.*

**Attach:** Personalized PDF of the full Blueprint (archetype + strength + origin + blind spot + need now + three moves).

---

## Email 2 — The Story (send Day 3)

**Subject:** Why I stopped calling myself a financial advisor
**Preview:** The moment I realized the industry was built for someone else.

{{first_name}},

I was licensed for years. I did the work the "right" way. But every time I sat down with a client who looked like me — a Black professional, a first-gen wealth builder, someone supporting family while trying to build for themselves — I hit the same wall.

The financial planning frameworks I'd been trained on didn't account for their reality.

They assumed nobody was funding a parent's rent.
They assumed the "start early" advice worked the same for someone whose parents didn't invest.
They assumed a coach and a client shared a lived experience — which most of the time, they didn't.

So I stopped calling myself an advisor. I'm building 12th & Good Street instead.

12th & Good Street is a marketplace for financial coaches who are fee-only, fiduciary, and — this part matters — reflect the people they serve. A Black woman looking for a Black woman coach will find one. A first-gen immigrant will find someone who's navigated that path. A Reclaimer working through a hard chapter will find someone who understands the emotional part of money, not just the math.

Your Blueprint is one piece of that. The next piece is talking to a coach who gets it.

More on that soon.

— Tony

---

## Email 3 — Social Proof + Objection (send Day 6)

**Subject:** "But do I actually need a coach?"
**Preview:** The honest answer, from someone who's been on both sides of the table.

{{first_name}},

Here's the pushback I get most: *"Can't I just read a book, watch some videos, figure this out on my own?"*

Yes. You absolutely can. And a lot of people do — for years. And nothing changes.

Not because the information wasn't there. Because information isn't the bottleneck. **Application is.**

The people who move forward with money usually have one thing in common: someone in their corner who knows their situation, gives a straight answer, and holds them accountable to what they said they'd do.

That person doesn't have to be an advisor. It can be a mentor, a friend, a partner. But most of the time, it needs to be someone who's not emotionally entangled in your money decisions — someone who can tell you the truth without getting weird about it.

That's what a good coach is.

If you're a **{{archetype}}**, here's the specific pattern I see:

{{archetype_specific_stuck_pattern}}

That's not a character flaw. That's an orientation working overtime without a counterweight. A coach is the counterweight.

— Tony

*P.S. When we open the coach match, you'll be first in line. Just reply to this email if you want me to bump you to the top of the list.*

---

**{{archetype_specific_stuck_pattern}} — merge blocks:**

- **Bridge**: Bridges usually know exactly what they should do for themselves financially. They just keep putting it off because there's always someone else's crisis to handle first. A coach's job is to make your own goals loud enough to compete.

- **Builder**: Builders tend to accumulate more than they organize. Money coming in, deals in motion, but no unified picture. A coach helps you see the whole board — so the growth actually turns into wealth instead of just activity.

- **Guardian**: Guardians usually have more capacity for growth than they use. The cash is there. The stability is there. What's missing is a framework that lets you take a calculated risk without feeling like you're gambling with your family's future.

- **Reclaimer**: Reclaimers often stall at the same emotional trigger — the point where investing, spending, or committing to something starts to feel like the past all over again. A coach helps you tell the difference between the wound and the situation in front of you now.

- **Steward**: Stewards usually know what they want their money to do. They just haven't operationalized it. A coach helps you turn intention into a real deployment plan — with names, dates, and dollar amounts.

- **Pathfinder**: Pathfinders can research forever. What's usually missing isn't more information — it's a small, specific decision made confidently. A coach helps you make it, so the pattern shifts from gathering to building.

---

## Email 4 — The Offer (send Day 9)

**Subject:** How 12th & Good Street actually works
**Preview:** The model, the pricing, and who it's for.

{{first_name}},

Here's how 12th & Good Street works, plainly:

**You get matched with a coach who fits you.** Not a random CFP. A fee-only, fiduciary coach vetted for actual competence and vetted for cultural fit if that matters to you. You choose.

**Your coach never sells you anything.** No products. No commissions. No AUM percentage. They earn a flat fee from you (or from your employer, when we bring employers on) — and that's it. The financial industry has spent 50 years blurring the line between advice and sales. We just don't blur it.

**You work together on a real plan.** Not a 40-page PDF you'll never open. A working plan around your goals, your family, your history — with regular check-ins to actually do it.

**Pricing:** We're finalizing pricing now. Founding members will lock in early rates. If you want in when we open, reply "I'm in" and I'll add you to the founder list.

Your Blueprint pointed at what a **{{archetype}}** most needs right now: {{archetype_need_line}}. A good coach turns that need into a plan.

— Tony

---

**{{archetype_need_line}} — merge blocks:**

- **Bridge**: permission to build for yourself in parallel, with clear family lines drawn without guilt.
- **Builder**: a real definition of "arrived" so your growth accumulates toward something specific.
- **Guardian**: a framework for calculated risk in service of your long-term security.
- **Reclaimer**: someone who honors your history without letting it drive today's decisions.
- **Steward**: a deployment plan so what you've built actually gets used the way you intended.
- **Pathfinder**: a first real financial decision made confidently, so the pattern shifts from gathering to acting.

---

## Email 5 — The Ask (send Day 14)

**Subject:** One thing
**Preview:** No pitch. Just the ask.

{{first_name}},

If you've read this far, you already know the market is broken.

Most financial advice is trying to sell you something. Most of the "wellness" apps make money on the products your employer helps them offer. Most advisors don't look like the people they claim to serve. And most people — smart, capable people like you — end up navigating money alone because the alternatives feel worse than doing nothing.

We're trying to build something different. A marketplace where the coaches actually work for you, look like the people they serve, and never sell you a thing.

If that's the kind of thing you want to see in the world:

**→ Book a 20-minute coach-match call:** [calendar link]

I'll walk you through the coaches we've vetted, help you think about which one might fit, and — if you're ready — get you matched. No pressure. If it's not the right time, it's not the right time.

Either way, you have your Blueprint. That's yours whether or not we ever talk.

Thank you for taking the quiz. Thank you for reading. And thank you for caring enough about your own money story to look at it honestly.

— Tony
Founder, 12th & Good Street

*P.S. If you'd rather just stay on the list for now, do nothing. I'll send a quarterly note when there's news worth sharing. No follow-ups after this.*

---

## Setup notes

**HubSpot workflow setup (free tier):**

1. Create custom contact property `archetype` (dropdown: Bridge, Builder, Guardian, Reclaimer, Steward, Pathfinder).
2. Create custom property `blueprint_stage` (Gate 1, Gate 2, Waitlist, Booked).
3. Enrollment trigger: `blueprint_stage = Gate 2`.
4. Delays: immediate → +3d → +6d → +9d → +14d.
5. Personalization tokens: `{{first_name}}`, `{{archetype}}`, `{{archetype_tagline}}`, `{{archetype_specific_stuck_pattern}}`, `{{archetype_need_line}}`.
6. Suppression: if `blueprint_stage = Booked`, exit workflow.

**A/B tests to run once you have 200+ signups:**

- Email 2 subject line: "Why I stopped calling myself a financial advisor" vs. "The moment the whole industry stopped making sense to me"
- Email 4 CTA: "reply I'm in" vs. clickable button to founder-list form
- Email 5 CTA: 20-min call vs. 30-min call vs. no call (waitlist opt-in only)

**Success metrics:**

- Gate 2 → Email 1 open: aim for 60%+ (they just gave you their email; if opens are lower, subject or sender name needs work)
- Email 5 → calendar booking: aim for 5-8% (industry standard for cold-to-booked from lead magnet is 3-5%; representation angle should push higher)
- End-of-sequence unsubscribe: keep under 4% (higher means voice is off)
