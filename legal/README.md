# legal/

This folder holds the one file the onboarding-automation endpoint reads at send time:

```
legal/employer-services-agreement.pdf
```

**That file does not ship in this repo on purpose.** `POST /api/ops` with `action: "send-onboarding"` reads it from disk and attaches it to the client's onboarding email — if it's missing, the endpoint fails with a clear error instead of silently sending nothing, or worse, sending a stale draft.

## Before you add it

Tony was sent a working draft — `12th & Good Street — Employer Services Agreement.docx` — as a Master Services Agreement + Exhibit A Order Form. It is **not** ready to send to a real client as-is. Before exporting it to PDF and dropping it here:

1. Fill in the company's exact legal entity name, formation state, and notice address (Section 1, Section 14.1, signature block).
2. Fill in the governing law state (Section 15).
3. Confirm actual insurance coverage is in place and fill in real terms (Section 12) — don't leave a representation about coverage you don't have.
4. Have a licensed attorney review Sections 12 (Insurance) and 13 (Limitation of Liability; Indemnification) specifically — those are placeholders, not finished legal language.
5. Delete the cover memo page (the "DRAFT FOR ATTORNEY REVIEW" page addressed to Tony) — that page is for internal use only and should never reach a client.
6. Export to PDF and save it here as `employer-services-agreement.pdf`.

## The guardrail

`/ops/send-agreement` (the internal form that triggers the send) also requires checking "I confirm this is the attorney-reviewed final" before it will submit. That checkbox and this missing-by-default file are two independent safety nets for the same risk: a client receiving a contract that still says `[PLACEHOLDER — REQUIRES ATTORNEY INPUT]`.

## Signing

This automation attaches a PDF for the client to sign and send back (reply with a scan, a photo, or a countersigned copy) — it does not include e-signature. That's a deliberate v1 choice: no new paid vendor, no new integration, works today. If volume grows enough that manual sign-and-return becomes a bottleneck, DocuSign or Dropbox Sign (HelloSign) are the natural upgrades — both have straightforward APIs that could plug into the same `send-onboarding` action later.
