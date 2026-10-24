"use client"

import { useState } from "react"

type FormStatus = "idle" | "submitting" | "success" | "error"

const inputClassName =
  "w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [feedback, setFeedback] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus("submitting")
    setFeedback("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus("error")
        setFeedback(data.error || "Something went wrong. Please try again.")
        return
      }

      form.reset()
      setStatus("success")
      setFeedback(data.message || "Thanks! Your message has been sent.")
    } catch {
      setStatus("error")
      setFeedback("Network error. Please check your connection and try again.")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Your Name</label>
          <input id="name" name="name" type="text" required minLength={2} maxLength={100} placeholder="John Doe" className={inputClassName} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input id="email" name="email" type="email" required maxLength={254} placeholder="john@example.com" className={inputClassName} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
        <input id="subject" name="subject" type="text" required maxLength={200} placeholder="How can we help?" className={inputClassName} />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={5} required minLength={10} maxLength={5000} placeholder="Tell us what's on your mind..." className={inputClassName} />
      </div>

      {feedback && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}
        >
          {feedback}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-6 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}
