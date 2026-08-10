import { Menu, Bell, Sun } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm font-medium text-slate-500">
            MLSC Management
          </p>

          <h1 className="text-lg font-semibold text-slate-900">
            Workshop & Sponsor Console
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle theme"
        >
          <Sun size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
