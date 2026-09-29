import "server-only";

import { z } from "zod";

/**
 * Contact form delivery boundary.
 *
 * The form is only enabled when every delivery variable is present. Without
 * them the page shows direct contact links instead and the server action
 * refuses submissions, so the site never pretends a message was sent.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(200, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so I have enough context to reply.")
    .max(4000, "Message is too long (4000 characters maximum)."),
  /** Honeypot. Real users never see or fill this field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

export interface ContactDeliveryConfig {
  apiKey: string;
  to: string;
  from: string;
}

export function getContactDeliveryConfig(): ContactDeliveryConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export function isContactFormEnabled(): boolean {
  return getContactDeliveryConfig() !== null;
}

/**
 * In-memory sliding-window rate limiter keyed by client address.
 *
 * Suitable for a single container. It resets when the process restarts and is
 * not shared across replicas; the deployment guide documents this.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const attempts = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 5000) {
    for (const [otherKey, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) attempts.delete(otherKey);
    }
  }
  return false;
}

export function resetRateLimiter(): void {
  attempts.clear();
}

export function fieldErrorsFromIssues(issues: z.core.$ZodIssue[]): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if ((field === "name" || field === "email" || field === "message") && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export async function deliverContactMessage(
  config: ContactDeliveryConfig,
  input: Pick<ContactInput, "name" | "email" | "message">,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { Resend } = await import("resend");
  const resend = new Resend(config.apiKey);

  const { error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo: input.email,
    subject: `Portfolio contact from ${input.name}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
  });

  if (error) {
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}
