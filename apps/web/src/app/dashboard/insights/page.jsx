import { useState } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { Sparkles, Brain, ArrowRight, RefreshCcw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";

function InsightsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [insights, setInsights] = useState([]);

  const { refetch, isFetching } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: async () => {
      const res = await fetch("/api/ai-insights", { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data.insights);
      return data;
    },
    enabled: false,
  });

  if (userLoading) return null;
  if (!user && !userLoading) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <Toaster position="top-right" theme="dark" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              AI Business Insights{" "}
              <Sparkles className="text-blue-500 h-6 w-6" />
            </h1>
            <p className="text-zinc-400">
              Actionable advice powered by your business data.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {isFetching ? (
              <RefreshCcw className="mr-2 animate-spin h-5 w-5" />
            ) : (
              <Brain className="mr-2 h-5 w-5" />
            )}
            {insights.length > 0 ? "Refresh Insights" : "Generate Insights"}
          </button>
        </header>

        {isFetching && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-zinc-400 animate-pulse">
              Analyzing leads and appointments...
            </p>
          </div>
        )}

        {!isFetching && insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/30">
            <Sparkles className="h-12 w-12 text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-lg mb-6">
              No insights generated yet.
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        )}

        {!isFetching && insights.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={60} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {insight.description}
                  </p>
                  <button className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors">
                    Take Action <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 border border-blue-500/10">
          <h2 className="text-xl font-bold mb-2">How AI Insights Work</h2>
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
            RoofFlow AI analyzes your recent customer interactions, lead
            statuses, and appointment velocity to identify patterns. It helps
            you focus on the highest probability leads and optimizes your
            scheduling to maximize win rates.
          </p>
        </div>
      </main>
    </div>
  );
}

export default InsightsPage;
