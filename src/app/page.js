'use client';

import { useState } from 'react';

export default function Home() {
  const [pickup, setPickup] = useState('Boys Hostel');
  const [dropoff, setDropoff] = useState('Main Gate');

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-black text-white text-xs font-mono font-bold tracking-tighter">
            CT
          </div>
          <span className="font-semibold tracking-tight text-sm">
            CampusTransit
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/last-mile"
            className="text-xs font-medium text-gray-600 hover:text-black transition"
          >
            Last-mile rides
          </a>
          <a href="#about" className="text-xs font-medium text-gray-500 hover:text-black transition">
            About
          </a>
          <a
            href="/login"
            className="bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition"
          >
            Get Started →
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pt-20 pb-32 md:grid-cols-2">

        {/* Left Content */}
        <div>
          <div className="inline-block border border-gray-200 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-6">
            System v1.0
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] md:text-6xl">
            Campus mobility, <br />
            <span className="text-gray-400">reimagined.</span>
          </h1>

          <p className="mt-6 text-base text-gray-600 max-w-md leading-relaxed">
            Real-time shuttle tracking, capacity monitoring, and seamless route discovery built for your university commute.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="/login"
              className="bg-black text-white px-6 py-3 text-xs font-medium hover:bg-gray-800 transition"
            >
              Get Started →
            </a>
            <a
              href="#about"
              className="border border-gray-200 px-6 py-3 text-xs font-medium text-gray-600 hover:text-black hover:border-black transition"
            >
              System Specs
            </a>
            <a
              href="/last-mile"
              className="border border-gray-200 px-6 py-3 text-xs font-medium text-gray-600 hover:text-black hover:border-black transition"
            >
              Browse Last-mile Rides →
            </a>
          </div>
        </div>

        {/* Right Interactive Quick Route Planner */}
        <div className="border border-gray-200 bg-gray-50 p-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">
              Quick Route Planner
            </span>
            <span className="text-[11px] font-mono text-gray-400">INTERACTIVE</span>
          </div>

          <div className="space-y-4">
            {/* Pickup Field (Editable) */}
            <div className="bg-white border border-gray-200 p-3.5 focus-within:border-black transition">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Pickup Location
              </label>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 bg-black flex-shrink-0"></span>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location..."
                  className="w-full text-sm font-medium text-black bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Drop-off Field (Editable) */}
            <div className="bg-white border border-gray-200 p-3.5 focus-within:border-black transition">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Drop-off Location
              </label>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 border border-black flex-shrink-0"></span>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter drop-off location..."
                  className="w-full text-sm font-medium text-black bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Action CTA */}
            <a
              href="/login"
              className="block w-full bg-black text-white text-center py-3.5 text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition"
            >
              Find Available Shuttles →
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-200 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Architecture</span>
          <h2 className="text-2xl font-bold tracking-tight mt-2 mb-6">
            Engineered for high campus throughput.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600">
            <div>
              <strong className="text-black block mb-1">01. Route Discovery</strong>
              Instantly find valid pathways between campus stops and buildings without unnecessary waits.
            </div>
            <div>
              <strong className="text-black block mb-1">02. Capacity Tracking</strong>
              Live crowd levels and seat counters reported directly by shuttle operators.
            </div>
            <div>
              <strong className="text-black block mb-1">03. Last-Mile Synced</strong>
              Integrated e-rickshaw and auto availability feeds for complete trip coverage.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6">
        <div className="mx-auto flex max-w-7xl justify-between items-center text-xs text-gray-400 font-mono">
          <p>© 2026 CampusTransit Systems</p>
          <p>STABLE_BUILD_OK</p>
        </div>
      </footer>

    </main>
  );
}
