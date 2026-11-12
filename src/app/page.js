
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
            <span className="text-xl">🚌</span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CampusTransit
            </h1>
            <p className="text-xs text-gray-500">
              Campus mobility, simplified.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a href="#about" className="text-sm text-gray-600 hover:text-black">
            About
          </a>

          <a
            href="/login"
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Get Started →
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-8 py-24 md:grid-cols-2">

        {/* Left Content */}
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Smart Campus Transportation
          </p>

          <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Your campus.
            <br />
            Your route.
            <br />
            <span className="text-gray-400">Your journey.</span>
          </h2>

          <p className="mt-7 max-w-lg text-lg leading-8 text-gray-600">
            Find campus shuttle routes, check arrival times,
            monitor passenger capacity, and plan your journey
            without unnecessary waiting.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/login"
              className="rounded-lg bg-black px-7 py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              Get Started →
            </a>

            <a
              href="#about"
              className="rounded-lg border border-gray-300 px-7 py-4 font-semibold transition hover:bg-gray-100"
            >
              Learn More
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Shuttle information · Route discovery · Last-mile options
          </p>
        </div>

        {/* Right Content */}
        <div className="flex min-h-[380px] items-center justify-center rounded-2xl bg-gray-100 p-10">
          <div className="text-center">
            <div className="mb-6 text-8xl">🚌</div>

            <h3 className="text-2xl font-bold">
              Move around campus.
            </h3>

            <p className="mt-3 max-w-sm text-gray-500">
              Everything you need to plan your campus commute
              in one place.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl">📍</div>
                <p className="mt-2 text-xs font-medium">Find Routes</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl">⏱️</div>
                <p className="mt-2 text-xs font-medium">Check ETA</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl">🚐</div>
                <p className="mt-2 text-xs font-medium">Find Rides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="border-t border-gray-200 bg-gray-50 px-8 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            About CampusTransit
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
            Less uncertainty. Better campus journeys.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            CampusTransit connects students, shuttle drivers, and
            last-mile transport services through one platform.
            Students can discover routes and check shuttle availability,
            while drivers can update trip progress and passenger capacity.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-8 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 CampusTransit</p>
          <p>Built for smarter campus mobility.</p>
        </div>
      </footer>

    </main>
  );
}
