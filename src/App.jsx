import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <NotificationProvider>
      <Dashboard />
    </NotificationProvider>
  );
}

export default App;
