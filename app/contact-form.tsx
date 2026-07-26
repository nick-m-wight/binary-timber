"use client";

import { useRef, useState } from "react";

type MessageState = { text: string; error: boolean } | null;

/**
 * Contact form — ports the submit handler from the old static js/main.js.
 * Posts JSON to /api/contact and shows an inline status message.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setSubmitting(true);
    setMessage(null);

    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: "// Message received. We'll be in touch.", error: false });
        form.reset();
      } else {
        setMessage({ text: "// Something went wrong. Please try again.", error: true });
      }
    } catch {
      setMessage({ text: "// Network error. Please email us directly.", error: true });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 6000);
    }
  }

  const messageClass = message
    ? `form-message show${message.error ? " error" : ""}`
    : "form-message";

  return (
    <form
      className="reveal"
      id="contactForm"
      aria-label="Contact form"
      onSubmit={handleSubmit}
      noValidate
      ref={formRef}
    >
      {/* Honeypot: hidden from real users, catches bots */}
      <input
        type="checkbox"
        name="botcheck"
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required autoComplete="name" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="interest">Division of Interest</label>
        <select id="interest" name="interest" defaultValue="AI Software">
          <option>AI Software</option>
          <option>CNC Manufacturing</option>
          <option>Both / General Inquiry</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Inquiry →"}
      </button>
      <div className={messageClass} id="formMessage" role="status" aria-live="polite">
        {message?.text ?? ""}
      </div>
    </form>
  );
}
