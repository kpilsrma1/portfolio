"use server";

import { headers } from "next/headers";

import {
  contactSchema,
  deliverContactMessage,
  fieldErrorsFromIssues,
  getContactDeliveryConfig,
  isRateLimited,
  type ContactField,
} from "@/lib/contact";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<ContactField, string>> };

export async function sendContactMessage(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const config = getContactDeliveryConfig();
  if (!config) {
    return {
      status: "error",
      message: "The contact form is not configured on this deployment. Please use the direct contact links instead.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromIssues(parsed.error.issues);
    const honeypotTripped = parsed.error.issues.some((issue) => issue.path[0] === "website");
    if (honeypotTripped) {
      // Silently accept so automated submitters learn nothing; nothing is sent.
      return { status: "success" };
    }
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors };
  }

  const requestHeaders = await headers();
  const clientKey = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";

  if (isRateLimited(clientKey)) {
    return {
      status: "error",
      message: "Too many messages in a short time. Please wait a few minutes and try again.",
    };
  }

  const result = await deliverContactMessage(config, parsed.data);
  if (!result.ok) {
    console.error("Contact delivery failed:", result.reason);
    return {
      status: "error",
      message: "The message could not be delivered right now. Please try again later or use the direct contact links.",
    };
  }

  return { status: "success" };
}
