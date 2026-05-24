import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Search,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";

function AppointmentsPage() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    title: "",
    lead_id: "",
    scheduled_at: "",
    duration_minutes: 60,
    description: "",
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetch("/api/appointments").then((res) => res.json()),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetch("/api/leads").then((res) => res.json()),
  });

  const createAppMutation = useMutation({
    mutationFn: (app) =>
      fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(app),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      setIsModalOpen(false);
      setNewApp({
        title: "",
        lead_id: "",
        scheduled_at: "",
        duration_minutes: 60,
        description: "",
      });
      toast.success("Appointment scheduled");
    },
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
            <h1 className="text-2xl font-bold">Roofing Schedule</h1>
            <p className="text-zinc-400">
              Manage onsite visits and project estimates.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Schedule Visit
          </button>
        </header>

        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full animate-pulse rounded-xl bg-zinc-900/50"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className="group flex flex-col md:flex-row md:items-center gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-800/30 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-blue-600/10 px-4 py-3 border border-blue-600/20">
                      <span className="text-xs font-bold text-blue-500 uppercase">
                        {new Date(app.scheduled_at).toLocaleDateString(
                          "en-US",
                          { month: "short" },
                        )}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {new Date(app.scheduled_at).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{app.title}</h3>
                      <div className="flex items-center text-sm text-zinc-400 gap-1 mt-1">
                        <Clock size={14} />
                        {new Date(app.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {app.duration_minutes} min
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-zinc-400 text-sm gap-2">
                      <User size={16} className="text-zinc-500" />
                      <span className="font-medium text-zinc-300">
                        {app.lead_name || "Individual Visit"}
                      </span>
                    </div>
                    {app.description && (
                      <div className="text-zinc-400 text-sm italic">
                        {app.description}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <button className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all">
                      Details
                    </button>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="py-20 text-center border border-zinc-800 border-dashed rounded-2xl">
                  <CalendarIcon className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">
                    No appointments scheduled for the upcoming weeks.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-6">Schedule Visit</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createAppMutation.mutate(newApp);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Appointment Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Roof Inspection - Smith Residence"
                    value={newApp.title}
                    onChange={(e) =>
                      setNewApp({ ...newApp, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Select Lead
                  </label>
                  <select
                    value={newApp.lead_id}
                    onChange={(e) =>
                      setNewApp({ ...newApp, lead_id: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">No lead associated</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Date & Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={newApp.scheduled_at}
                      onChange={(e) =>
                        setNewApp({ ...newApp, scheduled_at: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={newApp.duration_minutes}
                      onChange={(e) =>
                        setNewApp({
                          ...newApp,
                          duration_minutes: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Description / Notes
                  </label>
                  <textarea
                    value={newApp.description}
                    onChange={(e) =>
                      setNewApp({ ...newApp, description: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600 h-24"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AppointmentsPage;
