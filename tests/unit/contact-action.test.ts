import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { headersMock, sendMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
  sendMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { sendContactMessage } from "@/app/contact/actions";
import { resetRateLimiter } from "@/lib/contact";

function formDataFrom(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const validFields = {
  name: "Jane Example",
  email: "jane@example.test",
  message: "I would like to talk about a .NET and React project for our operations team.",
  website: "",
};

function configureDelivery() {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.test");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <noreply@example.test>");
}

describe("sendContactMessage", () => {
  beforeEach(() => {
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" }));
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetRateLimiter();
  });

  it("fails closed when delivery is not configured and never calls the provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const state = await sendContactMessage({ status: "idle" }, formDataFrom(validFields));
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(state.message).toMatch(/not configured/);
    }
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input without sending", async () => {
    configureDelivery();
    const state = await sendContactMessage(
      { status: "idle" },
      formDataFrom({ ...validFields, email: "nope", message: "short" }),
    );
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(state.fieldErrors?.email).toBeDefined();
      expect(state.fieldErrors?.message).toBeDefined();
    }
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently succeeds when the honeypot is filled and sends nothing", async () => {
    configureDelivery();
    const state = await sendContactMessage(
      { status: "idle" },
      formDataFrom({ ...validFields, website: "https://spam.example" }),
    );
    expect(state).toEqual({ status: "success" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("delivers a valid message with the reply-to set to the sender", async () => {
    configureDelivery();
    const state = await sendContactMessage({ status: "idle" }, formDataFrom(validFields));
    expect(state).toEqual({ status: "success" });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      to: ["inbox@example.test"],
      from: "Portfolio <noreply@example.test>",
      replyTo: "jane@example.test",
    });
  });

  it("rate limits repeated submissions from the same client", async () => {
    configureDelivery();
    for (let i = 0; i < 3; i += 1) {
      const ok = await sendContactMessage({ status: "idle" }, formDataFrom(validFields));
      expect(ok.status).toBe("success");
    }
    const limited = await sendContactMessage({ status: "idle" }, formDataFrom(validFields));
    expect(limited.status).toBe("error");
    if (limited.status === "error") {
      expect(limited.message).toMatch(/Too many messages/);
    }
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it("reports a generic error when the provider rejects the message", async () => {
    configureDelivery();
    sendMock.mockResolvedValueOnce({ data: null, error: { message: "domain not verified", name: "validation_error" } });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendContactMessage({ status: "idle" }, formDataFrom(validFields));
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(state.message).toMatch(/could not be delivered/);
      expect(state.message).not.toMatch(/domain not verified/);
    }
    consoleError.mockRestore();
  });
});
