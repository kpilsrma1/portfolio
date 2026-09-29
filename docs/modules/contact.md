# Contact and résumé

## 1. Purpose

Gives visitors a way to reach the owner (`/contact`) and to obtain the résumé (`/resume`), while guaranteeing the site never pretends a message was sent or a file exists.

## 2. Business requirements

- Contact form must send only when delivery is configured; otherwise show direct channels or an honest "not configured" state.
- Never display placeholder emails or fake phone numbers.
- Reject spam without a CAPTCHA (honeypot + rate limit).
- Résumé download and inline preview appear only when the PDF is actually present; otherwise point to About/Experience and offer "Request a copy".

## 3. Features

Implemented: server-action form with `useActionState`, field-level and form-level errors, pending state, success panel; honeypot field `website`; per-IP sliding window (3 per 10 minutes); Resend delivery with reply-to; contact page adapts copy to which channels exist; résumé page with two states.

Planned: none.

## 4. Technical implementation

- `src/lib/contact.ts` (`server-only`): `contactSchema` (Zod v4: name 2–100, email valid ≤200, message 20–4000, `website` must be empty), `getContactDeliveryConfig()` reads `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `isContactFormEnabled()`, `isRateLimited(key, now)`, `resetRateLimiter()`, `fieldErrorsFromIssues()`, `deliverContactMessage()` (dynamic `import("resend")`).
- `src/app/contact/actions.ts` (`"use server"`): `sendContactMessage(previous, formData)` → refuses when unconfigured → validates → silently returns success when the honeypot is filled → rate-limits by `x-forwarded-for` / `x-real-ip` / `"unknown"` → delivers → maps failures to user-safe messages and logs the reason server-side.
- `src/components/forms/contact-form.tsx` (client): fields with `aria-invalid`/`aria-describedby`, honeypot inside an `aria-hidden` off-screen wrapper with `tabIndex={-1}` and `autoComplete="off"`, `role="alert"` for form error, `role="status"` on success.
- `src/app/contact/page.tsx`: computes `formEnabled = isContactFormEnabled()`, `socialLinks = getSocialLinks()`, `hasAnyChannel`; intro copy and sections switch accordingly.
- `src/lib/resume.ts` (`server-only`): `hasResumeFile()` checks `public/` + `siteConfig.resumePath` with `existsSync` at render/build time.
- `src/app/resume/page.tsx`: download button (`data-testid="resume-download"`) and `<object type="application/pdf">` preview when the file exists; otherwise links to Experience/Contact and a "What you can find here now" card.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/lib/contact.ts` | Schema, config, rate limiter, delivery |
| `src/app/contact/actions.ts` | Server action |
| `src/app/contact/page.tsx` | Contact page |
| `src/components/forms/contact-form.tsx` | Form UI |
| `src/lib/resume.ts` | PDF presence check |
| `src/app/resume/page.tsx` | Résumé page |

## 6. Dependencies

- Internal: `siteConfig`, `getSocialLinks`, `buildMetadata`, `PageHeader`, `Button`.
- Depended on by: layout (résumé link target), homepage CTA.
- External: `zod`, `resend` (loaded lazily), `lucide-react`.
- Environment: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (server only, all optional; all three required to enable the form).

## 7. Design and UI

Form in a `surface-card`; textarea min height 9 rem; destructive border on invalid fields. Résumé preview fills 80 vh.

## 8. Data and API

Server action contract and states are documented in [../API_REFERENCE.md](../API_REFERENCE.md). No REST endpoint is exposed for contact.

## 9. Technical decisions

ADR-004, ADR-005 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Unit: `tests/unit/contact.test.ts` (schema, config gating, rate limiter), `tests/unit/contact-action.test.ts` (unconfigured refusal, validation errors, honeypot, rate limit, delivery success/failure with mocked `resend` and `next/headers`).
- E2E: `content-pages.spec.ts` (contact unconfigured state, résumé not-published state), `accessibility.spec.ts` (`/contact`).
- Executed 2026-09-29: passing. Live Resend delivery has **not** been exercised (no credentials).

## 11. Current status

**Implemented.** Form disabled in every environment until Resend variables are provided; résumé PDF absent.

## 12. Future improvements

- Shared rate-limit store if the site ever runs more than one replica.
- Optional Turnstile if spam volume warrants it.

## 13. Update history

- 2026-09-29 — Initial documentation.
