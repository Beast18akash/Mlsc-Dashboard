import { createContext, useContext } from "react";
import useWatchlist from "../hooks/useWatchlist";

/**
 * WatchlistContext
 *
 * Provides watchlist state and actions to the entire component tree.
 * Thin wrapper around useWatchlist — the logic lives in the hook.
 *
 * Consumed by:
 *   - WorkshopTable  (Heart toggle button per row)
 *   - Sidebar        (count badge + active nav state)
 *   - Header         (count badge on mobile)
 */
const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const watchlist = useWatchlist();

  return (
    <WatchlistContext.Provider value={watchlist}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlistContext = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlistContext must be used within a WatchlistProvider");
  }
  return context;
};
