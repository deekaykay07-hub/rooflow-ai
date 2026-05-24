import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function DashboardHome() {
  const { data: user, loading: userLoading } = useUser();

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetch("/api/leads").then((res) => res.json()),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetch("/api/appointments").then((res) => res.json()),
  });

  if (userLoading) return null;
  if (!user && !userLoading) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  const stats = [
    {
      name: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Appointments",
      value: appointments.length,
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "New Leads (7d)",
      value: leads.filter(
        (l) =>
          new Date(l.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).length,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      name: "Business",
      value: user.business_name || "Roofing Pro",
      icon: DollarSign,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name || "User"}
          </h1>
          <p className="text-zinc-400">
            Here's what's happening with your business today.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg ${stat.bg} p-2`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Leads */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Leads</h2>
              <a
                href="/dashboard/leads"
                className="text-sm text-blue-500 hover:underline"
              >
                View all
              </a>
            </div>
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-zinc-400">
                      {lead.phone || lead.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      lead.status === "new"
                        ? "bg-blue-500/10 text-blue-500"
                        : lead.status === "won"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </div>
              ))}
              {leads.length === 0 && (
                <p className="text-zinc-500 text-center py-4">No leads yet.</p>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <a
                href="/dashboard/appointments"
                className="text-sm text-blue-500 hover:underline"
              >
                View all
              </a>
            </div>
            <div className="space-y-4">
              {appointments.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 border-b border-zinc-800 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-800 px-3 py-2 min-w-[60px]">
                    <span className="text-xs text-zinc-400 uppercase">
                      {new Date(app.scheduled_at).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold">
                      {new Date(app.scheduled_at).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{app.title}</p>
                    <p className="text-sm text-zinc-400">
                      {new Date(app.scheduled_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {app.lead_name || "No lead"}
                    </p>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-zinc-500 text-center py-4">
                  No appointments scheduled.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardHome;
