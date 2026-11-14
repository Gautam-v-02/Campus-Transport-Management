"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/client/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      router.replace("/login/student");
    } catch (submitError) {
      setError(submitError.message || "Could not sign in. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-10 text-gray-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg sm:p-9">
        <Link href="/login" className="text-xs font-mono text-gray-500 hover:text-black">← ACCOUNT OPTIONS</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-gray-500">Client portal</p>
        <h1 className="mt-2 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">Sign in to plan your campus trip.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium">Email address
            <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
          </label>
          <label className="block text-sm font-medium">Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black" />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to CampusTransit? <Link href="/signup" className="font-semibold text-black underline underline-offset-4">Create a client account</Link>
        </p>
      </section>
    </main>
  );
}
