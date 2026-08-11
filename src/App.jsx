import { useState } from "react";
import { NotificationProvider } from "./context/NotificationContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";

/**
 * App
 *
 * Provider order (outermost → innermost):
 *   ThemeProvider       — applies dark class to <html>, no deps on other contexts
 *   NotificationProvider
 *   WatchlistProvider
 *   Dashboard           — owns activeView navigation state
 *
 * Views:
 *   "dashboard"     — overview: live metrics + upcoming workshop preview
 *   "workshops"     — full workshop management table with F4 search/filter/sort
 *   "watchlist"     — My Watchlist (watchlisted workshops only)
 *   "registrations" — 3-step workshop registration flow (Feature 6)
 */
function App() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <ThemeProvider>
      <NotificationProvider>
        <WatchlistProvider>
          <Dashboard activeView={activeView} onNavigate={setActiveView} />
        </WatchlistProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
