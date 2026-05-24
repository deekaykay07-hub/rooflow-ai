import useUser from "@/utils/useUser";

function HomePage() {
  const { data: user, loading } = useUser();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <nav className="flex items-center justify-between px-6 py-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            RoofFlow <span className="text-blue-500">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <a
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all"
            >
              Go to Dashboard
            </a>
          ) : (
            <>
              <a
                href="/account/signin"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>

      <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          The Intelligent Operating <br className="hidden md:block" /> System
          for Roofers
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Manage leads, automate appointments, and get AI-powered insights to
          grow your roofing business faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/account/signup"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
          >
            Start Free Trial
          </a>
          <button className="w-full sm:w-auto rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-4 text-lg font-bold text-white hover:bg-zinc-800 transition-all">
            Watch Demo
          </button>
        </div>
      </section>

      <section className="px-6 py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Lead Management
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Never lose a customer again. Track every prospect from initial
                call to final invoice in a professional pipeline.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Smart Appointments
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Streamline site visits and estimates. Our automated scheduling
                keeps your crew on time and your customers happy.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Insights</h3>
              <p className="text-zinc-400 leading-relaxed">
                Get high-level analysis of your sales performance. Identify
                bottlenecks and opportunities with machine learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 border-t border-zinc-800 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-zinc-500 text-sm">
          © 2026 RoofFlow AI. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
