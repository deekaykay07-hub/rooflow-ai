import {
  LayoutDashboard,
  Users,
  Calendar,
  Lightbulb,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Leads", icon: Users, href: "/dashboard/leads" },
    {
      name: "Appointments",
      icon: "/dashboard/appointments",
      iconComp: Calendar,
    },
    { name: "AI Insights", icon: "/dashboard/insights", iconComp: Lightbulb },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-zinc-900 p-2 text-zinc-100 md:hidden border border-zinc-800"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-zinc-800 px-6">
            <span className="text-xl font-bold text-white tracking-tight">
              RoofFlow <span className="text-blue-500">AI</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.iconComp || item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href || "#"}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="border-t border-zinc-800 p-4">
            <a
              href="/account/logout"
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-950/20 hover:text-red-400"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
