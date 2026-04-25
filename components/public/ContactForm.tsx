"use client";

import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const serviceOptions = [
  "Cloud & DevOps Engineering",
  "Platform Engineering",
  "Kubernetes & Containers",
  "CI/CD Pipelines",
  "Infrastructure as Code",
  "Site Reliability & Observability",
  "DevSecOps",
  "Database Operations",
  "Cloud Migration",
  "Fractional DevOps Lead",
  "Other / Not sure yet",
];

const inputBase =
  "w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors bg-[var(--surface)] border text-[var(--text)] placeholder:text-[var(--text-4)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30";

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm({ name: "", email: "", company: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card glow-ring p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)] text-2xl">
          ✓
        </div>
        <h3 className="mt-5 text-xl font-semibold text-[var(--text)] tracking-tight">
          Message received
        </h3>
        <p className="mt-3 text-[var(--text-3)]">
          Thanks for getting in touch. I&apos;ll respond within 1–2 business
          days.
        </p>
      </div>
    );
  }

  const borderClass = (hasError: boolean) =>
    hasError ? "border-[var(--rose)]/60" : "border-[var(--border)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" htmlFor="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`${inputBase} ${borderClass(!!errors.name)}`}
          />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={`${inputBase} ${borderClass(!!errors.email)}`}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            placeholder="Your company"
            className={`${inputBase} ${borderClass(false)}`}
          />
        </Field>
        <Field label="What do you need?" htmlFor="service">
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className={`${inputBase} ${borderClass(false)} appearance-none`}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" htmlFor="message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={7}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about what you're trying to build, fix, or untangle..."
          className={`${inputBase} ${borderClass(!!errors.message)} resize-y`}
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-[var(--rose)]">
          Something went wrong. Please try again or email me directly at
          hello@narendrapandrinki.com.
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <p className="font-mono text-xs text-[var(--text-4)]">
          Replies within 1–2 business days.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--text-3)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-[var(--rose)]">{error}</p>
      )}
    </div>
  );
}
