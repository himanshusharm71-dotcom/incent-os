import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/files" element={<Files />} />
                <Route path="/communication" element={<Communication />} />
                
                {/* Admin Only Routes */}
                <Route path="/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
                <Route path="/approvals" element={<ProtectedRoute requireAdmin={true}><ApprovalQueue /></ProtectedRoute>} />
                <Route path="/audit" element={<ProtectedRoute requireAdmin={true}><AuditLog /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;