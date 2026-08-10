import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Users,
  Handshake,
} from "lucide-react";

const Sidebar = () => {
  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "Workshops",
      icon: CalendarDays,
    },
    {
      label: "My Watchlist",
      icon: Heart,
    },
    {
      label: "Registrations",
      icon: Users,
    },
    {
      label: "Sponsors",
      icon: Handshake,
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <p className="text-lg font-bold text-slate-900">MLSC</p>
          <p className="text-xs text-slate-500">Workshop Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                item.active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-400">MLSC Workshop Portal</p>
      </div>
    </aside>
  );
};

export default Sidebar;
