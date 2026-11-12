"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDriverId, getDrivers, setCurrentDriverId } from "@/lib/mockStore";

export default function DriverLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (getCurrentDriverId()) router.replace("/driver");
  }, [router]);

  function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");

    const driver = getDrivers().find((item) =>
      item.email.toLowerCase() === email.trim().toLowerCase()
      && item.password === password,
    );

    if (!driver) {
      setErrorMessage("Email or password is incorrect.");
      return;
    }

    setCurrentDriverId(driver.id);
    router.push("/driver");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-10 text-gray-900">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gray-950 p-10 text-white md:flex">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-2xl">🚌</span>
            <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-gray-300">CampusTransit</p>
            <h1 className="mt-3 text-3xl font-bold">Driver operations</h1>
            <p className="mt-4 leading-7 text-gray-300">Sign in to manage your assigned shuttle, trip progress, and incident reports.</p>
          </div>
          <p className="text-sm text-gray-400">Demonstration login · Local mock data</p>
        </div>

        <div className="p-7 sm:p-10">
          <p className="text-sm font-semibold text-black">DRIVER MODULE</p>
          <h2 className="mt-2 text-2xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">Use one of the demonstration driver accounts.</p>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <label className="block text-sm font-medium">Email address
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black focus:ring-2 focus:ring-gray-100" placeholder="name@university.edu" />
            </label>
            <label className="block text-sm font-medium">Password
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black focus:ring-2 focus:ring-gray-100" placeholder="Enter your password" />
            </label>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            <button type="submit" className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800">Sign in to driver workspace</button>
          </form>

          <div className="mt-7 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Demo credentials</p>
            <p className="mt-2 text-sm text-gray-700">rahul@university.edu <span className="text-gray-400">·</span> 123456</p>
            <p className="mt-1 text-xs text-gray-500">All three demo drivers use password 123456.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
