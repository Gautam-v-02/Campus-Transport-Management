"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create your account.");
      router.replace("/login/student");
    } catch (submitError) {
      setError(submitError.message || "Could not create your account. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-10 text-gray-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg sm:p-9">
        <Link href="/login" className="text-xs font-mono text-gray-500 hover:text-black">← ACCOUNT OPTIONS</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-gray-500">Client portal</p>
        <h1 className="mt-2 text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">Sign up to access campus transport and last-mile rides.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium">Full name
            <input name="name" autoComplete="name" required minLength={2} maxLength={80} value={form.name} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
          </label>
          <label className="block text-sm font-medium">Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
          </label>
          <label className="block text-sm font-medium">Phone <span className="font-normal text-gray-400">(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={24} value={form.phone} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
          </label>
          <label className="block text-sm font-medium">Password
            <input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={form.password} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
            <span className="mt-1 block text-xs font-normal text-gray-500">Use at least 8 characters.</span>
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
            {submitting ? "Creating account…" : "Create client account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered? <Link href="/client/login" className="font-semibold text-black underline underline-offset-4">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
