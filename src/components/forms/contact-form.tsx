"use client";

import { CheckCircle2Icon, LoaderCircleIcon, SendIcon } from "lucide-react";
import { useActionState } from "react";

import { sendContactMessage, type ContactFormState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors ?? {} : {};

  if (state.status === "success") {
    return (
      <div role="status" className="surface-card flex items-start gap-3 p-6">
        <CheckCircle2Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="font-semibold text-foreground">Message sent</p>
          <p className="mt-1 text-sm text-foreground-secondary">Thanks for getting in touch. I will reply by email.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="surface-card relative flex flex-col gap-5 p-6 md:p-8" aria-describedby={state.status === "error" ? "form-error" : undefined}>
      <Field label="Name" name="name" type="text" autoComplete="name" required error={fieldErrors.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={fieldErrors.email} />
      <Field label="Message" name="message" as="textarea" required error={fieldErrors.message} />

      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.status === "error" ? (
        <p id="form-error" role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Your details are used only to reply to you.</p>
        <Button type="submit" size="lg" className="h-11 px-5" disabled={pending}>
          {pending ? <LoaderCircleIcon aria-hidden="true" className="animate-spin" data-icon="inline-start" /> : <SendIcon aria-hidden="true" data-icon="inline-start" />}
          {pending ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: "name" | "email" | "message";
  type?: string;
  as?: "input" | "textarea";
  autoComplete?: string;
  required?: boolean;
  error?: string;
}

function Field({ label, name, type = "text", as = "input", autoComplete, required, error }: FieldProps) {
  const errorId = `${name}-error`;
  const className = cn(
    "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
    error && "border-destructive/60",
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-muted-foreground"> (required)</span> : null}
      </label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={6} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={cn(className, "min-h-36 resize-y")} />
      ) : (
        <input id={name} name={name} type={type} autoComplete={autoComplete} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={className} />
      )}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
