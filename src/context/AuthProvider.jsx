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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await refreshUserProfile(session.user.id, session.user.email);
      } else {
        // If no supabase session, check if it was a master login
        const masterData = localStorage.getItem('incent_auth_user');
        if (masterData) {
            const parsed = JSON.parse(masterData);
            if (!parsed.isMaster) {
                // Not master and no session? Logout.
                persistUser(null);
            }
        } else {
            persistUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#F97316' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid rgba(249,115,22,0.1)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '20px', fontWeight: '900', letterSpacing: '2px', fontSize: '0.8rem' }}>RESTORING SESSION...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;