
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-black">

      <div className="w-full max-w-3xl">

        {/* Back to homepage */}
        <a
          href="/"
          className="text-sm text-gray-500 transition hover:text-black"
        >
          ← Back to homepage
        </a>

        {/* Heading */}
        <div className="mb-12 mt-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to CampusTransit
          </h1>

          <p className="mt-3 text-gray-500">
            Choose how you want to continue.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Student Card */}
          <a
            href="/login/student"
            className="group rounded-2xl border border-gray-200 p-8 transition hover:border-black hover:shadow-lg"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-3xl transition group-hover:bg-black group-hover:text-white">
              🎓
            </div>

            <h2 className="text-2xl font-bold">
              I'm a Student
            </h2>

            <p className="mt-3 min-h-16 leading-7 text-gray-500">
              Find shuttle routes, select your pickup and destination,
              check arrival times, and monitor shuttle capacity.
            </p>

            <div className="mt-8 flex items-center justify-between">
              <span className="font-semibold">
                Continue as Student
              </span>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>

          {/* Driver Card */}
          <a
            href="/login/driver"
            className="group rounded-2xl border border-gray-200 p-8 transition hover:border-black hover:shadow-lg"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-3xl transition group-hover:bg-black group-hover:text-white">
              🚌
            </div>

            <h2 className="text-2xl font-bold">
              I'm a Driver
            </h2>

            <p className="mt-3 min-h-16 leading-7 text-gray-500">
              View assigned shuttles, manage trips, update your
              current stop, and report passenger capacity.
            </p>

            <div className="mt-8 flex items-center justify-between">
              <span className="font-semibold">
                Continue as Driver
              </span>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>

        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-sm text-gray-400">
          CampusTransit · Campus mobility, simplified.
        </p>

      </div>
    </main>
  );
}
