import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in, but account is pending approval
  if (user.status === 'pending' || user.role === 'pending') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)', color: '#fff' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <h2 style={{ color: 'var(--status-warning)', marginBottom: '10px' }}>Approval Pending</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your request to join INCENT OS has been sent.<br/>Please wait for the Super Admin to approve your account.</p>
          <button onClick={() => window.location.href = '/login'} style={{ marginTop: '20px', padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  // Route requires Admin/Super Admin
  if (requireAdmin && user.role !== 'super_admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
