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
  "Backend Systems & APIs",
  "Internal Tools & Admin Platforms",
  "Workflow Automation",
  "Reporting & Dashboards",
  "Other / Not sure yet",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
      <div
        style={{ backgroundColor: "#f5ede0", border: "1px solid #dfc5a5" }}
        className="p-10 rounded-lg text-center"
      >
        <div style={{ color: "#5c3d1e" }} className="text-3xl mb-4">
          ✓
        </div>
        <h3 style={{ color: "#1e1208" }} className="text-xl font-semibold mb-3">
          Message received
        </h3>
        <p style={{ color: "#7d5c3a" }}>
          Thanks for getting in touch. I'll respond within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            style={{ color: "#5c3d1e" }}
            className="block text-sm font-medium mb-2"
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            style={{
              backgroundColor: "#faf7f2",
              border: `1px solid ${errors.name ? "#b45309" : "#dfc5a5"}`,
              color: "#1e1208",
            }}
            className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-[#9b7653]"
          />
          {errors.name && (
            <p style={{ color: "#b45309" }} className="text-xs mt-1">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            style={{ color: "#5c3d1e" }}
            className="block text-sm font-medium mb-2"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            style={{
              backgroundColor: "#faf7f2",
              border: `1px solid ${errors.email ? "#b45309" : "#dfc5a5"}`,
              color: "#1e1208",
            }}
            className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-[#9b7653]"
          />
          {errors.email && (
            <p style={{ color: "#b45309" }} className="text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="company"
            style={{ color: "#5c3d1e" }}
            className="block text-sm font-medium mb-2"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            placeholder="Your company"
            style={{
              backgroundColor: "#faf7f2",
              border: "1px solid #dfc5a5",
              color: "#1e1208",
            }}
            className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-[#9b7653]"
          />
        </div>
        <div>
          <label
            htmlFor="service"
            style={{ color: "#5c3d1e" }}
            className="block text-sm font-medium mb-2"
          >
            What do you need?
          </label>
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={handleChange}
            style={{
              backgroundColor: "#faf7f2",
              border: "1px solid #dfc5a5",
              color: form.service ? "#1e1208" : "#9b7653",
            }}
            className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-[#9b7653]"
          >
            <option value="">Select a service</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          style={{ color: "#5c3d1e" }}
          className="block text-sm font-medium mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about what you're trying to build or solve..."
          style={{
            backgroundColor: "#faf7f2",
            border: `1px solid ${errors.message ? "#b45309" : "#dfc5a5"}`,
            color: "#1e1208",
            resize: "vertical",
          }}
          className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2 focus:ring-[#9b7653]"
        />
        {errors.message && (
          <p style={{ color: "#b45309" }} className="text-xs mt-1">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p style={{ color: "#b45309" }} className="text-sm">
          Something went wrong. Please try again or email me directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
        className="w-full sm:w-auto px-10 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
