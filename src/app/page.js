const modules = [
  {
    number: "01",
    icon: "🚌",
    title: "Student Transport",
    description:
      "Explore campus routes, find shuttle stops, and check estimated arrival times.",
    href: "/student",
    label: "Explore transport",
  },
  {
    number: "02",
    icon: "🧭",
    title: "Shuttle Operations",
    description:
      "Manage shuttle trips, update route progress, and report passenger crowd levels.",
    href: "/driver",
    label: "Open operations",
  },
  {
    number: "03",
    icon: "🛺",
    title: "Last-Mile Transport",
    description:
      "Discover available autos and e-rickshaws, pickup points, and estimated fares.",
    href: "/last-mile",
    label: "Find a ride",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-2xl">
              🚌
            </span>

            <span>
              <span className="block text-lg font-bold tracking-tight">
                CampusTransit
              </span>
              <span className="block text-xs text-slate-500">
                Your campus, connected.
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#services" className="hover:text-emerald-700">
              Services
            </a>
            <a href="#about" className="hover:text-emerald-700">
              About
            </a>
            <a
              href="/student"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
            >
              Find a shuttle →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Smarter campus mobility
          </span>

          <h1 className="mt-7 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Less waiting.
            <span className="block text-emerald-700">
              More moving.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Know where your campus shuttle is, when it is expected to arrive,
            and what ride options are available for the rest of your journey.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/student"
              className="rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Plan your journey →
            </a>

            <a
              href="#services"
              className="rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold transition hover:bg-slate-100"
            >
              Explore services
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Shuttle information · Route discovery · Last-mile options
          </p>
        </div>

        {/* Hero illustration */}
        <div className="relative overflow-hidden rounded-3xl bg-emerald-900 p-8 text-white shadow-xl sm:p-12">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-700/60" />
          <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-teal-700/50" />

          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-200">
              Your daily campus commute
            </p>

            <div className="my-12 text-center">
              <span className="text-8xl sm:text-9xl">🚌</span>
              <p className="mt-5 text-xl font-semibold">
                Your journey starts here
              </p>
              <p className="mt-2 text-sm text-emerald-100">
                One place for campus transport information
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center">
                <span className="text-2xl">📍</span>
                <p className="mt-2 text-xs font-medium sm:text-sm">
                  Find routes
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center">
                <span className="text-2xl">⏱️</span>
                <p className="mt-2 text-xs font-medium sm:text-sm">
                  Check ETA
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center">
                <span className="text-2xl">🛺</span>
                <p className="mt-2 text-xs font-medium sm:text-sm">
                  Find rides
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Our services
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to get moving
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Three connected services designed to make campus transportation
              easier for students and more manageable for shuttle operators.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.number}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                    {module.icon}
                  </span>

                  <span className="text-sm font-bold text-slate-400">
                    {module.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold">
                  {module.title}
                </h3>

                <p className="mt-3 min-h-20 leading-7 text-slate-600">
                  {module.description}
                </p>

                <a
                  href={module.href}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 transition group-hover:gap-3"
                >
                  {module.label} <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-slate-900 px-7 py-12 text-white sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
            Built around your journey
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
            Make informed travel decisions before you leave.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            CampusTransit brings shuttle operations, student journey
            information, and last-mile transport options together in one
            connected platform.
          </p>

          <a
            href="/student"
            className="mt-8 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
          >
            Get started →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CampusTransit</p>
          <p>Waiting for the Shuttle · Campus Transport Management</p>
        </div>
      </footer>
    </main>
  );
}
