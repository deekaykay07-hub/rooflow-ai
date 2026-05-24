import { useState } from "react";
import useAuth from "@/utils/useAuth";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Couldn't start sign-in. Please try again.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        CredentialsSignin: "Incorrect email or password.",
      };
      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">RoofFlow AI</h1>
          <p className="mt-2 text-zinc-400">
            Welcome back, sign in to your dashboard
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@roofing-company.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400 border border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <a href="/account/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
