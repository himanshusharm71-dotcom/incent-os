import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ROLE_LEVELS = {
  super_admin: 4,
  admin: 3,
  leader: 2,
  deputy_leader: 2,
  member: 1,
  pending: 0
};

// Pages accessible by everyone who is logged in
const COMMON_PATHS = ['/', '/team', '/tasks', '/leaderboard', '/meetings', '/files', '/communication'];
// Pages only for admin+
const ADMIN_PATHS = ['/approvals', '/analytics', '/audit'];

function ProtectedRoute({ children, requireAdmin = false, requireLeader = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249,115,22,0.3)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Pending approval
  if (user.status === 'pending' || user.role === 'pending') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-light)', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: 'var(--status-warning)', marginBottom: '10px' }}>Approval Pending</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Your account is pending activation. Please contact the admin.</p>
          <button onClick={() => window.location.href = '/login'} style={{ marginTop: '1.5rem', padding: '10px 24px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const roleLevel = ROLE_LEVELS[user.role] ?? 1;

  // Admin-only routes: require admin (level 3+)
  if (requireAdmin && roleLevel < 3) {
    return <Navigate to="/" replace />;
  }

  // Leader-only routes: require leader (level 2+)
  if (requireLeader && roleLevel < 2) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
