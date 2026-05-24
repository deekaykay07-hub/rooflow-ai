import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pending = localStorage.getItem("pendingBusinessName");
      if (pending) setBusinessName(pending);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: businessName }),
      });
      if (res.ok) {
        localStorage.removeItem("pendingBusinessName");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        <h1 className="mb-4 text-3xl font-bold text-center">Complete Setup</h1>
        <p className="mb-8 text-zinc-400 text-center">
          Let's get your roofing business ready.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Business Name
            </label>
            <input
              required
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Go to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
