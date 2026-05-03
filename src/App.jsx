import React from "react";
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

// 🛡️ ERROR BOUNDARY COMPONENT
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: '#F97316', fontSize: '2.5rem', marginBottom: '1rem' }}>Oops! Kernel Panic</h1>
          <p style={{ color: '#64748B', marginBottom: '2rem' }}>A minor glitch occurred in the system core. Don't worry, your data is safe.</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ background: '#F97316', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(249,115,22,0.2)' }}
          >
            RESET & REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  return isAdmin ? <Dashboard /> : <WingPortal />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Layout wrapper */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/portal/:teamName" element={<WingPortal preview={true} />} />
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
    </ErrorBoundary>
  );
}

export default App;