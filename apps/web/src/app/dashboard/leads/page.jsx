import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Filter,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";

function LeadsPage() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    status: "new",
  });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetch("/api/leads").then((res) => res.json()),
  });

  const createLeadMutation = useMutation({
    mutationFn: (lead) =>
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      setIsModalOpen(false);
      setNewLead({ name: "", email: "", phone: "", notes: "", status: "new" });
      toast.success("Lead created successfully");
    },
  });

  if (userLoading) return null;
  if (!user && !userLoading) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm),
  );

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <Toaster position="top-right" theme="dark" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Leads Management</h1>
            <p className="text-zinc-400">
              Track and manage your roofing prospects.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Lead
          </button>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Added
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-blue-500/10 text-blue-500"
                          : lead.status === "won"
                            ? "bg-green-500/10 text-green-500"
                            : lead.status === "lost"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                      {lead.email && (
                        <Mail
                          size={16}
                          title={lead.email}
                          className="cursor-pointer hover:text-zinc-100"
                        />
                      )}
                      {lead.phone && (
                        <Phone
                          size={16}
                          title={lead.phone}
                          className="cursor-pointer hover:text-zinc-100"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-zinc-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && !isLoading && (
            <div className="py-12 text-center text-zinc-500">
              No leads found. Try a different search.
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-6">Add New Lead</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createLeadMutation.mutate(newLead);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) =>
                        setNewLead({ ...newLead, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={newLead.phone}
                      onChange={(e) =>
                        setNewLead({ ...newLead, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Status
                  </label>
                  <select
                    value={newLead.status}
                    onChange={(e) =>
                      setNewLead({ ...newLead, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Notes
                  </label>
                  <textarea
                    value={newLead.notes}
                    onChange={(e) =>
                      setNewLead({ ...newLead, notes: e.target.value })
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
                    Create Lead
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

export default LeadsPage;
