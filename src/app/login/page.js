import Link from "next/link";

const cardClass = "flex flex-col justify-between border border-gray-200 bg-white p-7 transition hover:border-black sm:p-8";
const buttonClass = "inline-flex items-center justify-center bg-black px-4 py-3 text-xs font-semibold text-white transition hover:bg-gray-800";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-white px-6 py-8 text-black selection:bg-black selection:text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-gray-500 transition hover:text-black">
          ← BACK_TO_HOME
        </Link>
        <span className="text-xs font-mono text-gray-400">CAMPUS TRANSIT · ACCOUNT ACCESS</span>
      </div>

      <div className="mx-auto my-auto w-full max-w-5xl py-12">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Welcome</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose how you’ll use CampusTransit.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">Clients can sign in or create an account to plan a trip. Drivers can sign in to their assigned shuttle workspace.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className={cardClass}>
            <div>
              <div className="mb-7 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">CLIENT PORTAL</span>
                <span className="bg-gray-100 px-2 py-1 text-xs font-mono font-bold">RIDER</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Plan a campus trip</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">Search campus shuttle routes, check seating, and find last-mile rides.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/client/login" className={buttonClass}>Client sign in →</Link>
              <Link href="/signup" className="inline-flex items-center justify-center border border-gray-300 px-4 py-3 text-xs font-semibold transition hover:border-black">Create client account</Link>
            </div>
          </section>

          <section className={cardClass}>
            <div>
              <div className="mb-7 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">DRIVER PORTAL</span>
                <span className="bg-gray-100 px-2 py-1 text-xs font-mono font-bold">OPERATOR</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Manage shuttle operations</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">Start trips, update stop progress and passenger counts, and report delays.</p>
            </div>
            <div className="mt-8">
              <Link href="/driver/login" className={buttonClass}>Driver sign in →</Link>
              <p className="mt-3 text-xs leading-5 text-gray-500">Driver accounts are assigned by the transport team.</p>
            </div>
          </section>
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-5xl justify-between border-t border-gray-100 pt-6 text-xs font-mono text-gray-400">
        <span>CampusTransit Systems</span>
        <span>ACCOUNT ACCESS</span>
      </footer>
    </main>
  );
}
