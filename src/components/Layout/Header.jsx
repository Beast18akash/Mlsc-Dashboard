import { Menu, Bell, Sun } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-20 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <p className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          MLSC <span className="font-normal text-slate-500">Admin Portal</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
        </button>

        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-label="Toggle theme"
        >
          <Sun size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;
