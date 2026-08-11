import { useState } from "react";
import { NotificationProvider } from "./context/NotificationContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import Dashboard from "./pages/Dashboard";

/**
 * App
 *
 * Owns top-level navigation state so Sidebar, Header, and the main content
 * area can all read and update it without prop-drilling through Dashboard.
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
    <NotificationProvider>
      <WatchlistProvider>
        <Dashboard activeView={activeView} onNavigate={setActiveView} />
      </WatchlistProvider>
    </NotificationProvider>
  );
}

export default App;
