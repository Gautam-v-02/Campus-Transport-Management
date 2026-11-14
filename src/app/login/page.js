import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col justify-between px-6 py-8">

      {/* Top Bar */}
      <div className="mx-auto w-full max-w-4xl flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-mono text-gray-500 hover:text-black transition flex items-center gap-2"
        >
          ← BACK_TO_HOME
        </Link>
        <span className="text-xs font-mono text-gray-400">AUTH_GATEWAY // V1.0</span>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-4xl my-auto py-12">
        <div className="mb-12">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Authentication</span>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Select access profile.
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            Choose your portal entry point to continue.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid gap-4 md:grid-cols-2">

          {/* Student Card */}
          <Link
            href="/login/student"
            className="group border border-gray-200 bg-white p-8 transition hover:border-black flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Portal 01</span>
                <span className="text-xs font-mono font-bold px-2 py-1 bg-gray-100 text-black group-hover:bg-black group-hover:text-white transition">STUDENT</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-black mb-3">
                Student Transport
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Discover active campus routes, inspect live shuttle seating capacity, and plan cross-campus journeys.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-mono font-semibold">
              <span>ACCESS_STUDENT_PORTAL</span>
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </Link>

          {/* Driver Card */}
          <Link
            href="/login/driver"
            className="group border border-gray-200 bg-white p-8 transition hover:border-black flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Portal 02</span>
                <span className="text-xs font-mono font-bold px-2 py-1 bg-gray-100 text-black group-hover:bg-black group-hover:text-white transition">DRIVER</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-black mb-3">
                Shuttle Operations
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Manage assigned vehicle runs, update current stop markers, and broadcast passenger load logs.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-mono font-semibold">
              <span>ACCESS_DRIVER_PORTAL</span>
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </Link>

        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-4xl flex justify-between items-center text-xs text-gray-400 font-mono border-t border-gray-100 pt-6">
        <p>CampusTransit Systems</p>
        <p>SECURE_SESSION</p>
      </div>

    </main>
  );
}
