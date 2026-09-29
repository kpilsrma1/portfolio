import { afterEach, describe, expect, it, vi } from "vitest";

import {
  contactSchema,
  fieldErrorsFromIssues,
  getContactDeliveryConfig,
  isContactFormEnabled,
  isRateLimited,
  resetRateLimiter,
} from "@/lib/contact";

const validInput = {
  name: "Jane Example",
  email: "jane@example.test",
  message: "I would like to talk about a .NET and React project for our operations team.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a well-formed submission", () => {
    const result = contactSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace from name and message", () => {
    const result = contactSchema.safeParse({
      ...validInput,
      name: "  Jane Example  ",
      message: `  ${validInput.message}  `,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Example");
      expect(result.data.message).toBe(validInput.message);
    }
  });

  it("rejects short names, invalid emails, and short messages with field-level messages", () => {
    const result = contactSchema.safeParse({
      name: "J",
      email: "not-an-email",
      message: "too short",
      website: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrorsFromIssues(result.error.issues);
      expect(errors.name).toBe("Please enter your name.");
      expect(errors.email).toBe("Please enter a valid email address.");
      expect(errors.message).toMatch(/at least 20 characters/);
    }
  });

  it("rejects oversized messages", () => {
    const result = contactSchema.safeParse({ ...validInput, message: "x".repeat(4001) });
    expect(result.success).toBe(false);
  });

  it("treats any honeypot content as invalid", () => {
    const result = contactSchema.safeParse({ ...validInput, website: "https://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "website")).toBe(true);
    }
  });
});

describe("fieldErrorsFromIssues", () => {
  it("keeps only the first message per field and ignores unknown paths", () => {
    const errors = fieldErrorsFromIssues([
      { code: "custom", path: ["name"], message: "first", input: "" },
      { code: "custom", path: ["name"], message: "second", input: "" },
      { code: "custom", path: ["website"], message: "ignored", input: "" },
    ]);
    expect(errors).toEqual({ name: "first" });
  });
});

describe("getContactDeliveryConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when any delivery variable is missing", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <noreply@example.test>");
    expect(getContactDeliveryConfig()).toBeNull();
    expect(isContactFormEnabled()).toBe(false);
  });

  it("returns the configuration when every variable is present", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <noreply@example.test>");
    expect(getContactDeliveryConfig()).toEqual({
      apiKey: "re_test",
      to: "inbox@example.test",
      from: "Portfolio <noreply@example.test>",
    });
    expect(isContactFormEnabled()).toBe(true);
  });
});

describe("isRateLimited", () => {
  afterEach(() => {
    resetRateLimiter();
  });

  it("allows three submissions per window and blocks the fourth", () => {
    const now = 1_000_000;
    expect(isRateLimited("client-a", now)).toBe(false);
    expect(isRateLimited("client-a", now + 1)).toBe(false);
    expect(isRateLimited("client-a", now + 2)).toBe(false);
    expect(isRateLimited("client-a", now + 3)).toBe(true);
  });

  it("tracks clients independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i += 1) isRateLimited("client-a", now + i);
    expect(isRateLimited("client-a", now + 10)).toBe(true);
    expect(isRateLimited("client-b", now + 10)).toBe(false);
  });

  it("releases the limit once the window has passed", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i += 1) isRateLimited("client-a", now + i);
    expect(isRateLimited("client-a", now + 10)).toBe(true);
    expect(isRateLimited("client-a", now + 10 * 60 * 1000 + 5)).toBe(false);
  });
});
