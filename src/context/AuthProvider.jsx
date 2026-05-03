import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    const initAuth = async () => {
      try {
        // Check master session first
        const masterSession = localStorage.getItem('incent_master_session');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Real Supabase user exists -> Clean up master session and fetch profile
          localStorage.removeItem('incent_master_session');
          await fetchUserProfile(session.user.id, session.user.email);
        } else if (masterSession) {
          // No Supabase session, but master exists
          try {
            setUser(JSON.parse(masterSession));
          } catch (e) {
            localStorage.removeItem('incent_master_session');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        localStorage.removeItem('incent_master_session');
        await fetchUserProfile(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid, email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (data) {
        setUser({ uid, email, ...data });
      } else {
        // If they exist in Auth but not DB, show them as pending
        setUser({ uid, email, role: 'pending', status: 'pending' });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const login = async (email, password) => {
    const MASTER_EMAIL = '2024cshimanshu16902@poornima.edu.in';
    const MASTER_PASS = 'himanshu9001';

    if (email === MASTER_EMAIL && password === MASTER_PASS) {
      // Fetch points for master
      let realPoints = 0;
      try {
        const { data } = await supabase.from('users').select('points').eq('email', MASTER_EMAIL).single();
        if (data) realPoints = data.points;
      } catch (e) {}

      const masterUser = {
        uid: 'master-admin-001',
        email: MASTER_EMAIL,
        Name: 'Himanshu Sharma',
        role: 'super_admin',
        team: 'Core',
        status: 'active',
        points: realPoints,
        isMaster: true
      };
      setUser(masterUser);
      localStorage.setItem('incent_master_session', JSON.stringify(masterUser));
      return { user: masterUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('incent_master_session');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', color: '#F97316' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(249,115,22,0.1)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '20px', fontWeight: '600', letterSpacing: '1px' }}>INITIALIZING INCENT OS...</p>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;