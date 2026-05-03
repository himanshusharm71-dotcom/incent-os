import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthProvider";

import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Tasks from "./pages/Tasks";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Meetings from "./pages/Meetings";
import Files from "./pages/Files";
import Communication from "./pages/Communication";
import Analytics from "./pages/Analytics";
import ApprovalQueue from "./pages/ApprovalQueue";
import AuditLog from "./pages/AuditLog";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import WingPortal from "./pages/WingPortal";

function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  return isAdmin ? <Dashboard /> : <WingPortal />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout wrapper */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/files" element={<Files />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Admin Only Routes */}
          <Route path="/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
          <Route path="/approvals" element={<ProtectedRoute requireAdmin={true}><ApprovalQueue /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute requireAdmin={true}><AuditLog /></ProtectedRoute>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;