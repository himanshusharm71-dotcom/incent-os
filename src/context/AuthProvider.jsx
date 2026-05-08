import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync user to local storage for persistence on reloads
  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem('incent_auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('incent_auth_user');
    }
    setUser(userData);
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // 1. Try local cache FIRST for instant UI
      const cached = localStorage.getItem('incent_auth_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch (e) { localStorage.removeItem('incent_auth_user'); }
      }

      // 2. Verify with Supabase Session
      const sessionTimeout = setTimeout(() => {
        console.warn("⚠️ Auth sync taking too long... forcing boot.");
        setLoading(false);
      }, 5000); // 5 second safety limit

      try {
        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(sessionTimeout);
        
        if (session?.user) {
          await refreshUserProfile(session.user.id, session.user.email);
        } else {
          const masterData = localStorage.getItem('incent_auth_user');
          if (masterData) {
              const parsed = JSON.parse(masterData);
              if (!parsed.isMaster) persistUser(null);
          } else {
              persistUser(null);
          }
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
        clearTimeout(sessionTimeout);
      }
      
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes (Login/Logout/Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth Event:", event);
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        await refreshUserProfile(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        persistUser(null);
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const refreshUserProfile = async (uid, email) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', uid).single();
      if (!error && data) {
        persistUser({ uid, email, ...data });
      } else {
        // Auth exists but no profile table entry yet
        persistUser({ uid, email, Name: email.split('@')[0], role: 'member', status: 'active' });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const login = async (email, password) => {
    const MASTER_EMAIL = '2024cshimanshu16902@poornima.edu.in';
    const MASTER_PASS = 'himanshu9001';

    if (email === MASTER_EMAIL && password === MASTER_PASS) {
      const masterUser = { 
        uid: 'master-admin-001', 
        email: MASTER_EMAIL, 
        Name: 'Himanshu Sharma', 
        role: 'super_admin', 
        team: 'Core', 
        status: 'active', 
        isMaster: true 
      };
      persistUser(masterUser);
      return { user: masterUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading && !user ? (
        <div style={{ 
          height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', background: '#020617', color: 'var(--accent-primary)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Neural Orbits */}
          <div style={{ position: 'absolute', width: '300px', height: '300px', border: '1px solid rgba(249,115,22,0.1)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
          <div style={{ position: 'absolute', width: '200px', height: '200px', border: '1px dashed rgba(249,115,22,0.2)', borderRadius: '50%', animation: 'spin 6s linear reverse infinite' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', border: '3px solid rgba(249,115,22,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem', boxShadow: '0 0 30px rgba(249,115,22,0.2)' }}></div>
            <p style={{ fontWeight: '900', letterSpacing: '6px', fontSize: '1rem', margin: 0, textShadow: '0 0 10px rgba(249,115,22,0.4)' }}>RESTORING NEURAL LINK</p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '10px', fontWeight: '800', letterSpacing: '2px' }}>DECRYPTING SESSION DATA...</p>
          </div>
          
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;